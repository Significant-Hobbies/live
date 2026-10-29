import { betterAuth } from 'better-auth';
import { describe, expect, it } from 'vitest';
import { authBaseUrl, authTrustedOrigins } from './auth-routing';

const origins = ['https://significanthobbies.com', 'https://live.significanthobbies.com'];
function fixture() {
  const baseURL = authBaseUrl({ production: true, testAuthEnabled: false });
  return betterAuth({
    baseURL,
    advanced: { trustedProxyHeaders: false, disableOriginCheck: false, disableCSRFCheck: false },
    secret: 'local-origin-regression-fixture-secret-32-characters',
    trustedOrigins: authTrustedOrigins(baseURL),
    socialProviders: {
      google: { clientId: 'origin-test-client', clientSecret: 'origin-test-secret' },
    },
  });
}
function signIn(
  auth: ReturnType<typeof fixture>,
  origin: string,
  headers: Record<string, string> = {}
) {
  return auth.handler(
    new Request(`${origin}/api/auth/sign-in/social`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: origin,
        Cookie: 'local-origin-fixture=1',
        ...headers,
      },
      body: JSON.stringify({
        provider: 'google',
        callbackURL: '/bucket-list',
        disableRedirect: true,
      }),
    })
  );
}
async function oauthObservation(response: Response) {
  const destination = new URL((await response.json()).url);
  const cookie = response.headers.get('set-cookie') ?? '';
  return {
    status: response.status,
    providerOrigin: destination.origin,
    callback: destination.searchParams.get('redirect_uri'),
    httpOnly: /HttpOnly/i.test(cookie),
    secure: /Secure/i.test(cookie),
    hostOnly: !/Domain=/i.test(cookie),
  };
}
function expectedObservation(origin: string) {
  return {
    status: 200,
    providerOrigin: 'https://accounts.google.com',
    callback: `${origin}/api/auth/callback/google`,
    httpOnly: true,
    secure: true,
    hostOnly: true,
  };
}

describe('Live auth origins', () => {
  it('keeps local development explicit and restricts production to exact HTTPS aliases', () => {
    expect(
      authBaseUrl({
        production: true,
        configuredUrl: 'https://evil.example',
        testAuthEnabled: false,
      })
    ).toEqual({
      allowedHosts: ['significanthobbies.com', 'live.significanthobbies.com'],
      fallback: origins[0],
      protocol: 'https',
    });
    expect(
      authBaseUrl({
        production: false,
        configuredUrl: 'http://localhost:3187',
        testAuthEnabled: true,
      })
    ).toBe('http://localhost:3187');
    expect(authBaseUrl({ production: false, testAuthEnabled: true })).toBe('http://localhost:3000');
  });
  it('keeps OAuth callbacks and host-only state cookies on each request origin under concurrency', async () => {
    const auth = fixture();
    await Promise.all(
      [...origins, ...origins].map(async (origin) =>
        expect(await oauthObservation(await signIn(auth, origin))).toEqual(
          expectedObservation(origin)
        )
      )
    );
  });
  it.each(origins)(
    'validates OAuth state on the same-origin cancellation callback at %s',
    async (origin) => {
      const auth = fixture();
      const started = await signIn(auth, origin);
      const destination = new URL((await started.json()).url);
      const state = destination.searchParams.get('state')!;
      const cookie = started.headers.get('set-cookie')!.split(';')[0];
      const callback = new URL(`${origin}/api/auth/callback/google`);
      callback.searchParams.set('state', state);
      callback.searchParams.set('error', 'access_denied');
      const missingCookie = await auth.handler(new Request(callback));
      expect(missingCookie.status).toBe(302);
      expect(new URL(missingCookie.headers.get('location')!).searchParams.get('error')).toMatch(
        /state/
      );
      const cancelled = await auth.handler(new Request(callback, { headers: { Cookie: cookie } }));
      expect(cancelled.status).toBe(302);
      const errorPage = new URL(cancelled.headers.get('location')!);
      expect(errorPage.origin).toBe(origin);
      expect(errorPage.searchParams.get('error')).toBe('access_denied');
    }
  );
  it.each(origins)('ignores forwarded-host spoofing on %s', async (origin) => {
    expect(
      await oauthObservation(
        await signIn(fixture(), origin, {
          'X-Forwarded-Host': 'evil.example',
          'X-Forwarded-Proto': 'http',
        })
      )
    ).toEqual(expectedObservation(origin));
  });
  it.each(origins)('rejects another browser origin on %s', async (origin) => {
    const response = await signIn(fixture(), origin, { Origin: 'https://evil.example' });
    expect(response.status).toBe(403);
  });
  it.each(['https://evil.example', 'https://significanthobbies.com.evil.example'])(
    'rejects an unlisted request host %s',
    async (origin) => {
      const response = await signIn(fixture(), origin);
      expect(response.status).toBeGreaterThanOrEqual(400);
    }
  );
  it.each(origins)(
    'resolves headerless native API calls from the original Request on %s',
    async (origin) => {
      const request = new Request(`${origin}/api/native/auth/google/start`);
      const result = await fixture().api.signInSocial({
        request,
        headers: request.headers,
        body: { provider: 'google', callbackURL: `${origin}/api/native/auth/google/complete` },
        asResponse: false,
        returnHeaders: true,
      });
      expect(new URL(result.response.url!).searchParams.get('redirect_uri')).toBe(
        `${origin}/api/auth/callback/google`
      );
      expect(result.headers.get('set-cookie')).not.toMatch(/Domain=/i);
    }
  );
});
