import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

import { JournalArchive } from '~/components/journal-archive';
import { LocalOnboardingGate } from '~/components/local-onboarding-gate';
import { LocalWeeklyLog } from '~/components/weekly-log/local-weekly-log';
import { WeeklyLogSurface } from '~/components/weekly-log/weekly-log-surface';
import { TimezoneSync } from '~/components/timezone-sync';
import { users } from '~/db/schema';
import { getAllJournalEntries } from '~/lib/actions/daily';
import { setCallingBucketListDream } from '~/lib/actions/bucket-list';
import {
  getNudgeSignals,
  getRecentPromptIds,
  getStaleDreams,
  getWeekStartsOn,
  getWeeklyLogEntries,
  saveWeeklyLogEntry,
  setWeekStartsOn,
} from '~/lib/actions/weekly-log';
import { dayKeyIn } from '~/lib/day';
import { parseBirthDate } from '~/lib/life-in-weeks';
import { birthDateFromYear, buildLifeGrid } from '~/lib/mortality';
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

  const [entries, staleDreams, weekStartsOn, signals, excludeIds, journalHistory, profile] =
    await Promise.all([
      getWeeklyLogEntries(),
      getStaleDreams(3),
      getWeekStartsOn(),
      getNudgeSignals(me.timezone),
      getRecentPromptIds(),
      getAllJournalEntries(),
      db.query.users.findFirst({
        where: eq(users.id, session.user.id),
        columns: { name: true },
      }),
    ]);

  const today = dayKeyIn(me.timezone);
  const weekOf = weekStartFor(today, weekStartsOn);
  const question = await resolveWeeklyNudge(signals, weekOf, excludeIds);
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
          entries,
          staleDreams: staleDreams.map((dream) => ({
            title: dream.title,
            category: dream.category,
            daysSinceMovement: dream.daysSinceMovement,
          })),
          weeksRemaining,
          initialQuestion: question,
          archiveSlot: <JournalArchive records={journalHistory} />,
        }}
        actions={{
          onSave: async (entryWeekOf, text, promptText) => {
            'use server';
            const result = await saveWeeklyLogEntry(entryWeekOf, text, promptText);
            return result.saved;
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
