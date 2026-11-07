import type { CatalogPage, CatalogQuery } from './catalog-types';
import { EXPERIENCE_CATEGORIES, EXPERIENCE_ENTRIES, type ExperienceEntry } from './experiences';
import { CURATED_EXPERIENCES } from './catalog-expansion/entries';

export function normalizeCatalogTitle(title: string) {
  return title
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export type PublicCatalogRow = Pick<
  ExperienceEntry,
  'slug' | 'title' | 'emoji' | 'category' | 'kind'
> & { description: string | null };
type PublicCatalogEntry = ExperienceEntry & { curated: boolean; editorialSlug?: string };
export type PublicCatalog = {
  items: PublicCatalogEntry[];
  bySlug: Map<string, PublicCatalogEntry>;
  source: CatalogPage['source'];
};

const bundledBySlug = new Map(EXPERIENCE_ENTRIES.map((entry) => [entry.slug, entry]));
const bundledByTitle = new Map(
  EXPERIENCE_ENTRIES.map((entry) => [normalizeCatalogTitle(entry.title), entry])
);
const expansionSlugs = new Set(CURATED_EXPERIENCES.map((entry) => entry.slug));

export function isBundledCatalogTitle(title: string) {
  return bundledByTitle.has(normalizeCatalogTitle(title));
}

export function mergePublicCatalog(
  rows: PublicCatalogRow[] = [],
  source: CatalogPage['source'] = 'seed'
): PublicCatalog {
  const bySlug = new Map<string, PublicCatalogEntry>();
  const byTitle = new Map<string, PublicCatalogEntry>();
  const items: PublicCatalogEntry[] = [];
  for (const row of rows) {
    const titleKey = normalizeCatalogTitle(row.title);
    const existing = byTitle.get(titleKey);
    if (existing) {
      bySlug.set(row.slug, existing);
      continue;
    }
    const authored = bundledBySlug.get(row.slug) ?? bundledByTitle.get(titleKey);
    const entry: PublicCatalogEntry = {
      ...authored,
      ...row,
      description: row.description ?? authored?.description,
      location: authored?.location ?? 'anywhere',
      curated: Boolean(authored),
      editorialSlug: authored?.slug,
    };
    bySlug.set(row.slug, entry);
    byTitle.set(titleKey, entry);
    items.push(entry);
  }
  for (const authored of EXPERIENCE_ENTRIES) {
    const existing =
      bySlug.get(authored.slug) ?? byTitle.get(normalizeCatalogTitle(authored.title));
    if (existing) {
      bySlug.set(authored.slug, existing);
      continue;
    }
    const entry = { ...authored, curated: true, editorialSlug: authored.slug };
    bySlug.set(entry.slug, entry);
    byTitle.set(normalizeCatalogTitle(entry.title), entry);
    items.push(entry);
  }
  return { items: orderForDiscovery(items), bySlug, source };
}

function orderForDiscovery(items: PublicCatalogEntry[]) {
  const fresh = new Set(items.filter((entry) => expansionSlugs.has(entry.editorialSlug ?? '')));
  const groups = EXPERIENCE_CATEGORIES.map((category) =>
    items.filter((entry) => fresh.has(entry) && entry.category === category)
  );
  const diverse: PublicCatalogEntry[] = [];
  for (let index = 0; groups.some((group) => index < group.length); index++) {
    for (const group of groups) if (group[index]) diverse.push(group[index]);
  }
  const surfaced = new Set(diverse);
  return [...diverse, ...items.filter((entry) => !surfaced.has(entry))];
}

export const BUNDLED_PUBLIC_CATALOG = mergePublicCatalog();

export function relatedPublicExperiences(
  catalog: PublicCatalog,
  entry: ExperienceEntry,
  limit = 6
) {
  const words = new Set(
    normalizeCatalogTitle(`${entry.title} ${entry.tags?.join(' ') ?? ''}`)
      .split(' ')
      .filter((word) => word.length > 3)
  );
  return catalog.items
    .filter((item) => item.slug !== entry.slug && item.category === entry.category)
    .map((item) => ({
      item,
      score: [
        ...new Set(normalizeCatalogTitle(`${item.title} ${item.tags?.join(' ') ?? ''}`).split(' ')),
      ].filter((word) => words.has(word)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}

export function filterPublicCatalog(
  catalog: PublicCatalog,
  query: Pick<CatalogQuery, 'query' | 'category' | 'kind'>
) {
  const term = normalizeCatalogTitle(query.query);
  return catalog.items.filter(
    (entry) =>
      (query.category === 'all' || entry.category === query.category) &&
      (query.kind === 'all' || entry.kind === query.kind) &&
      (!term ||
        normalizeCatalogTitle(
          `${entry.title} ${entry.description ?? ''} ${entry.tags?.join(' ') ?? ''}`
        ).includes(term))
  );
}

export function catalogPage(
  catalog: PublicCatalog,
  query: CatalogQuery,
  categories: CatalogPage['categories']
): CatalogPage {
  const filtered = filterPublicCatalog(catalog, query);
  const page = Math.min(query.page, Math.max(1, Math.ceil(filtered.length / query.pageSize)));
  return {
    items: filtered
      .slice((page - 1) * query.pageSize, page * query.pageSize)
      .map(({ curated: _curated, editorialSlug: _editorialSlug, ...entry }) => entry),
    total: catalog.items.length,
    matches: filtered.length,
    page,
    pageSize: query.pageSize,
    source: catalog.source,
    categories,
  };
}
