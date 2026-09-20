'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Link2, Plus, Sparkles, Trash2 } from 'lucide-react';

import { PreviewBanner } from '~/components/preview-banner';
import { Button } from '~/components/ui/button';
import { FREQUENCY_OPTIONS, frequencyMeta } from '~/lib/habit-utils';
import { parseHabitCommitmentValue, type HabitCommitmentChoice } from '~/lib/habit-commitment';
import { cn } from '~/lib/utils';

interface Habit {
  id: string;
  name: string;
  status: string;
  targetFrequency: string;
  icon: string | null;
  sourceQuestId: string | null;
  commitmentId?: string | null;
}

interface HabitLog {
  id: string;
  habitId: string;
  dayDate: string;
  completed: boolean;
}

export type HabitsExperienceProps = {
  firstName: string;
  today: string;
  habits: Habit[];
  habitLogs: HabitLog[];
  habitCommitmentChoices?: HabitCommitmentChoice[];
  /**
   * Signed-out preview of someone else's month.
   *
   * Habit ticks stay interactive — the daily write actions return early without
   * a session, so a tick is a harmless in-session gesture. Habit add/delete is
   * hidden too, since router.refresh() would reset it to the sample set and
   * read as a bug.
   */
  preview?: boolean;
  localMode?: boolean;
  createHabit: (
    name: string,
    targetFrequency?: string,
    icon?: string,
    commitmentId?: string | null
  ) => Promise<{ id: string; name: string } | null>;
  deleteHabit: (id: string) => Promise<void>;
  setHabitCommitment: (habitId: string, commitmentId: string | null) => Promise<boolean>;
  toggleHabitLog: (habitId: string, dayDate: string, completed: boolean) => Promise<void>;
};

const EMOJI_CHOICES = ['📚', '🏃', '🧘', '✍️', '🎸', '🎨', '💪', '🧠', '🌅', '💧', '🥗', '😴'];

function calendarDate(dayDate: string): Date {
  const [year, month, day] = dayDate.split('-').map(Number);
  return new Date(year!, month! - 1, day!, 12);
}

export function HabitsExperience({
  firstName,
  today,
  habits: initialHabits,
  habitLogs: initialLogs,
  habitCommitmentChoices = [],
  preview = false,
  localMode = false,
  createHabit,
  deleteHabit,
  setHabitCommitment,
  toggleHabitLog,
}: HabitsExperienceProps) {
  const [habits, setHabits] = useState(initialHabits);
  const [logs, setLogs] = useState(initialLogs);
  const [newHabit, setNewHabit] = useState('');
  const [newHabitFreq, setNewHabitFreq] = useState('daily');
  const [newHabitIcon, setNewHabitIcon] = useState('');
  const [newHabitCommitmentId, setNewHabitCommitmentId] = useState('');
  const [showHabitManager, setShowHabitManager] = useState(false);
  const [habitLinkStatus, setHabitLinkStatus] = useState<{
    habitId: string;
    status: 'saving' | 'saved' | 'error';
  } | null>(null);
  const [habitCreateError, setHabitCreateError] = useState<string | null>(null);
  const [habitMutationError, setHabitMutationError] = useState<string | null>(null);
  const [habitCreating, setHabitCreating] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const dateString = calendarDate(today).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  function isHabitDone(habitId: string): boolean {
    return logs.some((l) => l.habitId === habitId && l.completed);
  }

  function toggleHabit(habitId: string) {
    const completed = !isHabitDone(habitId);
    const previousLogs = logs;
    setHabitMutationError(null);
    // Optimistic update
    setLogs((prev) => {
      const existing = prev.find((l) => l.habitId === habitId);
      if (existing) {
        return prev.map((l) => (l.habitId === habitId ? { ...l, completed } : l));
      }
      return [...prev, { id: 'temp', habitId, dayDate: today, completed }];
    });
    startTransition(async () => {
      try {
        await toggleHabitLog(habitId, today, completed);
      } catch {
        setLogs(previousLogs);
        setHabitMutationError('Could not update that check-in. Your previous state was restored.');
      }
    });
  }

  function handleAddHabit() {
    const trimmed = newHabit.trim();
    if (!trimmed) return;
    setHabitCreateError(null);
    setHabitCreating(true);
    startTransition(async () => {
      try {
        const created = await createHabit(
          trimmed,
          newHabitFreq,
          newHabitIcon || undefined,
          parseHabitCommitmentValue(newHabitCommitmentId)
        );
        if (!created) throw new Error('Habit was not created');
        if (localMode) {
          setHabits((current) => [
            ...current,
            {
              id: created.id,
              name: created.name,
              status: 'active',
              targetFrequency: newHabitFreq,
              icon: newHabitIcon || null,
              sourceQuestId: null,
              commitmentId: parseHabitCommitmentValue(newHabitCommitmentId),
            },
          ]);
        }
        setNewHabit('');
        setNewHabitFreq('daily');
        setNewHabitIcon('');
        setNewHabitCommitmentId('');
        if (!localMode) router.refresh();
      } catch {
        setHabitCreateError(
          'Could not add this habit. Check the related commitment and try again.'
        );
      } finally {
        setHabitCreating(false);
      }
    });
  }

  function handleHabitCommitmentChange(habitId: string, value: string) {
    const commitmentId = parseHabitCommitmentValue(value);
    const previousCommitmentId = habits.find((habit) => habit.id === habitId)?.commitmentId ?? null;
    setHabitLinkStatus({ habitId, status: 'saving' });
    setHabits((current) =>
      current.map((habit) => (habit.id === habitId ? { ...habit, commitmentId } : habit))
    );
    startTransition(async () => {
      try {
        const updated = await setHabitCommitment(habitId, commitmentId);
        if (!updated) throw new Error('Habit was not updated');
        setHabitLinkStatus({ habitId, status: 'saved' });
        if (!localMode) router.refresh();
      } catch {
        setHabits((current) =>
          current.map((habit) =>
            habit.id === habitId ? { ...habit, commitmentId: previousCommitmentId } : habit
          )
        );
        setHabitLinkStatus({ habitId, status: 'error' });
      }
    });
  }

  function handleDeleteHabit(id: string) {
    const habit = habits.find((item) => item.id === id);
    if (!habit) return;
    if (!window.confirm(`Remove “${habit.name}”? Past check-ins will remain in your history.`)) {
      return;
    }
    setHabitMutationError(null);
    setHabits((prev) => prev.filter((h) => h.id !== id));
    startTransition(async () => {
      try {
        await deleteHabit(id);
      } catch {
        setHabits((current) =>
          current.some((item) => item.id === habit.id) ? current : [...current, habit]
        );
        setHabitMutationError(`Could not remove ${habit.name}. It has been restored.`);
      }
    });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:py-8">
      {preview && (
        <PreviewBanner route="/habits">
          One stranger&apos;s habit list. Check-ins are only an in-session preview and are not
          saved.
        </PreviewBanner>
      )}
      <section className="relative overflow-hidden rounded-[1.5rem] bg-[#dceabf] px-5 py-5 text-[#24351f] shadow-[0_10px_30px_rgba(66,55,22,0.08)] sm:px-7 sm:py-6">
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-5 w-5" />
              {dateString}
            </div>
            <h1 className="mt-2 font-serif text-3xl font-medium leading-tight tracking-[-0.02em] sm:text-4xl">
              Keep it small, {firstName}.
            </h1>
            <p className="mt-2 text-sm opacity-75">
              The small repeated thing. Checked in, never scored.
            </p>
          </div>
          <p className="rounded-full bg-white/65 px-3 py-2 text-xs font-semibold">
            {logs.some((log) => log.completed)
              ? `${logs.filter((log) => log.completed).length} checked in today`
              : 'Ready when you are'}
          </p>
        </div>
      </section>

      <div id="habits" className="scroll-mt-24 space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <h3 className="font-serif text-3xl font-medium text-foreground">Habits</h3>
            <p className="mt-2 text-base text-muted-foreground">
              The small repeated thing. Checked in, never scored.
            </p>
          </div>
          {!preview && (
            <button
              onClick={() => setShowHabitManager(!showHabitManager)}
              className="min-h-11 rounded px-2 text-base font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
            >
              {showHabitManager ? 'Done' : 'Manage'}
            </button>
          )}
        </div>

        {showHabitManager && habitCommitmentChoices.length > 0 && (
          <div className="rounded-lg border border-border/60 bg-card px-3 py-2.5">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Related commitments are private planning context. Habit check-ins never create proof
              or commitment progress.
            </p>
          </div>
        )}

        {habitMutationError && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {habitMutationError}
          </p>
        )}

        {habits.length === 0 && !showHabitManager ? (
          <div className="flex flex-col gap-5 rounded-2xl bg-[#dceabf] p-5 text-[#24351f] sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/65">
                <Sparkles className="size-5" />
              </div>
              <div>
                <p className="font-serif text-2xl font-medium">Begin with one repeatable thing.</p>
                <p className="mt-1 text-sm leading-relaxed text-[#4f6542]">
                  Small enough to do on an ordinary day.
                </p>
              </div>
            </div>
            {!preview && (
              <Button
                type="button"
                onClick={() => setShowHabitManager(true)}
                className="shrink-0 bg-[#211e18] text-white hover:bg-[#37332b]"
              >
                Add your first habit
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#ece5d8] overflow-hidden rounded-2xl bg-white shadow-[0_12px_36px_rgba(66,55,22,0.08)]">
            {habits.map((habit) => {
              const linkedCommitment = habit.commitmentId
                ? habitCommitmentChoices.find((choice) => choice.id === habit.commitmentId)
                : null;
              const done = isHabitDone(habit.id);
              const freqLabel = frequencyMeta(habit.targetFrequency).label;

              return (
                <div
                  key={habit.id}
                  className={cn(
                    'flex items-center gap-4 px-4 py-4 transition-colors sm:px-5',
                    done ? 'bg-[#eef6df]' : 'bg-white hover:bg-[#fffdf7]'
                  )}
                >
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={cn(
                      'flex size-11 shrink-0 items-center justify-center rounded-full border-2 transition-[background-color,border-color,transform] hover:scale-105 focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none',
                      done
                        ? 'border-[#176b4a] bg-[#176b4a] text-white'
                        : 'border-[#cfc5b3] bg-[#fffdf8] hover:border-[#8a7c64]'
                    )}
                    aria-label={
                      done ? `Mark ${habit.name} as not done` : `Mark ${habit.name} as done`
                    }
                  >
                    {done && <Check className="size-5" strokeWidth={2.5} />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-start gap-3">
                      {habit.icon && (
                        <span className="pt-0.5 text-xl leading-none">{habit.icon}</span>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p
                            className={cn(
                              'line-clamp-2 text-base font-semibold leading-snug',
                              done ? 'text-[#4f6542]' : 'text-foreground'
                            )}
                          >
                            {habit.name}
                          </p>
                          {habit.sourceQuestId && (
                            <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-primary">
                              Quest
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-subtle">{freqLabel}</p>
                        {linkedCommitment && !showHabitManager && (
                          <Link
                            href={linkedCommitment.href}
                            prefetch={false}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Open ${linkedCommitment.label} in a new tab`}
                            className="mt-1 inline-flex min-h-8 items-center gap-1 text-xs text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                          >
                            <Link2 className="h-3 w-3 text-primary" />
                            For {linkedCommitment.label}
                            <span className="sr-only"> (opens in a new tab)</span>
                          </Link>
                        )}
                        {showHabitManager && habitCommitmentChoices.length > 0 && (
                          <div className="mt-3">
                            <label htmlFor={`habit-commitment-${habit.id}`} className="sr-only">
                              Related commitment for {habit.name}
                            </label>
                            <select
                              id={`habit-commitment-${habit.id}`}
                              value={habit.commitmentId ?? ''}
                              disabled={
                                habitLinkStatus?.habitId === habit.id &&
                                habitLinkStatus.status === 'saving'
                              }
                              onChange={(event) =>
                                handleHabitCommitmentChange(habit.id, event.target.value)
                              }
                              className="min-h-11 w-full max-w-full rounded-md border border-border bg-background px-2 text-xs text-foreground outline-none disabled:cursor-wait disabled:opacity-60 focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/25"
                            >
                              <option value="">No related commitment</option>
                              {habitCommitmentChoices.map((choice) => (
                                <option key={choice.id} value={choice.id}>
                                  {choice.label}
                                </option>
                              ))}
                            </select>
                            {habitLinkStatus?.habitId === habit.id && (
                              <p
                                role={habitLinkStatus.status === 'error' ? 'alert' : 'status'}
                                aria-live={
                                  habitLinkStatus.status === 'error' ? 'assertive' : 'polite'
                                }
                                className={cn(
                                  'mt-1.5 text-xs',
                                  habitLinkStatus.status === 'error'
                                    ? 'text-destructive'
                                    : 'text-subtle'
                                )}
                              >
                                {habitLinkStatus.status === 'saving' && 'Saving link…'}
                                {habitLinkStatus.status === 'saved' && 'Related commitment saved.'}
                                {habitLinkStatus.status === 'error' &&
                                  `Could not update ${habit.name}. Try again.`}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delete (manage mode) */}
                  {showHabitManager && (
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-subtle transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50"
                      aria-label={`Delete ${habit.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {showHabitManager && (
          <div className="mt-4 space-y-3 rounded-xl border border-border bg-card p-4 shadow-soft">
            {/* Name input */}
            <div>
              <label
                htmlFor="new-habit-name"
                className="mb-1.5 block text-xs text-muted-foreground"
              >
                Habit name
              </label>
              <input
                id="new-habit-name"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
                placeholder="Habit name (e.g. Read 20 pages)"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-foreground/40 focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none"
              />
            </div>

            {/* Icon picker */}
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Icon (optional)</p>
              <div className="flex flex-wrap gap-1.5">
                {EMOJI_CHOICES.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewHabitIcon(newHabitIcon === emoji ? '' : emoji)}
                    className={`flex size-11 items-center justify-center rounded-md border text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 ${
                      newHabitIcon === emoji
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-foreground/30'
                    }`}
                    aria-label={`Select ${emoji} icon`}
                    aria-pressed={newHabitIcon === emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency selector */}
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Target frequency</p>
              <div className="flex flex-wrap gap-1.5">
                {FREQUENCY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setNewHabitFreq(opt.value)}
                    className={`min-h-11 rounded-md border px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 ${
                      newHabitFreq === opt.value
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                    }`}
                    aria-pressed={newHabitFreq === opt.value}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {habitCommitmentChoices.length > 0 && (
              <div>
                <label
                  htmlFor="new-habit-commitment"
                  className="mb-1.5 block text-xs text-muted-foreground"
                >
                  Related commitment <span className="text-subtle">(optional)</span>
                </label>
                <select
                  id="new-habit-commitment"
                  value={newHabitCommitmentId}
                  onChange={(event) => setNewHabitCommitmentId(event.target.value)}
                  className="min-h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/25"
                >
                  <option value="">No related commitment</option>
                  {habitCommitmentChoices.map((choice) => (
                    <option key={choice.id} value={choice.id}>
                      {choice.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {habitCreateError && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive"
              >
                {habitCreateError}
              </p>
            )}

            {/* Add button */}
            <Button
              size="sm"
              onClick={handleAddHabit}
              disabled={!newHabit.trim() || habitCreating}
              className="w-full"
            >
              <Plus className="h-3.5 w-3.5" />
              {habitCreating ? 'Adding habit…' : 'Add habit'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
