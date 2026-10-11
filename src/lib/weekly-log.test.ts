import { describe, expect, it } from 'vitest';

import {
  defaultWritingWeek,
  entryWeekFor,
  findEntryForWeek,
  formatWeekOf,
  formatWeekSpan,
  isSuggestedLogDay,
  normalizeWeekStartsOn,
  weekEndExclusive,
  weekStartFor,
} from '~/lib/weekly-log';

describe('stored week matching', () => {
  it('attaches Monday entries to the same lived week after switching to Sunday', () => {
    const entry = { weekOf: '2026-03-09', text: 'A walk.' };
    expect(entryWeekFor(entry.weekOf, 'sunday')).toBe('2026-03-08');
    expect(findEntryForWeek([entry], '2026-03-08', 'sunday')).toBe(entry);
    expect(entry.weekOf).toBe('2026-03-09');
  });
  it('attaches Sunday entries after switching to Monday without rewriting them', () => {
    const entry = { weekOf: '2026-03-08', text: 'A swim.' };
    expect(entryWeekFor(entry.weekOf, 'monday')).toBe('2026-03-09');
    expect(findEntryForWeek([entry], '2026-03-09', 'monday')).toBe(entry);
    expect(findEntryForWeek([entry], '2026-03-16', 'monday')).toBeUndefined();
  });
  it('defaults to this week on its last day, otherwise the previous week', () => {
    expect(defaultWritingWeek('2026-10-11', 'monday')).toBe('2026-10-05');
    expect(defaultWritingWeek('2026-10-10', 'monday')).toBe('2026-09-28');
    expect(defaultWritingWeek('2026-10-10', 'sunday')).toBe('2026-10-04');
    expect(defaultWritingWeek('2026-10-11', 'sunday')).toBe('2026-10-04');
  });
});

describe('weekStartFor', () => {
  it('buckets days into Monday-start weeks', () => {
    expect(weekStartFor('2026-03-09', 'monday')).toBe('2026-03-09'); // Monday
    expect(weekStartFor('2026-03-11', 'monday')).toBe('2026-03-09'); // Wednesday
    expect(weekStartFor('2026-03-15', 'monday')).toBe('2026-03-09'); // Sunday
    expect(weekStartFor('2026-03-16', 'monday')).toBe('2026-03-16'); // next Monday
  });

  it('buckets days into Sunday-start weeks', () => {
    expect(weekStartFor('2026-03-08', 'sunday')).toBe('2026-03-08'); // Sunday
    expect(weekStartFor('2026-03-11', 'sunday')).toBe('2026-03-08'); // Wednesday
    expect(weekStartFor('2026-03-14', 'sunday')).toBe('2026-03-08'); // Saturday
    expect(weekStartFor('2026-03-15', 'sunday')).toBe('2026-03-15'); // next Sunday
  });

  it('puts the same Sunday in different weeks under the two preferences', () => {
    // Sunday ends the Monday-start week but opens the Sunday-start week.
    expect(weekStartFor('2026-03-15', 'monday')).toBe('2026-03-09');
    expect(weekStartFor('2026-03-15', 'sunday')).toBe('2026-03-15');
  });

  it('crosses month and year boundaries cleanly', () => {
    expect(weekStartFor('2026-01-01', 'monday')).toBe('2025-12-29'); // Thursday
    expect(weekStartFor('2026-01-01', 'sunday')).toBe('2025-12-28');
  });

  it('rejects malformed day keys', () => {
    expect(() => weekStartFor('March 9', 'monday')).toThrow();
    expect(() => weekStartFor('2026-3-9', 'monday')).toThrow();
  });
});

describe('weekEndExclusive', () => {
  it('returns the day after the week ends', () => {
    expect(weekEndExclusive('2026-03-09')).toBe('2026-03-16');
  });
});

describe('isSuggestedLogDay', () => {
  it('is true on Sundays and false otherwise', () => {
    expect(isSuggestedLogDay('2026-03-15')).toBe(true); // Sunday
    expect(isSuggestedLogDay('2026-03-09')).toBe(false); // Monday
    expect(isSuggestedLogDay('2026-03-14')).toBe(false); // Saturday
  });
});

describe('formatWeekOf / formatWeekSpan', () => {
  it('labels a week by its start day', () => {
    expect(formatWeekOf('2026-03-09')).toBe('Week of March 9, 2026');
  });

  it('spans seven inclusive days', () => {
    expect(formatWeekSpan('2026-03-09')).toBe('Mar 9 – Mar 15');
    expect(formatWeekSpan('2025-12-29')).toBe('Dec 29 – Jan 4');
  });
});

describe('normalizeWeekStartsOn', () => {
  it('keeps valid values and defaults everything else to Monday', () => {
    expect(normalizeWeekStartsOn('sunday')).toBe('sunday');
    expect(normalizeWeekStartsOn('monday')).toBe('monday');
    expect(normalizeWeekStartsOn(null)).toBe('monday');
    expect(normalizeWeekStartsOn('friday')).toBe('monday');
    expect(normalizeWeekStartsOn(undefined)).toBe('monday');
  });
});
