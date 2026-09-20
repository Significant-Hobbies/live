'use client';

import { ArrowRight, Check, Compass, Footprints, Plus, Search } from 'lucide-react';

import { browserRecordAdapter, readLocalRecord, writeLocalRecord } from '~/lib/local-record-store';
import { createLocalTrajectory } from '~/lib/local-trajectory';
import { syncLocalWorkspaceCookie } from '~/lib/local-workspace-cookie';

export type Possibility = {
  title: string;
  category:
    | 'travel'
    | 'adventure'
    | 'creative'
    | 'achievement'
    | 'relationships'
    | 'contribution'
    | 'food'
    | 'health'
    | 'mindfulness'
    | 'reflection';
  emoji: string;
};

export type Draft = {
  version: 2;
  step: number;
  name: string;
  birthDate: string;
  pastHobbies: string[];
  pastInput: string;
  desiredExperiences: Possibility[];
  desireInput: string;
  annualFocus: string;
  annualGoals: string[];
  goalInput: string;
  habit: string;
  trajectoryIntent: string;
  trajectoryConstraint: string;
};

export function goalsFromDraft(draft: Draft): string[] {
  return Array.isArray(draft.annualGoals) && draft.annualGoals.length > 0
    ? draft.annualGoals
    : draft.annualFocus
      ? [draft.annualFocus]
      : [];
}

type LocalTrajectory = Parameters<typeof createLocalTrajectory>[0];

export async function saveLocalOnboarding(
  draft: Draft,
  annualGoals: string[],
  trajectory: LocalTrajectory
) {
  const adapter = browserRecordAdapter();
  await Promise.all([
    writeLocalRecord(adapter, 'profile:draft', 'profile', { name: draft.name }),
    writeLocalRecord(adapter, 'profile:birth-date', 'profile', { birthDate: draft.birthDate }),
    writeLocalRecord(adapter, 'onboarding:profile', 'onboarding', {
      name: draft.name,
      birthDate: draft.birthDate,
      pastHobbies: draft.pastHobbies,
      desiredExperiences: draft.desiredExperiences,
      annualFocus: annualGoals[0] ?? '',
      annualGoals,
    }),
    writeLocalRecord(adapter, 'timeline-draft-new', 'timelines', {
      title: 'My life so far',
      phases: [
        {
          id: `local-earlier-${crypto.randomUUID()}`,
          label: 'Earlier chapters',
          hobbies: draft.pastHobbies.map((name) => ({ name })),
          order: 0,
        },
      ],
    }),
    writeLocalRecord(adapter, 'onboarding:bucket-items', 'bucket-list', {
      items: draft.desiredExperiences,
      annualFocus: annualGoals[0] ?? '',
      annualGoals,
    }),
  ]);
  const daily = (await readLocalRecord(adapter, 'daily:state', 'daily', isDailyState)) ?? {
    habits: [],
    logs: [],
    journals: [],
  };
  if (
    draft.habit.trim() &&
    !daily.habits.some((habit) => String(habit.name).toLowerCase() === draft.habit.toLowerCase())
  ) {
    daily.habits.push({
      id: `local-habit-${crypto.randomUUID()}`,
      name: draft.habit,
      status: 'active',
      targetFrequency: 'daily',
      icon: null,
      sourceQuestId: null,
      commitmentId: null,
    });
  }
  await writeLocalRecord(adapter, 'daily:state', 'daily', daily);
  await createLocalTrajectory(trajectory, adapter).catch(() => undefined);
  syncLocalWorkspaceCookie(true);
}

type FutureStepModel = {
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
  togglePossibility: (possibility: Possibility) => void;
  addDesireInput: () => void;
  possibilityQuery: string;
  setPossibilityQuery: (value: string) => void;
  visiblePossibilities: Possibility[];
  matchingCount: number;
  hasQuery: boolean;
  onNext: () => void;
};

export function FutureStep({ model }: { model: FutureStepModel }) {
  const {
    draft,
    setDraft,
    togglePossibility,
    addDesireInput,
    possibilityQuery,
    setPossibilityQuery,
    visiblePossibilities,
    matchingCount,
    hasQuery,
    onNext,
  } = model;
  return (
    <Step
      icon={<Compass />}
      eyebrow="Your future"
      title="What would make you glad you said yes?"
      copy="Start with a few sparks, search thousands of paths, or paste the personal list you already carry. Strange and specific is welcome."
      action="Keep these possibilities"
      onNext={onNext}
      disabled={!draft.desiredExperiences.length}
    >
      {draft.desiredExperiences.length ? (
        <div className="mt-6 flex flex-wrap gap-2" aria-label="Your chosen possibilities">
          {draft.desiredExperiences.map((possibility) => (
            <button
              key={possibility.title}
              type="button"
              onClick={() => togglePossibility(possibility)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f7e957] px-4 text-left text-sm font-bold text-[#211e18] focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label={`Remove ${possibility.title}`}
            >
              <span aria-hidden="true">{possibility.emoji}</span>
              <span>{possibility.title}</span>
              <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      ) : null}
      <label className="relative mt-5 block">
        <span className="sr-only">Search possibilities</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#625b50]"
        />
        <input
          type="search"
          value={possibilityQuery}
          onChange={(event) => setPossibilityQuery(event.target.value)}
          placeholder="Search travel, creative projects, adventures…"
          className="field-input pl-12"
        />
      </label>
      <div className="mt-3 grid max-h-[25rem] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {visiblePossibilities.map((possibility) => {
          const selected = draft.desiredExperiences.some(
            (item) => item.title === possibility.title
          );
          return (
            <button
              key={possibility.title}
              type="button"
              data-possibility-option
              data-possibility-category={possibility.category}
              aria-pressed={selected}
              onClick={() => togglePossibility(possibility)}
              className={`flex min-h-20 items-center gap-3 rounded-xl border-2 p-3 text-left ${selected ? 'border-[#211e18] bg-[#f7e957]' : 'border-[#dfd5c4] bg-white'}`}
            >
              <span className="text-2xl">{possibility.emoji}</span>
              <span className="flex-1 text-sm font-bold leading-snug">{possibility.title}</span>
              {selected ? <Check className="size-4" /> : null}
            </button>
          );
        })}
        {!hasQuery ? (
          <div className="rounded-xl bg-[#dceabf] px-4 py-5 text-center sm:col-span-2">
            <p className="font-serif text-lg font-medium">This is only the beginning.</p>
            <p className="mt-1 text-sm leading-relaxed text-[#405032]">
              Search 5,000+ paths—or add something only you could imagine. The possibilities are
              nearly endless.
            </p>
          </div>
        ) : null}
        {!visiblePossibilities.length ? (
          <div className="rounded-xl bg-[#fff8d6] p-5 sm:col-span-2">
            <p className="font-serif text-xl">Nothing in the atlas matches that yet.</p>
            <p className="mt-1 text-sm text-[#625b50]">Add your own possibility below.</p>
          </div>
        ) : null}
      </div>
      {matchingCount > visiblePossibilities.length ? (
        <p className="mt-3 text-sm text-[#625b50]">
          Showing the first {visiblePossibilities.length}. Add another word to narrow the search.
        </p>
      ) : null}
      <div className="mt-5 rounded-2xl bg-[#fff8d6] p-4">
        <label className="block text-sm font-bold" htmlFor="onboarding-bucket-list-input">
          Add your own possibilities
        </label>
        <p className="mt-1 text-sm text-[#625b50]">
          Add one idea, or paste a numbered list. Each line becomes its own item.
        </p>
        <textarea
          id="onboarding-bucket-list-input"
          value={draft.desireInput}
          onChange={(event) =>
            setDraft((current) => ({ ...current, desireInput: event.target.value }))
          }
          placeholder={'1. Start my band\n2. Fly a plane\n3. Write a song'}
          className="field-input mt-3 min-h-28 resize-y py-3"
          disabled={draft.desiredExperiences.length >= 50}
        />
        <button
          type="button"
          onClick={addDesireInput}
          disabled={draft.desiredExperiences.length >= 50 || !draft.desireInput.trim()}
          className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#211e18] px-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="size-4" /> Add to my bucket list
        </button>
      </div>
      {draft.desiredExperiences.length >= 50 ? (
        <p className="mt-2 text-sm text-[#625b50]">
          Fifty is enough for onboarding. You can keep growing the list inside Live More.
        </p>
      ) : null}
    </Step>
  );
}

type DirectionStepModel = {
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
  annualGoals: string[];
  addAnnualGoal: () => void;
  firstName: string;
  pending: boolean;
  error: string | null;
  onComplete: () => void;
};

export function DirectionStep({ model }: { model: DirectionStepModel }) {
  const { draft, firstName, pending, error, onComplete, annualGoals } = model;
  return (
    <Step
      icon={<Footprints />}
      eyebrow="What's true right now"
      title={`What does this year actually allow, ${firstName}?`}
      copy="Name what matters this year, a small practice only if it helps, and what life currently looks like. Live turns all three into a flexible direction — and each week, your log asks what you lived."
      action={pending ? 'Building your life atlas…' : 'Enter my life'}
      onNext={onComplete}
      disabled={pending || !annualGoals.length || !draft.trajectoryConstraint.trim()}
    >
      <div className="mt-7 space-y-6">
        <GoalPicker model={model} />
        <DirectionFields model={model} />
      </div>
      {error ? (
        <p role="alert" className="mt-4 font-bold text-red-700">
          {error}
        </p>
      ) : null}
    </Step>
  );
}

function GoalPicker({ model }: { model: DirectionStepModel }) {
  const { draft, setDraft, annualGoals, addAnnualGoal } = model;
  return (
    <div>
      <p className="text-sm font-bold">Goals for {new Date().getFullYear()}</p>
      {annualGoals.length ? (
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Goals for this year">
          {annualGoals.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() =>
                setDraft((current) => {
                  const nextGoals = goalsFromDraft(current).filter((item) => item !== goal);
                  return {
                    ...current,
                    annualFocus: nextGoals[0] ?? '',
                    annualGoals: nextGoals,
                  };
                })
              }
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f7e957] px-4 text-sm font-bold"
              aria-label={`Remove goal ${goal}`}
            >
              {goal} <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      ) : null}
      <InlineAdd
        value={draft.goalInput}
        onChange={(value) => setDraft((current) => ({ ...current, goalInput: value }))}
        onAdd={addAnnualGoal}
        placeholder="A goal for this year"
        label="Add a goal for this year"
        buttonLabel="Add yearly goal"
        disabled={annualGoals.length >= 8}
      />
      {draft.desiredExperiences.length ? (
        <>
          <p className="mt-4 text-sm font-bold text-[#625b50]">
            Or borrow something from your bucket list
          </p>
          <div className="mt-3 grid gap-2">
            {draft.desiredExperiences.map((item) => (
              <button
                key={item.title}
                type="button"
                data-focus-option
                aria-pressed={annualGoals.includes(item.title)}
                disabled={!annualGoals.includes(item.title) && annualGoals.length >= 8}
                onClick={() =>
                  setDraft((current) => {
                    const currentGoals = goalsFromDraft(current);
                    const nextGoals = currentGoals.includes(item.title)
                      ? currentGoals.filter((goal) => goal !== item.title)
                      : [...currentGoals, item.title];
                    return {
                      ...current,
                      annualFocus: nextGoals[0] ?? '',
                      annualGoals: nextGoals,
                    };
                  })
                }
                className={`flex min-h-14 items-center justify-between rounded-xl border-2 px-4 text-left font-serif text-lg disabled:cursor-not-allowed disabled:opacity-40 ${annualGoals.includes(item.title) ? 'border-[#211e18] bg-[#f7e957]' : 'border-[#d6c9e8] bg-white/70'}`}
              >
                <span>
                  {item.emoji} {item.title}
                </span>
                {annualGoals.includes(item.title) ? <Check className="size-4" /> : null}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function DirectionFields({ model }: { model: DirectionStepModel }) {
  const { draft, setDraft, annualGoals } = model;
  return (
    <>
      <Field label="A small daily practice — only if it helps">
        <input
          value={draft.habit}
          onChange={(event) => setDraft((current) => ({ ...current, habit: event.target.value }))}
          placeholder={
            annualGoals[0]
              ? `A small practice that supports “${annualGoals[0]}”`
              : 'Read five pages — or leave blank'
          }
          className="field-input mt-3"
        />
      </Field>

      <Field label="What is true about my life right now">
        <textarea
          value={draft.trajectoryConstraint}
          onChange={(event) =>
            setDraft((current) => ({ ...current, trajectoryConstraint: event.target.value }))
          }
          placeholder="My weekdays are busy, but I can protect one evening and part of Sunday."
          className="field-input mt-3 min-h-24 resize-none py-3"
        />
      </Field>

      <div className="rounded-2xl bg-[#dceabf] p-4 text-sm leading-relaxed">
        <p>
          <strong>Decision policy:</strong> when time, energy, or money opens up, choose the next
          feasible step toward any current goal.
        </p>
        <p className="mt-2">
          <strong>Feedback loop:</strong> once a month, notice what created energy and adjust.
        </p>
        <p className="mt-2">
          <strong>Weekly log:</strong> each week, Live asks what you lived — that is how the list
          stays honest.
        </p>
      </div>
    </>
  );
}

export function Step({
  icon,
  eyebrow,
  title,
  copy,
  action,
  onNext,
  secondaryAction,
  onSecondary,
  disabled,
  dark,
  children,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  copy: string;
  action: string;
  onNext: () => void;
  secondaryAction?: string;
  onSecondary?: () => void;
  disabled?: boolean;
  dark?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={`mt-5 rounded-[2rem] border p-6 shadow-[0_22px_65px_rgba(72,58,38,0.09)] sm:p-10 ${dark ? 'border-white/15 bg-[#15140f] text-white' : 'border-[#d9cfbd] bg-[#fffdf8]'}`}
    >
      <div
        className={`flex size-12 items-center justify-center rounded-full ${dark ? 'bg-[#f7e957] text-[#211e18]' : 'bg-[#f7e957]'}`}
      >
        {icon}
      </div>
      <p
        className={`mt-7 text-sm font-bold uppercase tracking-[0.18em] ${dark ? 'text-[#a8dc91]' : 'text-[#176b4a]'}`}
      >
        {eyebrow}
      </p>
      <h1 className="mt-2 font-serif text-4xl font-medium tracking-[-0.035em] sm:text-5xl">
        {title}
      </h1>
      <p
        className={`mt-4 max-w-xl text-base leading-relaxed ${dark ? 'text-white/68' : 'text-[#625b50]'}`}
      >
        {copy}
      </p>
      {children}
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className={`mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 font-bold disabled:opacity-40 sm:w-auto ${dark ? 'bg-[#f7e957] text-[#211e18]' : 'bg-[#211e18] text-white'}`}
      >
        {action} <ArrowRight className="size-4" />
      </button>
      {secondaryAction && onSecondary ? (
        <button
          type="button"
          onClick={onSecondary}
          className={`mt-3 flex min-h-11 w-full items-center justify-center text-sm font-bold underline underline-offset-4 sm:w-auto ${dark ? 'text-white/70' : 'text-[#625b50]'}`}
        >
          {secondaryAction}
        </button>
      ) : null}
    </section>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-bold">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function ChoiceChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4 text-sm font-bold ${selected ? 'border-[#211e18] bg-[#f7e957]' : 'border-[#d9cfbd] bg-white'}`}
    >
      {selected ? <Check className="size-3.5" /> : null}
      {children}
    </button>
  );
}

export function InlineAdd({
  value,
  onChange,
  onAdd,
  placeholder,
  label,
  buttonLabel = 'Add',
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  placeholder: string;
  label?: string;
  buttonLabel?: string;
  disabled?: boolean;
}) {
  return (
    <div className="mt-4 flex gap-2">
      <input
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            onAdd();
          }
        }}
        placeholder={placeholder}
        className="field-input min-w-0 flex-1"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#211e18] text-white disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={buttonLabel}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

export function SelectionList({ values }: { values: string[] }) {
  if (!values.length) return null;
  return (
    <p className="mt-4 text-sm text-[#625b50]">
      Your chapters begin with: <strong>{values.join(' · ')}</strong>
    </p>
  );
}

function isDailyState(
  value: unknown
): value is { habits: Array<Record<string, unknown>>; logs: unknown[]; journals: unknown[] } {
  if (!value || typeof value !== 'object') return false;
  const state = value as { habits?: unknown; logs?: unknown; journals?: unknown };
  return Array.isArray(state.habits) && Array.isArray(state.logs) && Array.isArray(state.journals);
}
