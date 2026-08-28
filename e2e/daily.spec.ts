import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { completeLocalOnboarding } from './fixtures/local-onboarding';

test.describe('Journal, Habits & manifesto', () => {
  test('/daily sends the old ritual to its two new homes', async ({ page }) => {
    await completeLocalOnboarding(page);
    const res = await page.goto('/daily');
    expect(res?.status()).toBeLessThan(400);
    expect(page.url()).not.toContain('/login');
    await expect(page.getByRole('link', { name: /Open Journal/ })).toHaveAttribute(
      'href',
      '/journal'
    );
    await expect(page.getByRole('link', { name: /Open Habits/ })).toHaveAttribute(
      'href',
      '/habits'
    );
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

  test('Habits and Journal preserve the existing anonymous records independently', async ({
    page,
  }) => {
    await completeLocalOnboarding(page);
    await page.goto('/habits');
    await page.getByRole('button', { name: 'Manage' }).click();
    await page.getByPlaceholder('Habit name (e.g. Read 20 pages)').fill('Walk after lunch');
    await page.getByRole('button', { name: 'Add habit' }).click();
    await expect(page.getByText('Walk after lunch')).toBeVisible();

    await page.goto('/journal');
    await page.locator('#journal-entry').fill('I made room for a slower afternoon.');
    await page.getByRole('button', { name: /Save (morning|evening)/ }).click();
    await page.reload();
    await expect(page.locator('#journal-entry')).toHaveValue('I made room for a slower afternoon.');
    await expect(
      page
        .getByRole('region', { name: 'Journal history' })
        .getByText('I made room for a slower afternoon.', { exact: true })
    ).toBeVisible();

    await page.goto('/habits');
    await expect(page.getByText('Walk after lunch')).toBeVisible();
    await expect(page.locator('#journal-entry')).toHaveCount(0);
    await expect(page.getByText('Ready when you are')).toBeVisible();
    await expect(page.getByText(/\d+ of \d+ complete today/)).toHaveCount(0);
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
    // The journal as bridge
    await expect(page.getByText(/journal is the bridge/i)).toBeVisible();
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

  test('nav exposes Live, Journal, and Habits as distinct products', async ({ page }) => {
    await completeLocalOnboarding(page);
    await page.goto('/hobbies');
    if ((page.viewportSize()?.width ?? 0) < 1024) {
      await page.getByRole('button', { name: 'Open menu' }).click();
    }
    await expect(page.getByRole('link', { name: 'Live', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Journal', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Habits', exact: true }).first()).toBeVisible();
  });

  test('public footer keeps private workspace links out', async ({ page }) => {
    await page.goto('/hobbies');
    const footer = page.locator('[data-site-footer]');
    await expect(footer.getByRole('link', { name: 'Journal', exact: true })).toHaveCount(0);
    await expect(footer.getByRole('link', { name: 'Habits', exact: true })).toHaveCount(0);
    await expect(footer.getByRole('link', { name: 'Find your hobby' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Things to try' })).toBeVisible();
  });
});
