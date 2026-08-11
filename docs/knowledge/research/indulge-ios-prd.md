---
title: Indulge iOS product reference
description: Durable research reference for the separate Indulge iOS product and its relationship to Significant Hobbies.
---

# Indulge iOS product reference

> **Boundary:** Indulge is a separate native iOS product in the
> [`Significant-Hobbies/indulge`](https://github.com/Significant-Hobbies/indulge)
> repository. This page preserves the product thesis and the possible research
> relationship to Significant Hobbies. It is not an implementation plan or work
> queue for this repository.

**Reconciled:** 2026-08-11

**Operational tracker:** [Indulge GitHub Issues](https://github.com/Significant-Hobbies/indulge/issues)

**Current product source:** [Indulge `PRODUCT.md`](https://github.com/Significant-Hobbies/indulge/blob/main/PRODUCT.md)

## Product thesis

Indulge helps a person notice one automatic digital escape, decide how much of
it they genuinely want to keep, and trade a modest amount of unchosen time for
something meaningful. The result becomes visible in a persistent life scene.

Success is not abstinence or permanent engagement with the app. Success means:

- intentional indulgence remains available without being labelled failure;
- fewer episodes run longer than the person intended;
- reclaimed time becomes satisfying replacement activity;
- the intervention can eventually be removed while Life and History remain.

The working promise is: keep the indulgence you choose, trade the time you lose,
and see a fuller life take shape.

## Intended user

The product is for people who repeatedly spend longer than intended scrolling,
streaming, gaming, shopping, or browsing and want a private, non-moralizing way
to reclaim some of that time.

It is not clinical addiction treatment. It does not diagnose causes, prescribe
abstinence, score consumption, or use shame, streak loss, sad characters, or
scene decay to retain attention.

## Product principles

1. Trade and limit; never ban by default.
2. Treat intentional extensions as choices, not failures.
3. Express progress as more life rather than less pleasure.
4. Make the replacement easy to choose when the person is tired.
5. Let the visual world explain cause and effect rather than decorate metrics.
6. Preserve dignity and intentional pleasure through graduation.
7. Keep core recording useful offline and without generative features.
8. Never let generated output invent behavioral facts, diagnoses, or advice.

## Core journey

### 1. Private onboarding

The first run builds a local profile from optional identity context, activities
that repeatedly take longer than intended, approximate time, common moments,
need, intentionality, desired life directions, and preferred pace.

The app reflects the stated pattern without a score or diagnosis. A person can
skip optional identity questions. No Indulge account is required.

### 2. See the current pattern

The authored room and character show the selected indulgence as part of an
ordinary adult life. The scene avoids an exaggerated bad-versus-good split.
The person sees what they chose, roughly how much time it can occupy, and the
life directions they want to make more room for.

### 3. Make one trade

One active trade connects a selected indulgence to a modest reclaim target and
one meaningful destination. The person keeps the indulgence while choosing a
small pocket of time to redirect.

The product does not require automatic intervention for this basic loop. Screen
Time integration can make the boundary more convenient, but manual operation
remains the fallback.

### 4. Record Focus interruptions

Focus is a first-class manual journal for attention and recovery. A person can:

- begin a focus session with an optional intention;
- record an interruption before classifying it;
- choose a bounded source and reason;
- record what made returning difficult;
- return to the thread and preserve the recovery interval.

The deterministic summary waits for three complete observations before naming a
pattern. It reports counts and calculated recovery time without productivity
scores or automatic app-switch judgment.

### 5. Watch a life take shape

Life carries the authored character and room from onboarding into daily use.
Trade and Focus evidence can add truthful context, while the visual home remains
stable. History preserves completed actions and observations without inventing
charts or progress that the person did not record.

### 6. Graduate

The intervention is designed to be outgrown. Graduation removes the active
Trade mechanism while preserving Life, Focus, and History as a record of what
the person made room for.

## Primary surfaces

### Life

- Persistent authored room and character.
- The selected pattern and life directions.
- The current trade or first-trade invitation.
- Evidence-grounded reflection after enough Focus observations.
- An optional future-life keepsake created through Apple Image Playground on
  supported devices.

### Focus

- Start, interrupt, classify, return, and finish states.
- Factual daily observation rows.
- A deterministic pattern summary after sufficient evidence.
- Optional bounded on-device suggestions that never override explicit choices.

### Trade

- One active indulgence-to-destination exchange.
- A deliberately modest time target.
- Manual operation as the universal baseline.
- Screen Time capabilities only after their value and privacy boundary are
  understood.

### History

- Private retained actions and observations.
- No fabricated completion, engagement score, or competitive ranking.

## Apple-native architecture boundary

The current product uses SwiftUI and SwiftData and adds optional Apple system
capabilities without making them prerequisites:

- **Foundation Models:** may select a bounded emphasis or suggest bounded tags
  on supported devices. Authored wording and manual classification remain the
  fallback.
- **Image Playground:** presents the Apple system sheet for one optional
  future-life card based only on selected life directions. Generated imagery
  never replaces the authored room.
- **Local Authentication:** an opt-in Privacy Lock uses device-owner
  authentication, including device-passcode fallback, and stores no biometric
  material.
- **Private CloudKit:** the SwiftData schema and development entitlements are
  prepared for private sync. The app remains local-first when the container,
  account, entitlement, or network is unavailable.
- **Screen Time frameworks:** Family Controls, Device Activity, Managed
  Settings, and Managed Settings UI are intended for an authorized convenience
  layer; manual operation remains available.

Private CloudKit provisioning, signed two-device verification, and compatible
physical-device proof for Foundation Models and Image Playground remain
operational work in the Indulge repository. This reference does not claim those
external gates are complete.

## Data and privacy rules

- No Indulge account wall.
- Core recording works offline.
- Raw Screen Time history, selected app names, and selection tokens are not
  uploaded by the product design.
- Generative prompts use bounded typed choices or calculated aggregates; they
  do not need a free-form behavioral dossier.
- Private content is obscured from the app switcher when Privacy Lock is
  enabled, with authentication required after the selected relock interval.
- A person can delete the profile, Focus history, generated reflection, and
  retained future-life card.
- Sign in with Apple and passkeys stay deferred until a real server-side or
  cross-platform identity requirement exists.

## Accessibility and inclusion

The same stylized adult character persists through the journey. Identity
choices are optional and must not be used to infer behavior or prescribe a
different intervention. Growth is expressed through action, environment, and
presence rather than body change or beauty reward.

The experience must remain understandable with Dynamic Type, VoiceOver, Dark
Mode, increased contrast, and Reduce Motion. Reduced motion preserves causal
order without requiring decorative animation.

## Excluded from V1

- Clinical addiction or gambling intervention.
- Android or a cross-platform account system.
- Social feeds, competition, public progress, or engagement ranking.
- AI coaching, diagnoses, invented causes, or ungrounded advice.
- Multiple simultaneous trades.
- Complex analytics dashboards.
- Large avatar-creation systems.
- Punitive bans, streak loss, scene decay, or guilt-based retention.

## Relationship to Significant Hobbies

The products share a philosophical boundary: move time from automatic behavior
toward intentional life without turning self-development into a score.

Potential research exchange remains deliberately non-operational:

- **Replacement activity corpus:** Significant Hobbies owns a large library of
  hobby and experience paths that could inform authored Indulge alternatives.
- **Mortality frame:** Significant Hobbies makes remaining time visible; Indulge
  makes one reclaimed pocket of that time emotionally visible.
- **Tone counterpoint:** Indulge contributes a useful “trade, never moralize”
  stance to aspirational planning.
- **Graduation path:** a person who no longer needs the intervention may be ready
  for broader hobby discovery, but no automatic handoff or data transfer is
  implied.

Any actual integration requires its own issue, privacy review, product decision,
and implementation in the correct repository. This document does not authorize
cross-product tracking, profile transfer, shared identity, or publication.

## Original concept versus current truth

The original concept described a SwiftUI app with a Rive-driven 2.5D diorama.
The current Indulge repository instead uses an authored native scene system and
Apple-only framework boundaries. The durable principles survived: one
persistent visual world, local-first use, trade without moralizing, and a
graduation path.

For implementation details and current blockers, use the Indulge repository and
its GitHub Issues. This Significant Hobbies page is the promised research
reference only.
