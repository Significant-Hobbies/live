import { Badge } from '~/components/ui/badge';
import { computeInsights } from '~/lib/insights';
import type { Phase } from '~/lib/types';

interface Props {
  phases: Phase[];
}

function phaseTransitionColor(majorChange: string): string {
  if (majorChange.toLowerCase().includes('gained')) return 'text-growth';
  if (majorChange.toLowerCase().includes('lost')) return 'text-destructive';
  if (majorChange.toLowerCase().includes('shifted focus')) return 'text-growth';
  return 'text-muted-foreground';
}

export function InsightsPanel({ phases }: Props) {
  if (phases.length < 2) return null;

  const insights = computeInsights(phases);
  const { rekindled, mostPersistent, categoryDiversity, longestStreaks, phaseTransitions } =
    insights;

  const topPersistent = mostPersistent.filter((h) => h.count >= 2).slice(0, 6);
  const totalHobbies = new Set(phases.flatMap((p) => p.hobbies.map((h) => h.name.toLowerCase())))
    .size;

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5 shadow-soft">
      <h2 className="text-lg font-semibold text-foreground">Insights</h2>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          className="rounded-lg p-3 text-center"
          style={{
            background:
              'linear-gradient(135deg, color-mix(in srgb, var(--success) 8%, transparent) 0%, color-mix(in srgb, var(--success) 3%, transparent) 100%)',
            border: '1px solid color-mix(in srgb, var(--success) 20%, transparent)',
          }}
        >
          <div className="text-2xl font-bold text-growth">{totalHobbies}</div>
          <div className="text-xs text-muted-foreground mt-0.5">total hobbies</div>
        </div>
        <div
          className="rounded-lg p-3 text-center"
          style={{
            background:
              'linear-gradient(135deg, color-mix(in srgb, var(--field-sky-ink) 8%, transparent) 0%, color-mix(in srgb, var(--field-sky-ink) 3%, transparent) 100%)',
            border: '1px solid color-mix(in srgb, var(--field-sky-ink) 20%, transparent)',
          }}
        >
          <div className="text-2xl font-bold text-field-sky-ink">{rekindled.length}</div>
          <div className="text-xs text-muted-foreground mt-0.5">rekindled</div>
        </div>
        <div
          className="rounded-lg p-3 text-center"
          style={{
            background:
              'linear-gradient(135deg, color-mix(in srgb, var(--field-lilac-ink) 8%, transparent) 0%, color-mix(in srgb, var(--field-lilac-ink) 3%, transparent) 100%)',
            border: '1px solid color-mix(in srgb, var(--field-lilac-ink) 20%, transparent)',
          }}
        >
          <div className="text-2xl font-bold text-field-lilac-ink">{topPersistent.length}</div>
          <div className="text-xs text-muted-foreground mt-0.5">persistent</div>
        </div>
        <div
          className="rounded-lg p-3 text-center"
          style={{
            background:
              'linear-gradient(135deg, color-mix(in srgb, var(--brand) 8%, transparent) 0%, color-mix(in srgb, var(--brand) 3%, transparent) 100%)',
            border: '1px solid color-mix(in srgb, var(--brand) 20%, transparent)',
          }}
        >
          <div className="text-2xl font-bold text-primary">{categoryDiversity}</div>
          <div className="text-xs text-muted-foreground mt-0.5">categories</div>
        </div>
      </div>

      {/* Rekindled hobbies */}
      {rekindled.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Rekindled hobbies</h3>
          <div className="flex flex-wrap gap-1.5">
            {rekindled.map((h) => (
              <Badge
                key={h}
                className="bg-field-coral text-field-coral-ink border border-field-coral-ink capitalize"
              >
                {h}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Most persistent */}
      {topPersistent.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Most persistent</h3>
          <div className="space-y-1.5">
            {topPersistent.map(({ hobby, count }) => {
              const inAllPhases = count === phases.length;
              return (
                <div key={hobby} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-foreground capitalize">{hobby}</span>
                    {inAllPhases && (
                      <span className="text-xs leading-none" title="Present in every phase">
                        ⭐
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: phases.length }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-4 rounded-sm ${
                            i < count ? 'bg-growth' : 'bg-foreground/10'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {count}/{phases.length}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Longest streaks */}
      {longestStreaks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Longest streaks</h3>
          <div className="space-y-1.5">
            {longestStreaks.map(({ hobby, streak, startPhase, endPhase }) => (
              <div key={hobby} className="flex items-center justify-between">
                <span className="text-sm text-foreground capitalize">{hobby}</span>
                <span className="text-xs text-muted-foreground">
                  {streak} phases ({startPhase} → {endPhase})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase transitions */}
      {phaseTransitions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Phase transitions</h3>
          <div className="space-y-1.5">
            {phaseTransitions.map(({ fromPhase, toPhase, majorChange }) => (
              <div key={`${fromPhase}-${toPhase}`} className="flex items-start gap-2 text-xs">
                <span className="text-muted-foreground shrink-0">
                  {fromPhase} → {toPhase}:
                </span>
                <span className={phaseTransitionColor(majorChange)}>{majorChange}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
