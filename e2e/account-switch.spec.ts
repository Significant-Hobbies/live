import { expect, test, type Page } from '@playwright/test';

import { waitForHydrated } from './fixtures/hydration';

/**
 * P06 / live#14 browser-level account qualification, all synthetic:
 *
 * 1. A signs in, saves private work, signs out through the real nav control;
 *    B signs in on the same browser and must not see, or be forwarded, A's
 *    rows — at the page level and at the session-scoped read API.
 * 2. An actually-expired session (the auth_session row aged out through the
 *    test-only endpoint, not a forged cookie) produces exactly one sign-in
 *    prompt that retains the private destination and returns to it.
 *
 * Requires the configured local test-auth server; missing fixtures fail visibly.
 */

const PASSWORD = 'e2e-test-password-not-a-secret';
const ORIGIN = 'http://localhost:3000';

async function signUp(page: Page, email: string, name: string): Promise<string> {
  const res = await page.request.post('/api/auth/sign-up/email', {
    headers: { Origin: ORIGIN },
    data: { email, password: PASSWORD, name },
    failOnStatusCode: false,
  });
  expect(res.status(), 'Run the local test server with ENABLE_TEST_AUTH=1').not.toBe(404);
  expect(res.ok(), `sign-up for ${email} failed (${res.status()})`).toBeTruthy();
  const body = (await res.json()) as { user: { id: string } };
  return body.user.id;
}

async function signIn(page: Page, email: string): Promise<void> {
  const res = await page.request.post('/api/auth/sign-in/email', {
    headers: { Origin: ORIGIN },
    data: { email, password: PASSWORD },
    failOnStatusCode: false,
  });
  expect(res.ok(), `sign-in for ${email} failed (${res.status()})`).toBeTruthy();
}

async function completeOnboarding(page: Page): Promise<void> {
  const res = await page.request.post('/api/test/complete-onboarding', {
    headers: { Origin: ORIGIN },
    failOnStatusCode: false,
  });
  expect(res.ok(), `onboarding completion failed (${res.status()})`).toBeTruthy();
}

test('a second account on the same browser cannot see or be forwarded the first account', async ({
  page,
}) => {
  const emailA = `e2e-switch-a-${crypto.randomUUID()}@significanthobbies.test`;
  const userIdA = await signUp(page, emailA, 'Account A');
  await completeOnboarding(page);

  // A creates uniquely named private work through the real UI.
  const secret = `Orion drill ${crypto.randomUUID().slice(0, 8)}`;
  await page.goto('/live-more');
  await page.getByLabel('What do you still want to live?').fill(secret);
  const keep = page.getByRole('button', { name: 'Keep this exact dream' });
  await waitForHydrated(keep);
  await keep.click();
  await expect(page.getByText('1 dream is now in your atlas.')).toBeVisible();
  await page.goto('/bucket-list');
  const aRow = page.getByRole('group', { name: `Controls for ${secret}` });
  await expect(aRow).toHaveCount(1);

  // Sign out through the real nav control — that path also refreshes the
  // client router, so a cached private view cannot survive into B's session.
  const menu = page.getByRole('button', { name: 'Open account menu' });
  await waitForHydrated(menu);
  await menu.click();
  await page.getByRole('menuitem', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/\/$/);
  const afterSignOut = await page.request.get('/api/personal-platform/session', {
    failOnStatusCode: false,
  });
  expect(afterSignOut.status(), 'sign-out must revoke the session').toBe(401);

  // Anonymous again on this browser: whichever surface renders, A's row must not.
  await page.goto('/bucket-list');
  await expect(page.getByRole('group', { name: `Controls for ${secret}` })).toHaveCount(0);
  await expect(page.getByText(secret)).toHaveCount(0);

  // B signs in on the same browser profile.
  const emailB = `e2e-switch-b-${crypto.randomUUID()}@significanthobbies.test`;
  const userIdB = await signUp(page, emailB, 'Account B');
  await completeOnboarding(page);
  const bSession = await page.request.get('/api/personal-platform/session');
  expect((await bSession.json()).userId).toBe(userIdB);

  // B's session-scoped reads see an empty account, not A's record.
  const bSummary = await page.request.get('/api/personal-platform/live/summary', {
    headers: { 'X-Personal-User-Id': userIdB },
  });
  expect(bSummary.ok()).toBeTruthy();
  expect((await bSummary.json()).activeCount).toBe(0);

  // B's cookie forwarded as A's id fails closed at the real handler.
  const spoofed = await page.request.get('/api/personal-platform/live/summary', {
    headers: { 'X-Personal-User-Id': userIdA },
    failOnStatusCode: false,
  });
  expect(spoofed.status()).toBe(401);

  await page.goto('/bucket-list');
  await expect(page.getByRole('group', { name: `Controls for ${secret}` })).toHaveCount(0);
  await expect(page.getByText(secret)).toHaveCount(0);
});

test('an expired session gets one sign-in prompt that retains and returns to the destination', async ({
  page,
}) => {
  const email = `e2e-expiry-${crypto.randomUUID()}@significanthobbies.test`;
  await signUp(page, email, 'Expiry Owner');
  await completeOnboarding(page);

  // Build a real private list so the destination is an owner-guarded route.
  await page.goto('/bucket-list/new');
  const month = page.getByRole('button', { name: /This month/i });
  await waitForHydrated(month);
  await month.click();
  await page.getByRole('button', { name: /Keep it cozy/i }).click();
  await page.getByRole('button', { name: 'Make my Life Bingo' }).click();
  await page.getByRole('button', { name: 'Save list' }).click();
  // `/bucket-list/new` itself matches a lax id pattern — exclude it so the
  // assertion cannot settle before the post-save navigation finishes.
  await expect(page).toHaveURL(/\/bucket-list\/(?!new$)[^/]+$/);
  const listPath = new URL(page.url()).pathname;

  // Age the stored session out — the real row, not a discarded cookie.
  const expired = await page.request.post('/api/test/expire-session', {
    headers: { Origin: ORIGIN },
    failOnStatusCode: false,
  });
  expect(expired.status(), 'Run the local test server with ENABLE_TEST_AUTH=1').not.toBe(404);
  expect(expired.ok()).toBeTruthy();

  // One prompt, destination retained — not a loop, not a silent homepage send.
  await page.goto(listPath);
  await expect(page).toHaveURL(`/login?callbackUrl=${encodeURIComponent(listPath)}`);
  await expect(
    page.getByRole('button', { name: 'Continue with Google', exact: true })
  ).toBeVisible();

  // Signing back in returns to the same private destination with its data.
  await signIn(page, email);
  await page.goto(`/login?callbackUrl=${encodeURIComponent(listPath)}`);
  await expect(page).toHaveURL(listPath);
  await expect(page.getByRole('button', { name: 'Export' })).toBeVisible();
});
