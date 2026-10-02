import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { completeLocalOnboarding } from './fixtures/local-onboarding';

test.describe('Journal, list & manifesto', () => {
  test('retired routes lead to the list and weekly journal', async ({ page }) => {
    await page.goto('/habits');
    await expect(page).toHaveURL(/\/bucket-list$/);
    await expect(page.getByRole('button', { name: 'Manage', exact: true })).toHaveCount(0);
    await page.goto('/daily');
    await expect(page).toHaveURL(/\/journal$/);
    await expect(page.locator('#weekly-entry')).toBeVisible();
  });

  test('the split surfaces have no serious accessibility violations', async ({ page }) => {
    await completeLocalOnboarding(page);
    for (const route of ['/daily', '/journal', '/habits']) {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter(({ impact }) =>
        ['critical', 'serious'].includes(impact ?? '')
      );
      expect(serious, route).toEqual([]);
    }
  });

  test('list completion and weekly writing persist independently', async ({ page }) => {
    await completeLocalOnboarding(page);
    await page.goto('/bucket-list');
    await page.getByLabel('Something you want to do').fill('Walk after lunch');
    await page.getByRole('button', { name: 'Add to my list' }).click();
    await page.getByRole('button', { name: 'Complete Walk after lunch', exact: true }).click();

    await page.goto('/journal');
    await page.locator('#weekly-entry').fill('I made room for a slower afternoon.');
    await page.getByRole('button', { name: /Keep this week|Update this week/ }).click();
    await page.reload();
    await expect(page.locator('#weekly-entry')).toHaveValue('I made room for a slower afternoon.');

    await page.goto('/habits');
    await expect(page).toHaveURL(/\/bucket-list$/);
    await expect(
      page.getByRole('button', { name: 'Reopen Walk after lunch', exact: true })
    ).toBeVisible();
    await expect(page.locator('#weekly-entry')).toHaveCount(0);
  });

  test('the weekly journal keeps one entry without an interview', async ({ page }) => {
    await page.goto('/journal');
    await expect(page.getByRole('button', { name: 'Next question' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'A different question' })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'What did you do last week?' })).toBeVisible();
    const entry = 'Dinner with my mom, then a long slow walk.';
    await page.locator('#weekly-entry').fill(entry);
    await expect(page.getByRole('button', { name: 'Weeks start sunday' })).toBeDisabled();
    await page.getByRole('button', { name: 'Keep this week', exact: true }).click();
    await expect(page.getByText('Kept. This week is on record.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Weeks start sunday' })).toBeEnabled();
    await page.reload();
    await expect(page.locator('#weekly-entry')).toHaveValue(entry);
    await page.locator('#weekly-entry').fill(`${entry} A quiet Sunday with coffee.`);
    await page.getByRole('button', { name: 'Update this week' }).click();
    await expect(page.getByText('Kept. This week is on record.')).toBeVisible();
    await page.reload();
    await expect(page.locator('#weekly-entry')).toHaveValue(`${entry} A quiet Sunday with coffee.`);
  });

  test('a catalog idea can be saved and completed with no setup', async ({ page }) => {
    await page.goto('/experiences');
    await page.getByLabel('Search everything').fill('Make pasta from scratch');
    await page
      .getByRole('button', { name: 'Add Make pasta from scratch to my bucket list', exact: true })
      .click();
    await expect(page.getByText('Added to your bucket list')).toBeVisible();
    await page.goto('/bucket-list');
    await page
      .getByRole('button', { name: 'Complete Make pasta from scratch', exact: true })
      .click();
    await expect(
      page.getByRole('button', { name: 'Reopen Make pasta from scratch', exact: true })
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole('button', { name: 'Reopen Make pasta from scratch', exact: true })
    ).toBeVisible();
  });

  test('/live-more keeps and restores an exact dream', async ({ page }) => {
    await completeLocalOnboarding(page);
    await page.goto('/live-more');
    const chosenIdea = `Moonlit Zorblax Quivanta ${crypto.randomUUID().slice(0, 8)}`;
    await page.getByLabel('What do you still want to live?').fill(chosenIdea);
    await page.getByRole('button', { name: 'Keep this exact dream' }).click();
    await expect(page.getByText('1 dream is now in your atlas.')).toBeVisible();
    await page.reload();
    await page.getByLabel('What do you still want to live?').fill(chosenIdea);
    await expect(page.getByRole('button', { name: 'Calling now' })).toBeVisible();
    await page.getByRole('button', { name: 'Clear dream search' }).click();
    await expect(page.getByRole('heading', { name: chosenIdea, level: 1 })).toBeVisible();
  });

  test('/live-more lets a person import a whole dream list', async ({ page }) => {
    await completeLocalOnboarding(page);
    await page.goto('/live-more');
    const suffix = crypto.randomUUID().slice(0, 8);
    const dreams = [
      `Call an old friend ${suffix}`,
      `Cook one new dish ${suffix}`,
      `Walk somewhere unfamiliar ${suffix}`,
    ];
    await page.getByRole('button', { name: 'Paste a whole list' }).click();
    await page
      .getByLabel('Bucket list to import')
      .fill(dreams.map((dream, index) => `${index + 1}. ${dream}`).join('\n'));
    await expect(page.getByText('Dreams Live will keep').locator('../..')).toContainText('3');
    await page.getByRole('button', { name: 'Keep these dreams' }).click();
    await expect(page.getByText('3 dreams are now in your atlas.')).toBeVisible();
    await page.reload();
    for (const dream of dreams) {
      await page.getByLabel('What do you still want to live?').fill(dream);
      await expect(
        page.getByRole('button', { name: /Calling now|Call this forward/ })
      ).toBeVisible();
    }
  });

  test('/manifesto loads and shows the mortality frame', async ({ page }) => {
    await page.goto('/manifesto');
    await expect(page.locator('h1')).toContainText('Manifesto');
    // The 4,000 weeks truth
    await expect(page.getByText(/4,000 weeks/)).toBeVisible();
    // Two dimensions — match the bold labels in the manifesto body
    await expect(page.locator('article').getByText('Daily.')).toBeVisible();
    await expect(page.locator('article').getByText('Living.')).toBeVisible();
    // The weekly log as bridge
    await expect(page.getByText(/weekly log is the bridge/i)).toBeVisible();
  });

  test('/manifesto has working CTAs', async ({ page }) => {
    await page.goto('/manifesto');
    // Scoped to the article: the nav also carries a "Find a Hobby" link, and an
    // unscoped accessible-name lookup matched both and failed strict mode.
    const article = page.locator('article');

    const hobbiesLink = article.getByRole('link', { name: 'Find a hobby' });
    await expect(hobbiesLink).toBeVisible();
    // "Working" should mean it points somewhere, not merely that it renders.
    // /hobbies is deliberately deep-link-only (see docs/product/discovery-funnel.md)
    // — reachable from here, absent from nav and footer.
    await expect(hobbiesLink).toHaveAttribute('href', '/hobbies');

    const bucketListLink = article.getByRole('link', { name: 'Start a bucket list' });
    await expect(bucketListLink).toBeVisible();
    await expect(bucketListLink).toHaveAttribute('href', '/bucket-lists');
  });

  test('nav exposes only the core list, journal, catalog, and time perspective', async ({
    page,
  }) => {
    await page.goto('/hobbies');
    if ((page.viewportSize()?.width ?? 0) < 1024) {
      await page.getByRole('button', { name: 'Open menu' }).click();
    }
    const nav = page.locator('[data-site-nav]');
    for (const name of ['Catalog', 'My list', 'Weekly journal', 'Life in weeks']) {
      await expect(nav.getByRole('link', { name, exact: true })).toBeVisible();
    }
  });

  test('public footer leads to catalog and local workspaces', async ({ page }) => {
    await page.goto('/hobbies');
    const footer = page.locator('[data-site-footer]');
    await expect(footer.getByRole('link', { name: 'Catalog', exact: true })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'My list', exact: true })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Weekly journal', exact: true })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Habits', exact: true })).toHaveCount(0);
  });
});
