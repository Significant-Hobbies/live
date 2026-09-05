export const HUB_HOSTS = new Set(['significanthobbies.com', 'www.significanthobbies.com']);
export const LIVE_HOST = 'live.significanthobbies.com';

/**
 * Crawler and agent contract files owned by the apex itself.
 *
 * These are the files a crawler or an LLM reads to work out what
 * `significanthobbies.com` *is*. Redirecting them to `live.` handed the whole
 * hub's identity — and its only crawl path — to one of the six apps it hosts,
 * and left the apex advertising a sitemap on a foreign host. They are served
 * by the Hub service instead. Content paths are unaffected and still move
 * permanently to the canonical Live host.
 *
 * Background: Significant-Hobbies/live#7 and
 * Significant-Hobbies/significanthobbies#148. The bodies are served by the
 * personal-platform Worker (significanthobbies repo, services/hub-backend).
 */
export const HUB_AGENT_CONTRACT_PATHS = [
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/llms-full.txt',
  '/index.md',
  '/api/ai',
  '/api-ai.json',
  '/.well-known/security.txt',
];

const HUB_SERVICE_EXACT_PATHS = new Set([
  '/',
  '/hub',
  '/health',
  '/mcp',
  ...HUB_AGENT_CONTRACT_PATHS,
]);
const HUB_SERVICE_PREFIX_PATHS = ['/.well-known/agent-skills/'];
const PERSONAL_PLATFORM_INTERNAL_HOST = 'personal-auth.internal';
export const PERSONAL_PLATFORM_INTERNAL_HEADER = 'X-Personal-Platform-Internal';

export function isHubServicePath(pathname) {
  return (
    HUB_SERVICE_EXACT_PATHS.has(pathname) ||
    pathname.startsWith('/v1/') ||
    HUB_SERVICE_PREFIX_PATHS.some((prefix) => pathname.startsWith(prefix))
  );
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
