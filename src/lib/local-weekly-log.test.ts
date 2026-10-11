import { describe, expect, it } from 'vitest';
import { readLocalWeeklyLog, saveLocalWeeklyEntry, setLocalWeekStartsOn } from './local-weekly-log';
import type { LocalRecordAdapter } from './local-record-store';
import { findEntryForWeek } from './weekly-log';

describe('local Journal data preservation', () => {
  it('updates the matched original key and retains extra fields and older entries', async () => {
    const turns = [{ questionText: 'An old prompt', answer: 'My answer' }];
    let raw: unknown = {
      key: 'weekly-log:state',
      domain: 'weekly-log',
      schemaVersion: 1,
      installationId: 'test',
      updatedAt: '2026-08-01',
      value: {
        weekStartsOn: 'monday',
        extra: 'Keep this',
        servedQuestionIds: ['old-question'],
        entries: [
          {
            id: 'original',
            weekOf: '2026-10-05',
            text: 'Pasta.',
            promptText: 'Old prompt',
            turns,
            updatedAt: '2026-10-11',
            extra: 'Keep entry fields',
          },
          { id: 'older', weekOf: '2026-08-03', text: 'August.', updatedAt: '2026-08-09' },
        ],
      },
    };
    const adapter: LocalRecordAdapter = {
      get: async () => raw,
      put: async (_key, next) => {
        raw = next;
      },
      remove: async () => {},
    };
    await setLocalWeekStartsOn('sunday', adapter);
    const state = await readLocalWeeklyLog(adapter);
    const matched = findEntryForWeek(state.entries, '2026-10-04', 'sunday')!;
    await saveLocalWeeklyEntry(matched.weekOf, 'Pasta and sailing.', matched.promptText, adapter);
    expect(raw).toMatchObject({
      value: {
        extra: 'Keep this',
        weekStartsOn: 'sunday',
        servedQuestionIds: ['old-question'],
        entries: [
          {
            id: 'original',
            weekOf: '2026-10-05',
            text: 'Pasta and sailing.',
            turns,
            extra: 'Keep entry fields',
          },
          { id: 'older', weekOf: '2026-08-03', text: 'August.' },
        ],
      },
    });
    expect((await readLocalWeeklyLog(adapter)).entries).toHaveLength(2);
  });
});
