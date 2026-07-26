'use client';

import { TRAJECTORY_BUCKETS, type TrajectoryBucket } from '~/lib/trajectory';
import type { TrajectoryState } from '~/lib/actions/trajectory';

import { BucketSection } from './bucket-section';

interface Props {
  state: TrajectoryState;
  /**
   * Hide every write affordance. Set for the signed-out preview: the trajectory
   * write actions throw on a missing session (unlike the daily ones, which
   * return early), so an anonymous visitor must not be offered a Save button.
   */
  readOnly?: boolean;
}

/**
 * Top-level client for /trajectory. Renders the 4 fixed buckets in
 * canonical order. Each bucket section is self-contained — holds its own
 * ideal editor and entry form state.
 */
export function TrajectoryPageClient({ state, readOnly = false }: Props) {
  return (
    <div className="space-y-10">
      {TRAJECTORY_BUCKETS.map((bucket: TrajectoryBucket) => (
        <BucketSection
          key={bucket}
          bucket={bucket}
          eras={state.erasByBucket[bucket]}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}
