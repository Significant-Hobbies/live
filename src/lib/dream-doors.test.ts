import { describe, expect, it } from 'vitest';

import type { DreamAtlasEntry } from './dream-atlas';
import { EXPERIENCE_ENTRIES, firstSteps } from './experiences';
import { selectDreamDoor } from './dream-doors';

const nativeEntry: DreamAtlasEntry = {
  slug: 'run-a-marathon',
  title: 'Run a marathon',
  description: 'Train for and finish 42.2 kilometres.',
  emoji: '🏃',
  location: 'anywhere',
  category: 'achievement',
  kind: 'milestone',
  firstStep: {
    title: 'Run for twenty easy minutes',
    body: 'Start below your limit and finish wanting to run again.',
    emoji: '👟',
  },
};

describe('selectDreamDoor', () => {
  it('prefers a confidence-only developed native first step', () => {
    expect(selectDreamDoor('Finish a marathon', [nativeEntry])).toMatchObject({
      kind: 'native',
      title: 'Run for twenty easy minutes',
      href: '/experiences/run-a-marathon',
    });
  });

  it('uses a genuinely relevant curated quest when native coverage ends', () => {
    const entries = EXPERIENCE_ENTRIES.map((entry) => ({
      ...entry,
      firstStep: firstSteps(entry)[0],
    }));
    expect(selectDreamDoor('Start my band', entries)).toMatchObject({
      kind: 'quest',
      title: 'Attend an Open Mic',
      href: '/side-quests?q=sq-27',
    });
  });

  it('researches outward instead of fabricating a task for an unsupported dream', () => {
    const door = selectDreamDoor('Go to space', []);
    expect(door.kind).toBe('research');
    expect(door.href).toContain('google.com/search');
    expect(door.description).toContain('does not have enough evidence');
  });
});
