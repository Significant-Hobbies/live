# Hub, Live, and Journal ownership

Last reviewed: 2026-08-23

## Canonical ownership

| Product | Canonical repository | Runtime or release owner | Data authority | Public surface | Issue tracker |
| --- | --- | --- | --- | --- | --- |
| Hub | `Significant-Hobbies/significanthobbies` | `personal-platform` Worker plus the Hub web release | privacy-safe summaries from the Personal Platform D1 and typed product connectors | `https://significanthobbies.com` | Significant Hobbies issues |
| Hub backend | `Significant-Hobbies/significanthobbies/services/hub-backend` | `personal-platform` Worker | Personal Platform D1; service bindings only for documented product reads/actions | same-origin Hub APIs and the existing Worker URL | Significant Hobbies issues |
| PersonalSyncKit | `Significant-Hobbies/significanthobbies` repository root | native clients pin the repository revision | client outboxes/cursors; no independent server datastore | Swift package, no public runtime | Significant Hobbies issues |
| Live | `Significant-Hobbies/live` | existing `significanthobbies` Worker during the staged cutover | existing Significant Hobbies D1 and signed-out IndexedDB | `https://live.significanthobbies.com` and compatibility routes | Live issues |
| Journal | `Significant-Hobbies/journal` | Journal native release | versioned local atlas first; optional Personal Platform sync | Apple bundle `com.significanthobbies.app` | Journal issues |

Anchor, Calorie, Indulge, Kith, Setline, and Habits remain independently owned.
They consume `PersonalSyncKit` or Hub contracts; moving the package changes its
source URL, not their local-first authority.

## Compatibility and staged cutover

- Runtime names, database identifiers, bundle identifiers, auth audiences, and
  existing storage bindings are intentionally unchanged. Repository ownership
  does not imply a data migration.
- Live keeps the existing Worker and D1 during extraction, so current browser
  sessions and records retain their authority. The apex-to-Live compatibility
  paths remain available until a separately verified route cutover.
- Journal keeps the existing bundle identifier and local atlas. Its optional
  sync endpoint and record semantics are unchanged.
- Hub Backend keeps the `personal-platform` Worker/D1 identifiers and its typed
  bindings to Live and Calorie. Secrets remain attached to the existing runtime
  and are never copied into source.

## Rollback

Every extracted repository is created from preserved Git history. If a source
cutover fails, redeploy the preceding SHA to the unchanged runtime and restore
the preceding repository revision; no database rollback is required because
this reconciliation contains no schema or data migration. The old repositories
remain archived, not deleted, so their history is recoverable.

## Release gates

Before retiring an old source location:

1. Run the Hub Backend and PersonalSyncKit tests from this repository.
2. Run Live web checks and Journal native tests from their canonical repos.
3. Verify every native package reference resolves to this repository.
4. Verify the Hub, Live, and backend health surfaces against their existing
   public origins.
5. Update Site Health and regenerate SaaS Maker's public projection.
