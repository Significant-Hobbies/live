import { expect, test } from '@playwright/test';

import { waitForHydrated } from './fixtures/hydration';

for (const intent of ['callbackUrl', 'returnTo']) {
  test(`Hub ${intent} survives a failed sign-in attempt`, async ({ page }) => {
    const requests: Record<string, unknown>[] = [];
    await page.route('**/api/auth/sign-in/social', async (route) => {
      requests.push(route.request().postDataJSON());
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ code: 'UNAVAILABLE', message: 'Synthetic provider outage' }),
      });
    });
    await page.goto(`/login?${intent}=%2Fhub`);
    await expect(
      page.getByText('You will return there after signing in.', { exact: false })
    ).toBeVisible();
    const button = page.getByRole('button', { name: 'Continue with Google', exact: true });
    await waitForHydrated(button);
    await button.click();
    await expect(page.getByText('Sign-in did not finish.', { exact: false })).toBeVisible();
    await expect(button).toBeEnabled();
    expect(requests).toEqual([
      {
        provider: 'google',
        callbackURL: '/hub',
        errorCallbackURL: '/login?callbackUrl=%2Fhub&error=signin_failed',
      },
    ]);
    await expect(
      page.getByRole('link', { name: 'continue as guest', exact: true })
    ).toHaveAttribute('href', 'https://significanthobbies.com/');
  });
}

test('cancelled Hub sign-in displays retry and a public exit', async ({ page }) => {
  await page.goto('/login?callbackUrl=%2Fhub&error=access_denied');
  await expect(page.getByText('Sign-in did not finish.', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: 'continue as guest', exact: true })).toHaveAttribute(
    'href',
    'https://significanthobbies.com/'
  );
});
