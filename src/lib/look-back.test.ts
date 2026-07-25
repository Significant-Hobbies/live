import { describe, expect, it } from 'vitest';

import { generateLookBack, type LookBackData } from './look-back';

/**
 * Covers the onboarding contrast specifically.
 *
 * `User.onboardingData` was written from the day onboarding shipped, with a
 * comment promising the look-back would reference it — and no reader existed, so
 * the answers were collected and discarded. These tests pin the behaviour that
 * makes them worth keeping, and the tone rule that keeps it from becoming a
 * report card (decisions.md A4: no scoring on daily practice).
 */
function base(overrides: Partial<LookBackData> = {}): LookBackData {
  return {
    name: 'Mara Ellis',
    creed: null,
    birthYear: null,
    today: '2026-07-25',
    phases: [],
    pins: [],
    completedQuests: [],
    activeQuests: [],
    abandonedQuests: [],
    habits: [],
    habitLogs: [],
    journalEntries: [],
    commitments: [],
    ...overrides,
  };
}

function openingText(data: LookBackData): string {
  const opening = generateLookBack(data).find((s) => s.kind === 'opening');
  return (opening?.paragraphs ?? []).join('\n');
}

describe('look-back onboarding contrast', () => {
  it('says nothing when the user never answered', () => {
    expect(openingText(base())).not.toMatch(/When you started/);
    expect(openingText(base({ onboarding: null }))).not.toMatch(/When you started/);
  });

  it('names the dropped hobby', () => {
    const text = openingText(base({ onboarding: { droppedHobby: 'piano' } }));
    expect(text).toMatch(/piano/);
  });

  it('recognises the dropped hobby coming back, wherever it reappears', () => {
    // Each of these is an independent route back into someone's life, and the
    // contrast is only true if all of them count.
    const cases: Partial<LookBackData>[] = [
      {
        habits: [
          {
            id: 'h',
            name: 'Piano practice',
            icon: null,
            targetFrequency: 'daily',
            createdAt: new Date('2026-01-01'),
          },
        ],
      },
      {
        activeQuests: [
          { title: 'Learn a piano piece', sourceHobby: null, startedAt: new Date('2026-01-01') },
        ],
      },
      {
        completedQuests: [
          {
            title: 'x',
            sourceHobby: 'Piano',
            type: 'static',
            startedAt: new Date('2026-01-01'),
            completedAt: new Date('2026-02-01'),
          },
        ],
      },
      {
        commitments: [
          {
            hobbyName: 'Piano',
            goalDays: 30,
            status: 'active',
            startDate: new Date('2026-01-01'),
            stamps: [],
          },
        ],
      },
      {
        phases: [
          {
            id: 'p',
            order: 0,
            label: 'Now',
            startYear: 2026,
            endYear: 2026,
            hobbies: [{ name: 'Piano', intensity: 3 }],
          } as LookBackData['phases'][number],
        ],
      },
    ];
    for (const extra of cases) {
      const text = openingText(base({ onboarding: { droppedHobby: 'piano' }, ...extra }));
      expect(text, JSON.stringify(Object.keys(extra))).toMatch(/It is back in your life/);
    }
  });

  it('is case-insensitive about the match', () => {
    const text = openingText(
      base({
        onboarding: { droppedHobby: 'PIANO' },
        habits: [
          {
            id: 'h',
            name: 'piano practice',
            icon: null,
            targetFrequency: 'daily',
            createdAt: new Date(),
          },
        ],
      })
    );
    expect(text).toMatch(/It is back in your life/);
  });

  it('does not scold when the hobby has not come back', () => {
    const text = openingText(base({ onboarding: { droppedHobby: 'piano' } }));
    expect(text).toMatch(/has not come back yet/);
    expect(text).toMatch(/No verdict in that/);
    // Tone guard: a retrospective, not a report card.
    expect(text).not.toMatch(/failed|failure|should have|you didn't/i);
  });

  it('counts deliberate finishes against how the year felt back then', () => {
    const text = openingText(
      base({
        onboarding: { nextYearFeeling: 'dread' },
        completedQuests: [
          {
            title: 'a',
            sourceHobby: null,
            type: 'static',
            startedAt: new Date(),
            completedAt: new Date(),
          },
        ],
        commitments: [
          {
            hobbyName: 'Guitar',
            goalDays: 30,
            status: 'completed',
            startDate: new Date(),
            stamps: [],
          },
        ],
      })
    );
    expect(text).toMatch(/felt like dread/);
    expect(text).toMatch(/finished 2 things you chose on purpose/);
  });

  it('uses the singular for exactly one finish', () => {
    const text = openingText(
      base({
        onboarding: { nextYearFeeling: 'blank' },
        completedQuests: [
          {
            title: 'a',
            sourceHobby: null,
            type: 'static',
            startedAt: new Date(),
            completedAt: new Date(),
          },
        ],
      })
    );
    expect(text).toMatch(/finished 1 thing you chose on purpose/);
  });

  it('stays gentle when nothing has been finished yet', () => {
    const text = openingText(base({ onboarding: { nextYearFeeling: 'dread' } }));
    expect(text).toMatch(/Worth reading the rest of this with that in mind/);
    expect(text).not.toMatch(/0 things/);
  });

  it('ignores a blank dropped-hobby answer rather than emitting an empty sentence', () => {
    const text = openingText(base({ onboarding: { droppedHobby: '   ' } }));
    expect(text).not.toMatch(/the thing you said you'd dropped/);
  });
});
