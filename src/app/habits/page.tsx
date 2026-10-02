import { eq } from 'drizzle-orm';

import { LocalHabitsExperience } from '~/components/local-personal-practice-surfaces';
import { HabitsExperience } from '~/components/personal-practice-surfaces';
import { TimezoneSync } from '~/components/timezone-sync';
import { users } from '~/db/schema';
import {
  createHabit,
  deleteHabit,
  getHabitCommitmentChoices,
  getHabitLogsForDate,
  getHabits,
  setHabitCommitment,
  toggleHabitLog,
} from '~/lib/actions/daily';
import { dayKeyIn } from '~/lib/day';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';

export const metadata = {
  title: 'Habits — Significant Hobbies',
  description: 'Small repeatable practices, checked in without scores or shame.',
  robots: { index: false, follow: false },
};

export default async function HabitsPage() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return <LocalHabitsExperience today={dayKeyIn(null)} />;
  }

  const me = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { timezone: true },
  });

  const today = dayKeyIn(me?.timezone ?? null);
  const [habits, habitLogs, habitCommitmentChoices] = await Promise.all([
    getHabits(),
    getHabitLogsForDate(today),
    getHabitCommitmentChoices(),
  ]);

  return (
    <>
      <TimezoneSync storedTimezone={me?.timezone ?? null} />
      <HabitsExperience
        today={today}
        habits={habits}
        habitLogs={habitLogs}
        habitCommitmentChoices={habitCommitmentChoices}
        createHabit={createHabit}
        deleteHabit={deleteHabit}
        setHabitCommitment={setHabitCommitment}
        toggleHabitLog={toggleHabitLog}
      />
    </>
  );
}
