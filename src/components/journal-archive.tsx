'use client';

import { BookOpen, ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type JournalRecord = {
  dayDate: string;
  amEntry?: string | null;
  pmEntry?: string | null;
};

export function JournalArchive({ records }: { records: JournalRecord[] }) {
  const [entries, setEntries] = useState(records);

  useEffect(() => {
    function receiveSavedEntry(event: Event) {
      const detail = (event as CustomEvent<JournalRecord>).detail;
      if (!detail?.dayDate) return;
      setEntries((current) => [
        detail,
        ...current.filter((item) => item.dayDate !== detail.dayDate),
      ]);
    }
    window.addEventListener('journal:entry-saved', receiveSavedEntry);
    return () => window.removeEventListener('journal:entry-saved', receiveSavedEntry);
  }, []);

  const writtenEntries = useMemo(
    () =>
      [...entries]
        .filter((entry) => entry.amEntry?.trim() || entry.pmEntry?.trim())
        .sort((left, right) => right.dayDate.localeCompare(left.dayDate)),
    [entries]
  );

  // The archive only earns space when it has something to show — the weekly
  // log above is the living surface now.
  if (!writtenEntries.length) return null;

  return (
    <section
      id="journal-history"
      aria-labelledby="journal-history-title"
      className="scroll-mt-24 overflow-hidden rounded-2xl bg-card shadow-[0_12px_36px_color-mix(in_srgb,var(--scrim)_10%,transparent)]"
    >
      <div className="border-b border-border bg-field-coral p-5 sm:p-7">
        <BookOpen className="size-6" />
        <p className="mt-5 text-sm font-bold text-field-coral-ink">Before the weekly log</p>
        <div className="mt-1 flex items-end justify-between gap-4">
          <h2 id="journal-history-title" className="font-serif text-3xl sm:text-4xl">
            Earlier daily entries
          </h2>
          <span className="font-serif text-2xl tabular-nums">
            {writtenEntries.length} {writtenEntries.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
      </div>

      {writtenEntries.length ? (
        <div className="divide-y divide-border px-5 sm:px-7">
          {writtenEntries.map((entry, index) => (
            <details key={entry.dayDate} open={index === 0} className="group py-1">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-serif text-xl marker:content-none">
                {formatJournalDay(entry.dayDate)}
                <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="space-y-5 pb-6 text-base leading-7 text-muted-foreground">
                {entry.amEntry?.trim() ? (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-growth">
                      Morning
                    </p>
                    <p className="mt-2 whitespace-pre-wrap">{entry.amEntry}</p>
                  </div>
                ) : null}
                {entry.pmEntry?.trim() ? (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-field-lilac-ink">
                      Evening
                    </p>
                    <p className="mt-2 whitespace-pre-wrap">{entry.pmEntry}</p>
                  </div>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function formatJournalDay(dayDate: string): string {
  const [year, month, day] = dayDate.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(year!, month! - 1, day!, 12));
}
