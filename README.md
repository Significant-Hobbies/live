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
authority. The apex `/` and `/hub` requests are delegated to the Hub through a
Cloudflare service binding; other legacy apex application paths remain
compatible so no browser data or account migration is required.

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
