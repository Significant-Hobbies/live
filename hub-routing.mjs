import { LIVE_ALIAS_HOST, LIVE_CANONICAL_HOST } from './live-origins.mjs';

const HUB_HOSTS = new Set([LIVE_CANONICAL_HOST, `www.${LIVE_CANONICAL_HOST}`]);

// The retired Hub retains only native/auth/sync compatibility, never Live's
// public homepage, crawler identity or retired agent-skill recommendations.
const HUB_SERVICE_EXACT_PATHS = new Set(['/hub', '/health', '/mcp']);
const HUB_SERVICE_PREFIX_PATHS = ['/landing/'];
const PERSONAL_PLATFORM_INTERNAL_HOST = 'personal-auth.internal';
export const PERSONAL_PLATFORM_INTERNAL_HEADER = 'X-Personal-Platform-Internal';

export function isHubServicePath(pathname) {
  return (
    HUB_SERVICE_EXACT_PATHS.has(pathname) ||
    pathname.startsWith('/v1/') ||
    HUB_SERVICE_PREFIX_PATHS.some((prefix) => pathname.startsWith(prefix))
  );
}

/** Old social-image links retain their real route; www is a public alias. */
export function legacyLiveRedirect(url) {
  if (!HUB_HOSTS.has(url.hostname) || isHubServicePath(url.pathname)) return null;
  const isImageAlias = url.pathname === '/hub-opengraph-image';
  if (url.hostname === LIVE_CANONICAL_HOST && !isImageAlias) return null;
  const target = new URL(url);
  target.hostname = LIVE_CANONICAL_HOST;
  target.port = '';
  if (isImageAlias) target.pathname = '/opengraph-image';
  return target;
}

/**
 * The Hub Backend's router only registers GET handlers for hub-service
 * paths (`/`, `/health`, the agent-contract files, ...); anything else falls
 * through to its authenticated `/v1/*` routes and answers a HEAD probe with
 * 401 instead of the 200 a GET receives (Significant-Hobbies/live#10). HEAD
 * must be observably identical to GET minus the body, so run it as GET
 * against the backend and let the caller drop the body afterward instead of
 * teaching that router about HEAD.
 *
 * @param {Request} request
 * @returns {Request}
 */
export function hubServiceRequest(request) {
  return request.method === 'HEAD' ? new Request(request, { method: 'GET' }) : request;
}

export function markPersonalPlatformInternalRequest(request) {
  const url = new URL(request.url);
  const isTrustedInternalRequest =
    url.hostname === PERSONAL_PLATFORM_INTERNAL_HOST &&
    url.pathname.startsWith('/api/personal-platform/');
  const suppliedMarker = request.headers.has(PERSONAL_PLATFORM_INTERNAL_HEADER);

  if (!isTrustedInternalRequest && !suppliedMarker) return request;

  const headers = new Headers(request.headers);
  if (isTrustedInternalRequest) {
    headers.set(PERSONAL_PLATFORM_INTERNAL_HEADER, '1');
  } else {
    // A public caller cannot promote itself to a trusted service-binding request.
    headers.delete(PERSONAL_PLATFORM_INTERNAL_HEADER);
  }
  return new Request(request, { headers });
}

/** Only the private Hub page also runs on Live's authenticated origin. */
export function shouldDelegateHub(url) {
  return (
    (HUB_HOSTS.has(url.hostname) && isHubServicePath(url.pathname)) ||
    (url.hostname === LIVE_ALIAS_HOST && url.pathname === '/hub')
  );
}

/** Preserve host-only cookies and keep private successes, redirects and errors uncached. */
export async function fetchHubRoute(request, env) {
  const url = new URL(request.url);
  if (!shouldDelegateHub(url)) return null;
  let response;
  try {
    response = env.HUB_SERVICE
      ? await env.HUB_SERVICE.fetch(hubServiceRequest(request))
      : new Response('The Hub is temporarily unavailable. Please try again.', { status: 503 });
  } catch {
    response = new Response('The Hub is temporarily unavailable. Please try again.', {
      status: 502,
    });
  }
  const headers = new Headers(response.headers);
  if (url.pathname === '/hub') {
    headers.set('Cache-Control', 'private, no-store');
    headers.set('CDN-Cache-Control', 'no-store');
    headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return new Response(request.method === 'HEAD' ? null : response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
