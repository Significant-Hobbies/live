'use client';

import { useEffect, useState } from 'react';
import { shiftDayKey } from '~/lib/day';
import {
  defaultWritingWeek,
  entryWeekFor,
  findEntryForWeek,
  formatWeekChooserSpan,
  formatWeekSpan,
  weekStartFor,
  type WeekStartsOn,
} from '~/lib/weekly-log';

export type WeeklyLogEntryView = {
  id: string;
  weekOf: string;
  text: string;
  promptText: string | null;
  turns?: Array<{ questionText: string; answer: string }>;
};

type WeeklyLogData = {
  today: string;
  weekStartsOn: WeekStartsOn;
  entries: WeeklyLogEntryView[];
  archiveSlot?: React.ReactNode;
  storageSlot?: React.ReactNode;
  emailOptIn?: boolean;
};

type WeeklyLogActions = {
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
  const [weekOf, setWeekOf] = useState(() => defaultWritingWeek(data.today, data.weekStartsOn));
  useEffect(() => setEntries(data.entries), [data.entries]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const currentWeek = weekStartFor(data.today, weekStartsOn);
  const lastWeek = shiftDayKey(currentWeek, -7);
  const currentEntry = findEntryForWeek(entries, weekOf, weekStartsOn);
  const textareaValue = drafts[weekOf] ?? currentEntry?.text ?? '';
  const hasUnsavedChanges = textareaValue !== (currentEntry?.text ?? '');
  const anyUnsavedChanges = Object.entries(drafts).some(
    ([key, value]) => value !== (findEntryForWeek(entries, key, weekStartsOn)?.text ?? '')
  );
  const relative = weekOf === currentWeek ? 'This week' : weekOf === lastWeek ? 'Last week' : '';
  const heading = `What did ${weekOf === currentWeek ? 'this' : weekOf === lastWeek ? 'last' : 'that'} week hold?`;

  async function handleSave() {
    const composed = textareaValue.trim();
    if (!composed || saving) return;
    setSaving(true);
    setSaved(false);
    setSaveError('');
    try {
      const originalKey = currentEntry?.weekOf ?? weekOf;
      const promptText = currentEntry ? currentEntry.promptText : heading;
      if (!(await actions.onSave(originalKey, composed, promptText))) throw new Error('not saved');
      const next = {
        ...currentEntry,
        id: currentEntry?.id ?? `week-${originalKey}`,
        weekOf: originalKey,
        text: composed,
        promptText,
      };
      setEntries((current) =>
        currentEntry
          ? current.map((entry) => (entry.id === currentEntry.id ? next : entry))
          : [next, ...current]
      );
      setDrafts((current) => {
        const nextDrafts = { ...current };
        delete nextDrafts[weekOf];
        return nextDrafts;
      });
      setSaved(true);
    } catch {
      setSaveError('Your words are still here — Live could not save yet. Try again.');
    } finally {
      setSaving(false);
    }
  }

  function selectWeek(next: string) {
    setWeekOf(next);
    setSaved(false);
    setSaveError('');
  }
  async function changeWeekStart(value: WeekStartsOn) {
    if (value === weekStartsOn || saving || anyUnsavedChanges) return;
    setSaving(true);
    setSaved(false);
    setSaveError('');
    try {
      await actions.onWeekStartsOnChange(value);
      setWeekStartsOn(value);
      setWeekOf(entryWeekFor(weekOf, value));
      setDrafts({});
    } catch {
      setSaveError('The week setting could not be saved. Try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto min-h-[75vh] max-w-[760px] px-4 py-6 sm:px-6 sm:py-11">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
          <button
            type="button"
            aria-label="Previous week"
            disabled={saving}
            onClick={() => selectWeek(shiftDayKey(weekOf, -7))}
            className="size-11 shrink-0 rounded-xl border border-border text-xl disabled:opacity-40"
          >
            ‹
          </button>
          <span className="tabular-nums">
            {relative && `${relative} · `}
            {formatWeekChooserSpan(weekOf)}
          </span>
          <button
            type="button"
            aria-label="Next week"
            disabled={saving || weekOf >= currentWeek}
            onClick={() => selectWeek(shiftDayKey(weekOf, 7))}
            className="size-11 shrink-0 rounded-xl border border-border text-xl disabled:opacity-40"
          >
            ›
          </button>
        </div>
        {data.storageSlot}
      </div>
      <h1 className="mt-3 font-serif text-[30px] font-medium leading-tight sm:text-[40px]">
        {heading}
      </h1>
      <label htmlFor="weekly-entry" className="sr-only">
        {heading}
      </label>
      <textarea
        id="weekly-entry"
        value={textareaValue}
        onChange={(event) => {
          const value = event.target.value;
          setDrafts((current) => ({ ...current, [weekOf]: value }));
          setSaved(false);
        }}
        placeholder="One honest paragraph is enough."
        rows={7}
        disabled={saving}
        maxLength={8000}
        className="mt-6 min-h-[220px] w-full resize-y rounded-xl border border-border bg-card px-4 py-3 text-base leading-relaxed"
      />
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !textareaValue.trim()}
          className="min-h-11 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground disabled:opacity-45"
        >
          {saving ? 'Saving…' : currentEntry ? 'Update this week' : 'Save this week'}
        </button>
        <span className="text-[13px] text-muted-foreground">Private. No streaks, no scores.</span>
        <span role="status" className="text-sm text-muted-foreground">
          {saved && !hasUnsavedChanges ? 'Saved.' : ''}
        </span>
      </div>
      {saveError && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {saveError}
        </p>
      )}
      {data.emailOptIn !== undefined && actions.onEmailOptInChange && (
        <EmailNudge optIn={data.emailOptIn} onChange={actions.onEmailOptInChange} />
      )}
      <WeekHistory
        entries={entries
          .filter((entry) => entry.id !== currentEntry?.id)
          .sort((a, b) => b.weekOf.localeCompare(a.weekOf))}
      />
      {data.archiveSlot}
      <div className="mt-6 text-[13px] text-muted-foreground">
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="week-start">Weeks start on</label>
          <select
            id="week-start"
            value={weekStartsOn}
            disabled={saving || anyUnsavedChanges}
            onChange={(event) => void changeWeekStart(event.target.value as WeekStartsOn)}
            className="min-h-11 rounded-xl border border-border bg-surface px-3"
          >
            <option value="monday">Monday</option>
            <option value="sunday">Sunday</option>
          </select>
        </div>
        <p className="mt-2">
          Only changes how weeks are grouped. Saved entries stay with the week you wrote them for.
        </p>
      </div>
    </div>
  );
}

function WeekHistory({ entries }: { entries: WeeklyLogEntryView[] }) {
  if (!entries.length) return null;
  return (
    <section aria-labelledby="weekly-history-title" className="mt-14">
      <h2
        id="weekly-history-title"
        className="border-b border-border/60 pb-3 font-serif text-[22px]"
      >
        Earlier weeks
      </h2>
      {entries.map((entry) => (
        <article key={entry.id} className="border-b border-border/60 py-4">
          <p className="text-[13px] tabular-nums text-muted-foreground">
            {formatWeekSpan(entry.weekOf)}
          </p>
          <p className="mt-1 line-clamp-3 whitespace-pre-wrap break-words text-[15px] text-muted-foreground">
            {entry.text}
          </p>
        </article>
      ))}
    </section>
  );
}

function EmailNudge({
  optIn,
  onChange,
}: {
  optIn: boolean;
  onChange: (value: boolean) => Promise<void>;
}) {
  const [on, setOn] = useState(optIn);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  return (
    <div className="mt-5 text-sm text-muted-foreground">
      <label className="flex min-h-11 items-center gap-3">
        <input
          type="checkbox"
          checked={on}
          disabled={pending}
          className="size-5 accent-muted-foreground"
          onChange={async (event) => {
            const next = event.target.checked;
            setPending(true);
            setError('');
            try {
              await onChange(next);
              setOn(next);
            } catch {
              setError('Could not save your email preference. Try again.');
            } finally {
              setPending(false);
            }
          }}
        />
        Email me a quiet Sunday nudge.
      </label>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
