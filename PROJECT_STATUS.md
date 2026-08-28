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
  signed-out private records remain in IndexedDB on the compatible apex origin.
- The Live landing remains `https://live.significanthobbies.com`.
- Apex `/`, `/hub`, `/health`, `/mcp`, and `/v1/*` delegate to the separately
  owned Hub through the `personal-platform` service binding. Existing deeper
  apex product routes remain compatibility surfaces for Live, avoiding a data
  or auth migration.

## Status and next

Live is actively usable but remains an ongoing product. Continue from observed
usage, improve discovery and long-lived planning, and gradually move public
links to the Live domain while preserving existing local browser data.

## Features (shipped)

- The open-world Dream Atlas preserves exact personal dreams, imports existing
  lists, shows confidence-only native coverage, and opens honest wider-world
  research when Live's own catalogue ends.
- Returning users meet one calling dream and one evidence-labelled first door
  before broader discovery, with local and account storage using the existing
  bucket-item status model.

## Timeline

- 2026-08-28 — Shipped the open-world Dream Atlas and calling-dream loop.

Product work belongs in this repository's GitHub Issues.
