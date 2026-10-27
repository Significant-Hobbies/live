import Link from 'next/link';
import type { RefObject } from 'react';
import { AddToMyListButton } from '~/components/add-to-my-list-button';
import { ResultPagination } from '~/components/result-pagination';
import type { CatalogPage, CatalogQuery } from '~/lib/catalog-types';
import type { ExperienceCategory, ExperienceKind } from '~/lib/experiences';
export const KINDS: { id: ExperienceKind | 'all'; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'destination', label: 'Places' },
  { id: 'milestone', label: 'Milestones' },
  { id: 'idea', label: 'Ideas' },
];

export function ExperiencesView(props: {
  initialPage: CatalogPage;
  mode: 'account' | 'local';
  query: string;
  category: ExperienceCategory | 'all';
  kind: ExperienceKind | 'all';
  page: number;
  catalog: { data?: CatalogPage; loading: boolean; error: string };
  setQuery: (value: string) => void;
  setCategory: (value: ExperienceCategory | 'all') => void;
  setKind: (value: ExperienceKind | 'all') => void;
  setPage: (value: number) => void;
  updateUrl: (value: Partial<CatalogQuery>, push?: boolean) => void;
  resultSummary: RefObject<HTMLParagraphElement | null>;
  pageFocus: RefObject<boolean>;
}) {
  const {
    initialPage,
    mode,
    query,
    category,
    kind,
    page,
    catalog,
    setQuery,
    setCategory,
    setKind,
    setPage,
    updateUrl,
    resultSummary,
    pageFocus,
  } = props;
  const pageSize = 20;
  const data = catalog.data;
  const filtered = data?.items ?? [];
  const categories = initialPage.categories;
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
            className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none"
          />
        </div>

        <CatalogFilterRow label="Kind">
          {KINDS.map((k) => (
            <CatalogChip
              key={k.id}
              active={kind === k.id}
              onClick={() => {
                setKind(k.id);
                setPage(1);
                updateUrl({ kind: k.id, page: 1 });
              }}
            >
              {k.label}
            </CatalogChip>
          ))}
        </CatalogFilterRow>

        <CatalogFilterRow label="Category">
          <CatalogChip
            active={category === 'all'}
            onClick={() => {
              setCategory('all');
              setPage(1);
              updateUrl({ category: 'all', page: 1 });
            }}
          >
            All
          </CatalogChip>
          {categories.map((c) => (
            <CatalogChip
              key={c.id}
              active={category === c.id}
              onClick={() => {
                setCategory(c.id);
                setPage(1);
                updateUrl({ category: c.id, page: 1 });
              }}
            >
              {c.label}
            </CatalogChip>
          ))}
        </CatalogFilterRow>
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

export function CatalogFilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

export function CatalogChip({
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
      className={`min-h-11 rounded-full border px-3 py-1.5 text-sm transition-colors ${
        active
          ? 'border-border bg-muted text-foreground'
          : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}
