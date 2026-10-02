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

export function isLocalDailyState(value: unknown): value is LocalDailyState {
  return !!value && typeof value === 'object' && 'habits' in value;
}
