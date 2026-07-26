/**
 * Felt units for the anonymous life-in-weeks surface.
 *
 * `mortality.ts` owns the grid maths and the remaining-life-expectancy curve —
 * including why that curve is conditional rather than "4,000 minus weeks
 * lived". This module answers a different question: what does the remainder
 * *feel* like? "1,100 weeks" is an abstraction. "1,100 Saturdays" is a
 * Tuesday-afternoon realisation.
 *
 * `remainingYears` is re-exported so callers of this module do not have to
 * reach past it into `mortality.ts` for the number the units are built from.
 *
 * Everything here is pure and deterministic given `now`, so the numbers shown
 * to a real person are covered by tests.
 */

import { remainingYears, weeksLived } from './mortality';

const WEEKS_PER_YEAR = 52;
/** Synodic month ≈ 29.53 days ≈ 4.219 weeks. */
const WEEKS_PER_LUNATION = 29.53059 / 7;

export { remainingYears };

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
