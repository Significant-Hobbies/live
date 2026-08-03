'use client';

import { ArrowRight, Footprints, Plus } from 'lucide-react';
import Link from 'next/link';
import { type FormEvent, useEffect, useState, useTransition } from 'react';

import { addBucketListItem } from '~/lib/actions/bucket-list';
import { browserRecordAdapter, readLocalRecord, writeLocalRecord } from '~/lib/local-record-store';

type OwnedItem = { id: string; title: string };

export function LiveMoreBucketFocus({
  initialItems,
  goals,
  mode,
  name,
}: {
  initialItems: OwnedItem[];
  goals: string[];
  mode: 'account' | 'local';
  name?: string | null;
}) {
  const [items, setItems] = useState(() => uniqueItems(initialItems));
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    function receiveAddedItem(event: Event) {
      const detail = (event as CustomEvent<{ title?: string }>).detail;
      const nextTitle = detail?.title?.trim();
      if (!nextTitle) return;
      setItems((current) =>
        current.some((item) => item.title.toLowerCase() === nextTitle.toLowerCase())
          ? current
          : [...current, { id: `added-${crypto.randomUUID()}`, title: nextTitle }]
      );
    }
    window.addEventListener('bucket-list:item-added', receiveAddedItem);
    return () => window.removeEventListener('bucket-list:item-added', receiveAddedItem);
  }, []);

  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) return;
    if (items.some((item) => item.title.toLowerCase() === nextTitle.toLowerCase())) {
      setStatus('That is already on your list.');
      return;
    }

    startTransition(async () => {
      try {
        let id = `local-${crypto.randomUUID()}`;
        if (mode === 'account') {
          const result = await addBucketListItem({ title: nextTitle });
          if (!result.success) throw new Error('Bucket item was not saved');
          id = result.id ?? id;
        } else {
          const adapter = browserRecordAdapter();
          const current = await readLocalRecord(
            adapter,
            'onboarding:bucket-items',
            'bucket-list',
            isObject
          );
          const rawItems = Array.isArray(current?.items) ? current.items : [];
          await writeLocalRecord(adapter, 'onboarding:bucket-items', 'bucket-list', {
            ...current,
            items: [...rawItems, { title: nextTitle, status: 'planned' }],
          });
        }
        setItems((current) => [...current, { id, title: nextTitle }]);
        setTitle('');
        setStatus(`${nextTitle} is on your list.`);
      } catch {
        setStatus('Could not add that yet. Try again.');
      }
    });
  }

  const questSeeds = items.slice(0, 3);

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[2rem] bg-[#a8dc91] text-[#192817]">
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <p className="text-sm font-bold text-[#0f593c]">Your bucket list</p>
          <h1 className="mt-3 max-w-4xl font-serif text-5xl font-medium leading-[0.96] tracking-[-0.04em] sm:text-7xl">
            What do you still want to live{name ? `, ${name}` : ''}?
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#344b31]">
            Keep the dreams, detours, and oddly specific ideas together. Add another whenever it
            finds you.
          </p>
        </div>
        <form
          onSubmit={addItem}
          className="flex flex-col gap-3 bg-[#211e18] p-4 text-white sm:flex-row sm:items-center sm:px-6"
        >
          <label htmlFor="live-more-add-item" className="shrink-0 font-serif text-xl">
            I want to…
          </label>
          <input
            id="live-more-add-item"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setStatus('');
            }}
            maxLength={200}
            placeholder="start a band, fly a plane, host a huge dinner…"
            className="min-h-12 min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-base text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e957]"
          />
          <button
            type="submit"
            disabled={pending || !title.trim()}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#f7e957] px-5 font-bold text-[#211e18] disabled:opacity-50"
          >
            <Plus className="size-4" /> {pending ? 'Adding…' : 'Add to my list'}
          </button>
        </form>
        <p aria-live="polite" className="min-h-6 bg-[#211e18] px-6 pb-3 text-xs text-white/75">
          {status}
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[1.75rem] bg-white p-6 sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#176b4a]">Still calling</p>
              <h2 className="mt-1 font-serif text-4xl">Your list</h2>
            </div>
            <span className="font-serif text-4xl tabular-nums" aria-label={`${items.length} items`}>
              {items.length}
            </span>
          </div>

          {items.length ? (
            <ol className="mt-6 divide-y divide-[#e8dfd1]">
              {items.slice(0, 10).map((item, index) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:gap-4"
                >
                  <span className="hidden w-7 shrink-0 font-serif text-[#7a7164] sm:block">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1 font-serif text-xl leading-snug">
                    {item.title}
                  </span>
                  <Link
                    href={`/side-quests?tab=pick&possibility=${encodeURIComponent(item.title)}`}
                    className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-bold text-[#6c3d2b] underline decoration-[#d79b7f] underline-offset-4"
                  >
                    Make a Side Quest <Footprints className="size-4" />
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-6 py-8">
              <p className="font-serif text-3xl">
                Start with one thing you would hate to leave unlived.
              </p>
              <p className="mt-3 text-sm text-[#625b50]">
                It can be enormous, tiny, serious, or wonderfully strange.
              </p>
            </div>
          )}

          <Link
            href="/bucket-list"
            className="mt-5 inline-flex min-h-11 items-center gap-2 border-b-2 border-current font-bold"
          >
            Open and manage the whole list <ArrowRight className="size-4" />
          </Link>
        </section>

        <aside className="flex flex-col rounded-[1.75rem] bg-[#ffd0bd] p-6 sm:p-8">
          <Footprints className="size-7" />
          <p className="mt-7 text-sm font-bold text-[#713f2d]">Side Quests</p>
          <h2 className="mt-2 font-serif text-4xl leading-tight">Give “someday” a first step.</h2>
          <p className="mt-4 text-sm leading-relaxed text-[#6c4739]">
            Keep the dream on your bucket list. Take a smaller action now.
          </p>

          {questSeeds.length ? (
            <nav className="mt-6 divide-y divide-[#d89d84]" aria-label="Side Quests from your list">
              {questSeeds.map((item) => (
                <Link
                  key={item.id}
                  href={`/side-quests?tab=pick&possibility=${encodeURIComponent(item.title)}`}
                  className="flex min-h-14 items-center justify-between gap-3 py-2 text-sm font-bold"
                >
                  <span className="line-clamp-2">A first step for “{item.title}”</span>
                  <ArrowRight className="size-4 shrink-0" />
                </Link>
              ))}
            </nav>
          ) : null}

          <Link
            href="/side-quests"
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#211e18] px-4 font-bold text-white"
          >
            Explore Side Quests <ArrowRight className="size-4" />
          </Link>

          {goals.length ? (
            <div className="mt-8 border-t border-[#d89d84] pt-5">
              <p className="text-xs font-bold text-[#713f2d]">Goals for this year</p>
              <ul className="mt-2 space-y-2 font-serif text-lg leading-snug">
                {goals.slice(0, 3).map((goal) => (
                  <li key={goal}>{goal}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object';
}

function uniqueItems(items: OwnedItem[]): OwnedItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.title.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
