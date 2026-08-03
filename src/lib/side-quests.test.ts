import { describe, expect, it } from 'vitest';

import { rankQuestsForPossibility, SIDE_QUESTS } from './side-quests';

describe('rankQuestsForPossibility', () => {
  it('turns a meditation retreat into a genuinely nearby small step', () => {
    const [first] = rankQuestsForPossibility(
      SIDE_QUESTS,
      'Do a serious meditation retreat (10+ days)'
    );

    expect(first?.title).toBe('Ten Minutes of Silence');
  });

  it('turns performing for an audience into a small public-performance step', () => {
    const [first] = rankQuestsForPossibility(SIDE_QUESTS, 'Perform in front of an audience');

    expect(first?.title).toBe('Attend an Open Mic');
  });
});
