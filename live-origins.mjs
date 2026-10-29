// Canonical public identity and exact serving aliases are separate contracts.
// Keep the old origin serving: its cookies and guest IndexedDB are origin-local.
export const LIVE_CANONICAL_HOST = 'significanthobbies.com';
export const LIVE_ALIAS_HOST = 'live.significanthobbies.com';
export const LIVE_ORIGIN = `https://${LIVE_CANONICAL_HOST}`;
export const LIVE_HOSTS = [LIVE_CANONICAL_HOST, LIVE_ALIAS_HOST];
export const LIVE_ORIGINS = LIVE_HOSTS.map((host) => `https://${host}`);
export function isLiveHost(hostname) {
  return LIVE_HOSTS.includes(hostname);
}
