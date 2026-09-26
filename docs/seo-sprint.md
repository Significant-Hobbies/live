# Live SEO sprint roadmap

Satellite playbook (see `saas-maker/tooling/skills/seo-sprint`). Baseline
(28d ending 2026-09-18): **28 imp · 0 clicks · pos 30 · 7 indexed / 694
pending** — barely indexed, but two query shapes already show striking
distance.

## Evidence

- **Celebrity/notable-people hobbies** — "mark zuckerberg hobbies" pos 13,
  "oprah winfrey hobbies" pos 10, "meryl streep early life" pos 81. Google
  already ranks our people pages page 1–2. This is the wedge.
- **Numbered listicles** — "100 things to be grateful for" / "thankful for"
  pos 67–93, "bucket list before 50" pos 38. Intent-clear, buildable from
  existing experience data.

## Phases

- [ ] **Phase 1 — notable-people hobby pages.** Expand the people surface
  systematically: one well-sourced page per notable person (their actual
  hobbies/interests, cited) targeting "<person> hobbies". Proven demand at
  pos 10–13 — 50 more of these is the fastest path to real clicks.
- [ ] **Phase 2 — numbered list pages.** "N things to be grateful for",
  "bucket list before N", "N hobbies for <audience>" — generated from the
  experience catalog, each with real items not filler.
- [ ] **Phase 3 — category experience pages.** "things to do in <city>",
  "<activity> for beginners" — needs location/category data audit first.
- [ ] **Phase 4 — indexing.** 694 pending churn via the daily agent. Watch
  `indexing status --project live` — experience pages were the biggest
  "URL is unknown to Google" cohort in the first pass.

## Rules

- Sourced facts only on people pages — a hobby claim without a source is a
  credibility landmine.
- Register each phase: `seo-scoreboard.mjs register --project live --lane
  programmatic|editorial --summary "…"`.
