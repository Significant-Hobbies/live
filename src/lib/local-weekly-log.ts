import {
  browserRecordAdapter,
  type LocalRecordAdapter,
  readLocalRecord,
  writeLocalRecord,
} from '~/lib/local-record-store';
import { normalizeWeekStartsOn, type WeekStartsOn } from '~/lib/weekly-log';

const LOCAL_WEEKLY_LOG_KEY = 'weekly-log:state';

type LocalWeeklyEntry = {
  id: string;
  weekOf: string;
  text: string;
  promptText: string | null;
  /** Interview Q&A turns that produced the entry, when it was written that way. */
  turns?: Array<{ questionText: string; answer: string }>;
  updatedAt: string;
};

export type LocalWeeklyLogState = {
  weekStartsOn: WeekStartsOn;
  entries: LocalWeeklyEntry[];
  /** Question ids already served — keeps the rotation fresh. */
  servedQuestionIds: string[];
};

export const EMPTY_LOCAL_WEEKLY_LOG: LocalWeeklyLogState = {
  weekStartsOn: 'monday',
  entries: [],
  servedQuestionIds: [],
};

function isEntry(value: unknown): value is LocalWeeklyEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === 'string' &&
    typeof entry.weekOf === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(entry.weekOf) &&
    typeof entry.text === 'string' &&
    typeof entry.updatedAt === 'string'
  );
}

function isState(value: unknown): value is LocalWeeklyLogState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Record<string, unknown>;
  return (
    Array.isArray(state.entries) &&
    state.entries.every(isEntry) &&
    (!('servedQuestionIds' in state) || Array.isArray(state.servedQuestionIds))
  );
}

export async function readLocalWeeklyLog(
  adapter: LocalRecordAdapter = browserRecordAdapter()
): Promise<LocalWeeklyLogState> {
  const stored = await readLocalRecord(adapter, LOCAL_WEEKLY_LOG_KEY, 'weekly-log', isState);
  if (!stored) return EMPTY_LOCAL_WEEKLY_LOG;
  return {
    weekStartsOn: normalizeWeekStartsOn(stored.weekStartsOn),
    entries: stored.entries,
    servedQuestionIds: Array.isArray(stored.servedQuestionIds)
      ? stored.servedQuestionIds.filter((id): id is string => typeof id === 'string')
      : [],
  };
}

export async function saveLocalWeeklyEntry(
  weekOf: string,
  text: string,
  promptText: string | null,
  adapter: LocalRecordAdapter = browserRecordAdapter(),
  turns?: Array<{ questionText: string; answer: string }>
): Promise<LocalWeeklyLogState> {
  const current = await readLocalWeeklyLog(adapter);
  const trimmed = text.trim().slice(0, 8000);
  const existing = current.entries.find((entry) => entry.weekOf === weekOf);
  const entry: LocalWeeklyEntry = {
    id: existing?.id ?? `local-week-${crypto.randomUUID()}`,
    weekOf,
    text: trimmed,
    promptText,
    turns: turns?.length ? turns.slice(0, 12) : undefined,
    updatedAt: new Date().toISOString(),
  };
  const next: LocalWeeklyLogState = {
    ...current,
    entries: existing
      ? current.entries.map((item) => (item.weekOf === weekOf ? entry : item))
      : [...current.entries, entry],
  };
  await writeLocalRecord(adapter, LOCAL_WEEKLY_LOG_KEY, 'weekly-log', next);
  return next;
}

export async function setLocalWeekStartsOn(
  weekStartsOn: WeekStartsOn,
  adapter: LocalRecordAdapter = browserRecordAdapter()
): Promise<LocalWeeklyLogState> {
  const current = await readLocalWeeklyLog(adapter);
  const next = { ...current, weekStartsOn };
  await writeLocalRecord(adapter, LOCAL_WEEKLY_LOG_KEY, 'weekly-log', next);
  return next;
}

export async function markQuestionServed(
  questionId: string,
  adapter: LocalRecordAdapter = browserRecordAdapter()
): Promise<void> {
  const current = await readLocalWeeklyLog(adapter);
  const served = [questionId, ...current.servedQuestionIds.filter((id) => id !== questionId)].slice(
    0,
    24
  );
  await writeLocalRecord(adapter, LOCAL_WEEKLY_LOG_KEY, 'weekly-log', {
    ...current,
    servedQuestionIds: served,
  });
}
