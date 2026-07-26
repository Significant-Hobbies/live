'use client';

import { Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { deleteTimeline } from '~/lib/actions/timeline';

interface Props {
  timelineId: string;
  /** Nullable to match TimelineData; used only for the accessible label. */
  title: string | null;
}

/**
 * Owner-only delete for a timeline.
 *
 * `deleteTimeline` was implemented with no caller, so a timeline could be
 * created and never removed. Deliberately not added to `TimelineCard` itself —
 * that component also renders on public surfaces, and a destructive control has
 * no business being one prop away from a visitor's view. This is rendered only
 * from `/timeline`, which lists the signed-in user's own timelines.
 */
export function TimelineDeleteButton({ timelineId, title }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function remove() {
    startTransition(async () => {
      await deleteTimeline(timelineId);
      router.refresh();
    });
  }

  if (confirming) {
    return (
      <div className="mt-2 flex items-center justify-end gap-2 text-xs">
        <span className="mr-auto text-muted-foreground">Delete this timeline?</span>
        <button
          type="button"
          onClick={remove}
          disabled={isPending}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50 disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
          Delete
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2 flex justify-end">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-md p-1 text-subtle transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50"
        aria-label={`Delete ${title?.trim() || 'this timeline'}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
