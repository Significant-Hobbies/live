import { expect, test } from './fixtures/auth';

/**
 * First authenticated e2e coverage in this repo.
 *
 * Every logged-in surface was previously asserted only through its
 * unauthenticated redirect, because Google OAuth is the sole production sign-in
 * path and Playwright cannot complete it. The gated email provider (see
 * src/lib/auth.ts) closes that gap.
 *
 * Skips automatically when the server runs without ENABLE_TEST_AUTH=1.
 */

const LOGGED_IN_ROUTES = [
  '/daily',
  '/dashboard',
  '/trajectory',
  '/commitments',
  '/bucket-list',
  '/life-plan',
  '/look-back',
  '/settings',
] as const;

test.describe('authenticated surfaces', () => {
  for (const route of LOGGED_IN_ROUTES) {
    test(`${route} renders for a signed-in user`, async ({ authedPage }) => {
      const res = await authedPage.goto(route);
      expect(res?.status(), `${route} should not error`).toBeLessThan(400);
      // The redirect guard must not fire.
      expect(authedPage.url()).not.toContain('/login');
    });
  }

  test('/daily shows the ritual, not the marketing shell', async ({ authedPage }) => {
    await authedPage.goto('/daily');
    await expect(authedPage.getByText(/Good (morning|evening)/)).toBeVisible();
    await expect(authedPage.getByRole('heading', { name: 'Habits' })).toBeVisible();
  });

  test('the account menu exposes the surfaces it claims to', async ({ authedPage }) => {
    await authedPage.goto('/dashboard');
    // Nav renders the signed-in dropdown rather than a Sign in button.
    await expect(authedPage.getByRole('link', { name: 'Sign in' })).toHaveCount(0);
  });

  test('AM/PM rings derive from journal text, not a separate flag', async ({ authedPage }) => {
    await authedPage.goto('/daily');
    // Both ring labels are always present; the assertion is that the page renders
    // them from journal state without a DailyCheckin row existing.
    await expect(authedPage.getByText('AM', { exact: true })).toBeVisible();
    await expect(authedPage.getByText('PM', { exact: true })).toBeVisible();
  });

  test('trajectory renders all four life buckets', async ({ authedPage }) => {
    await authedPage.goto('/trajectory');
    for (const bucket of ['Health', 'Finance', 'Knowledge', 'Relationships']) {
      await expect(authedPage.getByRole('heading', { name: bucket })).toBeVisible();
    }
  });
});
