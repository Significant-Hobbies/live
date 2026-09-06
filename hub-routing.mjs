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
 * Legacy apex paths whose name changes, not just its host, when it moves to
 * Live. `/hub-opengraph-image` is the social-preview image the apex's own
 * OG tags reference (rendered by the Hub Backend's HTML) — it was never a
 * route under that name on Live, only Next's App Router convention path
 * `/opengraph-image` generates the image. The identity redirect every other
 * apex path gets therefore sent crawlers to a same-named path that 404s
 * (Significant-Hobbies/live#10). Map the alias to its real target instead of
 * teaching Live to answer a name nothing else calls it by.
 */
const LEGACY_LIVE_PATH_ALIASES = new Map([['/hub-opengraph-image', '/opengraph-image']]);

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
  target.pathname = LEGACY_LIVE_PATH_ALIASES.get(url.pathname) ?? url.pathname;
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
