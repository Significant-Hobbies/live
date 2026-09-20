'use client';

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Compass,
  Footprints,
  History,
  Plus,
  Search,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { AmbientMusic } from '~/components/ambient-music';
import { LifeGrid } from '~/components/life-grid';
import { StorageModeProvider, StorageModeStatus } from '~/components/storage-mode-provider';
import { completeOnboarding } from '~/lib/actions/onboarding';
import { browserRecordAdapter, readLocalRecord, writeLocalRecord } from '~/lib/local-record-store';
import { createLocalTrajectory } from '~/lib/local-trajectory';
import { syncLocalWorkspaceCookie } from '~/lib/local-workspace-cookie';
import { buildLifeGrid } from '~/lib/mortality';
import type { StorageMode } from '~/lib/storage-mode';
import {
  ChoiceChip,
  DirectionStep,
  Field,
  FutureStep,
  goalsFromDraft,
  InlineAdd,
  saveLocalOnboarding,
  SelectionList,
  Step,
  type Draft,
  type Possibility,
} from './onboarding-steps';

const pastExamples = ['Drawing', 'Football', 'Gaming', 'Piano', 'Reading', 'Cycling', 'Cooking'];
const profiles = [
  { name: 'Steve Jobs', path: 'Calligraphy → electronics → walking' },
  { name: 'Albert Einstein', path: 'Violin → sailing → puzzles' },
  { name: 'Richard Feynman', path: 'Bongos → drawing → safecracking' },
];

function emptyDraft(name: string): Draft {
  return {
    version: 2,
    step: 0,
    name,
    birthDate: '',
    pastHobbies: [],
    pastInput: '',
    desiredExperiences: [],
    desireInput: '',
    annualFocus: '',
    annualGoals: [],
    goalInput: '',
    habit: '',
    trajectoryIntent: '',
    trajectoryConstraint: '',
  };
}

function isDraft(value: unknown): value is Draft {
  if (!value || typeof value !== 'object') return false;
  const draft = value as Partial<Draft>;
  return draft.version === 2 && typeof draft.step === 'number' && Array.isArray(draft.pastHobbies);
}

export function OnboardingFlow({
  user,
  storageMode,
  possibilities,
}: {
  user: { name?: string | null; image?: string | null };
  storageMode: StorageMode;
  possibilities: Possibility[];
}) {
  const router = useRouter();
  const initialName = user.name?.trim() ?? '';
  const [draft, setDraft] = useState(() => emptyDraft(initialName));
  const [loaded, setLoaded] = useState(storageMode === 'account');
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [possibilityQuery, setPossibilityQuery] = useState('');

  useEffect(() => {
    if (storageMode !== 'local') return;
    readLocalRecord(browserRecordAdapter(), 'onboarding:draft', 'onboarding', isDraft).then(
      (saved) => {
        setDraft(
          saved
            ? {
                ...saved,
                step: Math.min(Math.max(0, saved.step), 4),
                annualGoals: Array.isArray(saved.annualGoals)
                  ? saved.annualGoals
                  : saved.annualFocus
                    ? [saved.annualFocus]
                    : [],
                goalInput: typeof saved.goalInput === 'string' ? saved.goalInput : '',
              }
            : emptyDraft(initialName)
        );
        setLoaded(true);
      }
    );
  }, [initialName, storageMode]);

  useEffect(() => {
    if (loaded)
      void writeLocalRecord(browserRecordAdapter(), 'onboarding:draft', 'onboarding', draft);
  }, [draft, loaded]);

  const setStep = (step: number) => setDraft((current) => ({ ...current, step }));
  const togglePast = (hobby: string) =>
    setDraft((current) => ({
      ...current,
      pastHobbies: current.pastHobbies.includes(hobby)
        ? current.pastHobbies.filter((item) => item !== hobby)
        : [...current.pastHobbies, hobby],
    }));
  const togglePossibility = (possibility: Possibility) =>
    setDraft((current) => {
      const selected = current.desiredExperiences.some((item) => item.title === possibility.title);
      return {
        ...current,
        desiredExperiences: selected
          ? current.desiredExperiences.filter((item) => item.title !== possibility.title)
          : current.desiredExperiences.length < 50
            ? [...current.desiredExperiences, possibility]
            : current.desiredExperiences,
      };
    });

  function addPastInput() {
    const values = draft.pastInput
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    if (!values.length) return;
    setDraft((current) => ({
      ...current,
      pastHobbies: [...new Set([...current.pastHobbies, ...values])].slice(0, 12),
      pastInput: '',
    }));
  }

  function addDesireInput() {
    const titles = draft.desireInput
      .split(/\r?\n/)
      .map((title) => title.replace(/^\s*\d+[.)]\s*/, '').trim())
      .filter(Boolean);
    if (!titles.length) return;
    setDraft((current) => ({
      ...current,
      desiredExperiences: [
        ...current.desiredExperiences,
        ...titles.map((title) => ({
          title,
          category: 'achievement' as const,
          emoji: '✨',
        })),
      ]
        .filter(
          (item, index, items) =>
            items.findIndex(
              (candidate) => candidate.title.toLowerCase() === item.title.toLowerCase()
            ) === index
        )
        .slice(0, 50),
      desireInput: '',
    }));
  }

  function addAnnualGoal() {
    const goal = draft.goalInput.trim();
    if (!goal) return;
    setDraft((current) => {
      const currentGoals = goalsFromDraft(current);
      return {
        ...current,
        annualFocus: currentGoals[0] ?? goal,
        annualGoals:
          currentGoals.length >= 8 ||
          currentGoals.some((item) => item.toLowerCase() === goal.toLowerCase())
            ? currentGoals
            : [...currentGoals, goal],
        goalInput: '',
      };
    });
  }

  async function complete() {
    setError(null);
    const annualGoals = goalsFromDraft(draft);
    const trajectoryIntent = annualGoals.join('; ');
    const trajectory = {
      constraintsText: draft.trajectoryConstraint,
      intentText: trajectoryIntent,
      decisionPolicyText:
        'When time, energy, or money opens up, choose the next feasible step toward any current goal.',
      feedbackLoopText: 'Once a month, notice what created energy and adjust the next choice.',
      cadence: 'monthly' as const,
    };
    if (storageMode === 'account') {
      const result = await completeOnboarding({
        name: draft.name,
        birthDate: draft.birthDate,
        pastHobbies: draft.pastHobbies,
        desiredExperiences: draft.desiredExperiences.map(({ title, category }) => ({
          title,
          category,
        })),
        annualGoals,
        habit: draft.habit,
        trajectoryIntent,
        trajectoryConstraint: draft.trajectoryConstraint,
      });
      if (!result.success) {
        setError(result.error ?? 'Your starting point could not be saved.');
        return;
      }
    } else {
      await saveLocalOnboarding(draft, annualGoals, trajectory);
    }
    router.push('/live-more');
    router.refresh();
  }

  const firstName = draft.name.trim().split(' ')[0] || 'there';
  const validBirthDate = /^\d{4}-\d{2}-\d{2}$/.test(draft.birthDate);
  const annualGoals = goalsFromDraft(draft);
  const normalizedPossibilityQuery = possibilityQuery.trim().toLowerCase();
  const matchingPossibilities = normalizedPossibilityQuery
    ? possibilities.filter(
        (possibility) =>
          possibility.title.toLowerCase().includes(normalizedPossibilityQuery) ||
          possibility.category.toLowerCase().includes(normalizedPossibilityQuery)
      )
    : possibilities.slice(0, 18);
  const visiblePossibilities = matchingPossibilities.slice(0, 60);
  const stepBackgrounds = [
    'bg-[#fff8d6]',
    'bg-[#211e18]',
    'bg-[#b9dcf5]',
    'bg-[#ffd0bd]',
    'bg-[#f7e957]',
  ];

  const revealGrid = validBirthDate
    ? buildLifeGrid(new Date(`${draft.birthDate}T12:00:00`), new Set())
    : null;

  const steps = [
    <Step
      key="identity"
      icon={<UserRound />}
      eyebrow="You, not a user profile"
      title="Let’s make time personal."
      copy="Google gives us a starting name when available. You stay in control of both details."
      action="Begin my story"
      onNext={() => setStep(1)}
      disabled={!draft.name.trim() || !validBirthDate}
    >
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <Field label="What should we call you?">
          <input
            autoFocus
            value={draft.name}
            onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
            placeholder="Your name"
            className="field-input"
          />
        </Field>
        <Field label="When were you born?">
          <input
            type="date"
            value={draft.birthDate}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(event) =>
              setDraft((current) => ({ ...current, birthDate: event.target.value }))
            }
            className="field-input"
          />
        </Field>
      </div>
      <p className="mt-3 text-sm text-[#625b50]">Your birth date stays private.</p>
    </Step>,
    <Step
      key="reveal"
      dark
      icon={<Clock3 />}
      eyebrow="The honest math"
      title={
        revealGrid
          ? `${revealGrid.weeksLived.toLocaleString()} weeks in. About ${revealGrid.weeksRemaining.toLocaleString()} to go.`
          : 'The rest is still unwritten.'
      }
      copy="The average life runs about 4,000 weeks. Your number is not a countdown to fear — it is the reason what you choose next matters."
      action="This is why the list matters"
      onNext={() => setStep(2)}
      secondaryAction="Continue"
      onSecondary={() => setStep(2)}
    >
      {revealGrid ? (
        <div className="mt-7 rounded-2xl bg-[#fffdf8] p-4 text-[#211e18] sm:p-5">
          <LifeGrid grid={revealGrid} />
          <div className="mt-3 flex items-center justify-between text-xs font-bold text-[#625b50]">
            <span>{revealGrid.weeksLived.toLocaleString()} weeks lived</span>
            <span>about {revealGrid.weeksRemaining.toLocaleString()} remaining</span>
          </div>
        </div>
      ) : null}
    </Step>,
    <Step
      key="past"
      icon={<History />}
      eyebrow="Your past"
      title="What used to make you lose track of time?"
      copy="These are not résumé entries. They are the raw material of your private life timeline."
      action="Build this chapter"
      onNext={() => setStep(3)}
      disabled={!draft.pastHobbies.length}
    >
      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        {profiles.map((profile) => (
          <div key={profile.name} className="rounded-xl bg-[#eef6fb] p-3">
            <p className="text-sm font-bold">{profile.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-[#4d6070]">{profile.path}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {pastExamples.map((hobby) => (
          <ChoiceChip
            key={hobby}
            selected={draft.pastHobbies.includes(hobby)}
            onClick={() => togglePast(hobby)}
          >
            {hobby}
          </ChoiceChip>
        ))}
      </div>
      <InlineAdd
        value={draft.pastInput}
        onChange={(value) => setDraft((current) => ({ ...current, pastInput: value }))}
        onAdd={addPastInput}
        placeholder="Add your own, separated by commas"
      />
      <SelectionList values={draft.pastHobbies} />
    </Step>,
    <FutureStep
      key="future"
      model={{
        draft,
        setDraft,
        togglePossibility,
        addDesireInput,
        possibilityQuery,
        setPossibilityQuery,
        visiblePossibilities,
        matchingCount: matchingPossibilities.length,
        hasQuery: !!normalizedPossibilityQuery,
        onNext: () => setStep(4),
      }}
    />,
    <DirectionStep
      key="direction"
      model={{
        draft,
        setDraft,
        annualGoals,
        addAnnualGoal,
        firstName,
        pending,
        error,
        onComplete: () => startTransition(complete),
      }}
    />,
  ];

  if (!loaded) return <p className="p-10 text-center">Reading your saved starting point…</p>;

  return (
    <StorageModeProvider mode={storageMode}>
      <div
        className={`relative min-h-screen overflow-hidden px-4 py-5 text-[#211e18] transition-colors duration-500 sm:py-8 ${stepBackgrounds[draft.step] ?? 'bg-[#fbf8ef]'}`}
      >
        <div
          aria-hidden="true"
          className="absolute -left-28 top-24 size-72 rounded-full bg-white/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 bottom-0 size-96 rounded-full bg-[#f7e957]/30 blur-3xl"
        />
        <header
          className={`relative mx-auto flex max-w-6xl items-center justify-between ${draft.step === 1 ? 'text-white' : ''}`}
        >
          <span className="font-serif text-lg font-bold sm:text-xl">Significant Hobbies</span>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <StorageModeStatus />
            </div>
            <AmbientMusic autoPlay={draft.step === 1} />
          </div>
        </header>
        <main className="relative mx-auto mt-5 max-w-6xl sm:mt-7">
          <div
            className={`mb-4 flex items-center justify-between ${draft.step === 1 ? 'text-white' : ''}`}
          >
            <button
              type="button"
              onClick={() => setStep(Math.max(0, draft.step - 1))}
              disabled={draft.step === 0}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-bold disabled:invisible"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
            <span className="text-sm font-bold">
              {draft.step + 1} of {steps.length}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/45">
            <div
              className="h-full rounded-full bg-[#176b4a] transition-all"
              style={{ width: `${((draft.step + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className="grid items-stretch gap-5 lg:grid-cols-[1.18fr_0.82fr]">
            {steps[draft.step]}
            <JourneyCanvas draft={draft} />
          </div>
        </main>
      </div>
    </StorageModeProvider>
  );
}

function JourneyCanvas({ draft }: { draft: Draft }) {
  const annualGoals = goalsFromDraft(draft);
  const chapters = [
    {
      label: 'PAST',
      title: draft.pastHobbies.join(', ') || 'Remember what shaped you',
      color: 'bg-[#b9dcf5]',
    },
    {
      label: 'FUTURE',
      title:
        draft.desiredExperiences.map((possibility) => possibility.title).join(' · ') ||
        'Choose what still calls you',
      color: 'bg-[#ff9d7d]',
    },
    {
      label: 'TODAY',
      title: draft.habit || 'No regular practice needed',
      color: 'bg-[#c5abfa]',
    },
    {
      label: 'DIRECTION',
      title: annualGoals.join(' · ') || 'Notice where the path is going',
      color: 'bg-[#dceabf]',
    },
  ];
  return (
    <aside className="relative mt-5 hidden min-h-[38rem] overflow-hidden rounded-[2rem] bg-[#211e18] p-7 text-white shadow-[0_24px_70px_rgba(46,38,27,0.18)] lg:flex lg:flex-col">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
          Your life atlas
        </p>
        <span className="font-serif text-3xl text-[#f7e957]">0{draft.step + 1}</span>
      </div>
      <div className="my-auto space-y-3">
        {chapters.map((chapter, index) => (
          <div
            key={chapter.label}
            className={`rounded-2xl p-5 text-[#211e18] ${chapter.color} ${index <= (draft.step >= 4 ? 3 : Math.max(0, draft.step - 2)) ? 'ring-2 ring-white/35' : ''}`}
          >
            <p className="text-[0.68rem] font-bold tracking-[0.18em]">{chapter.label}</p>
            <p className="mt-2 line-clamp-4 font-serif text-xl leading-tight">{chapter.title}</p>
          </div>
        ))}
      </div>
      <p className="max-w-sm font-serif text-xl leading-snug text-white/80">
        A life worth remembering is built in both directions—from what shaped you and toward what
        still calls.
      </p>
    </aside>
  );
}
