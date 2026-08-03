import { describe, expect, it } from 'vitest';

import {
  lifeInWeeks,
  lifeInWeeksFromDate,
  MIN_BIRTH_YEAR,
  parseBirthDate,
  parseBirthYear,
  remainingYears,
} from './life-in-weeks';

// Fixed "now" so every assertion below is a real number, not a moving target.
const NOW = new Date(2026, 6, 26); // 2026-07-26

describe('parseBirthDate', () => {
  it('accepts real past dates and rejects impossible or future dates', () => {
    expect(parseBirthDate('2000-02-29', NOW)).toBe('2000-02-29');
    expect(parseBirthDate('2001-02-29', NOW)).toBeNull();
    expect(parseBirthDate('2027-01-01', NOW)).toBeNull();
  });

  it('uses the exact birthday for age and lived weeks', () => {
    const exact = lifeInWeeksFromDate('2000-07-27', NOW);
    const approximate = lifeInWeeks(2000, NOW);
    expect(exact.age).toBe(25);
    expect(exact.weeksLived).toBeLessThan(approximate.weeksLived);
  });
});

describe('parseBirthYear', () => {
  it('accepts a plain year', () => {
    expect(parseBirthYear('1964', NOW)).toBe(1964);
    expect(parseBirthYear(1964, NOW)).toBe(1964);
  });

  it('tolerates surrounding whitespace', () => {
    expect(parseBirthYear('  1964 ', NOW)).toBe(1964);
  });

  it('rejects non-years rather than rendering a bogus grid', () => {
    expect(parseBirthYear('', NOW)).toBeNull();
    expect(parseBirthYear('not a year', NOW)).toBeNull();
    // parseInt takes the leading 19, which then fails the MIN_BIRTH_YEAR floor.
    expect(parseBirthYear('19.5', NOW)).toBeNull();
    expect(parseBirthYear('19', NOW)).toBeNull();
  });

  it('rejects years before the floor', () => {
    expect(parseBirthYear(MIN_BIRTH_YEAR - 1, NOW)).toBeNull();
    expect(parseBirthYear(MIN_BIRTH_YEAR, NOW)).toBe(MIN_BIRTH_YEAR);
  });

  it('rejects the current year and the future — the grid would be empty', () => {
    expect(parseBirthYear(2026, NOW)).toBeNull();
    expect(parseBirthYear(2030, NOW)).toBeNull();
    expect(parseBirthYear(2025, NOW)).toBe(2025);
  });
});

/**
 * These three properties are the reason this module exists rather than
 * subtracting from a fixed 4,000. Breaking any of them means showing someone a
 * number that is either false or cruel.
 */
describe('remainingYears', () => {
  it('never returns zero or negative, at any age', () => {
    for (let age = 0; age <= 120; age += 1) {
      expect(remainingYears(age), `age ${age}`).toBeGreaterThan(0);
    }
  });

  it('decreases monotonically with age', () => {
    for (let age = 1; age <= 120; age += 1) {
      expect(remainingYears(age), `age ${age}`).toBeLessThanOrEqual(remainingYears(age - 1));
    }
  });

  it('is conditional — an older person is not "77 minus age"', () => {
    // The naive model would give a 64-year-old ~13 years. The real figure is
    // far higher, and this gap is the whole point.
    const naive = 77 - 64;
    expect(remainingYears(64)).toBeGreaterThan(naive + 5);
    // Same at 80: naive says ~-3, reality is ~8.5.
    expect(remainingYears(80)).toBeGreaterThan(7);
  });

  it('interpolates between table anchors', () => {
    // Age 55 sits halfway between the 50 (30y) and 60 (22y) anchors.
    expect(remainingYears(55)).toBeCloseTo(26, 5);
  });
});

describe('lifeInWeeks', () => {
  it('derives felt units for someone mid-life', () => {
    const result = lifeInWeeks(1990, NOW);

    expect(result.age).toBe(36);
    // Jan 1 1990 → Jul 26 2026 is ~1908 weeks.
    expect(result.weeksLived).toBeGreaterThan(1900);
    expect(result.weeksLived).toBeLessThan(1915);
    expect(result.totalWeeks).toBe(result.weeksLived + result.weeksRemaining);

    const saturdays = result.units.find((u) => u.id === 'saturdays');
    expect(saturdays?.count).toBe(result.weeksRemaining);

    const mornings = result.units.find((u) => u.id === 'mornings');
    expect(mornings?.count).toBe(result.weeksRemaining * 7);

    // ~42 summers left at 36.
    const summers = result.units.find((u) => u.id === 'summers');
    expect(summers?.count).toBeGreaterThan(39);
    expect(summers?.count).toBeLessThan(46);
  });

  /**
   * The regression that matters most. A parent-aged reader must get a figure
   * that matches reality — the naive model said 12 summers here, which was both
   * wrong and the bleakest possible way to be wrong.
   */
  it('gives a 64-year-old ~21 summers, not the naive ~13', () => {
    const result = lifeInWeeks(1962, NOW);
    expect(result.age).toBe(64);

    const summers = result.units.find((u) => u.id === 'summers');
    expect(summers?.count).toBeGreaterThan(18);
    expect(summers?.count).toBeLessThan(24);
  });

  it('never shows anyone a zero, however old', () => {
    for (let year = MIN_BIRTH_YEAR; year <= 2025; year += 1) {
      const result = lifeInWeeks(year, NOW);
      expect(result.weeksRemaining, `born ${year}`).toBeGreaterThan(0);
      for (const unit of result.units) {
        expect(unit.count, `born ${year}, unit ${unit.id}`).toBeGreaterThan(0);
      }
    }
  });

  it('draws a longer total grid for an older person', () => {
    // Because remaining life expectancy is conditional, someone who has already
    // reached 90 has an expected total lifespan above the population average.
    const younger = lifeInWeeks(1996, NOW); // 30
    const older = lifeInWeeks(1936, NOW); // 90
    expect(older.totalWeeks).toBeGreaterThan(younger.totalWeeks);
  });
});
