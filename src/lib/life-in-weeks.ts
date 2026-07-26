/**
 * Felt units for the anonymous life-in-weeks surface.
 *
 * `mortality.ts` gives the dashboard's fixed 4,000-week grid. This module
 * answers a different question — what does the *remainder* feel like? "1,100
 * weeks" is an abstraction. "1,100 Saturdays" is a Tuesday-afternoon
 * realisation.
 *
 * ## Why this does not use LIFE_EXPECTANCY_WEEKS
 *
 * The 4,000-week figure is life expectancy *at birth*, and subtracting weeks
 * lived from it is a well-known way to be wrong about older people. Life
 * expectancy is conditional: reaching 65 means you have already survived every
 * risk that removed people before 65, so your expected remaining years are far
 * higher than "77 minus your age" implies. At 64 that naive model predicts ~13
 * more years; the actual figure is ~21.
 *
 * Getting that wrong is not a rounding error. It hands the oldest reader — the
 * one most likely to take it to heart — a number that is both false and bleak.
 * So this module interpolates a real remaining-life-expectancy curve instead,
 * and by construction it never returns zero.
 *
 * Everything here is pure and deterministic given `now`, so the numbers shown
 * to a real person are covered by tests.
 */

import { weeksLived } from './mortality';

const WEEKS_PER_YEAR = 52;
/** Synodic month ≈ 29.53 days ≈ 4.219 weeks. */
const WEEKS_PER_LUNATION = 29.53059 / 7;

/**
 * Remaining life expectancy in years, by current age. Anchor points from
 * period life-table data (both sexes, high-income average), rounded — this is
 * a reflective tool, not an actuarial product.
 *
 * The curve's defining property: it decreases with age but never reaches zero,
 * because at every age the people still alive have a future.
 */
const REMAINING_YEARS_BY_AGE: ReadonlyArray<readonly [age: number, years: number]> = [
  [0, 77],
  [10, 68],
  [20, 58],
  [30, 48],
  [40, 39],
  [50, 30],
  [60, 22],
  [65, 18],
  [70, 14.5],
  [75, 11.5],
  [80, 8.5],
  [85, 6],
  [90, 4.2],
  [95, 3],
  [100, 2.2],
];

/** Floor for anyone past the end of the table. Never zero. */
const MIN_REMAINING_YEARS = 2;

/**
 * Linearly interpolated remaining life expectancy, in years, for a given age.
 * Exported for tests — the monotonicity and never-zero properties are the
 * whole point of this module.
 */
export function remainingYears(age: number): number {
  if (age <= 0) return REMAINING_YEARS_BY_AGE[0][1];

  for (let i = 0; i < REMAINING_YEARS_BY_AGE.length - 1; i += 1) {
    const [lowAge, lowYears] = REMAINING_YEARS_BY_AGE[i];
    const [highAge, highYears] = REMAINING_YEARS_BY_AGE[i + 1];
    if (age >= lowAge && age <= highAge) {
      const t = (age - lowAge) / (highAge - lowAge);
      return lowYears + t * (highYears - lowYears);
    }
  }

  return MIN_REMAINING_YEARS;
}

export type FeltUnit = {
  id: 'saturdays' | 'summers' | 'fullMoons' | 'mornings';
  count: number;
  label: string;
};

export type LifeInWeeks = {
  birthYear: number;
  age: number;
  weeksLived: number;
  weeksRemaining: number;
  /** Weeks lived + weeks remaining. The grid is drawn to this length. */
  totalWeeks: number;
  units: FeltUnit[];
};

/** Lowest birth year the input accepts. */
export const MIN_BIRTH_YEAR = 1900;

/**
 * Validates a raw birth-year input. Returns null when it is not a usable year,
 * so the caller can hold the empty state rather than render a bogus grid.
 */
export function parseBirthYear(raw: string | number, now: Date = new Date()): number | null {
  const year = typeof raw === 'number' ? raw : Number.parseInt(String(raw).trim(), 10);
  if (!Number.isInteger(year)) return null;
  if (year < MIN_BIRTH_YEAR) return null;
  // A birth year in the future, or this year, yields a grid with nothing in it.
  if (year >= now.getFullYear()) return null;
  return year;
}

function feltUnits(weeksRemaining: number): FeltUnit[] {
  return [
    { id: 'saturdays', count: weeksRemaining, label: 'Saturdays' },
    { id: 'summers', count: Math.round(weeksRemaining / WEEKS_PER_YEAR), label: 'Summers' },
    {
      id: 'fullMoons',
      count: Math.round(weeksRemaining / WEEKS_PER_LUNATION),
      label: 'Full moons',
    },
    { id: 'mornings', count: weeksRemaining * 7, label: 'Mornings' },
  ];
}

/** The whole derivation for one birth year. */
export function lifeInWeeks(birthYear: number, now: Date = new Date()): LifeInWeeks {
  const birth = new Date(birthYear, 0, 1);
  const lived = weeksLived(birth, now);
  const age = now.getFullYear() - birthYear;
  const remaining = Math.round(remainingYears(age) * WEEKS_PER_YEAR);

  return {
    birthYear,
    age,
    weeksLived: lived,
    weeksRemaining: remaining,
    totalWeeks: lived + remaining,
    units: feltUnits(remaining),
  };
}
