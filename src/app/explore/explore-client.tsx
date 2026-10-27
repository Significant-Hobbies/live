'use client';
import { useMemo, useState } from 'react';
import {
  ExploreView,
  filterExploreTimelines,
  type SortOption,
} from '~/components/public-pages/explore';
import type { TimelineData } from '~/lib/types';
export function ExploreClient({ timelines }: { timelines: TimelineData[] }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const filtered = useMemo(
    () => filterExploreTimelines(timelines, query, sort, categoryFilter),
    [timelines, query, sort, categoryFilter]
  );
  return (
    <ExploreView
      timelines={timelines}
      query={query}
      sort={sort}
      categoryFilter={categoryFilter}
      filtered={filtered}
      setQuery={setQuery}
      setSort={setSort}
      setCategoryFilter={setCategoryFilter}
    />
  );
}
