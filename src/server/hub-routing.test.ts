import { describe, expect, it } from 'vitest';

import {
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
});
