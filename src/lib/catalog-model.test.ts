import { describe, expect, it, vi } from 'vitest';

vi.mock('./catalog-expansion/entries', () => ({
  CURATED_EXPERIENCES: [
    {
      slug: 'weave-a-test-sampler',
      title: 'Weave a test sampler',
      description: 'Make a small cloth using a cardboard loom and spare thread.',
      emoji: '🧵',
      category: 'creative',
      kind: 'idea',
      location: 'anywhere',
      tags: ['textile', 'cardboard loom'],
      budget: 'low',
      effort: 'session',
      company: ['solo'],
    },
    {
      slug: 'record-test-birdsong',
      title: 'Record test birdsong',
      description: 'Compare recordings from one familiar path at two different times.',
      emoji: '🐦',
      category: 'reflection',
      kind: 'idea',
      location: 'anywhere',
      tags: ['field recording'],
      budget: 'free',
      effort: 'short',
      company: ['solo', 'pair'],
    },
    {
      slug: 'weave-another-test-sampler',
      title: 'Weave another test sampler',
      description: 'Compare two weaving patterns in a small handmade test cloth.',
      emoji: '🧵',
      category: 'creative',
      kind: 'idea',
      location: 'anywhere',
      tags: ['textile'],
      budget: 'low',
      effort: 'session',
      company: ['group'],
    },
  ],
}));

import {
  BUNDLED_PUBLIC_CATALOG,
  catalogPage,
  filterPublicCatalog,
  mergePublicCatalog,
  relatedPublicExperiences,
  type PublicCatalogRow,
} from './catalog-model';
import { CATALOG_CATEGORIES, parseCatalogQuery } from './catalog-seed';
import { EXPERIENCE_ENTRIES } from './experiences';
import { getPublicExperience, searchPublicExperiences } from './mcp-public';

const query = (params = '') => parseCatalogQuery(new URLSearchParams(params));
const community: PublicCatalogRow = {
  slug: 'community-loom',
  title: 'Make a community loom',
  description: null,
  emoji: '✨',
  category: 'creative',
  kind: 'idea',
};

describe('one public catalog model', () => {
  it('ranks related suggestions by shared subject and keeps canonical identities', () => {
    const catalog = mergePublicCatalog([
      { ...community, slug: 'canonical-related', title: 'Weave another test sampler' },
    ]);
    const entry = catalog.bySlug.get('weave-a-test-sampler')!;
    const related = relatedPublicExperiences(catalog, entry);
    expect(related[0].slug).toBe('canonical-related');
    expect(related.some((item) => item.slug === entry.slug)).toBe(false);
    expect(getPublicExperience(entry.slug, catalog)?.related.map((item) => item.slug)).toEqual(
      related.map((item) => item.slug)
    );
  });

  it('unions an old full seed, community and new bundles without dropping records', () => {
    const oldSeed = EXPERIENCE_ENTRIES.filter((entry) => !entry.tags).map((entry) => ({
      ...entry,
      description: entry.description ?? null,
    }));
    const catalog = mergePublicCatalog([...oldSeed, community], 'database');
    expect(catalog.items).toHaveLength(EXPERIENCE_ENTRIES.length + 1);
    expect(catalog.bySlug.get(community.slug)?.title).toBe(community.title);
    expect(catalog.bySlug.has('weave-a-test-sampler')).toBe(true);
    expect(catalog.items.slice(0, 3).map((entry) => entry.category)).toEqual([
      'creative',
      'reflection',
      'creative',
    ]);
  });

  it('keeps edited D1 fields and canonical identity while resolving bundled aliases', () => {
    const catalog = mergePublicCatalog(
      [
        {
          ...community,
          slug: 'published-sampler',
          title: 'Weave a test sampler',
          description: 'An operator edited this description.',
          category: 'relationships',
          kind: 'milestone',
        },
        {
          ...community,
          slug: 'make-pasta-from-scratch',
          title: 'Pasta with my own title',
          description: 'Use the operator description.',
        },
      ],
      'database'
    );
    const canonical = catalog.bySlug.get('published-sampler');
    expect(catalog.bySlug.get('weave-a-test-sampler')).toBe(canonical);
    expect(canonical).toMatchObject({
      slug: 'published-sampler',
      category: 'relationships',
      kind: 'milestone',
      description: 'An operator edited this description.',
    });
    expect(catalog.items.filter((entry) => entry.title === 'Weave a test sampler')).toHaveLength(1);
    expect(catalog.bySlug.get('make-pasta-from-scratch')).toMatchObject({
      title: 'Pasta with my own title',
      description: 'Use the operator description.',
    });
    expect(catalog.items).toHaveLength(EXPERIENCE_ENTRIES.length);
  });

  it('enriches only explicit matching authored metadata and leaves community basic', () => {
    const catalog = mergePublicCatalog([
      { ...community, slug: 'published-sampler', title: 'WEAVE A TEST SAMPLER!' },
      community,
    ]);
    expect(catalog.bySlug.get('published-sampler')?.description).toContain('cardboard loom');
    expect(catalog.bySlug.get('community-loom')).toMatchObject({
      curated: false,
      description: undefined,
    });
    expect(getPublicExperience('community-loom', catalog)?.firstSteps).toEqual([]);
  });

  it('shares identities, filters, counts and bounded pagination with MCP', () => {
    const catalog = mergePublicCatalog([community], 'database');
    const web = catalogPage(catalog, query('q=cardboard+loom'), CATALOG_CATEGORIES);
    const mcp = searchPublicExperiences(new URLSearchParams('q=cardboard+loom&limit=1'), catalog);
    expect(web.matches).toBe(mcp.total);
    expect(web.items.map((entry) => entry.slug)).toEqual(mcp.items.map((entry) => entry.slug));
    expect(getPublicExperience(web.items[0].slug, catalog)?.title).toBe(web.items[0].title);
    const all = filterPublicCatalog(catalog, query());
    const mcpPage = searchPublicExperiences(new URLSearchParams('limit=500&offset=50'), catalog);
    expect(mcpPage.items).toHaveLength(50);
    expect(mcpPage.items.map((entry) => entry.slug)).toEqual(
      all.slice(50, 100).map((entry) => entry.slug)
    );
    expect(catalogPage(catalog, query('page=1000'), CATALOG_CATEGORIES).page).toBe(
      Math.ceil(all.length / 20)
    );
    expect(
      filterPublicCatalog(catalog, query('q=textile&category=creative&kind=idea'))
    ).toHaveLength(2);
    expect(BUNDLED_PUBLIC_CATALOG.items.length).toBe(EXPERIENCE_ENTRIES.length);
  });
});
