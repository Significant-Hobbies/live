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
vi.mock('../../.open-next/cache-release.mjs', () => ({ buildId: 'test-release' }));
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
