# Live agent instructions

## Product boundary

This repository is the canonical source for Live by Significant Hobbies: the
web product for hobbies, experiences, bucket lists, commitments, timelines,
side quests, discovery, and personal history. It owns the existing
`significanthobbies` Cloudflare Worker and D1 data authority.

Live’s canonical full web application is hosted at `significanthobbies.com`.
The `live.significanthobbies.com` alias remains a full serving/auth origin to
preserve origin-local guest work and host-only sessions. The Worker retains
narrow compatibility routes for the retired Hub backend.
The Hub path allowlist, including the `/landing/` asset prefix (not exact
`/landing`), is delegated through `HUB_SERVICE` on apex hosts.
Exactly `/hub` also delegates on the Live host to preserve its host-only session.
The retired Hub backend retains private compatibility rendering and data ownership. Journal and Hub Backend source belong in
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
