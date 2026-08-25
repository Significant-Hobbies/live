---
title: Maintaining this docs system
description: How to edit the significanthobbies docs tree and validate links. Markdown is the source of truth.
---

# Maintaining this docs system

> Rules: Markdown in `docs/` is the source of truth.
> Code and executable config (`wrangler.toml`, `package.json`,
> `src/db/schema.ts`) remain authoritative for implementation details and
> schedules.

## Where things live

See [`index.md`](index.md) for the full map. Canonical homes:

- **Product framing** → `docs/product/`
- **Architecture + durable decisions + data model** → `docs/architecture/`
- **Dev workflow + testing gates** → `docs/development/`
- **Operations + runbooks + jobs + security audit** → `docs/operations/`
- **Durable learnings + failed approaches + study queue** → `docs/knowledge/`
- **Durable research data** → `docs/knowledge/research/`
- **Snapshots (old status and designs)** → `docs/knowledge/archive/`
- **Live status** → `STATUS.md` (repo root, short)
- **Agent bootloader** → `AGENTS.md` (repo root, concise)
- **Public README** → `README.md` (repo root)

## Editing rules

1. **One fact, one home.** If a fact lives in code, link to the code instead of
   restating it. If a fact already has a canonical doc, edit that doc — do not
   add a second home.
2. **Do not duplicate easily-discoverable facts.** Route lists, script names,
   binding config, and schema fields belong in code/`package.json`/
   `wrangler.toml`/`src/db/schema.ts`; docs link to them.
3. **Do not invent information.** Mark unresolved questions explicitly in
   `STATUS.md` → "Unresolved questions".
4. **Preserve snapshots.** `docs/knowledge/archive/` files are snapshots. Do
   not rewrite their bodies to "update" them — update the current doc that
   supersedes them and let the archive stay a snapshot. Each archive file
   carries a banner pointing to its current successor.
5. **Keep pages focused.** Target 150–300 lines per markdown file. Split
   catch-all docs into per-topic pages.
6. **Prefer `git mv`** when reorganizing so rename history is preserved.
7. **Do not create empty folders or placeholder docs.** Every doc must have
   useful content.

## Linking

- Use relative links between docs (`../architecture/decisions.md`, not
  `docs/architecture/decisions.md` from a doc inside `docs/`).
- Link to code with repo-relative paths (`src/db/schema.ts`,
  `worker.mjs`) in backticks for code references, or as links for files worth
  opening.
- The link checker validates relative `.md`/image links and frontmatter. It
  does not fetch external URLs (no network in CI).

## Validation

```bash
# From repo root — check internal markdown links + frontmatter (no deps needed)
node scripts/docs-check-links.mjs
# or
pnpm docs:check

```

CI (`.github/workflows/docs.yml`) runs the link checker on pushes to `main` and
PRs touching `docs/`, `STATUS.md`, `AGENTS.md`, `README.md`,
`scripts/docs-check-links.mjs`, or the workflow itself.

`docs/knowledge/archive/` preserves historical snapshots. Keep archive bodies
stable and update the current document that supersedes them.

## When the live status changes

Update `STATUS.md` (repo root) — it is the short live-status view. When the
detailed status log accumulates deploy-version-specific or dated narrative,
move the old detailed snapshot into `docs/knowledge/archive/` with a dated
filename (e.g. `project-status-YYYY-MM-DD.md`) and a banner. Do not let
deploy-version-specific text accumulate in `STATUS.md`.

## Fleet boundary

This repo follows the fleet agent standard at `../AGENTS.md` (in the fleet
workspace). The fleet standard mandates `PROJECT_STATUS.md` as the durable
status file per project; this repo consolidates that into `STATUS.md` (short)
+ `docs/knowledge/archive/` (detailed snapshots) to avoid two homes for the
same fact. The old `PROJECT_STATUS.md` is archived as
`docs/knowledge/archive/project-status-2026-07-13.md`.
