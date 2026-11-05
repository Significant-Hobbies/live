import type { Page } from '@playwright/test';
import { expect, test } from './fixtures/auth';
import { waitForHydrated } from './fixtures/hydration';

async function addItem(page: Page, title: string) {
  await page.goto('/bucket-list');
  const input = page.getByRole('textbox', { name: 'Add something you want to do', exact: true });
  await waitForHydrated(input);
  await expect(input).toBeEnabled();
  await input.fill(title);
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  const open = page.getByRole('button', { name: `Open ${title}`, exact: true });
  await expect(open).toBeVisible();
  await open.click();
  return page.getByRole('complementary', { name: `Item: ${title}`, exact: true });
}

test('guest updates survive reload in newest-first order without replacing notes or status', async ({
  page,
}, testInfo) => {
  const title = `Learn to sail ${crypto.randomUUID()}`;
  let panel = await addItem(page, title);
  await panel
    .getByRole('textbox', { name: 'Notes', exact: true })
    .fill('At the local sailing club.');
  const draft = panel.getByRole('textbox', { name: 'Add an update', exact: true });
  await draft.fill('Booked a first lesson.\nGoing with Sam.');
  await panel.getByRole('button', { name: 'Post update', exact: true }).click();
  await expect(panel.getByRole('list', { name: 'Item updates' }).getByRole('listitem')).toHaveCount(
    1
  );
  await draft.fill('First afternoon on the water!');
  await panel.getByRole('button', { name: 'Post update', exact: true }).click();
  await expect(draft).toHaveValue('');
  await page.reload();
  await waitForHydrated(page.getByRole('button', { name: `Open ${title}`, exact: true }));
  await page.getByRole('button', { name: `Open ${title}`, exact: true }).click();
  panel = page.getByRole('complementary', { name: `Item: ${title}`, exact: true });
  const updates = panel.getByRole('list', { name: 'Item updates' }).getByRole('listitem');
  await expect(updates).toHaveCount(2);
  await expect(updates.first()).toContainText('First afternoon on the water!');
  await expect(updates.last()).toContainText('Booked a first lesson.');
  await expect(panel.locator('time[datetime]')).toHaveCount(2);
  await expect(panel.getByRole('textbox', { name: 'Notes', exact: true })).toHaveValue(
    'At the local sailing club.'
  );
  await expect(panel.getByRole('radio', { name: 'To do', exact: true })).toBeChecked();
  await expect(page.locator('body')).toHaveJSProperty(
    'scrollWidth',
    await page.locator('body').evaluate((body) => body.clientWidth)
  );
  await panel.screenshot({ path: testInfo.outputPath('bucket-updates-panel.png') });
});

test('an aborted guest update retains its draft and retries once', async ({ page }) => {
  const title = `Go stargazing ${crypto.randomUUID()}`;
  const panel = await addItem(page, title);
  const draft = panel.getByRole('textbox', { name: 'Add an update', exact: true });
  const text = 'Found a dark-sky spot for Friday.';
  await draft.fill(text);
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      const request = original.apply(this, args);
      request.addEventListener('success', () => this.transaction.abort(), { once: true });
      IDBObjectStore.prototype.put = original;
      return request;
    };
  });
  await panel.getByRole('button', { name: 'Post update', exact: true }).click();
  await expect(panel.getByRole('alert')).toContainText('Your draft is still here.');
  await expect(draft).toHaveValue(text);
  await expect(panel.getByRole('list', { name: 'Item updates' })).toHaveCount(0);
  await panel.getByRole('button', { name: 'Post update', exact: true }).click();
  await expect(draft).toHaveValue('');
  await page.reload();
  await page.getByRole('button', { name: `Open ${title}`, exact: true }).click();
  const updates = page.getByRole('list', { name: 'Item updates' }).getByRole('listitem');
  await expect(updates).toHaveCount(1);
  await expect(updates).toContainText(text);
});

test('account updates survive reload and are absent from another account', async ({
  authedPage: page,
  browser,
}) => {
  const title = `Make a first ceramic bowl ${crypto.randomUUID()}`;
  const secret = `Found a pottery studio ${crypto.randomUUID()}`;
  const profile = '/u/e2e-bucket-updates';
  const prepareProfile = await page.request.post('/api/test/complete-onboarding', {
    data: { username: 'e2e-bucket-updates' },
  });
  expect(prepareProfile.ok()).toBeTruthy();
  let panel = await addItem(page, title);
  await panel.getByRole('combobox', { name: 'Visibility', exact: true }).selectOption('public');
  const draft = panel.getByRole('textbox', { name: 'Add an update', exact: true });
  await expect(draft).toBeEnabled();
  await draft.fill(secret);
  await panel.getByRole('button', { name: 'Post update', exact: true }).click();
  await expect(panel.getByRole('list', { name: 'Item updates' })).toContainText(secret);
  await draft.fill('Finished glazing the bowl.');
  await panel.getByRole('button', { name: 'Post update', exact: true }).click();
  await expect(draft).toHaveValue('');
  await page.reload();
  await waitForHydrated(page.getByRole('button', { name: `Open ${title}`, exact: true }));
  await page.getByRole('button', { name: `Open ${title}`, exact: true }).click();
  panel = page.getByRole('complementary', { name: `Item: ${title}`, exact: true });
  const updates = panel.getByRole('list', { name: 'Item updates' }).getByRole('listitem');
  await expect(updates).toHaveCount(2);
  await expect(updates.first()).toContainText('Finished glazing the bowl.');
  await expect(updates.last()).toContainText(secret);
  const other = await browser.newContext({ baseURL: test.info().project.use.baseURL });
  try {
    const signup = await other.request.post('/api/auth/sign-up/email', {
      data: {
        email: `bucket-updates-${crypto.randomUUID()}@significanthobbies.test`,
        password: 'e2e-test-password-not-a-secret',
        name: 'Other bucket owner',
      },
    });
    expect(signup.ok()).toBeTruthy();
    const otherPage = await other.newPage();
    await otherPage.goto('/bucket-list');
    await expect(otherPage.getByRole('heading', { name: 'My list', exact: true })).toBeVisible();
    await expect(otherPage.getByText(secret, { exact: true })).toHaveCount(0);
    await expect(otherPage.getByRole('button', { name: `Open ${title}`, exact: true })).toHaveCount(
      0
    );
    await otherPage.goto(profile);
    await expect(otherPage.getByText(title, { exact: true })).toBeVisible();
    await expect(otherPage.getByText(secret, { exact: true })).toHaveCount(0);
    await expect(otherPage.getByText('Finished glazing the bowl.', { exact: true })).toHaveCount(0);
  } finally {
    await other.close();
  }
});
