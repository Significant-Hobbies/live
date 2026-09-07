import { describe, expect, it } from 'vitest';

import {
  fetchHubRoute,
  shouldDelegateHub,
  HUB_AGENT_CONTRACT_PATHS,
  hubServiceRequest,
  isHubServicePath,
  legacyLiveRedirect,
  markPersonalPlatformInternalRequest,
  PERSONAL_PLATFORM_INTERNAL_HEADER,
} from '../../hub-routing.mjs';

describe('Hub edge routing', () => {
  it.each(['/', '/hub', '/health', '/mcp', '/v1/life/today', '/v1/sync/push'])(
    'delegates %s to Personal Platform',
    (pathname) => {
      expect(isHubServicePath(pathname)).toBe(true);
    }
  );

  it.each(['/api/auth/session', '/library', '/experiences'])('keeps %s in Live', (pathname) => {
    expect(isHubServicePath(pathname)).toBe(false);
  });

  it('keeps every Live path on the Live host', () => {
    expect(legacyLiveRedirect(new URL('https://live.significanthobbies.com/live-more'))).toBeNull();
  });

  it('redirects legacy apex Live paths without losing path or query', () => {
    expect(
      legacyLiveRedirect(new URL('https://significanthobbies.com/live-more?from=old-bookmark'))
        ?.href
    ).toBe('https://live.significanthobbies.com/live-more?from=old-bookmark');
  });

  it.each(['/', '/hub', '/health', '/mcp', '/v1/life/today'])(
    'does not redirect the Hub route %s',
    (pathname) => {
      expect(legacyLiveRedirect(new URL(`https://significanthobbies.com${pathname}`))).toBeNull();
    }
  );

  it.each(HUB_AGENT_CONTRACT_PATHS)(
    'keeps the apex agent contract file %s on the apex',
    (pathname) => {
      expect(isHubServicePath(pathname)).toBe(true);
      expect(legacyLiveRedirect(new URL(`https://significanthobbies.com${pathname}`))).toBeNull();
      expect(
        legacyLiveRedirect(new URL(`https://www.significanthobbies.com${pathname}`))
      ).toBeNull();
    }
  );

  it('covers the whole crawler and agent contract', () => {
    expect(new Set(HUB_AGENT_CONTRACT_PATHS)).toEqual(
      new Set([
        '/robots.txt',
        '/sitemap.xml',
        '/llms.txt',
        '/llms-full.txt',
        '/index.md',
        '/api/ai',
        '/api-ai.json',
        '/.well-known/security.txt',
      ])
    );
  });

  it.each(['/blog/side-quests', '/compare', '/about', '/side-quests'])(
    'still moves the Live-owned content path %s to the Live host',
    (pathname) => {
      expect(legacyLiveRedirect(new URL(`https://significanthobbies.com${pathname}`))?.href).toBe(
        `https://live.significanthobbies.com${pathname}`
      );
    }
  );

  it.each(HUB_AGENT_CONTRACT_PATHS)('leaves the Live host to serve its own %s', (pathname) => {
    expect(
      legacyLiveRedirect(new URL(`https://live.significanthobbies.com${pathname}`))
    ).toBeNull();
  });

  it('marks only the private service-binding request as trusted', () => {
    const request = markPersonalPlatformInternalRequest(
      new Request('https://personal-auth.internal/api/personal-platform/live/summary')
    );
    expect(request.headers.get(PERSONAL_PLATFORM_INTERNAL_HEADER)).toBe('1');
  });

  it('strips a forged trust marker from public traffic', () => {
    const request = markPersonalPlatformInternalRequest(
      new Request('https://significanthobbies.com/api/personal-platform/live/summary', {
        headers: { [PERSONAL_PLATFORM_INTERNAL_HEADER]: '1' },
      })
    );
    expect(request.headers.has(PERSONAL_PLATFORM_INTERNAL_HEADER)).toBe(false);
  });

  // Significant-Hobbies/live#10: the Hub Backend's router only registers GET
  // handlers for `/`, so a HEAD probe fell through to its authenticated
  // routes and got a 401 instead of the 200 a GET receives. Run HEAD as GET
  // against the service binding and let the caller drop the body.
  describe('HEAD parity for the Hub service binding', () => {
    it.each(['/', '/hub', '/health', ...HUB_AGENT_CONTRACT_PATHS])(
      'rewrites a HEAD request for %s to GET',
      (pathname) => {
        const request = hubServiceRequest(
          new Request(`https://significanthobbies.com${pathname}`, { method: 'HEAD' })
        );
        expect(request.method).toBe('GET');
        expect(request.url).toBe(`https://significanthobbies.com${pathname}`);
      }
    );

    it.each(['GET', 'POST', 'OPTIONS'])('leaves a %s request untouched', (method) => {
      const original = new Request('https://significanthobbies.com/v1/sync/push', { method });
      expect(hubServiceRequest(original)).toBe(original);
    });
  });

  // Significant-Hobbies/live#10: the apex's own OG tags reference
  // `/hub-opengraph-image`, but nothing was ever registered under that name
  // on Live — only Next's `/opengraph-image` App Router route generates the
  // image — so the identity redirect sent crawlers to a 404.
  describe('the apex OG image alias', () => {
    it('redirects /hub-opengraph-image to the real Live route name', () => {
      expect(
        legacyLiveRedirect(new URL('https://significanthobbies.com/hub-opengraph-image'))?.href
      ).toBe('https://live.significanthobbies.com/opengraph-image');
    });

    it('redirects the www apex host the same way', () => {
      expect(
        legacyLiveRedirect(new URL('https://www.significanthobbies.com/hub-opengraph-image'))?.href
      ).toBe('https://live.significanthobbies.com/opengraph-image');
    });

    it('leaves the real Live route name alone on the Live host', () => {
      expect(
        legacyLiveRedirect(new URL('https://live.significanthobbies.com/opengraph-image'))
      ).toBeNull();
    });
  });
});

describe('private Hub on the authenticated Live origin', () => {
  it.each([
    'https://live.significanthobbies.com/hub',
    'https://significanthobbies.com/hub',
    'https://www.significanthobbies.com/hub',
  ])('delegates the allowed entry %s', (url) => expect(shouldDelegateHub(new URL(url))).toBe(true));
  it.each([
    'https://live.significanthobbies.com/',
    'https://live.significanthobbies.com/hub/extra',
    'https://live.significanthobbies.com/v1/sync/push',
    'https://evil.example/hub',
    'https://live.significanthobbies.com.evil.example/hub',
  ])('does not expand delegation to %s', (url) =>
    expect(shouldDelegateHub(new URL(url))).toBe(false)
  );
  it('forwards the original authenticated request and prevents shared caching', async () => {
    const request = new Request('https://live.significanthobbies.com/hub', {
      headers: { Cookie: 'synthetic=session' },
    });
    const response = await fetchHubRoute(request, {
      HUB_SERVICE: {
        fetch: async (forwarded: Request) => {
          expect(forwarded.url).toBe(request.url);
          expect(forwarded.headers.get('cookie')).toBe('synthetic=session');
          return new Response('private record', {
            headers: { 'Cache-Control': 'public, max-age=3600' },
          });
        },
      },
    });
    expect(await response?.text()).toBe('private record');
    expect(response?.headers.get('cache-control')).toBe('private, no-store');
    expect(response?.headers.get('cdn-cache-control')).toBe('no-store');
  });
  it('fails closed without the binding or when it throws', async () => {
    for (const env of [
      {},
      {
        HUB_SERVICE: {
          fetch: async () => {
            throw new Error('unavailable');
          },
        },
      },
    ]) {
      const response = await fetchHubRoute(
        new Request('https://live.significanthobbies.com/hub'),
        env
      );
      expect([502, 503]).toContain(response?.status);
      expect(response?.headers.has('location')).toBe(false);
      expect(response?.headers.get('cache-control')).toBe('private, no-store');
    }
  });
});
