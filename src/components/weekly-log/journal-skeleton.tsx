export function JournalSkeleton() {
  return (
    <div
      aria-label="Loading Journal"
      aria-busy="true"
      className="mx-auto max-w-[760px] px-4 py-6 sm:px-6 sm:py-11"
    >
      <div className="h-11 w-64 animate-pulse rounded-xl bg-muted" />
      <div className="mt-4 h-10 w-3/4 animate-pulse rounded bg-muted" />
      <div className="mt-6 h-[220px] animate-pulse rounded-xl bg-muted" />
      <div className="mt-5 h-11 w-36 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}
