'use client';

import { Check, PenLine, RefreshCw, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { Button } from '~/components/ui/button';
import {
  areDailyIntentionsValid,
  dailyNoveltyById,
  MAX_DAILY_INTENTIONS,
  MAX_DAILY_INTENTION_LENGTH,
  nextDailyNovelty,
  normalizeDailyIntentions,
  parseDailyIntentions,
  pickDailyNovelty,
} from '~/lib/daily-novelty';

export type DailyNoveltyRecord = {
  dayDate: string;
  noveltyId?: string | null;
  noveltyText?: string | null;
  noveltyCompleted?: boolean;
};

type Choice = {
  id: string | null;
  text: string | null;
  title: string;
  description: string;
  emoji: string;
  meta: string;
  items: string[];
};

export function DailyNewThing({
  today,
  selectedDate,
  seed,
  records,
  persist,
  preview = false,
}: {
  today: string;
  selectedDate: string;
  seed: string;
  records: DailyNoveltyRecord[];
  persist: (
    dayDate: string,
    noveltyId: string | null,
    noveltyText: string | null,
    completed: boolean
  ) => Promise<boolean>;
  preview?: boolean;
}) {
  const [entries, setEntries] = useState(() => initialEntries(today, seed, records));
  const [busy, setBusy] = useState<'replace' | 'custom' | 'complete' | null>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customError, setCustomError] = useState('');
  const [status, setStatus] = useState('');
  const currentRecord = entries.find((entry) => entry.dayDate === selectedDate) ?? null;
  const choice = choiceFrom(currentRecord);
  const isToday = selectedDate === today;
  const completed = currentRecord?.noveltyCompleted ?? false;

  async function replace() {
    if (!currentRecord || !choice || busy || preview) return;
    const recentIds = entries.flatMap((entry) => (entry.noveltyId ? [entry.noveltyId] : []));
    const next = currentRecord.noveltyId
      ? nextDailyNovelty(today, seed, currentRecord.noveltyId, recentIds)
      : pickDailyNovelty(today, `${seed}:another`, recentIds);
    await saveChoice(
      { dayDate: today, noveltyId: next.id, noveltyText: null, noveltyCompleted: false },
      'replace',
      `${next.title} is your new thing for today.`
    );
  }

  async function saveCustom() {
    const items = parseDailyIntentions(customText);
    if (!items.length) return setCustomError('Write at least one thing you want to do.');
    if (items.length > MAX_DAILY_INTENTIONS)
      return setCustomError(`Keep today to ${MAX_DAILY_INTENTIONS} items or fewer.`);
    if (!areDailyIntentionsValid(customText))
      return setCustomError(`Keep each item under ${MAX_DAILY_INTENTION_LENGTH} characters.`);
    const text = normalizeDailyIntentions(customText);
    const saved = await saveChoice(
      { dayDate: today, noveltyId: null, noveltyText: text, noveltyCompleted: false },
      'custom',
      items.length === 1 ? 'Your own idea is here for today.' : 'Your list is here for today.'
    );
    if (saved) {
      setCustomOpen(false);
      setCustomText('');
      setCustomError('');
    }
  }

  async function toggleCompleted() {
    if (!currentRecord || !choice || busy || preview) return;
    const nextCompleted = !completed;
    await saveChoice(
      { ...currentRecord, noveltyCompleted: nextCompleted },
      'complete',
      nextCompleted
        ? choice.items.length > 1
          ? 'Your list is part of today now.'
          : `${choice.title} is part of today now.`
        : choice.items.length > 1
          ? 'Your list is open again.'
          : `${choice.title} is open again.`
    );
  }

  async function saveChoice(
    replacement: DailyNoveltyRecord,
    operation: 'replace' | 'custom' | 'complete',
    success: string
  ) {
    const previous = currentRecord;
    if (!previous) return false;
    setEntries((current) => replaceRecord(current, replacement));
    setBusy(operation);
    setStatus('Saving…');
    try {
      const saved = await persist(
        today,
        replacement.noveltyId ?? null,
        replacement.noveltyText ?? null,
        replacement.noveltyCompleted ?? false
      );
      if (!saved) throw new Error('Daily novelty was not saved');
      window.dispatchEvent(new CustomEvent('daily-novelty:changed', { detail: replacement }));
      setStatus(success);
      return true;
    } catch {
      setEntries((current) => replaceRecord(current, previous));
      setStatus('Could not save that change. Your previous choice is still here.');
      return false;
    } finally {
      setBusy(null);
    }
  }

  if (!choice) {
    return (
      <aside className="rounded-2xl bg-[#f7f1e7] p-6 text-[#575344] lg:sticky lg:top-24">
        <p className="text-sm font-bold">Something new</p>
        <p className="mt-4 font-serif text-2xl leading-tight text-[#211e18]">
          No new thing was kept for this day.
        </p>
      </aside>
    );
  }

  return (
    <aside
      aria-labelledby="daily-new-thing-title"
      className={`rounded-2xl p-6 text-[#211e18] shadow-[0_12px_36px_rgba(66,55,22,0.10)] transition-colors lg:sticky lg:top-24 ${
        completed ? 'bg-[#dceabf]' : 'bg-[#b9dcf5]'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex size-11 items-center justify-center rounded-full bg-white/70">
          {completed ? <Check className="size-5" /> : <Sparkles className="size-5" />}
        </div>
        <span className="rounded-full bg-white/65 px-3 py-2 text-xs font-bold">
          {isToday ? choice.meta : completed ? 'Done that day' : 'Left open'}
        </span>
      </div>

      <p className="mt-6 text-sm font-bold">
        {isToday ? 'Make today different' : 'That day’s idea'}
      </p>
      <h2 id="daily-new-thing-title" className="mt-2 font-serif text-3xl leading-[1.05]">
        {choice.emoji} {choice.items.length > 1 ? 'Your list for today' : choice.title}
      </h2>
      {choice.items.length > 1 ? (
        <ol className="mt-5 divide-y divide-[#405566]/20 border-y border-[#405566]/20">
          {choice.items.map((item, index) => (
            <li key={`${item}-${index}`} className="flex gap-3 py-3 text-sm font-semibold">
              <span
                aria-hidden="true"
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/65 text-xs"
              >
                {index + 1}
              </span>
              <span className="pt-0.5 leading-relaxed">{item}</span>
            </li>
          ))}
        </ol>
      ) : null}
      <p className="mt-4 text-sm leading-relaxed text-[#405566]">{choice.description}</p>

      {isToday && !preview ? (
        <div className="mt-6 space-y-3">
          {customOpen && !completed ? (
            <div className="rounded-xl bg-white/55 p-3">
              <label htmlFor="daily-own-thing" className="text-sm font-bold">
                What do you want to try today?
              </label>
              <p className="mt-1 text-xs leading-relaxed text-[#405566]">
                Add one thing per line, or paste a numbered list.
              </p>
              <textarea
                id="daily-own-thing"
                value={customText}
                autoFocus
                onChange={(event) => {
                  setCustomText(event.target.value);
                  setCustomError('');
                }}
                placeholder={'Call an old friend\nCook one new dish\nWalk somewhere unfamiliar'}
                className="mt-2 min-h-28 w-full resize-y rounded-xl border border-[#211e18]/25 bg-white px-3 py-2.5 text-base outline-none focus-visible:ring-2 focus-visible:ring-[#211e18]/60"
              />
              {customError && (
                <p role="alert" className="mt-2 text-xs font-medium text-[#8a342b]">
                  {customError}
                </p>
              )}
              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  onClick={saveCustom}
                  disabled={busy !== null}
                  className="bg-[#211e18] text-white hover:bg-[#37332b]"
                >
                  {busy === 'custom' ? 'Saving…' : 'Keep my list'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setCustomOpen(false);
                    setCustomError('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Button
                type="button"
                onClick={toggleCompleted}
                disabled={busy !== null}
                className="w-full bg-[#211e18] text-white hover:bg-[#37332b]"
              >
                {busy === 'complete'
                  ? 'Saving…'
                  : completed
                    ? 'Mark this open again'
                    : choice.items.length > 1
                      ? 'I did these'
                      : 'I did this'}
              </Button>
              {!completed && (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={replace}
                    disabled={busy !== null}
                    className="border-[#211e18]/25 bg-white/45"
                  >
                    <RefreshCw className={`size-4 ${busy === 'replace' ? 'animate-spin' : ''}`} />
                    Suggest another
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setCustomText(currentRecord?.noveltyText ?? '');
                      setCustomOpen(true);
                    }}
                    disabled={busy !== null}
                    className="border-[#211e18]/25 bg-white/45"
                  >
                    <PenLine className="size-4" />
                    {choice.id === null ? 'Edit my list' : 'Choose my own'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <p className="mt-6 text-sm leading-relaxed text-[#405538]">
          {completed
            ? 'You marked this as something you actually did.'
            : 'You kept the idea, without turning it into an obligation.'}
        </p>
      )}

      <p aria-live="polite" className="mt-4 min-h-5 text-xs font-medium">
        {status}
      </p>
    </aside>
  );
}

function choiceFrom(record: DailyNoveltyRecord | null): Choice | null {
  const custom = record?.noveltyText?.trim();
  if (custom) {
    const items = parseDailyIntentions(custom);
    return {
      id: null,
      text: custom,
      title: items[0] ?? custom,
      description:
        items.length > 1
          ? 'A few things you chose for today.'
          : 'Your own small intention for today.',
      emoji: '✦',
      meta: 'Your choice',
      items,
    };
  }
  const novelty = dailyNoveltyById(record?.noveltyId);
  return novelty
    ? {
        id: novelty.id,
        text: null,
        title: novelty.title,
        description: novelty.description,
        emoji: novelty.emoji,
        meta: novelty.timeEstimate,
        items: [novelty.title],
      }
    : null;
}

function initialEntries(
  today: string,
  seed: string,
  records: DailyNoveltyRecord[]
): DailyNoveltyRecord[] {
  const stored = records.filter(
    (entry) => dailyNoveltyById(entry.noveltyId) || entry.noveltyText?.trim()
  );
  if (stored.some((entry) => entry.dayDate === today)) return stored;
  const recentIds = stored.flatMap((entry) => (entry.noveltyId ? [entry.noveltyId] : []));
  const novelty = pickDailyNovelty(today, seed, recentIds);
  return [
    ...stored,
    { dayDate: today, noveltyId: novelty.id, noveltyText: null, noveltyCompleted: false },
  ];
}

function replaceRecord(
  records: DailyNoveltyRecord[],
  replacement: DailyNoveltyRecord
): DailyNoveltyRecord[] {
  const exists = records.some((entry) => entry.dayDate === replacement.dayDate);
  return exists
    ? records.map((entry) => (entry.dayDate === replacement.dayDate ? replacement : entry))
    : [...records, replacement];
}
