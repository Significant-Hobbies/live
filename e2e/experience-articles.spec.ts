import { expect, test } from '@playwright/test';
import { EXPERIENCE_ARTICLES } from '../src/lib/experience-articles';
import { experienceArticleTarget } from '../src/lib/experience-articles';
import { waitForHydrated } from './fixtures/hydration';

const article = EXPERIENCE_ARTICLES.find((item) => !item.experienceSlug.startsWith('community-'))!;
const target = experienceArticleTarget(article.experienceSlug)!;

test('a sourced experience article has matching metadata, readable content and reciprocal links', async ({
  page,
  request,
}, testInfo) => {
  await page.goto(`/blog/${article.slug}`);
  await expect(page.getByRole('heading', { name: article.title, exact: true })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `https://significanthobbies.com/blog/${article.slug}`
  );
  await expect(page.locator('article')).toContainText(article.sections[0].paragraphs[0]);
  for (const source of article.sources)
    await expect(page.getByRole('link', { name: source.title, exact: true })).toHaveAttribute(
      'href',
      source.url
    );
  const schema = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((elements) =>
      elements
        .map((element) => JSON.parse(element.textContent ?? '{}'))
        .find((item) => item['@type'] === 'Article')
    );
  expect(schema).toMatchObject({
    headline: article.title,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    about: { url: `https://significanthobbies.com/experiences/${target.experienceSlug}` },
  });
  const markdown = await request.get(
    `/api/ai/markdown?path=${encodeURIComponent(`/blog/${article.slug}`)}`
  );
  expect(markdown.ok()).toBe(true);
  expect(await markdown.text()).toContain(article.sections[0].paragraphs[0]);
  await page
    .getByRole('heading', { name: article.sections[0].heading, exact: true })
    .evaluate((element) => element.scrollIntoView({ block: 'start' }));
  await page.screenshot({ path: testInfo.outputPath('article-body.png'), caret: 'initial' });
  await page
    .getByRole('heading', { name: 'Sources and further reading', exact: true })
    .evaluate((element) => element.scrollIntoView({ block: 'start' }));
  await page.screenshot({ path: testInfo.outputPath('article-sources.png'), caret: 'initial' });
  await page.getByRole('link', { name: 'View the experience plan', exact: true }).click();
  await expect(page.getByRole('heading', { name: target.title, exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: article.title, exact: true })).toHaveAttribute(
    'href',
    `/blog/${article.slug}`
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('the article saves the actual experience and survives a guest reload', async ({ page }) => {
  await page.goto(`/blog/${article.slug}`);
  const save = page.getByRole('button', { name: `Save ${target.title} to my list`, exact: true });
  await waitForHydrated(save);
  await save.click();
  await expect(
    page.getByRole('button', { name: `Saved ${target.title} to my list`, exact: true })
  ).toBeDisabled();
  await page.goto('/bucket-list');
  await expect(
    page.getByRole('button', { name: `Open ${target.title}`, exact: true })
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('button', { name: `Open ${target.title}`, exact: true })
  ).toBeVisible();
});

test('article filters and pagination are crawlable and preserve canonical identity', async ({
  page,
  request,
}, testInfo) => {
  const response = await request.get('/blog?page=2');
  expect(response.ok()).toBe(true);
  expect(await response.text()).toContain('https://significanthobbies.com/blog?page=2');
  await page.goto('/blog');
  await expect(
    page
      .getByRole('navigation', { name: 'Article pagination' })
      .getByRole('link', { name: 'Next', exact: true })
  ).toHaveAttribute('href', '/blog?page=2');
  await page
    .getByRole('searchbox', { name: 'Search articles', exact: true })
    .fill(article.title.slice(0, 70));
  await page.getByRole('combobox', { name: 'Category', exact: true }).selectOption('');
  await page.getByRole('button', { name: 'Find articles', exact: true }).click();
  await expect(page.getByRole('heading', { name: article.title, exact: true })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(
    page.getByRole('heading', { name: 'The Hobby Journal', exact: true }).locator('..')
  ).toHaveCSS('opacity', '1');
  await page.screenshot({ path: testInfo.outputPath('article-search.png'), caret: 'initial' });
  await page.getByRole('heading', { name: article.title, exact: true }).scrollIntoViewIfNeeded();
  await expect(
    page
      .getByRole('heading', { name: article.title, exact: true })
      .locator('xpath=ancestor::*[@data-animated-reveal][1]')
  ).toHaveCSS('opacity', '1');
  await page.screenshot({
    path: testInfo.outputPath('article-search-results.png'),
    caret: 'initial',
  });
});
