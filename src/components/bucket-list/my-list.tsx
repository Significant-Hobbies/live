'use client';

import { Check, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { StorageModeProvider, StorageModeStatus } from '~/components/storage-mode-provider';
import { normalizeDreamTitle } from '~/lib/dream-atlas';
import { ManualItemInput } from './manual-item-input';
import { MyListSkeleton } from './my-list-skeleton';
import {
  localMyListStorage,
  serverMyListStorage,
  type MyListItem,
  type MyListStorage,
} from './my-list-storage';

const STATUS_LABELS = { planned: 'To do', in_progress: 'Doing', done: 'Lived' };

export function MyList({
  initialItems,
  boards = [],
}: {
  initialItems?: MyListItem[];
  boards?: Array<{ id: string; title: string }>;
}) {
  const account = initialItems !== undefined;
  const [storage] = useState(() =>
    account ? serverMyListStorage(initialItems ?? []) : localMyListStorage()
  );
  const [items, setItems] = useState(initialItems ?? []);
  const [loaded, setLoaded] = useState(account);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notesDrafts, setNotesDrafts] = useState<Record<string, string>>({});
  const [notesFailures, setNotesFailures] = useState<Record<string, boolean>>({});
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    if (!window.matchMedia) return;
    const media = window.matchMedia('(min-width: 1024px)');
    const sync = () => setDesktop(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const blockingWrites = useRef(0);
  useEffect(() => {
    let cancelled = false;
    storage
      .load()
      .then((next) => {
        if (!cancelled) {
          setItems(next);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled)
          setError(
            'Your list could not be opened. Reload to try again; existing items have not been changed.'
          );
      });
    return () => {
      cancelled = true;
    };
  }, [storage]);

  function mutate(action: (adapter: MyListStorage) => Promise<MyListItem[]>, quiet = false) {
    if (!loaded) return Promise.resolve(false);
    if (!quiet) {
      blockingWrites.current += 1;
      setSaving(true);
    }
    const result = queue.current.then(async () => {
      setError('');
      try {
        setItems(await action(storage));
        return true;
      } catch (cause) {
        setError(
          cause instanceof Error && cause.message === 'This item is already in your list.'
            ? cause.message
            : 'Changes could not be saved. Your list and input are unchanged. Try again.'
        );
        return false;
      } finally {
        if (!quiet) {
          blockingWrites.current -= 1;
          setSaving(blockingWrites.current > 0);
        }
      }
    });
    queue.current = result;
    return result;
  }

  async function saveNotes(item: MyListItem, notes: string) {
    if (notes === (item.notes ?? '')) return;
    const ok = await mutate((adapter) => adapter.update(item.id, { notes: notes || null }), true);
    setNotesFailures((current) => ({ ...current, [item.id]: !ok }));
    if (ok)
      setNotesDrafts((current) => {
        if (current[item.id] !== notes) return current;
        const next = { ...current };
        delete next[item.id];
        return next;
      });
  }

  const active = [...items]
    .reverse()
    .filter((item) => item.status !== 'done')
    .sort(
      (a, b) =>
        Number(b.status === 'in_progress') - Number(a.status === 'in_progress') ||
        (b.updatedAt ?? b.createdAt ?? '').localeCompare(a.updatedAt ?? a.createdAt ?? '')
    );
  const lived = [...items]
    .reverse()
    .filter((item) => item.status === 'done')
    .sort((a, b) =>
      (b.completedAt ?? b.updatedAt ?? '').localeCompare(a.completedAt ?? a.updatedAt ?? '')
    );
  // Desktop always shows one item beside the list, so the panel column is never empty.
  const selected =
    items.find((item) => item.id === selectedId) ?? (desktop ? active[0] : undefined);
  const panel = selected ? (
    <ItemPanel
      key={selected.id}
      item={selected}
      account={account}
      saving={saving}
      notes={notesDrafts[selected.id] ?? selected.notes ?? ''}
      notesError={notesFailures[selected.id] ?? false}
      onNotesChange={(value) => setNotesDrafts((current) => ({ ...current, [selected.id]: value }))}
      onNotesSave={() => void saveNotes(selected, notesDrafts[selected.id] ?? selected.notes ?? '')}
      onBack={() => setSelectedId(null)}
      mutate={mutate}
    />
  ) : null;

  if (!loaded && !error) return <MyListSkeleton />;
  function row(item: MyListItem) {
    return (
      <div key={item.id}>
        <ItemRow
          item={item}
          selected={item.id === selected?.id}
          saving={saving}
          onSelect={() => setSelectedId(item.id)}
          onStatus={() =>
            void mutate((adapter) =>
              adapter.update(item.id, { status: item.status === 'done' ? 'planned' : 'done' })
            )
          }
        />
        {item.id === selected?.id && !desktop && <div className="mt-2">{panel}</div>}
      </div>
    );
  }
  return (
    <StorageModeProvider mode={account ? 'account' : 'local'}>
      <div className="mx-auto min-h-[75vh] max-w-[1180px] px-4 py-6 sm:px-6 sm:py-10">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
          <section className="min-w-0">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-serif text-[32px] font-medium leading-tight sm:text-[40px]">
                  My list
                </h1>
                <p className="mt-1 text-muted-foreground">
                  {active.length} still calling · {lived.length} lived
                </p>
              </div>
              <div className="max-w-32 pt-2 text-right">
                <StorageModeStatus compact />
              </div>
            </header>
            <div className="mt-7">
              <ManualItemInput
                disabled={!loaded || saving}
                canSubmitToCatalog={account}
                onAdd={async (input) => {
                  if (
                    items.some(
                      (item) => normalizeDreamTitle(item.title) === normalizeDreamTitle(input.title)
                    )
                  ) {
                    setError('This item is already in your list.');
                    return false;
                  }
                  return mutate((adapter) => adapter.add(input));
                }}
              />
            </div>
            {error && (
              <p role="alert" className="mt-4 text-sm text-destructive">
                {error}
              </p>
            )}
            {loaded && items.length === 0 && (
              <p className="mt-7 text-sm text-muted-foreground">
                Nothing here yet. Add the first thing you don't want to leave unlived, or{' '}
                <Link href="/experiences" className="underline underline-offset-4">
                  browse ideas
                </Link>
                .
              </p>
            )}
            <div className="mt-7 divide-y divide-border/60">{active.map(row)}</div>
            {lived.length > 0 && (
              <details open className="mt-9">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between border-t border-border/60 px-3 text-sm text-muted-foreground">
                  <span>Lived</span>
                  <span>{lived.length}</span>
                </summary>
                <div className="divide-y divide-border/60">{lived.map(row)}</div>
              </details>
            )}
            {boards.length > 0 && (
              <section
                aria-labelledby="bingo-boards"
                className="mt-9 border-t border-border/60 pt-3"
              >
                <h2 id="bingo-boards" className="px-3 font-sans text-sm text-muted-foreground">
                  Bingo boards
                </h2>
                <ul className="mt-1">
                  {boards.map((board) => (
                    <li key={board.id}>
                      <Link
                        href={`/bucket-list/${board.id}`}
                        className="flex min-h-11 items-center justify-between rounded-lg px-3 text-[15px] hover:bg-card focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {board.title}
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </section>
          <div className="sticky top-24 hidden min-w-0 lg:block">{desktop && panel}</div>
        </div>
      </div>
    </StorageModeProvider>
  );
}

function ItemRow({
  item,
  selected,
  saving,
  onSelect,
  onStatus,
}: {
  item: MyListItem;
  selected: boolean;
  saving: boolean;
  onSelect: () => void;
  onStatus: () => void;
}) {
  const done = item.status === 'done';
  const next = item.steps.find((step) => !step.done);
  const completed = formatDate(item.completedAt ?? item.updatedAt, {
    month: 'long',
    year: 'numeric',
  });
  return (
    <div className={`flex items-start gap-1 rounded-xl px-1 py-2 ${selected ? 'bg-card' : ''}`}>
      <button
        type="button"
        disabled={saving}
        onClick={onStatus}
        aria-label={done ? `Reopen ${item.title} to To do` : `Mark ${item.title} as lived`}
        className="flex size-11 shrink-0 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span
          className={`flex size-[22px] items-center justify-center rounded-full border ${done ? 'border-muted-foreground bg-muted-foreground text-background' : 'border-border'}`}
        >
          {done && <Check className="size-3.5" />}
        </span>
      </button>
      <button
        type="button"
        onClick={onSelect}
        aria-expanded={selected}
        aria-label={`Open ${item.title}`}
        className="flex min-h-11 min-w-0 flex-1 items-start gap-3 rounded-lg py-2 pr-2 text-left focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="min-w-0 flex-1">
          <span
            className={`block break-words text-[17px] leading-snug ${done ? 'text-muted-foreground' : ''}`}
          >
            {item.title}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted-foreground">
            {done ? (
              <span>Lived{completed ? ` ${completed}` : ''}</span>
            ) : (
              <>
                <span
                  className={`inline-flex items-center gap-1.5 ${item.status === 'in_progress' ? 'text-foreground' : ''}`}
                >
                  {item.status === 'in_progress' && (
                    <span className="size-1.5 rounded-full bg-brand" />
                  )}
                  {STATUS_LABELS[item.status]}
                </span>
                {next && <span className="break-words">Next: {next.text}</span>}
                {item.targetYear && <span>· by {item.targetYear}</span>}
              </>
            )}
          </span>
        </span>
        <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
      </button>
    </div>
  );
}

type Mutate = (action: (adapter: MyListStorage) => Promise<MyListItem[]>) => Promise<boolean>;
function ItemPanel({
  item,
  account,
  saving,
  notes,
  notesError,
  onNotesChange,
  onNotesSave,
  onBack,
  mutate,
}: {
  item: MyListItem;
  account: boolean;
  saving: boolean;
  notes: string;
  notesError: boolean;
  onNotesChange: (value: string) => void;
  onNotesSave: () => void;
  onBack: () => void;
  mutate: Mutate;
}) {
  const [step, setStep] = useState('');
  const [confirm, setConfirm] = useState(false);
  const year = new Date().getFullYear();
  const years = Array.from(
    new Set([
      ...Array.from({ length: 31 }, (_, index) => year + index),
      ...(item.targetYear ? [item.targetYear] : []),
    ])
  ).sort((a, b) => a - b);
  return (
    <aside
      aria-label={`Item: ${item.title}`}
      className="rounded-2xl border border-border/60 bg-card p-5 sm:p-7"
    >
      <button
        type="button"
        onClick={onBack}
        className="mb-3 min-h-11 text-sm text-muted-foreground lg:hidden"
      >
        ‹ My list
      </button>
      <h2 className="break-words font-serif text-[26px] font-medium leading-tight">{item.title}</h2>
      <div
        role="radiogroup"
        aria-label="Item status"
        onKeyDown={(event) => {
          const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
          if (!keys.includes(event.key) || saving) return;
          event.preventDefault();
          const buttons = [
            ...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]'),
          ];
          const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
          const direction = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
          const index =
            event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (current + direction + 3) % 3;
          buttons[index]?.focus();
          buttons[index]?.click();
        }}
        className="mt-5 flex rounded-full border border-border bg-surface p-1"
      >
        {(['planned', 'in_progress', 'done'] as const).map((status) => (
          <button
            key={status}
            type="button"
            role="radio"
            aria-checked={item.status === status}
            tabIndex={item.status === status ? 0 : -1}
            disabled={saving}
            onClick={() => void mutate((adapter) => adapter.update(item.id, { status }))}
            className={`min-h-11 flex-1 rounded-full px-2 text-sm focus-visible:ring-2 focus-visible:ring-ring ${item.status === status ? 'bg-muted text-foreground shadow-[inset_0_0_0_1px_var(--brand)]' : 'text-muted-foreground'}`}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-between text-sm text-muted-foreground">
        <h3>Next steps</h3>
        <span>
          {item.steps.filter((entry) => entry.done).length} of {item.steps.length}
        </span>
      </div>
      <ul className="mt-2">
        {item.steps.map((entry) => (
          <li key={entry.id} className="flex items-start gap-1">
            <label className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-3 py-2">
              <input
                type="checkbox"
                checked={entry.done}
                disabled={saving || entry.readOnly}
                onChange={(event) => {
                  // Read before queueing: React resets a controlled input after this handler.
                  const done = event.target.checked;
                  void mutate((adapter) => adapter.setStep(item.id, entry.id, done));
                }}
                className="size-5 shrink-0 accent-muted-foreground"
              />
              <span
                className={`min-w-0 break-words text-[15px] ${entry.done ? 'text-muted-foreground line-through' : ''}`}
              >
                {entry.text}
              </span>
            </label>
            {!entry.readOnly && (
              <button
                type="button"
                aria-label={`Remove step ${entry.text}`}
                disabled={saving}
                onClick={() => void mutate((adapter) => adapter.removeStep(item.id, entry.id))}
                className="size-11 shrink-0 rounded-lg text-muted-foreground"
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ul>
      <form
        className="mt-1 flex gap-2"
        onSubmit={async (event) => {
          event.preventDefault();
          if (step.trim() && (await mutate((adapter) => adapter.addStep(item.id, step.trim()))))
            setStep('');
        }}
      >
        <label htmlFor={`step-${item.id}`} className="sr-only">
          Add a step
        </label>
        <input
          id={`step-${item.id}`}
          value={step}
          onChange={(event) => setStep(event.target.value)}
          placeholder="+ Add a step"
          maxLength={200}
          disabled={saving}
          className="min-h-11 min-w-0 flex-1 rounded-lg bg-transparent px-2 text-sm placeholder:text-muted-foreground"
        />
        {step.trim() && (
          <button
            type="submit"
            disabled={saving}
            className="min-h-11 rounded-lg border border-border px-3 text-sm"
          >
            Add
          </button>
        )}
      </form>
      <h3 className="mt-6 text-sm text-muted-foreground">When</h3>
      <label htmlFor={`year-${item.id}`} className="sr-only">
        Target year
      </label>
      <select
        id={`year-${item.id}`}
        value={item.targetYear ?? ''}
        disabled={saving}
        onChange={(event) => {
          const targetYear = event.target.value ? Number(event.target.value) : null;
          void mutate((adapter) => adapter.update(item.id, { targetYear }));
        }}
        className="mt-2 min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm"
      >
        <option value="">Someday (no date)</option>
        {years.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      {account && (
        <>
          <label
            htmlFor={`visibility-${item.id}`}
            className="mt-4 block text-sm text-muted-foreground"
          >
            Visibility
          </label>
          <select
            id={`visibility-${item.id}`}
            value={item.visibility ?? 'private'}
            disabled={saving}
            onChange={(event) => {
              const visibility = event.target.value;
              void mutate((adapter) => adapter.update(item.id, { visibility }));
            }}
            className="mt-2 min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </>
      )}
      <label htmlFor={`notes-${item.id}`} className="mt-6 block text-sm text-muted-foreground">
        Notes
      </label>
      <textarea
        id={`notes-${item.id}`}
        value={notes}
        maxLength={500}
        disabled={saving}
        onChange={(event) => onNotesChange(event.target.value)}
        onBlur={onNotesSave}
        placeholder="Why this matters, links, who to do it with…"
        className="mt-2 min-h-24 w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm"
      />
      {notesError && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          Notes could not be saved. Your draft is still here.
        </p>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 text-[13px] text-muted-foreground">
        <span>
          {item.createdAt
            ? `Added ${formatDate(item.createdAt, { day: 'numeric', month: 'short', year: 'numeric' })}`
            : ''}
        </span>
        {confirm ? (
          <div className="flex flex-wrap items-center gap-2">
            <span>Remove this item?</span>
            <button
              type="button"
              disabled={saving}
              onClick={async () => {
                if (await mutate((adapter) => adapter.remove(item.id))) onBack();
              }}
              className="min-h-11 px-2 text-destructive"
            >
              Remove
            </button>
            <button type="button" onClick={() => setConfirm(false)} className="min-h-11 px-2">
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirm(true)} className="min-h-11">
            Remove from list
          </button>
        )}
      </div>
    </aside>
  );
}

function formatDate(value: string | null | undefined, options: Intl.DateTimeFormatOptions) {
  if (!value || Number.isNaN(new Date(value).getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', options).format(new Date(value));
}
