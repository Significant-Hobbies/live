import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getServerAuthSession } from '~/server/auth';
import { GET } from './route';

vi.mock('~/server/auth', () => ({ getServerAuthSession: vi.fn() }));
const session = vi.mocked(getServerAuthSession);

describe('private account presentation', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns only the authenticated account presentation without shared caching', async () => {
    session.mockResolvedValue({
      user: {
        id: 'owner',
        name: 'Owner',
        image: '/avatar.png',
        username: 'owner-profile',
        email: 'private@example.test',
      },
    });
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('private, no-store');
    expect(await response.json()).toEqual({
      user: { id: 'owner', name: 'Owner', image: '/avatar.png', username: 'owner-profile' },
    });
    expect(session).toHaveBeenCalledTimes(1);
  });

  it('rejects an absent or expired session without shared caching', async () => {
    session.mockResolvedValue(null);
    const response = await GET();
    expect(response.status).toBe(401);
    expect(response.headers.get('Cache-Control')).toBe('private, no-store');
    expect(await response.json()).toEqual({ user: null });
  });
});
