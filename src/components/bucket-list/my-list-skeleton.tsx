export function MyListSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading My list"
      aria-busy="true"
      className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 sm:py-10"
    >
      <div className="h-10 w-40 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-4 w-48 animate-pulse rounded bg-muted" />
      <div className="mt-7 h-12 max-w-2xl animate-pulse rounded-xl bg-muted" />
      <div className="mt-7 max-w-2xl divide-y divide-border">
        {[1, 2, 3].map((row) => (
          <div key={row} className="flex gap-4 py-5">
            <div className="size-6 animate-pulse rounded-full bg-muted" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
