import type { EditorialArticle } from './editorial-content';

export type ArticleFilters = {
  page?: string | string[];
  category?: string | string[];
  q?: string | string[];
};
export type ArticlePage = ReturnType<typeof articlePage>;
export const ARTICLE_PAGE_SIZE = 18;

export function articlePage(articles: EditorialArticle[], filters: ArticleFilters) {
  const scalar = (value?: string | string[]) =>
    Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
  const query = scalar(filters.q).trim().slice(0, 100);
  const categories = [...new Set(articles.map((article) => article.category))].sort();
  const selectedCategory = scalar(filters.category);
  const category = categories.includes(selectedCategory) ? selectedCategory : '';
  const term = query.toLocaleLowerCase();
  const matches = articles.filter(
    (article) =>
      (!category || article.category === category) &&
      (!term || `${article.title} ${article.excerpt}`.toLocaleLowerCase().includes(term))
  );
  const pages = Math.max(1, Math.ceil(matches.length / ARTICLE_PAGE_SIZE));
  const requested = Number(scalar(filters.page) || 1);
  const page = Math.min(pages, Number.isSafeInteger(requested) && requested > 0 ? requested : 1);
  return {
    query,
    category,
    categories,
    total: articles.length,
    matches: matches.length,
    page,
    pages,
    items: matches.slice((page - 1) * ARTICLE_PAGE_SIZE, page * ARTICLE_PAGE_SIZE),
  };
}

export function articleIndexPath(filters: { page?: number; category?: string; query?: string }) {
  const search = new URLSearchParams();
  if (filters.category) search.set('category', filters.category);
  if (filters.query) search.set('q', filters.query);
  if (filters.page && filters.page > 1) search.set('page', String(filters.page));
  return `/blog${search.size ? `?${search}` : ''}`;
}
