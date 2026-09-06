import { describe, expect, it } from 'vitest';

import {
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
