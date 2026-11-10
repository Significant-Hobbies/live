import { z } from 'zod';

export const bucketTargetDateSchema = z.iso
  .date()
  .refine((value) => value >= '1900-01-01' && value <= '2200-12-31', {
    message: 'Choose a date between 1900 and 2200.',
  });

export function bucketTargetPatch(patch: {
  targetDate?: string | null;
  targetYear?: number | null;
}) {
  if (patch.targetDate != null) {
    const targetDate = bucketTargetDateSchema.parse(patch.targetDate);
    return { targetDate, targetYear: Number(targetDate.slice(0, 4)) };
  }
  if (patch.targetYear !== undefined) return { targetYear: patch.targetYear, targetDate: null };
  return patch.targetDate === null ? { targetDate: null } : {};
}

export function formatBucketTargetDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}
