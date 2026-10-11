import { describe, expect, it, vi } from 'vitest';
import { userQuests, habits } from '~/db/schema';
import { completeUserQuest } from './user-quests';

const { update, set, where } = vi.hoisted(() => ({
  update: vi.fn(),
  set: vi.fn(),
  where: vi.fn(),
}));
vi.mock('~/server/auth', () => ({ getServerAuthSession: async () => ({ user: { id: 'owner' } }) }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('~/server/db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => [
            {
              id: 'quest',
              userId: 'owner',
              status: 'active',
              sourceBucketItemId: 'bucket',
              sourceTimelineId: null,
            },
          ],
        }),
      }),
    }),
    update,
  },
}));

describe('quest completion compatibility', () => {
  it('completes a quest and archives its habit without changing the source bucket item', async () => {
    update.mockReturnValue({ set });
    set.mockReturnValue({ where });
    where.mockResolvedValue(undefined);
    expect(await completeUserQuest('quest')).toEqual({ success: true, pinAdded: false });
    expect(update.mock.calls.map(([table]) => table)).toEqual([userQuests, habits]);
    expect(set).toHaveBeenCalledWith({ status: 'completed', completedAt: expect.any(Date) });
  });
});
