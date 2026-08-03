'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { lifeInWeeksFromDate, parseBirthDate, type LifeInWeeks } from '~/lib/life-in-weeks';
import { browserRecordAdapter, readLocalRecord, writeLocalRecord } from '~/lib/local-record-store';
import { saveBirthDate } from '~/lib/actions/user';
import { WeeksGrid } from './weeks-grid';

const STORAGE_KEY = 'profile:birth-date';
const LEGACY_STORAGE_KEY = 'sh:birth-year';
const isBirthDateRecord = (value: unknown): value is { birthDate: string } =>
  Boolean(
    value &&
      typeof value === 'object' &&
      typeof (value as { birthDate?: unknown }).birthDate === 'string'
  );
const isOnboardingProfile = (value: unknown): value is { birthDate?: string } =>
  Boolean(value && typeof value === 'object');

/** Groups the digits so 1,847 reads at a glance. */
const fmt = new Intl.NumberFormat('en-US');

export function LifeInWeeksClient({
  initialBirthDate = null,
  initialOnboardingComplete = false,
  storageMode = 'local',
}: {
  initialBirthDate?: string | null;
  initialOnboardingComplete?: boolean;
  storageMode?: 'local' | 'account';
}) {
  const validInitialBirthDate = initialBirthDate ? parseBirthDate(initialBirthDate) : null;
  const [raw, setRaw] = useState(validInitialBirthDate ?? '');
  const [result, setResult] = useState<LifeInWeeks | null>(() =>
    validInitialBirthDate ? lifeInWeeksFromDate(validInitialBirthDate) : null
  );
  const [profileResolved, setProfileResolved] = useState(
    Boolean(validInitialBirthDate) || storageMode === 'account'
  );
  const [editingBirthDate, setEditingBirthDate] = useState(
    !validInitialBirthDate && storageMode === 'account'
  );
  const [onboardingComplete, setOnboardingComplete] = useState(initialOnboardingComplete);
  const [invalid, setInvalid] = useState(false);
  const [animate, setAnimate] = useState(true);
  const resultRef = useRef<HTMLDivElement>(null);

  // A returning visitor should not have to answer the same question twice. This
  // is the whole persistence story for the page — no account, no network.
  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setAnimate(!reduced);

    if (initialBirthDate && parseBirthDate(initialBirthDate)) {
      setProfileResolved(true);
      return;
    }
    if (storageMode === 'account') {
      setEditingBirthDate(true);
      setProfileResolved(true);
      return;
    }
    void (async () => {
      const adapter = browserRecordAdapter();
      const [saved, onboarding] = await Promise.all([
        readLocalRecord(adapter, STORAGE_KEY, 'profile', isBirthDateRecord),
        readLocalRecord(adapter, 'onboarding:profile', 'onboarding', isOnboardingProfile),
      ]);
      setOnboardingComplete(Boolean(onboarding));
      let birthDate = saved?.birthDate ?? onboarding?.birthDate ?? null;
      if (!birthDate) {
        const legacyYear = window.localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacyYear && /^\d{4}$/.test(legacyYear)) birthDate = `${legacyYear}-01-01`;
      }
      if (birthDate && parseBirthDate(birthDate)) {
        setRaw(birthDate);
        setResult(lifeInWeeksFromDate(birthDate));
        setEditingBirthDate(false);
      } else {
        setEditingBirthDate(true);
      }
      setProfileResolved(true);
    })();
  }, [initialBirthDate, storageMode]);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const birthDate = parseBirthDate(raw);
    if (birthDate === null) {
      setInvalid(true);
      setResult(null);
      return;
    }
    setInvalid(false);
    setResult(lifeInWeeksFromDate(birthDate));
    setEditingBirthDate(false);
    if (storageMode === 'account') void saveBirthDate(birthDate);
    else void writeLocalRecord(browserRecordAdapter(), STORAGE_KEY, 'profile', { birthDate });
    // Reveal happens below the fold on a phone; take the reader there.
    window.requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({
        behavior: animate ? 'smooth' : 'auto',
        block: 'start',
      });
    });
  }

  return (
    // A plain div, not <main>: app/layout.tsx already wraps every page in
    // <main id="main">, so a second one nests two main landmarks and a screen
    // reader is offered a choice between them. Thirteen other pages still do
    // this — see STATUS.md — but this one is the front door.
    <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <h1
        className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl"
        style={{ textWrap: 'balance', lineHeight: 1.12 }}
      >
        Your life, in weeks.
      </h1>
      <p className="mt-5 max-w-[62ch] text-lg text-foreground/80" style={{ lineHeight: 1.6 }}>
        One square for every week you have lived, and every week people your age tend to have left.
        Your exact date makes the lived weeks precise. The estimate ahead is population context, not
        a prediction.
      </p>

      {!profileResolved ? (
        <p className="mt-10 text-sm text-muted-foreground">Opening your saved life map…</p>
      ) : editingBirthDate ? (
        <form onSubmit={onSubmit} className="mt-10">
          <label
            htmlFor="birth-date"
            className="block font-serif text-2xl text-foreground sm:text-3xl"
          >
            {result ? 'Change your birth date' : 'What date were you born?'}
          </label>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <input
              id="birth-date"
              name="birthDate"
              type="date"
              autoComplete="bday"
              value={raw}
              onChange={(event) => {
                setRaw(event.target.value);
                setInvalid(false);
              }}
              aria-invalid={invalid}
              aria-describedby={invalid ? 'birth-date-error' : undefined}
              className="min-w-64 rounded-xl border-2 border-border bg-card px-4 py-3 font-mono text-xl tabular-nums text-foreground focus-visible:border-primary focus-visible:outline-none"
            />
            <button
              type="submit"
              className="min-h-12 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none"
            >
              {result ? 'Update' : 'Show me'}
            </button>
            {result ? (
              <button
                type="button"
                onClick={() => {
                  setEditingBirthDate(false);
                  setInvalid(false);
                }}
                className="min-h-12 px-3 text-sm font-semibold text-muted-foreground underline underline-offset-4"
              >
                Cancel
              </button>
            ) : null}
          </div>

          {invalid ? (
            <p id="birth-date-error" role="alert" className="mt-3 text-base text-destructive">
              Choose a real date in the past.
            </p>
          ) : null}
        </form>
      ) : result ? (
        <div className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>Using your saved birth date.</span>
          <button
            type="button"
            onClick={() => setEditingBirthDate(true)}
            className="min-h-11 font-semibold text-foreground underline underline-offset-4"
          >
            Change
          </button>
        </div>
      ) : null}

      {/* scroll-mt-24 clears the sticky header. At the previous 8 (32px) the
          nav sat over the top of the Saturdays line — the one sentence the
          scroll exists to reveal. */}
      {result ? (
        <div ref={resultRef} className="mt-14 scroll-mt-24">
          {/* Answer first, evidence under it. The grid used to come first and
              runs ~900px tall, which put the one sentence this page exists to
              deliver a full screen below the fold. */}
          <Result result={result} />

          {/* Legend, immediately above the thing it explains. */}
          <p className="mt-14 text-base text-muted-foreground" style={{ lineHeight: 1.6 }}>
            Every week of that life, one square. The dim ones are the{' '}
            <span className="font-mono tabular-nums text-foreground">
              {fmt.format(result.weeksLived)}
            </span>{' '}
            you have already lived.
          </p>
          <div className="mt-5">
            <WeeksGrid
              weeksLived={result.weeksLived}
              totalWeeks={result.totalWeeks}
              animate={animate}
            />
          </div>

          <Turn onboardingComplete={onboardingComplete} />
        </div>
      ) : null}
    </div>
  );
}

function Result({ result }: { result: LifeInWeeks }) {
  const saturdays = result.units.find((u) => u.id === 'saturdays');
  const others = result.units.filter((u) => u.id !== 'saturdays');

  return (
    <section>
      {/* One dominant figure, then texture in prose. A four-up stat grid would
          turn the most human number on the site into a SaaS dashboard. */}
      <p
        className="font-serif text-4xl text-foreground sm:text-5xl"
        style={{ textWrap: 'balance', lineHeight: 1.15 }}
      >
        That leaves roughly{' '}
        <span className="tabular-nums text-primary">{fmt.format(saturdays?.count ?? 0)}</span>{' '}
        Saturdays.
      </p>

      <p className="mt-6 max-w-[62ch] text-lg text-muted-foreground" style={{ lineHeight: 1.6 }}>
        Which is also{' '}
        {others.map((unit, i) => (
          <span key={unit.id}>
            {i === others.length - 1 ? 'and ' : ''}
            <span className="font-mono tabular-nums text-foreground">{fmt.format(unit.count)}</span>{' '}
            {unit.label.toLowerCase()}
            {i < others.length - 1 ? ', ' : '. '}
          </span>
        ))}
        None of these is a prediction about you.
      </p>

      <p className="mt-5 max-w-[62ch] text-base text-muted-foreground" style={{ lineHeight: 1.6 }}>
        They come from how much longer people your age tend to live — not from subtracting{' '}
        {result.age} from an average lifespan, which is the usual way this sum is done and gets
        steadily more wrong the older you are. Having already reached {result.age} means you have
        outlasted every risk that came before it, so your share is larger than that shortcut
        suggests.
      </p>
    </section>
  );
}

/**
 * The pivot from awareness to agency. The page would be a bleak curiosity
 * without it — the point is not the number, it is what the number is for.
 */
function Turn({ onboardingComplete }: { onboardingComplete: boolean }) {
  return (
    <div className="mt-14 border-t border-border pt-10">
      <h2
        className="font-serif text-2xl text-foreground sm:text-3xl"
        style={{ textWrap: 'balance', lineHeight: 1.3 }}
      >
        The squares behind you are spent. The rest are still a choice.
      </h2>
      <p className="mt-5 max-w-[62ch] text-lg text-muted-foreground" style={{ lineHeight: 1.6 }}>
        {onboardingComplete
          ? 'Your plans already have a home. Use the number as context, then return to the part of your life you want to move.'
          : 'You do not need an account, and nothing here is scored or ranked. Pick whichever of these sounds less like homework.'}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href={onboardingComplete ? '/live-more' : '/find-your-hobby'}
          className="rounded-xl bg-primary px-6 py-3.5 text-center text-base font-semibold text-primary-foreground no-underline transition-opacity hover:opacity-90"
        >
          {onboardingComplete ? 'Return to Live More' : 'Find something to do — 2 minutes'}
        </Link>
        <Link
          href={onboardingComplete ? '/history' : '/life-bingo'}
          className="rounded-xl border border-border bg-card px-6 py-3.5 text-center text-base font-medium text-foreground no-underline transition-colors hover:border-foreground/30"
        >
          {onboardingComplete ? 'Return to History' : 'List what you still want to do'}
        </Link>
      </div>

      <p className="mt-8 text-base text-muted-foreground">
        Or read{' '}
        <Link href="/manifesto" className="text-foreground underline underline-offset-4">
          why we built this
        </Link>
        .
      </p>
    </div>
  );
}
