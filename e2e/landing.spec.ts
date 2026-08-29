import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Live landing (Astro overlay)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/live');
  });

  test('preserves the cinematic landing on the Live domain contract', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Find what deserves your time');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://live.significanthobbies.com'
    );
    expect(
      await page
        .getByRole('link', { name: /See your life in weeks/ })
        .evaluate((link) => (link as HTMLAnchorElement).href)
    ).toBe('https://live.significanthobbies.com/life-in-weeks');
  });

  test('meets the automated accessibility baseline', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
