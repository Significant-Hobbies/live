import type { LifeGrid as LifeGridData } from '~/lib/mortality';

type Props = {
  grid: LifeGridData;
};

/**
 * Life in Weeks — the stamp frame. 52 columns, one cell per week, running the
 * length of this particular life: weeks lived plus the weeks conditional life
 * expectancy still allows. Stamped weeks (weeks with practice) glow in gold —
 * that's your mark on the canvas so far. The weeks ahead carry a subtle gold
 * tint: open space, not empty space.
 *
 * The row count is therefore personal, not a fixed ~77.
 */
export function LifeGrid({ grid }: Props) {
  const years = Math.ceil(grid.cells.length / 52);
  const lived = grid.weeksLived;
  // The "now" row — where lived meets remaining. Used for the divider line.
  const currentYear = Math.floor(lived / 52);

  return (
    <div className="relative">
      {/* Ambient gold glow behind the remaining-weeks region */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 70% 40%, oklch(0.82 0.13 88 / 0.06), transparent 70%)',
        }}
      />

      <div
        className="relative grid gap-[2px]"
        style={{
          gridTemplateColumns: `repeat(52, minmax(0, 1fr))`,
        }}
        aria-label={`Life grid: ${grid.weeksLived} weeks lived of about ${grid.totalWeeks}`}
      >
        {grid.cells.map((cell) => {
          // Past, unpracticed: muted charcoal
          // Past, practiced (stamped): gold
          // Future (remaining): slightly brighter with a faint gold tint
          // Written as one branch rather than four reassignments: the previous
          // form opened with a value nothing could ever read, and ended with a
          // `!lived` line that silently overrode the stamped case.
          let bg: string;
          if (!cell.lived) bg = 'bg-primary/12';
          else if (cell.stamped) bg = 'bg-primary';
          else bg = 'bg-foreground/20';

          return (
            <div
              key={cell.weekIndex}
              className={`aspect-square rounded-[1px] transition-colors ${bg}`}
              title={
                cell.stamped
                  ? `Week ${cell.weekIndex + 1} — you practised`
                  : cell.lived
                    ? `Week ${cell.weekIndex + 1} — lived`
                    : `Week ${cell.weekIndex + 1} — ahead of you`
              }
            />
          );
        })}
      </div>

      {/* Editorial axis labels */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-subtle">
        <span className="font-mono">Age 0</span>
        <span className="font-mono tabular-nums">{currentYear} yrs lived</span>
        <span className="font-mono">~{years} years</span>
      </div>
    </div>
  );
}
