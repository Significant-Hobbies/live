'use client';

import { Check, Sparkles } from 'lucide-react';
import { getBingoProgress, type BucketListDraft, type BucketListItem } from '~/lib/life-bingo';
import { cn } from '~/lib/utils';

const TONE_CLASSES: Record<BucketListItem['tone'], string> = {
  moss: 'border-border bg-card text-foreground',
  clay: 'border-border bg-card text-foreground',
  marigold: 'border-border bg-card text-foreground',
  sky: 'border-border bg-card text-foreground',
  rose: 'border-border bg-card text-foreground',
  ink: 'border-border bg-card text-foreground',
};

export function BingoBoard({
  draft,
  onSelectItem,
  onSelectEmpty,
  className,
  showAttribution = true,
  compact = false,
}: {
  draft: BucketListDraft;
  onSelectItem?: (item: BucketListItem) => void;
  onSelectEmpty?: (position: number) => void;
  className?: string;
  showAttribution?: boolean;
  compact?: boolean;
}) {
  const progress = getBingoProgress(draft);
  const boardItems = Array.from(
    { length: draft.size * draft.size },
    (_, position) => draft.items.find((item) => item.boardPosition === position) ?? null
  );

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-card p-4 text-foreground shadow-[0_20px_60px_color-mix(in_srgb,var(--scrim)_13%,transparent)] sm:p-6',
        className
      )}
      aria-label={`${draft.title} Bingo board`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.22'/%3E%3C/svg%3E\")",
        }}
      />

      <header
        className={cn(
          'relative flex items-end justify-between gap-4',
          compact ? 'mb-3' : 'mb-5 sm:mb-7'
        )}
      >
        <div className="min-w-0">
          <p className="mb-1 text-[0.6rem] font-bold uppercase tracking-[0.28em] text-muted-foreground sm:text-[0.68rem]">
            A life less ordinary
          </p>
          <h2
            className={cn(
              'font-serif font-semibold leading-[0.95] tracking-[-0.035em]',
              compact ? 'text-2xl sm:text-4xl' : 'text-3xl sm:text-5xl'
            )}
          >
            {draft.title}
          </h2>
          {!compact && (
            <p className="mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {draft.subtitle}
            </p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p
            className={cn(
              'font-serif leading-none',
              compact ? 'text-3xl sm:text-4xl' : 'text-3xl sm:text-5xl'
            )}
          >
            {progress.completed}
            <span className="text-muted-foreground">/{progress.total}</span>
          </p>
          <p className="mt-1 text-[0.55rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            moments lived
          </p>
        </div>
      </header>

      <div
        className="relative grid gap-1.5 sm:gap-2.5"
        style={{ gridTemplateColumns: `repeat(${draft.size}, minmax(0, 1fr))` }}
      >
        {boardItems.map((item, position) => {
          if (!item) {
            return (
              <button
                type="button"
                key={`empty-${position}`}
                onClick={() => onSelectEmpty?.(position)}
                disabled={!onSelectEmpty}
                className="aspect-square rounded-lg border border-dashed border-border bg-card/30 p-1 text-[0.55rem] font-semibold uppercase tracking-wider text-muted-foreground transition hover:bg-card/60 disabled:cursor-default sm:rounded-xl sm:text-[0.65rem]"
                aria-label={`Empty Bingo position ${position + 1}`}
              >
                Add a wish
              </button>
            );
          }

          const content = (
            <>
              <span
                className={cn(
                  'absolute left-1.5 top-1.5 text-[0.5rem] font-bold uppercase tracking-[0.14em] sm:left-2 sm:top-2 sm:text-[0.58rem]',
                  item.isWildcard ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {item.isWildcard ? 'wild card' : item.effort}
              </span>
              <span
                className={cn(
                  'absolute right-1.5 top-1.5 font-serif text-[0.62rem] sm:right-2 sm:top-2 sm:text-xs',
                  item.isWildcard ? 'text-foreground' : 'text-muted-foreground'
                )}
                aria-hidden="true"
              >
                {String(position + 1).padStart(2, '0')}
              </span>
              <span
                className={cn(
                  'relative z-10 block max-w-full text-balance font-semibold leading-[1.08] tracking-[-0.02em]',
                  draft.size === 5
                    ? 'text-[clamp(0.48rem,1.45vw,0.78rem)] sm:leading-[1.12]'
                    : 'text-[clamp(0.7rem,2.1vw,1rem)]'
                )}
              >
                {item.text}
              </span>
              {item.completedAt && (
                <span
                  aria-label="Lived"
                  className="absolute bottom-1 right-1 flex size-5 items-center justify-center text-muted-foreground"
                >
                  <Check className="size-3.5" aria-hidden="true" />
                </span>
              )}
              {item.isWildcard && !item.completedAt && (
                <Sparkles
                  className="absolute bottom-2 right-2 h-3 w-3 opacity-65 sm:h-4 sm:w-4"
                  aria-hidden="true"
                />
              )}
            </>
          );

          const itemClass = cn(
            'group relative flex aspect-square items-center justify-center overflow-hidden border p-1.5 text-center transition duration-200 sm:p-3',
            TONE_CLASSES[item.tone],
            position % 4 === 0 && 'rounded-[0.65rem_1.05rem_0.8rem_0.95rem]',
            position % 4 === 1 && 'rounded-[1rem_0.7rem_1.05rem_0.75rem]',
            position % 4 === 2 && 'rounded-[0.8rem_1rem_0.65rem_1.05rem]',
            position % 4 === 3 && 'rounded-[1.05rem_0.8rem_0.95rem_0.65rem]',
            onSelectItem &&
              'hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          );

          return onSelectItem ? (
            <button
              type="button"
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={itemClass}
              aria-label={`${item.text}${item.completedAt ? ', completed' : ''}`}
            >
              {content}
            </button>
          ) : (
            <div key={item.id} className={itemClass}>
              {content}
            </div>
          );
        })}
      </div>

      <footer className="relative mt-4 flex items-center justify-between gap-3 border-t border-border pt-3 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:mt-6 sm:pt-4 sm:text-[0.65rem]">
        <span>
          {progress.lines.length > 0
            ? `${progress.lines.length} bingo ${progress.lines.length === 1 ? 'line' : 'lines'}`
            : 'In progress'}
        </span>
        {showAttribution && <span>Live · Life Bingo</span>}
      </footer>
    </section>
  );
}
