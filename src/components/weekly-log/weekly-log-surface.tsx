'use client';

import { ArrowRight, CalendarDays, Check, Compass, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';

import {
  formatWeekOf,
  formatWeekSpan,
  isSuggestedLogDay,
  weekStartFor,
  type WeekStartsOn,
} from '~/lib/weekly-log';
import {
  fallbackQuestion,
  WEEKLY_QUESTIONS,
  type NudgeSignals,
  type WeeklyQuestion,
} from '~/lib/weekly-questions';

export type WeeklyLogEntryView = {
  id: string;
  weekOf: string;
  text: string;
  promptText: string | null;
};

export type StaleDreamView = {
  title: string;
  category: string | null;
  daysSinceMovement: number | null;
};

export type WeeklyLogData = {
  firstName: string;
  /** User-local YYYY-MM-DD. */
  today: string;
  weekStartsOn: WeekStartsOn;
  entries: WeeklyLogEntryView[];
  staleDreams: StaleDreamView[];
  weeksRemaining: number | null;
  /**
   * The resolved question for this week. When null (local mode before the
   * request lands), the surface resolves one itself — via `nudgeRequest`
   * when provided, else the deterministic rotation.
   */
  initialQuestion: WeeklyQuestion | null;
  /** Local-mode nudge request posted to /api/weekly-nudge. */
  nudgeRequest?: { signals: NudgeSignals; excludeIds: string[] } | null;
  /** Old AM/PM archive rendered below the weekly history. */
  archiveSlot?: React.ReactNode;
};

export type WeeklyLogActions = {
  onSave: (weekOf: string, text: string, promptText: string | null) => Promise<boolean>;
  onWeekStartsOnChange: (value: WeekStartsOn) => Promise<void>;
  onCallDreamForward?: (title: string) => Promise<void>;
  onQuestionServed?: (questionId: string) => void;
};

export function WeeklyLogSurface({
  data,
  actions,
}: {
  data: WeeklyLogData;
  actions: WeeklyLogActions;
}) {
  const [weekStartsOn, setWeekStartsOn] = useState(data.weekStartsOn);
  const [entries, setEntries] = useState(data.entries);
  const [staleDreams, setStaleDreams] = useState(data.staleDreams);

  // Local mode resolves its records asynchronously after mount — late-arriving
  // props must replace the empty snapshot, not sit behind it.
  useEffect(() => setEntries(data.entries), [data.entries]);
  useEffect(() => setWeekStartsOn(data.weekStartsOn), [data.weekStartsOn]);
  useEffect(() => setStaleDreams(data.staleDreams), [data.staleDreams]);

  const [question, setQuestion] = useState<WeeklyQuestion | null>(data.initialQuestion);
  const [text, setText] = useState('');
  // The week the visible textarea text belongs to — lets async local entries
  // fill the box without ever overwriting in-progress typing on a week switch.
  const [editedWeek, setEditedWeek] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [callingTitle, setCallingTitle] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const weekOf = useMemo(() => weekStartFor(data.today, weekStartsOn), [data.today, weekStartsOn]);
  const currentEntry = entries.find((entry) => entry.weekOf === weekOf) ?? null;
  const textareaValue = editedWeek === weekOf ? text : (currentEntry?.text ?? '');

  // Resolve a question client-side when the server didn't (local mode).
  const servedRef = useRef(actions.onQuestionServed);
  servedRef.current = actions.onQuestionServed;
  const nudgeRequest = data.nudgeRequest;
  useEffect(() => {
    if (question) return;
    let cancelled = false;
    async function resolve() {
      if (nudgeRequest) {
        try {
          const response = await fetch('/api/weekly-nudge', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              signals: nudgeRequest.signals,
              weekStartsOn,
              weekOf,
              excludeIds: nudgeRequest.excludeIds,
            }),
          });
          if (response.ok) {
            const body = (await response.json()) as { question?: WeeklyQuestion };
            if (body.question?.text && !cancelled) {
              setQuestion(body.question);
              servedRef.current?.(body.question.id);
              return;
            }
          }
        } catch {
          // fall through to rotation
        }
      }
      if (!cancelled) {
        setQuestion(fallbackQuestion(weekOf, nudgeRequest?.excludeIds ?? []));
      }
    }
    void resolve();
    return () => {
      cancelled = true;
    };
  }, [question, nudgeRequest, weekStartsOn, weekOf]);

  function cycleQuestion() {
    const exclude = [question?.id ?? '', ...(data.nudgeRequest?.excludeIds ?? [])];
    const pool = WEEKLY_QUESTIONS.filter((q) => !exclude.includes(q.id));
    const candidates = pool.length ? pool : WEEKLY_QUESTIONS.filter((q) => q.id !== question?.id);
    setQuestion(candidates[0] ?? question);
    if (candidates[0]) actions.onQuestionServed?.(candidates[0].id);
  }

  async function handleSave() {
    const trimmed = textareaValue.trim();
    if (!trimmed) return;
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    try {
      const ok = await actions.onSave(weekOf, trimmed, question?.text ?? null);
      if (!ok) throw new Error('not saved');
      setEntries((current) => {
        const next = {
          id: currentEntry?.id ?? `week-${weekOf}`,
          weekOf,
          text: trimmed,
          promptText: question?.text ?? null,
        };
        return current.some((entry) => entry.weekOf === weekOf)
          ? current.map((entry) => (entry.weekOf === weekOf ? next : entry))
          : [next, ...current];
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch {
      setSaveError('Your words are still here — Live could not save yet. Try again.');
    } finally {
      setSaving(false);
    }
  }

  async function changeWeekStart(value: WeekStartsOn) {
    if (value === weekStartsOn) return;
    const previous = weekStartsOn;
    setWeekStartsOn(value);
    try {
      await actions.onWeekStartsOnChange(value);
    } catch {
      setWeekStartsOn(previous);
    }
  }

  function callForward(title: string) {
    if (!actions.onCallDreamForward) return;
    setCallingTitle(title);
    startTransition(async () => {
      try {
        await actions.onCallDreamForward?.(title);
        setStaleDreams((current) => current.filter((dream) => dream.title !== title));
      } finally {
        setCallingTitle(null);
      }
    });
  }

  const pastEntries = entries.filter((entry) => entry.weekOf !== weekOf);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:py-8">
      <HeaderCard
        firstName={data.firstName}
        weekOf={weekOf}
        today={data.today}
        weekStartsOn={weekStartsOn}
        weeksRemaining={data.weeksRemaining}
        onWeekStart={changeWeekStart}
      />
      <WriteCard
        card={{
          weekOf,
          question,
          text: textareaValue,
          onText: (value) => {
            setText(value);
            setEditedWeek(weekOf);
          },
          onSave: handleSave,
          onCycle: cycleQuestion,
          saving,
          saved,
          saveError,
          hasEntry: !!currentEntry,
        }}
      />
      <StaleDreamsCard
        dreams={staleDreams}
        callingTitle={callingTitle}
        pending={isPending}
        onCallForward={actions.onCallDreamForward ? callForward : null}
      />
      <WeekHistoryCard entries={pastEntries} />
      {data.archiveSlot}
    </div>
  );
}

function HeaderCard({
  firstName,
  weekOf,
  today,
  weekStartsOn,
  weeksRemaining,
  onWeekStart,
}: {
  firstName: string;
  weekOf: string;
  today: string;
  weekStartsOn: WeekStartsOn;
  weeksRemaining: number | null;
  onWeekStart: (value: WeekStartsOn) => void;
}) {
  const suggested = isSuggestedLogDay(today);
  return (
    <section className="relative overflow-hidden rounded-[1.5rem] bg-[#c5abfa] px-5 py-5 text-[#241a31] shadow-[0_10px_30px_rgba(66,55,22,0.08)] sm:px-7 sm:py-6">
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CalendarDays className="size-5" aria-hidden="true" />
            {formatWeekSpan(weekOf)}
          </div>
          <h1 className="mt-2 font-serif text-3xl font-medium leading-tight tracking-[-0.02em] sm:text-4xl">
            The week in your own words{firstName !== 'there' ? `, ${firstName}` : ''}.
          </h1>
          <p className="mt-2 text-sm opacity-75">
            {suggested
              ? 'Sunday is the natural moment — but any day counts.'
              : 'One honest entry a week. Any day counts.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          {weeksRemaining !== null && (
            <Link href="/life-in-weeks" className="rounded-full bg-white/65 px-3 py-2 tabular-nums">
              {weeksRemaining.toLocaleString()} weeks
            </Link>
          )}
          <span className="inline-flex rounded-full bg-white/65 p-1" aria-label="Week starts on">
            {(['monday', 'sunday'] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={weekStartsOn === value}
                aria-label={`Weeks start ${value}`}
                onClick={() => onWeekStart(value)}
                className={`min-h-8 rounded-full px-3 capitalize transition-colors ${
                  weekStartsOn === value ? 'bg-[#241a31] text-white' : 'text-[#241a31]/70'
                }`}
              >
                {value}
              </button>
            ))}
          </span>
        </div>
      </div>
    </section>
  );
}

type WriteCardModel = {
  weekOf: string;
  question: WeeklyQuestion | null;
  text: string;
  onText: (value: string) => void;
  onSave: () => void;
  onCycle: () => void;
  saving: boolean;
  saved: boolean;
  saveError: string | null;
  hasEntry: boolean;
};

function WriteCard({ card }: { card: WriteCardModel }) {
  const { weekOf, question, text, onText, onSave, onCycle, saving, saved, saveError, hasEntry } =
    card;
  const label = question ? question.text : 'What did you live this week?';
  return (
    <section
      aria-labelledby="weekly-entry-title"
      className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_12px_36px_rgba(66,55,22,0.10)]"
    >
      <div className="border-b border-[#e8dfd1] px-5 py-5 sm:px-7">
        <p className="text-sm font-semibold text-subtle">{formatWeekOf(weekOf)}</p>
        <h2
          id="weekly-entry-title"
          className="mt-1 font-serif text-3xl font-medium tracking-tight text-foreground"
        >
          {label}
        </h2>
      </div>
      <div className="px-5 py-6 sm:px-7 sm:py-8">
        <label htmlFor="weekly-entry" className="sr-only">
          {label}
        </label>
        <textarea
          id="weekly-entry"
          value={text}
          onChange={(event) => onText(event.target.value)}
          placeholder="One honest paragraph is enough. What did you actually do with your week?"
          rows={7}
          className="w-full resize-y rounded-xl border border-[#cfc3b0] bg-[#fffdf8] px-4 py-3 text-base leading-relaxed outline-none focus:border-[#176b4a] focus:ring-2 focus:ring-[#176b4a]/20"
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onSave}
            disabled={saving || !text.trim()}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#176b4a] px-5 font-bold text-white disabled:opacity-45"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            {hasEntry ? 'Update this week' : 'Save this week'}
          </button>
          <button
            type="button"
            onClick={onCycle}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#cfc3b0] px-4 text-sm font-bold text-[#625b50]"
          >
            <RefreshCw className="size-3.5" /> A different question
          </button>
          <p aria-live="polite" className="text-sm font-semibold text-[#176b4a]">
            {saved ? 'Kept. This week is on record.' : ''}
          </p>
        </div>
        {saveError ? (
          <p role="alert" className="mt-3 text-sm font-bold text-red-700">
            {saveError}
          </p>
        ) : null}
        <p className="mt-4 text-sm leading-relaxed text-[#625b50]">
          Missed weeks stay missed — no streaks, no make-up pressure. Write when the week is worth
          writing down.
        </p>
      </div>
    </section>
  );
}

function StaleDreamsCard({
  dreams,
  callingTitle,
  pending,
  onCallForward,
}: {
  dreams: StaleDreamView[];
  callingTitle: string | null;
  pending: boolean;
  onCallForward: ((title: string) => void) | null;
}) {
  if (!dreams.length) return null;
  return (
    <section
      aria-labelledby="still-calling-title"
      className="overflow-hidden rounded-[1.5rem] border border-[#d9cfbd] bg-[#fffdf8] shadow-[0_12px_36px_rgba(66,55,22,0.08)]"
    >
      <div className="border-b border-[#e8dfd1] px-5 py-5 sm:px-7">
        <div className="flex items-center gap-2 text-sm font-bold text-[#6c3d2b]">
          <Compass className="size-4" aria-hidden="true" />
          Still calling?
        </div>
        <h2
          id="still-calling-title"
          className="mt-1 font-serif text-2xl font-medium tracking-tight text-foreground"
        >
          Dreams that have been quiet a while.
        </h2>
      </div>
      <ul className="divide-y divide-[#e8dfd1] px-5 sm:px-7">
        {dreams.map((dream) => (
          <li key={dream.title} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="font-serif text-lg leading-snug">{dream.title}</p>
              <p className="mt-0.5 text-xs text-[#625b50]">
                {dream.daysSinceMovement !== null
                  ? `Untouched for about ${Math.round(dream.daysSinceMovement / 7)} ${
                      Math.round(dream.daysSinceMovement / 7) === 1 ? 'week' : 'weeks'
                    }`
                  : 'In your atlas, waiting'}
              </p>
            </div>
            {onCallForward ? (
              <button
                type="button"
                disabled={pending && callingTitle === dream.title}
                onClick={() => onCallForward(dream.title)}
                className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-bold text-[#6c3d2b] underline decoration-[#d79b7f] underline-offset-4 disabled:opacity-50"
              >
                {pending && callingTitle === dream.title ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : null}
                Call it forward
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      <div className="border-t border-[#e8dfd1] px-5 py-4 sm:px-7">
        <Link
          href="/live-more"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#176b4a] underline underline-offset-4"
        >
          Revisit your atlas <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}

function WeekHistoryCard({ entries }: { entries: WeeklyLogEntryView[] }) {
  if (!entries.length) return null;
  return (
    <section
      aria-labelledby="weekly-history-title"
      className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_12px_36px_rgba(66,55,22,0.10)]"
    >
      <div className="border-b border-[#e8dfd1] bg-[#ffd0bd] p-5 sm:p-7">
        <p className="text-sm font-bold text-[#713f2d]">Weeks on record</p>
        <h2
          id="weekly-history-title"
          className="mt-1 font-serif text-3xl text-foreground sm:text-4xl"
        >
          {entries.length} {entries.length === 1 ? 'week' : 'weeks'} written
        </h2>
      </div>
      <div className="divide-y divide-[#e8dfd1] px-5 sm:px-7">
        {entries.map((entry, index) => (
          <details key={entry.id} open={index === 0} className="group py-1">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 marker:content-none">
              <span className="font-serif text-xl">{formatWeekOf(entry.weekOf)}</span>
              <span className="text-xs font-semibold text-[#625b50]">
                {formatWeekSpan(entry.weekOf)}
              </span>
            </summary>
            <div className="pb-5">
              {entry.promptText ? (
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#625b50]">
                  {entry.promptText}
                </p>
              ) : null}
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                {entry.text}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
