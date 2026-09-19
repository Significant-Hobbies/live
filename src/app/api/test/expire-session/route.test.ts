import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const fixture = vi.hoisted(() => ({
  getSession: vi.fn(),
  update: vi.fn(),
  set: vi.fn(),
  where: vi.fn(),
  headers: vi.fn(),
  eq: vi.fn((column: unknown, value: unknown) => ({ column, value })),
}));

vi.mock('next/headers', () => ({ headers: fixture.headers }));
vi.mock('~/lib/auth', () => ({ auth: { api: { getSession: fixture.getSession } } }));
vi.mock('~/db/schema', () => ({ session: { token: 'session.token' } }));
vi.mock('drizzle-orm', () => ({ eq: fixture.eq }));
vi.mock('~/server/db', () => ({ db: { update: fixture.update } }));

import { POST } from './route';

describe('POST /api/test/expire-session', () => {
  afterEach(() => vi.unstubAllEnvs());

  beforeEach(() => {
    vi.unstubAllEnvs();
    fixture.getSession.mockReset();
    fixture.update.mockReset();
    fixture.set.mockReset();
    fixture.where.mockReset();
    fixture.headers.mockReset();
    fixture.eq.mockClear();

    fixture.headers.mockResolvedValue(new Headers({ cookie: 'session=test' }));
    fixture.update.mockReturnValue({ set: fixture.set });
    fixture.set.mockReturnValue({ where: fixture.where });
    fixture.where.mockResolvedValue({ success: true });
  });

  it('returns 404 in production even when test auth is enabled, without auth or DB access', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('ENABLE_TEST_AUTH', '1');

    const response = await POST();

    expect(response.status).toBe(404);
    expect(fixture.getSession).not.toHaveBeenCalled();
    expect(fixture.update).not.toHaveBeenCalled();
  });

  it('returns 404 outside production when test auth is disabled', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('ENABLE_TEST_AUTH', '0');

    const response = await POST();

    expect(response.status).toBe(404);
    expect(fixture.getSession).not.toHaveBeenCalled();
    expect(fixture.update).not.toHaveBeenCalled();
  });

  it('returns 401 for an unauthenticated caller without touching the DB', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('ENABLE_TEST_AUTH', '1');
    fixture.getSession.mockResolvedValue(null);

    const response = await POST();

    expect(response.status).toBe(401);
    expect(fixture.getSession).toHaveBeenCalledWith({ headers: expect.any(Headers) });
    expect(fixture.update).not.toHaveBeenCalled();
  });

  it('expires only the authenticated caller session token', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('ENABLE_TEST_AUTH', '1');
    const token = 'caller-session-token';
    fixture.getSession.mockResolvedValue({ session: { token } });

    const before = Date.now();
    const response = await POST();
    const after = Date.now();

    expect(response.status).toBe(200);
    expect(fixture.headers).toHaveBeenCalledTimes(1);
    expect(fixture.getSession).toHaveBeenCalledTimes(1);
    expect(fixture.update).toHaveBeenCalledWith({ token: 'session.token' });
    expect(fixture.set).toHaveBeenCalledTimes(1);
    const values = fixture.set.mock.calls[0]?.[0] as { expiresAt: Date };
    expect(values.expiresAt).toBeInstanceOf(Date);
    expect(values.expiresAt.getTime()).toBeGreaterThanOrEqual(before - 60_000);
    expect(values.expiresAt.getTime()).toBeLessThanOrEqual(after - 60_000);
    expect(fixture.where).toHaveBeenCalledWith({ column: 'session.token', value: token });
  });
});
