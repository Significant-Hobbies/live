import { describe, expect, it } from 'vitest';
import { createReleaseCache } from '../../release-cache.mjs';

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
});
