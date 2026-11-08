import { randomUUID } from 'node:crypto';
import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { waitForHydrated } from './fixtures/hydration';

test.setTimeout(90_000);

async function signUp(page: Page, username?: string) {
  const id = randomUUID().slice(0, 8);
  const response = await page.request.post('/api/auth/sign-up/email', {
    headers: { Origin: 'http://localhost:3000' },
    data: {
      email: `privacy-${id}@example.test`,
      password: 'privacy-test-password-only',
      name: `Privacy owner ${id}`,
    },
  });
  expect(response.ok()).toBe(true);
  expect(
    (await page.request.post('/api/test/complete-onboarding', { data: { username } })).ok()
  ).toBe(true);
}

async function action(page: Page, operation: () => Promise<unknown>) {
  const completed = page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' && Boolean(response.request().headers()['next-action'])
  );
  await operation();
  const response = await completed;
  expect(response.ok()).toBe(true);
}

async function addItem(page: Page, title: string, note: string, visible: boolean) {
  await page.goto('/bucket-list');
  const input = page.getByRole('textbox', { name: 'Add something you want to do', exact: true });
  await waitForHydrated(input);
  await input.fill(title);
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  const row = page.getByRole('button', { name: `Open ${title}`, exact: true });
  await expect(row).toBeVisible();
  await row.click();
  const panel = page.getByRole('complementary', { name: `Item: ${title}`, exact: true });
  const notes = panel.getByRole('textbox', { name: 'Notes', exact: true });
  await notes.fill(note);
  await action(page, () => notes.press('Tab'));
  const visibility = panel.getByRole('combobox', { name: 'Who can see this item?', exact: true });
  await expect(visibility).toHaveValue('private');
  if (visible) {
    await action(page, () => visibility.selectOption('public'));
    await expect(visibility).toBeEnabled();
  }
  await page.reload();
  await page.getByRole('button', { name: `Open ${title}`, exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Notes', exact: true })).toHaveValue(note);
}

test('a public profile includes only individually shared items and becomes hidden when made private', async ({
  page,
  browser,
}, testInfo) => {
  const username = `privacy-${randomUUID().slice(0, 8)}`;
  const hidden = `Hidden goal ${username}`;
  const shared = `Shared goal ${username}`;
  const note = `Private note ${username}`;
  await signUp(page, username);
  const visitor = await browser.newContext();
  try {
    expect((await visitor.request.get(`http://localhost:3000/u/${username}`)).status()).toBe(404);
    await addItem(page, hidden, note, false);
    await addItem(page, shared, `${note} for shared item`, true);
    await page.goto('/settings');
    const control = page.getByRole('combobox', { name: 'Who can see your profile?', exact: true });
    await waitForHydrated(control);
    await expect(control).toHaveValue('private');
    await control.selectOption('public');
    await page.getByRole('button', { name: 'Save profile visibility', exact: true }).click();
    await expect(
      page.getByRole('status', { exact: true }).filter({ hasText: 'Your profile is public.' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Save profile visibility', exact: true })
    ).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Saving…', exact: true })).toHaveCount(0);
    await page.screenshot({
      path: testInfo.outputPath('profile-privacy-settings.png'),
      caret: 'initial',
    });
    const profile = await visitor.request.get(`http://localhost:3000/u/${username}`);
    expect(profile.status()).toBe(200);
    const html = await profile.text();
    expect(html).toContain(shared);
    expect(html).not.toContain(hidden);
    expect(html).not.toContain(note);
    const md = await visitor.request.get(
      `http://localhost:3000/api/ai/markdown?path=${encodeURIComponent(`/u/${username}`)}`
    );
    expect(md.ok()).toBe(true);
    expect(await md.text()).toContain(shared);
    expect(await md.text()).not.toContain(hidden);
    expect(await md.text()).not.toContain(note);
    expect(await (await visitor.request.get('http://localhost:3000/sitemap.xml')).text()).toContain(
      `/u/${username}`
    );
    const publicPage = await visitor.newPage();
    await publicPage.goto(`http://localhost:3000/u/${username}`);
    await expect(publicPage.getByText(shared, { exact: true })).toBeVisible();
    await publicPage.screenshot({ path: testInfo.outputPath('public-profile.png') });
    expect(
      await publicPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
    ).toBe(true);

    await control.selectOption('private');
    await page.getByRole('button', { name: 'Save profile visibility', exact: true }).click();
    await expect(
      page.getByRole('status', { exact: true }).filter({ hasText: 'Your profile is private.' })
    ).toBeVisible();
    expect((await visitor.request.get(`http://localhost:3000/u/${username}`)).status()).toBe(404);
    expect(
      (
        await visitor.request.get(
          `http://localhost:3000/api/ai/markdown?path=${encodeURIComponent(`/u/${username}`)}`
        )
      ).status()
    ).toBe(404);
    expect(
      await (await visitor.request.get('http://localhost:3000/sitemap.xml')).text()
    ).not.toContain(`/u/${username}`);
    const privateImage = await visitor.request.get(
      `http://localhost:3000/u/${username}/opengraph-image`
    );
    const unknownImage = await visitor.request.get(
      'http://localhost:3000/u/no-such-privacy-user/opengraph-image'
    );
    expect(privateImage.headers()['cache-control']).toContain('no-store');
    expect(await privateImage.body()).toEqual(await unknownImage.body());
    await page.goto(`/u/${username}`);
    await expect(
      page.getByText('Your profile is private. Only you can view it.', { exact: true })
    ).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true
    );
  } finally {
    await visitor.close();
  }
});

test('a first public handle is claimed through the account and an unconfirmed save does not claim privacy', async ({
  page,
}, testInfo) => {
  const username = `claim-${randomUUID().slice(0, 8)}`;
  await signUp(page);
  await page.goto('/settings');
  const control = page.getByRole('combobox', { name: 'Who can see your profile?', exact: true });
  await waitForHydrated(control);
  await control.selectOption('public');
  await page.getByRole('textbox', { name: 'Public username', exact: true }).fill(username);
  await page.route('**/settings', async (route) => {
    if (route.request().method() === 'POST' && route.request().headers()['next-action']) {
      await route.fetch();
      await route.abort();
    } else await route.continue();
  });
  await page.getByRole('button', { name: 'Save profile visibility', exact: true }).click();
  await expect(
    page.getByRole('alert').filter({ hasText: 'We could not confirm the change' })
  ).toBeVisible();
  await expect(
    page.getByText('Your profile is hidden from other people.', { exact: true })
  ).toHaveCount(0);
  await page.unroute('**/settings');
  await page.getByRole('button', { name: 'Save profile visibility', exact: true }).click();
  await expect(
    page.getByRole('link', { name: 'View your public profile', exact: true })
  ).toHaveAttribute('href', `/u/${username}`);
  await page.reload();
  await expect(control).toHaveValue('public');
  await waitForHydrated(control);
  await page.screenshot({
    path: testInfo.outputPath('profile-public-handle.png'),
    caret: 'initial',
  });
});

test('a stale Settings page cannot publish a newly signed-in account', async ({
  page,
  browser,
}) => {
  const first = `first-${randomUUID().slice(0, 8)}`;
  const second = `second-${randomUUID().slice(0, 8)}`;
  await signUp(page, first);
  await page.goto('/settings');
  const control = page.getByRole('combobox', { name: 'Who can see your profile?', exact: true });
  await waitForHydrated(control);
  await control.selectOption('public');
  expect(
    (
      await page.request.post('/api/auth/sign-out', {
        data: {},
        headers: { Origin: 'http://localhost:3000' },
      })
    ).ok()
  ).toBe(true);
  await signUp(page, second);
  await action(page, () =>
    page.getByRole('button', { name: 'Save profile visibility', exact: true }).click()
  );
  await expect(page.getByRole('button', { name: 'Saving…', exact: true })).toHaveCount(0);
  const visitor = await browser.newContext();
  try {
    expect((await visitor.request.get(`http://localhost:3000/u/${second}`)).status()).toBe(404);
    expect((await visitor.request.get(`http://localhost:3000/u/${first}`)).status()).toBe(404);
    await expect(
      page.getByRole('alert').filter({ hasText: 'Your signed-in account changed.' })
    ).toBeVisible();
  } finally {
    await visitor.close();
  }
});

test('a stale Settings page cannot claim a first handle for a newly signed-in account', async ({
  page,
  browser,
}) => {
  const username = `stale-${randomUUID().slice(0, 8)}`;
  await signUp(page);
  await page.goto('/settings');
  const control = page.getByRole('combobox', { name: 'Who can see your profile?', exact: true });
  await waitForHydrated(control);
  await control.selectOption('public');
  await page.getByRole('textbox', { name: 'Public username', exact: true }).fill(username);
  expect(
    (
      await page.request.post('/api/auth/sign-out', {
        data: {},
        headers: { Origin: 'http://localhost:3000' },
      })
    ).ok()
  ).toBe(true);
  await signUp(page);
  await action(page, () =>
    page.getByRole('button', { name: 'Save profile visibility', exact: true }).click()
  );
  await expect(
    page.getByRole('alert').filter({ hasText: 'Your signed-in account changed.' })
  ).toBeVisible();
  const visitor = await browser.newContext();
  try {
    expect((await visitor.request.get(`http://localhost:3000/u/${username}`)).status()).toBe(404);
    await page.reload();
    await waitForHydrated(control);
    await expect(control).toHaveValue('private');
    await control.selectOption('public');
    await expect(page.getByRole('textbox', { name: 'Public username', exact: true })).toHaveValue(
      ''
    );
  } finally {
    await visitor.close();
  }
});
