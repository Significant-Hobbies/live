## Why

The product has accumulated several good tools but asks people to understand its internal feature map before they receive value. Simplifying the private product to Today, Live More, Daily, and History gives every destination one human question and turns onboarding into a coherent path from past experience to future intention to present practice.

## What Changes

- Preserve anonymous `/` as a colorful public inspiration surface for editorial content, hobby and experience possibilities, and public profiles.
- Make authenticated `/` the Today home: finite-time context, one quote, today's journal, habit check-ins, and the next bucket-list action.
- Establish `/live-more` as the canonical possibility surface for the bucket list, active yearly goals, Life Bingo, Side Quests, and a substantial internal discovery engine that shows the breadth of what is possible.
- Establish `/daily` as the private practice surface for today's journal, past entries, habits, habit management, and humane tracking without scores.
- Establish `/history` as the reflective surface for the image-rich personal timeline, Life in Weeks, life-so-far reflection, and Trajectory.
- Remove the unused `/dashboard`, `/life-plan`, and `/look-back` compatibility routes rather than maintain parallel destinations.
- Rebuild onboarding as a resumable, mobile-first journey: editable identity and exact date of birth, a skippable emotional frame with optional YouTube music choices, past hobbies/timeline, a balanced popular shelf plus a searchable 5,000+ path catalog with numbered-list paste, one or more independent yearly goals, an optional daily habit, and an initial Trajectory.
- Use the Google account name when available while allowing correction; anonymous/local mode asks for a name.
- Show real sample-profile and recommendation content before asking for personal input. Do not require monthly planning during onboarding.
- Make internal discovery draw from the full owned hobby and experience corpus, explain recommendation fit, and support save, dismiss, bucket-list, and Side Quest actions in context.
- Keep Bingo and Side Quests as ways to act on Live More rather than top-level products.

## Capabilities

### New Capabilities

- `personal-home-routing`: Public/private root behavior and the canonical Today, Live More, Daily, and History ownership model.
- `daily-operational-practice`: Journal-first Daily hierarchy, journal look-back, and low-friction habit management.
- `activation-onboarding`: A resumable past-to-future-to-present activation journey that creates useful initial state.
- `exact-life-date`: Exact date-of-birth capture, validation, calculation, and storage.
- `bucket-list-workspace`: A consolidated private bucket-list workspace surfaced inside Live More.

### Modified Capabilities

- `first-public-timeline`: Onboarding now creates a lightweight private life timeline from remembered hobbies; publication remains explicit and later.
- `local-first-persistence`: All onboarding state follows the shared account/local storage authority.

## Impact

- Affects root request routing, onboarding, `/live-more`, `/daily`, `/history`, route removal, navigation, footer, bucket-list summaries, timeline entry points, Trajectory entry points, and their responsive tests.
- Reuses existing timeline, bucket-list, habit, journal, trajectory, recommendation, and public-profile models.
- The exact birth-date profile field remains an additive tracked D1 migration; production migration and deployment remain operator-owned.
- No new production dependency, public-by-default behavior, habit score, monthly goal system, or social feed is introduced. Yearly goals reuse bucket-list target state rather than introducing a separate planning model.
