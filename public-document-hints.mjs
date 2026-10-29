import { isLiveHost } from './live-origins.mjs';
import { isPublicAgentDocumentPath, markdownPathFor } from './agent-route-markdown.mjs';

// Response-only metadata: preserve HTML bytes and all private/Hub routing.
export function withPublicDocumentHints(handler) {
  return async (request, env, ctx) => {
    const response = await handler(request, env, ctx);
    const url = new URL(request.url);
    if (
      !(isLiveHost(url.hostname) || ['localhost', '127.0.0.1'].includes(url.hostname)) ||
      !['GET', 'HEAD'].includes(request.method) ||
      response.status !== 200 ||
      !response.headers.get('content-type')?.includes('text/html') ||
      url.pathname.startsWith('/u/') ||
      !isPublicAgentDocumentPath(url.pathname)
    )
      return response;
    const headers = new Headers(response.headers);
    const vary = new Set(
      (headers.get('Vary') || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    );
    if (![...vary].some((item) => item.toLowerCase() === 'accept')) vary.add('Accept');
    headers.set('Vary', [...vary].join(', '));
    headers.append(
      'Link',
      `<${markdownPathFor(url.pathname)}>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"; type="text/plain", </api/ai>; rel="service-desc"; type="application/json"`
    );
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}
