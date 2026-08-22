# Live agent instructions

## Product boundary

This repository is the canonical source for Live by Significant Hobbies: the
web product for hobbies, experiences, bucket lists, commitments, timelines,
side quests, discovery, and personal history. It owns the existing
`significanthobbies` Cloudflare Worker and D1 data authority.

The Worker retains apex compatibility routes for the existing web application.
Only `/` and `/hub` are delegated through the `HUB_SERVICE` binding to the
canonical Significant Hobbies Hub. Journal and Hub Backend source belong in
their independent repositories and must not be reintroduced here.

## Stack and commands

- Next.js 16, React 19, TypeScript, Tailwind CSS, Drizzle, better-auth
- Cloudflare Workers/OpenNext, D1, Workers AI, PostHog
- pnpm 10

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm quality
```

Do not migrate production data, rotate credentials, or change auth/storage
identities. Production deploys require explicit operator approval.
