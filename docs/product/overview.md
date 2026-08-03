---
title: Product overview
description: SignificantHobbies — a life planner with two dimensions (Daily + Living). Product thesis, users, brand, design principles, and the mortality frame.
---

# Product overview

> A life planner with two dimensions. **Daily** (private): one ritual page with
> AM/PM prompts, habit check-ins, a journal entry, and one optional small new
> thing to try. **Living**
> (opt-in public): hobby discovery, timeline builder, bucket lists, side
> quests, SEO blog, and public user profiles. The mortality frame (life grid,
> manifesto) connects both dimensions.

## Register

product

## Users

People in their 20s–40s who feel the pull of unlived experiences — curious about their own hobbies, dimly aware of their bucket list, but without a structured place to track either. They open the app in a reflective moment: a Sunday evening, a birthday, a slow week at work. They're not productivity obsessives. They're people who sense that life is going faster than they planned and want to be more intentional about it. Secondary users are people who discover the app through SEO ("famous bucket lists", "hobby quiz") and convert through inspiration.

## Product Purpose

A companion for living intentionally — helping people discover their hobbies, build their bucket list, and track a life worth remembering. The core loop is: discover what is possible → save what feels alive → take one small step → reflect on what changed. The bucket list is the durable centre of the Living dimension: it answers “what do I want to do with my life?” rather than just “what are my hobbies?”

Lumi is the mascot: an amber/gold guiding light. Warm, aspirational, never preachy. "Your guiding light toward a life worth remembering."

## Brand Personality

Purposeful · Warm · Aspirational

Voice: A wise friend who has lived well and wants the same for you. Encouraging without being cheerleader-y. Honest without being blunt. Believes deeply that the unexamined hobby life is not worth living.

Emotional goal: users should feel seen, inspired, and gently nudged — not tracked, graded, or optimized.

## Anti-references

- **LinkedIn / resume trackers**: career-achievement framing, status signaling, cold blues and grays
- **Generic bucket list apps**: clipart checkboxes, holiday-brochure travel photos, "1000 places to see before you die" energy
- **Hustle culture dashboards**: streaks, OKRs, completion rates as performance metrics, red/green gamification overload
- **Overly minimal / cold**: white void, single weight sans, no warmth or character — the "we're serious" design that forgets humans use the product

## Design Principles

1. **Warmth first, function always** — every surface should feel like a thoughtful friend, not a form. But the forms must work perfectly.
2. **Inspire before you capture** — show people what's possible (famous lists, archetypes, suggestions) before asking them to input anything. Inspiration gates capture.
3. **Privacy as default dignity** — bucket list items are private unless the user chooses otherwise. Never make someone feel surveilled by their own app.
4. **Lumi earns her screen time** — the mascot appears at moments of genuine guidance (empty states, first-run, suggestions), not as decoration on every page.
5. **Progress is personal, not performative** — progress bars and completion stats exist to encourage the user, not to rank them against others.

## Accessibility & Inclusion

- WCAG AA minimum. Body text ≥4.5:1, large/bold text ≥3:1.
- Reduced motion support on all animations (globals.css already has prefers-reduced-motion fallbacks).
- Lumi is described via aria-label; decorative instances are aria-hidden.
- Color is never the only signal — category tags use both emoji and text labels.

## Two dimensions

The product merged with `today-little-log` on 2026-07-02 (see
[`knowledge/archive/merge-plan-tll.md`](../knowledge/archive/merge-plan-tll.md)).
The merge produced one coherent thesis:

- **Daily (private):** one `/daily` ritual page — AM/PM prompts, habit
  check-ins (simple, no scoring), journal, and one approachable new thing that
  can be swapped, completed, or left open without becoming another obligation.
  Structurally private: no visibility field, no public API, no sharing.
- **Living (private by default, selectively public):** hobbies, bucket lists,
  side quests, timelines, and public profiles. `/live-more` is the orchestration
  home: the owned list and yearly goals come first, then corpus-backed discovery,
  Life Bingo, and Side Quests. Focused tools remain separate routes.
- **First-use Living loop:** onboarding turns remembered hobbies into a private
  timeline and searches 5,000+ structured paths while accepting a pasted personal
  bucket list. Yearly goals are captured independently, may optionally borrow
  from the bucket list, and collectively become Trajectory direction. A daily habit is optional,
  because episodic goals do not need artificial repetition. A separate owner-only choice is still required
  before a timeline appears on the public profile. See
  [`decisions.md`](../architecture/decisions.md) A13.
- **The journal is the bridge.** A private daily entry can optionally relate to
  one of its owner's timelines or non-abandoned commitments. The relationship
  creates a navigable thread back to the Living plan; it does not create proof,
  progress, scoring, or public activity. See
  [`decisions.md`](../architecture/decisions.md) A12.
- **Habits can point to a commitment.** An owner may explicitly relate one
  private habit to one owned, non-abandoned commitment and change or clear that
  link later. The check-in remains lightweight context: only a deliberate proof
  stamp advances a commitment. See
  [`decisions.md`](../architecture/decisions.md) A14.
- **The mortality frame connects both.** A finite life is the reason daily
  practice and life aspirations both matter. The life grid (`src/lib/mortality.ts`)
  and the manifesto (`/manifesto`) make this concrete. `/history` pairs the life
  grid with an image-capable timeline, Trajectory, and lived reflection.

### Post-onboarding workspace

- **Dashboard (`/` after onboarding):** remaining-time context, one strong quote,
  today's journal, habit check-ins, and one next bucket-list action.
- **Live More (`/live-more`):** bucket list and yearly goals, followed by a
  substantial “discover new things” engine and small-step paths into Bingo and
  Side Quests.
- **Daily (`/daily`):** journal writing and history, one suggested or
  person-authored new thing, and a calm habit checklist without scores.
- **History (`/history`):** the personal timeline, Life in Weeks, life-so-far
  reflection, and Trajectory.

Before onboarding, signed-out visitors retain `/` and public navigation:
editorial stories, the primary hobby quiz, experience possibilities, the
manifesto, and explicitly public profiles. Signed-in incomplete accounts and
private-section attempts continue at `/onboarding`. Once onboarding is complete,
`/` is the local or account dashboard. The SH wordmark returns a person to that
dashboard; there is no separate “Today” navigation item.

### What we deliberately do not do

- No scoring, no streaks on daily practice. "We don't shame you for missed
  days." Habits are simple check-ins.
- No broad social network, paid coaching, marketplace, or creator monetization.
- Public profiles and timelines are shareable artifacts, not social feeds.
  Follow, like, and comment controls were retired on 2026-07-31 because they
  had no notification, discovery, or return loop.
- No large SEO expansion until the core hobby journey loop sharpens.
- No XP. There is no XP concept anywhere in the code and none is planned.
- No badge progression beyond what an evaluator actually awards. Badges exist
  for side-quest counts, category mastery, two specific quests, and commitment
  streaks. Five badges with no evaluator were removed on 2026-07-25 rather than
  left on the profile as an unwinnable promise.

## Discovery — public acquisition and private inspiration

The hobby quiz at `/find-your-hobby` is the single primary discovery UX
(chosen 2026-07-03). The other three discovery surfaces — taxonomy directory
(`/hobbies`), community explore (`/explore`), famous journeys (`/journeys`) —
are hidden from the homepage/nav/footer but their code and routes are intact;
they remain reachable via deep links, SEO pages, and cross-links from the quiz
result. Re-surface only if the 7-day PostHog funnel underperforms.

That public acquisition constraint does not make the signed-in product passive.
Inside `/live-more`, “discover new things” does heavy lifting across the full
experience corpus: it should show breadth, explain why an idea might fit, let a
person dismiss or refresh it, save it directly to the bucket list, or turn it
into a small Side Quest. It complements the quiz instead of becoming another
public top-level discovery destination.

See [`discovery-funnel.md`](discovery-funnel.md) for the funnel measurement
plan.
