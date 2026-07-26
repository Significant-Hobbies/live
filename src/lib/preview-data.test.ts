import { describe, expect, it } from 'vitest';

import { isWeekday } from './day';
import { computeStreak, computeWeeklyProgress } from './habit-utils';
import {
  previewHabitLogs,
  previewHabitLogsForToday,
  previewHabits,
  previewJournalEntries,
  previewTrajectoryState,
} from './preview-data';
import { buildJournalDateWindow } from './journal';
import {
  bucketHasEnoughPointsForChart,
  extractChartSeries,
  TRAJECTORY_BUCKETS,
} from './trajectory';

const TODAY = '2026-07-25';

describe('previewHabits', () => {
  it('covers every cadence the streak maths supports', () => {
    const freqs = previewHabits().map((h) => h.targetFrequency);
    expect(new Set(freqs)).toEqual(new Set(['daily', '3x_week', 'weekdays']));
  });

  it('returns copies so a caller cannot mutate the shared sample', () => {
    const first = previewHabits();
    first[0]!.name = 'mutated';
    expect(previewHabits()[0]!.name).not.toBe('mutated');
  });
});

describe('previewHabitLogs', () => {
  it('is dated relative to today, so the preview cannot go stale', () => {
    const logs = previewHabitLogs(TODAY);
    for (const log of logs) {
      expect(log.dayDate <= TODAY).toBe(true);
    }
    expect(logs.some((l) => l.dayDate === TODAY)).toBe(true);
  });

  it('produces a real streak rather than an implausible perfect wall', () => {
    const logs = previewHabitLogs(TODAY);
    const streak = computeStreak(logs, 'preview-habit-read', TODAY, 'daily');
    // The gap four days back caps the daily streak — the product's whole thesis
    // is that the gap is the point, so the preview must not show perfection.
    expect(streak.count).toBe(4);
    expect(streak.unit).toBe('day');
  });

  it('only ticks the weekdays habit on weekdays, matching its own label', () => {
    const logs = previewHabitLogs(TODAY).filter((l) => l.habitId === 'preview-habit-piano');
    expect(logs.length).toBeGreaterThan(0);
    for (const log of logs) {
      expect(isWeekday(log.dayDate), `${log.dayDate} should be a weekday`).toBe(true);
    }
  });

  it('gives the quota habit a full week so its dots read as complete', () => {
    const logs = previewHabitLogs(TODAY);
    const weekly = computeWeeklyProgress(logs, 'preview-habit-run', TODAY, '3x_week');
    expect(weekly.target).toBe(3);
    expect(weekly.completed).toBeGreaterThan(0);
  });

  it('scopes today’s logs to today', () => {
    const todays = previewHabitLogsForToday(TODAY);
    expect(todays.length).toBeGreaterThan(0);
    expect(todays.every((l) => l.dayDate === TODAY)).toBe(true);
  });
});

describe('previewJournalEntries', () => {
  it('fills today so the reader has something to show', () => {
    const today = previewJournalEntries(TODAY).find((e) => e.dayDate === TODAY);
    expect(today?.amEntry).toBeTruthy();
    expect(today?.pmEntry).toBeTruthy();
  });

  it('stays inside the 21-day rail the reader renders', () => {
    const window = new Set(buildJournalDateWindow(TODAY));
    const inWindow = previewJournalEntries(TODAY).filter((e) => window.has(e.dayDate));
    // Entries outside the rail would be invisible; most should land inside it.
    expect(inWindow.length).toBeGreaterThanOrEqual(8);
  });

  it('leaves gaps, so the rail does not imply a perfect record is expected', () => {
    const entries = previewJournalEntries(TODAY);
    const days = new Set(entries.map((e) => e.dayDate));
    const rail = buildJournalDateWindow(TODAY);
    expect(rail.some((day) => !days.has(day))).toBe(true);
  });
});

describe('previewTrajectoryState', () => {
  it('gives every bucket an active era with an ideal', () => {
    const state = previewTrajectoryState('2026-07');
    for (const bucket of TRAJECTORY_BUCKETS) {
      const eras = state.erasByBucket[bucket];
      expect(eras).toHaveLength(1);
      expect(eras[0]!.status).toBe('active');
      expect(eras[0]!.idealText.length).toBeGreaterThan(10);
      expect(eras[0]!.closedAt).toBeNull();
    }
  });

  it('gives every bucket enough points to actually draw its chart', () => {
    const state = previewTrajectoryState('2026-07');
    for (const bucket of TRAJECTORY_BUCKETS) {
      const era = state.erasByBucket[bucket]![0]!;
      const entries = state.erasByBucket[bucket]!.flatMap((e) => e.entries);
      expect(bucketHasEnoughPointsForChart(entries, era.id)).toBe(true);
      // And the series must actually resolve to a drawable line.
      const series = extractChartSeries(entries, era.id);
      expect(series).toHaveLength(1);
      expect(series[0]!.points).toHaveLength(3);
    }
  });

  it('ends at the requested month and walks backwards', () => {
    const state = previewTrajectoryState('2026-01');
    const months = state.erasByBucket.health[0]!.entries.map((e) => e.monthKey);
    // Crossing a year boundary is where naive month maths breaks.
    expect(months).toEqual(['2025-11', '2025-12', '2026-01']);
  });

  it('opens each era no later than its first entry', () => {
    const state = previewTrajectoryState('2026-07');
    for (const bucket of TRAJECTORY_BUCKETS) {
      const era = state.erasByBucket[bucket]![0]!;
      const firstMonth = era.entries[0]!.monthKey;
      expect(era.openedAt.toISOString().slice(0, 7) <= firstMonth).toBe(true);
    }
  });

  it('gives each entry a distinct reflection so the history reads as writing', () => {
    const entries = previewTrajectoryState('2026-07').erasByBucket.finance[0]!.entries;
    const reflections = entries.map((e) => e.reflection);
    expect(new Set(reflections).size).toBe(reflections.length);
  });

  it('never draws a straight rising line, which would read as a growth dashboard', () => {
    // The header promises "no score — the gap is the whole point". Four diagonals
    // climbing up and to the right would contradict it, so no bucket may be
    // monotonically increasing.
    const state = previewTrajectoryState('2026-07');
    for (const bucket of TRAJECTORY_BUCKETS) {
      const values = state.erasByBucket[bucket]![0]!.entries.map((e) => e.numbers[0]!.value);
      const rising = values.every((v, i) => i === 0 || v > values[i - 1]!);
      expect(rising, `${bucket} must not rise monotonically`).toBe(false);
    }
  });

  it('leaves a visible gap between where the sample is and its stated ideal', () => {
    // Finance sits at 5 against an ideal of twelve months of runway — the gap is
    // the thing the surface exists to show.
    const finance = previewTrajectoryState('2026-07').erasByBucket.finance[0]!;
    expect(finance.idealText).toMatch(/Twelve months/);
    expect(finance.entries.at(-1)!.numbers[0]!.value).toBeLessThan(12);
  });
});
