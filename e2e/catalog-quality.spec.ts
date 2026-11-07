import { expect, test } from '@playwright/test';
import { CURATED_EXPERIENCES } from '../src/lib/catalog-expansion/entries';
import { CURATED_EXPERIENCE_GUIDES } from '../src/lib/catalog-expansion/plans';
import { EXPERIENCE_CATEGORIES, EXPERIENCE_ENTRIES } from '../src/lib/experiences';
import { waitForHydrated } from './fixtures/hydration';

test('web and AI discovery expose the same expanded catalog and complete plans', async ({
  request,
}) => {
  const webResponse = await request.get('/api/experience-catalog?pageSize=20');
  const mcpResponse = await request.get('/api/mcp/experiences?limit=20');
  expect(webResponse.ok()).toBe(true);
  expect(mcpResponse.ok()).toBe(true);
  const web = await webResponse.json();
  const mcp = await mcpResponse.json();
  expect(web.total).toBeGreaterThanOrEqual(EXPERIENCE_ENTRIES.length);
  expect(mcp.total).toBe(web.total);
  expect(mcp.items.map((entry: { slug: string }) => entry.slug)).toEqual(
    web.items.map((entry: { slug: string }) => entry.slug)
  );
  expect(new Set(web.items.map((entry: { category: string }) => entry.category)).size).toBe(10);

  for (const category of EXPERIENCE_CATEGORIES) {
    const entry = CURATED_EXPERIENCES.find((item) => item.category === category)!;
    const response = await request.get(`/api/mcp/experiences/${entry.slug}`);
    expect(response.ok(), entry.slug).toBe(true);
    const detail = (await response.json()).item;
    const guide = CURATED_EXPERIENCE_GUIDES[entry.slug];
    expect(detail.title).toBe(entry.title);
    expect(detail.guide).toEqual(guide);
    expect(detail.firstSteps).toEqual(guide.steps);
    expect(detail).not.toHaveProperty('editorialSlug');
    expect(detail).not.toHaveProperty('userId');
  }
});

test('a new practical guide is discoverable, sourced and survives saving to my list', async ({
  page,
}, testInfo) => {
  // Keep the local rendering check independent of the analytics provider's CORS policy.
  await page.route('https://us-assets.i.posthog.com/array/*/config*', (route) =>
    route.fulfill({ contentType: 'application/json', body: '{}' })
  );
  const renderErrors: string[] = [];
  page.on('pageerror', (error) => renderErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydrat|invalid HTML|same key/i.test(message.text()))
      renderErrors.push(message.text());
  });
  const entry = CURATED_EXPERIENCES.find((item) => item.slug === 'build-a-folding-paper-peepshow')!;
  const guide = CURATED_EXPERIENCE_GUIDES[entry.slug];
  await page.goto(`/experiences?q=${encodeURIComponent(entry.title)}`);
  await waitForHydrated(page.getByRole('searchbox', { name: 'Search everything', exact: true }));
  const title = page.getByRole('link', { name: entry.title, exact: true });
  await expect(title).toBeVisible();
  const card = page.locator('li').filter({ has: title });
  await expect(card).toContainText('Low cost');
  await expect(card).toContainText('One session');
  await card.evaluate((element) => element.scrollIntoView({ block: 'start' }));
  await expect
    .poll(() =>
      card
        .locator('img')
        .evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)
    )
    .toBe(true);
  await page.screenshot({ path: testInfo.outputPath('catalog-result.png'), caret: 'initial' });
  await title.click();
  await expect(page.getByRole('heading', { name: entry.title, exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Plan the experience', exact: true })
  ).toBeVisible();
  await expect(page.getByText(guide.preparation, { exact: true })).toBeVisible();
  for (const source of guide.resources) {
    await expect(page.getByRole('link', { name: source.title, exact: true })).toHaveAttribute(
      'href',
      source.url
    );
  }
  await page
    .getByRole('heading', { name: 'Plan the experience', exact: true })
    .evaluate((element) => element.scrollIntoView({ block: 'start' }));
  await page.screenshot({ path: testInfo.outputPath('catalog-plan.png'), caret: 'initial' });
  await page
    .getByRole('heading', { name: 'Useful sources', exact: true })
    .evaluate((element) => element.scrollIntoView({ block: 'start' }));
  await page.screenshot({ path: testInfo.outputPath('catalog-sources.png'), caret: 'initial' });
  const save = page.getByRole('button', { name: `Save ${entry.title} to my list`, exact: true });
  await waitForHydrated(save);
  await save.click();
  await expect(
    page.getByRole('button', { name: `Saved ${entry.title} to my list` })
  ).toBeDisabled();
  await page.goto('/bucket-list');
  await expect(
    page.getByRole('button', { name: `Open ${entry.title}`, exact: true })
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('button', { name: `Open ${entry.title}`, exact: true })
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(renderErrors).toEqual([]);
});

test('new topics remain findable from the general site search', async ({ page }, testInfo) => {
  const entry = CURATED_EXPERIENCES.find((item) => item.slug === 'build-a-folding-paper-peepshow')!;
  await page.goto('/search?q=optical%20art');
  const result = page.getByRole('link', { name: new RegExp(entry.title) });
  await expect(result).toBeVisible();
  await expect(result).toHaveAttribute('href', `/experiences/${entry.slug}`);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('general-search.png'), caret: 'initial' });
});
