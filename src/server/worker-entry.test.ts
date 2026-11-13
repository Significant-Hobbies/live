import { beforeEach, describe, expect, it, vi } from 'vitest';

const { nextFetch, assetFetch } = vi.hoisted(() => ({
  nextFetch: vi.fn(),
  assetFetch: vi.fn(),
}));

vi.mock('../../.open-next/worker.js', () => ({
  default: { fetch: nextFetch },
  DOQueueHandler: {},
  DOShardedTagCache: {},
  BucketCachePurge: {},
}));
vi.mock('../../.open-next/cache-release.mjs', () => ({
  buildId: 'test-release',
  publicBlogArtifacts: {
    '/blog/compiled-article': '/__live_prerender/test-release/blog/compiled-article/',
  },
}));
vi.mock('../../timing.mjs', () => ({ withTiming: (handler: unknown) => handler }));
vi.mock('../../agent-edge.mjs', () => ({ handleAgentEdge: () => null }));
vi.mock('../../agent-route-markdown.mjs', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  handleCachedPublicRouteMarkdown: async () => null,
}));
vi.mock('../../weekly-nudge-email.mjs', () => ({ sendWeeklyNudges: vi.fn() }));

import worker from '../../worker.mjs';

const context = { waitUntil: vi.fn() };
const environment = { ASSETS: { fetch: assetFetch } };

describe('Owned public binary assets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('caches', {
      default: { match: vi.fn(async () => undefined), put: vi.fn() },
    });
    nextFetch.mockImplementation(async () => new Response('application response'));
  });

  it.each([
    ['/experiences/road-trip-1200.webp', 'image/webp'],
    ['/images/live-more/pottery-v1.webp', 'image/webp'],
    ['/hero/example.mp4', 'video/mp4'],
    ['/categories/creative.jpg', 'image/jpeg'],
    ['/footer-art/example.webp', 'image/webp'],
  ])('serves %s without initializing the application renderer', async (path, type) => {
    const bytes = new Uint8Array([0, 1, 127, 255]);
    assetFetch.mockResolvedValueOnce(
      new Response(bytes, {
        headers: {
          'Content-Type': type,
          ETag: 'owned-asset',
          'Cache-Control': 'public, max-age=60',
        },
      })
    );
    const request = new Request(`https://significanthobbies.com${path}`, {
      headers: { Cookie: '__Secure-better-auth.session_token=owner' },
    });
    const response = await worker.fetch(request, environment, context);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe(type);
    expect(response.headers.get('etag')).toBe('owned-asset');
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(bytes);
    expect(assetFetch).toHaveBeenCalledWith(request);
    expect(nextFetch).not.toHaveBeenCalled();
  });

  it.each([
    ['HEAD', 200],
    ['GET', 304],
    ['HEAD', 304],
  ])('preserves asset %s status %s and validators', async (method, status) => {
    assetFetch.mockResolvedValueOnce(
      new Response(null, { status, headers: { ETag: 'same-file' } })
    );
    const response = await worker.fetch(
      new Request('https://live.significanthobbies.com/experiences/road-trip-1200.webp', {
        method,
        headers: { 'If-None-Match': 'same-file' },
      }),
      environment,
      context
    );
    expect(response.status).toBe(status);
    expect(response.headers.get('etag')).toBe('same-file');
    expect(await response.text()).toBe('');
    expect(nextFetch).not.toHaveBeenCalled();
  });

  it('keeps a missing binary path with the application route', async () => {
    assetFetch.mockResolvedValueOnce(new Response('asset missing', { status: 404 }));
    const request = new Request('https://significanthobbies.com/experiences/community-item.webp');
    const response = await worker.fetch(request, environment, context);
    expect(await response.text()).toBe('application response');
    expect(nextFetch).toHaveBeenCalledWith(request, environment, context);
  });

  it.each([
    ['GET', '/experiences/sources.json'],
    ['GET', '/experiences/learn-to-draw-portraits'],
    ['GET', '/experiences/learn-to-draw-portraits.md'],
    ['GET', '/u/owner/avatar.webp'],
    ['GET', '/api/export.webp'],
    ['POST', '/experiences/road-trip-1200.webp'],
  ])('keeps %s %s outside the binary shortcut', async (method, path) => {
    const request = new Request(`https://significanthobbies.com${path}`, { method });
    const response = await worker.fetch(request, environment, context);
    expect(await response.text()).toBe('application response');
    expect(assetFetch).not.toHaveBeenCalled();
    expect(nextFetch).toHaveBeenCalledWith(request, environment, context);
  });
});

describe('Generated public blog HTML', () => {
  const article = 'https://significanthobbies.com/blog/compiled-article';
  const stored =
    'https://significanthobbies.com/__live_prerender/test-release/blog/compiled-article/';
  const cache = { match: vi.fn(async () => undefined), put: vi.fn() };
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('caches', { default: cache });
    assetFetch.mockImplementation(
      async () =>
        new Response('compiled HTML', {
          headers: { 'Content-Type': 'text/html; charset=utf-8', ETag: 'compiled-body' },
        })
    );
    nextFetch.mockImplementation(
      async () =>
        new Response('application HTML', {
          headers: { 'Content-Type': 'text/html' },
        })
    );
  });

  it.each(['GET', 'HEAD'])(
    'serves byte-preserved %s HTML with public validators and correct Vary',
    async (method) => {
      const request = new Request(`${article}?utm_source=first&gclid=private-click`, {
        method,
        headers: { Accept: 'text/html', 'If-None-Match': 'older-body' },
      });
      const response = await worker.fetch(request, environment, context);
      expect(response.status).toBe(200);
      expect(await response.text()).toBe(method === 'HEAD' ? '' : 'compiled HTML');
      expect(response.headers.get('Content-Type')).toBe('text/html; charset=utf-8');
      expect(response.headers.get('ETag')).toBe('compiled-body');
      expect(response.headers.get('Cache-Control')).toBe(
        'public, max-age=0, s-maxage=86400, must-revalidate'
      );
      expect(response.headers.get('x-edge-cache')).toBe('ASSET');
      const vary = response.headers
        .get('Vary')
        ?.toLowerCase()
        .split(',')
        .map((value) => value.trim());
      expect(vary).toEqual(
        expect.arrayContaining([
          'accept',
          'accept-encoding',
          'rsc',
          'next-router-state-tree',
          'next-router-prefetch',
          'next-router-segment-prefetch',
        ])
      );
      const assetRequest = assetFetch.mock.calls[0]![0] as Request;
      expect(assetRequest.url).toBe(stored);
      expect(assetRequest.method).toBe(method);
      expect(assetRequest.headers.get('If-None-Match')).toBe('older-body');
      expect(request.url).toContain('private-click');
      expect(nextFetch).not.toHaveBeenCalled();
      expect(cache.match).not.toHaveBeenCalled();
      expect(cache.put).not.toHaveBeenCalled();
    }
  );

  it.each(['GET', 'HEAD'])('keeps conditional %s 304 metadata and no body', async (method) => {
    assetFetch.mockResolvedValueOnce(
      new Response(null, { status: 304, headers: { ETag: 'compiled-body' } })
    );
    const response = await worker.fetch(
      new Request(article, { method, headers: { 'If-None-Match': 'compiled-body' } }),
      environment,
      context
    );
    expect(response.status).toBe(304);
    expect(response.headers.get('ETag')).toBe('compiled-body');
    expect(await response.text()).toBe('');
    expect(nextFetch).not.toHaveBeenCalled();
  });

  it('keeps non-document writes with the untouched application request', async () => {
    const request = new Request(article, { method: 'POST', body: 'unchanged input' });
    const response = await worker.fetch(request, environment, context);
    expect(await response.text()).toBe('application HTML');
    expect(nextFetch).toHaveBeenCalledWith(request, environment, context);
    expect(await request.text()).toBe('unchanged input');
    expect(assetFetch).not.toHaveBeenCalled();
  });

  it('cancels a missing artifact and follows the same normalized application path', async () => {
    const cancel = vi.fn();
    assetFetch.mockResolvedValueOnce(new Response(new ReadableStream({ cancel }), { status: 404 }));
    const response = await worker.fetch(
      new Request(`${article}?utm_source=first`),
      environment,
      context
    );
    expect(await response.text()).toBe('application HTML');
    expect(cancel).toHaveBeenCalledTimes(1);
    expect((nextFetch.mock.calls[0]![0] as Request).url).toBe(article);
  });

  it.each([
    ['/blog/compiled-article?q=pottery', {}],
    ['/blog/compiled-article?unknown=retained', {}],
    ['/blog/compiled-article', { Cookie: '__Secure-better-auth.session_token=owner' }],
    ['/blog/compiled-article', { Authorization: 'Bearer owner' }],
    ['/blog/compiled-article', { 'cf-access-jwt-assertion': 'owner' }],
    ['/blog/compiled-article', { RSC: '1' }],
    ['/blog/compiled-article', { Accept: 'text/x-component' }],
    ['/blog/compiled-article', { Accept: 'application/json' }],
    ['/blog/another-article', {}],
    ['/u/owner', {}],
    ['/b/owner', {}],
    ['/api/account-presentation', {}],
  ])('keeps noneligible %s with the application', async (path, headers) => {
    const request = new Request(`https://significanthobbies.com${path}`, { headers });
    const response = await worker.fetch(request, environment, context);
    expect(await response.text()).toBe('application HTML');
    expect(assetFetch).not.toHaveBeenCalled();
    expect(nextFetch).toHaveBeenCalled();
  });
});

describe('Public HTML tracking isolation', () => {
  const records = new Map<string, Response>();
  const htmlCache = {
    match: vi.fn(async (request: Request) => records.get(request.url)?.clone()),
    put: vi.fn(async (request: Request, response: Response) =>
      records.set(request.url, response.clone())
    ),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    records.clear();
    vi.stubGlobal('caches', { default: htmlCache });
    nextFetch.mockImplementation(
      async (request: Request) =>
        new Response(`SSR and RSC URL: ${request.url}`, {
          headers: { 'Content-Type': 'text/html' },
        })
    );
  });

  it('never stores the first visitor tracking identifier in shared HTML', async () => {
    const base = 'https://significanthobbies.com/experiences/learn-to-draw-portraits?q=pottery';
    const firstRequest = new Request(`${base}&utm_source=first&gclid=first-private-click`, {
      headers: { Accept: 'text/html', 'Accept-Language': 'en-GB' },
    });
    const first = await worker.fetch(firstRequest, environment, context);
    expect(await first.text()).toBe(`SSR and RSC URL: ${base}`);
    await Promise.all(context.waitUntil.mock.calls.map(([promise]) => promise));
    for (const url of [base, `${base}&utm_source=second&gclid=second-private-click`]) {
      const response = await worker.fetch(new Request(url), environment, context);
      expect(response.headers.get('x-edge-cache')).toBe('HIT');
      expect(await response.text()).toBe(`SSR and RSC URL: ${base}`);
    }
    expect(nextFetch).toHaveBeenCalledTimes(1);
    expect(nextFetch.mock.calls[0][0].headers.get('Accept-Language')).toBe('en-GB');
    expect(firstRequest.url).toContain('gclid=first-private-click');
  });

  it('does not render a tracked conditional 304 response twice', async () => {
    nextFetch.mockResolvedValueOnce(new Response(null, { status: 304 }));
    const response = await worker.fetch(
      new Request('https://significanthobbies.com/blog/example?utm_source=first', {
        headers: { 'If-None-Match': 'known-version' },
      }),
      environment,
      context
    );
    expect(response.status).toBe(304);
    expect(nextFetch).toHaveBeenCalledTimes(1);
    expect(htmlCache.put).not.toHaveBeenCalled();
  });

  it('preserves the original tracking URL when Next redirects', async () => {
    nextFetch.mockImplementation(async (request: Request) => {
      const url = new URL(request.url);
      url.pathname = url.pathname.replace(/\/$/, '');
      return new Response(null, { status: 308, headers: { Location: url.href } });
    });
    const response = await worker.fetch(
      new Request(
        'https://significanthobbies.com/experiences/pottery/?q=clay&utm_source=first&gclid=click'
      ),
      environment,
      context
    );
    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe(
      'https://significanthobbies.com/experiences/pottery?q=clay&utm_source=first&gclid=click'
    );
    expect(htmlCache.put).not.toHaveBeenCalled();
  });

  it.each([
    [
      '/experiences/learn-to-draw-portraits',
      { Cookie: '__Secure-better-auth.session_token=owner' },
    ],
    ['/experiences/learn-to-draw-portraits', { Authorization: 'Bearer test-only' }],
    ['/b/private-owner', { 'cf-access-jwt-assertion': 'test-only' }],
    ['/experiences/learn-to-draw-portraits', { RSC: '1' }],
    ['/experiences/learn-to-draw-portraits', { Accept: 'text/x-component' }],
    ['/api/catalog', {}],
    ['/u/owner', {}],
  ])('keeps private, API and component requests unchanged at %s', async (path, headers) => {
    const request = new Request(
      `https://significanthobbies.com${path}?utm_source=owner&gclid=private-click`,
      { headers }
    );
    const response = await worker.fetch(request, environment, context);
    expect(await response.text()).toContain('gclid=private-click');
    expect(nextFetch).toHaveBeenCalledWith(request, environment, context);
    expect(htmlCache.match).not.toHaveBeenCalled();
    expect(htmlCache.put).not.toHaveBeenCalled();
  });
});

describe.each(['significanthobbies.com', 'live.significanthobbies.com'])(
  'Live homepage entry on %s',
  (hostname) => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.stubGlobal('caches', { default: {} });
      nextFetch.mockImplementation(async () => new Response('workspace'));
      assetFetch.mockImplementation(async () => new Response('public landing'));
    });

    it.each([
      ['GET', '__Secure-better-auth.session_token=valid-session'],
      ['HEAD', '__Secure-better-auth.session_token=valid-session'],
      ['GET', 'better-auth.session_token=dev-session'],
      ['GET', 'better-auth.session-token=legacy-session'],
    ])('takes a session-bearing %s directly to the personal list', async (method, cookie) => {
      const response = await worker.fetch(
        new Request(`https://${hostname}/`, {
          method,
          headers: { Cookie: cookie },
        }),
        environment,
        context
      );
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe(`https://${hostname}/bucket-list`);
      expect(response.headers.get('cache-control')).toBe('private, no-store');
      expect(response.headers.get('vary')).toBe('Cookie');
      expect(await response.text()).toBe('');
      expect(assetFetch).not.toHaveBeenCalled();
      expect(nextFetch).not.toHaveBeenCalled();
    });

    it.each(['GET', 'HEAD'])(
      'keeps the anonymous %s landing on the Astro overlay',
      async (method) => {
        const response = await worker.fetch(
          new Request(`https://${hostname}/`, {
            method,
            headers: { Cookie: 'theme=light' },
          }),
          environment,
          context
        );
        expect(response.status).toBe(200);
        expect(assetFetch.mock.calls[0][0].url).toBe(`https://${hostname}/live.html`);
        expect(await response.text()).toBe(method === 'HEAD' ? '' : 'public landing');
        expect(nextFetch).not.toHaveBeenCalled();
      }
    );

    it.each<Record<string, string>>([
      { RSC: '1' },
      { Accept: 'text/x-component' },
      { Authorization: 'Bearer test-only' },
      { 'cf-access-jwt-assertion': 'test-only' },
    ])('serves anonymous root component navigation from the Astro overlay', async (headers) => {
      const response = await worker.fetch(
        new Request(`https://${hostname}/`, { headers }),
        environment,
        context
      );
      expect(response.status).toBe(200);
      expect(await response.text()).toBe('public landing');
      expect(nextFetch).not.toHaveBeenCalled();
    });

    it('leaves signed-in deep links with the application session checks', async () => {
      const request = new Request('https://live.significanthobbies.com/bucket-lists/will-smith', {
        headers: { Cookie: '__Secure-better-auth.session_token=valid-session' },
      });
      const response = await worker.fetch(request, environment, context);
      expect(response.status).toBe(200);
      expect(nextFetch).toHaveBeenCalledWith(request, environment, context);
      expect(assetFetch).not.toHaveBeenCalled();
    });
  }
);

describe.each(['significanthobbies.com', 'live.significanthobbies.com'])(
  'Current profile privacy at the edge on %s',
  (hostname) => {
    it.each([
      ['/u/privacy-owner', 'text/html', 404],
      ['/u/privacy-owner/opengraph-image', 'image/png', 200],
      ['/sitemap.xml', 'application/xml', 200],
    ])(
      'ignores a warmed public cache after visibility changes for %s',
      async (path, type, status) => {
        const cache = {
          match: vi.fn(async () => new Response('Previously public personal content')),
          put: vi.fn(),
        };
        vi.stubGlobal('caches', { default: cache });
        vi.clearAllMocks();
        const request = new Request(`https://${hostname}${path}`);
        nextFetch.mockImplementationOnce(
          async () =>
            new Response('Currently public content', { headers: { 'Content-Type': type } })
        );
        const publicResponse = await worker.fetch(request, environment, context);
        expect(await publicResponse.text()).toBe('Currently public content');
        expect(publicResponse.headers.get('cache-control')).toBe('private, no-store');
        nextFetch.mockImplementationOnce(
          async () =>
            new Response('Current privacy-safe response', {
              status,
              headers: { 'Content-Type': type },
            })
        );
        const hiddenResponse = await worker.fetch(request, environment, context);
        expect(hiddenResponse.status).toBe(status);
        expect(await hiddenResponse.text()).toBe('Current privacy-safe response');
        expect(hiddenResponse.headers.get('cache-control')).toBe('private, no-store');
        nextFetch.mockImplementationOnce(async () => new Response(null, { status }));
        const head = await worker.fetch(
          new Request(request, { method: 'HEAD' }),
          environment,
          context
        );
        expect(head.status).toBe(status);
        expect(head.headers.get('cache-control')).toBe('private, no-store');
        expect(await head.text()).toBe('');
        expect(nextFetch).toHaveBeenCalledTimes(3);
        expect(cache.match).not.toHaveBeenCalled();
        expect(cache.put).not.toHaveBeenCalled();
      }
    );
  }
);
