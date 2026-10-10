import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Live landing (Astro overlay)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/live');
  });

  test('preserves the cinematic landing on the Live domain contract', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Make your bucket list happen');
    await expect(page.getByRole('link', { name: 'Explore the catalog' }).first()).toHaveAttribute(
      'href',
      '/experiences'
    );
    await expect(
      page.getByRole('heading', { name: 'Your interests already tell a story.' })
    ).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://live.significanthobbies.com'
    );
    expect(
      await page
        .getByRole('link', { name: 'Life in weeks' })
        .first()
        .evaluate((link) => link.getAttribute('href'))
    ).toBe('/life-in-weeks');
  });

  test('meets the automated accessibility baseline', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
