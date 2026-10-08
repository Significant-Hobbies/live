import { expect, test } from '@playwright/test';
import { waitForHydrated } from './fixtures/hydration';

/**
 * The browsable corpus. Everything here must work without a session — this is
 * the surface that answers "what is possible", and gating it would repeat the
 * mistake the mortality frame had (decisions.md A9).
 */
test.describe('Experiences', () => {
  test('makes the whole corpus available in bounded pages for a signed-out visitor', async ({
    page,
  }) => {
    await page.goto('/experiences');
    await expect(page).toHaveURL(/\/experiences$/);
    await expect(page.getByRole('heading', { name: 'Things you could do.' })).toBeVisible();
    await expect(page.getByText(/^\d+ of \d+$/)).toBeVisible();
    await expect(page.locator('main li').first()).toBeVisible();
    await expect(page.locator('main ul').first().locator(':scope > li')).toHaveCount(20);
    await expect(page.getByRole('button', { name: 'Previous', exact: true })).toBeDisabled();
    const firstTitle = await page.locator('main ul').first().locator('li').first().textContent();
    await waitForHydrated(page.getByRole('button', { name: 'Next', exact: true }));
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByText(/^Page 2 of/)).toBeVisible();
    await expect(page.getByText(/^\d+ of \d+$/)).toBeFocused();
    expect(await page.locator('main ul').first().locator('li').first().textContent()).not.toBe(
      firstTitle
    );
    await expect(page.locator('main ul').first().locator(':scope > li')).toHaveCount(20);
    await page.getByRole('button', { name: 'Travel', exact: true }).click();
    await expect(page.getByText(/^Page 1 of/)).toBeVisible();
  });

  test('exposes exactly one main landmark and one h1', async ({ page }) => {
    await page.goto('/experiences');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('main#main h1')).toHaveCount(1);
  });

  test('last page has no extra rows and cannot advance further', async ({ page }) => {
    await page.goto('/experiences');
    const next = page.getByRole('button', { name: 'Next', exact: true });
    await waitForHydrated(next);
    const total = Number(
      (await page.getByText(/^\d+ of \d+$/).textContent())?.match(/^(\d+)/)?.[1]
    );
    const pages = Math.ceil(total / 20);
    for (let pageNumber = 1; pageNumber < pages; pageNumber++) await next.click();
    await expect(next).toBeDisabled();
    await expect(page.getByText(`Page ${pages} of ${pages}`, { exact: true })).toBeVisible();
    await expect(page.locator('main ul').first().locator(':scope > li')).toHaveCount(
      total % 20 || 20
    );
  });

  test('preserves filtered pagination across reload and browser back', async ({ page }) => {
    await page.goto('/experiences?category=travel&kind=destination&page=2');
    await expect(page.getByText('Page 2 of 4', { exact: true })).toBeVisible();
    await page.reload();
    await expect(page.getByText('Page 2 of 4', { exact: true })).toBeVisible();
    const next = page.getByRole('button', { name: 'Next', exact: true });
    await waitForHydrated(next);
    await next.click();
    await expect(page).toHaveURL(/page=3/);
    await expect(page.getByText('Page 3 of 4', { exact: true })).toBeVisible();
    await page.goBack();
    await expect(page.getByText('Page 2 of 4', { exact: true })).toBeVisible();
  });

  test('API returns bounded shared suggestions and rejects oversized pages', async ({
    request,
  }) => {
    const response = await request.get('/api/experience-catalog?q=pot&pageSize=5');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.items.length).toBeGreaterThan(0);
    expect(data.items.length).toBeLessThanOrEqual(5);
    expect(['seed', 'database']).toContain(data.source);
    expect(JSON.stringify(data)).not.toMatch(/userId|reviewedBy|pending/);
    expect((await request.get('/api/experience-catalog?pageSize=100')).status()).toBe(400);
  });

  test('search narrows the list and reports the count', async ({ page }) => {
    await page.goto('/experiences');
    const counter = page.getByText(/^\d+ of \d+$/);
    const before = Number((await counter.textContent())?.match(/^(\d+)/)?.[1]);

    const search = page.getByLabel('Search everything');
    await waitForHydrated(search);
    await search.fill('marathon');
    await expect(counter).not.toHaveText(`${before} of ${before}`);
    const after = Number((await counter.textContent())?.match(/^(\d+)/)?.[1]);
    expect(after).toBeGreaterThan(0);
    expect(after).toBeLessThan(before);
  });

  test('a filter that matches nothing says so rather than showing an empty page', async ({
    page,
  }) => {
    await page.goto('/experiences');
    const search = page.getByLabel('Search everything');
    await waitForHydrated(search);
    await search.fill('zzzzqqqq');
    await expect(page.getByText(/Nothing matches that/)).toBeVisible();
  });

  test('category and kind filters compose', async ({ page }) => {
    await page.goto('/experiences');
    await page.getByRole('button', { name: 'Places', exact: true }).click();
    await page.getByRole('button', { name: 'Travel', exact: true }).click();
    const counter = page.getByText(/^\d+ of \d+$/);
    const shown = Number((await counter.textContent())?.match(/^(\d+)/)?.[1]);
    // Every destination is travel, so this is the destination count.
    expect(shown).toBe(75);
  });

  test('opens a detail page with a first step and a working cross-reference', async ({ page }) => {
    await page.goto('/experiences/stonehenge-england');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Stonehenge');
    await expect(page.getByRole('heading', { name: 'How you would actually start' })).toBeVisible();
    await expect(page.locator('ol li')).not.toHaveCount(0);

    // The famous cross-reference points at a bucket list, not a journey.
    const href = await page.getByRole('link', { name: 'Barack Obama' }).getAttribute('href');
    expect(href).toBe('/bucket-lists/barack-obama');
    const res = await page.request.get(href as string);
    expect(res.status()).toBe(200);
  });

  test('an idea that used to be title-only now has a page of its own', async ({ page }) => {
    // These were unpaged until every idea got a written description.
    await page.goto('/experiences/see-the-northern-lights-in-iceland-or-norway');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Northern Lights');
    await expect(page.getByRole('heading', { name: 'How you would actually start' })).toBeVisible();
  });

  test('a nonsense slug still 404s', async ({ page }) => {
    const res = await page.request.get('/experiences/not-a-real-thing', {
      failOnStatusCode: false,
    });
    expect(res.status()).toBe(404);
  });

  test('onward links from a detail page actually go somewhere', async ({ page }) => {
    await page.goto('/experiences/stonehenge-england');
    const related = page
      .getByRole('heading', { name: 'If this appeals, so might these' })
      .locator('xpath=following-sibling::ul[1]')
      .getByRole('link');
    await expect(related.first()).toBeVisible();
    const href = await related.first().getAttribute('href');
    expect(href).toMatch(/^\/experiences\//);
  });
});

test.describe('Manual bucket-list entry', () => {
  test('searches, saves locally, then accepts personal wording', async ({ page }) => {
    await page.goto('/bucket-list');
    await expect(page.getByLabel('I want to…')).toBeEnabled();
    await waitForHydrated(page.getByLabel('I want to…'));
    await page.getByLabel('I want to…').fill('learn');
    await expect(page.getByText(/matching ideas/)).toBeVisible();
    await expect(page.locator('form + div ul > li')).toHaveCount(5);
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByText(/^Page 2 of/)).toBeVisible();
    await page.getByLabel('I want to…').fill('pottery');
    await page
      .getByRole('button', {
        name: 'Add Take a pottery class and make a finished piece to my list',
        exact: true,
      })
      .click();
    await expect(
      page.getByText('Take a pottery class and make a finished piece', { exact: true })
    ).toBeVisible();
    await page.getByLabel('I want to…').fill('Teach my niece to make a bowl');
    await page.getByRole('button', { name: 'Add my wording', exact: true }).click();
    await expect(page.getByText('Teach my niece to make a bowl', { exact: true })).toBeVisible();
    await page.reload();
    await expect(page.getByText('Teach my niece to make a bowl', { exact: true })).toBeVisible();
    await expect(
      page.getByText('Take a pottery class and make a finished piece', { exact: true })
    ).toBeVisible();
  });

  test('offers live matches while typing and accepts unmatched personal wording', async ({
    page,
  }) => {
    await page.goto('/bucket-list');
    await waitForHydrated(page.getByLabel('I want to…'));
    await page.getByLabel('I want to…').pressSequentially('pot');
    await expect(
      page.getByRole('button', {
        name: 'Add Take a pottery class and make a finished piece to my list',
        exact: true,
      })
    ).toBeVisible();
    await page.getByLabel('I want to…').fill('My very personal zzzzqqqq idea');
    await expect(page.getByText(/No matching ideas/)).toBeVisible();
    await expect(page.getByLabel('I want to…')).toHaveValue('My very personal zzzzqqqq idea');
    await page.getByRole('button', { name: 'Add my wording', exact: true }).click();
    await expect(page.getByText('My very personal zzzzqqqq idea', { exact: true })).toBeVisible();
  });
});
