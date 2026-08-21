# personal-platform — PROJECT STATUS

Last updated: 2026-08-21

## Why / What

Provide one small signed-in Cloudflare synchronization and semantic API layer
for the Significant Hobbies personal app family while keeping every source app
standalone and local-first.

**Users:** the single owner of the personal app family.

**In scope:** shared identity verification, device sync, fresh server state for
Live, Journal, Habits, Setline, Kith, and Anchor, Hub summaries/actions, action
audit, life events, and a Calorie service connector.

**Out of scope:** a universal personal schema, direct access to Calorie's D1,
production deployment, remote migrations, legacy-data import, and immediate
CloudKit retirement.

## Dependencies

### External

- Cloudflare Workers and D1.
- A production auth verifier to map Apple/Better Auth sessions to one internal
  user ID before deployment.

### Internal

- Calorie's existing Worker for calorie reads and writes.
- Live, Journal, Habits, Setline, Kith, and Anchor local model adapters.
- Hub as a read/action client with no canonical domain storage.

## Timeline

- **2026-08-21:** Created the repository and specified the shared Cloudflare
  sync foundation in GitHub issue #1.

## Products

- Cloudflare Worker source and local D1 migration (not deployed).
- `PersonalSyncKit` Swift package for iOS, iPadOS, macOS, and watchOS clients.

## Features (shipped)

- None yet.

## Work queue

- [GitHub Issues](https://github.com/Significant-Hobbies/personal-platform/issues)

