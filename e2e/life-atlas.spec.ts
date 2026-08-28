import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { completeLocalOnboarding } from './fixtures/local-onboarding';

test.describe('Life Atlas shell', () => {
  test.beforeEach(async ({ page }) => {
    await completeLocalOnboarding(page);
  });

  test('uses distinct Live, Journal, Habits, and History destinations', async ({ page }) => {
    await page.goto('/live-more');
    const nav = page.getByRole('navigation').first();
    if ((page.viewportSize()?.width ?? 0) < 1024) {
      await page.getByRole('button', { name: 'Open menu' }).click();
    }
    await expect(nav.getByRole('link', { name: 'Live', exact: true })).toHaveAttribute(
      'href',
      '/live-more'
    );
    await expect(nav.getByRole('link', { name: 'Journal', exact: true }).first()).toHaveAttribute(
      'href',
      '/journal'
    );
    await expect(nav.getByRole('link', { name: 'Habits', exact: true }).first()).toHaveAttribute(
      'href',
      '/habits'
    );
    await expect(nav.getByRole('link', { name: 'History', exact: true }).first()).toHaveAttribute(
      'href',
      '/history'
    );
    await expect(page.getByRole('button', { name: /Live More|History/ })).toHaveCount(0);
  });

  test('Live More makes discovery and the action paths coherent', async ({ page }) => {
    await page.goto('/live-more');
    await expect(page.getByRole('heading', { name: /There are more ways to live/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Wander beyond the categories/ })).toBeVisible();

    await page.getByLabel('What do you still want to live?').fill('Learn to sail');
    const result = page.getByRole('region', { name: 'Dream search results' });
    await expect(result.getByText('Developed in Live')).toBeVisible();
    await expect(result.getByRole('heading', { name: /Learn to sail/i }).first()).toBeVisible();
    await expect(result.getByRole('link', { name: 'See the path' }).first()).toBeVisible();
    await result.getByRole('button', { name: 'Keep this possibility' }).first().click();
    await expect(page.getByText('1 dream is now in your atlas.')).toBeVisible();
  });

  test('an external possibility becomes a durable calling dream', async ({ page }) => {
    await page.goto('/live-more');
    const dream = `Aurevian Zorblax Quivanta ${crypto.randomUUID().slice(0, 8)}`;
    await page.getByLabel('What do you still want to live?').fill(dream);
    await expect(page.getByText('The native atlas ends here')).toBeVisible();
    await page.getByRole('button', { name: 'Keep this exact dream' }).click();
    await expect(page.getByRole('button', { name: 'Calling now' })).toBeVisible();
    await page.getByRole('button', { name: 'Clear dream search' }).click();
    await expect(page.getByRole('heading', { name: dream, level: 1 })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: dream, level: 1 })).toBeVisible();
  });

  test('a large possibility becomes a related small quest', async ({ page }) => {
    await page.goto(
      '/side-quests?tab=pick&possibility=Do%20a%20serious%20meditation%20retreat%20(10%2B%20days)'
    );
    await expect(page.getByText('Make this possibility smaller')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Ten Minutes of Silence' })).toBeVisible();
  });

  test('History joins mortality, trajectory, timeline, and narrative history', async ({ page }) => {
    await page.goto('/history');
    await expect(page.getByRole('heading', { name: 'Your life so far' })).toBeVisible();
    await expect(page.getByLabel('Life in weeks overview')).toBeVisible();
    await expect(page.getByText(/direction framed|path you are choosing/i)).toBeVisible();
    await expect(page.getByText(/Personal timeline/i).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Read the record/ })).toHaveAttribute(
      'href',
      '/journal#journal-history'
    );
  });

  test('/timeline resolves to the timeline inside History', async ({ page }) => {
    await page.goto('/timeline');
    await expect(page).toHaveURL(/\/history#personal-timeline$/);
    await expect(page.locator('#personal-timeline')).toContainText(/The chapters that/);
  });

  test('merged pages do not overflow on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of ['/live-more', '/history']) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(1);
    }
  });

  test('Live More meets the automated accessibility baseline', async ({ page }) => {
    await page.goto('/live-more');
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (violation) => violation.impact === 'serious' || violation.impact === 'critical'
    );
    expect(
      serious,
      serious.map((violation) => `${violation.id}: ${violation.help}`).join('\n')
    ).toEqual([]);
  });

  test('the primary light-mode destinations meet the accessibility baseline', async ({ page }) => {
    for (const path of ['/daily', '/journal', '/habits', '/history', '/trajectory']) {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter(
        (violation) => violation.impact === 'serious' || violation.impact === 'critical'
      );
      expect(
        serious,
        `${path}\n${serious.map((violation) => `${violation.id}: ${violation.help}`).join('\n')}`
      ).toEqual([]);
    }
  });
});
