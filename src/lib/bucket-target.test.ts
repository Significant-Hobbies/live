import { describe, expect, it } from 'vitest';
import { bucketTargetDateSchema, bucketTargetPatch, formatBucketTargetDate } from './bucket-target';

describe('tentative bucket-list dates', () => {
  it('keeps a date as a calendar day and derives the compatible target year', () => {
    expect(bucketTargetPatch({ targetDate: '2028-02-29', targetYear: 2030 })).toEqual({
      targetDate: '2028-02-29',
      targetYear: 2028,
    });
    expect(formatBucketTargetDate('2028-02-29')).toBe('29 Feb 2028');
  });

  it('preserves year-only plans and lets an exact date be cleared separately', () => {
    expect(bucketTargetPatch({ targetYear: 2030 })).toEqual({ targetYear: 2030, targetDate: null });
    expect(bucketTargetPatch({ targetYear: null })).toEqual({ targetYear: null, targetDate: null });
    expect(bucketTargetPatch({ targetDate: null })).toEqual({ targetDate: null });
    expect(bucketTargetPatch({})).toEqual({});
  });

  it('rejects impossible days, timestamps, and dates outside the supported year range', () => {
    for (const value of [
      '2027-02-29',
      '2030-04-31',
      '2030-1-1',
      '2030-01-01T00:00:00Z',
      '1899-12-31',
      '2201-01-01',
    ])
      expect(bucketTargetDateSchema.safeParse(value).success, value).toBe(false);
  });
});
