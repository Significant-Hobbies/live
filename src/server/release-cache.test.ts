import { describe, expect, it } from 'vitest';
import { createReleaseCache, publicHtmlRequest } from '../../release-cache.mjs';

function memoryCache() {
  const records = new Map<string, Response>();
  return {
    async match(request: Request) {
      return records.get(request.url)?.clone();
    },
    async put(request: Request, response: Response) {
      records.set(request.url, response.clone());
    },
  };
}

describe('HTML release cache', () => {
  it('cannot serve pre-deploy HTML with removed JavaScript assets to a new build', async () => {
    const cache = memoryCache();
    const request = new Request('https://live.significanthobbies.com/hobbies');
    await cache.put(request, new Response('legacy HTML'));
    const previous = createReleaseCache(cache, 'previous-build');
    await previous.put(request, new Response('<script src="old.js"></script>'));
    const current = createReleaseCache(cache, 'current-build');
    expect(await current.match(request)).toBeUndefined();
    await current.put(request, new Response('<script src="new.js"></script>'));
    expect(await (await current.match(request))?.text()).toContain('new.js');
    expect(await (await previous.match(request))?.text()).toContain('old.js');
  });

  it('shares HEAD and GET while preserving query variants and the original upstream request', async () => {
    const cache = createReleaseCache(memoryCache(), 'current-build');
    const request = new Request('https://live.significanthobbies.com/hobbies?category=art', {
      headers: { Accept: 'text/html' },
    });
    await cache.put(request, new Response('art'));
    const head = new Request(request, { method: 'HEAD' });
    expect(await (await cache.match(head))?.text()).toBe('art');
    expect(
      await cache.match(new Request('https://live.significanthobbies.com/hobbies?category=music'))
    ).toBeUndefined();
    expect(request.url).toBe('https://live.significanthobbies.com/hobbies?category=art');
    expect(request.headers.get('Accept')).toBe('text/html');
  });

  it('refuses missing build identity instead of reusing an unversioned cache', () => {
    expect(() => createReleaseCache(memoryCache(), '')).toThrow('build identity');
  });

  it.each([
    'utm_source=newsletter&utm_medium=email&utm_campaign=spring',
    'gclid=one&fbclid=two&msclkid=three',
    'UTM_Source=one&GCLID=two&utm_source=again',
  ])('shares public HTML across tracking-only variants %s', async (tracking) => {
    const cache = createReleaseCache(memoryCache(), 'current-build');
    const base = 'https://live.significanthobbies.com/hobbies?category=art&q=pottery&page=2';
    await cache.put(new Request(base), new Response('filtered pottery page 2'));
    const request = new Request(`${base}&${tracking}`, { headers: { Accept: 'text/html' } });
    expect(await (await cache.match(request))?.text()).toBe('filtered pottery page 2');
    expect(request.url).toBe(`${base}&${tracking}`);
    expect(request.headers.get('Accept')).toBe('text/html');
    expect(
      await cache.match(new Request(`${base.replace('pottery', 'drawing')}&${tracking}`))
    ).toBeUndefined();
    expect(
      await cache.match(new Request(`${base.replace('page=2', 'page=3')}&${tracking}`))
    ).toBeUndefined();
  });

  it('preserves unknown parameters and isolates tracking-normalized entries by release', async () => {
    const store = memoryCache();
    const previous = createReleaseCache(store, 'previous-build');
    const current = createReleaseCache(store, 'current-build');
    const request = new Request(
      'https://live.significanthobbies.com/hobbies?preview=one&utm_source=mail'
    );
    await previous.put(request, new Response('previous preview'));
    expect(await current.match(request)).toBeUndefined();
    await current.put(request, new Response('current preview'));
    expect(await (await current.match(request))?.text()).toBe('current preview');
    expect(
      await current.match(new Request(request.url.replace('preview=one', 'preview=two')))
    ).toBeUndefined();
  });

  it('clones a public render request without mutating its functional query or metadata', () => {
    const controller = new AbortController();
    const request = new Request(
      'https://live.significanthobbies.com/hobbies?q=pottery&utm_source=mail&gclid=private-click',
      {
        method: 'GET',
        headers: {
          Accept: 'text/html',
          'Accept-Language': 'en-GB',
          'X-Request-Identity': 'local-fixture',
        },
        signal: controller.signal,
      }
    );
    const normalized = publicHtmlRequest(request);
    expect(normalized.url).toBe('https://live.significanthobbies.com/hobbies?q=pottery');
    expect(normalized.method).toBe('GET');
    expect([...normalized.headers]).toEqual([...request.headers]);
    expect(request.url).toContain('gclid=private-click');
    controller.abort();
    expect(normalized.signal.aborted).toBe(true);
    expect(publicHtmlRequest(normalized)).toBe(normalized);
  });
});
