import { describe, expect, it } from 'vitest';
import { articleIndexPath, articlePage, ARTICLE_PAGE_SIZE } from './article-discovery';
import type { EditorialArticle } from './editorial-content';

const articles: EditorialArticle[] = Array.from({ length: 43 }, (_, index) => ({
  slug: `article-${index}`,
  title: `Guide ${index}`,
  excerpt: index === 22 ? 'Paper mechanisms' : 'A specific useful guide',
  category: index % 2 ? 'Creative' : 'Adventure',
  emoji: '🗺️',
  readTime: 3,
  publishedAt: '2026-11-08',
  content: [],
}));

describe('crawlable article discovery', () => {
  it('makes every article reachable without duplicate or skipped pages', () => {
    const pages = Array.from({ length: 3 }, (_, index) =>
      articlePage(articles, { page: String(index + 1) })
    );
    expect(pages[0].items).toHaveLength(ARTICLE_PAGE_SIZE);
    expect(pages.flatMap((page) => page.items.map((article) => article.slug))).toEqual(
      articles.map((article) => article.slug)
    );
    expect(articleIndexPath({ page: 2 })).toBe('/blog?page=2');
  });

  it('preserves filters through pagination and normalizes invalid or out-of-range pages', () => {
    const page = articlePage(articles, { category: 'Adventure', page: '999' });
    expect(page.page).toBe(2);
    expect(page.items.every((article) => article.category === 'Adventure')).toBe(true);
    expect(articleIndexPath({ page: 2, category: 'Food & drink', query: 'bread dough' })).toBe(
      '/blog?category=Food+%26+drink&q=bread+dough&page=2'
    );
    for (const value of ['-1', '1.5', 'NaN', 'Infinity'])
      expect(articlePage(articles, { page: value }).page).toBe(1);
    expect(
      articlePage(articles, { category: 'private', q: 'PAPER MECHANISMS' }).items.map(
        (article) => article.slug
      )
    ).toEqual(['article-22']);
  });

  it('returns an honest empty result without losing the original article total', () => {
    const page = articlePage(articles, { q: 'no such phrase' });
    expect(page).toMatchObject({ total: 43, matches: 0, page: 1, pages: 1, items: [] });
  });

  it('normalizes repeated query parameters supplied by Next without crashing', () => {
    const page = articlePage(articles, {
      q: ['PAPER MECHANISMS', 'ignored'],
      category: ['Adventure', 'Creative'],
      page: ['2', '3'],
    });
    expect(page).toMatchObject({
      query: 'PAPER MECHANISMS',
      category: 'Adventure',
      matches: 1,
      page: 1,
    });
    expect(page.items[0].slug).toBe('article-22');
  });
});
