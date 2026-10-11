import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SQLiteSyncDialect } from 'drizzle-orm/sqlite-core';
import { addBucketStep, removeBucketStep, setBucketStepDone } from './bucket-steps';

const { session, owned, insert, values, update, set, remove, where } = vi.hoisted(() => ({
  session: vi.fn(),
  owned: vi.fn(),
  insert: vi.fn(),
  values: vi.fn(),
  update: vi.fn(),
  set: vi.fn(),
  remove: vi.fn(),
  where: vi.fn(),
}));
vi.mock('~/server/auth', () => ({ getServerAuthSession: session }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('~/server/db', () => ({
  db: { query: { bucketListItems: { findFirst: owned } }, insert, update, delete: remove },
}));

beforeEach(() => {
  vi.clearAllMocks();
  session.mockResolvedValue({ user: { id: 'owner' } });
  owned.mockResolvedValue({ id: 'item' });
  insert.mockReturnValue({ values });
  values.mockReturnValue({ returning: async () => [{ id: 'new-step' }] });
  update.mockReturnValue({ set });
  set.mockReturnValue({ where });
  remove.mockReturnValue({ where });
  where.mockResolvedValue(undefined);
});

describe('bucket step action boundaries', () => {
  it('verifies parent ownership and inserts only a private manual UserQuest', async () => {
    expect(await addBucketStep('item', '  Ask a friend  ')).toEqual({ id: 'new-step' });
    const ownership = new SQLiteSyncDialect().sqlToQuery(owned.mock.calls[0]![0].where);
    expect(ownership.params).toEqual(['item', 'owner']);
    expect(insert).toHaveBeenCalledOnce();
    expect(values).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'owner',
        title: 'Ask a friend',
        type: 'bucket-step',
        status: 'active',
        visibility: 'private',
        sourceBucketItemId: 'item',
        questId: expect.stringMatching(/^step-.{10}$/),
      })
    );
  });
  it('cannot add to another account or insert empty/oversized wording', async () => {
    owned.mockResolvedValue(null);
    await expect(addBucketStep('other', 'A step')).rejects.toThrow('Item not found');
    await expect(addBucketStep('item', '   ')).rejects.toThrow();
    await expect(addBucketStep('item', 'x'.repeat(201))).rejects.toThrow();
    expect(insert).not.toHaveBeenCalled();
  });
  it('constrains completion, reopening and removal to the owner and manual type', async () => {
    await setBucketStepDone('step', true);
    expect(set).toHaveBeenLastCalledWith({ status: 'completed', completedAt: expect.any(Date) });
    await setBucketStepDone('step', false);
    expect(set).toHaveBeenLastCalledWith({ status: 'active', completedAt: null });
    await removeBucketStep('step');
    for (const [condition] of where.mock.calls) {
      expect(new SQLiteSyncDialect().sqlToQuery(condition).params).toEqual([
        'step',
        'owner',
        'bucket-step',
      ]);
    }
    expect(insert).not.toHaveBeenCalled();
  });
});
