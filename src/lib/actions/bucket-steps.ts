'use server';

import { and, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { bucketListItems, userQuests } from '~/db/schema';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';

export async function addBucketStep(itemId: string, text: string): Promise<{ id: string }> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) throw new Error('Not authenticated');
  const title = z.string().trim().min(1).max(200).parse(text);
  const item = await db.query.bucketListItems.findFirst({
    where: and(eq(bucketListItems.id, itemId), eq(bucketListItems.userId, session.user.id)),
    columns: { id: true },
  });
  if (!item) throw new Error('Item not found');
  const [row] = await db
    .insert(userQuests)
    .values({
      userId: session.user.id,
      questId: `step-${nanoid(10)}`,
      type: 'bucket-step',
      title,
      sourceBucketItemId: itemId,
      status: 'active',
      visibility: 'private',
    })
    .returning({ id: userQuests.id });
  if (!row) throw new Error('Step could not be saved');
  revalidatePath('/bucket-list');
  return row;
}

export async function setBucketStepDone(stepId: string, done: boolean): Promise<void> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) throw new Error('Not authenticated');
  await db
    .update(userQuests)
    .set({
      status: done ? 'completed' : 'active',
      completedAt: done ? new Date() : null,
    })
    .where(
      and(
        eq(userQuests.id, stepId),
        eq(userQuests.userId, session.user.id),
        eq(userQuests.type, 'bucket-step')
      )
    );
  revalidatePath('/bucket-list');
}

export async function removeBucketStep(stepId: string): Promise<void> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) throw new Error('Not authenticated');
  await db
    .delete(userQuests)
    .where(
      and(
        eq(userQuests.id, stepId),
        eq(userQuests.userId, session.user.id),
        eq(userQuests.type, 'bucket-step')
      )
    );
  revalidatePath('/bucket-list');
}
