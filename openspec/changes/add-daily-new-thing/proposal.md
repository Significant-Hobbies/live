## Why

The journal asks a person to notice the day, but it does not actively help make the day different. Daily should offer one low-pressure, genuinely new action each day so reflection is paired with lived experience rather than becoming only retrospective writing.

## What Changes

- Add one small “Try something new” invitation beside today’s journal.
- Choose from a curated, local, non-promotional set of micro-experiences that normally fit inside an hour.
- Keep the same invitation stable for the day, while allowing the person to request another.
- Let the person replace the suggestion with their own small intention for the day.
- Let the person mark the invitation done or restore it without scores, streaks, or shame.
- Persist the daily choice and outcome in D1 when signed in and in the existing local Daily record when signed out.
- Show the completed small experience beside the matching past journal entry.
- Rework habits as a calm checklist with simple reversible check-ins; remove
  streaks, bars, and progress decoration from the Daily ritual.
- Treat authenticated `/` as the dashboard reached through the SH logo and
  remove “Today” as a redundant navigation section.
- Keep editorial, possibility, manifesto, and explicitly public profile pages
  external; expose the dashboard, Live More, Daily, and History only after
  onboarding is complete.
- **BREAKING:** remove the unused `/dashboard`, `/life-plan`, and `/look-back` compatibility routes because the product has no external legacy users.

## Capabilities

### New Capabilities

- `daily-new-thing`: Daily selection, replacement, completion, history, and local/account persistence for one small novel experience per calendar day.

### Modified Capabilities

- `local-first-persistence`: Signed-out Daily novelty records join the existing local Daily source of truth and remain eligible for deliberate account import.

## Impact

- Daily server and local data adapters, `DailyRitual`, habit presentation, and Daily browser tests.
- Drizzle schema plus one additive D1 migration; production migration remains operator-owned.
- Existing Side Quest content may inform the curated micro-experience set, but the feature introduces no external service or production dependency.
- Legacy compatibility route files and their redirect tests are removed.
