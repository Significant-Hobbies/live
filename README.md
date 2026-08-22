# Live by Significant Hobbies

Live helps people map hobbies and experiences across a lifetime: what they want
to try, what persisted, and what is worth doing next. It includes discovery,
bucket lists, commitments, timelines, side quests, and personal history.

This is Live's canonical repository and issue tracker. Its Git history was
preserved when it was extracted from
[`Significant-Hobbies/significanthobbies`](https://github.com/Significant-Hobbies/significanthobbies).
The Hub and `PersonalSyncKit` remain there; Journal is maintained in
[`Significant-Hobbies/journal`](https://github.com/Significant-Hobbies/journal).

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
