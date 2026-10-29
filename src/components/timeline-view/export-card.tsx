import { getCategoryForHobby } from '~/lib/hobbies';
import { computeInsights } from '~/lib/insights';
import { computePersonality } from '~/lib/personality';
import type { TimelineData } from '~/lib/types';

interface Props {
  timeline: TimelineData;
  exportRef?: React.RefObject<HTMLDivElement | null>;
}

export function ExportCard({ timeline, exportRef }: Props) {
  const { phases } = timeline;
  const insights = phases.length >= 2 ? computeInsights(phases) : null;
  const personality = phases.length > 0 ? computePersonality(phases) : null;
  const totalHobbies = new Set(phases.flatMap((p) => p.hobbies.map((h) => h.name.toLowerCase())))
    .size;
  const allHobbies = phases.flatMap((p) => p.hobbies).slice(0, 20);

  return (
    <div
      ref={exportRef}
      className="w-[600px] rounded-2xl bg-background p-8 overflow-hidden select-none"
      style={{
        background: 'var(--card)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxShadow: '0 0 60px color-mix(in srgb, var(--success) 8%, transparent)',
      }}
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 40% at 50% -5%, color-mix(in srgb, var(--success) 15%, transparent) 0%, transparent 70%)',
        }}
      />

      {/* Header */}
      <div className="relative mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-growth mb-1">significanthobbies</p>
            <h1 className="text-2xl font-bold text-foreground">
              {timeline.title ?? 'My Hobby Journey'}
            </h1>
            {timeline.user?.username && (
              <p className="mt-0.5 text-sm text-muted-foreground">@{timeline.user.username}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-growth">{totalHobbies}</div>
            <div className="text-xs text-muted-foreground">hobbies</div>
          </div>
        </div>
      </div>

      {/* Phase timeline */}
      <div className="relative mb-6">
        <div className="flex gap-px overflow-hidden rounded-lg">
          {phases.map((phase, i) => (
            <div key={phase.id} className="flex-1 bg-muted" style={{ minWidth: 0 }}>
              <div
                className="h-2"
                style={{
                  background: `hsl(${160 - i * (120 / Math.max(phases.length - 1, 1))}, 70%, 50%)`,
                }}
              />
              <div className="px-2 py-1.5">
                <p className="text-xs font-medium text-muted-foreground truncate">{phase.label}</p>
                <p className="text-xs text-muted-foreground">{phase.hobbies.length} hobbies</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hobby cloud */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {allHobbies.map((hobby) => {
          const cat = getCategoryForHobby(hobby.name);
          return (
            <span
              key={hobby.name}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/80 px-2.5 py-0.5 text-xs text-muted-foreground"
            >
              {cat && <span>{cat.emoji}</span>}
              {hobby.name}
            </span>
          );
        })}
        {totalHobbies > 20 && (
          <span className="inline-flex items-center rounded-full border border-border bg-muted/80 px-2.5 py-0.5 text-xs text-muted-foreground">
            +{totalHobbies - 20} more
          </span>
        )}
      </div>

      {/* Personality */}
      {personality && (
        <div className="mb-6 rounded-lg bg-muted/40 border border-border/50 px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl leading-none">{personality.archetype.emoji}</span>
            <span className="font-bold text-growth">{personality.archetype.name}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{personality.narrative}</p>
        </div>
      )}

      {/* Insights row */}
      {insights && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg bg-muted/60 p-3 text-center">
            <div className="text-xl font-bold text-field-coral-ink">
              {insights.rekindled.length}
            </div>
            <div className="text-xs text-muted-foreground">rekindled</div>
          </div>
          <div className="rounded-lg bg-muted/60 p-3 text-center">
            <div className="text-xl font-bold text-field-sky-ink">
              {insights.mostPersistent.filter((h) => h.count >= 2).length}
            </div>
            <div className="text-xs text-muted-foreground">persistent</div>
          </div>
          <div className="rounded-lg bg-muted/60 p-3 text-center">
            <div className="text-xl font-bold text-field-lilac-ink">{phases.length}</div>
            <div className="text-xs text-muted-foreground">phases</div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex gap-1">
          {['🎨', '🎵', '💪', '📚', '🎮'].map((emoji) => (
            <span key={emoji} className="text-sm opacity-60">
              {emoji}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">significanthobbies.com</p>
      </div>
    </div>
  );
}
