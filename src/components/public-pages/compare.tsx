import type { ReactNode } from 'react';
export const comparisonLabels = { a: 'Hobby A', b: 'Hobby B', placeholder: 'Search a hobby…' };
export function CompareView({
  hobbyA,
  hobbyB,
  detailA,
  detailB,
  selectorA,
  selectorB,
  comparison,
  setHobbyA,
  setHobbyB,
}: {
  hobbyA: string | null;
  hobbyB: string | null;
  detailA: boolean;
  detailB: boolean;
  selectorA: ReactNode;
  selectorB: ReactNode;
  comparison: ReactNode;
  setHobbyA: (value: string | null) => void;
  setHobbyB: (value: string | null) => void;
}) {
  return (
    <div>
      {/* Selectors */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        {selectorA}
        <div className="flex items-center justify-center pb-1 text-sm font-bold text-subtle sm:pb-3">
          VS
        </div>
        {selectorB}
      </div>

      {/* Prompt when none selected */}
      {!detailA && !detailB && (
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
          <p className="text-2xl">⚖️</p>
          <p className="mt-3 font-medium text-muted-foreground">Select two hobbies to compare</p>
          <p className="mt-1 text-sm text-subtle">
            Use the dropdowns above to pick Hobby A and Hobby B
          </p>
        </div>
      )}

      {/* Partial selection */}
      {(detailA || detailB) && !(detailA && detailB) && (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 px-6 py-12 text-center">
          <p className="text-muted-foreground">
            Now pick{' '}
            <span className="font-semibold text-foreground">{detailA ? 'Hobby B' : 'Hobby A'}</span>{' '}
            to see the comparison
          </p>
        </div>
      )}

      {/* Full comparison */}
      {detailA && detailB && comparison}

      {/* Quick picks */}
      {!hobbyA && !hobbyB && (
        <div className="mt-10">
          <p className="mb-3 text-sm font-semibold text-subtle">Popular comparisons</p>
          <div className="flex flex-wrap gap-2">
            {[
              ['Running', 'Cycling'],
              ['Guitar', 'Piano'],
              ['Chess', 'Reading'],
              ['Cooking', 'Baking'],
              ['Yoga', 'Dance'],
              ['Drawing', 'Painting'],
            ].map(([a, b]) => (
              <button
                key={`${a}-${b}`}
                type="button"
                onClick={() => {
                  setHobbyA(a);
                  setHobbyB(b);
                }}
                className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors"
              >
                {a} vs {b}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
