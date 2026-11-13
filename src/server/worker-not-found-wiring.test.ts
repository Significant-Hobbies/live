import { beforeEach, describe, expect, it, vi } from 'vitest';

const { nextFetch, assetFetch, hubFetch } = vi.hoisted(() => ({
  nextFetch: vi.fn(),
  assetFetch: vi.fn(),
  hubFetch: vi.fn(),
}));
vi.mock('../../.open-next/worker.js', () => ({
  default: { fetch: nextFetch },
  DOQueueHandler: {},
  DOShardedTagCache: {},
  BucketCachePurge: {},
}));
vi.mock('../../.open-next/cache-release.mjs', () => ({
  buildId: 'wiring-fixture',
  publicBlogArtifacts: {},
  notFoundArtifact: {
    assetPath: '/__live_prerender/wiring-fixture/_not-found/',
    etag: '"compiler404"',
    vary: 'rsc',
    caseSensitive: false,
    knownPaths: ['/about'],
    routeRegexes: ['^/blog/([^/]+?)(?:/)?$'],
  },
}));
vi.mock('../../timing.mjs', () => ({ withTiming: (handler: unknown) => handler }));
vi.mock('../../agent-edge.mjs', () => ({
  handleAgentEdge: (request: Request) =>
    new URL(request.url).pathname === '/openapi.json' ? new Response('agent-edge') : null,
}));
vi.mock('../../agent-route-markdown.mjs', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  handleCachedPublicRouteMarkdown: async (request: Request) =>
    request.headers.get('Accept') === 'text/markdown' ? new Response('markdown') : null,
}));
vi.mock('../../weekly-nudge-email.mjs', () => ({ sendWeeklyNudges: vi.fn() }));

import worker from '../../worker.mjs';

const context = { waitUntil: vi.fn() };
const env = { ASSETS: { fetch: assetFetch }, HUB_SERVICE: { fetch: hubFetch } };

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('caches', { default: { match: vi.fn(async () => undefined), put: vi.fn() } });
  nextFetch.mockImplementation(async () => new Response('application'));
  hubFetch.mockImplementation(async () => new Response('hub'));
  assetFetch.mockImplementation(
    async () => new Response('asset', { headers: { 'Content-Type': 'text/html' } })
  );
});

describe('non-null compiler404 authority in the real Worker entry', () => {
  it('serves an anonymous unknown path through the artifact without booting Next', async () => {
    const response = await worker.fetch(
      new Request('https://significanthobbies.com/wp-login.php'),
      env,
      context
    );
    expect(response.status).toBe(404);
    expect(response.headers.get('x-edge-cache')).toBe('NOT-FOUND-ASSET');
    expect(new URL(assetFetch.mock.calls[0]![0].url).pathname).toBe(
      '/__live_prerender/wiring-fixture/_not-found/'
    );
    expect(nextFetch).not.toHaveBeenCalled();
  });

  it.each([
    ['/hub', {}, 'hub'],
    ['/llms.txt', {}, 'application'],
    ['/openapi.json', {}, 'agent-edge'],
    ['/images/public.webp', {}, 'asset'],
    ['/wp-login.php', { Accept: 'text/markdown' }, 'markdown'],
    ['/wp-login.php', { Cookie: 'session_token=owner' }, 'application'],
    ['/', {}, 'asset'],
  ])('retains the earlier or protected branch for %s', async (pathname, headers, body) => {
    const response = await worker.fetch(
      new Request(`https://significanthobbies.com${pathname}`, { headers }),
      env,
      context
    );
    expect(await response.text()).toBe(body);
    expect(response.headers.get('x-edge-cache')).not.toBe('NOT-FOUND-ASSET');
    for (const [request] of assetFetch.mock.calls)
      expect(new URL(request.url).pathname).not.toContain('/_not-found/');
    if (pathname === '/llms.txt')
      expect(new URL(nextFetch.mock.calls[0]![0].url).pathname).toBe('/api/ai/discovery');
    if (pathname === '/hub') expect(hubFetch).toHaveBeenCalledOnce();
  });
});
