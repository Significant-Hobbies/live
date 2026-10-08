'use client';

export function ResultPagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <nav
      aria-label="Result pages"
      className="mt-4 flex flex-wrap items-center justify-between gap-3"
    >
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="min-h-11 rounded-xl border border-border px-4 text-sm disabled:opacity-40"
      >
        Previous
      </button>
      <span aria-live="polite" className="text-sm">
        Page {page} of {pageCount}
      </span>
      <button
        type="button"
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
        className="min-h-11 rounded-xl border border-border px-4 text-sm disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}
