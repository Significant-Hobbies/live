// Mortality framing — the life-in-weeks lens.
// Pure, timezone-independent math over calendar weeks. All functions are
// deterministic given a birth date and "now", so they're trivially testable.

/**
 * ≈ 76.9 years. The canonical "4,000 weeks" figure from Oliver Burkeman.
 *
 * Only a fallback now: it sizes the grid for a user who has not told us their
 * birth year. Once a birth year is known the grid runs to
 * `weeksLived + weeksRemaining` instead — see `remainingYears`.
 */
export const LIFE_EXPECTANCY_WEEKS = 4000;
const WEEKS_PER_YEAR = 52;

/**
 * Remaining life expectancy in years, by current age. Anchor points from
 * period life-table data (both sexes, high-income average), rounded — this is
 * a reflective tool, not an actuarial product.
 *
 * ## Why the grid is not 4,000 minus weeks lived
 *
 * 4,000 weeks is life expectancy *at birth*, and subtracting age from it is a
 * well-known way to be wrong about older people. Life expectancy is
 * conditional: reaching 65 means you have already survived everything that
 * removed people before 65, so your expected remaining years are far higher
 * than "77 minus your age" implies. At 71 the naive sum predicts ~6 years
 * against a real figure near 14, and past 77 it hits zero — a fully dark grid
 * telling someone they have no weeks left, on a page that also renders their
 * public profile.
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
 * Monotonic and strictly positive at every age — both asserted in the tests,
 * because they are the properties that keep the grid honest and humane.
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

type LifeGridCell = {
  weekIndex: number; // 0-indexed from birth
  lived: boolean;
  // Whether this week falls within a commitment the user was actively
  // practicing (lit up on the grid). Derived from stamped week dates.
  stamped: boolean;
};

export type LifeGrid = {
  weeksLived: number;
  weeksRemaining: number;
  totalWeeks: number;
  yearsLived: number;
  cells: LifeGridCell[];
};

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Whole weeks lived since `birth`. A week counts as lived once it has fully
 * elapsed; the current in-progress week is not counted.
 */
export function weeksLived(birth: Date | null | undefined, now: Date = new Date()): number {
  if (!birth) return 0;
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const elapsed = startOfDay(now).getTime() - startOfDay(birth).getTime();
  if (elapsed <= 0) return 0;
  return Math.floor(elapsed / msPerWeek);
}

export function yearsLived(birth: Date | null | undefined, now: Date = new Date()): number {
  if (!birth) return 0;
  return Math.floor(weeksLived(birth, now) / WEEKS_PER_YEAR);
}

/**
 * Convert a birthYear (as stored on the user row) into an approximate birth
 * date. We assume a Jan 1 birthday — the grid is a rough existential mirror,
 * not a medical record.
 */
export function birthDateFromYear(birthYear: number | null | undefined): Date | null {
  if (!birthYear || birthYear < 1900 || birthYear > new Date().getFullYear()) return null;
  return new Date(birthYear, 0, 1);
}

/**
 * Build the full life grid: one cell per week of the life, lived and expected.
 * `stampedWeekIndices` is a Set of 0-indexed week numbers that contained at
 * least one stamp (practice session).
 *
 * The grid length is personal — `weeksLived + weeksRemaining` — so an older
 * user gets a longer grid, which is what conditional life expectancy means.
 * Without a birth year there is no age to condition on, so it falls back to
 * the flat LIFE_EXPECTANCY_WEEKS.
 */
export function buildLifeGrid(
  birth: Date | null | undefined,
  stampedWeekIndices: Set<number>,
  now: Date = new Date()
): LifeGrid {
  const lived = weeksLived(birth, now);
  const remaining = birth
    ? Math.round(remainingYears(yearsLived(birth, now)) * WEEKS_PER_YEAR)
    : LIFE_EXPECTANCY_WEEKS;
  const total = lived + remaining;

  const cells: LifeGridCell[] = [];
  for (let i = 0; i < total; i++) {
    cells.push({
      weekIndex: i,
      lived: i < lived,
      stamped: stampedWeekIndices.has(i),
    });
  }
  return {
    weeksLived: lived,
    weeksRemaining: remaining,
    totalWeeks: total,
    yearsLived: yearsLived(birth, now),
    cells,
  };
}

/**
 * Given a birth date and a calendar day string 'YYYY-MM-DD', return the
 * 0-indexed week-of-life that day falls in. Used to light up grid cells from
 * stamp dates.
 */
export function weekIndexForDay(birth: Date | null | undefined, dayDate: string): number | null {
  if (!birth) return null;
  // Parse YYYY-MM-DD as local time, not UTC, to avoid off-by-one.
  const [y, m, d] = dayDate.split('-').map(Number);
  if (!y || !m || !d) return null;
  const day = new Date(y, m - 1, d);
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const elapsed = startOfDay(day).getTime() - startOfDay(birth).getTime();
  if (elapsed < 0) return null;
  return Math.floor(elapsed / msPerWeek);
}
