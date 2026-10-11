import { expect, test } from '@playwright/test';
import { waitForHydrated } from './fixtures/hydration';

import { completeLocalOnboarding } from './fixtures/local-onboarding';

const LOCAL_ROUTES = [
  '/commitments',
  '/settings',
  '/onboarding',
  '/timeline',
  '/trajectory',
] as const;

test.describe('private work is locally available without an account', () => {
  test('core navigation is available without onboarding', async ({ page }) => {
    await page.goto('/experiences');
    const nav = page.locator('[data-site-nav]');
    if (!(await nav.getByRole('link', { name: 'Explore', exact: true }).isVisible())) {
      await page.getByRole('button', { name: 'Open menu' }).click();
    }
    for (const name of ['Explore', 'My list', 'Journal', 'Life in weeks']) {
      await expect(nav.getByRole('link', { name, exact: true })).toBeVisible();
    }
    await expect(nav.getByRole('link', { name: 'Habits', exact: true })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Possibilities', exact: true })).toHaveCount(0);
  });

  for (const route of ['/live-more', '/journal', '/bucket-list', '/settings'] as const) {
    test(`${route} opens directly without onboarding`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);
      await expect(page).toHaveURL(new RegExp(`${route}$`));
    });
  }

  for (const route of LOCAL_ROUTES) {
    test(`${route} renders without a login redirect`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);
      expect(page.url()).not.toContain('/login');
    });
  }

  test('bucket list is a complete local workspace without onboarding', async ({ page }) => {
    await page.goto('/bucket-list');
    await expect(page).toHaveURL(/\/bucket-list$/);
    await waitForHydrated(page.getByLabel('Add something you want to do'));
    await page.getByLabel('Add something you want to do').fill('Sleep under the stars');
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(
      page.getByRole('button', { name: 'Open Sleep under the stars', exact: true })
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole('button', { name: 'Open Sleep under the stars', exact: true })
    ).toBeVisible();
    await page.getByRole('button', { name: 'Mark Sleep under the stars as lived' }).click();
    await expect(
      page.getByRole('button', { name: 'Reopen Sleep under the stars to To do' })
    ).toBeVisible();
  });
});

test('bucket draft survives a transaction abort and retries without losing saved items', async ({
  page,
}) => {
  await completeLocalOnboarding(page);
  await page.goto('/bucket-list');
  const input = page.getByLabel('Add something you want to do');
  await waitForHydrated(input);
  await input.fill('Watch a sunrise');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Mark Watch a sunrise as lived' })).toBeVisible();

  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      const request = original.apply(this, args);
      request.addEventListener('success', () => this.transaction.abort(), { once: true });
      IDBObjectStore.prototype.put = original;
      return request;
    };
  });
  await input.fill('Sleep under the stars');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await expect(
    page.getByRole('alert').filter({ hasText: 'Changes could not be saved' })
  ).toBeVisible();
  await expect(input).toHaveValue('Sleep under the stars');
  await expect(
    page.getByRole('button', { name: 'Mark Sleep under the stars as lived' })
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await expect(input).toHaveValue('');
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Mark Sleep under the stars as lived' })
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mark Watch a sunrise as lived' })).toBeVisible();
  await page.getByRole('button', { name: 'Mark Sleep under the stars as lived' }).click();
  await expect(
    page.getByRole('button', { name: 'Reopen Sleep under the stars to To do' })
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Reopen Sleep under the stars to To do' })
  ).toBeVisible();
  await page.getByRole('button', { name: 'Open Sleep under the stars', exact: true }).click();
  await page
    .getByRole('button', { name: 'Remove from list', exact: true })
    .filter({ visible: true })
    .click();
  await page.getByRole('button', { name: 'Remove', exact: true }).filter({ visible: true }).click();
  await expect(
    page.getByRole('button', { name: 'Reopen Sleep under the stars to To do' })
  ).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Reopen Sleep under the stars to To do' })
  ).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Mark Watch a sunrise as lived' })).toBeVisible();
});
