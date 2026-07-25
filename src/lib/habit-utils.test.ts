import { describe, expect, it } from 'vitest';

import {
  computeStreak,
  computeWeeklyProgress,
  frequencyMeta,
  isValidFrequency,
} from './habit-utils';

const HABIT = 'h1';

/** Completed logs for the given day keys. */
function logs(days: string[], habitId = HABIT) {
  return days.map((dayDate) => ({ habitId, dayDate, completed: true }));
}

describe('frequencyMeta', () => {
  it('maps each frequency to its weekly target', () => {
    expect(frequencyMeta('daily').weeklyTarget).toBe(7);
    expect(frequencyMeta('weekdays').weeklyTarget).toBe(5);
    expect(frequencyMeta('3x_week').weeklyTarget).toBe(3);
    expect(frequencyMeta('5x_week').weeklyTarget).toBe(5);
  });

  it('falls back to daily for unknown or missing values', () => {
    expect(frequencyMeta(undefined).weeklyTarget).toBe(7);
    expect(frequencyMeta('every_full_moon').cadence).toBe('daily');
  });

  it('validates frequency keys', () => {
    expect(isValidFrequency('3x_week')).toBe(true);
    expect(isValidFrequency('every_full_moon')).toBe(false);
    expect(isValidFrequency(null)).toBe(false);
  });
});

describe('computeWeeklyProgress', () => {
  it('scores against the habit target, not a hardcoded 7', () => {
    // A 3x/week habit that logged 3 days in the window is complete.
    const done = logs(['2026-07-27', '2026-07-29', '2026-07-31']);
    expect(computeWeeklyProgress(done, HABIT, '2026-07-31', '3x_week')).toEqual({
      completed: 3,
      target: 3,
    });
    // The same logs under `daily` are 3 of 7.
    expect(computeWeeklyProgress(done, HABIT, '2026-07-31', 'daily')).toEqual({
      completed: 3,
      target: 7,
    });
  });

  it('counts only the 7 days ending on today', () => {
    const done = logs(['2026-07-20', '2026-07-31']); // 2026-07-20 is 11 days earlier
    expect(computeWeeklyProgress(done, HABIT, '2026-07-31', 'daily').completed).toBe(1);
  });

  it('ignores other habits and uncompleted logs', () => {
    const mixed = [
      { habitId: HABIT, dayDate: '2026-07-31', completed: true },
      { habitId: HABIT, dayDate: '2026-07-30', completed: false },
      { habitId: 'other', dayDate: '2026-07-29', completed: true },
    ];
    expect(computeWeeklyProgress(mixed, HABIT, '2026-07-31', 'daily').completed).toBe(1);
  });
});

describe('computeStreak — daily', () => {
  it('counts consecutive days', () => {
    const done = logs(['2026-07-29', '2026-07-30', '2026-07-31']);
    expect(computeStreak(done, HABIT, '2026-07-31', 'daily')).toEqual({ count: 3, unit: 'day' });
  });

  it('survives today not being logged yet', () => {
    const done = logs(['2026-07-29', '2026-07-30']);
    expect(computeStreak(done, HABIT, '2026-07-31', 'daily')).toEqual({ count: 2, unit: 'day' });
  });

  it('breaks once two scheduled days are missed', () => {
    const done = logs(['2026-07-28', '2026-07-29']);
    expect(computeStreak(done, HABIT, '2026-07-31', 'daily')).toEqual({ count: 0, unit: 'day' });
  });

  it('returns zero with no logs', () => {
    expect(computeStreak([], HABIT, '2026-07-31', 'daily')).toEqual({ count: 0, unit: 'day' });
  });
});

describe('computeStreak — weekdays', () => {
  // 2026-07-27 Mon … 2026-07-31 Fri; 2026-08-01 Sat, 2026-08-02 Sun.
  it('does not break across the weekend', () => {
    // Mon–Fri logged. On the following Monday the streak should be 5, not 0 —
    // the old day-consecutive rule reset this every Saturday.
    const done = logs(['2026-07-27', '2026-07-28', '2026-07-29', '2026-07-30', '2026-07-31']);
    expect(computeStreak(done, HABIT, '2026-08-01', 'weekdays')).toEqual({
      count: 5,
      unit: 'day',
    });
    expect(computeStreak(done, HABIT, '2026-08-03', 'weekdays')).toEqual({
      count: 5,
      unit: 'day',
    });
  });

  it('spans two weeks of weekdays', () => {
    const done = logs([
      '2026-07-27',
      '2026-07-28',
      '2026-07-29',
      '2026-07-30',
      '2026-07-31',
      '2026-08-03',
    ]);
    expect(computeStreak(done, HABIT, '2026-08-03', 'weekdays').count).toBe(6);
  });

  it('breaks on a missed weekday', () => {
    // Wednesday 2026-07-29 missing.
    const done = logs(['2026-07-27', '2026-07-28', '2026-07-30', '2026-07-31']);
    expect(computeStreak(done, HABIT, '2026-07-31', 'weekdays').count).toBe(2);
  });

  it('weekend logs do not extend the streak', () => {
    const done = logs(['2026-08-01', '2026-08-02']); // Sat + Sun only
    expect(computeStreak(done, HABIT, '2026-08-03', 'weekdays').count).toBe(0);
  });
});

describe('computeStreak — quota', () => {
  it('counts whole weeks that met the target', () => {
    // Week of Jul 20 (Mon) and week of Jul 27 (Mon), 3 each.
    const done = logs([
      '2026-07-20',
      '2026-07-22',
      '2026-07-24',
      '2026-07-27',
      '2026-07-29',
      '2026-07-31',
    ]);
    expect(computeStreak(done, HABIT, '2026-07-31', '3x_week')).toEqual({
      count: 2,
      unit: 'week',
    });
  });

  it('does not penalise an in-progress week below target', () => {
    // Previous week hit 3; current week only has 1 so far.
    const done = logs(['2026-07-20', '2026-07-22', '2026-07-24', '2026-07-27']);
    expect(computeStreak(done, HABIT, '2026-07-28', '3x_week')).toEqual({
      count: 1,
      unit: 'week',
    });
  });

  it('stops at a week that missed the target', () => {
    // Week of Jul 13 hit 3, week of Jul 20 only 1, week of Jul 27 hit 3.
    const done = logs([
      '2026-07-13',
      '2026-07-15',
      '2026-07-17',
      '2026-07-20',
      '2026-07-27',
      '2026-07-29',
      '2026-07-31',
    ]);
    expect(computeStreak(done, HABIT, '2026-07-31', '3x_week').count).toBe(1);
  });
});
