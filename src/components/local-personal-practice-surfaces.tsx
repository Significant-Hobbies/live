'use client';

import { useEffect, useMemo, useState } from 'react';

import { HabitsExperience } from '~/components/personal-practice-surfaces';
import { StorageModeProvider, StorageModeStatus } from '~/components/storage-mode-provider';
import { browserRecordAdapter, readLocalRecord, writeLocalRecord } from '~/lib/local-record-store';

interface LocalHabit {
  id: string;
  name: string;
  status: string;
  targetFrequency: string;
  icon: string | null;
  sourceQuestId: string | null;
  commitmentId: string | null;
}
interface LocalHabitLog {
  id: string;
  habitId: string;
  dayDate: string;
  completed: boolean;
}
export interface LocalJournal {
  id: string;
  dayDate: string;
  amEntry: string | null;
  pmEntry: string | null;
  timelineId: null;
  commitmentId: null;
  noveltyId?: string | null;
  noveltyText?: string | null;
  noveltyCompleted?: boolean;
}
export interface LocalDailyState {
  habits: LocalHabit[];
  logs: LocalHabitLog[];
  journals: LocalJournal[];
}
interface LocalProfile {
  name?: string;
}

const EMPTY_LOCAL_DAILY: LocalDailyState = { habits: [], logs: [], journals: [] };

export function isLocalDailyState(value: unknown): value is LocalDailyState {
  return !!value && typeof value === 'object' && 'habits' in value;
}

export function LocalHabitsExperience({ today }: { today: string }) {
  const [state, setState] = useState<LocalDailyState>(EMPTY_LOCAL_DAILY);
  const [profile, setProfile] = useState<LocalProfile>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const adapter = browserRecordAdapter();
    Promise.all([
      readLocalRecord(adapter, 'daily:state', 'daily', isLocalDailyState),
      readLocalRecord(
        adapter,
        'onboarding:profile',
        'onboarding',
        (value): value is LocalProfile => !!value && typeof value === 'object'
      ),
    ]).then(([stored, storedProfile]) => {
      setState(stored ?? EMPTY_LOCAL_DAILY);
      setProfile(storedProfile ?? {});
      setLoaded(true);
    });
  }, []);

  async function commit(update: (current: LocalDailyState) => LocalDailyState) {
    const next = update(state);
    setState(next);
    await writeLocalRecord(browserRecordAdapter(), 'daily:state', 'daily', next);
    return next;
  }

  const actions = useMemo(
    () => ({
      async createHabit(
        name: string,
        targetFrequency = 'daily',
        icon?: string,
        commitmentId?: string | null
      ) {
        const habit = {
          id: `local-habit-${crypto.randomUUID()}`,
          name: name.trim(),
          status: 'active',
          targetFrequency,
          icon: icon ?? null,
          sourceQuestId: null,
          commitmentId: commitmentId ?? null,
        };
        if (!habit.name) return null;
        await commit((current) => ({ ...current, habits: [...current.habits, habit] }));
        return { id: habit.id, name: habit.name };
      },
      async deleteHabit(id: string) {
        await commit((current) => ({
          ...current,
          habits: current.habits.filter((habit) => habit.id !== id),
        }));
      },
      async setHabitCommitment(habitId: string, commitmentId: string | null) {
        await commit((current) => ({
          ...current,
          habits: current.habits.map((habit) =>
            habit.id === habitId ? { ...habit, commitmentId } : habit
          ),
        }));
        return true;
      },
      async toggleHabitLog(habitId: string, dayDate: string, completed: boolean) {
        await commit((current) => {
          const existing = current.logs.find(
            (log) => log.habitId === habitId && log.dayDate === dayDate
          );
          return {
            ...current,
            logs: existing
              ? current.logs.map((log) => (log.id === existing.id ? { ...log, completed } : log))
              : [
                  ...current.logs,
                  { id: `local-log-${crypto.randomUUID()}`, habitId, dayDate, completed },
                ],
          };
        });
      },
      // commit deliberately follows the latest state through the component remount revision.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [state]
  );

  if (!loaded)
    return (
      <p className="p-8 text-center text-sm text-muted-foreground">
        Loading Habits from this device…
      </p>
    );
  return (
    <StorageModeProvider mode="local">
      <div className="mx-auto max-w-3xl px-4 pt-6">
        <StorageModeStatus />
      </div>
      <HabitsExperience
        firstName={profile.name?.trim().split(/\s+/)[0] || 'there'}
        today={today}
        habits={state.habits}
        habitLogs={state.logs.filter((log) => log.dayDate === today)}
        createHabit={actions.createHabit}
        deleteHabit={actions.deleteHabit}
        setHabitCommitment={actions.setHabitCommitment}
        toggleHabitLog={actions.toggleHabitLog}
        localMode
      />
    </StorageModeProvider>
  );
}
