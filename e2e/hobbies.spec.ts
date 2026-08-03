import { expect, test } from '@playwright/test';

test.describe('Hobby directory', () => {
  test('loads and shows categories', async ({ page }) => {
    await page.goto('/hobbies');
    await expect(page.locator('h1')).toContainText('Hobby');
    // Scoped to links: category names also appear in body copy and nav, so a bare
    // getByText matched several nodes and failed strict mode.
    await expect(page.getByRole('link', { name: /Creative/ }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Physical/ }).first()).toBeVisible();
  });

  test('hobby detail page loads', async ({ page }) => {
    await page.goto('/hobbies/guitar');
    await expect(page.locator('h1')).toContainText('Guitar');
    // "Music" is the category label, the nav, and prose on this page.
    await expect(page.getByText('Music').first()).toBeVisible();
  });

  test('representative catalog hobbies own useful detail pages', async ({ page }) => {
    for (const [slug, name] of [
      ['tai-chi', 'Tai Chi'],
      ['blacksmithing', 'Blacksmithing'],
      ['genealogy', 'Genealogy'],
    ] as const) {
      const response = await page.goto(`/hobbies/${slug}`);
      expect(response?.status()).toBeLessThan(400);
      await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
      await expect(page.getByText(/roadmap/i).first()).toBeVisible();
    }
  });

  test('unknown hobby gets branded wayfinding', async ({ page }) => {
    const response = await page.goto('/hobbies/definitely-not-a-real-hobby');
    // App Router can stream a notFound() boundary with HTTP 200 in dev. The
    // rendered missing-page state and injected noindex directive are the stable
    // user/SEO contract; production non-streamed responses still return 404.
    expect(response?.status()).toBeLessThan(500);
    await expect(
      page.getByRole('heading', { name: 'This path ends here. Your day does not.' })
    ).toBeVisible();
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(1);
    await expect(page.getByRole('link', { name: /Find a hobby/ })).toBeVisible();
  });

  test('category page loads', async ({ page }) => {
    await page.goto('/hobbies/category/creative');
    await expect(page.locator('h1')).toContainText('Creative');
  });
});
