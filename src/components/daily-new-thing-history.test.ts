import { describe, expect, it } from 'vitest';

import { completedDailyNewThings } from './daily-new-thing-history';

describe('completed daily new things', () => {
  it('collects completed custom list items in reverse chronological order', () => {
    expect(
      completedDailyNewThings([
        {
          dayDate: '2026-08-01',
          noveltyText: 'Call an old friend\nCook something new',
          noveltyCompleted: true,
        },
        {
          dayDate: '2026-08-02',
          noveltyText: 'Walk a different street',
          noveltyCompleted: true,
        },
        {
          dayDate: '2026-08-03',
          noveltyText: 'Still open',
          noveltyCompleted: false,
        },
      ]).map((item) => [item.dayDate, item.title])
    ).toEqual([
      ['2026-08-02', 'Walk a different street'],
      ['2026-08-01', 'Call an old friend'],
      ['2026-08-01', 'Cook something new'],
    ]);
  });
});
