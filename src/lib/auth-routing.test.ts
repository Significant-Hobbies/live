import { describe, expect, it } from 'vitest';

import { guestRouteFor, loginPath, safeCallbackUrl } from './auth-routing';

describe('loginPath', () => {
  it('round-trips through the callbackUrl param the login page reads', () => {
    expect(loginPath('/journal')).toBe('/login?callbackUrl=%2Fjournal');
    const parsed = new URL(loginPath('/trajectory'), 'https://live.significanthobbies.com');
    expect(parsed.searchParams.get('callbackUrl')).toBe('/trajectory');
  });

  it('encodes dynamic segments so ids survive the round trip', () => {
    const url = new URL(loginPath('/bucket-list/abc 123'), 'https://live.significanthobbies.com');
    expect(url.searchParams.get('callbackUrl')).toBe('/bucket-list/abc 123');
  });

  it('encodes a nested query so it cannot inject a second param', () => {
    // A callback carrying its own "&" must not become a sibling param the login
    // page would read as something else.
    const url = new URL(loginPath('/journal?tab=pm&x=1'), 'https://live.significanthobbies.com');
    expect(url.searchParams.get('callbackUrl')).toBe('/journal?tab=pm&x=1');
    expect(url.searchParams.get('x')).toBeNull();
  });
});

describe('safeCallbackUrl', () => {
  it('preserves an explicit workspace destination', () => {
    expect(safeCallbackUrl('/journal')).toBe('/journal');
    expect(safeCallbackUrl('/bucket-list')).toBe('/bucket-list');
  });

  it('preserves an internal Hub destination', () => {
    expect(safeCallbackUrl('/hub')).toBe('/hub');
  });

  it('rejects external and protocol-relative redirects', () => {
    expect(safeCallbackUrl('https://example.com')).toBe('/bucket-list');
    expect(safeCallbackUrl('//example.com')).toBe('/bucket-list');
    expect(safeCallbackUrl(undefined)).toBe('/bucket-list');
  });
});

describe('guestRouteFor', () => {
  it('keeps bucket-list intent in the local list', () => {
    expect(guestRouteFor('/bucket-list').href).toBe('/bucket-list');
    expect(guestRouteFor('/bucket-list/xyz').href).toBe('/bucket-list');
  });

  it('sends timeline intent to the anonymous builder', () => {
    expect(guestRouteFor('/timeline').href).toBe('/timeline/new');
    expect(guestRouteFor('/timeline/xyz/edit').href).toBe('/timeline/new');
  });

  it('keeps journal and habit intent on the same local surface', () => {
    expect(guestRouteFor('/journal').href).toBe('/journal');
    expect(guestRouteFor('/habits').href).toBe('/habits');
    for (const route of ['/trajectory', '/history', '/commitments', '/']) {
      expect(guestRouteFor(route).href).toBe('/experiences');
    }
  });

  it('always returns a route that is reachable without a session', () => {
    const anonymous = new Set([
      '/life-bingo',
      '/bucket-list',
      '/timeline/new',
      '/experiences',
      '/journal',
      '/habits',
    ]);
    for (const route of [
      '/journal',
      '/habits',
      '/bucket-list',
      '/timeline',
      '/settings',
      '/anything',
    ]) {
      expect(anonymous.has(guestRouteFor(route).href)).toBe(true);
    }
  });
});

describe('Hub login continuity', () => {
  it('accepts only the exact legacy Hub intent and gives callbackUrl precedence', () => {
    expect(safeCallbackUrl(undefined, '/hub')).toBe('/hub');
    expect(safeCallbackUrl(undefined, 'https://evil.example')).toBe('/bucket-list');
    expect(safeCallbackUrl('/journal', '/hub')).toBe('/journal');
    expect(guestRouteFor('/hub').href).toBe('https://significanthobbies.com/');
  });
  it.each([
    '/\\evil.example',
    '/%5cevil.example',
    '/%2fevil.example',
    '/%0a/evil.example',
    '/login',
    '/login?callbackUrl=/hub',
    '/%',
  ])('rejects normalization or loop hazards: %s', (value) => {
    expect(safeCallbackUrl(value)).toBe('/bucket-list');
  });
});
