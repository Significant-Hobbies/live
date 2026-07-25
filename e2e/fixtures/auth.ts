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
 * Ensures the test user exists, then signs in. Idempotent: sign-up is expected
 * to fail with "already exists" on every run after the first.
 *
 * Known flake: on a brand-new database the first call here can return 403 and
 * succeed on Playwright's retry. Four hypotheses have already been tested and
 * ruled out (cold compile, missing account, rate limiting, missing Origin) — see
 * the table in docs/development/testing.md before trying a fifth. Plain curl gets
 * 200 where Playwright's request context gets 403, so the next step is to capture
 * the failing call's actual headers.
 */
async function signInTestUser(page: Page): Promise<void> {
  await page.request.post('/api/auth/sign-up/email', {
    data: {
      email: TEST_USER.email,
      password: TEST_USER.password,
      name: TEST_USER.name,
    },
    failOnStatusCode: false,
  });

  // One retry, which helps but does NOT fully fix the known flake below.
  //
  // Against a freshly created database the suite's first test can fail with a 403
  // from sign-in and then pass on Playwright's retry. Note the sign-up above
  // deliberately ignores its result (it is expected to fail with "already exists"
  // on every run after the first) — so if that sign-up is the request being
  // rejected, retrying only the sign-in cannot help, because the account still
  // does not exist. Retrying the pair is the next thing to try. Not yet
  // diagnosed; see docs/development/testing.md.
  let res = await page.request.post('/api/auth/sign-in/email', {
    data: { email: TEST_USER.email, password: TEST_USER.password },
    failOnStatusCode: false,
  });

  if (!res.ok()) {
    await page.waitForTimeout(750);
    res = await page.request.post('/api/auth/sign-in/email', {
      data: { email: TEST_USER.email, password: TEST_USER.password },
      failOnStatusCode: false,
    });
  }

  if (!res.ok()) {
    throw new Error(
      `Test sign-in failed (${res.status()}). Is the dev server running with ` +
        `ENABLE_TEST_AUTH=1? Try: pnpm dev:test-auth`
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
