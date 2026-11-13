import { isLiveHost } from './live-origins.mjs';
import { isHubServicePath } from './hub-routing.mjs';

const PROTOCOL_HEADERS = [
  'Cookie',
  'Authorization',
  'cf-access-jwt-assertion',
  'RSC',
  'next-router-state-tree',
  'next-router-prefetch',
  'next-router-segment-prefetch',
  'Next-Action',
  'Next-Url',
  'x-fleet-markdown-source',
  'If-None-Match',
  'If-Modified-Since',
  'If-Match',
  'If-Unmodified-Since',
  'Range',
  'If-Range',
];

export function createNotFoundAssetHandler(authority) {
  if (!authority) return async () => null;
  const knownPaths = new Set(authority.knownPaths);
  const matchers = authority.routeRegexes.map(
    (expression) => new RegExp(expression, authority.caseSensitive ? '' : 'i')
  );
  return async (request, env) => {
    const url = new URL(request.url);
    if (!eligibleRequest(request, url) || !env.ASSETS) return null;
    if (knownPaths.has(url.pathname) || matchers.some((matcher) => matcher.test(url.pathname)))
      return null;
    let asset;
    try {
      asset = await env.ASSETS.fetch(
        new Request(new URL(authority.assetPath, request.url), request)
      );
    } catch {
      return null;
    }
    if (asset.status !== 200 || !asset.headers.get('Content-Type')?.includes('text/html')) {
      await asset.body?.cancel();
      return null;
    }
    const headers = new Headers(asset.headers);
    headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
    headers.set('ETag', authority.etag);
    headers.set('Vary', authority.vary);
    headers.set('x-edge-cache', 'NOT-FOUND-ASSET');
    return new Response(request.method === 'HEAD' ? null : asset.body, {
      status: 404,
      headers,
    });
  };
}

function eligibleRequest(request, url) {
  return (
    ['GET', 'HEAD'].includes(request.method) &&
    (isLiveHost(url.hostname) || ['localhost', '127.0.0.1'].includes(url.hostname)) &&
    !url.search &&
    ordinaryHtml(request) &&
    ordinaryPath(url.pathname) &&
    noProtocolHeaders(request)
  );
}

function noProtocolHeaders(request) {
  return (
    !PROTOCOL_HEADERS.some((header) => request.headers.has(header)) &&
    ![...request.headers.keys()].some((header) => /^x-(?:nextjs|middleware|invoke)-/.test(header))
  );
}

function ordinaryHtml(request) {
  const accept = request.headers.get('Accept')?.toLowerCase() ?? '*/*';
  return (
    (accept.includes('text/html') || accept.includes('*/*')) &&
    !accept.includes('text/markdown') &&
    !accept.includes('text/x-component')
  );
}

function ordinaryPath(pathname) {
  return (
    !isHubServicePath(pathname) &&
    /^\/[A-Za-z0-9._~!$&'()+,;=:@/-]+$/.test(pathname) &&
    !pathname.includes('//') &&
    !pathname.endsWith('/') &&
    !/\.(?:md|rsc)$|\.segments(?:\/|$)/i.test(pathname) &&
    !/^\/(?:api|_next|_astro|cdn-cgi|\.well-known)(?:\/|$)/i.test(pathname)
  );
}
