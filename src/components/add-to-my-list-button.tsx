'use client';

import { useState, useTransition } from 'react';

import { addBucketListItem } from '~/lib/actions/bucket-list';
import type { BucketItemCategory } from '~/lib/famous-bucket-lists';

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
};

export function AddToMyListButton({
  title,
  description,
  category,
  sourceSlug,
  sourceItemTitle,
}: Props) {
  const [added, setAdded] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    startTransition(async () => {
      await addBucketListItem({ title, description, category, sourceSlug, sourceItemTitle });
      setAdded(true);
    });
  }

  if (added) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#684e00]">
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-bold">
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
      className="inline-flex items-center gap-1.5 rounded-full border border-lumi-200 bg-card px-3 py-1 text-xs font-medium text-[#684e00] transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? 'Adding…' : '+ Add to my list'}
    </button>
  );
}
