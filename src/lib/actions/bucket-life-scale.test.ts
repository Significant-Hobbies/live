import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SQLiteSyncDialect } from 'drizzle-orm/sqlite-core';
import { updateBucketListItem } from './bucket-list';

const { session, update, set, where, returning, me } = vi.hoisted(() => ({
  session: vi.fn(),
  update: vi.fn(),
  set: vi.fn(),
  where: vi.fn(),
  returning: vi.fn(),
  me: vi.fn(),
}));
vi.mock('~/server/auth', () => ({ getServerAuthSession: session }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('~/lib/analytics', () => ({ trackCoreAction: vi.fn() }));
vi.mock('~/server/db', () => ({
  db: { update, query: { users: { findFirst: me } } },
}));

beforeEach(() => {
  vi.clearAllMocks();
  session.mockResolvedValue({ user: { id: 'owner' } });
  update.mockReturnValue({ set });
  set.mockReturnValue({ where });
  where.mockReturnValue({ returning });
  returning.mockResolvedValue([{ id: 'item' }]);
  me.mockResolvedValue(null);
});

describe('account bucket-list life scale', () => {
  it('saves every named choice and clears it with an owner-scoped confirmed write', async () => {
    for (const lifeScale of ['moment', 'adventure', 'chapter', null] as const) {
      expect(await updateBucketListItem('item', { lifeScale })).toEqual({ success: true });
      expect(set).toHaveBeenLastCalledWith({ lifeScale, updatedAt: expect.any(Date) });
      const dialect = new SQLiteSyncDialect();
      expect(dialect.sqlToQuery(where.mock.lastCall![0]).params).toEqual(['item', 'owner']);
    }
  });
  it('rejects signed-out writes, invalid values, and missing or unowned items', async () => {
    session.mockResolvedValueOnce(null);
    await expect(updateBucketListItem('item', { lifeScale: 'moment' })).rejects.toThrow(
      'Not authenticated'
    );
    await expect(updateBucketListItem('item', { lifeScale: 'large' as never })).rejects.toThrow();
    expect(update).not.toHaveBeenCalled();
    returning.mockResolvedValueOnce([]);
    await expect(updateBucketListItem('other', { lifeScale: 'chapter' })).rejects.toThrow(
      'Item not found'
    );
    expect(new SQLiteSyncDialect().sqlToQuery(where.mock.lastCall![0]).params).toEqual([
      'other',
      'owner',
    ]);
  });
});
