---
title: Durable learnings
description: Lessons that constrain significanthobbies — build pipeline, edge cache, OpenNext, Astro overlay, daily ritual merge, discovery funnel. Distilled from shipped work and the archived status log.
---

# Durable learnings

> Distilled from shipped work and
> [`archive/project-status-2026-07-13.md`](archive/project-status-2026-07-13.md).
> These are the lessons that still constrain the current codebase, not the
> historical narrative.

## L1 — The Astro overlay must be rebuilt and redeployed on landing changes

The anon homepage is a static Astro site overlaid into `.open-next/assets/`. It
is not ISR — there is no per-request rendering. Changing landing copy requires
rebuilding the Astro package and redeploying, then purging the edge cache. A
stale overlay is caught by the deploy smoke check (≥5 sections,
`id="lcp-shell"`, `location.replace('/dashboard')`) — see
[`operations/runbook.md`](../operations/runbook.md).

**Applied:** the deploy workflow purges `/` and `www./` after every deploy. If
you hotfix the overlay without a full deploy, purge manually.

## L2 — `run_worker_first = ["/*", "!/"]` is the LCP win

The single most important line in `wrangler.toml` for homepage TTFB. Skipping
the Worker entirely for anon `GET /` eliminates cold-start. Any change to this
pattern must be measured — do not assume invoking the Worker "just to check"
is free. See [`architecture/decisions.md`](../architecture/decisions.md) A1.

## L3 — Edge cache requires an explicit allowlist, not zone-level rules

Cloudflare zone-level Cache Rules were marking s-maxage-only responses as
DYNAMIC. The fix was `caches.default` in the Worker with an explicit
`CACHEABLE_EXACT` / `CACHEABLE_PREFIXES` allowlist. New public marketing/tool
routes must be added to the allowlist in `worker.mjs` or they will not be
edge-cached. See [`architecture/decisions.md`](../architecture/decisions.md) A5.

## L4 — `staticAssetsIncrementalCache` is what makes inlined CSS reach the browser

Without it, the runtime re-renders from `page.js` and Beasties-inlined critical
CSS is lost. This was a non-obvious failure mode — the build produced correct
HTML but the runtime served a re-rendered version. See
[`architecture/decisions.md`](../architecture/decisions.md) A6.

## L5 — Four discovery surfaces split attention; one primary is better

The 2026-07-03 decision to hide three of four discovery surfaces and make the
quiz primary was a measurement-driven consolidation. The hidden surfaces stay
functional (SEO + deep links + cross-links from the quiz result) — only the
main entry points were removed. Do not add a fifth discovery surface. See
[`product/discovery-funnel.md`](../product/discovery-funnel.md).

## L6 — Daily practice deliberately excludes scoring

The product stance is "we don't shame you for missed days." Commitments have
streaks; daily habits do not. See
[`architecture/decisions.md`](../architecture/decisions.md) A4.

## L7 — `prisma/` is a legacy directory name; Drizzle is the ORM

The seed script at `prisma/seed.ts` uses Drizzle, not Prisma. `src/db/schema.ts`
is the source of truth. New contributors and agents repeatedly assume Prisma
from the directory name — correct them. See
[`architecture/decisions.md`](../architecture/decisions.md) A7.

## L8 — better-auth tables are `auth_*`; legacy PascalCase tables are app-owned

The `auth_` prefix avoids case-insensitive collisions with the legacy
`User`/`Account`/`Session`/`VerificationToken` tables (preserved from the
NextAuth era). better-auth reads only the `auth_*` tables; the PascalCase
tables are app-owned and referenced by `Timeline`, `Commitment`, etc. Do not
rename one set to match the other without a coordinated migration. See
[`architecture/data-model.md`](../architecture/data-model.md).

## L9 — `dayDate` is user-local; never resolve it with `toISOString()`

Every `dayDate` column stores a **user-local** `YYYY-MM-DD` key. The obvious
`new Date().toISOString().slice(0, 10)` silently makes it UTC, which on Workers
is the server zone. In Asia/Dubai (UTC+4) that rolled the day at 04:00 local and
kept the AM ritual prompt until 16:00 local, so journalling at 01:00 wrote to the
previous day. The schema comments said "user-local" for months while no timezone
code existed anywhere.

Use `lib/day.ts` — `dayKeyIn(tz)`, `isMorningIn(tz)`, `shiftDayKey(key, n)` —
and read the zone from `users.timezone` (reported by `<TimezoneSync>`).

Two related traps, both real bugs that shipped:

- `new Date(key + 'T00:00:00')` parses in the **server's** local zone, and
  `.toISOString()` then serialises as UTC. Round-tripping a day key through that
  pair can shift it by one in either direction. Do day arithmetic on the string
  with `shiftDayKey`, which is pure.
- Functions that decide "what day is it" internally cannot be corrected by their
  callers. Pass `today` in as a parameter; `habit-utils` and
  `behavioral-insights` both had to be refactored for this.

## L10 — a config value that only renders a label is not a feature

`habits.targetFrequency` accepted `daily | weekdays | 3x_week | 5x_week` and was
used for exactly one thing: looking up a display string. Meanwhile
`computeWeeklyProgress` hardcoded a target of 7 and `computeStreak` demanded
strictly consecutive calendar days. So a `weekdays` habit's streak reset every
Saturday and a `3x_week` habit sat at 3/7 (43%) while perfectly on target — the
picker actively punished three of the four options it offered.

The general shape: **an option the user can select must change behaviour, or it
must not exist.** When auditing, grep every consumer of a config field. If they
all resolve to copy, the feature is decoration.

A corollary from the same pass: a streak is only meaningful in the unit its
cadence is scored in. Day-consecutive streaks are wrong for quota habits, so
`computeStreak` returns `{ count, unit }` and the UI renders `d` or `w`.

## L11 — schema-only features read as shipped; check for a write path

An audit of this repo found several surfaces that looked complete and were not:

- `Arc` had a 294-line action module, a route, and a UI — and **nothing anywhere
  inserted a row**. `/arcs` was permanently empty, and because the insights panel
  read active quests *through* the arcs table, every completion and abandonment
  rate it displayed was silently wrong.
- Five badges were defined with no evaluator, so they were unwinnable.
- `syncQuestProgress` and `closeEra` were fully implemented with **zero callers**.
  Side-quest progress therefore lived only in `localStorage` and died with a
  cache clear.
- `Commitment` and `UserQuest` were rendered on the public profile with **no
  visibility column at all**, so both were published with no way to opt out.

Cheap checks that catch all of these: grep for an `insert` into every table;
grep for callers of every exported action; and for anything on a public surface,
confirm a visibility column exists rather than assuming the query filters.

Fixing one of these has a trap worth knowing. `users.earnedBadges` is written by
two independent systems (side-quest evaluation client-side, commitment streaks in
`logStamp`). Wiring `syncQuestProgress` as written would have overwritten the
column wholesale and erased every streak badge — it now merges, replacing only
the ids in `SIDE_QUEST_BADGE_IDS`. **Before wiring an orphaned writer, check what
else writes its target.**

## L12 — a stale migration snapshot generates confidently wrong SQL

**Fixed 2026-07-25 by baselining.** Kept because the failure mode is quiet and
recurs in any project that mixes `db:push` with generated migrations.

The `drizzle/meta` snapshot only recorded migration `0000`, while the database had
moved far past it: better-auth, life bingo, trajectory, quests, habit columns,
creed/onboarding all arrived via `db:push` or hand-written SQL that was never added
to `_journal.json`. `db:generate` therefore diffed against an ancient baseline and
emitted `CREATE TABLE` for tables that already existed in production and
`ADD COLUMN` for columns that already existed.

The danger is not that it errors — it is that **the output looks like a normal
migration**. It is well-formed SQL with plausible table names, and it only fails
once it reaches a real database.

The fix is a baseline: generate once against the current schema, confirm the diff
is purely additive (**zero `DROP`s** — a `DROP` means the snapshot is *divergent*,
not merely behind, and needs investigating instead), then empty the generated file
and keep only its snapshot. `drizzle/0001_baseline_current_schema.sql` is that
file, and `pnpm db:generate` now reports `No schema changes` against
`src/db/schema.ts`.

Two things worth carrying forward:

- **Baseline against the schema file, not a guess.** `src/db/schema.ts` is the
  source of truth. Before trusting the baseline, verify a real database matches it
  — comparing `PRAGMA table_info` for every table against the columns declared in
  the schema took one script and caught nothing, which is exactly the confirmation
  you want before freezing a snapshot.
- **A stale snapshot cannot see intentionally-retired tables.** `Arc` and
  `DailyCheckin` have no runtime readers but are still declared precisely so a
  generated migration never drops them. Deleting a table from the schema file is
  how you accidentally write a destructive production migration.

Layout and conventions: [`drizzle/README.md`](../../drizzle/README.md).
