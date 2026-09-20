import { and, desc, eq, ne } from 'drizzle-orm';
import { redirect } from 'next/navigation';

import { JournalArchive } from '~/components/journal-archive';
import { LocalOnboardingGate } from '~/components/local-onboarding-gate';
import { LocalWeeklyLog } from '~/components/weekly-log/local-weekly-log';
import { WeeklyLogSurface } from '~/components/weekly-log/weekly-log-surface';
import { TimezoneSync } from '~/components/timezone-sync';
import { bucketListItems, users } from '~/db/schema';
import { getAllJournalEntries } from '~/lib/actions/daily';
import { setCallingBucketListDream } from '~/lib/actions/bucket-list';
import {
  getNudgeSignals,
  getRecentPromptIds,
  getStaleDreams,
  getWeeklyEmailOptIn,
  getWeekStartsOn,
  getWeeklyLogEntries,
  saveWeeklyLogEntry,
  setWeeklyEmailOptIn,
  setWeekStartsOn,
} from '~/lib/actions/weekly-log';
import { dayKeyIn } from '~/lib/day';
import { parseBirthDate } from '~/lib/life-in-weeks';
import { birthDateFromYear, buildLifeGrid } from '~/lib/mortality';
import { getCloudflareContext } from '@opennextjs/cloudflare';

import { resolveWeeklyNudge } from '~/lib/weekly-nudge';
import { weekStartFor, type WeekStartsOn } from '~/lib/weekly-log';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';

export const metadata = {
  title: 'Weekly log — Significant Hobbies',
  description: 'A private weekly record of what you actually lived.',
  robots: { index: false, follow: false },
};

export default async function JournalPage() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    const today = dayKeyIn(null);
    return (
      <LocalOnboardingGate>
        <LocalWeeklyLog today={today} />
      </LocalOnboardingGate>
    );
  }

  const me = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: {
      birthYear: true,
      birthDate: true,
      timezone: true,
      onboardingCompletedAt: true,
    },
  });
  if (!me?.onboardingCompletedAt) redirect('/onboarding');

  const data = await loadJournalData(session.user.id, me.timezone);
  const {
    entries,
    staleDreams,
    weekStartsOn,
    signals,
    excludeIds,
    journalHistory,
    profile,
    emailOptIn,
    activeDreams,
  } = data;

  const today = dayKeyIn(me.timezone);
  const weekOf = weekStartFor(today, weekStartsOn);
  const question = await resolveWeeklyNudge(
    signals,
    weekOf,
    excludeIds,
    getCloudflareContext().env.AI
  );
  const birth =
    me.birthDate && parseBirthDate(me.birthDate)
      ? new Date(`${me.birthDate}T12:00:00`)
      : birthDateFromYear(me.birthYear);
  const weeksRemaining = birth ? buildLifeGrid(birth, new Set()).weeksRemaining : null;

  return (
    <>
      <TimezoneSync storedTimezone={me.timezone} />
      <WeeklyLogSurface
        data={{
          firstName: profile?.name?.split(' ')[0] ?? session.user.name?.split(' ')[0] ?? 'there',
          today,
          weekStartsOn,
          entries: entries.map((entry) => ({
            id: entry.id,
            weekOf: entry.weekOf,
            text: entry.text,
            promptText: entry.promptText,
            turns: parseTurns(entry.turnsJson),
          })),
          emailOptIn,
          activeDreams,
          staleDreams: staleDreams.map((dream) => ({
            title: dream.title,
            category: dream.category,
            daysSinceMovement: dream.daysSinceMovement,
          })),
          weeksRemaining,
          initialQuestion: question,
          nudgeRequest: { signals, excludeIds },
          archiveSlot: <JournalArchive records={journalHistory} />,
        }}
        actions={{
          onSave: async (entryWeekOf, text, promptText, turns) => {
            'use server';
            const result = await saveWeeklyLogEntry(entryWeekOf, text, promptText, turns);
            return result.saved;
          },
          onEmailOptInChange: async (optIn: boolean) => {
            'use server';
            await setWeeklyEmailOptIn(optIn);
          },
          onWeekStartsOnChange: async (value: WeekStartsOn) => {
            'use server';
            await setWeekStartsOn(value);
          },
          onCallDreamForward: async (title: string) => {
            'use server';
            await setCallingBucketListDream(title);
          },
        }}
      />
    </>
  );
}

function parseTurns(
  turnsJson: string | null
): Array<{ questionText: string; answer: string }> | undefined {
  if (!turnsJson) return undefined;
  try {
    const parsed = JSON.parse(turnsJson) as unknown;
    if (!Array.isArray(parsed)) return undefined;
    const turns = parsed
      .filter(
        (turn): turn is { questionText: string; answer: string } =>
          !!turn &&
          typeof turn === 'object' &&
          typeof (turn as { questionText?: unknown }).questionText === 'string' &&
          typeof (turn as { answer?: unknown }).answer === 'string'
      )
      .map((turn) => ({ questionText: turn.questionText, answer: turn.answer }));
    return turns.length ? turns : undefined;
  } catch {
    return undefined;
  }
}

async function loadJournalData(userId: string, timezone: string | null) {
  const [
    entries,
    staleDreams,
    weekStartsOn,
    signals,
    excludeIds,
    journalHistory,
    profile,
    emailOptIn,
    activeDreams,
  ] = await Promise.all([
    getWeeklyLogEntries(),
    getStaleDreams(3),
    getWeekStartsOn(),
    getNudgeSignals(timezone),
    getRecentPromptIds(),
    getAllJournalEntries(),
    db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { name: true },
    }),
    getWeeklyEmailOptIn(),
    db
      .select({ title: bucketListItems.title, category: bucketListItems.category })
      .from(bucketListItems)
      .where(and(eq(bucketListItems.userId, userId), ne(bucketListItems.status, 'done')))
      .orderBy(desc(bucketListItems.updatedAt))
      .limit(30),
  ]);
  return {
    entries,
    staleDreams,
    weekStartsOn,
    signals,
    excludeIds,
    journalHistory,
    profile,
    emailOptIn,
    activeDreams,
  };
}
