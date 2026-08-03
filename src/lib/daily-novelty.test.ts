import { describe, expect, it } from 'vitest';

import {
  areDailyIntentionsValid,
  DAILY_NOVELTIES,
  dailyNoveltyById,
  nextDailyNovelty,
  normalizeDailyIntentions,
  parseDailyIntentions,
  pickDailyNovelty,
} from './daily-novelty';

describe('daily novelty', () => {
  it('only exposes bounded, non-hard ideas', () => {
    expect(DAILY_NOVELTIES.length).toBeGreaterThan(20);
    expect(
      DAILY_NOVELTIES.every((item) => ['15 min', '30 min', '1 hour'].includes(item.timeEstimate))
    ).toBe(true);
  });

  it('keeps the same suggestion stable for a day and seed', () => {
    const first = pickDailyNovelty('2026-08-02', 'person-1');
    const second = pickDailyNovelty('2026-08-02', 'person-1');
    expect(second).toEqual(first);
    expect(dailyNoveltyById(first.id)).toEqual(first);
  });

  it('avoids recent suggestions when another eligible idea exists', () => {
    const initial = pickDailyNovelty('2026-08-02', 'person-1');
    const withoutRecent = pickDailyNovelty('2026-08-02', 'person-1', [initial.id]);
    expect(withoutRecent.id).not.toBe(initial.id);
  });

  it('moves to a different suggestion without resurfacing recent history', () => {
    const current = pickDailyNovelty('2026-08-02', 'person-1');
    const recent = DAILY_NOVELTIES.slice(0, 4).map((item) => item.id);
    const next = nextDailyNovelty('2026-08-02', 'person-1', current.id, recent);
    expect(next.id).not.toBe(current.id);
    expect(recent).not.toContain(next.id);
  });

  it('turns multiline and numbered input into separate daily intentions', () => {
    expect(parseDailyIntentions('1. Call Mum\n2) Cook something new\n- Take a walk')).toEqual([
      'Call Mum',
      'Cook something new',
      'Take a walk',
    ]);
    expect(normalizeDailyIntentions('1. Call Mum  2. Take a walk')).toBe('Call Mum\nTake a walk');
    expect(areDailyIntentionsValid('Call Mum\nTake a walk')).toBe(true);
    expect(areDailyIntentionsValid(`${'A'.repeat(161)}\nTake a walk`)).toBe(false);
  });
});
