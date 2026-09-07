# Live by Significant Hobbies

Live helps people map hobbies and experiences across a lifetime: what they want
to try, what persisted, and what is worth doing next. It includes discovery,
bucket lists, commitments, timelines, side quests, and personal history.

This is Live's canonical repository and issue tracker. Its Git history was
preserved when it was extracted from
[`Significant-Hobbies/significanthobbies`](https://github.com/Significant-Hobbies/significanthobbies).
The Hub and `PersonalSyncKit` remain there. Journal's independent source history
is retained, but Journal has been removed from the Fleet product lineup.

## Local development

```bash
pnpm install
pnpm dev
pnpm test
pnpm typecheck
pnpm build
```

The existing `significanthobbies` Worker and D1 remain Live's runtime and data
authority. Apex Hub paths remain delegated through the existing service binding.
The private `/hub` page also delegates on the Live host so sign-in and Hub rendering
use the existing host-only Live session. Hub rendering and data remain Hub-owned;
other legacy apex application paths remain compatible.

## Verification and retained work

On 2026-09-07, the public nine-choice quiz produced relevant Scholar hobby
suggestions and small experiments. Sharing is scoped to that guest experience;
authenticated saving, history, bucket-list planning and account persistence
still require hands-on qualification.

The same-day production smoke failure was a JSON parsing defect in the checker:
whitespace stripping and a greedy expression selected a nested app's name.
The repaired check reads the top-level JSON name and rejects missing/null values.
All five existing read-only smoke steps passed locally against the live hosts,
including crawler routes, redirects, HEAD parity and the social image. This
repair does not deploy application changes or qualify authenticated journeys.

The [Hub login repair](https://github.com/Significant-Hobbies/significanthobbies/issues/154)
keeps private Hub intent through sign-in, cancellation, expiry and unavailable
services without changing authentication identities or cookie domains. Local
browser proof used actual Live-issued synthetic sessions and two-account summary
isolation; [receipts](https://github.com/Significant-Hobbies/significanthobbies/blob/main/docs/hub-login-qualification-2026-09-07.md)
remain separate from hosted Google sign-in qualification. The intended private
entry is `https://live.significanthobbies.com/hub`, while the public directory
stays on the apex. No application deployment was performed for this repair.
