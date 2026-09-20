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
  type StaleDreamView,
  type WeeklyLogEntryView,
} from '~/components/weekly-log/weekly-log-surface';
import { dayKeyIn } from '~/lib/day';
import { setCallingDreamInLocalRecord } from '~/lib/local-dreams';
import { browserRecordAdapter, readLocalRecord } from '~/lib/local-record-store';
import {
  EMPTY_LOCAL_WEEKLY_LOG,
  markQuestionServed,
  readLocalWeeklyLog,
  saveLocalWeeklyEntry,
  setLocalWeekStartsOn,
  type LocalWeeklyLogState,
} from '~/lib/local-weekly-log';
import { isSuggestedLogDay } from '~/lib/weekly-log';
import type { NudgeSignals } from '~/lib/weekly-questions';

type LocalDream = { title?: string; status?: string; category?: string };

type LocalProfile = { name?: string };

function isDreamRecord(value: unknown): value is { items: LocalDream[] } {
  return (
    !!value && typeof value === 'object' && Array.isArray((value as { items?: unknown }).items)
  );
}

function useLocalWeeklyLogData() {
  const [state, setState] = useState<LocalWeeklyLogState>(EMPTY_LOCAL_WEEKLY_LOG);
  const [dreams, setDreams] = useState<LocalDream[]>([]);
  const [profile, setProfile] = useState<LocalProfile>({});
  const [legacyEntries, setLegacyEntries] = useState<LocalJournal[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const adapter = browserRecordAdapter();
    Promise.all([
      readLocalWeeklyLog(adapter),
      readLocalRecord(adapter, 'onboarding:bucket-items', 'bucket-list', isDreamRecord),
      readLocalRecord(
        adapter,
        'onboarding:profile',
        'onboarding',
        (value): value is LocalProfile => !!value && typeof value === 'object'
      ),
      readLocalRecord(adapter, 'daily:state', 'daily', isLocalDailyState),
    ]).then(([log, dreamRecord, storedProfile, daily]) => {
      setState(log);
      setDreams(dreamRecord?.items ?? []);
      setProfile(storedProfile ?? {});
      setLegacyEntries(daily?.journals ?? []);
      setLoaded(true);
    });
  }, []);

  const staleDreams: StaleDreamView[] = useMemo(
    () =>
      dreams
        .filter((dream) => dream.title && dream.status !== 'done')
        .slice(0, 3)
        .map((dream) => ({
          title: dream.title ?? '',
          category: typeof dream.category === 'string' ? dream.category : null,
          daysSinceMovement: null,
        })),
    [dreams]
  );

  const nudgeRequest = useMemo(() => {
    if (!loaded) return null;
    const monthAgo = Date.now() - 28 * 24 * 60 * 60 * 1000;
    const signals: NudgeSignals = {
      staleDreamCategories: [
        ...new Set(staleDreams.map((dream) => dream.category).filter((c): c is string => !!c)),
      ],
      entriesLastMonth: state.entries.filter((entry) => Date.parse(entry.updatedAt) > monthAgo)
        .length,
      activeCommitments: 0,
      activeDreams: dreams.filter((dream) => dream.status !== 'done').length,
      isSuggestedDay: isSuggestedLogDay(dayKeyIn(null)),
    };
    return { signals, excludeIds: state.servedQuestionIds };
  }, [loaded, state.entries, state.servedQuestionIds, staleDreams, dreams]);

  return {
    state,
    setState,
    dreams,
    setDreams,
    profile,
    legacyEntries,
    loaded,
    staleDreams,
    nudgeRequest,
  };
}

export function LocalWeeklyLog({ today }: { today: string }) {
  const {
    state,
    setState,
    dreams,
    setDreams,
    profile,
    legacyEntries,
    loaded,
    staleDreams,
    nudgeRequest,
  } = useLocalWeeklyLogData();

  const entries: WeeklyLogEntryView[] = useMemo(
    () =>
      [...state.entries]
        .map((entry) => ({
          id: entry.id,
          weekOf: entry.weekOf,
          text: entry.text,
          promptText: entry.promptText,
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
          staleDreams,
          weeksRemaining: null,
          initialQuestion: null,
          nudgeRequest,
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
          onCallDreamForward: async (title) => {
            await setCallingDreamInLocalRecord(title);
            setDreams((current) => current.map((dream) => ({ ...dream, status: 'in_progress' })));
          },
          onQuestionServed: (questionId) => {
            void markQuestionServed(questionId).then(async () => {
              setState(await readLocalWeeklyLog());
            });
          },
        }}
      />
    </StorageModeProvider>
  );
}
