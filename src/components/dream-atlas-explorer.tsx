'use client';

import {
  ArrowRight,
  Check,
  Compass,
  Footprints,
  ListPlus,
  Loader2,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState, useTransition } from 'react';

import { WiderWorldLinks } from '~/components/wider-world-links';
import { addBucketListItems, setCallingBucketListDream } from '~/lib/actions/bucket-list';
import {
  DREAM_TERRITORIES,
  dreamCategoryLabel,
  dreamKindLabel,
  hasNativeDreamMatch,
  normalizeDreamTitle,
  parseDreamList,
  searchDreamAtlas,
  type DreamAtlasEntry,
} from '~/lib/dream-atlas';
import { selectDreamDoor } from '~/lib/dream-doors';
import {
  addDreamsToLocalRecord,
  setCallingDreamInLocalRecord,
  type LocalDreamInput,
} from '~/lib/local-dreams';

type OwnedDream = { id: string; title: string; status: 'planned' | 'in_progress' };

export function DreamAtlasExplorer({
  entries,
  initialItems,
  mode,
  name,
}: {
  entries: DreamAtlasEntry[];
  initialItems: OwnedDream[];
  mode: 'account' | 'local';
  name?: string | null;
}) {
  const [items, setItems] = useState(() => uniqueItems(initialItems));
  const [query, setQuery] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  const [territoriesExpanded, setTerritoriesExpanded] = useState(false);
  const [importText, setImportText] = useState('');
  const [excludedImports, setExcludedImports] = useState<Set<string>>(() => new Set());
  const [status, setStatus] = useState('');
  const [pendingTitles, setPendingTitles] = useState<Set<string>>(() => new Set());
  const [callingPendingId, setCallingPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const matches = useMemo(() => searchDreamAtlas(entries, query, 8), [entries, query]);
  const nativeMatches = matches.filter((match) => match.strength === 'native');
  const hasNativeMatch = hasNativeDreamMatch(nativeMatches);
  const parsedImports = useMemo(() => parseDreamList(importText), [importText]);
  const approvedImports = parsedImports.filter(
    (title) => !excludedImports.has(normalizeDreamTitle(title))
  );
  const callingDream = items.find((item) => item.status === 'in_progress') ?? items[0];
  const callingDoor = callingDream ? selectDreamDoor(callingDream.title, entries) : null;

  useEffect(() => {
    setExcludedImports(new Set());
  }, [importText]);

  function save(inputs: LocalDreamInput[], successMessage?: string) {
    const pendingKeys = new Set(inputs.map((input) => normalizeDreamTitle(input.title)));
    setPendingTitles((current) => new Set([...current, ...pendingKeys]));
    setStatus('Saving privately…');
    startTransition(async () => {
      try {
        const result =
          mode === 'account'
            ? await addBucketListItems(inputs)
            : await addDreamsToLocalRecord(inputs);
        const added = result.added;
        setItems((current) =>
          uniqueItems([
            ...current,
            ...added.map((title) => ({
              id: `added-${crypto.randomUUID()}`,
              title,
              status: 'planned' as const,
            })),
          ])
        );
        for (const title of added) {
          window.dispatchEvent(new CustomEvent('bucket-list:item-added', { detail: { title } }));
        }
        setStatus(
          added.length > 0
            ? (successMessage ??
                `${added.length} ${added.length === 1 ? 'dream is' : 'dreams are'} now in your atlas.`)
            : 'Those dreams are already in your atlas.'
        );
      } catch {
        setStatus('Live could not save that yet. Your text is still here—please try again.');
      } finally {
        setPendingTitles((current) => {
          const next = new Set(current);
          for (const key of pendingKeys) next.delete(key);
          return next;
        });
      }
    });
  }

  function surpriseMe() {
    const choice = entries[Math.floor(Math.random() * entries.length)];
    if (choice) setQuery(choice.title);
  }

  function callDreamForward(item: OwnedDream) {
    setCallingPendingId(item.id);
    setStatus(`Bringing “${item.title}” forward…`);
    startTransition(async () => {
      try {
        const result =
          mode === 'account'
            ? await setCallingBucketListDream(item.title)
            : await setCallingDreamInLocalRecord(item.title);
        if (!('success' in result ? result.success : result.updated)) {
          throw new Error('Calling dream was not updated');
        }
        setItems((current) => {
          const selected = current.find((candidate) => candidate.id === item.id);
          if (!selected) return current;
          return [
            { ...selected, status: 'in_progress' },
            ...current.filter((candidate) => candidate.id !== item.id),
          ];
        });
        setStatus(`“${item.title}” is now the dream Live brings forward.`);
      } catch {
        setStatus('Live could not change the calling dream yet. Please try again.');
      } finally {
        setCallingPendingId(null);
      }
    });
  }

  const exactQuery = query.trim();
  const exactOwnedDream = items.find(
    (item) => normalizeDreamTitle(item.title) === normalizeDreamTitle(exactQuery)
  );

  return (
    <div className="flex flex-col gap-8">
      {!exactQuery && callingDream && callingDoor ? (
        <section
          aria-labelledby="calling-dream-title"
          className="overflow-hidden rounded-[1.75rem] bg-[#b9dcf5]"
        >
          <div className="grid lg:grid-cols-[1.22fr_0.78fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex items-center gap-3 text-sm font-bold text-[#22526b]">
                <span className="flex size-10 items-center justify-center rounded-full bg-[#211e18] text-white">
                  <Compass className="size-5" aria-hidden="true" />
                </span>
                Calling now
              </div>
              <h1
                id="calling-dream-title"
                className="mt-5 max-w-3xl font-serif text-4xl leading-[1.04] tracking-[-0.03em] sm:text-5xl"
              >
                {callingDream.title}
              </h1>
              <div className="mt-7 border-t border-[#22526b]/25 pt-6">
                <p className="text-sm font-bold text-[#22526b]">{callingDoor.label}</p>
                <h2 className="mt-2 max-w-2xl font-serif text-2xl leading-tight sm:text-3xl">
                  {callingDoor.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#344f5d] sm:text-base">
                  {callingDoor.description}
                </p>
                {callingDoor.href.startsWith('http') ? (
                  <a
                    href={callingDoor.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#211e18] px-5 font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211e18]"
                  >
                    Open this door <span className="sr-only">(opens in a new tab)</span>
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                ) : (
                  <Link
                    href={callingDoor.href}
                    className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#211e18] px-5 font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211e18]"
                  >
                    Open this door <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>

            <aside className="bg-[#fffdf8] p-6 sm:p-8 lg:p-10">
              <p className="text-sm font-bold text-[#176b4a]">Other dreams still calling</p>
              <p className="mt-2 text-sm leading-relaxed text-[#625b50]">
                Choose another and Live will bring its next door here. Your other in-progress dreams
                stay intact.
              </p>
              {items.length > 1 ? (
                <ul className="mt-4 divide-y divide-[#e8dfd1]">
                  {items
                    .filter((item) => item.id !== callingDream.id)
                    .slice(0, 3)
                    .map((item) => (
                      <li key={item.id} className="py-3">
                        <p className="font-serif text-lg leading-snug">{item.title}</p>
                        <button
                          type="button"
                          disabled={callingPendingId !== null}
                          onClick={() => callDreamForward(item)}
                          className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-left text-xs font-bold text-[#6c3d2b] underline decoration-[#d79b7f] underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c3d2b] disabled:opacity-50"
                          aria-label={`Bring ${item.title} forward and find its first door`}
                        >
                          {callingPendingId === item.id ? (
                            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                          ) : (
                            <Footprints className="size-3.5" aria-hidden="true" />
                          )}
                          Call this forward
                        </button>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-[#625b50]">
                  One dream is enough. You can add another whenever something new starts tugging at
                  you.
                </p>
              )}
              {items.length > 4 ? (
                <p className="mt-3 text-sm text-[#625b50]">
                  And {items.length - 4} more in your atlas.
                </p>
              ) : null}
              <Link
                href="/bucket-list"
                className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211e18]"
              >
                Manage the whole atlas <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </aside>
          </div>
          <div className="bg-[#211e18] px-6 py-5 text-white sm:px-8 lg:px-10">
            <p className="max-w-3xl text-sm leading-relaxed text-white/70">
              <strong className="text-white">Dreams are not a contract.</strong> Changing direction
              is part of the atlas, not a failed streak.
            </p>
          </div>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-[2rem] bg-[#a8dc91] text-[#192817] shadow-[0_18px_55px_rgba(53,80,40,0.13)]">
        <div className="grid gap-8 px-6 py-9 sm:px-10 sm:py-11 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div>
            <p className="text-sm font-bold text-[#0f593c]">An open world. A private atlas.</p>
            {!exactQuery && callingDream ? (
              <h2 className="mt-3 max-w-4xl font-serif text-5xl font-medium leading-[0.94] tracking-[-0.045em] sm:text-7xl">
                There are more ways to live{name ? `, ${name}` : ''}.
              </h2>
            ) : (
              <h1 className="mt-3 max-w-4xl font-serif text-5xl font-medium leading-[0.94] tracking-[-0.045em] sm:text-7xl">
                There are more ways to live{name ? `, ${name}` : ''}.
              </h1>
            )}
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#344b31] sm:text-lg">
              Name anything—even if it sounds impossible or only makes sense to you. Live will show
              what it genuinely knows, keep the exact dream, and open the wider world when its own
              atlas ends.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-[#211e18] p-4 text-white sm:p-5">
            <label htmlFor="dream-atlas-search" className="font-serif text-xl">
              What do you still want to live?
            </label>
            <div className="mt-3 flex gap-2">
              <span className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-xl bg-white/10 px-3 ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-[#f7e957]">
                <Search className="size-4 shrink-0 text-white/60" />
                <input
                  id="dream-atlas-search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setStatus('');
                  }}
                  placeholder="go to space, start a band…"
                  className="min-w-0 flex-1 bg-transparent py-3 text-base text-white outline-none placeholder:text-white/45"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="flex size-11 shrink-0 items-center justify-center rounded-full text-white/65 hover:bg-white/10 hover:text-white"
                    aria-label="Clear dream search"
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={surpriseMe}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#f7e957] px-4 text-sm font-bold text-[#211e18]"
              >
                <Sparkles className="size-4" /> Surprise me
              </button>
              <button
                type="button"
                onClick={() => setImportOpen((current) => !current)}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 px-4 text-sm font-bold text-white"
              >
                {importOpen ? <X className="size-4" /> : <ListPlus className="size-4" />}
                {importOpen ? 'Close list import' : 'Paste a whole list'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <p aria-live="polite" className="text-sm font-medium text-[#176b4a]">
        {status}
      </p>

      {importOpen ? (
        <section className="rounded-[1.75rem] border border-[#d9cfbd] bg-[#fffdf8] p-5 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <p className="text-sm font-bold text-[#176b4a]">Bring your existing dreams</p>
              <h2 className="mt-2 font-serif text-4xl leading-tight">
                Paste the list exactly as it is.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#625b50]">
                Numbering and bullets are removed. Your wording is not. Exact duplicates are
                collapsed before anything is saved.
              </p>
              <label htmlFor="dream-list-import" className="sr-only">
                Bucket list to import
              </label>
              <textarea
                id="dream-list-import"
                value={importText}
                onChange={(event) => setImportText(event.target.value)}
                rows={10}
                placeholder={'1. Participate in a car race\n2. Start my band\n3. Go to space'}
                className="mt-5 w-full resize-y rounded-xl border border-[#cfc3b0] bg-white px-4 py-3 text-base outline-none focus:border-[#176b4a] focus:ring-2 focus:ring-[#176b4a]/20"
              />
            </div>
            <div className="rounded-2xl bg-[#f6efe3] p-4 sm:p-5">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#176b4a]">Import preview</p>
                  <h3 className="mt-1 font-serif text-2xl">Dreams Live will keep</h3>
                </div>
                <span className="font-serif text-3xl tabular-nums">{approvedImports.length}</span>
              </div>
              {parsedImports.length > 0 ? (
                <ul className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
                  {parsedImports.map((title) => {
                    const key = normalizeDreamTitle(title);
                    const excluded = excludedImports.has(key);
                    return (
                      <li
                        key={key}
                        className={`flex items-start gap-2 rounded-xl px-3 py-2 text-sm ${
                          excluded
                            ? 'bg-white/40 text-[#8a8175] line-through'
                            : 'bg-white text-[#211e18]'
                        }`}
                      >
                        <span className="min-w-0 flex-1">{title}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setExcludedImports((current) => {
                              const next = new Set(current);
                              if (next.has(key)) next.delete(key);
                              else next.add(key);
                              return next;
                            })
                          }
                          className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-[#eee4d4]"
                          aria-label={`${excluded ? 'Restore' : 'Exclude'} ${title}`}
                        >
                          {excluded ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-8 text-sm leading-relaxed text-[#766f65]">
                  Your preview will appear here. Live accepts up to 100 lines at once.
                </p>
              )}
              <button
                type="button"
                disabled={isPending || approvedImports.length === 0}
                onClick={() =>
                  save(
                    approvedImports.map((title) => ({ title })),
                    `${approvedImports.length} dreams are now in your atlas.`
                  )
                }
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#176b4a] px-5 font-bold text-white disabled:opacity-45"
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ListPlus className="size-4" />
                )}
                Keep these dreams
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {exactQuery ? (
        <section aria-label="Dream search results" className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#176b4a]">
                {hasNativeMatch ? 'Live knows a path into this' : 'The native atlas ends here'}
              </p>
              <h2 className="mt-1 font-serif text-4xl sm:text-5xl">“{exactQuery}”</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[#625b50]">
              {hasNativeMatch
                ? 'Keep your exact wording or borrow a developed possibility from Live.'
                : 'Live will not force this into an unrelated category. Keep it exactly, then explore current doors beyond the catalogue.'}
            </p>
          </div>

          {hasNativeMatch && exactOwnedDream ? (
            <div className="flex flex-col gap-4 rounded-2xl bg-[#fff8d6] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-[#176b4a]">Saved exactly as you wrote it</p>
                <p className="mt-1 font-serif text-2xl">{exactOwnedDream.title}</p>
              </div>
              <button
                type="button"
                disabled={callingPendingId !== null || exactOwnedDream.id === callingDream?.id}
                onClick={() => callDreamForward(exactOwnedDream)}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#211e18] px-4 font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211e18] disabled:opacity-55"
              >
                {callingPendingId === exactOwnedDream.id ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : exactOwnedDream.id === callingDream?.id ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  <Footprints className="size-4" aria-hidden="true" />
                )}
                {exactOwnedDream.id === callingDream?.id ? 'Calling now' : 'Call this forward'}
              </button>
            </div>
          ) : null}

          {!hasNativeMatch ? (
            <div className="overflow-hidden rounded-[1.5rem] bg-[#f7e957] p-5 sm:p-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-xl">
                  <p className="text-sm font-bold">Only yours—for now</p>
                  <h3 className="mt-2 font-serif text-3xl leading-tight">
                    Keep the dream. Open the world.
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#575344]">
                    This exact dream is not developed inside Live yet. Saving it does not make a
                    false promise; it gives you a durable place to return while the external world
                    supplies the changing details.
                  </p>
                  <button
                    type="button"
                    disabled={
                      pendingTitles.has(normalizeDreamTitle(exactQuery)) ||
                      callingPendingId !== null ||
                      exactOwnedDream?.id === callingDream?.id
                    }
                    onClick={() =>
                      exactOwnedDream
                        ? callDreamForward(exactOwnedDream)
                        : save([{ title: exactQuery }])
                    }
                    className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#211e18] px-4 font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211e18] disabled:opacity-55"
                  >
                    {pendingTitles.has(normalizeDreamTitle(exactQuery)) ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : exactOwnedDream?.id === callingDream?.id ? (
                      <Check className="size-4" />
                    ) : exactOwnedDream ? (
                      <Footprints className="size-4" />
                    ) : (
                      <Sparkles className="size-4" />
                    )}
                    {exactOwnedDream?.id === callingDream?.id
                      ? 'Calling now'
                      : exactOwnedDream
                        ? 'Call this forward'
                        : 'Keep this exact dream'}
                  </button>
                </div>
                <div className="w-full max-w-lg">
                  <WiderWorldLinks query={exactQuery} compact />
                </div>
              </div>
            </div>
          ) : null}

          {nativeMatches.length > 0 ? (
            <div>
              <p className="mb-3 text-sm font-bold text-[#176b4a]">Developed in Live</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {nativeMatches.map(({ entry }, index) => {
                  const key = normalizeDreamTitle(entry.title);
                  const kindLabel = dreamKindLabel(entry.kind);
                  const ownedDream = items.find((item) => normalizeDreamTitle(item.title) === key);
                  const owned = !!ownedDream;
                  const pending = pendingTitles.has(key);
                  const calling = ownedDream?.id === callingDream?.id;
                  return (
                    <article
                      key={entry.slug}
                      className={`flex min-h-56 flex-col justify-between rounded-[1.25rem] p-5 ${
                        ['bg-[#ffd0bd]', 'bg-[#b9dcf5]', 'bg-[#dceabf]', 'bg-[#c5abfa]'][index % 4]
                      } ${index === 0 ? 'sm:col-span-2 sm:min-h-64' : ''}`}
                    >
                      <div>
                        <span className="text-3xl" aria-hidden="true">
                          {entry.emoji}
                        </span>
                        <p className="mt-5 text-sm font-bold opacity-65">
                          {kindLabel === 'idea' ? 'An' : 'A'} {kindLabel} in{' '}
                          {dreamCategoryLabel(entry.category)}
                        </p>
                        <h3 className="mt-2 max-w-xl font-serif text-2xl leading-tight sm:text-3xl">
                          {entry.title}
                        </h3>
                        {entry.description ? (
                          <p className="mt-3 max-w-2xl text-sm leading-relaxed opacity-75">
                            {entry.description}
                          </p>
                        ) : null}
                      </div>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={pending || callingPendingId !== null || calling}
                          onClick={() =>
                            ownedDream
                              ? callDreamForward(ownedDream)
                              : save([
                                  {
                                    title: entry.title,
                                    description: entry.description,
                                    category: entry.category,
                                    sourceSlug: entry.slug,
                                  },
                                ])
                          }
                          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#211e18] px-4 text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211e18] disabled:opacity-55"
                        >
                          {pending ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : calling ? (
                            <Check className="size-4" />
                          ) : owned ? (
                            <Footprints className="size-4" />
                          ) : (
                            <Sparkles className="size-4" />
                          )}
                          {calling
                            ? 'Calling now'
                            : owned
                              ? 'Call this forward'
                              : 'Keep this possibility'}
                        </button>
                        <Link
                          href={`/experiences/${entry.slug}`}
                          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#211e18]/25 px-4 text-sm font-bold"
                        >
                          See the path <ArrowRight className="size-4" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : null}
        </section>
      ) : (
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#176b4a]">Ways into a larger life</p>
              <h2 className="mt-1 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
                Wander beyond the categories you already know.
              </h2>
            </div>
            <Link
              href="/experiences"
              className="inline-flex min-h-11 items-center gap-2 font-bold underline decoration-[#176b4a] underline-offset-4"
            >
              Explore the full native atlas <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="relative mt-6 overflow-hidden rounded-2xl bg-[#fffdf8] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
            <div
              aria-hidden="true"
              className="absolute bottom-10 left-8 top-10 w-px bg-[#176b4a]/25 lg:hidden"
            />
            <svg
              aria-hidden="true"
              viewBox="0 0 1000 1500"
              preserveAspectRatio="none"
              className="absolute inset-12 hidden h-[calc(100%_-_6rem)] w-[calc(100%_-_6rem)] text-[#176b4a]/20 lg:block"
            >
              <path
                d="M190 0 C 190 190, 790 130, 790 330 S 170 500, 190 700 S 810 850, 770 1050 S 180 1230, 220 1500"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeDasharray="10 13"
              />
            </svg>
            <ol className="relative grid gap-8 lg:grid-cols-12 lg:gap-y-6">
              {(territoriesExpanded ? DREAM_TERRITORIES : DREAM_TERRITORIES.slice(0, 3)).map(
                (territory, index) => (
                  <li
                    key={territory.id}
                    className={`relative pl-12 lg:pl-0 ${TERRITORY_PLACEMENTS[index]}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-5 flex size-9 items-center justify-center rounded-full border-4 border-[#fffdf8] font-serif text-lg lg:-left-5 ${territory.color}`}
                    >
                      {territory.emoji}
                    </span>
                    <article className={`rounded-2xl p-5 sm:p-6 ${territory.color}`}>
                      <h3 className="font-serif text-3xl leading-tight">{territory.label}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-[#49433b]">
                        {territory.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => setQuery(territory.prompts[0] ?? '')}
                        className="group mt-5 flex min-h-11 w-full items-center justify-between gap-3 border-b border-[#211e18]/15 text-left text-sm font-semibold"
                      >
                        <span>{territory.prompts[0]}</span>
                        <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-1" />
                      </button>
                      <details className="group/more mt-1">
                        <summary className="flex min-h-11 cursor-pointer list-none items-center text-sm font-bold text-[#211e18] marker:content-none">
                          Two more ways into this territory
                        </summary>
                        <div className="space-y-1">
                          {territory.prompts.slice(1).map((prompt) => (
                            <button
                              key={prompt}
                              type="button"
                              onClick={() => setQuery(prompt)}
                              className="flex min-h-11 w-full items-center justify-between gap-3 border-b border-[#211e18]/15 text-left text-sm font-semibold"
                            >
                              <span>{prompt}</span>
                              <ArrowRight className="size-3.5 shrink-0" />
                            </button>
                          ))}
                        </div>
                      </details>
                    </article>
                  </li>
                )
              )}
            </ol>
            {!territoriesExpanded ? (
              <button
                type="button"
                onClick={() => setTerritoriesExpanded(true)}
                className="relative mx-auto mt-8 flex min-h-11 items-center gap-2 rounded-xl bg-[#211e18] px-5 text-sm font-bold text-white"
              >
                Continue into three more territories <ArrowRight className="size-4" />
              </button>
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
}

function uniqueItems(items: OwnedDream[]): OwnedDream[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = normalizeDreamTitle(item.title);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const TERRITORY_PLACEMENTS = [
  'lg:col-span-5',
  'lg:col-start-7 lg:col-span-6 lg:mt-24',
  'lg:col-start-2 lg:col-span-5 lg:mt-8',
  'lg:col-start-8 lg:col-span-5 lg:mt-12',
  'lg:col-span-6 lg:mt-12',
  'lg:col-start-7 lg:col-span-6 lg:mt-16',
] as const;
