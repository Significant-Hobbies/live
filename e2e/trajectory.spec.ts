import { expect, test } from '@playwright/test';

// E2E for the Trajectory feature: signed-out preview + nav visibility. The
// authenticated flow (set ideal, save entry, edit ideal, era list) is covered by
// unit tests of the pure module (src/lib/trajectory.test.ts) plus
// e2e/authenticated.spec.ts.

test.describe('Trajectory', () => {
  test('/trajectory previews a sample year instead of walling it off', async ({ page }) => {
    const res = await page.goto('/trajectory');
    expect(res?.status()).toBeLessThan(400);
    expect(page.url()).not.toContain('/login');
    await expect(page.getByLabel('Preview notice')).toBeVisible();
  });

  test('nav includes Trajectory link', async ({ page }) => {
    await page.goto('/hobbies');
    // The Trajectory nav link should be visible on desktop
    await expect(page.getByRole('link', { name: 'Trajectory' }).first()).toBeVisible();
  });

  test('/trajectory is not indexable by search engines', async ({ page }) => {
    // The preview renders real content to anonymous visitors, so noindex has to
    // be asserted on the page itself now rather than on a login redirect. The
    // quiz stays the single indexable discovery surface.
    await page.goto('/trajectory');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });
});
