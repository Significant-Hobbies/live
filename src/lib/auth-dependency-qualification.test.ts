import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('~/server/db', () => ({ db: {} }));

afterEach(() => vi.unstubAllEnvs());

describe('actual Live production auth dependency qualification', () => {
  it('keeps the vulnerable optional authentication workflows disabled', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('BETTER_AUTH_SECRET', 'local-dependency-qualification-only-secret-32-characters');
    vi.stubEnv('GOOGLE_CLIENT_ID', 'local-qualification-client');
    vi.stubEnv('GOOGLE_CLIENT_SECRET', 'local-qualification-provider-secret');
    const { auth } = await import('./auth');
    expect(auth.options.plugins?.map((plugin) => plugin.id)).toEqual(['bearer']);
    expect(typeof auth.options.database).toBe('function');
    expect(auth.options.emailAndPassword?.enabled).toBe(false);
    const context = await auth.$context;
    expect(context.oauthConfig.storeStateStrategy).toBe('database');
    expect(context.options.account?.accountLinking?.disableImplicitLinking).toBe(true);
  });
});
