'use client';

import { useEffect, useMemo, useState } from 'react';

import { JournalSkeleton } from '~/components/weekly-log/journal-skeleton';
import { JournalArchive } from '~/components/journal-archive';
import { StorageModeProvider, StorageModeStatus } from '~/components/storage-mode-provider';
import {
  isLocalDailyState,
  type LocalJournal,
} from '~/components/local-personal-practice-surfaces';
import {
  WeeklyLogSurface,
  type WeeklyLogEntryView,
} from '~/components/weekly-log/weekly-log-surface';
import { browserRecordAdapter, readLocalRecord } from '~/lib/local-record-store';
import {
  EMPTY_LOCAL_WEEKLY_LOG,
  readLocalWeeklyLog,
  saveLocalWeeklyEntry,
  setLocalWeekStartsOn,
  type LocalWeeklyLogState,
} from '~/lib/local-weekly-log';

function useLocalWeeklyLogData() {
  const [state, setState] = useState<LocalWeeklyLogState>(EMPTY_LOCAL_WEEKLY_LOG);
  const [legacyEntries, setLegacyEntries] = useState<LocalJournal[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const adapter = browserRecordAdapter();
    Promise.all([
      readLocalWeeklyLog(adapter),
      readLocalRecord(adapter, 'daily:state', 'daily', isLocalDailyState),
    ])
      .then(([log, daily]) => {
        setState(log);
        setLegacyEntries(daily?.journals ?? []);
        setLoaded(true);
      })
      .catch(() =>
        setError(
          'Your journal could not be opened. Reload to try again; existing entries have not been changed.'
        )
      );
  }, []);

  return { state, setState, legacyEntries, loaded, error };
}

export function LocalWeeklyLog({ today }: { today: string }) {
  const { state, setState, legacyEntries, loaded, error } = useLocalWeeklyLogData();

  const entries: WeeklyLogEntryView[] = useMemo(
    () =>
      [...state.entries]
        .map((entry) => ({
          id: entry.id,
          weekOf: entry.weekOf,
          text: entry.text,
          promptText: entry.promptText,
          turns: entry.turns,
        }))
        .sort((a, b) => b.weekOf.localeCompare(a.weekOf)),
    [state.entries]
  );

  if (error)
    return (
      <p role="alert" className="mx-auto max-w-[760px] p-6 text-sm text-destructive">
        {error}
      </p>
    );
  if (!loaded) return <JournalSkeleton />;

  return (
    <StorageModeProvider mode="local">
      <WeeklyLogSurface
        data={{
          today,
          weekStartsOn: state.weekStartsOn,
          entries,
          storageSlot: <StorageModeStatus compact />,
          archiveSlot: <JournalArchive records={legacyEntries} />,
        }}
        actions={{
          onSave: async (weekOf, text, promptText) => {
            const next = await saveLocalWeeklyEntry(weekOf, text, promptText);
            setState(next);
            return true;
          },
          onWeekStartsOnChange: async (value) => {
            const next = await setLocalWeekStartsOn(value);
            setState(next);
          },
        }}
      />
    </StorageModeProvider>
  );
}
