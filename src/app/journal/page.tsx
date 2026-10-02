import { eq } from 'drizzle-orm';

import { JournalArchive } from '~/components/journal-archive';
import { LocalWeeklyLog } from '~/components/weekly-log/local-weekly-log';
import { WeeklyLogSurface } from '~/components/weekly-log/weekly-log-surface';
import { TimezoneSync } from '~/components/timezone-sync';
import { users } from '~/db/schema';
import { getAllJournalEntries } from '~/lib/actions/daily';
import {
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

import type { WeekStartsOn } from '~/lib/weekly-log';
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
    return <LocalWeeklyLog today={today} />;
  }

  const me = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: {
      birthYear: true,
      birthDate: true,
      timezone: true,
      name: true,
    },
  });

  const [entries, weekStartsOn, journalHistory, emailOptIn] = await Promise.all([
    getWeeklyLogEntries(),
    getWeekStartsOn(),
    getAllJournalEntries(),
    getWeeklyEmailOptIn(),
  ]);
  const today = dayKeyIn(me?.timezone ?? null);
  const birth =
    me?.birthDate && parseBirthDate(me?.birthDate)
      ? new Date(`${me?.birthDate}T12:00:00`)
      : birthDateFromYear(me?.birthYear ?? null);
  const weeksRemaining = birth ? buildLifeGrid(birth, new Set()).weeksRemaining : null;

  return (
    <>
      <TimezoneSync storedTimezone={me?.timezone ?? null} />
      <WeeklyLogSurface
        data={{
          firstName: me?.name?.split(' ')[0] ?? session.user.name?.split(' ')[0] ?? 'there',
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
          weeksRemaining,
          archiveSlot: <JournalArchive records={journalHistory} />,
        }}
        actions={{
          onSave: async (entryWeekOf, text, promptText) => {
            'use server';
            const result = await saveWeeklyLogEntry(entryWeekOf, text, promptText);
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
