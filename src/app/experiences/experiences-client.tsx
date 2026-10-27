'use client';
import { ExperiencesView, KINDS } from '~/components/public-pages/experiences-catalog';

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
    <ExperiencesView
      initialPage={initialPage}
      mode={mode}
      query={query}
      category={category}
      kind={kind}
      page={page}
      catalog={catalog}
      setQuery={setQuery}
      setCategory={setCategory}
      setKind={setKind}
      setPage={setPage}
      updateUrl={updateUrl}
      resultSummary={resultSummary}
      pageFocus={pageFocus}
    />
  );
}
