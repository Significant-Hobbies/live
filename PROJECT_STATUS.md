# Live — PROJECT STATUS

Last updated: 2026-08-23

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
- Apex `/` and `/hub` delegate to the separately owned Hub through the
  `personal-platform` service binding. Existing deeper apex routes remain
  compatibility surfaces for Live, avoiding a data or auth migration.

## Status and next

Live is actively usable but remains an ongoing product. Continue from observed
usage, improve discovery and long-lived planning, and gradually move public
links to the Live domain while preserving existing local browser data.

Product work belongs in this repository's GitHub Issues.
