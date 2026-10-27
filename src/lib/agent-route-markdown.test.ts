import { handlePublicReadability } from './public-readability';
import { describe, expect, it, vi } from 'vitest';

import sitemap from '~/app/sitemap';
import { editorialArticles } from '~/lib/editorial-content';
import { PAGED_EXPERIENCES } from '~/lib/experiences';
import { FAMOUS_JOURNEYS } from '~/lib/famous-journeys';
import apiCatalog from '../../public/api-ai.json';
import {
  handleCachedPublicRouteMarkdown,
  handlePublicRouteMarkdown,
  htmlPathFromMarkdown,
  isAgentReadableSitemapPath,
  isPublicAgentDocumentPath,
  markdownPathFor,
} from '../../agent-route-markdown.mjs';
import { renderPublicRouteMarkdown } from '~/lib/public-route-markdown';

describe('public route Markdown boundary', () => {
  it('maps explicit Markdown alternates to their public documents', () => {
    expect(markdownPathFor('/hobbies/painting')).toBe('/hobbies/painting.md');
    expect(htmlPathFromMarkdown('/hobbies/painting.md')).toBe('/hobbies/painting');
    expect(htmlPathFromMarkdown('/hobbies/painting/index.md')).toBe('/hobbies/painting');
    expect(markdownPathFor('/')).toBe('/index.md');
  });

  it('covers public route families but excludes private application routes', () => {
    expect(isPublicAgentDocumentPath('/experiences/see-the-northern-lights')).toBe(true);
    expect(isPublicAgentDocumentPath('/hobbies/category/creative')).toBe(true);
    expect(isPublicAgentDocumentPath('/u/public-person')).toBe(true);
    expect(isPublicAgentDocumentPath('/u/public-person/unlisted-timeline')).toBe(false);
    expect(isPublicAgentDocumentPath('/daily')).toBe(false);
    expect(isPublicAgentDocumentPath('/settings')).toBe(false);
    expect(isPublicAgentDocumentPath('/timeline/private-id')).toBe(false);
  });

  it('negotiates Markdown from the canonical route source', async () => {
    const load = vi.fn(async (path: string) => renderPublicRouteMarkdown(path));
    const response = await handlePublicRouteMarkdown(
      new Request('https://live.significanthobbies.com/hobbies/painting', {
        headers: { Accept: 'text/markdown, text/html;q=0.1' },
      }),
      load
    );

    expect(response?.status).toBe(200);
    expect(response?.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
    expect(response?.headers.get('content-location')).toBe(
      'https://live.significanthobbies.com/hobbies/painting'
    );
    expect(await response?.text()).toContain('# Painting');
    expect(load).toHaveBeenCalledWith('/hobbies/painting', expect.any(Request));
  });

  it('edge-caches explicit Markdown without caching negotiated HTML URLs', async () => {
    const entries = new Map<string, Response>();
    const writes: Promise<unknown>[] = [];
    const cache = {
      async match(request: Request) {
        return entries.get(request.url)?.clone();
      },
      async put(request: Request, response: Response) {
        entries.set(request.url, response.clone());
      },
    } as Cache;
    const load = vi.fn(async () => '# About\n');
    const options = {
      cache,
      waitUntil(promise: Promise<unknown>) {
        writes.push(promise);
      },
    };

    const miss = await handleCachedPublicRouteMarkdown(
      new Request('https://live.significanthobbies.com/about.md'),
      load,
      options
    );
    expect(miss?.headers.get('x-edge-cache')).toBe('AGENT-MISS');
    await Promise.all(writes);

    const hit = await handleCachedPublicRouteMarkdown(
      new Request('https://live.significanthobbies.com/about.md'),
      load,
      options
    );
    expect(hit?.headers.get('x-edge-cache')).toBe('AGENT-HIT');
    expect(await hit?.text()).toBe('# About\n');
    expect(load).toHaveBeenCalledTimes(1);

    await handleCachedPublicRouteMarkdown(
      new Request('https://live.significanthobbies.com/about', {
        headers: { Accept: 'text/markdown' },
      }),
      load,
      options
    );
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('returns explicit Markdown failures instead of exposing private or empty shells', async () => {
    const privateResponse = await handlePublicRouteMarkdown(
      new Request('https://live.significanthobbies.com/daily.md'),
      vi.fn()
    );
    expect(privateResponse?.status).toBe(404);
    expect(privateResponse?.headers.get('content-type')).toContain('text/markdown');

    const emptyResponse = await handlePublicRouteMarkdown(
      new Request('https://live.significanthobbies.com/explore.md'),
      async () => null
    );
    expect(emptyResponse?.status).toBe(404);
    expect(await emptyResponse?.text()).not.toContain('<html>');
  });

  it('returns a Markdown 404 for Accept-negotiated unknown HTML paths', async () => {
    const response = await handlePublicRouteMarkdown(
      new Request('https://live.significanthobbies.com/this-route-does-not-exist', {
        headers: { Accept: 'text/markdown, text/html;q=0.1' },
      }),
      vi.fn()
    );
    expect(response?.status).toBe(404);
    expect(response?.headers.get('content-type')).toContain('text/markdown');
    expect(await response?.text()).toContain('Not found');
    // Non-markdown requests for the same unknown path still fall through.
    const passthrough = await handlePublicRouteMarkdown(
      new Request('https://live.significanthobbies.com/this-route-does-not-exist'),
      vi.fn()
    );
    expect(passthrough).toBeNull();
  });

  it('renders every generated public corpus route from canonical source data', async () => {
    const entries = await sitemap();
    const paths = entries.map((entry) => new URL(entry.url).pathname);
    const uncovered = paths.filter((path) => !isAgentReadableSitemapPath(path));
    const staticCorpus = paths.filter(
      (path) =>
        !path.startsWith('/u/') && !['/index.md', '/llms-full.txt', '/llms.txt'].includes(path)
    );
    const rendered = await Promise.all(
      staticCorpus.map(async (path) => [path, await renderPublicRouteMarkdown(path)] as const)
    );

    expect(entries.length).toBeGreaterThan(500);
    expect(uncovered).toEqual([]);
    expect(rendered.filter(([, markdown]) => markdown === null).map(([path]) => path)).toEqual([]);
  });

  it('renders substantive Markdown for each public content family', async () => {
    const hobby = await renderPublicRouteMarkdown('/hobbies/drawing');
    const experience = await renderPublicRouteMarkdown(
      `/experiences/${PAGED_EXPERIENCES[0]!.slug}`
    );
    const journey = await renderPublicRouteMarkdown(`/journeys/${FAMOUS_JOURNEYS[0]!.slug}`);
    const blog = await renderPublicRouteMarkdown(`/blog/${editorialArticles[0]!.slug}`);

    expect(hobby).toContain('Your drawing roadmap');
    expect(hobby).toContain('Tools & resources for Drawing');
    expect(experience).toContain('## How you would actually start');
    expect(journey).toContain(FAMOUS_JOURNEYS[0]!.name);
    expect(blog).toContain('> Source: https://live.significanthobbies.com/blog/');
    expect(await renderPublicRouteMarkdown('/daily')).toBeNull();
  });

  it('advertises only bounded surfaces with real same-origin Markdown targets', () => {
    const publicRoutes = new Set(['/', '/explore']);

    expect(apiCatalog.surfaces).toHaveLength(2);
    for (const surface of apiCatalog.surfaces) {
      const url = new URL(surface.url);
      const markdown = new URL(surface.md);
      expect(url.origin).toBe(apiCatalog.url);
      expect(markdown.origin).toBe(apiCatalog.url);
      expect(publicRoutes.has(url.pathname)).toBe(true);
      expect(
        markdown.pathname === '/index.md' ||
          isPublicAgentDocumentPath(htmlPathFromMarkdown(markdown.pathname))
      ).toBe(true);
    }
  });
});

vi.mock('~/server/db', () => {
  const rows: never[] = [];
  const chain = Object.assign(Promise.resolve(rows), {
    from: () => chain,
    leftJoin: () => chain,
    innerJoin: () => chain,
    where: () => chain,
    groupBy: () => chain,
    orderBy: () => chain,
    limit: async () => rows,
  });
  return { db: { select: () => chain, query: { users: { findFirst: async () => null } } } };
});

describe('Markdown representation protocol', () => {
  it.each(['text/markdown;q=0', 'text/markdown;q=0.2,text/html;q=0.8', 'text/markdown,text/html'])(
    'keeps HTML when Accept is %s',
    async (accept) => {
      const loader = vi.fn();
      expect(
        await handlePublicRouteMarkdown(
          new Request('https://live.significanthobbies.com/about', { headers: { accept } }),
          loader
        )
      ).toBeNull();
      expect(loader).not.toHaveBeenCalled();
    }
  );
  it('serves direct Markdown and HEAD with canonical, CORS, noindex and token headers', async () => {
    for (const method of ['GET', 'HEAD']) {
      const response = await handlePublicRouteMarkdown(
        new Request('https://live.significanthobbies.com/api/md/about', { method }),
        async () => '# About'
      );
      expect(response?.status).toBe(200);
      expect(response?.headers.get('Content-Location')).toBe(
        'https://live.significanthobbies.com/about'
      );
      expect(response?.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response?.headers.get('X-Robots-Tag')).toContain('noindex');
      expect(Number(response?.headers.get('X-Markdown-Tokens'))).toBeGreaterThan(0);
      expect(await response?.text()).toBe(method === 'HEAD' ? '' : '# About');
    }
  });
  it('never shares cached public user/community records', async () => {
    for (const path of ['/u/owner.md', '/explore.md', '/hobbies/drawing.md']) {
      const match = vi.fn();
      const put = vi.fn();
      const response = await handleCachedPublicRouteMarkdown(
        new Request(`https://live.significanthobbies.com${path}`),
        async () => '# Public',
        { cache: { match, put } as unknown as Cache }
      );
      expect(response?.headers.get('Cache-Control')).toBe('private, no-store');
      expect(match).not.toHaveBeenCalled();
      expect(put).not.toHaveBeenCalled();
    }
  });
});

describe('complete public discovery', () => {
  it('lists the same static public routes as the sitemap and bounds the full export honestly', async () => {
    const response = await handlePublicReadability(
      new Request('https://live.significanthobbies.com/api/md/_catalog')
    );
    const catalog = (await response?.json()) as { path: string; url: string; md: string }[];
    expect(catalog.length).toBeGreaterThan(500);
    expect(catalog.some((entry) => entry.path.startsWith('/u/'))).toBe(false);
    expect(catalog.some((entry) => entry.path === '/daily')).toBe(false);
    expect(catalog.every((entry) => entry.md.endsWith('.md'))).toBe(true);
    const full = await handlePublicReadability(
      new Request('https://live.significanthobbies.com/llms-full.txt')
    );
    const body = await full?.text();
    expect(body).toContain('registered public pages');
    expect(body?.includes('The reps on a thing you actually care about')).toBe(true);
    expect(body?.length).toBeLessThanOrEqual(500000);
    const policy = await handlePublicReadability(
      new Request('https://live.significanthobbies.com/ai.txt')
    );
    expect(await policy?.text()).toContain('training: allowed on public pages only');
  });
});

vi.mock('~/server/experience-catalog', async () => {
  const { searchCatalogSeed } = await import('./catalog-seed');
  return { searchExperienceCatalog: searchCatalogSeed };
});
