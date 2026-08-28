import { SIDE_QUESTS } from './side-quests';

export type DailyNovelty = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: string;
  timeEstimate: string;
};

const MAX_DAILY_INTENTIONS = 20;
const MAX_DAILY_INTENTION_LENGTH = 160;

export function parseDailyIntentions(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .replaceAll('\r', '')
    .split(/\n+|(?=\s+\d+[.)]\s+)/)
    .map((item) => item.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim())
    .filter(Boolean);
}

export function normalizeDailyIntentions(value: string | null | undefined): string {
  return parseDailyIntentions(value).join('\n');
}

export function areDailyIntentionsValid(value: string | null | undefined): boolean {
  const intentions = parseDailyIntentions(value);
  return (
    intentions.length > 0 &&
    intentions.length <= MAX_DAILY_INTENTIONS &&
    intentions.every((intention) => intention.length <= MAX_DAILY_INTENTION_LENGTH)
  );
}

const ELIGIBLE_TIMES = new Set(['15 min', '30 min', '1 hour']);

export const DAILY_NOVELTIES: DailyNovelty[] = SIDE_QUESTS.filter(
  (quest) => quest.difficulty !== 'hard' && ELIGIBLE_TIMES.has(quest.timeEstimate)
).map(({ id, title, description, emoji, category, timeEstimate }) => ({
  id,
  title,
  description,
  emoji,
  category,
  timeEstimate,
}));

export function dailyNoveltyById(id: string | null | undefined): DailyNovelty | null {
  if (!id) return null;
  return DAILY_NOVELTIES.find((item) => item.id === id) ?? null;
}

export function pickDailyNovelty(
  dayDate: string,
  seed: string,
  recentIds: readonly string[] = []
): DailyNovelty {
  const recent = new Set(recentIds);
  const ordered = orderedFor(dayDate, seed);
  return ordered.find((item) => !recent.has(item.id)) ?? ordered[0]!;
}

export function nextDailyNovelty(
  dayDate: string,
  seed: string,
  currentId: string,
  recentIds: readonly string[] = []
): DailyNovelty {
  const recent = new Set(recentIds);
  const ordered = orderedFor(dayDate, seed);
  const currentIndex = ordered.findIndex((item) => item.id === currentId);

  for (let step = 1; step <= ordered.length; step++) {
    const candidate = ordered[(Math.max(currentIndex, 0) + step) % ordered.length]!;
    if (candidate.id !== currentId && !recent.has(candidate.id)) return candidate;
  }

  return ordered.find((item) => item.id !== currentId) ?? ordered[0]!;
}

function orderedFor(dayDate: string, seed: string): DailyNovelty[] {
  return [...DAILY_NOVELTIES].sort(
    (left, right) =>
      stableHash(`${seed}:${dayDate}:${left.id}`) - stableHash(`${seed}:${dayDate}:${right.id}`)
  );
}

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
