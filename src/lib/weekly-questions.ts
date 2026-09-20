// Weekly nudge questions — the bank the log draws from.
//
// Each question belongs to a situation *family*. classifier.dev picks the
// family from a categorical context string (never user-typed text), then we
// serve a question from that family the person has not seen recently. When
// the service is unreachable or the context is empty, a deterministic
// rotation keeps the ritual working.

export type QuestionFamily =
  | 'momentum'
  | 'stuck'
  | 'lived'
  | 'new'
  | 'people'
  | 'want'
  | 'honest'
  | 'rest'
  | 'surprise'
  | 'next';

export type WeeklyQuestion = {
  id: string;
  family: QuestionFamily;
  text: string;
};

export const QUESTION_FAMILIES: QuestionFamily[] = [
  'momentum',
  'stuck',
  'lived',
  'new',
  'people',
  'want',
  'honest',
  'rest',
  'surprise',
  'next',
];

export const WEEKLY_QUESTIONS: WeeklyQuestion[] = [
  // momentum — something moved
  { id: 'momentum-1', family: 'momentum', text: 'What moved forward this week, even slightly?' },
  {
    id: 'momentum-2',
    family: 'momentum',
    text: 'What did you finish, start, or unstick this week?',
  },
  {
    id: 'momentum-3',
    family: 'momentum',
    text: 'Where did you surprise yourself with follow-through?',
  },
  // stuck — something did not move
  {
    id: 'stuck-1',
    family: 'stuck',
    text: 'What did you keep meaning to do but didn\u2019t? What got in the way?',
  },
  {
    id: 'stuck-2',
    family: 'stuck',
    text: 'Which dream sat untouched this week — and is that okay?',
  },
  { id: 'stuck-3', family: 'stuck', text: 'What would have made this week easier on you?' },
  // lived — the plain record
  { id: 'lived-1', family: 'lived', text: 'What did you actually do with your time this week?' },
  { id: 'lived-2', family: 'lived', text: 'If this week were a photo album, what would be in it?' },
  { id: 'lived-3', family: 'lived', text: 'What did an ordinary day this week look like?' },
  // new — novelty
  { id: 'new-1', family: 'new', text: 'What did you do for the first time, or after a long time?' },
  { id: 'new-2', family: 'new', text: 'What was new this week — even something small?' },
  {
    id: 'new-3',
    family: 'new',
    text: 'Where did this week take you that you hadn\u2019t planned?',
  },
  // people — who was in it
  { id: 'people-1', family: 'people', text: 'Who did this week include?' },
  {
    id: 'people-2',
    family: 'people',
    text: 'Whose company made this week better — or who did you miss?',
  },
  { id: 'people-3', family: 'people', text: 'What did you do with or for someone else this week?' },
  // want — dreams touched
  {
    id: 'want-1',
    family: 'want',
    text: 'Which of your dreams did this week touch — even in passing?',
  },
  {
    id: 'want-2',
    family: 'want',
    text: 'Did anything this week belong to the life you want? What?',
  },
  {
    id: 'want-3',
    family: 'want',
    text: 'What did you do this week that future-you will be glad about?',
  },
  // honest — the harder look
  { id: 'honest-1', family: 'honest', text: 'What would you rather not repeat next week?' },
  { id: 'honest-2', family: 'honest', text: 'Where did your time go that you didn\u2019t choose?' },
  { id: 'honest-3', family: 'honest', text: 'What are you pretending is fine this week?' },
  // rest — restoration
  { id: 'rest-1', family: 'rest', text: 'What restored you this week?' },
  { id: 'rest-2', family: 'rest', text: 'When did you feel most like yourself this week?' },
  { id: 'rest-3', family: 'rest', text: 'What did this week give you back?' },
  // surprise — the unexpected
  { id: 'surprise-1', family: 'surprise', text: 'What surprised you this week?' },
  { id: 'surprise-2', family: 'surprise', text: 'What happened that you didn\u2019t see coming?' },
  { id: 'surprise-3', family: 'surprise', text: 'What turned out differently than you expected?' },
  // next — looking one week ahead
  { id: 'next-1', family: 'next', text: 'What\u2019s the one thing next week should contain?' },
  { id: 'next-2', family: 'next', text: 'What would make next week count, in one line?' },
  { id: 'next-3', family: 'next', text: 'What are you carrying into next week on purpose?' },
];

export type NudgeSignals = {
  /** Live taxonomy categories of stale dreams (never titles). */
  staleDreamCategories: string[];
  /** Weekly entries written in the last 4 weeks. */
  entriesLastMonth: number;
  /** Non-abandoned commitments. */
  activeCommitments: number;
  /** Dreams the person currently holds (any non-done status). */
  activeDreams: number;
  /** Whether today is the suggested Sunday writing moment. */
  isSuggestedDay: boolean;
};

/**
 * The categorical context string sent to classifier.dev.
 * Only Live taxonomy values and counts — never user-typed text.
 */
export function buildNudgeContext(signals: NudgeSignals): string {
  const parts = [
    `stale dream categories: ${signals.staleDreamCategories.length ? signals.staleDreamCategories.join(', ') : 'none'}`,
    `weekly entries last month: ${signals.entriesLastMonth}`,
    `active commitments: ${signals.activeCommitments}`,
    `active dreams: ${signals.activeDreams}`,
    `suggested day: ${signals.isSuggestedDay ? 'yes' : 'no'}`,
  ];
  return parts.join('; ');
}

/** True when the context carries no meaningful signal — go straight to fallback. */
export function isContextEmpty(signals: NudgeSignals): boolean {
  return (
    signals.staleDreamCategories.length === 0 &&
    signals.entriesLastMonth === 0 &&
    signals.activeCommitments === 0 &&
    signals.activeDreams === 0
  );
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Deterministic rotation: pick a question the person hasn't seen lately,
 * seeded by their week key so the choice is stable across reloads.
 * `excludeIds` is the recent-questions list (localStorage for local mode,
 * promptText history for accounts).
 */
export function fallbackQuestion(weekOf: string, excludeIds: string[] = []): WeeklyQuestion {
  const pool = WEEKLY_QUESTIONS.filter((q) => !excludeIds.includes(q.id));
  const candidates = pool.length ? pool : WEEKLY_QUESTIONS;
  return candidates[hashSeed(weekOf) % candidates.length];
}

/** Pick a question within a classifier-chosen family, avoiding recent repeats. */
export function questionForFamily(
  family: string,
  weekOf: string,
  excludeIds: string[] = []
): WeeklyQuestion {
  const pool = WEEKLY_QUESTIONS.filter((q) => q.family === family && !excludeIds.includes(q.id));
  if (!pool.length) {
    const anyInFamily = WEEKLY_QUESTIONS.filter((q) => q.family === family);
    return (
      anyInFamily[hashSeed(weekOf) % anyInFamily.length] ?? fallbackQuestion(weekOf, excludeIds)
    );
  }
  return pool[hashSeed(weekOf) % pool.length];
}

export function isQuestionFamily(value: string): value is QuestionFamily {
  return (QUESTION_FAMILIES as string[]).includes(value);
}
