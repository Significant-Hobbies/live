import { webcrypto } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { importLocalBucketItems } from './local-bucket-import';

const { parents, batch } = vi.hoisted(() => ({
  parents: [] as Record<string, unknown>[],
  batch: vi.fn(),
}));
vi.mock('~/server/auth', () => ({
  getServerAuthSession: async () => ({ user: { id: 'owner' } }),
}));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('~/server/db', async () => {
  const { bucketListItems } = await import('~/db/schema');
  return {
    db: {
      select: (fields?: unknown) => ({
        from: (table: unknown) => ({
          where: async () => (!fields && table === bucketListItems ? [...parents] : []),
        }),
      }),
      insert: () => ({
        values: (value: Record<string, unknown>) => ({ onConflictDoNothing: () => value }),
      }),
      batch,
      query: { bucketListItems: { findFirst: async () => parents.at(-1) } },
    },
  };
});

beforeEach(() => {
  parents.length = 0;
  batch.mockReset().mockImplementation(async (values: Record<string, unknown>[]) => {
    parents.push(...values);
  });
  vi.stubGlobal('crypto', webcrypto);
});
afterEach(() => vi.unstubAllGlobals());

describe('device life-scale import acknowledgement', () => {
  it.each(['moment', 'adventure', 'chapter', null] as const)(
    'saves %s and acknowledges a retry only when the selected value matches',
    async (lifeScale) => {
      const input = {
        expectedUserId: 'owner',
        items: [
          {
            id: 'device-item',
            title: 'Sail',
            status: 'planned' as const,
            lifeScale,
            steps: [],
            updates: [],
          },
        ],
      };
      expect(await importLocalBucketItems(input)).toMatchObject({
        success: true,
        imported: 1,
        conflicts: [],
      });
      expect(parents[0]).toMatchObject({ lifeScale, visibility: 'private', userId: 'owner' });
      expect(await importLocalBucketItems(input)).toMatchObject({
        success: true,
        imported: 0,
        matched: 1,
        conflicts: [],
      });
      expect(batch).toHaveBeenCalledOnce();
      if (lifeScale) {
        parents[0]!.lifeScale = lifeScale === 'moment' ? 'chapter' : 'moment';
        expect(await importLocalBucketItems(input)).toMatchObject({
          success: true,
          imported: 0,
          matched: 0,
          conflicts: ['Sail'],
        });
        expect(batch).toHaveBeenCalledOnce();
      }
    }
  );
  it('rejects an unknown life scale before touching account data', async () => {
    expect(
      await importLocalBucketItems({
        expectedUserId: 'owner',
        items: [
          {
            id: 'device-item',
            title: 'Sail',
            status: 'planned',
            lifeScale: 'large' as never,
            steps: [],
            updates: [],
          },
        ],
      })
    ).toMatchObject({ success: false, imported: 0 });
    expect(batch).not.toHaveBeenCalled();
  });
});
