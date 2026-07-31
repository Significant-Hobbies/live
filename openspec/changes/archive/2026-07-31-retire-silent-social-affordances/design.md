## Context

The application has complete persistence paths for follows, timeline likes, and
timeline comments, but it has no notifications, follower/following views,
activity feed, or other return loop. The product contract also explicitly rules
out a broad social network. Public profiles, two public timeline routes, and
Explore nevertheless read and present those interactions.

The `Like`, `Comment`, and `Follow` tables may contain production history.
Removing them from the Drizzle schema would cause a future generated migration
to propose destructive table drops, so runtime retirement and storage
retirement must remain separate decisions.

## Goals / Non-Goals

**Goals:**

- Make public hobby artifacts truthful, focused, and non-interactive except for
  their existing share, compare, export, and owner controls.
- Eliminate all reachable social reads and writes.
- Keep public profiles and timelines visually balanced after the controls are
  removed.
- Preserve historical data and make the storage boundary explicit in docs.

**Non-Goals:**

- Notifications, feeds, follower lists, email, or a replacement social system.
- Dropping, migrating, anonymizing, or otherwise changing historical rows.
- Resurfacing hidden discovery routes, changing authentication, or deploying.

## Decisions

### Remove the social contract rather than partially hiding it

All Follow, Like, and Comment controls and counts will be removed from public
surfaces. Leaving counts visible or retaining hidden write actions would keep an
unsupported product contract and dead runtime surface. Existing share, compare,
export, visibility, and editing actions remain because each has an immediate,
complete outcome.

Alternative considered: keep reactions but add notifications. Rejected because
that expands the product into the broad social network already ruled out and
would introduce a substantially larger surface than the issue requires.

### Retire runtime code, preserve schema declarations

The dedicated client components and server actions will be removed after all
callers are removed. The three tables, indexes, relationships, and historical
rows remain declared. Data-model documentation will classify them as retired
storage that is never read or written.

Alternative considered: delete the tables and generate a migration. Rejected
because this issue neither authorizes nor requires destructive production data
work.

### Replace engagement-derived Explore signals with artifact-derived signals

Explore will keep phase count, distinct hobby count, update time, search, and
category filters. The card's third stat becomes the timeline's span rather than
likes, the page-level signal total counts public phases and unique hobbies, and
the "Most liked" sort disappears.

This retains the existing three-column information rhythm without inventing a
new ranking metric or changing the route's visual language.

## Risks / Trade-offs

- [Historical reactions become inaccessible in-product] → Preserve all rows
  and schema declarations so a separately approved export or migration remains
  possible.
- [Removing controls can leave awkward empty layout space] → Use the existing
  action clusters and card stat grid, replacing only the engagement-derived
  Explore stat with existing timeline span information.
- [A stale caller could retain a write path] → Search all source and tests for
  component names, actions, schema reads, and user-facing social labels after
  implementation.
- [Unarchived unrelated OpenSpec change can be disturbed] → Limit edits and
  validation to this change, then validate every active spec/change without
  modifying the unrelated completed change.

## Migration Plan

1. Remove public queries, controls, and engagement-derived Explore ranking.
2. Remove unreachable components and server actions.
3. Update the product, privacy, architecture, and project status truth.
4. Validate source references, types, lint, tests, build, responsive evidence,
   and OpenSpec.
5. Ship the code normally. No database or production migration runs.

Rollback is a normal code revert because stored social rows remain intact.

## Open Questions

None. Any future use, export, or deletion of historical social rows requires a
separate issue and explicit data-migration decision.
