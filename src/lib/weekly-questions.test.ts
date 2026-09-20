import { describe, expect, it } from 'vitest';

import {
  buildNudgeContext,
  detectThemes,
  fallbackQuestion,
  isContextEmpty,
  isQuestionFamily,
  QUESTION_FAMILIES,
  questionForFamily,
  remainingFamilies,
  WEEKLY_QUESTIONS,
  type NudgeSignals,
} from '~/lib/weekly-questions';

const signals: NudgeSignals = {
  staleDreamCategories: ['travel', 'creative'],
  entriesLastMonth: 2,
  activeCommitments: 1,
  activeDreams: 5,
  isSuggestedDay: true,
};

describe('buildNudgeContext', () => {
  it('contains only categorical values and counts — never titles or entry text', () => {
    const context = buildNudgeContext(signals);
    expect(context).toContain('travel');
    expect(context).toContain('weekly entries last month: 2');
    expect(context).toContain('active dreams: 5');
    expect(context).not.toContain('dream titles');
  });

  it('reads cleanly when there is nothing stale', () => {
    expect(buildNudgeContext({ ...signals, staleDreamCategories: [] })).toContain(
      'stale dream categories: none'
    );
  });
});

describe('isContextEmpty', () => {
  it('is empty when nothing is happening', () => {
    expect(
      isContextEmpty({
        staleDreamCategories: [],
        entriesLastMonth: 0,
        activeCommitments: 0,
        activeDreams: 0,
        isSuggestedDay: true,
      })
    ).toBe(true);
  });

  it('is not empty with any signal', () => {
    expect(isContextEmpty(signals)).toBe(false);
  });
});

describe('fallbackQuestion', () => {
  it('is deterministic for a given week', () => {
    expect(fallbackQuestion('2026-03-09')).toEqual(fallbackQuestion('2026-03-09'));
  });

  it('avoids recently served questions when the pool allows it', () => {
    const allIds = WEEKLY_QUESTIONS.map((q) => q.id);
    const exclude = allIds.slice(0, allIds.length - 1);
    const picked = fallbackQuestion('2026-03-09', exclude);
    expect(exclude).not.toContain(picked.id);
  });

  it('still returns a question when everything was served', () => {
    const picked = fallbackQuestion(
      '2026-03-09',
      WEEKLY_QUESTIONS.map((q) => q.id)
    );
    expect(WEEKLY_QUESTIONS).toContainEqual(picked);
  });
});

describe('questionForFamily', () => {
  it('serves a question from the requested family', () => {
    const picked = questionForFamily('stuck', '2026-03-09');
    expect(picked.family).toBe('stuck');
  });

  it('falls back within the family when all of it was served', () => {
    const familyIds = WEEKLY_QUESTIONS.filter((q) => q.family === 'rest').map((q) => q.id);
    const picked = questionForFamily('rest', '2026-03-09', familyIds);
    expect(picked.family).toBe('rest');
  });
});

describe('question bank', () => {
  it('covers every declared family with at least three questions', () => {
    for (const family of QUESTION_FAMILIES) {
      expect(
        WEEKLY_QUESTIONS.filter((q) => q.family === family).length,
        family
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it('has unique question ids', () => {
    const ids = WEEKLY_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('isQuestionFamily', () => {
  it('accepts known families and rejects anything else', () => {
    expect(isQuestionFamily('momentum')).toBe(true);
    expect(isQuestionFamily('nonsense')).toBe(false);
    expect(isQuestionFamily('')).toBe(false);
  });
});

describe('interview-turn signals', () => {
  it('includes detected themes, asked families, and the turn in the context', () => {
    const context = buildNudgeContext({
      ...signals,
      detectedThemes: ['people', 'rest'],
      askedFamilies: ['lived'],
      turn: 2,
    });
    expect(context).toContain('themes in earlier answers: people, rest');
    expect(context).toContain('families already asked: lived');
    expect(context).toContain('interview turn: 2');
  });

  it('omits turn fields on the opener', () => {
    const context = buildNudgeContext(signals);
    expect(context).not.toContain('themes in earlier answers');
    expect(context).not.toContain('interview turn');
  });

  it('detected themes keep a context non-empty', () => {
    expect(
      isContextEmpty({
        staleDreamCategories: [],
        entriesLastMonth: 0,
        activeCommitments: 0,
        activeDreams: 0,
        isSuggestedDay: false,
        detectedThemes: ['people'],
      })
    ).toBe(false);
  });
});

describe('detectThemes', () => {
  it('detects people and rest themes without ever needing the prose', () => {
    const themes = detectThemes('Had dinner with my mom, then a long slow walk and a movie.');
    expect(themes).toContain('people');
    expect(themes).toContain('rest');
  });

  it('detects momentum and stuck signals', () => {
    expect(detectThemes('Finally finished the prototype')).toContain('momentum');
    expect(detectThemes("I kept putting off the taxes, didn't get to it")).toContain('stuck');
  });

  it('returns nothing for empty or themeless answers', () => {
    expect(detectThemes('')).toEqual([]);
    expect(detectThemes('zzzz')).toEqual([]);
  });
});

describe('remainingFamilies', () => {
  it('excludes families already asked this session', () => {
    const left = remainingFamilies(['lived', 'people']);
    expect(left).not.toContain('lived');
    expect(left).not.toContain('people');
    expect(left.length).toBe(QUESTION_FAMILIES.length - 2);
  });
});
