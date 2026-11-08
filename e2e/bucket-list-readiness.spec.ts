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

async function seedDeviceItems(page: Page, items: unknown[]) {
  await page.evaluate(async (items) => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('significant-hobbies-local', 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const transaction = database.transaction('records', 'readwrite');
    transaction.objectStore('records').put(
      {
        key: 'onboarding:bucket-items',
        domain: 'bucket-list',
        schemaVersion: 1,
        installationId: 'review-regression',
        updatedAt: new Date().toISOString(),
        value: { items },
      },
      'onboarding:bucket-items'
    );
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(transaction.error);
    });
    database.close();
  }, items);
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
  await expect(
    panel.getByRole('combobox', { name: 'Who can see this item?', exact: true })
  ).toHaveValue('private');
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

test('exporting legacy guest items preserves later edits and leaving the Undo window cancels removal', async ({
  page,
}) => {
  await page.goto('/bucket-list');
  await waitForHydrated(
    page.getByRole('textbox', { name: 'Add something you want to do', exact: true })
  );
  await seedDeviceItems(page, ['Legacy sailing goal', { title: 'Legacy garden goal' }]);
  await page.reload();
  let panel = await openItem(page, 'Legacy sailing goal');
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export all', exact: true }).click();
  const backup = JSON.parse(await readFile((await (await downloading).path())!, 'utf8'));
  expect(backup.items).toHaveLength(2);
  await panel.getByRole('button', { name: 'Edit title', exact: true }).click();
  await panel
    .getByRole('textbox', { name: 'Item title', exact: true })
    .fill('Sail with old friends');
  await panel.getByRole('button', { name: 'Save title', exact: true }).click();
  panel = await openItem(page, 'Sail with old friends');
  await panel.getByRole('button', { name: 'Remove from list', exact: true }).click();
  await panel.getByRole('button', { name: 'Remove', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Undo', exact: true })).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Open Sail with old friends', exact: true })
  ).toBeVisible();
});

test('a large guest list imports in batches and keeps non-Latin goals distinct with duplicate rename feedback', async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.goto('/bucket-list');
  await waitForHydrated(
    page.getByRole('textbox', { name: 'Add something you want to do', exact: true })
  );
  const titles = ['東京を旅する', '京都を旅する', 'हिन्दी सीखना', '!!!', '???'];
  await seedDeviceItems(
    page,
    Array.from({ length: 101 }, (_, index) => ({
      id: `large-${index}`,
      title: titles[index] ?? `Imported goal ${index}`,
      status: 'planned',
      steps: [],
      updates: [],
    }))
  );
  await signUp(page, `bucket-large-${crypto.randomUUID()}@significanthobbies.test`);
  await page.reload();
  await page.getByRole('button', { name: 'Import device list (101)', exact: true }).click();
  await expect(
    page.getByText('All items, steps and private updates are saved.', { exact: true })
  ).toBeVisible({ timeout: 30_000 });
  await page.getByRole('button', { name: 'Not now', exact: true }).click();
  await expect(page.locator('main button[aria-expanded]')).toHaveCount(101);
  const search = page.getByRole('searchbox', { name: 'Search my list', exact: true });
  await search.fill('東京');
  await expect(page.locator('main button[aria-expanded]')).toHaveCount(1);
  let panel = await openItem(page, titles[0]!);
  await panel.getByRole('button', { name: 'Edit title', exact: true }).click();
  await panel.getByRole('textbox', { name: 'Item title', exact: true }).fill(titles[1]!);
  await panel.getByRole('button', { name: 'Save title', exact: true }).click();
  await expect(
    page.getByRole('alert').filter({ hasText: 'This item is already in your list.' })
  ).toBeVisible();
  await expect(panel.getByRole('textbox', { name: 'Item title', exact: true })).toHaveValue(
    titles[1]!
  );
  await page.reload();
  await expect(page.locator('main button[aria-expanded]')).toHaveCount(101);
  panel = await openItem(page, titles[0]!);
  await expect(
    panel.getByRole('combobox', { name: 'Who can see this item?', exact: true })
  ).toHaveValue('private');
});

test('conflicting device work can be explicitly exported and archived without changing account content', async ({
  page,
}, testInfo) => {
  const title = `Conflicting goal ${crypto.randomUUID()}`;
  await page.goto('/bucket-list');
  await signUp(page, `bucket-resolution-${crypto.randomUUID()}@significanthobbies.test`);
  let panel = await addItem(page, title);
  await panel.getByRole('textbox', { name: 'Notes', exact: true }).fill('Account version to keep');
  await panel.getByRole('radio', { name: 'Doing', exact: true }).click();
  await expect(panel.getByRole('radio', { name: 'Doing', exact: true })).toBeChecked();
  await seedDeviceItems(page, [
    {
      id: 'conflicting-device-item',
      title,
      notes: 'Different device notes',
      status: 'planned',
      steps: [],
      updates: [],
    },
  ]);
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Keep account versions', exact: true })
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Import device list (1)', exact: true }).click();
  await expect(page.getByText(/1 device items need review/)).toBeVisible();
  await page.getByRole('button', { name: 'Keep account versions', exact: true }).click();
  await expect(page.getByText(/Download the full device backup and check/)).toBeVisible();
  const archiveButton = page.getByRole('button', { name: 'Archive device copy', exact: true });
  await expect(archiveButton).toBeDisabled();
  await expect(page.getByRole('checkbox', { name: 'I have saved the backup' })).toBeDisabled();
  await page.screenshot({ path: testInfo.outputPath('device-conflict-confirm.png') });
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download device backup', exact: true }).click();
  const backup = JSON.parse(await readFile((await (await downloading).path())!, 'utf8'));
  expect(backup.items[0]).toMatchObject({ title, notes: 'Different device notes' });
  await expect(archiveButton).toBeDisabled();
  const activeAfterDownload = await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve) => {
      const open = indexedDB.open('significant-hobbies-local', 1);
      open.onsuccess = () => resolve(open.result);
    });
    const transaction = database.transaction('records', 'readonly');
    const active = transaction.objectStore('records').get('onboarding:bucket-items');
    await new Promise<void>((resolve) => {
      transaction.oncomplete = () => resolve();
    });
    database.close();
    return active.result?.value.items;
  });
  expect(activeAfterDownload).toHaveLength(1);
  await page.getByRole('checkbox', { name: 'I have saved the backup' }).check();
  // An older backup acknowledgment must never authorize archiving newer device goals.
  const newerTitle = `New device goal ${crypto.randomUUID()}`;
  await seedDeviceItems(page, [
    ...backup.items,
    { id: 'newer-device-item', title: newerTitle, status: 'planned', steps: [], updates: [] },
  ]);
  await archiveButton.click();
  await expect(
    page.getByText(/The device copy changed, so it has not been archived/)
  ).toBeVisible();
  await expect(archiveButton).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Keep account versions', exact: true })
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Import device list (2)', exact: true }).click();
  await expect(
    page.getByText(/1 imported, 0 already saved. 1 device items need review/)
  ).toBeVisible();
  await page.getByRole('button', { name: 'Keep account versions', exact: true }).click();
  await expect(archiveButton).toBeDisabled();
  await expect(page.getByRole('checkbox', { name: 'I have saved the backup' })).not.toBeChecked();
  const latestDownloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download device backup', exact: true }).click();
  const latestBackup = JSON.parse(
    await readFile((await (await latestDownloading).path())!, 'utf8')
  );
  expect(latestBackup.items).toHaveLength(2);
  await expect(archiveButton).toBeDisabled();
  await page.getByRole('checkbox', { name: 'I have saved the backup' }).check();
  await page.screenshot({ path: testInfo.outputPath('device-conflict-backup-confirmed.png') });
  await archiveButton.click();
  await expect(page.getByText('Your device copy is archived.', { exact: true })).toBeVisible();
  const archiveRetained = await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve) => {
      const open = indexedDB.open('significant-hobbies-local', 1);
      open.onsuccess = () => resolve(open.result);
    });
    const transaction = database.transaction('records', 'readonly');
    const store = transaction.objectStore('records');
    const active = store.get('onboarding:bucket-items');
    const copies = store.getAll();
    await new Promise<void>((resolve) => {
      transaction.oncomplete = () => resolve();
    });
    database.close();
    return {
      active: active.result ?? null,
      notes: copies.result
        .flatMap((copy) => copy.value?.items ?? [])
        .map((item: { notes?: string }) => item.notes),
    };
  });
  expect(archiveRetained.active).toBeNull();
  expect(archiveRetained.notes).toContain('Different device notes');
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Import device list (1)', exact: true })
  ).toHaveCount(0);
  await expect(page.getByRole('button', { name: `Open ${newerTitle}`, exact: true })).toBeVisible();
  panel = await openItem(page, title);
  await expect(panel.getByRole('textbox', { name: 'Notes', exact: true })).toHaveValue(
    'Account version to keep'
  );
  await expect(panel.getByRole('radio', { name: 'Doing', exact: true })).toBeChecked();
});
