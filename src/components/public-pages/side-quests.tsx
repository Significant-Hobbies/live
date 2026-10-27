import { Check, Dices } from 'lucide-react';
import { FadeIn, SpotlightCard } from '~/components/aceternity';
import { QUEST_CATEGORIES, type QuestCategory, type SideQuest } from '~/lib/side-quests';
const CATEGORY_COLORS: Record<QuestCategory, { border: string; bg: string; text: string }> = {
  sensory: {
    border: 'border-foreground/20',
    bg: 'bg-foreground/10',
    text: 'text-foreground',
  },
  creative: {
    border: 'border-field-lilac-ink',
    bg: 'bg-field-lilac',
    text: 'text-field-lilac-ink',
  },
  culinary: {
    border: 'border-primary/30',
    bg: 'bg-primary/10',
    text: 'text-foreground',
  },
  social: {
    border: 'border-field-sky-ink',
    bg: 'bg-field-sky',
    text: 'text-field-sky-ink',
  },
  exploration: {
    border: 'border-field-green-ink',
    bg: 'bg-field-green',
    text: 'text-field-green-ink',
  },
  mindful: {
    border: 'border-field-lilac-ink',
    bg: 'bg-field-lilac',
    text: 'text-field-lilac-ink',
  },
};

const DIFFICULTY_DOTS: Record<string, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

// ── Sub-components ──────────────────────────────────────────────

export function CategoryPill({ category }: { category: QuestCategory }) {
  const cat = QUEST_CATEGORIES.find((c) => c.id === category);
  const colors = CATEGORY_COLORS[category];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colors.border} ${colors.bg} ${colors.text}`}
    >
      {cat?.emoji} {cat?.label}
    </span>
  );
}

export function DifficultyDots({ difficulty }: { difficulty: string }) {
  const count = DIFFICULTY_DOTS[difficulty] ?? 1;
  return (
    <span className="inline-flex items-center gap-0.5" title={difficulty}>
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            i < count ? 'bg-card/400' : 'bg-foreground/10'
          }`}
        />
      ))}
    </span>
  );
}

export function QuestCardView({
  quest,
  isCompleted,
  onComplete,
  onUncomplete,
  showShareButton,
  onRollAgain,
  rollLabel,
  copied,
  handleShare,
}: {
  quest: SideQuest;
  isCompleted: boolean;
  onComplete: (id: string) => void;
  onUncomplete: (id: string) => void;
  showShareButton?: boolean;
  onRollAgain?: () => void;
  rollLabel?: string;
  copied: boolean;
  handleShare: () => void;
}) {
  return (
    <SpotlightCard
      className="mx-auto w-full max-w-4xl overflow-hidden border-0 shadow-[0_18px_50px_color-mix(in_srgb,var(--scrim)_12%,transparent)]"
      innerClassName="p-0"
    >
      <div className="grid md:grid-cols-[0.72fr_1.28fr]">
        <div className="flex min-h-56 flex-col justify-between bg-field-green p-7 text-foreground sm:p-9">
          <div className="flex items-center justify-between">
            <span className="font-semibold">A small departure</span>
            <span className="text-5xl" aria-hidden="true">
              {quest.emoji}
            </span>
          </div>
          <p className="max-w-xs font-serif text-3xl leading-[1.05] tracking-[-0.025em] sm:text-4xl">
            Make today feel different from yesterday.
          </p>
        </div>

        <div className="p-7 sm:p-9">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <CategoryPill category={quest.category} />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              <DifficultyDots difficulty={quest.difficulty} />
              {quest.difficulty}
            </span>
            <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {quest.timeEstimate}
            </span>
          </div>

          <h2 className="font-serif text-3xl font-semibold leading-tight tracking-[-0.025em] text-foreground sm:text-4xl">
            {quest.title}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {quest.description}
          </p>

          {quest.relatedHobbies.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-1.5">
              {quest.relatedHobbies.map((hobby) => (
                <span
                  key={hobby}
                  className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {hobby}
                </span>
              ))}
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {isCompleted ? (
              <button
                type="button"
                onClick={() => onUncomplete(quest.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-border hover:bg-foreground/5"
              >
                Completed
                <Check className="h-4 w-4 text-foreground" />
                <span className="ml-1 text-xs text-subtle">(undo)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onComplete(quest.id)}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                Mark Complete
                <Check className="h-4 w-4" />
              </button>
            )}

            {onRollAgain && (
              <button
                type="button"
                onClick={onRollAgain}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:border-foreground/30 hover:text-foreground"
              >
                {rollLabel ?? 'Roll Again'}
                <Dices className="h-4 w-4 text-muted-foreground" />
              </button>
            )}

            {showShareButton && (
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-border hover:bg-card/40"
              >
                {copied ? 'Copied!' : 'Share'}
              </button>
            )}
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

export function SideQuestHero() {
  return (
    <section className="relative overflow-hidden px-4 py-10 sm:py-14">
      <FadeIn className="relative mx-auto max-w-6xl rounded-2xl bg-field-green px-6 py-12 text-center text-foreground shadow-[0_16px_44px_color-mix(in_srgb,var(--scrim)_10%,transparent)] sm:px-10 sm:py-16">
        <div className="mb-5 inline-flex items-center gap-2 text-base font-bold">
          <span className="h-2 w-2 rounded-full bg-surface" />
          Side Quests
        </div>

        <h1 className="mx-auto mb-5 max-w-4xl font-serif text-5xl font-medium leading-[0.98] tracking-[-0.035em] sm:text-6xl md:text-7xl">
          Take the scenic route through your week.
        </h1>

        <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Fifty small reasons to leave the usual path. Roll one, choose one, or take on the whole
          board.
        </p>

        <div className="mt-8 flex justify-center gap-1.5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-surface"
              style={{ opacity: 0.4 + i * 0.12 }}
            />
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
