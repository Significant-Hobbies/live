import { EXPERIENCE_CATEGORIES, EXPERIENCE_ENTRIES, EXPERIENCES_BY_CATEGORY } from './experiences';
import type { CatalogPage, CatalogQuery } from './catalog-types';

export const CATALOG_CATEGORIES = EXPERIENCE_CATEGORIES.map((id) => ({
  id,
  label: EXPERIENCES_BY_CATEGORY[id].label,
}));

export function normalizeCatalogTitle(title: string) {
  return title
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function parseCatalogQuery(params: URLSearchParams): CatalogQuery {
  const query = (params.get('q') ?? '').trim();
  const category = params.get('category') ?? 'all';
  const kind = params.get('kind') ?? 'all';
  const page = Number(params.get('page') ?? 1);
  const pageSize = Number(params.get('pageSize') ?? 20);
  if (
    query.length > 200 ||
    !Number.isSafeInteger(page) ||
    page < 1 ||
    page > 1_000_000 ||
    !Number.isSafeInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > 20 ||
    (category !== 'all' &&
      !EXPERIENCE_CATEGORIES.includes(
        category as CatalogQuery['category'] & (typeof EXPERIENCE_CATEGORIES)[number]
      )) ||
    !['all', 'idea', 'milestone', 'destination'].includes(kind)
  ) {
    throw new Error('Invalid catalog filters');
  }
  return {
    query,
    category: category as CatalogQuery['category'],
    kind: kind as CatalogQuery['kind'],
    page,
    pageSize,
  };
}

export function searchCatalogSeed(query: CatalogQuery): CatalogPage {
  const term = normalizeCatalogTitle(query.query);
  const filtered = EXPERIENCE_ENTRIES.filter(
    (entry) =>
      (query.category === 'all' || entry.category === query.category) &&
      (query.kind === 'all' || entry.kind === query.kind) &&
      (!term || normalizeCatalogTitle(`${entry.title} ${entry.description ?? ''}`).includes(term))
  );
  const page = Math.min(query.page, Math.max(1, Math.ceil(filtered.length / query.pageSize)));
  return {
    items: filtered
      .slice((page - 1) * query.pageSize, page * query.pageSize)
      .map(({ slug, title, description, emoji, category, kind }) => ({
        slug,
        title,
        description,
        emoji,
        category,
        kind,
      })),
    total: EXPERIENCE_ENTRIES.length,
    matches: filtered.length,
    page,
    pageSize: query.pageSize,
    source: 'seed',
    categories: CATALOG_CATEGORIES,
  };
}

/** SQL artifact only: rerunning never replaces approved edits or personal data. */
export function catalogSeedSql() {
  const quote = (value: string) => `'${value.replaceAll("'", "''")}'`;
  return `${EXPERIENCE_ENTRIES.map(
    (entry, order) =>
      `INSERT INTO ExperienceCatalog (slug,title,normalizedTitle,description,searchText,emoji,category,kind,source,sortOrder) VALUES (${[
        quote(entry.slug),
        quote(entry.title),
        quote(normalizeCatalogTitle(entry.title)),
        entry.description ? quote(entry.description) : 'NULL',
        quote(normalizeCatalogTitle(`${entry.title} ${entry.description ?? ''}`)),
        quote(entry.emoji),
        quote(entry.category),
        quote(entry.kind),
        "'seed'",
        order,
      ].join(',')}) ON CONFLICT DO NOTHING;`
  ).join('\n')}\n`;
}
