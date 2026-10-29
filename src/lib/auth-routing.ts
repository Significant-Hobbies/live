import type { BetterAuthOptions } from 'better-auth';
import { LIVE_ORIGIN, LIVE_HOSTS, LIVE_ORIGINS } from '../../live-origins.mjs';

/**
 * Where sign-in sends people, and where it lets them go instead.
 *
 * Auth in this product is optional: it exists to *save* work, not to unlock it.
 * The login page already accepted and validated a `callbackUrl` search param,
 * but every route guard called a bare `redirect('/login')` — so signing in from
 * /trajectory landed you on /dashboard. Auth interrupted you and then lost your
 * place, which is the opposite of the intent.
 *
 * These helpers are pure so the redirect contract is unit-testable; the
 * login page validates untrusted input with the helper below before passing
 * the destination to the authentication provider.
 */

/** Sign-in URL that returns the visitor to `callbackUrl` once authenticated. */
export function loginPath(callbackUrl: string): string {
  return `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}

/** Keep sign-in redirects on this origin and fall back to the personal list. */
export function safeCallbackUrl(value: string | undefined, returnTo?: string): string {
  // Compatibility for the old Hub link is limited to its one destination.
  value ??= returnTo === '/hub' ? '/hub' : undefined;
  if (!value?.startsWith('/')) return '/bucket-list';
  try {
    const decoded = decodeURIComponent(value);
    if (
      decoded.startsWith('//') ||
      Array.from(decoded).some((char) => char === '\\' || char.charCodeAt(0) <= 32)
    )
      return '/bucket-list';
    const target = new URL(value, 'https://significanthobbies.com');
    if (target.origin !== 'https://significanthobbies.com' || target.pathname === '/login') {
      return '/bucket-list';
    }
    return value;
  } catch {
    return '/bucket-list';
  }
}

export type GuestRoute = {
  /** Anonymous surface closest to what the visitor was trying to reach. */
  href: string;
  /** Honest description of what they get without an account. */
  label: string;
};

/** Continue the same task using local storage, without setup or sign-in. */
export function guestRouteFor(callbackUrl: string): GuestRoute {
  if (callbackUrl === '/hub') {
    return { href: '/', label: 'return to Live' };
  }
  if (callbackUrl.startsWith('/bucket-list')) {
    return { href: '/bucket-list', label: 'keep your list on this device' };
  }
  if (callbackUrl.startsWith('/timeline')) {
    return { href: '/timeline/new', label: 'build and export without an account' };
  }
  if (callbackUrl.startsWith('/life-bingo'))
    return { href: '/life-bingo', label: 'build a board without an account' };
  if (callbackUrl === '/journal')
    return { href: '/journal', label: 'write privately on this device' };
  if (callbackUrl === '/habits')
    return { href: '/bucket-list', label: 'keep your list on this device' };
  return { href: '/experiences', label: 'browse the catalog without an account' };
}

/** Resolve OAuth on the incoming allowed origin so its host-only state cookie returns. */
export function authBaseUrl(options: {
  production: boolean;
  configuredUrl?: string;
  testAuthEnabled: boolean;
}): NonNullable<BetterAuthOptions['baseURL']> {
  if (options.production) {
    return { allowedHosts: [...LIVE_HOSTS], fallback: LIVE_ORIGIN, protocol: 'https' };
  }
  return (
    options.configuredUrl?.trim() ||
    (options.testAuthEnabled ? 'http://localhost:3000' : LIVE_ORIGIN)
  );
}

export function authTrustedOrigins(baseURL: NonNullable<BetterAuthOptions['baseURL']>): string[] {
  return [
    ...(typeof baseURL === 'string' ? [baseURL] : LIVE_ORIGINS),
    'https://appleid.apple.com',
    'significanthobbies://auth',
  ];
}
