import { dailyNoveltyById, parseDailyIntentions } from '~/lib/daily-novelty';

export type DailyNoveltyRecord = {
  dayDate: string;
  noveltyId?: string | null;
  noveltyText?: string | null;
  noveltyCompleted?: boolean;
};

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
