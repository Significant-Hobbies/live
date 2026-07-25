'use client';

import { Eye, EyeOff, Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import {
  removeBucketListItem,
  updateBucketListItemStatus,
  updateBucketListItemVisibility,
} from '~/lib/actions/bucket-list';
import { cn } from '~/lib/utils';

type ItemStatus = 'planned' | 'in_progress' | 'done';

interface Props {
  id: string;
  status: string;
  visibility: string;
  title: string;
}

const STATUS_LABEL: Record<ItemStatus, string> = {
  planned: 'Planned',
  in_progress: 'In progress',
  done: 'Done',
};

const STATUSES: ItemStatus[] = ['planned', 'in_progress', 'done'];

/**
 * Owner controls for one bucket-list item.
 *
 * Every action here was already implemented and had no caller, so items were
 * write-once: they could be added and then never advanced, published, or
 * removed. Consequences that this closes:
 *
 * - `/life-plan`'s "In progress" panel could never populate, because
 *   `'in_progress'` was unreachable — `'done'` was only ever set by finishing a
 *   whole quest chain.
 * - The bucket-list block on `/u/[username]` filters `visibility = 'public'`,
 *   but items default to `'private'` and nothing could change that, so it was
 *   permanently empty for every user.
 * - Nothing could be deleted, so a mistaken "Add to my list" was permanent.
 */
export function BucketItemControls({ id, status, visibility, title }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const isPublic = visibility === 'public';
  const current = (STATUSES as string[]).includes(status) ? (status as ItemStatus) : 'planned';

  function setStatus(next: ItemStatus) {
    if (next === current) return;
    startTransition(async () => {
      await updateBucketListItemStatus(id, next);
      router.refresh();
    });
  }

  function toggleVisibility() {
    startTransition(async () => {
      await updateBucketListItemVisibility(id, isPublic ? 'private' : 'public');
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      await removeBucketListItem(id);
      router.refresh();
    });
  }

  return (
    <div
      role="group"
      aria-label={`Controls for ${title}`}
      className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border/60 pt-3"
    >
      {/* Status — a plain three-way choice, not a score. */}
      <div className="flex items-center gap-1" role="group" aria-label={`Status for ${title}`}>
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            disabled={isPending}
            aria-pressed={current === s}
            className={cn(
              'rounded-md px-2 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 disabled:opacity-50',
              current === s
                ? 'bg-primary/15 text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <span className="ml-auto flex items-center gap-2">
        {/* Visibility — the only way an item reaches the public profile. */}
        <button
          type="button"
          onClick={toggleVisibility}
          disabled={isPending}
          aria-pressed={isPublic}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 disabled:opacity-50"
          title={
            isPublic ? 'Visible on your public profile' : 'Private — only you can see this item'
          }
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : isPublic ? (
            <Eye className="h-3 w-3" />
          ) : (
            <EyeOff className="h-3 w-3" />
          )}
          {isPublic ? 'Public' : 'Private'}
        </button>

        {confirmingDelete ? (
          <span className="flex items-center gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={remove}
              disabled={isPending}
              className="rounded-md px-2 py-1 font-medium text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50 disabled:opacity-50"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
            >
              Cancel
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="rounded-md p-1 text-subtle transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50"
            aria-label={`Remove ${title}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </span>
    </div>
  );
}
