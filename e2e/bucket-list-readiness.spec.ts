import { readFile } from 'node:fs/promises';
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures/auth';
import { waitForHydrated } from './fixtures/hydration';

async function openItem(page: Page, title: string) {
  const row = page.getByRole('button', { name: `Open ${title}`, exact: true });
  await waitForHydrated(row);
  await row.click();
  return page.getByRole('complementary', { name: `Item: ${title}`, exact: true });
}

async function addItem(page: Page, title: string) {
  await page.goto('/bucket-list');
  const input = page.getByRole('textbox', { name: 'Add something you want to do', exact: true });
  await waitForHydrated(input);
  await expect(input).toBeEnabled();
  await input.fill(title);
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  return openItem(page, title);
}

async function signUp(page: Page, email: string, origin = new URL(page.url()).origin) {
  const result = await page.request.post('/api/auth/sign-up/email', {
    headers: { Origin: origin },
    data: { email, password: 'e2e-test-password-not-a-secret', name: 'List readiness owner' },
  });
  expect(result.status(), 'This acceptance test requires local test auth').not.toBe(404);
  if (!result.ok()) {
    const failure = await result.json().catch(() => ({}));
    throw new Error(
      `Test signup failed (${result.status()}): ${failure.code ?? ''} ${failure.message ?? ''}`
    );
  }
  expect((await page.request.post('/api/test/complete-onboarding')).ok()).toBeTruthy();
}

test('a 42-item guest list can be searched, filtered, renamed, fully exported and removed with Undo', async ({
  page,
}, testInfo) => {
  await page.goto('/bucket-list');
  await waitForHydrated(
    page.getByRole('textbox', { name: 'Add something you want to do', exact: true })
  );
  await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const open = indexedDB.open('significant-hobbies-local', 1);
      open.onsuccess = () => resolve(open.result);
      open.onerror = () => reject(open.error);
    });
    const transaction = database.transaction('records', 'readwrite');
    transaction.objectStore('records').put(
      {
        key: 'onboarding:bucket-items',
        domain: 'bucket-list',
        schemaVersion: 1,
        installationId: 'readiness-test',
        updatedAt: new Date().toISOString(),
        value: {
          items: Array.from({ length: 42 }, (_, index) => ({
            id: `readiness-${index}`,
            title: `Goal ${index}`,
            status: index % 7 === 0 ? 'done' : 'planned',
            category: index % 2 === 0 ? 'creative' : 'adventure',
            notes: index === 41 ? 'Harbor plans' : null,
            steps: [],
            updates: [],
          })),
        },
      },
      'onboarding:bucket-items'
    );
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(transaction.error);
    });
    database.close();
  });
  await page.reload();
  const search = page.getByRole('searchbox', { name: 'Search my list', exact: true });
  await expect(search).toBeVisible();
  for (const name of ['Filter by status', 'Filter by category']) {
    const box = await page.getByRole('combobox', { name, exact: true }).boundingBox();
    expect(box?.height, `${name} touch target height`).toBeGreaterThanOrEqual(44);
  }
  await search.fill('Harbor');
  await expect(page.getByRole('button', { name: /^Open Goal / })).toHaveCount(1);
  await page.getByRole('combobox', { name: 'Filter by status', exact: true }).selectOption('done');
  await expect(page.getByText('No items match these filters.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await search.fill('Goal 41');
  let panel = await openItem(page, 'Goal 41');
  await panel.getByRole('button', { name: 'Edit title', exact: true }).click();
  await panel
    .getByRole('textbox', { name: 'Item title', exact: true })
    .fill('Book a sailing lesson');
  await panel.getByRole('button', { name: 'Save title', exact: true }).click();
  await search.fill('Book a sailing lesson');
  panel = await openItem(page, 'Book a sailing lesson');
  await panel
    .getByRole('textbox', { name: 'Notes', exact: true })
    .fill('Latest notes before export');
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export all', exact: true }).click();
  const download = await downloading;
  const backup = JSON.parse(await readFile((await download.path())!, 'utf8'));
  expect(backup.items).toHaveLength(42);
  expect(backup.items.find((item: { id: string }) => item.id === 'readiness-41')).toMatchObject({
    title: 'Book a sailing lesson',
    notes: 'Latest notes before export',
  });
  await panel.getByRole('button', { name: 'Remove from list', exact: true }).click();
  await panel.getByRole('button', { name: 'Remove', exact: true }).click();
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Open Book a sailing lesson', exact: true })
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Open Book a sailing lesson', exact: true })
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
  ).toBeTruthy();
  await page.screenshot({ path: testInfo.outputPath('list-readiness.png') });
});

test('guest evidence imports privately and survives reload and another signed-in browser', async ({
  page,
  browser,
}) => {
  const title = `Sail with friends ${crypto.randomUUID()}`;
  const email = `bucket-import-${crypto.randomUUID()}@significanthobbies.test`;
  let panel = await addItem(page, title);
  await panel.getByRole('textbox', { name: 'Notes', exact: true }).fill('Keep this device note.');
  await panel
    .getByRole('textbox', { name: 'Add an update', exact: true })
    .fill('Found a sailing club.');
  await panel.getByRole('button', { name: 'Post update', exact: true }).click();
  await panel.getByRole('textbox', { name: 'Add a step', exact: true }).fill('Call the club');
  await panel.getByRole('button', { name: 'Add', exact: true }).click();
  await panel.getByRole('radio', { name: 'Doing', exact: true }).click();
  await panel.getByRole('combobox', { name: 'Target year', exact: true }).selectOption('2027');
  await expect(panel.getByRole('combobox', { name: 'Target year', exact: true })).toBeEnabled();
  await signUp(page, email);
  await page.reload();
  await page.getByRole('button', { name: 'Import device list (1)', exact: true }).click();
  await expect(
    page.getByText('All items, steps and private updates are saved.', { exact: true })
  ).toBeVisible();
  await page.getByRole('button', { name: 'Not now', exact: true }).click();
  panel = await openItem(page, title);
  await expect(panel.getByRole('textbox', { name: 'Notes', exact: true })).toHaveValue(
    'Keep this device note.'
  );
  await expect(panel.getByRole('radio', { name: 'Doing', exact: true })).toBeChecked();
  await expect(panel.getByRole('checkbox', { name: 'Call the club', exact: true })).toBeVisible();
  await expect(panel.getByRole('list', { name: 'Item updates' })).toContainText(
    'Found a sailing club.'
  );
  await expect(panel.getByRole('combobox', { name: 'Visibility', exact: true })).toHaveValue(
    'private'
  );
  await page.reload();
  await expect(page.getByRole('button', { name: `Open ${title}`, exact: true })).toBeVisible();
  const origin = new URL(page.url()).origin;
  const second = await browser.newContext({ baseURL: origin });
  const stranger = await browser.newContext({ baseURL: origin });
  try {
    const login = await second.request.post('/api/auth/sign-in/email', {
      headers: { Origin: origin },
      data: { email, password: 'e2e-test-password-not-a-secret' },
    });
    expect(login.ok()).toBeTruthy();
    const otherPage = await second.newPage();
    await otherPage.goto('/bucket-list');
    const otherPanel = await openItem(otherPage, title);
    await expect(otherPanel.getByRole('textbox', { name: 'Notes', exact: true })).toHaveValue(
      'Keep this device note.'
    );
    await expect(otherPanel.getByRole('list', { name: 'Item updates' })).toContainText(
      'Found a sailing club.'
    );
    const strangerPage = await stranger.newPage();
    await signUp(
      strangerPage,
      `bucket-stranger-${crypto.randomUUID()}@significanthobbies.test`,
      origin
    );
    await strangerPage.goto('/bucket-list');
    await expect(
      strangerPage.getByRole('button', { name: `Open ${title}`, exact: true })
    ).toHaveCount(0);
  } finally {
    await second.close();
    await stranger.close();
  }
});

test('a concurrent device edit is retained after account import acknowledges its snapshot', async ({
  page,
}) => {
  const title = `Concurrent import ${crypto.randomUUID()}`;
  await addItem(page, title);
  await signUp(page, `bucket-concurrent-${crypto.randomUUID()}@significanthobbies.test`);
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Import device list (1)', exact: true })
  ).toBeVisible();
  let changed = false;
  await page.route('**/bucket-list', async (route) => {
    if (route.request().method() !== 'POST' || changed) {
      await route.continue();
      return;
    }
    changed = true;
    const response = await route.fetch();
    await page.evaluate(async () => {
      const database = await new Promise<IDBDatabase>((resolve) => {
        const request = indexedDB.open('significant-hobbies-local', 1);
        request.onsuccess = () => resolve(request.result);
      });
      const transaction = database.transaction('records', 'readwrite');
      const store = transaction.objectStore('records');
      const read = store.get('onboarding:bucket-items');
      read.onsuccess = () => {
        const value = read.result;
        value.value.items.push({
          id: crypto.randomUUID(),
          title: 'A newer device goal',
          status: 'planned',
          steps: [],
          updates: [],
        });
        store.put(value, 'onboarding:bucket-items');
      };
      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onabort = () => reject(transaction.error);
      });
      database.close();
    });
    await route.fulfill({ response });
  });
  await page.getByRole('button', { name: 'Import device list (1)', exact: true }).click();
  await expect(page.getByText(/Your device list changed during import/)).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Import device list (2)', exact: true })
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Export device copy', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Import device list (2)', exact: true }).click();
  await expect(
    page.getByText('All items, steps and private updates are saved.', { exact: true })
  ).toBeVisible();
  await page.getByRole('button', { name: 'Not now', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Open A newer device goal', exact: true })
  ).toBeVisible();
});

test('an aborted device archive keeps the local original and import can be retried safely', async ({
  page,
}) => {
  const title = `Archive abort ${crypto.randomUUID()}`;
  await addItem(page, title);
  await signUp(page, `bucket-abort-${crypto.randomUUID()}@significanthobbies.test`);
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Import device list (1)', exact: true })
  ).toBeVisible();
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      const request = original.apply(this, args);
      if (typeof args[1] === 'string' && args[1].startsWith('archive:onboarding:bucket-items:')) {
        request.addEventListener('success', () => this.transaction.abort(), { once: true });
        IDBObjectStore.prototype.put = original;
      }
      return request;
    };
  });
  await page.getByRole('button', { name: 'Import device list (1)', exact: true }).click();
  await expect(
    page.getByRole('alert').filter({ hasText: 'Your device copy is safe' })
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Export device copy', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Import device list (1)', exact: true }).click();
  await expect(
    page.getByText('All items, steps and private updates are saved.', { exact: true })
  ).toBeVisible();
  await page.getByRole('button', { name: 'Not now', exact: true }).click();
  await expect(page.getByRole('button', { name: `Open ${title}`, exact: true })).toHaveCount(1);
  await page.reload();
  await expect(page.getByRole('button', { name: `Open ${title}`, exact: true })).toHaveCount(1);
});
