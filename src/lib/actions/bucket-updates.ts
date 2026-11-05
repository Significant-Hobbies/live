'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { bucketItemUpdates, bucketListItems } from '~/db/schema';
import {
  BucketUpdateInputSchema,
  type BucketItemUpdate,
  type BucketUpdateInput,
} from '~/lib/bucket-updates';
import { enforceRateLimit } from '~/lib/rate-limit';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';

export async function addBucketItemUpdate(
  itemId: string,
  input: BucketUpdateInput
): Promise<BucketItemUpdate> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) throw new Error('Not authenticated');
  const update = BucketUpdateInputSchema.parse(input);
  await enforceRateLimit('bucketList', session.user.id);
  const item = await db.query.bucketListItems.findFirst({
    where: and(eq(bucketListItems.id, itemId), eq(bucketListItems.userId, session.user.id)),
    columns: { id: true },
  });
  if (!item) throw new Error('Item not found');
  // Replays return the stored post so the client can recover an uncertain save.
  await db
    .insert(bucketItemUpdates)
    .values({ ...update, itemId, userId: session.user.id, createdAt: new Date() })
    .onConflictDoNothing({ target: bucketItemUpdates.id });
  const saved = await db.query.bucketItemUpdates.findFirst({
    where: and(
      eq(bucketItemUpdates.id, update.id),
      eq(bucketItemUpdates.itemId, itemId),
      eq(bucketItemUpdates.userId, session.user.id)
    ),
  });
  if (!saved) throw new Error('Update could not be saved');
  revalidatePath('/bucket-list');
  return { id: saved.id, text: saved.text, createdAt: saved.createdAt.toISOString() };
}
