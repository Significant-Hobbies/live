import { z } from 'zod';

export const BucketUpdateInputSchema = z.object({
  id: z.uuid(),
  text: z.string().trim().min(1).max(2000),
});

export type BucketUpdateInput = z.infer<typeof BucketUpdateInputSchema>;
export type BucketItemUpdate = BucketUpdateInput & { createdAt: string };
