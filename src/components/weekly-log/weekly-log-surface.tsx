'use client';

import { CalendarDays, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { shiftDayKey } from '~/lib/day';
import { formatWeekOf, formatWeekSpan, weekStartFor, type WeekStartsOn } from '~/lib/weekly-log';

export type WeeklyLogEntryView = {
  id: string;
  weekOf: string;
  text: string;
  promptText: string | null;
  turns?: Array<{ questionText: string; answer: string }>;
};

export type WeeklyLogData = {
  firstName: string;
  today: string;
  weekStartsOn: WeekStartsOn;
  entries: WeeklyLogEntryView[];
  weeksRemaining: number | null;
  archiveSlot?: React.ReactNode;
  emailOptIn?: boolean;
};

export type WeeklyLogActions = {
  onSave: (weekOf: string, text: string, promptText: string | null) => Promise<boolean>;
  onWeekStartsOnChange: (value: WeekStartsOn) => Promise<void>;
  onEmailOptInChange?: (optIn: boolean) => Promise<void>;
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
  useEffect(() => setEntries(data.entries), [data.entries]);
  useEffect(() => setWeekStartsOn(data.weekStartsOn), [data.weekStartsOn]);

  const [text, setText] = useState('');
  const [editedWeek, setEditedWeek] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const weekOf = useMemo(
    () => weekStartFor(shiftDayKey(data.today, -7), weekStartsOn),
    [data.today, weekStartsOn]
  );
  const currentEntry = entries.find((entry) => entry.weekOf === weekOf) ?? null;
  const textareaValue = editedWeek === weekOf ? text : (currentEntry?.text ?? '');
  const hasUnsavedChanges = editedWeek === weekOf && text !== (currentEntry?.text ?? '');

  async function handleSave() {
    const composed = textareaValue.trim();
    if (!composed || saving) return;
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    try {
      const promptText = currentEntry?.promptText ?? 'What did you do last week?';
      const ok = await actions.onSave(weekOf, composed, promptText);
      if (!ok) throw new Error('not saved');
      setEntries((current) => {
        const next = {
          id: currentEntry?.id ?? `week-${weekOf}`,
          weekOf,
          text: composed,
          promptText,
        };
        return current.some((entry) => entry.weekOf === weekOf)
          ? current.map((entry) => (entry.weekOf === weekOf ? next : entry))
          : [next, ...current];
      });
      setText('');
      setEditedWeek(null);
      setSaved(true);
    } catch {
      setSaveError('Your words are still here — Live could not save yet. Try again.');
    } finally {
      setSaving(false);
    }
  }

  async function changeWeekStart(value: WeekStartsOn) {
    if (value === weekStartsOn || saving || hasUnsavedChanges) return;
    const previous = weekStartsOn;
    setWeekStartsOn(value);
    try {
      await actions.onWeekStartsOnChange(value);
    } catch {
      setWeekStartsOn(previous);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:py-8">
      <HeaderCard
        firstName={data.firstName}
        weekOf={weekOf}
        weekStartsOn={weekStartsOn}
        weeksRemaining={data.weeksRemaining}
        weekStartDisabled={saving || hasUnsavedChanges}
        onWeekStart={changeWeekStart}
      />
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
            What did you do last week?
          </h2>
        </div>
        <div className="px-5 py-6 sm:px-7 sm:py-8">
          <label htmlFor="weekly-entry" className="sr-only">
            What did you do last week?
          </label>
          <textarea
            id="weekly-entry"
            value={textareaValue}
            onChange={(event) => {
              setText(event.target.value);
              setEditedWeek(weekOf);
              setSaved(false);
            }}
            placeholder="One honest paragraph is enough. What did you try, finish, or enjoy?"
            rows={7}
            disabled={saving}
            maxLength={8000}
            className="w-full resize-y rounded-xl border border-[#cfc3b0] bg-[#fffdf8] px-4 py-3 text-base leading-relaxed outline-none focus:border-[#176b4a] focus:ring-2 focus:ring-[#176b4a]/20"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !textareaValue.trim()}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#176b4a] px-5 font-bold text-white disabled:opacity-45"
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              {currentEntry ? 'Update this week' : 'Keep this week'}
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
            Your entry stays private. No daily writing requirement, streaks, or scores.
          </p>
        </div>
      </section>
      {data.emailOptIn !== undefined && actions.onEmailOptInChange ? (
        <EmailNudgeCard optIn={data.emailOptIn} onChange={actions.onEmailOptInChange} />
      ) : null}
      <WeekHistoryCard entries={entries.filter((entry) => entry.weekOf !== weekOf)} />
      {data.archiveSlot}
    </div>
  );
}

function HeaderCard({
  firstName,
  weekOf,
  weekStartsOn,
  weeksRemaining,
  weekStartDisabled,
  onWeekStart,
}: {
  firstName: string;
  weekOf: string;
  weekStartsOn: WeekStartsOn;
  weeksRemaining: number | null;
  weekStartDisabled: boolean;
  onWeekStart: (value: WeekStartsOn) => void;
}) {
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
            One entry about the previous week. Write whenever you like.
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
                disabled={weekStartDisabled}
                className={`min-h-11 rounded-full px-3 capitalize transition-colors ${
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

function EmailNudgeCard({
  optIn,
  onChange,
}: {
  optIn: boolean;
  onChange: (optIn: boolean) => Promise<void>;
}) {
  const [on, setOn] = useState(optIn);
  const [pending, setPending] = useState(false);
  return (
    <section className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-[#d9cfbd] bg-[#fffdf8] px-5 py-4 shadow-[0_12px_36px_rgba(66,55,22,0.06)] sm:px-7">
      <div>
        <p className="font-serif text-lg">A Sunday nudge, if you want one.</p>
        <p className="mt-0.5 text-sm text-[#625b50]">
          One quiet email when the week turns — nothing counted, nothing scored.
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        disabled={pending}
        onClick={async () => {
          const next = !on;
          setOn(next);
          setPending(true);
          try {
            await onChange(next);
          } catch {
            setOn(!next);
          } finally {
            setPending(false);
          }
        }}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-50 ${on ? 'bg-[#176b4a]' : 'bg-[#cfc3b0]'}`}
        aria-label="Email me a Sunday nudge"
      >
        <span
          className={`absolute top-0.5 size-6 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </button>
    </section>
  );
}
