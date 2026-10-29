---
title: Architecture overview
description: Runtime shape — Cloudflare Worker (OpenNext) + Astro landing overlay + D1/Drizzle + better-auth. Request flow, build pipeline, and the edge cache layer.
---

# Architecture overview

> The runtime shape and the non-obvious pieces. Durable decisions and the why
> behind each live in [`decisions.md`](decisions.md). The data model lives in
> [`data-model.md`](data-model.md).

## Request flow

```
Browser → Cloudflare Worker `significanthobbies` (OpenNext, worker.mjs)
  ├── apex compatibility /hub, /health, /mcp, /v1/*, /landing/* → HUB_SERVICE
  ├── live.significanthobbies.com/hub → HUB_SERVICE (same-origin session)
  ├── www public Live paths → 308 → significanthobbies.com/<path>
  ├── apex or Live alias / → ASSETS /live.html (or signed-in /bucket-list)
  └── apex or Live alias /<path> → OpenNext Next.js 16 App Router handlers
        ├── Existing Cloudflare D1 via Drizzle ORM
        ├── better-auth Google OAuth with same-origin, host-only state cookies
        └── PostHog analytics via posthog-js wrapper
```

`worker.mjs` is a custom Worker entry that wraps OpenNext. For cacheable anon
HTML paths it consults `caches.default` first and only falls through to the
Next handler on a miss — eliminating the Worker cold-start path for warm-cache
hits on marketing/tool pages. Cache headers are explicit (`public, max-age=0,
s-maxage=86400, must-revalidate`) because s-maxage-only was
getting marked DYNAMIC at the zone level.

The cacheable path list lives in `worker.mjs` (`CACHEABLE_EXACT`,
`CACHEABLE_PREFIXES`). Add new public marketing/tool routes there when they
should be edge-cached.

## Astro Live overlay and Hub delegation

`landing-astro/` is a separate Astro package (pnpm workspace member) that
builds the preserved Live landing. The build pipeline overlays it into
`.open-next/assets/`. `worker.mjs` serves `/live.html` at both the canonical
apex root and the existing Live alias root. Session-bearing root requests
enter `/bucket-list`; the application still validates the session.

Public pages, metadata and discovery documents identify Live at
`https://significanthobbies.com`. The old Live alias keeps serving the full app
because cookies and guest IndexedDB records remain origin-local. OAuth resolves
on each supported request origin; it does not transfer cookies or local records.
Only the bounded compatibility routes above delegate to the retired Hub backend.

[`decisions.md`](decisions.md) A1 records the earlier host split; the owner
approved restoring the full Live app to the apex on 29 October 2026.

## Build pipeline

`scripts/cf-build.mjs` orchestrates the deploy build:

1. `next build` (webpack) + `scripts/run-inline-critical-css.mjs` (Beasties
   inlines critical CSS into prerendered HTML).
2. Patches the sparse pnpm store for OpenNext monorepo resolution.
3. `opennextjs-cloudflare` builds into `.open-next/`.
4. `scripts/run-overlay-astro-landing.mjs` overlays the Astro landing into
   `.open-next/assets/`.

`open-next.config.ts` uses `staticAssetsIncrementalCache` so prerendered HTML
(including Beasties-inlined CSS) is served from the assets binding instead of
re-rendering the React tree on every request. Without this override the
runtime re-renders from `page.js` and the inlined CSS is lost. Most routes are
prerendered at build time; a few opt into ISR (`revalidate`) or
`force-dynamic` — see [`decisions.md`](decisions.md) A6 for the exceptions and
the caveat that ISR routes are served from the last build output under this
cache.

## Preview environment

`wrangler.toml` defines an `env.preview` worker (`significanthobbies-preview`)
that deploys to `*.workers.dev` with no production routes. PR deploys use
`wrangler deploy --env preview` so they never touch the prod domain. The
preview env inherits observability and limits but explicitly empties `routes`
to avoid conflicts with the prod worker's production routes and custom domain.

## Storage

- **Cloudflare D1** — exposed to the Worker through the `DB` binding. Local dev
  uses the isolated binding in `wrangler.local.toml`. Drizzle ORM is the only
  access layer; `src/db/schema.ts` is the source of truth.
- **Durable Objects** — re-exported from `worker.mjs` (`DOQueueHandler`,
  `DOShardedTagCache`, `BucketCachePurge`) so wrangler can resolve bindings at
  deploy time. These come from OpenNext; do not redefine them.
- **Workers AI** — `[ai]` binding in `wrangler.toml` (free tier, no API key).
  Used by the Lumi coach weekly review via `getCloudflareContext().env.AI`.

## Auth

better-auth with Google OAuth only. `src/server/auth/config.ts` is the config;
`src/lib/auth.ts` wires it to Drizzle with the schema mapping. Auth tables are
prefixed `auth_` (`auth_user`, `auth_session`, `auth_account`,
`auth_verification`) to avoid case-insensitive collisions with the legacy
PascalCase app tables (`User`, `Account`, `Session`, `VerificationToken`) which
are preserved from the Prisma era and still referenced by app code. See
`src/db/schema.ts` for the full mapping comment.

## Agent indexing surfaces

`agent-edge.mjs` (called from `worker.mjs`) serves `llms.txt`, `llms-full.txt`,
`/api/ai`, and markdown negotiation for agent/LLM crawlers. These are
fleet-standard surfaces — see
`fleet-ops/docs/agent-indexing-standard.md` (in the fleet workspace).
