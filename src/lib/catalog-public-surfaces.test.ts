import SearchPage from '~/app/search/page';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('~/app/search/search-client', () => ({ SearchPageClient: () => null }));

vi.mock('./catalog-expansion/entries', () => ({
  CURATED_EXPERIENCES: [
    {
      slug: 'make-a-fixture-loom',
      title: 'Make a fixture loom',
      description: 'Weave a first small cloth with cardboard and leftover thread.',
      emoji: '🧵',
      category: 'creative',
      kind: 'idea',
      location: 'anywhere',
      tags: ['cardboard loom'],
      budget: 'low',
      effort: 'session',
      company: ['solo'],
    },
  ],
}));
vi.mock('./catalog-expansion/plans', () => ({
  CURATED_EXPERIENCE_GUIDES: {
    'make-a-fixture-loom': {
      title: 'A small first loom',
      summary: 'A practical first weaving session with a small finished cloth.',
      time: 'One afternoon with a break.',
      cost: 'Use leftover thread and cardboard.',
      place: 'A table with room for your loom.',
      preparation: 'Cut a small cardboard rectangle and choose two contrasting threads.',
      steps: [
        { title: 'Prepare the loom', body: 'Space the slots evenly along two opposite edges.' },
        { title: 'Weave a sample', body: 'Pass the thread over and under alternate warp threads.' },
        {
          title: 'Finish the cloth',
          body: 'Secure the ends before removing the cloth from the loom.',
        },
      ],
      completion: 'A small cloth with its ends secured is ready to keep.',
      tip: 'Leave slack so the edges do not draw inward.',
      updatedAt: '2026-11-07',
      resources: [
        {
          title: 'Weaving reference',
          url: 'https://example.org/weaving-reference',
          publisher: 'Example teaching archive',
          purpose: 'See the over-and-under technique before threading the loom.',
        },
      ],
    },
  },
}));
vi.mock('~/server/db', () => {
  const chain = Object.assign(Promise.resolve([]), {
    from: () => chain,
    leftJoin: () => chain,
    where: () => chain,
    orderBy: () => chain,
    limit: async () => [],
  });
  return { db: { select: () => chain } };
});
const { all, prepare } = vi.hoisted(() => ({ all: vi.fn(), prepare: vi.fn() }));
vi.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: () => ({ env: { DB: { prepare } } }),
}));

import {
  generateMetadata,
  renderExperienceContent,
} from '~/components/public-pages/experience-detail';
import { GET as searchRoute } from '~/app/api/mcp/experiences/route';
import { GET as detailRoute } from '~/app/api/mcp/experiences/[slug]/route';
import { searchExperienceCatalog, publicExperienceCatalog } from '~/server/experience-catalog';
import { parseCatalogQuery } from './catalog-seed';
import { EXPERIENCE_GUIDES } from './experience-guides';
import { renderPublicExperienceSource } from './public-editorial-source';
import { publicStaticSitemap } from './public-sitemap';
import { mergePublicCatalog } from './catalog-model';

beforeEach(() => {
  vi.clearAllMocks();
  prepare.mockReturnValue({ all });
  all.mockResolvedValue({
    results: [
      {
        slug: 'canonical-loom',
        title: 'Make a fixture loom',
        description: 'The operator kept this public description.',
        emoji: '🧶',
        category: 'creative',
        kind: 'idea',
      },
      {
        slug: 'community-basic',
        title: 'A community cloth exchange',
        description: null,
        emoji: '✨',
        category: 'relationships',
        kind: 'idea',
      },
    ],
  });
});

describe('shared public experience surfaces', () => {
  it('returns structured, uncacheable MCP errors during a D1 outage', async () => {
    all.mockRejectedValue(new Error('D1 temporarily unavailable'));
    for (const response of [
      await searchRoute(new Request('https://significanthobbies.com/api/mcp/experiences')),
      await detailRoute(new Request('https://significanthobbies.com/api/mcp/experiences/test'), {
        params: Promise.resolve({ slug: 'test' }),
      }),
    ]) {
      expect(response.status).toBe(503);
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect(await response.json()).toEqual({
        code: 'UNAVAILABLE',
        message: 'Experiences could not be loaded. Try again.',
      });
    }
  });

  it('preserves authored metadata unless D1 has changed the corresponding field', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'make-pasta-from-scratch' }),
    });
    expect(metadata.title).toEqual({
      absolute: EXPERIENCE_GUIDES['make-pasta-from-scratch'].title,
    });
    expect(metadata.description).toBe(EXPERIENCE_GUIDES['make-pasta-from-scratch'].summary);
    const overridden = await generateMetadata({
      params: Promise.resolve({ slug: 'make-a-fixture-loom' }),
    });
    expect(overridden.title).toEqual({ absolute: 'A small first loom' });
    expect(overridden.description).toBe('The operator kept this public description.');
    all.mockResolvedValue({
      results: [
        {
          slug: 'make-a-fixture-loom',
          title: 'An operator title',
          description: null,
          emoji: '🧵',
          category: 'creative',
          kind: 'idea',
        },
      ],
    });
    expect(
      (await generateMetadata({ params: Promise.resolve({ slug: 'make-a-fixture-loom' }) })).title
    ).toEqual({ absolute: 'An operator title | Bucket list idea' });
  });

  it('lists canonical D1 URLs in the sitemap when a bundle joins an older community title', async () => {
    const urls = publicStaticSitemap(await publicExperienceCatalog()).map((entry) => entry.url);
    expect(urls).toContain('https://significanthobbies.com/experiences/canonical-loom');
    expect(urls).not.toContain('https://significanthobbies.com/experiences/make-a-fixture-loom');
    expect(urls).not.toContain('https://significanthobbies.com/experiences/community-basic');
  });

  it('keeps sitemap URLs unique and excludes community targets after conflicting D1 edits', () => {
    const row = {
      slug: 'make-pasta-from-scratch',
      title: 'Make a fixture loom',
      description: null,
      emoji: '✨',
      category: 'creative' as const,
      kind: 'idea' as const,
    };
    const urls = publicStaticSitemap(mergePublicCatalog([row])).map((entry) => entry.url);
    expect(
      urls.filter(
        (url) => url === 'https://significanthobbies.com/experiences/make-pasta-from-scratch'
      )
    ).toHaveLength(1);
    const community = { ...row, slug: 'community-exchange', title: 'Community exchange' };
    const redirected = publicStaticSitemap(
      mergePublicCatalog([community, { ...community, slug: 'make-a-fixture-loom' }])
    ).map((entry) => entry.url);
    expect(redirected).not.toContain(
      'https://significanthobbies.com/experiences/community-exchange'
    );
    expect(redirected).not.toContain(
      'https://significanthobbies.com/experiences/make-a-fixture-loom'
    );
  });

  it('keeps web, HTML, Markdown and MCP on the same identity and authored content', async () => {
    const catalog = await publicExperienceCatalog();
    const guide = EXPERIENCE_GUIDES['make-a-fixture-loom'];
    const web = await searchExperienceCatalog(
      parseCatalogQuery(new URLSearchParams('q=cardboard+loom'))
    );
    const response = await searchRoute(
      new Request('https://significanthobbies.com/api/mcp/experiences?q=cardboard+loom')
    );
    const search = await response.json();
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=60, s-maxage=60');
    expect(search.total).toBe(web.matches);
    expect(search.items.map((item: { slug: string }) => item.slug)).toEqual(
      web.items.map((item) => item.slug)
    );
    expect(web.items[0].slug).toBe('canonical-loom');
    const detail = await (
      await detailRoute(
        new Request('https://significanthobbies.com/api/mcp/experiences/make-a-fixture-loom'),
        { params: Promise.resolve({ slug: 'make-a-fixture-loom' }) }
      )
    ).json();
    expect(detail.item).toMatchObject({
      slug: 'canonical-loom',
      description: 'The operator kept this public description.',
      guide,
      firstSteps: guide.steps,
    });
    const html = renderToStaticMarkup(
      await renderExperienceContent(
        Promise.resolve({ slug: 'make-a-fixture-loom' }),
        false,
        catalog
      )
    );
    const markdown = await renderPublicExperienceSource('make-a-fixture-loom');
    for (const value of [
      guide.summary,
      guide.preparation,
      guide.completion,
      guide.steps[0].body,
      guide.resources![0].url,
      'The operator kept this public description.',
    ]) {
      expect(html).toContain(value);
      expect(markdown).toContain(value);
    }
    expect(
      (await generateMetadata({ params: Promise.resolve({ slug: 'make-a-fixture-loom' }) }))
        .alternates?.canonical
    ).toBe('/experiences/canonical-loom');
    expect(
      prepare.mock.calls.every(
        ([sql]) =>
          sql ===
          'SELECT slug,title,description,emoji,category,kind FROM ExperienceCatalog ORDER BY sortOrder,slug'
      )
    ).toBe(true);
  });

  it('finds the same canonical experience through the site search', async () => {
    const html = renderToStaticMarkup(
      await SearchPage({ searchParams: Promise.resolve({ q: 'cardboard loom' }) })
    );
    expect(html).toContain('href="/experiences/canonical-loom"');
    expect(html).toContain('The operator kept this public description.');
    expect(html).not.toContain('href="/experiences/make-a-fixture-loom"');
  });

  it('renders community pages honestly, excludes them from indexing and exposes no invented guide', async () => {
    const html = renderToStaticMarkup(
      await renderExperienceContent(Promise.resolve({ slug: 'community-basic' }))
    );
    expect(html).toContain('A community cloth exchange');
    expect(html).toContain('A detailed editorial plan has not been added yet.');
    expect(html).not.toContain('How you would actually start');
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'community-basic' }),
    });
    expect(metadata.robots).toMatchObject({ index: false });
    const detail = await (
      await detailRoute(
        new Request('https://significanthobbies.com/api/mcp/experiences/community-basic'),
        { params: Promise.resolve({ slug: 'community-basic' }) }
      )
    ).json();
    expect(detail.item.firstSteps).toEqual([]);
    expect(detail.item.guide).toBeUndefined();
    const missing = await detailRoute(
      new Request('https://significanthobbies.com/api/mcp/experiences/missing-entry'),
      { params: Promise.resolve({ slug: 'missing-entry' }) }
    );
    expect(missing.status).toBe(404);
    expect(missing.headers.get('Cache-Control')).toBe('no-store');
    expect(await renderPublicExperienceSource('missing-entry')).toBeNull();
  });
});
