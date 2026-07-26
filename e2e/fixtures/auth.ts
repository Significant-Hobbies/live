import { test as base, type Page } from '@playwright/test';

/**
 * Authenticated Playwright fixture.
 *
 * Signs in through better-auth's own email endpoint, which is enabled only when
 * ENABLE_TEST_AUTH=1 and NODE_ENV is not production (see src/lib/auth.ts). That
 * means these tests exercise the real session path rather than a fabricated
 * cookie, and nothing here touches BETTER_AUTH_SECRET.
 *
 * Before this existed the repo had no authenticated e2e coverage at all — every
 * logged-in surface was asserted only via its unauthenticated redirect.
 */

const TEST_USER = {
  email: 'e2e-authenticated@significanthobbies.test',
  password: 'e2e-test-password-not-a-secret',
  name: 'E2E Tester',
  username: 'e2etester',
} as const;

/** True when the app is running with test auth enabled. */
async function testAuthAvailable(page: Page): Promise<boolean> {
  const res = await page.request.post('/api/auth/sign-in/email', {
    data: { email: TEST_USER.email, password: 'deliberately-wrong' },
    failOnStatusCode: false,
  });
  // 404 means the endpoint does not exist, i.e. the provider is disabled.
  return res.status() !== 404;
}

/**
 * Ensures the test user exists and the context holds a session.
 *
 * Sign-up is attempted first and is expected to fail with "already exists" on
 * every run after the first.
 *
 * ## Why the sign-in is conditional
 *
 * A successful sign-up *already sets a session cookie*, and better-auth rejects
 * `sign-in/email` with a 403 when the request context is already authenticated.
 * Sign-up and sign-in share one cookie jar here, so unconditionally doing both
 * meant:
 *
 * - **Fresh database** — sign-up succeeds and sets a session, the sign-in that
 *   follows is refused 403, and the suite's first test fails.
 * - **Warm database** — sign-up fails, no cookie is set, the sign-in succeeds.
 *
 * That is the whole of the long-standing "only flakes on a brand-new dev.db"
 * behaviour, and it explains why plain `curl` never reproduced it (a fresh jar
 * per invocation) and why retrying the sign-in never helped (the session cookie
 * is still there on the retry). Verified directly: sign-up into an empty cookie
 * jar returns 200 and writes `session_token`; reusing that jar, sign-in returns
 * 403; discarding it, the same sign-in returns 200.
 */
async function signInTestUser(page: Page): Promise<void> {
  const signUp = await page.request.post('/api/auth/sign-up/email', {
    data: {
      email: TEST_USER.email,
      password: TEST_USER.password,
      name: TEST_USER.name,
    },
    failOnStatusCode: false,
  });

  // Sign-up succeeded, so this context is already authenticated. Signing in on
  // top of that is exactly what produced the 403.
  if (signUp.ok()) return;

  const res = await page.request.post('/api/auth/sign-in/email', {
    data: { email: TEST_USER.email, password: TEST_USER.password },
    failOnStatusCode: false,
  });

  if (!res.ok()) {
    throw new Error(
      `Test sign-in failed (${res.status()}) after sign-up returned ` +
        `${signUp.status()}. Is the dev server running with ENABLE_TEST_AUTH=1? ` +
        `Try: pnpm dev:test-auth`
    );
  }
}

/**
 * `test` with an already-signed-in page.
 *
 * Skips the whole file when test auth is unavailable, so a plain `pnpm dev`
 * server does not produce a wall of failures.
 */
export const test = base.extend<{ authedPage: Page }>({
  authedPage: async ({ page }, use) => {
    const available = await testAuthAvailable(page);
    if (!available) {
      base.skip(true, 'Test auth disabled — run the dev server with ENABLE_TEST_AUTH=1');
    }
    await signInTestUser(page);
    await use(page);
  },
});

export { expect } from '@playwright/test';
