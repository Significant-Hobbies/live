// App-Health endpoint telemetry: per-route method/status/duration shipped to
// the ingest collector. Dependency-free — the ingest wire format is a single
// POST. Silent no-op until APP_HEALTH_INGEST_KEY is set (secret, not vars: a
// same-name vars entry replaces the secret on deploy). Telemetry can never
// fail a request. Paths collapse to route templates — raw ids/slugs never
// leave the worker.

const INGEST_ENDPOINT = 'https://ingest.sassmaker.com/v1/ingest';
const LOGS_ENDPOINT = 'https://ingest.sassmaker.com/v1/logs';

function routeFor(pathname) {
  const p = pathname.replace(/\/+$/, '') || '/';
  const mcpDyn = p.match(/^\/api\/mcp\/(experiences|timelines)\/[^/]+$/);
  if (mcpDyn) return `/api/mcp/${mcpDyn[1]}/:id`;
  if (p.startsWith('/api/')) return p.length <= 64 ? p : null;
  const dyn = p.match(
    /^\/(b|blog|bucket-list|bucket-lists|experiences|hobbies|people|timelines|quests|places|compare-journeys|u|p)\/[^/]+/
  );
  if (dyn) return `/${dyn[1]}/:slug`;
  return p.length <= 48 ? p : null;
}

export function observeRequest(request, response, durationMs, env, ctx, cold = 0) {
  const key =
    typeof env?.APP_HEALTH_INGEST_KEY === 'string' ? env.APP_HEALTH_INGEST_KEY.trim() : '';
  const route = routeFor(new URL(request.url).pathname);
  if (!key || !route) return;
  const batch = {
    batch_id: crypto.randomUUID(),
    schema_version: 'v1',
    runtime: 'worker',
    environment: 'production',
    events: [
      {
        event_id: crypto.randomUUID(),
        timestamp: Date.now(),
        method: request.method,
        route,
        status_code: response.status,
        duration_ms: Math.max(0, Math.round(durationMs)),
      },
    ],
  };
  try {
    ctx.waitUntil(
      fetch(INGEST_ENDPOINT, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(batch),
      }).catch(() => undefined)
    );
  } catch {
    // Telemetry must never take down the request path.
  }
  try {
    if (
      !['GET', 'HEAD'].includes(request.method) ||
      !(
        route === '/' ||
        route.startsWith('/api/') ||
        response.headers.get('content-type')?.includes('text/html')
      )
    )
      return;
    const configuredRate = Number(env.APP_HEALTH_STAGE_SAMPLE_RATE ?? 0.1);
    const rate = Number.isNaN(configuredRate) ? 0.1 : Math.max(0, Math.min(1, configuredRate));
    if (Math.random() >= rate) return;
    const edgeCache = response.headers.get('x-edge-cache');
    const colo = request.cf?.colo;
    ctx.waitUntil(
      Promise.resolve()
        .then(() =>
          fetch(LOGS_ENDPOINT, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              authorization: `Bearer ${key}`,
            },
            body: JSON.stringify({
              batch_id: crypto.randomUUID(),
              schema_version: 'v1',
              environment: env.APP_HEALTH_ENVIRONMENT?.trim() || 'production',
              logs: [
                {
                  log_id: crypto.randomUUID(),
                  timestamp: Date.now(),
                  event: 'api.stage_timing',
                  level: 'debug',
                  props: {
                    route,
                    status: response.status,
                    total_ms: Math.max(0, Math.min(600000, Math.round(durationMs))),
                    edge_cache: edgeCache === 'HIT' || edgeCache === 'MISS' ? edgeCache : 'NONE',
                    inner_cache: 'NONE',
                    colo:
                      typeof colo === 'string' && /^[A-Za-z0-9]{1,8}$/.test(colo)
                        ? colo
                        : 'unknown',
                    cold,
                  },
                },
              ],
            }),
          })
        )
        .catch(() => undefined)
    );
  } catch {
    // Stage telemetry must never take down the request path.
  }
}
