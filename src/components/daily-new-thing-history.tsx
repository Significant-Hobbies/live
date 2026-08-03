'use client';

import { Check, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import type { DailyNoveltyRecord } from '~/components/daily-new-thing';
import { dailyNoveltyById, parseDailyIntentions } from '~/lib/daily-novelty';

export type CompletedNewThing = {
  key: string;
  dayDate: string;
  emoji: string;
  title: string;
};

export function completedDailyNewThings(records: DailyNoveltyRecord[]): CompletedNewThing[] {
  return [...records]
    .filter((record) => record.noveltyCompleted)
    .sort((left, right) => right.dayDate.localeCompare(left.dayDate))
    .flatMap((record) => {
      const catalogItem = dailyNoveltyById(record.noveltyId);
      const titles = catalogItem ? [catalogItem.title] : parseDailyIntentions(record.noveltyText);
      return titles.map((title, index) => ({
        key: `${record.dayDate}:${record.noveltyId ?? 'custom'}:${index}:${title}`,
        dayDate: record.dayDate,
        emoji: catalogItem?.emoji ?? '✦',
        title,
      }));
    });
}

export function DailyNewThingHistory({ records }: { records: DailyNoveltyRecord[] }) {
  const [entries, setEntries] = useState(records);

  useEffect(() => {
    function receiveChange(event: Event) {
      const detail = (event as CustomEvent<DailyNoveltyRecord>).detail;
      if (!detail?.dayDate) return;
      setEntries((current) => [
        detail,
        ...current.filter((item) => item.dayDate !== detail.dayDate),
      ]);
    }
    window.addEventListener('daily-novelty:changed', receiveChange);
    return () => window.removeEventListener('daily-novelty:changed', receiveChange);
  }, []);

  const completed = useMemo(() => completedDailyNewThings(entries), [entries]);

  return (
    <section
      id="things-ive-done"
      aria-labelledby="things-ive-done-title"
      className="overflow-hidden rounded-[1.5rem] bg-[#211e18] text-white shadow-[0_12px_36px_rgba(66,55,22,0.10)]"
    >
      <div className="space-y-6 p-5 sm:p-7">
        <div>
          <div className="flex size-11 items-center justify-center rounded-full bg-[#f7e957] text-[#211e18]">
            <Sparkles className="size-5" />
          </div>
          <p className="mt-5 text-sm font-bold text-[#a8dc91]">Your lived collection</p>
          <h2 id="things-ive-done-title" className="mt-2 font-serif text-3xl sm:text-4xl">
            Things I&apos;ve done
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">
            Every small departure you marked complete, kept together. No streak and no score.
          </p>
        </div>

        {completed.length ? (
          <ol className="divide-y divide-white/15 border-y border-white/15">
            {completed.map((item) => (
              <li
                key={item.key}
                className="grid grid-cols-[auto_1fr] gap-3 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"
              >
                <span aria-hidden="true" className="text-xl">
                  {item.emoji}
                </span>
                <span className="font-serif text-xl leading-snug">{item.title}</span>
                <span className="col-start-2 text-xs font-semibold text-white/55 sm:col-start-auto">
                  {formatCompletedDate(item.dayDate)}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="flex min-h-36 items-center rounded-2xl border border-dashed border-white/25 p-5">
            <div>
              <Check className="size-5 text-[#a8dc91]" />
              <p className="mt-3 font-serif text-2xl">Your first one will appear here.</p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Mark today&apos;s new thing when you actually do it.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function formatCompletedDate(dayDate: string): string {
  const [year, month, day] = dayDate.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(year!, month! - 1, day!, 12));
}
