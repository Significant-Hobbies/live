import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SQLiteSyncDialect } from 'drizzle-orm/sqlite-core';
import { addBucketItemUpdate } from './bucket-updates';

const { session, owned, saved, insert, values, conflict, limit } = vi.hoisted(() => ({
  session: vi.fn(),
  owned: vi.fn(),
  saved: vi.fn(),
  insert: vi.fn(),
  values: vi.fn(),
  conflict: vi.fn(),
  limit: vi.fn(),
}));
vi.mock('~/server/auth', () => ({ getServerAuthSession: session }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('~/lib/rate-limit', () => ({ enforceRateLimit: limit }));
vi.mock('~/server/db', () => ({
  db: {
    query: { bucketListItems: { findFirst: owned }, bucketItemUpdates: { findFirst: saved } },
    insert,
  },
}));
const input = {
  id: '06833b0c-297b-4f22-af14-67080d9bc21e',
  text: 'Booked my first lesson.\nGoing with Sam.',
};
const createdAt = new Date('2026-11-05T10:45:23.123Z');

beforeEach(() => {
  vi.clearAllMocks();
  session.mockResolvedValue({ user: { id: 'owner' } });
  owned.mockResolvedValue({ id: 'item' });
  saved.mockResolvedValue({ ...input, createdAt });
  insert.mockReturnValue({ values });
  values.mockReturnValue({ onConflictDoNothing: conflict });
  conflict.mockResolvedValue(undefined);
});

describe('private bucket item updates', () => {
  it('authenticates, validates parent ownership, and returns the durable timestamp', async () => {
    expect(await addBucketItemUpdate('item', { ...input, text: `  ${input.text}  ` })).toEqual({
      ...input,
      createdAt: createdAt.toISOString(),
    });
    const dialect = new SQLiteSyncDialect();
    expect(dialect.sqlToQuery(owned.mock.calls[0]![0].where).params).toEqual(['item', 'owner']);
    expect(dialect.sqlToQuery(saved.mock.calls[0]![0].where).params).toEqual([
      input.id,
      'item',
      'owner',
    ]);
    expect(values).toHaveBeenCalledWith({
      ...input,
      itemId: 'item',
      userId: 'owner',
      createdAt: expect.any(Date),
    });
    expect(limit).toHaveBeenCalledWith('bucketList', 'owner');
  });
  it('reuses the saved update when a successful write is retried', async () => {
    const first = await addBucketItemUpdate('item', input);
    expect(await addBucketItemUpdate('item', input)).toEqual(first);
    expect(conflict).toHaveBeenCalledTimes(2);
  });
  it('rejects signed-out writes and another account’s item before inserting', async () => {
    session.mockResolvedValueOnce(null);
    await expect(addBucketItemUpdate('item', input)).rejects.toThrow('Not authenticated');
    owned.mockResolvedValueOnce(null);
    await expect(addBucketItemUpdate('other', input)).rejects.toThrow('Item not found');
    expect(insert).not.toHaveBeenCalled();
  });
  it('rejects invalid IDs, blank updates, and oversized updates without a write', async () => {
    for (const invalid of [
      { ...input, id: 'bad' },
      { ...input, text: '  ' },
      { ...input, text: 'x'.repeat(2001) },
    ]) {
      await expect(addBucketItemUpdate('item', invalid)).rejects.toThrow();
    }
    expect(insert).not.toHaveBeenCalled();
  });
  it('does not report success for a token outside this item and account', async () => {
    saved.mockResolvedValueOnce(null);
    await expect(addBucketItemUpdate('item', input)).rejects.toThrow('Update could not be saved');
  });
  it('returns the original saved text when an edited retry reuses its token', async () => {
    expect(
      await addBucketItemUpdate('item', { ...input, text: 'Edited after a lost response' })
    ).toEqual({
      ...input,
      createdAt: createdAt.toISOString(),
    });
  });
});
