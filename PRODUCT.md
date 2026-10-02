# Product

<!-- impeccable:product-schema 1 -->

## Platform

web and iOS

## Users

Adults who want to live more intentionally use the Significant Hobbies family
to discover interests, write privately, build repeatable practices, and shape
longer-lived plans.
Signed-out visitors can explore the mortality frame, discovery content, and
explicitly public Living surfaces before choosing whether to create an account.

## Product Purpose

Significant Hobbies helps a person name the life they want to live and walk
toward it — a family of focused personal products:

- **Significant Hobbies** is the read-only directory and future dashboard.
- **Live** leads with a searchable catalog of bucket-list ideas and side quests,
  a personal list, and optional Life Bingo boards.
- **Weekly log** owns the private weekly record of what the user actually
  lived: one editable entry about the previous week. Earlier weekly and AM/PM
  entries remain readable as archive.
- **Habits** owns simple, non-scoring practice check-ins.
- **Life in weeks** keeps time in perspective with weeks lived and estimated
  weeks remaining. Existing History and planning records remain available.

The mortality frame connects the family by making finite time concrete — the
roughly 4,000 weeks an average life holds. Success means helping a person
notice what matters, return to it, and keep a truthful record without turning
reflection into competition.

## Positioning

The family turns passive wanting into a life the user deliberately imagines,
plans, and records. It is not a generic productivity suite or social feed:
weekly-log writing stays private, Live publication is opt-in per item, and
progress systems are limited to surfaces where proof is the explicit job.

## Operating Context

- Live is canonical at `live.significanthobbies.com`. Every Live page, API,
  discovery document, and generated URL belongs to that host.
- The apex `significanthobbies.com` is the separately owned Significant Hobbies
  Hub, and legacy apex Live paths permanently redirect to the same path on the
  Live host. The host split is specified in
  [`docs/architecture/overview.md`](docs/architecture/overview.md).
- Signed-out `/` serves the preserved Live landing with a catalog call to
  action. A session-bearing request enters `/bucket-list`; the application
  still validates the session before choosing account or local storage.
- Primary navigation is Catalog (`/experiences`), My list (`/bucket-list`),
  Weekly journal (`/journal`), Habits (`/habits`), and Life in weeks
  (`/life-in-weeks`). Core work does not require biography onboarding.
- `/onboarding` redirects to My list. `/daily`, the hobby quiz, Dream Atlas,
  timelines, commitments, trajectory, and History remain compatibility or
  secondary routes; they are not the primary journey.
- Cloudflare Workers/OpenNext serves the application; Cloudflare D1 stores
  authenticated application data through Drizzle. Signed-out private work
  remains in IndexedDB on the canonical Live origin.
- Production database migrations and deployments are manual and
  operator-owned.

## Capabilities and Constraints

- Weekly-log writing has no public visibility field or sharing API.
- Habits are boolean check-ins with no score, streak, XP, or shame loop.
- Commitments are separate hobby-specific goals with optional public
  visibility, proof stamps, and commitment-only streak badges.
- Reuse the existing visual design. Simplification removes steps and competing
  features instead of introducing a new shell, theme, or dashboard.
- Anonymous marketing and tool HTML follows the existing Astro/Worker cache
  boundary.
- The Hub has no shared database, summaries, assistant, or write actions in V1.
- Existing private data must survive target deletion and reversible product
  changes.

## Brand Commitments

The established name is Significant Hobbies. The documented voice is a wise
friend who has lived well and wants the same for the user: encouraging,
specific, grounded, and never gamified or shaming.

## Evidence on Hand

Current product truth is recorded in `PROJECT_STATUS.md`; product and
architectural decisions live under `docs/product/` and `docs/architecture/`.
The repository contains real hobby, experience, and sample-preview content.
No testimonials, customer counts, or external benchmark claims are established
and none should be invented.

## Product Principles

1. Let Live, the weekly log, and Habits own distinct jobs while preserving
   explicit links between related records.
2. Keep private work private and publication explicitly opt-in.
3. Let the mortality frame create urgency without scoring or shame.
4. Prefer one focused discovery path over multiplying surfaces.
5. Preserve user writing and history through safe, additive changes.

## Accessibility & Inclusion

Core flows must remain keyboard accessible, responsive, readable with reduced
motion, and understandable without color alone. Discovery data includes
cross-cutting needs such as gentle versus active activities so people with
different mobility, energy, and life stages are not silently excluded.
