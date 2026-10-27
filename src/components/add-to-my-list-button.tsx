'use client';

import { addToMyListLabel } from '~/lib/public-button-copy';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { useState, useTransition } from 'react';

import { addBucketListItem } from '~/lib/actions/bucket-list';
import { useStorageMode } from '~/components/storage-mode-provider';
import type { BucketItemCategory } from '~/lib/famous-bucket-lists';
import { addDreamsToLocalRecord } from '~/lib/local-dreams';

type Props = {
  title: string;
  description?: string;
  category?: BucketItemCategory;
  /**
   * Provenance, when the item came from a famous list — it drives the
   * revalidation of that list's page. Optional because suggestions on
   * /live-more have no source page to revalidate.
   */
  sourceSlug?: string;
  sourceItemTitle?: string;
  mode?: 'account' | 'local';
  variant?: 'compact' | 'primary';
};

export function AddToMyListButton({
  title,
  description,
  category,
  sourceSlug,
  sourceItemTitle,
  mode,
  variant = 'compact',
}: Props) {
  const [added, setAdded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const storageMode = useStorageMode();
  const saveMode = mode ?? storageMode;

  function handleAdd() {
    setFailed(false);
    startTransition(async () => {
      try {
        if (saveMode === 'local') {
          await addDreamsToLocalRecord([{ title, description, category, sourceSlug }]);
        } else {
          await addBucketListItem({ title, description, category, sourceSlug, sourceItemTitle });
        }
        setAdded(true);
        window.dispatchEvent(new CustomEvent('bucket-list:item-added', { detail: { title } }));
      } catch {
        setFailed(true);
      }
    });
  }

  if (variant === 'primary') {
    return (
      <div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={isPending || added}
          aria-label={`${added ? 'Saved' : 'Save'} ${title} to my list`}
          className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-default disabled:opacity-70"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : added ? (
            <Check className="size-4" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {isPending ? 'Saving privately…' : added ? 'In my list' : addToMyListLabel}
        </button>
        {failed ? (
          <p className="mt-2 text-xs font-medium text-destructive" role="status">
            Live could not save this yet. Please try again.
          </p>
        ) : null}
      </div>
    );
  }

  if (added) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-muted text-foreground text-[9px] font-bold">
          ✓
        </span>
        Added to your bucket list
      </span>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={isPending}
      /* Named by the item it adds. A famous list renders dozens of these and the
         /live-more suggestions render four, so a bare "+ Add to my list" left a
         screen-reader user with a page of identically-named buttons. */
      aria-label={`Add ${title} to my bucket list`}
      aria-describedby={
        failed ? `add-${title.replace(/\W+/g, '-').toLowerCase()}-error` : undefined
      }
      className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? 'Adding…' : failed ? 'Could not save — retry' : `+ ${addToMyListLabel}`}
      {failed ? (
        <span id={`add-${title.replace(/\W+/g, '-').toLowerCase()}-error`} className="sr-only">
          Live could not save this yet. Please try again.
        </span>
      ) : null}
    </button>
  );
}
