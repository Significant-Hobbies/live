export const HUB_HOSTS = new Set(['significanthobbies.com', 'www.significanthobbies.com']);

const HUB_SERVICE_EXACT_PATHS = new Set(['/', '/hub', '/health', '/mcp']);
const PERSONAL_PLATFORM_INTERNAL_HOST = 'personal-auth.internal';
export const PERSONAL_PLATFORM_INTERNAL_HEADER = 'X-Personal-Platform-Internal';

export function isHubServicePath(pathname) {
  return HUB_SERVICE_EXACT_PATHS.has(pathname) || pathname.startsWith('/v1/');
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
