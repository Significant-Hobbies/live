// Pure habit computation functions — not server actions, safe to import client-side.
//
// `today` is always passed in as a user-local YYYY-MM-DD key (see lib/day.ts).
// These functions must never call `new Date()` to decide what day it is: the
// caller knows the user's timezone and this module does not.

import { isWeekday, shiftDayKey, weekStartKey } from '~/lib/day';

interface HabitLogLite {
  habitId: string;
  dayDate: string;
  completed: boolean;
}

/**
 * How a habit's cadence is scored.
 *
 * - `daily`    — every calendar day is scheduled.
 * - `weekdays` — Mon–Fri are scheduled; weekends neither break nor extend a streak.
 * - `quota`    — N completions per week, any days. Streaks count whole weeks,
 *                because "consecutive days" is meaningless for a 3x/week habit.
 */
type HabitCadence = 'daily' | 'weekdays' | 'quota';

export interface HabitFrequencyMeta {
  label: string;
  cadence: HabitCadence;
  /** Completions that count as a full week. */
  weeklyTarget: number;
}

const HABIT_FREQUENCIES: Record<string, HabitFrequencyMeta> = {
  daily: { label: 'Every day', cadence: 'daily', weeklyTarget: 7 },
  weekdays: { label: 'Weekdays', cadence: 'weekdays', weeklyTarget: 5 },
  '3x_week': { label: '3× / week', cadence: 'quota', weeklyTarget: 3 },
  '5x_week': { label: '5× / week', cadence: 'quota', weeklyTarget: 5 },
};

export const DEFAULT_FREQUENCY = 'daily';

/** Options for the habit-create form, in display order. */
export const FREQUENCY_OPTIONS = Object.entries(HABIT_FREQUENCIES).map(([value, meta]) => ({
  value,
  label: meta.label,
}));

export function frequencyMeta(targetFrequency: string | null | undefined): HabitFrequencyMeta {
  return HABIT_FREQUENCIES[targetFrequency ?? ''] ?? HABIT_FREQUENCIES[DEFAULT_FREQUENCY]!;
}

export function isValidFrequency(value: string | null | undefined): boolean {
  return !!value && value in HABIT_FREQUENCIES;
}

type StreakUnit = 'day' | 'week';

export interface HabitStreak {
  count: number;
  unit: StreakUnit;
}

function completedDaysFor(logs: HabitLogLite[], habitId: string): Set<string> {
  const days = new Set<string>();
  for (const log of logs) {
    if (log.habitId === habitId && log.completed) days.add(log.dayDate);
  }
  return days;
}

/** Previous scheduled day before `dayKey` for a given cadence. */
function previousScheduledDay(dayKey: string, cadence: HabitCadence): string {
  let cursor = shiftDayKey(dayKey, -1);
  if (cadence === 'weekdays') {
    while (!isWeekday(cursor)) cursor = shiftDayKey(cursor, -1);
  }
  return cursor;
}

function isScheduled(dayKey: string, cadence: HabitCadence): boolean {
  return cadence === 'weekdays' ? isWeekday(dayKey) : true;
}

/**
 * Current streak for a habit, in the unit its cadence is scored in.
 *
 * Day-scheduled habits (`daily`, `weekdays`) count consecutive *scheduled* days
 * — so a weekdays habit no longer breaks every Saturday. Today not being logged
 * yet does not end the streak; the most recent scheduled day before today is
 * allowed to carry it.
 *
 * Quota habits count consecutive weeks that met their target. A partial current
 * week counts only once the target is already met, so an in-progress week never
 * reads as a broken streak.
 */
export function computeStreak(
  logs: HabitLogLite[],
  habitId: string,
  today: string,
  targetFrequency?: string | null
): HabitStreak {
  const { cadence, weeklyTarget } = frequencyMeta(targetFrequency);
  const done = completedDaysFor(logs, habitId);
  if (done.size === 0) return { count: 0, unit: cadence === 'quota' ? 'week' : 'day' };

  if (cadence === 'quota') {
    const perWeek = new Map<string, number>();
    for (const day of done) {
      const week = weekStartKey(day);
      perWeek.set(week, (perWeek.get(week) ?? 0) + 1);
    }

    const currentWeek = weekStartKey(today);
    let cursor = currentWeek;
    // An in-progress week that hasn't hit its target yet is not a break.
    if ((perWeek.get(cursor) ?? 0) < weeklyTarget) {
      cursor = shiftDayKey(cursor, -7);
    }

    let weeks = 0;
    while ((perWeek.get(cursor) ?? 0) >= weeklyTarget) {
      weeks++;
      cursor = shiftDayKey(cursor, -7);
    }
    return { count: weeks, unit: 'week' };
  }

  // Day-scheduled cadences.
  let cursor = today;
  if (!isScheduled(cursor, cadence) || !done.has(cursor)) {
    // Today is either a rest day or simply not logged yet — fall back to the
    // last scheduled day before today.
    cursor = previousScheduledDay(cursor, cadence);
    if (!done.has(cursor)) return { count: 0, unit: 'day' };
  }

  let streak = 0;
  while (done.has(cursor)) {
    streak++;
    cursor = previousScheduledDay(cursor, cadence);
  }
  return { count: streak, unit: 'day' };
}

/**
 * Progress across the 7 days ending on `today`, against the habit's own target.
 *
 * `target` is the habit's weekly target, not a hardcoded 7 — a 3×/week habit
 * that logged 3 days is complete, not 43% of the way to something.
 */
export function computeWeeklyProgress(
  logs: HabitLogLite[],
  habitId: string,
  today: string,
  targetFrequency?: string | null
): { completed: number; target: number } {
  const { weeklyTarget } = frequencyMeta(targetFrequency);
  const done = completedDaysFor(logs, habitId);

  let completed = 0;
  for (let i = 0; i < 7; i++) {
    if (done.has(shiftDayKey(today, -i))) completed++;
  }

  return { completed, target: weeklyTarget };
}
