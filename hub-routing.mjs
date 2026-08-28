export const HUB_HOSTS = new Set(['significanthobbies.com', 'www.significanthobbies.com']);
export const LIVE_HOST = 'live.significanthobbies.com';

const HUB_SERVICE_EXACT_PATHS = new Set(['/', '/hub', '/health', '/mcp']);
const PERSONAL_PLATFORM_INTERNAL_HOST = 'personal-auth.internal';
export const PERSONAL_PLATFORM_INTERNAL_HEADER = 'X-Personal-Platform-Internal';

export function isHubServicePath(pathname) {
  return HUB_SERVICE_EXACT_PATHS.has(pathname) || pathname.startsWith('/v1/');
}

/**
 * Legacy apex Live links move permanently to the canonical Live host while
 * actual Hub routes remain on the apex service binding.
 *
 * @param {URL} url
 * @returns {URL | null}
 */
export function legacyLiveRedirect(url) {
  if (!HUB_HOSTS.has(url.hostname) || isHubServicePath(url.pathname)) return null;

  const target = new URL(url);
  target.hostname = LIVE_HOST;
  target.port = '';
  return target;
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
