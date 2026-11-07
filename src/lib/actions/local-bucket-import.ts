'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { bucketItemUpdates, bucketListItems, userQuests } from '~/db/schema';
import { bucketTransferItemSchema, type BucketTransferItem } from '~/lib/bucket-list-data';
import { normalizeDreamTitle } from '~/lib/dream-atlas';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';

const payloadSchema = z
  .object({ items: z.array(bucketTransferItemSchema).min(1).max(100) })
  .strict()
  .refine(
    ({ items }) => new Set(items.map((item) => item.id)).size === items.length,
    'Each device item must have its own identifier.'
  );
async function sourceOwners(
  ids: string[],
  load: (chunk: string[]) => Promise<{ userId: string }[]>
) {
  const rows: { userId: string }[] = [];
  for (let index = 0; index < ids.length; index += 80)
    rows.push(...(await load(ids.slice(index, index + 80))));
  return rows;
}

type StoredItem = typeof bucketListItems.$inferSelect;

async function importId(owner: string, kind: string, source: string) {
  const hash = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(JSON.stringify(['live-bucket-import-v1', owner, kind, source]))
  );
  const hex = [...new Uint8Array(hash)]
    .slice(0, 16)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

async function checkSourceOwnership(items: BucketTransferItem[], owner: string) {
  const ids = items.map((item) => item.id);
  const stepIds = items.flatMap((item) => item.steps.map((step) => step.id));
  const updateIds = items.flatMap((item) => item.updates.map((update) => update.id));
  const [parents, steps, updates] = await Promise.all([
    sourceOwners(
      ids,
      async (chunk) =>
        await db
          .select({ userId: bucketListItems.userId })
          .from(bucketListItems)
          .where(inArray(bucketListItems.id, chunk))
    ),
    sourceOwners(
      stepIds,
      async (chunk) =>
        await db
          .select({ userId: userQuests.userId })
          .from(userQuests)
          .where(inArray(userQuests.id, chunk))
    ),
    sourceOwners(
      updateIds,
      async (chunk) =>
        await db
          .select({ userId: bucketItemUpdates.userId })
          .from(bucketItemUpdates)
          .where(inArray(bucketItemUpdates.id, chunk))
    ),
  ]);
  if ([...parents, ...steps, ...updates].some((row) => row.userId !== owner))
    throw new Error('A device record identifier is already in use. Your device copy is safe.');
}

function scalarConflict(item: BucketTransferItem, existing: StoredItem) {
  const sameDate = (source: string | null | undefined, stored: Date | null) =>
    !source ||
    (stored !== null &&
      Math.floor(new Date(source).getTime() / 1000) === Math.floor(stored.getTime() / 1000));
  const fields = [
    [item.notes, existing.description],
    [item.targetYear, existing.targetYear],
    [item.category, existing.category],
    [item.sourceSlug, existing.sourceSlug],
    [item.sourceItemTitle, existing.sourceItemTitle],
  ];
  return (
    normalizeDreamTitle(item.title) !== normalizeDreamTitle(existing.title) ||
    item.status !== existing.status ||
    !sameDate(item.createdAt, existing.createdAt) ||
    !sameDate(item.completedAt, existing.completedAt) ||
    fields.some(([local, saved]) => local != null && local !== saved)
  );
}

async function graphMatches(item: BucketTransferItem, parent: StoredItem, owner: string) {
  if (scalarConflict(item, parent)) return false;
  const [steps, updates] = await Promise.all([
    db.select().from(userQuests).where(eq(userQuests.sourceBucketItemId, parent.id)),
    db.select().from(bucketItemUpdates).where(eq(bucketItemUpdates.itemId, parent.id)),
  ]);
  for (const step of item.steps) {
    const id = await importId(owner, 'step', `${item.id}/${step.id}`);
    if (
      !steps.some(
        (row) =>
          row.id === id &&
          row.userId === owner &&
          row.title === step.text &&
          row.questId.startsWith('bc-import-') === Boolean(step.readOnly) &&
          (row.status === 'completed') === step.done
      )
    )
      return false;
  }
  for (const update of item.updates) {
    const id = await importId(owner, 'update', `${item.id}/${update.id}`);
    if (
      !updates.some(
        (row) =>
          row.id === id &&
          row.userId === owner &&
          row.text === update.text &&
          Math.floor(row.createdAt.getTime() / 1000) ===
            Math.floor(new Date(update.createdAt).getTime() / 1000)
      )
    )
      return false;
  }
  return true;
}

async function insertGraph(item: BucketTransferItem, id: string, owner: string) {
  const now = new Date();
  const date = (value: string | null | undefined) => (value ? new Date(value) : now);
  const parent = db
    .insert(bucketListItems)
    .values({
      id,
      userId: owner,
      title: item.title,
      description: item.notes ?? null,
      category: item.category ?? null,
      status: item.status,
      visibility: 'private',
      targetYear: item.targetYear ?? null,
      sourceSlug: item.sourceSlug ?? null,
      sourceItemTitle: item.sourceItemTitle ?? null,
      createdAt: date(item.createdAt),
      updatedAt: date(item.updatedAt),
      completedAt: item.status === 'done' ? date(item.completedAt) : null,
    })
    .onConflictDoNothing();
  const stepIds = await Promise.all(
    item.steps.map((step) => importId(owner, 'step', `${item.id}/${step.id}`))
  );
  const updateIds = await Promise.all(
    item.updates.map((update) => importId(owner, 'update', `${item.id}/${update.id}`))
  );
  const steps = item.steps.map((step, index) =>
    db
      .insert(userQuests)
      .values({
        id: stepIds[index]!,
        userId: owner,
        questId: `${step.readOnly ? 'bc-import' : 'bucket-import'}-${stepIds[index]}`,
        type: 'bucket-step',
        sourceBucketItemId: id,
        title: step.text,
        status: step.done ? 'completed' : 'active',
        visibility: 'private',
        completedAt: step.done ? date(item.updatedAt) : null,
      })
      .onConflictDoNothing()
  );
  const updates = item.updates.map((update, index) =>
    db
      .insert(bucketItemUpdates)
      .values({
        id: updateIds[index]!,
        itemId: id,
        userId: owner,
        text: update.text,
        createdAt: new Date(update.createdAt),
      })
      .onConflictDoNothing()
  );
  await db.batch([parent, ...steps, ...updates]);
}

export async function importLocalBucketItems(input: { items: BucketTransferItem[] }): Promise<{
  success: boolean;
  imported: number;
  matched: number;
  conflicts: string[];
  error?: string;
}> {
  const session = await getServerAuthSession();
  if (!session?.user.id) throw new Error('Not authenticated');
  const parsed = payloadSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      imported: 0,
      matched: 0,
      conflicts: [],
      error: 'Some device items could not be validated. Your device copy is safe.',
    };
  const { items } = parsed.data;
  if (items.reduce((count, item) => count + item.steps.length + item.updates.length, 0) > 1000)
    return {
      success: false,
      imported: 0,
      matched: 0,
      conflicts: [],
      error: 'Import up to 1,000 steps and updates at a time. Your device copy is safe.',
    };
  let imported = 0;
  let matched = 0;
  const conflicts: string[] = [];
  try {
    await checkSourceOwnership(items, session.user.id);
    const existing = await db
      .select()
      .from(bucketListItems)
      .where(eq(bucketListItems.userId, session.user.id));
    for (const item of items) {
      const id = await importId(session.user.id, 'item', item.id);
      const duplicate = existing.find(
        (row) => row.id === id || normalizeDreamTitle(row.title) === normalizeDreamTitle(item.title)
      );
      if (duplicate) {
        if (await graphMatches(item, duplicate, session.user.id)) matched += 1;
        else conflicts.push(item.title);
        continue;
      }
      await insertGraph(item, id, session.user.id);
      const saved = await db.query.bucketListItems.findFirst({ where: eq(bucketListItems.id, id) });
      if (
        !saved ||
        saved.userId !== session.user.id ||
        !(await graphMatches(item, saved, session.user.id))
      )
        throw new Error('The saved device list could not be confirmed.');
      existing.push(saved);
      imported += 1;
    }
    for (const path of ['/bucket-list', '/live-more', '/']) revalidatePath(path);
    return { success: true, imported, matched, conflicts };
  } catch {
    return {
      success: false,
      imported,
      matched,
      conflicts,
      error:
        'Import could not be confirmed. Your device copy is safe; retry without creating duplicates.',
    };
  }
}
