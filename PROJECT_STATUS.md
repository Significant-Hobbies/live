# Live — PROJECT STATUS

Last updated: 2026-09-11

## Why / What

Live is the web product for building a life around hobbies, experiences, plans,
and the history that accumulates behind them. It combines discovery with a
local-first and signed-in record of bucket lists, commitments, timelines, and
side quests.

## Current status

- Canonical source: `Significant-Hobbies/live`.
- Extracted with full Significant Hobbies history on 2026-08-23.
- Runtime remains the existing `significanthobbies` Cloudflare Worker.
- Authenticated records remain in the existing Significant Hobbies D1;
  signed-out private records remain in IndexedDB on the canonical Live origin.
- Every Live page, API, discovery document, and generated URL is canonical at
  `https://live.significanthobbies.com`.
- Apex `/`, `/hub`, `/health`, `/mcp`, and `/v1/*` delegate to the separately
  owned Hub through the `personal-platform` service binding. Legacy apex Live
  paths permanently redirect to the same path on the Live host.

## Status and next

Live is actively usable but remains an ongoing product. Continue from observed
usage and improve discovery and long-lived planning on the independent Live
origin.

## Features (shipped)

- The open-world Dream Atlas preserves exact personal dreams, imports existing
  lists, shows confidence-only native coverage, and opens honest wider-world
  research when Live's own catalogue ends.
- Returning users meet one calling dream and one evidence-labelled first door
  before broader discovery, with local and account storage using the existing
  bucket-item status model.

## Timeline

- **2026-09-11 — Bucket-list entry links repaired:** The start/build controls
  on the idea guide and famous-list pages now open `/bucket-list`, including
  the guest local workspace, instead of returning to the marketing homepage.
  The signed-in "View my bucket list" link uses the same destination. Completing
  onboarding now enters `/live-more` directly, where the saved possibilities
  appear, instead of sending the user back to the marketing page.
  The release workflow uploads and promotes the exact Git revision while
  preserving existing routes, domains, schedules, and dashboard variables;
  ordinary code releases no longer require zone route permissions.

- **2026-09-11 — Owner bucket-list entry gate narrowed:** An authenticated
  owner can open and create a bucket list before completing the broader
  onboarding flow. Bucket-list reads and writes already use the authenticated
  session's owner ID; date of birth remains required only for the separate
  Life in Weeks and profile activation data.

- **2026-09-08 — Release cache repair prepared:** Actual `/hobbies` cache hits
  referenced six missing scripts after a successful deployment. The HTML cache
  now isolates builds by Next build ID, shares GET/HEAD keys, preserves query
  variants and requires browser revalidation. Build metadata is generated with
  the asset bundle; no provider bindings or credentials change. Source 640c7e9 was deployed at 100% traffic; actual `/hobbies` MISS and HIT
  both resolve all 20 scripts. Hosted checking also found Cache API hits rewrite
  browser max-age to four hours; restoring the route policy on hits is prepared
  and requires release verification.

- **2026-09-08 — Canonical sign-in repair prepared:** The actual Live login
  button returned 403 `INVALID_ORIGIN` before Google. Production auth now
  pins its base and callback origin to Live instead of inheriting a legacy
  host setting. Real Better Auth handler regression accepts Live and rejects
  an unrelated browser origin with CSRF/origin checks enabled. Hosted OAuth
  and account persistence remain unqualified in issue #14.

- **2026-09-08 — Local bucket-list save recovery prepared:** Browser storage
  now acknowledges transaction completion, rejects aborted writes, and closes
  its connection after failures. Bucket-list edits retain input and existing
  items on failure, prevent overlapping writes, and offer a visible retry.
  Focused transaction regressions, all 588 unit tests and three mobile browser
  checks pass, including actual IndexedDB abort, retry and reload. Production
  deployment and authenticated personal use remain separate gates.

- **2026-09-01 — Dedicated Clarity project wired locally:** Replaced the
  borrowed Significant Hobbies analytics project with Live's own project and
  product tag. PostHog remains unchanged. TypeScript and the Fleet-wide Clarity
  source audit pass; production deployment is pending the normal release gate.

- 2026-08-28 — Shipped the open-world Dream Atlas and calling-dream loop.
- 2026-08-28 — Made `live.significanthobbies.com` canonical for every Live
  surface while preserving the Hub at the apex and the existing data authority.

Product work belongs in this repository's GitHub Issues.
