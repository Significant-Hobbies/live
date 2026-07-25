import { describe, expect, it } from 'vitest';

import {
  dayKeyIn,
  dayOfWeek,
  hourIn,
  isMorningIn,
  isValidTimeZone,
  isWeekday,
  shiftDayKey,
  weekStartKey,
} from './day';

// 2026-07-25T22:30:00Z — 02:30 on 2026-07-26 in Asia/Dubai (UTC+4),
// and 15:30 on 2026-07-25 in America/Los_Angeles (UTC-7).
const LATE_UTC_EVENING = new Date('2026-07-25T22:30:00.000Z');

describe('isValidTimeZone', () => {
  it('accepts IANA zones', () => {
    expect(isValidTimeZone('Asia/Dubai')).toBe(true);
    expect(isValidTimeZone('UTC')).toBe(true);
  });

  it('rejects nonsense and empty input', () => {
    expect(isValidTimeZone('Not/AZone')).toBe(false);
    expect(isValidTimeZone('')).toBe(false);
  });
});

describe('dayKeyIn', () => {
  it('rolls the day forward for zones ahead of UTC', () => {
    expect(dayKeyIn('Asia/Dubai', LATE_UTC_EVENING)).toBe('2026-07-26');
  });

  it('keeps the earlier day for zones behind UTC', () => {
    expect(dayKeyIn('America/Los_Angeles', LATE_UTC_EVENING)).toBe('2026-07-25');
  });

  it('falls back to UTC when the zone is missing or unknown', () => {
    expect(dayKeyIn(null, LATE_UTC_EVENING)).toBe('2026-07-25');
    expect(dayKeyIn('Not/AZone', LATE_UTC_EVENING)).toBe('2026-07-25');
  });
});

describe('hourIn / isMorningIn', () => {
  it('reads the local hour', () => {
    expect(hourIn('Asia/Dubai', LATE_UTC_EVENING)).toBe(2);
    expect(hourIn('America/Los_Angeles', LATE_UTC_EVENING)).toBe(15);
  });

  it('handles local midnight as hour 0', () => {
    // 20:00Z is 00:00 next day in Asia/Dubai.
    expect(hourIn('Asia/Dubai', new Date('2026-07-25T20:00:00.000Z'))).toBe(0);
  });

  it('drives the AM/PM prompt from local time, not UTC', () => {
    // 13:00Z is 17:00 in Dubai — evening for the user, but UTC still says "morning"
    // is over only at noon UTC, which is what the old code compared against.
    const at = new Date('2026-07-25T13:00:00.000Z');
    expect(isMorningIn('Asia/Dubai', at)).toBe(false);
    // 06:00Z is 10:00 in Dubai — genuinely morning.
    expect(isMorningIn('Asia/Dubai', new Date('2026-07-25T06:00:00.000Z'))).toBe(true);
  });
});

describe('shiftDayKey', () => {
  it('moves whole days in both directions', () => {
    expect(shiftDayKey('2026-07-25', -1)).toBe('2026-07-24');
    expect(shiftDayKey('2026-07-25', 1)).toBe('2026-07-26');
    expect(shiftDayKey('2026-07-25', 0)).toBe('2026-07-25');
  });

  it('crosses month and year boundaries', () => {
    expect(shiftDayKey('2026-08-01', -1)).toBe('2026-07-31');
    expect(shiftDayKey('2027-01-01', -1)).toBe('2026-12-31');
  });

  it('handles leap days', () => {
    expect(shiftDayKey('2028-02-28', 1)).toBe('2028-02-29');
    expect(shiftDayKey('2026-02-28', 1)).toBe('2026-03-01');
  });

  it('rejects malformed keys', () => {
    expect(() => shiftDayKey('2026-7-5', 1)).toThrow(/YYYY-MM-DD/);
    expect(() => shiftDayKey('nope', 1)).toThrow(/YYYY-MM-DD/);
  });
});

describe('dayOfWeek / isWeekday / weekStartKey', () => {
  it('identifies weekdays and weekends', () => {
    // 2026-07-25 is a Saturday.
    expect(dayOfWeek('2026-07-25')).toBe(6);
    expect(isWeekday('2026-07-25')).toBe(false);
    expect(isWeekday('2026-07-26')).toBe(false); // Sunday
    expect(isWeekday('2026-07-27')).toBe(true); // Monday
    expect(isWeekday('2026-07-31')).toBe(true); // Friday
  });

  it('anchors weeks to Monday, with Sunday closing the prior week', () => {
    expect(weekStartKey('2026-07-27')).toBe('2026-07-27'); // Monday
    expect(weekStartKey('2026-07-31')).toBe('2026-07-27'); // Friday
    expect(weekStartKey('2026-07-26')).toBe('2026-07-20'); // Sunday
  });
});
