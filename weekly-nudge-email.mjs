// weekly-nudge-email.mjs — the Sunday pull.
//
// Cron handler for the weekly log: emails each opted-in owner on their
// *local* Sunday with that week's opening question. The nudge is quiet by
// contract — no streaks, no guilt framing, and a written week is never
// nudged at all.
//
// This file is deliberately self-contained plain JS: it is bundled by
// Wrangler directly (worker.mjs imports it), so it cannot use the ~ alias
// or Drizzle. It shares the question bank and context builder with the
// app by importing the dependency-free weekly-questions lib.

import {
  buildNudgeContext,
  fallbackQuestion,
  isContextEmpty,
  isQuestionFamily,
  QUESTION_FAMILIES,
  questionForFamily,
} from './src/lib/weekly-questions.ts';

const CLASSIFIER_ENDPOINT = 'https://classifier.dev/v1/classify';
const CLASSIFIER_TIMEOUT_MS = 3000;
const JOURNAL_URL = 'https://live.significanthobbies.com/journal';
const FROM = { email: 'weekly@significanthobbies.com', name: 'Live — weekly log' };

/** Today's YYYY-MM-DD and day-of-week (0=Sunday) in an IANA zone. */
function localDay(now, timeZone) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const dayKey = fmt.format(now); // en-CA yields YYYY-MM-DD
  const dow = new Date(`${dayKey}T12:00:00Z`).getUTCDay();
  return { dayKey, dow };
}

function shiftDayKey(dayKey, delta) {
  const date = new Date(`${dayKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + delta);
  return date.toISOString().slice(0, 10);
}

function weekStartFor(dayKey, weekStartsOn) {
  const dow = new Date(`${dayKey}T12:00:00Z`).getUTCDay(); // 0 = Sunday
  return weekStartsOn === 'sunday'
    ? shiftDayKey(dayKey, -dow)
    : shiftDayKey(dayKey, -((dow + 6) % 7));
}

async function loadSignals(db, userId, isSunday) {
  const staleCutoff = Math.floor(Date.now() / 1000) - 21 * 86400;
  const monthAgo = Math.floor(Date.now() / 1000) - 28 * 86400;
  const [stale, entries, commitments, dreams] = await Promise.all([
    db
      .prepare(
        `SELECT DISTINCT category FROM BucketListItem
         WHERE userId = ? AND status != 'done' AND updatedAt < ? AND category IS NOT NULL LIMIT 5`
      )
      .bind(userId, staleCutoff)
      .all(),
    db
      .prepare(`SELECT COUNT(*) AS n FROM WeeklyLogEntry WHERE userId = ? AND updatedAt > ?`)
      .bind(userId, monthAgo)
      .first('n'),
    db
      .prepare(`SELECT COUNT(*) AS n FROM Commitment WHERE userId = ? AND status != 'abandoned'`)
      .bind(userId)
      .first('n'),
    db
      .prepare(`SELECT COUNT(*) AS n FROM BucketListItem WHERE userId = ? AND status != 'done'`)
      .bind(userId)
      .first('n'),
  ]);
  return {
    staleDreamCategories: (stale.results ?? []).map((row) => row.category).filter(Boolean),
    entriesLastMonth: entries ?? 0,
    activeCommitments: commitments ?? 0,
    activeDreams: dreams ?? 0,
    isSuggestedDay: isSunday,
    turn: 0,
  };
}

/** classifier.dev pick with the deterministic rotation as the fallback. */
async function resolveQuestion(signals, weekOf) {
  if (isContextEmpty(signals)) return fallbackQuestion(weekOf);
  try {
    const response = await fetch(CLASSIFIER_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ inputs: [buildNudgeContext(signals)], labels: QUESTION_FAMILIES }),
      signal: AbortSignal.timeout(CLASSIFIER_TIMEOUT_MS),
    });
    if (!response.ok) return fallbackQuestion(weekOf);
    const body = await response.json();
    const label = body.results?.[0]?.label;
    if (typeof label !== 'string' || !isQuestionFamily(label)) return fallbackQuestion(weekOf);
    return questionForFamily(label, weekOf);
  } catch {
    return fallbackQuestion(weekOf);
  }
}

function emailText(name, weekOf, questionText) {
  return [
    `Hi ${name},`,
    '',
    'Another week is on the table.',
    '',
    `This week's question: ${questionText}`,
    '',
    'When you are ready — five quiet minutes, no streaks to protect:',
    JOURNAL_URL,
    '',
    '— Live by Significant Hobbies',
    '',
    'You are getting this because you asked for a Sunday nudge.',
    'Turn it off any time on your weekly log page.',
    `(${weekOf})`,
  ].join('\n');
}

function emailHtml(name, questionText) {
  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#fbf8ef;font-family:Georgia,serif;color:#211e18;">
  <div style="max-width:480px;margin:0 auto;background:#fffdf8;border-radius:16px;padding:32px;">
    <p style="margin:0 0 16px;font-size:15px;">Hi ${name},</p>
    <p style="margin:0 0 16px;font-size:15px;">Another week is on the table.</p>
    <p style="margin:0 0 24px;font-size:22px;font-style:italic;">${questionText}</p>
    <a href="${JOURNAL_URL}" style="display:inline-block;background:#176b4a;color:#ffffff;text-decoration:none;font-family:system-ui,sans-serif;font-weight:bold;font-size:14px;padding:12px 20px;border-radius:10px;">Write your week</a>
    <p style="margin:24px 0 0;font-size:12px;color:#625b50;font-family:system-ui,sans-serif;">
      Five quiet minutes — no streaks to protect.<br/>
      You asked for this Sunday nudge; turn it off any time on your
      <a href="${JOURNAL_URL}" style="color:#176b4a;">weekly log page</a>.
    </p>
  </div>
</body></html>`;
}

/**
 * Send the Sunday nudge to every opted-in owner whose local day is Sunday
 * and whose current week has no entry yet.
 */
export async function sendWeeklyNudges(env) {
  let results;
  try {
    ({ results } = await env.DB.prepare(
      `SELECT id, name, email, timezone, weekStartsOn
       FROM User WHERE weeklyEmailOptIn = 1 AND email IS NOT NULL`
    ).all());
  } catch (error) {
    // A missing/migrated-away table must not crash the cron run.
    console.error('weekly-nudge: recipient query failed', String(error));
    return;
  }

  const now = new Date();
  let sent = 0;
  for (const user of results ?? []) {
    try {
      const tz = user.timezone || 'UTC';
      const { dayKey, dow } = localDay(now, tz);
      if (dow !== 0) continue; // their Sunday, not the server's

      const weekOf = weekStartFor(dayKey, user.weekStartsOn);
      const written = await env.DB.prepare(
        `SELECT id FROM WeeklyLogEntry WHERE userId = ? AND weekOf = ?`
      )
        .bind(user.id, weekOf)
        .first('id');
      if (written) continue; // never nudge a week already on record

      const signals = await loadSignals(env.DB, user.id, true);
      const question = await resolveQuestion(signals, weekOf);
      const name = (user.name || 'there').split(' ')[0];
      await env.EMAIL.send({
        to: user.email,
        from: FROM,
        subject: 'The week in your own words',
        text: emailText(name, weekOf, question.text),
        html: emailHtml(name, question.text),
      });
      sent += 1;
    } catch (error) {
      // One bad recipient must not stop the rest.
      console.error('weekly-nudge failed', { userId: user.id, error: String(error) });
    }
  }
  console.log(`weekly-nudge: sent ${sent} email(s)`);
}
