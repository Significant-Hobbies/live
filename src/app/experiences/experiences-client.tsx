'use client';

import Link from 'next/link';
import { AddToMyListButton } from '~/components/add-to-my-list-button';
import { useEffect, useRef, useState } from 'react';
import { ResultPagination } from '~/components/result-pagination';
import { useCatalogResults } from '~/components/use-catalog-results';
import type { CatalogPage, CatalogQuery } from '~/lib/catalog-types';

import type { ExperienceCategory, ExperienceKind } from '~/lib/experiences';

type Props = {
  initialPage: CatalogPage;
  initialQuery: CatalogQuery;
  mode: 'account' | 'local';
};

const KINDS: { id: ExperienceKind | 'all'; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'destination', label: 'Places' },
  { id: 'milestone', label: 'Milestones' },
  { id: 'idea', label: 'Ideas' },
];

/**
 * Browse the whole corpus.
 *
 * Everything is here, including the bare ideas that have no page of their own —
 * the list is meant to be exhaustive, and an item you can find and read is
 * useful even when there is nothing more to say about it yet. Entries with a
 * page link to it; the rest render as plain rows.
 *
 * Both transfer and mounted rows are bounded by server-side pagination.
 * Query/filter/page state lives in the URL for reloads and browser navigation.
 */
export function ExperiencesClient({ initialPage, initialQuery, mode }: Props) {
  const [query, setQuery] = useState(initialQuery.query);
  const [category, setCategory] = useState<ExperienceCategory | 'all'>(initialQuery.category);
  const [kind, setKind] = useState<ExperienceKind | 'all'>(initialQuery.kind);
  const [page, setPage] = useState(initialQuery.page);
  const pageSize = 20;
  const resultSummary = useRef<HTMLParagraphElement>(null);
  const catalog = useCatalogResults({ query, category, kind, page, pageSize }, true, initialPage);
  const data = catalog.data;
  const filtered = data?.items ?? [];
  const categories = initialPage.categories;
  const pageFocus = useRef(false);
  function updateUrl(next: Partial<CatalogQuery>, push = false) {
    const params = new URLSearchParams(window.location.search);
    const state = { query, category, kind, page, ...next };
    for (const [name, value] of Object.entries({
      q: state.query,
      category: state.category,
      kind: state.kind,
      page: state.page,
    })) {
      if (!value || value === 'all' || (name === 'page' && value === 1)) params.delete(name);
      else params.set(name, String(value));
    }
    const url = `${window.location.pathname}${params.size ? `?${params}` : ''}`;
    if (push) window.history.pushState(null, '', url);
    else window.history.replaceState(null, '', url);
  }
  useEffect(() => {
    function restore() {
      const params = new URLSearchParams(window.location.search);
      setQuery((params.get('q') ?? '').slice(0, 200));
      const nextCategory = params.get('category');
      setCategory(categories.find((item) => item.id === nextCategory)?.id ?? 'all');
      setKind(KINDS.find((item) => item.id === params.get('kind'))?.id ?? 'all');
      const nextPage = Number(params.get('page') ?? 1);
      setPage(Number.isSafeInteger(nextPage) && nextPage > 0 ? nextPage : 1);
    }
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, [categories]);
  useEffect(() => {
    if (data && pageFocus.current) {
      pageFocus.current = false;
      resultSummary.current?.focus({ preventScroll: true });
      resultSummary.current?.scrollIntoView({ block: 'start' });
    }
  }, [data]);

  return (
    <div>
      <div className="mt-8 space-y-4">
        <div>
          <label htmlFor="experience-search" className="sr-only">
            Search everything
          </label>
          <input
            id="experience-search"
            type="search"
            maxLength={200}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
              updateUrl({ query: e.target.value, page: 1 });
            }}
            placeholder="Search — northern lights, marathon, learn…"
            className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:outline-none"
          />
        </div>

        <FilterRow label="Kind">
          {KINDS.map((k) => (
            <Chip
              key={k.id}
              active={kind === k.id}
              onClick={() => {
                setKind(k.id);
                setPage(1);
                updateUrl({ kind: k.id, page: 1 });
              }}
            >
              {k.label}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label="Category">
          <Chip
            active={category === 'all'}
            onClick={() => {
              setCategory('all');
              setPage(1);
              updateUrl({ category: 'all', page: 1 });
            }}
          >
            All
          </Chip>
          {categories.map((c) => (
            <Chip
              key={c.id}
              active={category === c.id}
              onClick={() => {
                setCategory(c.id);
                setPage(1);
                updateUrl({ category: c.id, page: 1 });
              }}
            >
              {c.label}
            </Chip>
          ))}
        </FilterRow>
      </div>

      <p
        ref={resultSummary}
        tabIndex={-1}
        aria-live="polite"
        className="mt-6 scroll-mt-24 text-sm text-muted-foreground"
      >
        {catalog.loading
          ? 'Loading ideas…'
          : catalog.error || `${data?.matches ?? 0} of ${data?.total ?? 0}`}
      </p>
      {filtered.length > 0 && (
        <p className="mt-1 text-sm text-muted-foreground">
          Showing {((data?.page ?? 1) - 1) * pageSize + 1}–
          {Math.min((data?.page ?? 1) * pageSize, data?.matches ?? 0)}
        </p>
      )}

      {filtered.length === 0 && !catalog.loading && !catalog.error ? (
        <p className="mt-10 text-base text-muted-foreground">
          Nothing matches that. Try a shorter word, or clear the filters.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border border-border border-t">
          {filtered.map((e) => (
            <li key={e.slug} className="py-3.5">
              <div className="flex items-baseline gap-3">
                <span aria-hidden="true" className="shrink-0 text-base">
                  {e.emoji}
                </span>
                <div className="min-w-0">
                  {e.description ? (
                    <Link
                      href={`/experiences/${e.slug}`}
                      prefetch={false}
                      className="text-base font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      {e.title}
                    </Link>
                  ) : (
                    <span className="text-base font-medium text-foreground">{e.title}</span>
                  )}
                  {e.description ? (
                    <p className="mt-1 max-w-[70ch] text-sm text-muted-foreground">
                      {e.description}
                    </p>
                  ) : null}
                </div>
                <div className="ml-auto shrink-0">
                  <AddToMyListButton
                    title={e.title}
                    description={e.description}
                    category={e.category}
                    mode={mode}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <ResultPagination
        page={data?.page ?? page}
        pageCount={Math.ceil((data?.matches ?? 0) / pageSize)}
        onChange={(nextPage) => {
          setPage(nextPage);
          pageFocus.current = true;
          updateUrl({ page: nextPage }, true);
        }}
      />
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}
