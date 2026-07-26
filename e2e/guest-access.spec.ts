import { expect, test } from '@playwright/test';

/**
 * Auth in this product saves work; it does not unlock it. These tests pin the
 * two halves of that contract for signed-out visitors:
 *
 *  1. A guarded route hands the visitor back to where they were after sign-in.
 *  2. The login page's guest escape hatch points somewhere that genuinely
 *     renders without a session.
 */

/**
 * Still gated. /daily and /trajectory are deliberately absent: they render a
 * signed-out preview instead (see daily.spec.ts / trajectory.spec.ts).
 */
const GUARDED_ROUTES = [
  '/dashboard',
  '/commitments',
  '/life-plan',
  '/look-back',
  '/settings',
  '/setup',
  '/timeline',
] as const;

test.describe('guarded routes keep the visitor’s place', () => {
  for (const route of GUARDED_ROUTES) {
    test(`${route} redirects to login carrying ${route} as the callback`, async ({ page }) => {
      await page.goto(route);
      await page.waitForURL(/\/login/);
      const callback = new URL(page.url()).searchParams.get('callbackUrl');
      expect(callback, `${route} must round-trip through callbackUrl`).toBe(route);
    });
  }
});

test.describe('the guest escape hatch', () => {
  test('bucket list intent offers the anonymous board', async ({ page }) => {
    await page.goto('/bucket-list');
    await page.waitForURL(/\/life-bingo/);
    // /bucket-list has always sent signed-out visitors to the anonymous board
    // rather than to a wall; that behaviour is the model for the rest.
    expect(page.url()).toContain('/life-bingo');
  });

  test('guest link from a longitudinal surface leads somewhere that renders anonymously', async ({
    page,
  }) => {
    await page.goto('/look-back');
    await page.waitForURL(/\/login/);

    const guestLink = page.getByRole('link', { name: 'continue as guest' });
    await expect(guestLink).toBeVisible();

    const href = await guestLink.getAttribute('href');
    expect(href).toBe('/find-your-hobby');

    // The escape hatch must actually work signed out — that is the whole point.
    const res = await page.goto(href as string);
    expect(res?.status()).toBeLessThan(400);
    expect(page.url()).not.toContain('/login');
  });

  test('guest link follows timeline intent instead of a hardcoded default', async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForURL(/\/login/);
    await expect(page.getByRole('link', { name: 'continue as guest' })).toHaveAttribute(
      'href',
      '/timeline/new'
    );
  });
});
