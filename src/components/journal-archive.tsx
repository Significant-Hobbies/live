'use client';

import { useEffect, useMemo, useState } from 'react';

type JournalRecord = { dayDate: string; amEntry?: string | null; pmEntry?: string | null };

export function JournalArchive({ records }: { records: JournalRecord[] }) {
  const [entries, setEntries] = useState(records);
  useEffect(() => setEntries(records), [records]);
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
  if (!writtenEntries.length) return null;
  return (
    <details id="journal-history" className="mt-5 text-sm text-muted-foreground">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3">
        <span>Older daily notes ({writtenEntries.length})</span>
        <span>Open archive ›</span>
      </summary>
      <div className="divide-y divide-border/60">
        {writtenEntries.map((entry) => (
          <article key={entry.dayDate} className="space-y-3 py-4">
            <p className="text-[13px]">{formatJournalDay(entry.dayDate)}</p>
            {entry.amEntry?.trim() && (
              <div>
                <p className="text-xs">Morning</p>
                <p className="mt-1 whitespace-pre-wrap break-words">{entry.amEntry}</p>
              </div>
            )}
            {entry.pmEntry?.trim() && (
              <div>
                <p className="text-xs">Evening</p>
                <p className="mt-1 whitespace-pre-wrap break-words">{entry.pmEntry}</p>
              </div>
            )}
          </article>
        ))}
      </div>
    </details>
  );
}

function formatJournalDay(dayDate: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${dayDate}T12:00:00`));
}
