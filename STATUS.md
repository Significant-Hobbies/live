# STATUS — significanthobbies

> Short live-status view. Detailed historical status log preserved at
> [`docs/knowledge/archive/project-status-2026-07-13.md`](docs/knowledge/archive/project-status-2026-07-13.md).
> Update this file when the objective, active work, blockers, or next steps
> change. Do not let deploy-version snapshots accumulate here — put those in
> the archive.

Last updated: 2026-07-25

## Objective

Ship and operate **significanthobbies** — a life planner with two dimensions
(Daily + Living) — at `significanthobbies.com` on Cloudflare Workers. The
mortality frame (life grid, manifesto) connects both dimensions. The journal
is the bridge between daily practice and life aspirations.

## Current state

- **Runtime:** Cloudflare Worker `significanthobbies` (OpenNext) + Astro
  landing overlay for anon `GET /`. Turso (libSQL) + Drizzle ORM +
  better-auth Google OAuth. PostHog analytics.
- **Two dimensions shipped:** Daily ritual (`/daily` — AM/PM prompts, habits,
  compulsory journal) and Living (timelines, bucket lists, side quests,
  public profiles, SEO blog, discovery quiz).
- **Journal reader built locally:** `/daily` now pairs today's AM/PM writing
  with a private, read-only 21-day date rail. The rail communicates only
  whether writing exists — no totals, streaks, scores, or entry-length
  comparisons. No schema change; production deployment remains operator-owned.
- **Discovery:** the hobby quiz (`/find-your-hobby`) is the single primary
  discovery UX (2026-07-03). The other three surfaces (`/hobbies`, `/explore`,
  `/journeys`) are hidden from homepage/nav/footer; code intact, reachable
  via deep links/SEO/cross-links.
- **Content flywheel:** versioned JSON content packages + CLI shipped on a
  branch; pending cross-repository OpenSpec verification and merge. The
  canonical package document is intentionally empty until topics are selected.
- **Docs:** consolidated into a canonical `docs/` tree with Blume as the
  presentation layer.
- **Product cleanup (2026-07-25):** an audit found several surfaces that looked
  like features but were not. Removed the arcs façade (table never written,
  `/arcs` permanently empty, and it fed wrong numbers to the insights panel) and
  five badges no evaluator could award. Fixed the day-boundary bug (`dayDate`
  was resolved in UTC despite being documented user-local), made habit cadence
  real, closed two privacy leaks, and wired two implemented-but-uncalled actions
  (`syncQuestProgress`, `closeEra`). Detail in
  [`docs/knowledge/learnings.md`](docs/knowledge/learnings.md).

## Active work

- **Schema changes pending application.**
  `drizzle/0003_visibility_and_timezone.sql` adds `Commitment.visibility`,
  `UserQuest.visibility`, and `User.timezone`. Hand-written to match this repo's
  convention; **not applied to any database**. The visibility defaults are what
  stop existing commitments and quests being published without consent, so this
  needs to land before the next deploy.
- **Do not run `pnpm db:generate`.** The `drizzle/meta` snapshot only knows
  migration 0000, so it emits `CREATE TABLE` for tables that already exist in
  production and `ADD COLUMN` for columns that already exist. Migrations here are
  hand-written. Reconciling the snapshot is open work.

## Blockers

- **7-day PostHog quiz-funnel evidence** has not been supplied in-repo;
  closure of the discovery-path decision cannot be marked complete without
  the operator readout. See
  [`docs/product/discovery-funnel.md`](docs/product/discovery-funnel.md).
- **Content-flywheel branch** pending cross-repository OpenSpec verification
  before merge.

## Next steps

1. Apply `drizzle/0003_visibility_and_timezone.sql` to dev and production.
2. Capture the 7-day PostHog quiz-funnel result, then freeze the winning
   discovery path and pause feature development.
3. Review and merge the content-flywheel branch after OpenSpec verification.
4. **Make the journal an actual bridge.** `journalEntries` has no foreign key
   beyond `userId`, so the product's headline claim is copy rather than code.
   Adding an optional hobby/timeline/commitment reference to a journal entry is
   the single highest-leverage change available: it makes the thesis true and
   gives every other surface something to connect to. See
   [`docs/product/overview.md`](docs/product/overview.md).
5. Fix reachability before building anything new. Logged-in nav offers only
   `/dashboard`, `/commitments`, `/trajectory`; `/daily` is linked from the
   footer alone, `/bucket-list` only from inside itself, and `/life-plan` and
   `/timelines/recent` from nowhere at all. Several built features are
   effectively unreachable.
6. Tighten the first-time user journey to a meaningful public timeline.
7. Wire habits ↔ commitments (optional explicit link, no auto-link by default).
8. Decide whether the social layer earns investment. `follows` is a vanity
   counter — no follower list, no feed, and no notification of any kind exists
   in the codebase, so a like, comment, or follow is silently discarded. Either
   ship notifications or stop presenting these as social features.

## Unresolved questions

- Will the quiz funnel validate as the primary discovery path, or does one of
  the hidden surfaces need to be re-surfaced? (Blocked on PostHog readout.)
- Should the content-flywheel canonical package document be populated before
  or after the branch merge? (Pending topic selection.)
- Should the `Arc` table and `UserQuest.arcId` be dropped? All arcs runtime code
  is gone. The columns were retained to avoid a destructive migration, and
  `docs/architecture/data-model.md` describes them as preserving legacy data —
  but nothing ever wrote `arcId`, so there is no legacy data to preserve. The
  retention is defensible; the stated reason is not.
- Should `dailyCheckins` be retired? `amCompleted`/`pmCompleted` nearly duplicate
  "the matching journal entry is non-empty", but not exactly: writing an AM entry
  in the evening leaves `amCompleted` false. Deriving would change what the AM/PM
  rings mean, so this needs a product call rather than a refactor.

Trajectory is built and documented in
[`docs/product/trajectory.md`](docs/product/trajectory.md) (including the three
pieces of its design that were deliberately not built). Not yet deployed —
production deploy is operator-owned.

## Deploy fingerprint

- **Worker:** `significanthobbies` (prod) / `significanthobbies-preview` (PR)
- **Routes:** `significanthobbies.com/*`, `www.significanthobbies.com/*`
- **Deploy trigger:** manual `workflow_dispatch` on `.github/workflows/deploy.yml`
- **DB:** Turso `significanthobbies` (libSQL)
