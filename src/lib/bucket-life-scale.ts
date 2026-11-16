import { z } from 'zod';

export const BUCKET_LIFE_SCALE_VALUES = ['moment', 'adventure', 'chapter'] as const;
export const bucketLifeScaleSchema = z.enum(BUCKET_LIFE_SCALE_VALUES);
export type BucketLifeScale = z.infer<typeof bucketLifeScaleSchema>;

export const BUCKET_LIFE_SCALES: Record<BucketLifeScale, { label: string; description: string }> = {
  moment: { label: 'Moment', description: 'Something to experience, even once.' },
  adventure: {
    label: 'Adventure',
    description: 'A journey of its own.',
  },
  chapter: { label: 'Chapter', description: 'Something to make room for.' },
};
