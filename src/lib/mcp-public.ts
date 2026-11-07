import { firstSteps } from './experiences';
import { HOBBY_CATEGORIES, HOBBY_FACETS } from '@/lib/hobbies';
import {
  BUNDLED_PUBLIC_CATALOG,
  filterPublicCatalog,
  relatedPublicExperiences,
  type PublicCatalog,
} from './catalog-model';
import { EXPERIENCE_GUIDES } from './experience-guides';

const MCP_PAGE_MAX = 50;
const EPOCH_MILLISECONDS_THRESHOLD = 10_000_000_000;

export function boundedPage(searchParams: URLSearchParams) {
  const parsedLimit = Number(searchParams.get('limit') ?? 10);
  const parsedOffset = Number(searchParams.get('offset') ?? 0);
  return {
    limit: Number.isInteger(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), MCP_PAGE_MAX) : 10,
    offset: Number.isInteger(parsedOffset) ? Math.min(Math.max(parsedOffset, 0), 10_000) : 0,
  };
}

function page<T>(items: T[], limit: number, offset: number) {
  const selected = items.slice(offset, offset + limit);
  return {
    generatedAt: new Date().toISOString(),
    items: selected,
    total: items.length,
    nextOffset: offset + selected.length < items.length ? offset + selected.length : null,
  };
}

export function searchPublicHobbies(searchParams: URLSearchParams) {
  const q = searchParams.get('q')?.trim().toLocaleLowerCase() ?? '';
  const category = searchParams.get('category')?.trim().toLocaleLowerCase() ?? '';
  const facet = searchParams.get('facet')?.trim().toLocaleLowerCase() ?? '';
  const { limit, offset } = boundedPage(searchParams);
  const hobbies = HOBBY_CATEGORIES.flatMap((group) =>
    group.hobbies.map((name) => ({
      id: name
        .toLocaleLowerCase()
        .replaceAll(/[^a-z0-9]+/g, '-')
        .replaceAll(/^-|-$/g, ''),
      name,
      category: group.name,
      emoji: group.emoji,
      facets: HOBBY_FACETS[name] ?? [],
      canonicalUrl: `https://significanthobbies.com/hobbies/${encodeURIComponent(name.toLocaleLowerCase().replaceAll(' ', '-'))}`,
    }))
  ).filter(
    (item) =>
      (!q ||
        `${item.name} ${item.category} ${item.facets.join(' ')}`.toLocaleLowerCase().includes(q)) &&
      (!category || item.category.toLocaleLowerCase() === category) &&
      (!facet || item.facets.includes(facet as (typeof item.facets)[number]))
  );
  return page(hobbies, limit, offset);
}

export function searchPublicExperiences(
  searchParams: URLSearchParams,
  catalog: PublicCatalog = BUNDLED_PUBLIC_CATALOG
) {
  const { limit, offset } = boundedPage(searchParams);
  const experiences = filterPublicCatalog(catalog, {
    query: searchParams.get('q')?.trim() ?? '',
    category: (searchParams.get('category')?.trim().toLowerCase() ||
      'all') as import('./catalog-types').CatalogQuery['category'],
    kind: (searchParams.get('kind')?.trim().toLowerCase() ||
      'all') as import('./catalog-types').CatalogQuery['kind'],
  }).map(({ curated: _curated, editorialSlug: _editorialSlug, ...item }) => ({
    ...item,
    canonicalUrl: `https://significanthobbies.com/experiences/${item.slug}`,
  }));
  return page(experiences, limit, offset);
}

export function getPublicExperience(slug: string, catalog: PublicCatalog = BUNDLED_PUBLIC_CATALOG) {
  const experience = catalog.bySlug.get(slug);
  if (!experience) return null;
  const { curated, editorialSlug, ...entry } = experience;
  const guide = editorialSlug ? EXPERIENCE_GUIDES[editorialSlug] : undefined;
  return {
    ...entry,
    firstSteps: guide?.steps ?? (curated ? firstSteps(entry) : []),
    ...(guide ? { guide } : {}),
    related: relatedPublicExperiences(catalog, entry).map((item) => ({
      slug: item.slug,
      title: item.title,
      category: item.category,
      canonicalUrl: `https://significanthobbies.com/experiences/${item.slug}`,
    })),
    canonicalUrl: `https://significanthobbies.com/experiences/${entry.slug}`,
  };
}

export function publicTimelineRecord(row: {
  id: string;
  title: string | null;
  visibility: string;
  slug: string | null;
  phases: string;
  createdAt: Date | number | string | null;
  updatedAt: Date | number | string | null;
  userName: string | null;
  userUsername: string | null;
}) {
  if (row.visibility !== 'PUBLIC') return null;
  let phases: unknown[] = [];
  try {
    const parsed = JSON.parse(row.phases) as unknown;
    if (Array.isArray(parsed)) phases = parsed;
  } catch {
    phases = [];
  }
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    phases,
    createdAt: publicTimestamp(row.createdAt),
    updatedAt: publicTimestamp(row.updatedAt),
    user: row.userName ? { name: row.userName, username: row.userUsername } : null,
    canonicalUrl:
      row.userUsername && row.slug
        ? `https://significanthobbies.com/u/${encodeURIComponent(row.userUsername)}/${encodeURIComponent(row.slug)}`
        : `https://significanthobbies.com/timeline/${encodeURIComponent(row.id)}`,
  };
}

function publicTimestamp(value: Date | number | string | null): string | null {
  let parsed: Date;
  if (value instanceof Date) {
    parsed = value;
  } else if (typeof value === 'number') {
    parsed = numericTimestamp(value);
  } else if (typeof value === 'string' && value.trim()) {
    const numeric = Number(value);
    parsed = Number.isFinite(numeric) ? numericTimestamp(numeric) : new Date(value);
  } else {
    return null;
  }
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : null;
}

function numericTimestamp(value: number): Date {
  const milliseconds = Math.abs(value) < EPOCH_MILLISECONDS_THRESHOLD ? value * 1000 : value;
  return new Date(milliseconds);
}
