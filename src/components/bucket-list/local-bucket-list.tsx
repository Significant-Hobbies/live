'use client';

import { Check, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { type FormEvent, useEffect, useState } from 'react';

import { StorageModeProvider, StorageModeStatus } from '~/components/storage-mode-provider';
import { browserRecordAdapter, readLocalRecord, writeLocalRecord } from '~/lib/local-record-store';

type LocalBucketItem = {
  title: string;
  status?: 'planned' | 'done';
};

type LocalBucketRecord = {
  items?: Array<string | LocalBucketItem>;
  annualFocus?: string;
  annualGoals?: string[];
};

export function LocalBucketList() {
  const [record, setRecord] = useState<LocalBucketRecord>({ items: [] });
  const [title, setTitle] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    readLocalRecord(
      browserRecordAdapter(),
      'onboarding:bucket-items',
      'bucket-list',
      isBucketRecord
    ).then((next) => {
      setRecord(next ?? { items: [] });
      setLoaded(true);
    });
  }, []);

  const items = normalizeItems(record.items);

  async function persist(nextItems: LocalBucketItem[]) {
    const next = { ...record, items: nextItems };
    await writeLocalRecord(browserRecordAdapter(), 'onboarding:bucket-items', 'bucket-list', next);
    setRecord(next);
  }

  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle || items.some((item) => item.title.toLowerCase() === nextTitle.toLowerCase())) {
      return;
    }
    setTitle('');
    void persist([...items, { title: nextTitle, status: 'planned' }]);
  }

  return (
    <StorageModeProvider mode="local">
      <div className="min-h-[calc(100vh-4rem)] bg-[#f7f1e7] px-4 py-10 text-[#211e18] sm:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="flex justify-end">
            <StorageModeStatus />
          </div>
          <header className="mt-5 overflow-hidden rounded-[2rem] bg-[#a8dc91] px-6 py-10 shadow-[0_18px_55px_rgba(53,80,40,0.13)] sm:px-10 sm:py-12">
            <p className="text-sm font-bold text-[#0f593c]">Every meaningful someday</p>
            <h1 className="mt-3 max-w-3xl font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.045em] sm:text-7xl">
              Your bucket list, all in one place.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#344b31]">
              Keep the things you want to live here. They stay on this device unless you choose to
              sign in.
            </p>
          </header>

          <form
            onSubmit={addItem}
            className="mt-7 flex flex-col gap-3 rounded-[1.5rem] border border-[#d9cfbd] bg-[#fffdf8] p-4 shadow-[0_10px_35px_rgba(72,58,38,0.07)] sm:flex-row"
          >
            <label className="sr-only" htmlFor="local-bucket-title">
              Something you want to do
            </label>
            <input
              id="local-bucket-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Something I want to do…"
              className="min-h-12 min-w-0 flex-1 rounded-xl border border-[#d9cfbd] bg-white px-4 text-base outline-none focus:border-[#176b4a] focus:ring-2 focus:ring-[#176b4a]/20"
            />
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#176b4a] px-5 font-bold text-white hover:bg-[#10583d]"
            >
              <Plus className="size-4" /> Add to my list
            </button>
          </form>

          <section className="mt-7 rounded-[2rem] border border-[#d9cfbd] bg-[#fffdf8] p-5 sm:p-8">
            <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end sm:gap-5">
              <div>
                <p className="text-sm font-bold text-[#176b4a]">Still calling</p>
                <h2 className="mt-1 font-serif text-4xl leading-[1.05]">What comes next</h2>
              </div>
              <Link
                href="/live-more#discover"
                className="inline-flex min-h-10 items-center text-sm font-bold underline underline-offset-4"
              >
                Discover more possibilities
              </Link>
            </div>

            {!loaded ? (
              <p className="mt-8 text-sm text-[#625b50]">Opening your list…</p>
            ) : items.length === 0 ? (
              <div className="mt-8 rounded-2xl bg-[#fff8d6] p-6 sm:p-8">
                <p className="font-serif text-3xl">What would make this year feel more alive?</p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#625b50]">
                  Add your own answer above, or browse ideas when you want a spark.
                </p>
              </div>
            ) : (
              <ul className="mt-9 divide-y divide-[#e8dfd1] sm:mt-7">
                {items.map((item, index) => {
                  const done = item.status === 'done';
                  return (
                    <li key={`${item.title}-${index}`} className="flex items-center gap-3 py-4">
                      <button
                        type="button"
                        aria-label={`${done ? 'Reopen' : 'Complete'} ${item.title}`}
                        onClick={() =>
                          void persist(
                            items.map((candidate, candidateIndex) =>
                              candidateIndex === index
                                ? { ...candidate, status: done ? 'planned' : 'done' }
                                : candidate
                            )
                          )
                        }
                        className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 ${done ? 'border-[#176b4a] bg-[#176b4a] text-white' : 'border-[#b9af9e] bg-white text-transparent'}`}
                      >
                        <Check className="size-5" />
                      </button>
                      <p
                        className={`min-w-0 flex-1 font-serif text-2xl ${done ? 'text-[#766f65] line-through' : ''}`}
                      >
                        {item.title}
                      </p>
                      <button
                        type="button"
                        aria-label={`Remove ${item.title}`}
                        onClick={() =>
                          void persist(items.filter((_, itemIndex) => itemIndex !== index))
                        }
                        className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#766f65] hover:bg-[#f1e8da] hover:text-[#211e18]"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </StorageModeProvider>
  );
}

function normalizeItems(items: LocalBucketRecord['items']): LocalBucketItem[] {
  if (!Array.isArray(items)) return [];
  return items.flatMap((item) => {
    if (typeof item === 'string') return [{ title: item, status: 'planned' as const }];
    return typeof item?.title === 'string'
      ? [{ title: item.title, status: item.status === 'done' ? 'done' : 'planned' }]
      : [];
  });
}

function isBucketRecord(value: unknown): value is LocalBucketRecord {
  return !!value && typeof value === 'object';
}
