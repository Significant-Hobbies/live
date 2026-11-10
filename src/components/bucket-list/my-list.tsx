'use client';

import { Check, ChevronRight, Download } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { StorageModeProvider, StorageModeStatus } from '~/components/storage-mode-provider';
import { ExperiencePhoto } from '~/components/experience-photo';
import { ListInspiration } from '~/components/list-inspiration';
import { experienceImage } from '~/lib/experience-images';
import { normalizeDreamTitle } from '~/lib/dream-atlas';
import type { BucketUpdateInput } from '~/lib/bucket-updates';
import { formatBucketTargetDate } from '~/lib/bucket-target';
import {
  bucketListExport,
  downloadBucketJson,
  matchesMyListQuery,
  type MyListQuery,
} from '~/lib/bucket-list-data';
import { MyListControls } from './my-list-controls';
import { ManualItemInput } from './manual-item-input';
import { MyListRowsSkeleton } from './my-list-skeleton';
import {
  localMyListStorage,
  serverMyListStorage,
  type MyListItem,
  type MyListStorage,
} from './my-list-storage';

type Removal =
  | { phase: 'idle' }
  | { phase: 'waiting' | 'committing'; itemId: string; title: string };
const EMPTY_QUERY: MyListQuery = { search: '', status: 'all', category: 'all' };

const STATUS_LABELS = { planned: 'To do', in_progress: 'Doing', done: 'Lived' };

export function MyList({
  initialItems,
  boards = [],
}: {
  initialItems?: MyListItem[];
  boards?: Array<{ id: string; title: string }>;
}) {
  const account = initialItems !== undefined;
  const [query, setQuery] = useState<MyListQuery>(EMPTY_QUERY);
  const [removal, setRemoval] = useState<Removal>({ phase: 'idle' });
  const removalTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (removalTimer.current) clearTimeout(removalTimer.current);
    },
    []
  );
  const [storage] = useState(() =>
    initialItems !== undefined ? serverMyListStorage(initialItems) : localMyListStorage()
  );
  const [items, setItems] = useState(initialItems ?? []);
  const [loaded, setLoaded] = useState(account);
  useEffect(() => {
    if (initialItems !== undefined && storage.syncFromServer)
      setItems(storage.syncFromServer(initialItems));
  }, [initialItems, storage]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notesDrafts, setNotesDrafts] = useState<Record<string, string>>({});
  const [dateDrafts, setDateDrafts] = useState<Record<string, string>>({});
  const [notesFailures, setNotesFailures] = useState<Record<string, boolean>>({});
  const [updateDrafts, setUpdateDrafts] = useState<Record<string, BucketUpdateInput>>({});
  const [updateFeedback, setUpdateFeedback] = useState<
    Record<string, 'failed' | 'recovered' | undefined>
  >({});
  const postingUpdates = useRef(new Set<string>());
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

  function mutate(
    action: (adapter: MyListStorage) => Promise<MyListItem[]>,
    quiet = false,
    inlineError = false
  ) {
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
        if (!inlineError)
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
    if (notes === (item.notes ?? '')) return true;
    const ok = await mutate((adapter) => adapter.update(item.id, { notes: notes || null }), true);
    setNotesFailures((current) => ({ ...current, [item.id]: !ok }));
    if (ok)
      setNotesDrafts((current) => {
        if (current[item.id] !== notes) return current;
        const next = { ...current };
        delete next[item.id];
        return next;
      });
    return ok;
  }

  async function exportList() {
    for (const item of items) {
      const draft = notesDrafts[item.id];
      if (draft !== undefined && !(await saveNotes(item, draft))) {
        setError(
          'Export stopped because your latest notes could not be saved. Retry to keep your backup current.'
        );
        return;
      }
    }
    await queue.current;
    try {
      downloadBucketJson(bucketListExport(storage.snapshot()));
    } catch {
      setError('Your list could not be exported. Try again.');
    }
  }

  function scheduleRemoval(item: MyListItem) {
    if (removal.phase !== 'idle') return;
    setSelectedId(null);
    setRemoval({ phase: 'waiting', itemId: item.id, title: item.title });
    removalTimer.current = setTimeout(() => {
      removalTimer.current = null;
      setRemoval({ phase: 'committing', itemId: item.id, title: item.title });
      void mutate((adapter) => adapter.remove(item.id)).then(() => setRemoval({ phase: 'idle' }));
    }, 10_000);
  }

  function undoRemoval() {
    if (removal.phase !== 'waiting') return;
    if (removalTimer.current) clearTimeout(removalTimer.current);
    removalTimer.current = null;
    setSelectedId(removal.itemId);
    setRemoval({ phase: 'idle' });
  }

  async function postUpdate(item: MyListItem) {
    const draft = updateDrafts[item.id];
    if (!draft?.text.trim() || postingUpdates.current.has(item.id)) return;
    postingUpdates.current.add(item.id);
    let savedText: string | undefined;
    const ok = await mutate(
      async (adapter) => {
        const next = await adapter.addUpdate(item.id, draft);
        savedText = next
          .find((entry) => entry.id === item.id)
          ?.updates?.find((entry) => entry.id === draft.id)?.text;
        if (savedText === undefined) throw new Error('Update could not be confirmed');
        return next;
      },
      false,
      true
    );
    postingUpdates.current.delete(item.id);
    setUpdateFeedback((current) => ({
      ...current,
      [item.id]: !ok ? 'failed' : savedText !== draft.text.trim() ? 'recovered' : undefined,
    }));
    if (ok) {
      setUpdateDrafts((current) => {
        const currentDraft = current[item.id];
        if (!currentDraft || currentDraft.id !== draft.id) return current;
        const next = { ...current };
        if (currentDraft.text.trim() === savedText) delete next[item.id];
        else next[item.id] = { id: crypto.randomUUID(), text: currentDraft.text };
        return next;
      });
    }
  }

  const visibleItems = items.filter(
    (item) =>
      (removal.phase === 'idle' || item.id !== removal.itemId) && matchesMyListQuery(item, query)
  );
  const active = [...visibleItems]
    .reverse()
    .filter((item) => item.status !== 'done')
    .sort(
      (a, b) =>
        Number(b.status === 'in_progress') - Number(a.status === 'in_progress') ||
        (b.updatedAt ?? b.createdAt ?? '').localeCompare(a.updatedAt ?? a.createdAt ?? '')
    );
  const lived = [...visibleItems]
    .reverse()
    .filter((item) => item.status === 'done')
    .sort((a, b) =>
      (b.completedAt ?? b.updatedAt ?? '').localeCompare(a.completedAt ?? a.updatedAt ?? '')
    );
  // Desktop always shows one item beside the list, so the panel column is never empty.
  const selected =
    visibleItems.find((item) => item.id === selectedId) ?? (desktop ? active[0] : undefined);
  const panel = selected ? (
    <ItemPanel
      key={selected.id}
      item={selected}
      account={account}
      saving={saving}
      removalControl={{
        pending: removal.phase !== 'idle',
        remove: () => scheduleRemoval(selected),
      }}
      notes={{
        value: notesDrafts[selected.id] ?? selected.notes ?? '',
        failed: notesFailures[selected.id] ?? false,
        onChange: (value) => setNotesDrafts((current) => ({ ...current, [selected.id]: value })),
        onSave: () => void saveNotes(selected, notesDrafts[selected.id] ?? selected.notes ?? ''),
      }}
      targetDate={{
        value: dateDrafts[selected.id] ?? selected.targetDate ?? '',
        onChange: (value) => setDateDrafts((current) => ({ ...current, [selected.id]: value })),
        onSave: async () => {
          const value = dateDrafts[selected.id] ?? selected.targetDate ?? '';
          if (await mutate((adapter) => adapter.update(selected.id, { targetDate: value || null })))
            setDateDrafts((current) => {
              const next = { ...current };
              delete next[selected.id];
              return next;
            });
        },
      }}
      updateComposer={{
        draft: updateDrafts[selected.id]?.text ?? '',
        feedback: updateFeedback[selected.id],
        onChange: (text) =>
          setUpdateDrafts((current) => ({
            ...current,
            [selected.id]: { id: current[selected.id]?.id ?? crypto.randomUUID(), text },
          })),
        onPost: () => void postUpdate(selected),
      }}
      onBack={() => setSelectedId(null)}
      mutate={mutate}
    />
  ) : null;

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
        <div
          className={`grid items-start gap-10 ${items.length > 0 ? 'lg:grid-cols-[minmax(0,1fr)_420px]' : ''}`}
        >
          <section className="min-w-0">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-serif text-[32px] font-medium leading-tight sm:text-[40px]">
                  My list
                </h1>
                <p className="mt-1 text-muted-foreground">
                  {loaded
                    ? `${items.filter((item) => item.status !== 'done').length} still calling · ${items.filter((item) => item.status === 'done').length} lived`
                    : error
                      ? 'Your list is unavailable.'
                      : 'Opening your list…'}
                </p>
              </div>
              <div className="max-w-32 pt-2 text-right">
                <StorageModeStatus compact />
                <button
                  type="button"
                  disabled={!loaded || saving}
                  onClick={() => void exportList()}
                  className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4 disabled:opacity-50"
                >
                  <Download className="size-4" />
                  Export all
                </button>
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
            {removal.phase !== 'idle' && (
              <div
                role="status"
                className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm"
              >
                <span>
                  {removal.phase === 'waiting'
                    ? `Removing “${removal.title}” in 10 seconds. Leaving this page cancels removal.`
                    : `Removing “${removal.title}”…`}
                </span>
                {removal.phase === 'waiting' && (
                  <button
                    type="button"
                    onClick={undoRemoval}
                    className="min-h-11 font-semibold underline underline-offset-4"
                  >
                    Undo
                  </button>
                )}
              </div>
            )}
            {loaded && items.length > 0 && (
              <MyListControls
                items={items}
                query={query}
                onChange={setQuery}
                matches={visibleItems.length}
                removing={removal.phase !== 'idle'}
              />
            )}
            {error && (
              <p role="alert" className="mt-4 text-sm text-destructive">
                {error}
              </p>
            )}
            {loaded && items.length === 0 && (
              <div>
                <p className="mt-7 text-sm text-muted-foreground">Nothing here yet.</p>
                <ListInspiration />
              </div>
            )}
            {!loaded && !error ? (
              <div role="status" aria-label="Loading My list">
                <MyListRowsSkeleton />
              </div>
            ) : (
              <div className="mt-7 divide-y divide-border/60">{active.map(row)}</div>
            )}
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
          {items.length > 0 && (
            <div className="sticky top-24 hidden min-w-0 lg:block">{desktop && panel}</div>
          )}
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
        <ExperiencePhoto
          title={item.title}
          category={item.category}
          decorative
          sizes="64px"
          className="h-14 w-14 shrink-0 rounded-lg"
        />
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
                {item.targetDate ? (
                  <span>· aiming for {formatBucketTargetDate(item.targetDate)}</span>
                ) : item.targetYear ? (
                  <span>· by {item.targetYear}</span>
                ) : null}
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
  removalControl,
  notes,
  targetDate,
  updateComposer,
  onBack,
  mutate,
}: {
  item: MyListItem;
  account: boolean;
  saving: boolean;
  removalControl: { pending: boolean; remove: () => void };
  notes: {
    value: string;
    failed: boolean;
    onChange: (value: string) => void;
    onSave: () => void;
  };
  targetDate: {
    value: string;
    onChange: (value: string) => void;
    onSave: () => Promise<void>;
  };
  updateComposer: {
    draft: string;
    feedback: 'failed' | 'recovered' | undefined;
    onChange: (text: string) => void;
    onPost: () => void;
  };
  onBack: () => void;
  mutate: Mutate;
}) {
  const [title, setTitle] = useState(item.title);
  const [editingTitle, setEditingTitle] = useState(false);
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
      {experienceImage(item.title, item.category) && (
        <figure className="-mx-5 -mt-5 mb-5 overflow-hidden rounded-t-2xl sm:-mx-7 sm:-mt-7">
          <ExperiencePhoto
            title={item.title}
            category={item.category}
            sizes="(min-width: 1024px) 420px, 100vw"
            className="aspect-[2/1] w-full"
          />
          <figcaption className="px-5 pt-2 text-xs text-muted-foreground sm:px-7">
            Inspiration for your next experience
          </figcaption>
        </figure>
      )}
      <button
        type="button"
        onClick={onBack}
        className="mb-3 min-h-11 text-sm text-muted-foreground lg:hidden"
      >
        ‹ My list
      </button>
      <h2 className="break-words font-serif text-[26px] font-medium leading-tight">{item.title}</h2>
      {editingTitle ? (
        <form
          className="mt-3 space-y-2"
          onSubmit={async (event) => {
            event.preventDefault();
            if (
              title.trim() &&
              (await mutate((adapter) => adapter.update(item.id, { title: title.trim() })))
            )
              setEditingTitle(false);
          }}
        >
          <label htmlFor={`title-${item.id}`} className="block text-sm text-muted-foreground">
            Item title
          </label>
          <input
            id={`title-${item.id}`}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={200}
            required
            disabled={saving}
            className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-base"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="min-h-11 rounded-xl bg-brand px-4 text-sm text-brand-foreground disabled:opacity-50"
            >
              Save title
            </button>
            <button
              type="button"
              className="min-h-11 text-sm"
              onClick={() => {
                setTitle(item.title);
                setEditingTitle(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => {
            setTitle(item.title);
            setEditingTitle(true);
          }}
          className="min-h-11 text-sm text-muted-foreground underline underline-offset-4"
        >
          Edit title
        </button>
      )}
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
      <label htmlFor={`year-${item.id}`} className="mt-2 block text-sm text-muted-foreground">
        Target year
      </label>
      <select
        id={`year-${item.id}`}
        aria-describedby={item.targetDate ? `year-help-${item.id}` : undefined}
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
      {item.targetDate && (
        <p id={`year-help-${item.id}`} className="mt-2 text-xs text-muted-foreground">
          Changing the year clears the exact date.
        </p>
      )}
      <form
        className="mt-4"
        onSubmit={(event) => {
          event.preventDefault();
          void targetDate.onSave();
        }}
      >
        <label htmlFor={`target-date-${item.id}`} className="block text-sm text-muted-foreground">
          Tentative target date
        </label>
        <p id={`target-date-help-${item.id}`} className="mt-1 text-xs text-muted-foreground">
          Have a day in mind? Set a starting point. You can change it anytime.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            id={`target-date-${item.id}`}
            type="date"
            min="1900-01-01"
            max="2200-12-31"
            value={targetDate.value}
            onChange={(event) => targetDate.onChange(event.target.value)}
            aria-describedby={`target-date-help-${item.id}`}
            disabled={saving}
            className="min-h-11 min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 text-base"
          />
          <button
            type="submit"
            disabled={saving || targetDate.value === (item.targetDate ?? '')}
            className="min-h-11 rounded-xl border border-border px-4 text-sm focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            Save date
          </button>
        </div>
        {targetDate.value && (
          <button
            type="button"
            disabled={saving}
            onClick={() => targetDate.onChange('')}
            className="min-h-11 text-sm text-muted-foreground underline underline-offset-4"
          >
            Clear date
          </button>
        )}
      </form>
      {account && (
        <>
          <label
            htmlFor={`visibility-${item.id}`}
            className="mt-4 block text-sm text-muted-foreground"
          >
            Who can see this item?
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
            <option value="private">Private — only you</option>
            <option value="public">Public — on your public profile</option>
          </select>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            A public profile does not change this choice. Notes, steps and updates stay private.
          </p>
        </>
      )}
      <label htmlFor={`notes-${item.id}`} className="mt-6 block text-sm text-muted-foreground">
        Notes
      </label>
      <textarea
        id={`notes-${item.id}`}
        value={notes.value}
        maxLength={500}
        disabled={saving}
        onChange={(event) => notes.onChange(event.target.value)}
        onBlur={notes.onSave}
        placeholder="Why this matters, links, who to do it with…"
        className="mt-2 min-h-24 w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm"
      />
      {notes.failed && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          Notes could not be saved. Your draft is still here.
        </p>
      )}
      <section
        aria-labelledby={`updates-heading-${item.id}`}
        className="mt-7 border-t border-border/60 pt-5"
      >
        <h3 id={`updates-heading-${item.id}`} className="text-sm">
          Updates
        </h3>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Small steps, new plans, moments worth keeping. Only you can see these.
        </p>
        <form
          className="mt-3"
          onSubmit={(event) => {
            event.preventDefault();
            updateComposer.onPost();
          }}
        >
          <label htmlFor={`update-${item.id}`} className="sr-only">
            Add an update
          </label>
          <textarea
            id={`update-${item.id}`}
            value={updateComposer.draft}
            onChange={(event) => updateComposer.onChange(event.target.value)}
            maxLength={2000}
            disabled={saving}
            placeholder="What’s happened with this one?"
            className="min-h-24 w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              {updateComposer.draft.length} / 2000
            </span>
            <button
              type="submit"
              disabled={saving || !updateComposer.draft.trim()}
              className="min-h-11 rounded-xl bg-brand px-4 text-sm font-medium text-brand-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            >
              Post update
            </button>
          </div>
          {updateComposer.feedback === 'failed' && (
            <p role="alert" className="mt-2 text-sm text-destructive">
              Update could not be confirmed. Your draft is still here. Retry, or reload to check
              your history.
            </p>
          )}
          {updateComposer.feedback === 'recovered' && (
            <p role="status" className="mt-2 text-sm text-muted-foreground">
              An earlier version was already saved.
            </p>
          )}
        </form>
        {(item.updates ?? []).length > 0 ? (
          <ol aria-label="Item updates" className="mt-5 divide-y divide-border/60">
            {(item.updates ?? []).map((update) => (
              <li key={update.id} className="py-4 first:pt-0">
                <time dateTime={update.createdAt} className="text-xs text-muted-foreground">
                  {formatDate(update.createdAt, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
                <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {update.text}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Your story with this one starts here.
          </p>
        )}
      </section>
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
              disabled={saving || removalControl.pending}
              onClick={removalControl.remove}
              className="min-h-11 px-2 text-destructive"
            >
              Remove
            </button>
            <button type="button" onClick={() => setConfirm(false)} className="min-h-11 px-2">
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={saving || removalControl.pending}
            onClick={() => setConfirm(true)}
            className="min-h-11"
          >
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
