import { expect, test } from '@playwright/test';

import { EXPERIENCE_COLLECTIONS } from '../src/lib/experience-collections';
import { EXPERIENCE_GUIDES } from '../src/lib/experience-guides';

test('all curated collections serve crawlable activity links and match their structured data', async ({
  request,
}) => {
  for (const collection of EXPERIENCE_COLLECTIONS) {
    const path = `/experiences/collections/${collection.slug}`;
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html).toContain(`rel="canonical" href="https://live.significanthobbies.com${path}"`);
    expect(html).toContain('BreadcrumbList');
    expect(html).toContain('CollectionPage');
    for (const item of collection.items) expect(html).toContain(`href="/experiences/${item.slug}"`);
  }
  const sitemap = await request.get('/sitemap.xml');
  const xml = await sitemap.text();
  for (const collection of EXPERIENCE_COLLECTIONS)
    expect(xml).toContain(`/experiences/collections/${collection.slug}</loc>`);
});

test('every enhanced guide serves its unique plan to a visitor without JavaScript', async ({
  request,
}) => {
  for (const [slug, guide] of Object.entries(EXPERIENCE_GUIDES)) {
    const response = await request.get(`/experiences/${slug}`);
    expect(response.status(), slug).toBe(200);
    const html = await response.text();
    expect(html).toContain(
      `rel="canonical" href="https://live.significanthobbies.com/experiences/${slug}"`
    );
    expect(html).toContain('Plan the experience');
    expect(html).toContain('What counts as done');
    expect(html).toContain(guide.steps[0].title);
    expect(html).not.toContain('"@type":"HowTo"');
  }
});

test('a visitor can choose a collection, save an activity and complete it after reloading', async ({
  page,
}) => {
  await page.goto('/experiences');
  await page
    .getByRole('link', { name: 'Browse collections for weekends, solo time and more' })
    .click();
  await page
    .getByRole('link', { name: 'Weekend bucket list ideas with a finish in sight →' })
    .click();
  await page.getByRole('link', { name: 'Make pasta from scratch', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Plan the experience' })).toBeVisible();
  await page.getByRole('button', { name: 'Save Make pasta from scratch to my list' }).click();
  await expect(
    page.getByRole('button', { name: 'Saved Make pasta from scratch to my list' })
  ).toBeVisible();
  await page.goto('/bucket-list');
  await page.reload();
  await page.getByRole('button', { name: 'Complete Make pasta from scratch' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Reopen Make pasta from scratch' })).toBeVisible();
});

test('the idea roundup reports its actual count and links directly to activity pages', async ({
  page,
}) => {
  await page.goto('/bucket-list-ideas');
  await expect(page).toHaveTitle('253 Bucket List Ideas by Category | Live');
  await expect(page.locator('main a[href^="/experiences/"]')).toHaveCount(253);
  await expect(page.locator('main a[href*="undefined"]')).toHaveCount(0);
});
