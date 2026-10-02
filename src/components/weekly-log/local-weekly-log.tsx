'use client';

import { useEffect, useMemo, useState } from 'react';

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

type LocalProfile = { name?: string };

function useLocalWeeklyLogData() {
  const [state, setState] = useState<LocalWeeklyLogState>(EMPTY_LOCAL_WEEKLY_LOG);
  const [profile, setProfile] = useState<LocalProfile>({});
  const [legacyEntries, setLegacyEntries] = useState<LocalJournal[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const adapter = browserRecordAdapter();
    Promise.all([
      readLocalWeeklyLog(adapter),
      readLocalRecord(
        adapter,
        'onboarding:profile',
        'onboarding',
        (value): value is LocalProfile => !!value && typeof value === 'object'
      ),
      readLocalRecord(adapter, 'daily:state', 'daily', isLocalDailyState),
    ]).then(([log, storedProfile, daily]) => {
      setState(log);
      setProfile(storedProfile ?? {});
      setLegacyEntries(daily?.journals ?? []);
      setLoaded(true);
    });
  }, []);

  return { state, setState, profile, legacyEntries, loaded };
}

export function LocalWeeklyLog({ today }: { today: string }) {
  const { state, setState, profile, legacyEntries, loaded } = useLocalWeeklyLogData();

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

  if (!loaded) {
    return (
      <p className="p-8 text-center text-sm text-muted-foreground">
        Loading your weekly log from this device…
      </p>
    );
  }

  return (
    <StorageModeProvider mode="local">
      <div className="mx-auto max-w-3xl px-4 pt-6">
        <StorageModeStatus />
      </div>
      <WeeklyLogSurface
        data={{
          firstName: profile.name?.trim().split(/\s+/)[0] || 'there',
          today,
          weekStartsOn: state.weekStartsOn,
          entries,
          weeksRemaining: null,
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
