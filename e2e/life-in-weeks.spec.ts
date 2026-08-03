import { expect, test } from '@playwright/test';
import { waitForHydrated } from './fixtures/hydration';
import { completeLocalOnboarding } from './fixtures/local-onboarding';

async function enterBirthDate(page: import('@playwright/test').Page, value: string) {
  const field = page.getByLabel('What date were you born?');
  await waitForHydrated(field);
  await field.fill(value);
  await expect(field).toHaveValue(value);
}

/**
 * `/life-in-weeks` is the anonymous front door: the mortality frame used to be
 * reachable only from the dashboard, which meant the most affecting thing the
 * product does sat behind Google OAuth. These tests hold that door open.
 */
test.describe('Life in weeks', () => {
  test('exposes exactly one main landmark', async ({ page }) => {
    await page.goto('/life-in-weeks');
    // app/layout.tsx wraps every page in <main id="main">. This page rendered
    // its own <main> inside that, nesting two landmarks so a screen reader was
    // offered a choice between them. Caught on production, not by the existing
    // axe check — that asserts on `main#main`, which a nested unnamed <main>
    // leaves at a count of one.
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('main#main h1')).toHaveCount(1);
  });

  test('renders and computes for a signed-out visitor', async ({ page }) => {
    await page.goto('/life-in-weeks');

    // No redirect to /login — the whole point.
    await expect(page).toHaveURL(/\/life-in-weeks$/);
    await expect(page.getByRole('heading', { name: 'Your life, in weeks.' })).toBeVisible();

    await enterBirthDate(page, '1990-06-15');
    await page.getByRole('button', { name: 'Show me' }).click();

    await expect(page.getByText(/That leaves roughly/)).toBeVisible();
    await expect(page.getByText(/Saturdays\./)).toBeVisible();
    await expect(page).toHaveURL(/\/life-in-weeks$/);
  });

  /**
   * The regression this page was rebuilt around. Subtracting age from a fixed
   * 77-year average told a 64-year-old they had ~12 summers left; the real
   * figure is around 21. Wrong, and wrong in the cruellest available direction.
   */
  test('gives an older visitor a truthful number of summers', async ({ page }) => {
    await page.goto('/life-in-weeks');
    await enterBirthDate(page, '1962-06-15');
    await page.getByRole('button', { name: 'Show me' }).click();

    const summers = page.getByText(/\d+ summers/);
    await expect(summers).toBeVisible();

    const text = (await summers.textContent()) ?? '';
    const count = Number(text.match(/(\d+) summers/)?.[1]);
    expect(count).toBeGreaterThan(15);
    expect(count).toBeLessThan(25);
  });

  test('never shows a zero, however old the visitor', async ({ page }) => {
    await page.goto('/life-in-weeks');
    await enterBirthDate(page, '1930-06-15');
    await page.getByRole('button', { name: 'Show me' }).click();

    await expect(page.getByText(/That leaves roughly/)).toBeVisible();
    await expect(page.getByText(/roughly 0 Saturdays/)).toHaveCount(0);
    await expect(page.getByText(/\b0 summers/)).toHaveCount(0);
  });

  test('rejects a future date instead of drawing a bogus grid', async ({ page }) => {
    await page.goto('/life-in-weeks');
    await enterBirthDate(page, '2099-01-01');
    await page.getByRole('button', { name: 'Show me' }).click();

    // Scoped by id: Next's own route announcer is also role="alert".
    await expect(page.locator('#birth-date-error')).toBeVisible();
    await expect(page.getByText(/That leaves roughly/)).toHaveCount(0);
  });

  test('remembers the exact date on a return visit, with no account', async ({ page }) => {
    await page.goto('/life-in-weeks');
    await enterBirthDate(page, '1975-03-09');
    await page.getByRole('button', { name: 'Show me' }).click();
    await expect(page.getByText(/That leaves roughly/)).toBeVisible();

    await page.reload();
    await expect(page.getByText(/That leaves roughly/)).toBeVisible();
    await expect(page.getByLabel('What date were you born?')).toHaveCount(0);
    await page.getByRole('button', { name: 'Change' }).click();
    await expect(page.getByLabel('Change your birth date')).toHaveValue('1975-03-09');
  });

  test('uses onboarding DOB without asking again or repeating setup CTAs', async ({ page }) => {
    await completeLocalOnboarding(page);
    await page.goto('/life-in-weeks');

    await expect(page.getByText(/That leaves roughly/)).toBeVisible();
    await expect(page.getByLabel('What date were you born?')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Return to Live More' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Return to History' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Find something to do/ })).toHaveCount(0);
  });

  test('offers only routes that work without signing in', async ({ page }) => {
    await page.goto('/life-in-weeks');
    await enterBirthDate(page, '1990-06-15');
    await page.getByRole('button', { name: 'Show me' }).click();

    for (const name of [/Find something to do/, /List what you still want to do/]) {
      const href = await page.getByRole('link', { name }).getAttribute('href');
      expect(href).toBeTruthy();
      const res = await page.request.get(href as string);
      expect(res.status(), `${href} must render for a guest`).toBe(200);
      expect(res.url(), `${href} must not bounce to /login`).not.toContain('/login');
    }
  });
});
