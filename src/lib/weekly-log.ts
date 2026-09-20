// Weekly log — the private weekly reckoning.
//
// Pure week math shared by the account actions, the local store, and the
// surface. `weekOf` keys are always the YYYY-MM-DD of the week's starting
// day *as stored* — changing the week-start preference never rewrites
// existing keys, it only changes how new days bucket.

import { dayOfWeek, shiftDayKey, weekStartKey } from '~/lib/day';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export type WeekStartsOn = 'monday' | 'sunday';

const DEFAULT_WEEK_STARTS_ON: WeekStartsOn = 'monday';

export function normalizeWeekStartsOn(value: unknown): WeekStartsOn {
  return value === 'sunday' ? 'sunday' : DEFAULT_WEEK_STARTS_ON;
}

/**
 * The week-start day key for the week containing `dayKey`.
 * Monday-start delegates to the existing `weekStartKey`; Sunday-start
 * returns the most recent Sunday on or before the day.
 */
export function weekStartFor(dayKey: string, weekStartsOn: WeekStartsOn): string {
  if (!ISO_DATE_PATTERN.test(dayKey)) {
    throw new Error('dayKey must use YYYY-MM-DD format');
  }
  if (weekStartsOn === 'monday') return weekStartKey(dayKey);
  const dow = dayOfWeek(dayKey); // 0 = Sunday
  return shiftDayKey(dayKey, -dow);
}

/** The day key one week after a week-start key. */
export function weekEndExclusive(weekOf: string): string {
  return shiftDayKey(weekOf, 7);
}

/**
 * Whether `dayKey` is the log's suggested writing moment — Sunday.
 * Sunday sits at the end of a Monday-start week and the start of a
 * Sunday-start week; either way it is the natural pause. The suggestion
 * never gates writing.
 */
export function isSuggestedLogDay(dayKey: string): boolean {
  return dayOfWeek(dayKey) === 0;
}

const WEEK_OF_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

function keyToDate(dayKey: string): Date {
  return new Date(`${dayKey}T12:00:00`);
}

/** "Week of March 9, 2026" — display label for a week-start key. */
export function formatWeekOf(weekOf: string): string {
  return `Week of ${WEEK_OF_FORMAT.format(keyToDate(weekOf))}`;
}

/** "Mar 9 – Mar 15" — the inclusive span a weekOf key covers. */
export function formatWeekSpan(weekOf: string): string {
  const start = keyToDate(weekOf);
  const end = keyToDate(shiftDayKey(weekOf, 6));
  const monthDay = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
  return `${monthDay.format(start)} – ${monthDay.format(end)}`;
}

/**
 * How long a dream can sit untouched before the log gently asks about it.
 * Deliberately generous — this is a reconsideration prompt, not a deadline.
 */
export const STALE_DREAM_DAYS = 21;

/**
 * Which dreams an entry touched — the honest reconciliation between what
 * someone wants and what they actually lived. Matching is deliberately
 * plain: a dream counts as touched when its title shares a meaningful
 * word with the entry, or when the entry names its category. No fake
 * state is written; this only reads.
 */
export function detectDreamTouches(
  entryText: string,
  dreams: Array<{ title: string; category?: string | null }>
): string[] {
  const text = entryText.toLowerCase();
  if (!text.trim()) return [];
  const words = new Set(text.match(/[a-z]{3,}/g) ?? []);
  return dreams
    .filter((dream) => {
      const titleWords = (dream.title.toLowerCase().match(/[a-z]{4,}/g) ?? []).filter(
        (word) => !DREAM_TITLE_STOPWORDS.has(word)
      );
      const titleHit = titleWords.some((word) => words.has(word) || text.includes(word));
      const categoryHit =
        !!dream.category &&
        dream.category.length > 3 &&
        text.includes(dream.category.toLowerCase());
      return titleHit || categoryHit;
    })
    .map((dream) => dream.title);
}

// Words so common in dream titles they would match anything.
const DREAM_TITLE_STOPWORDS = new Set([
  'learn',
  'make',
  'take',
  'have',
  'with',
  'from',
  'this',
  'that',
  'more',
  'some',
  'your',
  'life',
  'want',
  'something',
  'things',
  'start',
  'every',
  'first',
  'year',
  'week',
  'trip',
]);
