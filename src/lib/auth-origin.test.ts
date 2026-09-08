import { betterAuth } from 'better-auth';
import { describe, expect, it } from 'vitest';
import { authBaseUrl } from './auth-routing';

const canonical = 'https://live.significanthobbies.com';

describe('Live auth origin', () => {
  it('keeps production auth and callbacks canonical despite a legacy configured host', () => {
    expect(
      authBaseUrl({
        production: true,
        configuredUrl: 'https://significanthobbies.com',
        testAuthEnabled: false,
      })
    ).toBe(canonical);
    expect(
      authBaseUrl({
        production: false,
        configuredUrl: 'http://localhost:3187',
        testAuthEnabled: true,
      })
    ).toBe('http://localhost:3187');
    expect(authBaseUrl({ production: false, testAuthEnabled: true })).toBe('http://localhost:3000');
  });

  it('accepts the canonical browser origin and sends Google back to Live while rejecting other origins', async () => {
    const baseURL = authBaseUrl({
      production: true,
      configuredUrl: 'https://significanthobbies.com',
      testAuthEnabled: false,
    });
    const auth = betterAuth({
      baseURL,
      advanced: { disableOriginCheck: false, disableCSRFCheck: false },
      secret: 'local-origin-regression-fixture-secret-32-characters',
      trustedOrigins: [baseURL],
      socialProviders: {
        google: { clientId: 'origin-test-client', clientSecret: 'origin-test-secret' },
      },
    });
    const signIn = (origin: string) =>
      auth.handler(
        new Request(`${canonical}/api/auth/sign-in/social`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Origin: origin,
            Cookie: 'local-origin-fixture=1',
          },
          body: JSON.stringify({
            provider: 'google',
            callbackURL: '/bucket-list',
            disableRedirect: true,
          }),
        })
      );
    const rejected = await signIn('https://untrusted.example');
    expect(rejected.status).toBe(403);
    expect((await rejected.json()).code).toBe('INVALID_ORIGIN');
    const accepted = await signIn(canonical);
    expect(accepted.status).toBe(200);
    const destination = new URL((await accepted.json()).url);
    expect(destination.origin).toBe('https://accounts.google.com');
    expect(destination.searchParams.get('redirect_uri')).toBe(
      `${canonical}/api/auth/callback/google`
    );
  });
});
