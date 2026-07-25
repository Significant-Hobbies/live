import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

import { DailyRitual } from '~/components/daily-ritual';
import { TimezoneSync } from '~/components/timezone-sync';
import { users } from '~/db/schema';
import {
  createHabit,
  deleteHabit,
  getAllHabitLogs,
  getDailyCheckin,
  getHabits,
  getHabitLogsForDate,
  getJournalEntriesForRange,
  getUserProfile,
  saveDailyCheckin,
  saveJournalEntry,
  toggleHabitLog,
} from '~/lib/actions/daily';
import { dayKeyIn, isMorningIn } from '~/lib/day';
import { buildJournalDateWindow } from '~/lib/journal';
import { getActiveMonthEndNudge } from '~/lib/actions/trajectory';
import { birthDateFromYear, buildLifeGrid } from '~/lib/mortality';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';

export const metadata = {
  title: 'Daily Ritual — SignificantHobbies',
  robots: { index: false, follow: false },
};

export default async function DailyPage() {
  const session = await getServerAuthSession();
  if (!session?.user) redirect('/login');

  // The user's zone has to be resolved before "today" exists — every dayDate
  // key below is user-local, so this one read cannot be parallelised with them.
  const me = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { birthYear: true, timezone: true },
  });

  const today = dayKeyIn(me?.timezone);
  const isMorning = isMorningIn(me?.timezone);
  const journalDateWindow = buildJournalDateWindow(today);

  const [userHabits, habitLogs, allHabitLogs, journalEntries, checkin, profile, trajectoryNudge] =
    await Promise.all([
      getHabits(),
      getHabitLogsForDate(today),
      getAllHabitLogs(),
      getJournalEntriesForRange(journalDateWindow[0]!, today),
      getDailyCheckin(today),
      getUserProfile(),
      getActiveMonthEndNudge(),
    ]);

  const journalEntry = journalEntries.find((entry) => entry.dayDate === today) ?? null;

  const firstName = profile?.name?.split(' ')[0] ?? session.user.name?.split(' ')[0] ?? 'there';

  // Mortality frame — weeks remaining grounds the ritual in the finite life.
  const birth = birthDateFromYear(me?.birthYear);
  const weeksRemaining = birth ? buildLifeGrid(birth, new Set()).weeksRemaining : null;

  return (
    <>
      <TimezoneSync storedTimezone={me?.timezone ?? null} />
      <DailyRitual
        firstName={firstName}
        today={today}
        isMorning={isMorning}
        weeksRemaining={weeksRemaining}
        habits={userHabits}
        habitLogs={habitLogs}
        allHabitLogs={allHabitLogs}
        journalEntry={journalEntry}
        journalEntries={journalEntries}
        checkin={checkin}
        trajectoryNudge={trajectoryNudge}
        actions={{
          createHabit,
          deleteHabit,
          toggleHabitLog,
          saveJournalEntry,
          saveDailyCheckin,
        }}
      />
    </>
  );
}
