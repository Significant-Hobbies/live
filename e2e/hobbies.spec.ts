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

  test('category page loads', async ({ page }) => {
    await page.goto('/hobbies/category/creative');
    await expect(page.locator('h1')).toContainText('Creative');
  });
});
