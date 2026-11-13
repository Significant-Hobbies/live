import { describe, expect, it, vi } from 'vitest';
import { createNotFoundAssetHandler } from '../../not-found-artifact.mjs';

const authority = {
  assetPath: '/__live_prerender/build/_not-found/',
  etag: '"compiled"',
  vary: 'rsc, next-router-state-tree',
  caseSensitive: false,
  knownPaths: ['/favicon.ico', '/guide.html', '/guide', '/404', '/500'],
  routeRegexes: ['^/about(?:/)?$', '^/experiences/([^/]+?)(?:/)?$', '^/videos(?:/[^/]+)?$'],
};

function fixture() {
  const fetch = vi.fn(
    async (_request: Request) =>
      new Response('compiler404', {
        headers: { 'Content-Type': 'text/html', ETag: '"asset"' },
      })
  );
  return { fetch, env: { ASSETS: { fetch } }, handler: createNotFoundAssetHandler(authority) };
}

describe('compiler-authoritative unknown HTML', () => {
  it.each(['GET', 'HEAD'])('serves the same private404 representation for %s', async (method) => {
    const { handler, env, fetch } = fixture();
    const response = await handler(
      new Request('https://significanthobbies.com/wp-login.php', { method }),
      env
    );
    expect(response?.status).toBe(404);
    expect(await response?.text()).toBe(method === 'HEAD' ? '' : 'compiler404');
    expect(response?.headers.get('ETag')).toBe(authority.etag);
    expect(response?.headers.get('Vary')).toBe(authority.vary);
    expect(response?.headers.get('Cache-Control')).toBe(
      'private, no-cache, no-store, max-age=0, must-revalidate'
    );
    expect(new URL(fetch.mock.calls[0]![0].url).pathname).toBe(authority.assetPath);
  });

  it.each([
    '/about',
    '/ABOUT',
    '/experiences/any-new-community-record',
    '/videos',
    '/videos/old',
    '/favicon.ico',
    '/guide',
    '/guide.html',
    '/404',
    '/500',
    '/api/unknown',
    '/_next/unknown',
    '/_astro/unknown',
    '/.well-known/unknown',
    '/hub',
    '/health',
    '/mcp',
    '/v1/unknown',
    '/landing/anything',
    '/unknown/',
    '/unknown?functional=1',
    '/un%6bnown',
    '/unknown.md',
    '/unknown.rsc',
    '/unknown.segments/data',
    '//unknown',
  ])('preserves the original handler for %s', async (pathname) => {
    const { handler, env, fetch } = fixture();
    expect(await handler(new Request(`https://significanthobbies.com${pathname}`), env)).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([
    ['Cookie', 'session_token=owner'],
    ['Cookie', '__cf_bm=crawler'],
    ['Authorization', 'Bearer fixture'],
    ['cf-access-jwt-assertion', 'fixture'],
    ['RSC', '1'],
    ['Next-Url', '/private'],
    ['next-router-state-tree', 'fixture'],
    ['next-router-prefetch', '1'],
    ['next-router-segment-prefetch', 'fixture'],
    ['Next-Action', 'fixture'],
    ['x-nextjs-rewritten-path', '/private'],
    ['x-middleware-rewrite', '/private'],
    ['Accept', 'text/markdown'],
    ['Accept', 'text/html;q=0.9,text/markdown;q=0.1'],
    ['Accept', 'text/markdown;q=0.9,text/html;q=0.1'],
    ['Accept', 'text/x-component'],
  ])('never consumes protocol or personal state from %s', async (key, value) => {
    const { handler, env, fetch } = fixture();
    expect(
      await handler(
        new Request('https://significanthobbies.com/unknown', { headers: { [key]: value } }),
        env
      )
    ).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each(['GET', 'HEAD'])(
    'preserves conditional and partial %s semantics in Next',
    async (method) => {
      const { handler, env, fetch } = fixture();
      for (const key of [
        'If-None-Match',
        'If-Match',
        'If-Modified-Since',
        'If-Unmodified-Since',
        'Range',
        'If-Range',
      ]) {
        expect(
          await handler(
            new Request('https://significanthobbies.com/unknown', {
              method,
              headers: { [key]: 'fixture' },
            }),
            env
          )
        ).toBeNull();
      }
      expect(fetch).not.toHaveBeenCalled();
    }
  );

  it('honors compiler catchalls instead of guessing which slugs exist', async () => {
    const { env, fetch } = fixture();
    const handler = createNotFoundAssetHandler({ ...authority, routeRegexes: ['^/(.+?)(?:/)?$'] });
    expect(
      await handler(new Request('https://significanthobbies.com/unknown/deep/path'), env)
    ).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([200, 206, 301, 404, 412, 416, 500])(
    'cancels an unusable artifact (%s) and retains Next fallback',
    async (status) => {
      const { handler, env, fetch } = fixture();
      const cancel = vi.fn();
      fetch.mockResolvedValueOnce(
        new Response(new ReadableStream({ cancel }), {
          status,
          headers: { 'Content-Type': status === 200 ? 'application/json' : 'text/html' },
        })
      );
      expect(await handler(new Request('https://significanthobbies.com/unknown'), env)).toBeNull();
      expect(cancel).toHaveBeenCalledOnce();
    }
  );

  it('falls through on304 or binding failures and never manufactures an empty404', async () => {
    const { handler, env, fetch } = fixture();
    fetch.mockResolvedValueOnce(new Response(null, { status: 304 }));
    expect(await handler(new Request('https://significanthobbies.com/unknown'), env)).toBeNull();
    fetch.mockRejectedValueOnce(new Error('binding unavailable'));
    expect(await handler(new Request('https://significanthobbies.com/unknown'), env)).toBeNull();
  });
});
