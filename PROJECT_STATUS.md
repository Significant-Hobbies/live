# Live — PROJECT STATUS

Last updated: 2026-08-28

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

- 2026-08-28 — Shipped the open-world Dream Atlas and calling-dream loop.
- 2026-08-28 — Made `live.significanthobbies.com` canonical for every Live
  surface while preserving the Hub at the apex and the existing data authority.

Product work belongs in this repository's GitHub Issues.
