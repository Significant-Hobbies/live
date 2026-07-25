// Calendar-day helpers.
//
// Every `dayDate` column in the schema is documented as a *user-local*
// YYYY-MM-DD key. Resolving it with `new Date().toISOString().slice(0, 10)`
// silently makes it UTC, which on Cloudflare Workers is the server zone. For a
// user in Asia/Dubai (UTC+4) that rolls the day at 04:00 local and keeps the
// AM greeting until 16:00 local, so writing at 01:00 lands on the previous day.
//
// Resolve the key in the user's own zone instead. `timeZone` is an IANA name
// (`users.timezone`); when it is missing or unrecognised these fall back to UTC,
// which is the old behaviour rather than a crash.

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** True if `timeZone` is an IANA zone this runtime understands. */
export function isValidTimeZone(timeZone: string): boolean {
  if (!timeZone) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone });
    return true;
  } catch {
    return false;
  }
}

function partsIn(timeZone: string, at: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-US', { timeZone, ...options }).formatToParts(at);
}

/** The YYYY-MM-DD calendar day `at` falls on, as seen from `timeZone`. */
export function dayKeyIn(timeZone: string | null | undefined, at: Date = new Date()): string {
  const utcKey = at.toISOString().slice(0, 10);
  if (!timeZone) return utcKey;
  try {
    const parts = partsIn(timeZone, at, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const value = (type: string) => parts.find((p) => p.type === type)?.value;
    const year = value('year');
    const month = value('month');
    const day = value('day');
    if (!year || !month || !day) return utcKey;
    const key = `${year}-${month}-${day}`;
    return ISO_DATE_PATTERN.test(key) ? key : utcKey;
  } catch {
    return utcKey;
  }
}

/** Hour of day (0-23) at `at`, as seen from `timeZone`. */
export function hourIn(timeZone: string | null | undefined, at: Date = new Date()): number {
  if (!timeZone) return at.getUTCHours();
  try {
    const raw = partsIn(timeZone, at, { hour: '2-digit', hour12: false }).find(
      (p) => p.type === 'hour'
    )?.value;
    const hour = Number(raw);
    // Some ICU builds render midnight as "24" under hour12: false.
    if (!Number.isInteger(hour) || hour < 0 || hour > 24) return at.getUTCHours();
    return hour === 24 ? 0 : hour;
  } catch {
    return at.getUTCHours();
  }
}

/** Whether it is before noon for the user — picks the AM vs PM ritual prompt. */
export function isMorningIn(timeZone: string | null | undefined, at: Date = new Date()): boolean {
  return hourIn(timeZone, at) < 12;
}

/**
 * Shifts a YYYY-MM-DD key by whole days.
 *
 * Pure string/UTC arithmetic — the key is already resolved to the user's zone,
 * so re-introducing a zone here would double-apply the offset.
 */
export function shiftDayKey(dayKey: string, deltaDays: number): string {
  if (!ISO_DATE_PATTERN.test(dayKey)) {
    throw new Error('dayKey must use YYYY-MM-DD format');
  }
  const date = new Date(`${dayKey}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error('dayKey must be a valid calendar date');
  }
  date.setUTCDate(date.getUTCDate() + deltaDays);
  return date.toISOString().slice(0, 10);
}

/** Day of week for a day key: 0 = Sunday … 6 = Saturday. */
export function dayOfWeek(dayKey: string): number {
  if (!ISO_DATE_PATTERN.test(dayKey)) {
    throw new Error('dayKey must use YYYY-MM-DD format');
  }
  return new Date(`${dayKey}T00:00:00.000Z`).getUTCDay();
}

/** True for Monday–Friday. */
export function isWeekday(dayKey: string): boolean {
  const dow = dayOfWeek(dayKey);
  return dow >= 1 && dow <= 5;
}

/** The Monday of the week containing `dayKey`. */
export function weekStartKey(dayKey: string): string {
  const dow = dayOfWeek(dayKey);
  // Sunday (0) belongs to the week that started the previous Monday.
  const backToMonday = dow === 0 ? 6 : dow - 1;
  return shiftDayKey(dayKey, -backToMonday);
}
