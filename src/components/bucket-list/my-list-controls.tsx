import type { Dispatch, SetStateAction } from 'react';
import type { MyListItem } from './my-list-storage';
import type { MyListQuery } from '~/lib/bucket-list-data';
import { EXPERIENCES_BY_CATEGORY } from '~/lib/experiences';
const STATUS_LABELS = { planned: 'To do', in_progress: 'Doing', done: 'Lived' };
export function MyListControls({
  items,
  query,
  onChange,
  matches,
  removing,
}: {
  items: MyListItem[];
  query: MyListQuery;
  onChange: Dispatch<SetStateAction<MyListQuery>>;
  matches: number;
  removing: boolean;
}) {
  return (
    <div className="mt-6 space-y-3">
      <label htmlFor="my-list-search" className="block text-sm text-muted-foreground">
        Search my list
      </label>
      <input
        id="my-list-search"
        type="search"
        value={query.search}
        onChange={(event) => onChange((value) => ({ ...value, search: event.target.value }))}
        placeholder="Find a title, note or next step"
        className="min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base"
      />
      <div className="flex flex-wrap gap-2">
        <label className="min-w-0 flex-1 text-sm text-muted-foreground">
          Status
          <select
            aria-label="Filter by status"
            value={query.status}
            onChange={(event) =>
              onChange((value) => ({
                ...value,
                status: event.target.value as MyListQuery['status'],
              }))
            }
            className="mt-1 h-11 min-h-11 w-full rounded-xl border border-border bg-card px-3 text-foreground"
          >
            <option value="all">All statuses</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-0 flex-1 text-sm text-muted-foreground">
          Category
          <select
            aria-label="Filter by category"
            value={query.category}
            onChange={(event) => onChange((value) => ({ ...value, category: event.target.value }))}
            className="mt-1 h-11 min-h-11 w-full rounded-xl border border-border bg-card px-3 text-foreground"
          >
            <option value="all">All categories</option>
            {[...new Set(items.map((item) => item.category || 'uncategorized'))]
              .sort()
              .map((category) => (
                <option key={category} value={category}>
                  {EXPERIENCES_BY_CATEGORY[category as keyof typeof EXPERIENCES_BY_CATEGORY]
                    ?.label ?? 'Uncategorized'}
                </option>
              ))}
          </select>
        </label>
      </div>
      <p role="status" className="text-xs text-muted-foreground">
        {matches} of {items.length} items
      </p>
      {(query.search || query.status !== 'all' || query.category !== 'all') && (
        <button
          type="button"
          onClick={() => onChange({ search: '', status: 'all', category: 'all' })}
          className="min-h-11 text-sm underline underline-offset-4"
        >
          Clear filters
        </button>
      )}
      {matches === 0 && !removing && (
        <p className="text-sm text-muted-foreground">No items match these filters.</p>
      )}
    </div>
  );
}
