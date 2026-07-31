## Why

SignificantHobbies explicitly avoids becoming a broad social network, yet its
public profiles and timelines still present follows, likes, and comments that
write data without notifications, follower discovery, or any return loop. These
controls promise a social experience the product does not deliver and distract
from the intended public artifact: a person's hobby journey.

## What Changes

- Remove follow controls and follower counts from public profiles.
- Remove like and comment controls, counts, reads, and write actions from public
  timeline routes.
- Remove like counts and the "Most liked" sort from Explore while retaining its
  timeline, phase, hobby, and recency discovery signals.
- Retire the now-unreachable client components and server actions.
- Preserve the `Like`, `Comment`, and `Follow` schema declarations and all
  historical rows; no migration or deletion is part of this change.
- Update product, architecture, privacy, and project-status documentation to
  describe the retired runtime behavior honestly.

## Capabilities

### New Capabilities

- `retired-social-affordances`: Public hobby artifacts remain viewable and
  shareable without active follow, like, or comment affordances, while legacy
  social data remains safely preserved.

### Modified Capabilities

None.

## Impact

- Public profile, canonical timeline, legacy timeline, and Explore route
  rendering and queries are simplified.
- Social client components and their server actions are removed.
- Drizzle schema declarations and stored rows are intentionally unchanged.
- No dependency, authentication, deployment, production-configuration, or
  migration change is required.
