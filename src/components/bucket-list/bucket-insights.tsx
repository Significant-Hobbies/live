import Link from 'next/link';

import { SpotlightCard } from '~/components/aceternity';
import { AddToMyListButton } from '~/components/add-to-my-list-button';
import {
  getBucketListArchetype,
  getBucketListSuggestions,
  getCelebrityMatch,
} from '~/lib/bucket-list-insights';
import { BUCKET_ITEM_CATEGORIES, type BucketItemCategory } from '~/lib/famous-bucket-lists';

interface Props {
  items: Array<{ title: string; category: string | null }>;
}

/**
 * What a person's bucket list says about them.
 *
 * `src/lib/bucket-list-insights.ts` — 368 lines and a full test suite for an
 * archetype, a closest-famous-list match, and category-aware suggestions — had
 * zero importers and was unreachable from every entrypoint. A finished feature
 * with no door into it.
 *
 * `/live-more` already reads a *timeline* archetype from what someone has done.
 * This is the counterpart: what they say they want. Presenting the pair is the
 * reason this page exists — past, present, and future in one view.
 *
 * All three generators return null/empty for an empty list, so this renders
 * nothing until there is something to read.
 */
export function BucketInsights({ items }: Props) {
  const archetype = getBucketListArchetype(items);
  const match = getCelebrityMatch(items);
  // No extra seed: getBucketListSuggestions already derives its shuffle from the
  // existing titles, so the set evolves as the list grows and stays stable
  // between renders. Passing items.length on top only double-counted the same
  // signal. Note the consequence — adding a suggestion changes that hash, so the
  // panel re-rolls and the added row leaves the list. That *is* the feedback;
  // the item shows up under "Ahead of you" instead.
  const suggestions = getBucketListSuggestions(items, 4);

  if (!archetype && !match && suggestions.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">What your list says</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {archetype && (
          <SpotlightCard className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-subtle">
              Your bucket-list archetype
            </p>
            <p className="mt-2 font-serif text-xl font-medium text-foreground">
              <span aria-hidden>{archetype.emoji}</span> {archetype.name}
            </p>
            <p className="mt-1 font-serif text-sm italic text-muted-foreground">
              {archetype.tagline}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {archetype.description}
            </p>
          </SpotlightCard>
        )}

        {match && (
          <SpotlightCard className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-subtle">
              Closest famous list
            </p>
            <p className="mt-2 font-serif text-xl font-medium text-foreground">
              <span aria-hidden>{match.emoji}</span> {match.name}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{match.knownFor}</p>
            {match.sharedCategories.length > 0 && (
              <p className="mt-3 text-sm text-muted-foreground">
                You overlap on{' '}
                <span className="text-foreground">
                  {match.sharedCategories
                    .map((c) => BUCKET_ITEM_CATEGORIES[c as BucketItemCategory]?.label ?? c)
                    .join(', ')}
                </span>
                .
              </p>
            )}
            <Link
              href={`/bucket-lists/${match.slug}`}
              className="mt-3 inline-block text-sm text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary"
            >
              See their list →
            </Link>
          </SpotlightCard>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-subtle">
            Chosen for the gaps in your list
          </p>
          <ul className="mt-3 space-y-3">
            {suggestions.map((s) => (
              <li
                key={s.title}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border/50 pb-3 last:border-0 last:pb-0"
              >
                <span className="flex min-w-0 items-baseline gap-2 text-sm text-foreground">
                  <span aria-hidden>{s.emoji}</span>
                  <span>{s.title}</span>
                </span>
                {/* Reuses the same action as the famous-list pages, so a
                    suggestion becomes a real item with one click. */}
                <AddToMyListButton title={s.title} category={s.category} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
