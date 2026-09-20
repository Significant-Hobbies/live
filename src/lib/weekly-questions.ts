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
  {
    id: 'momentum-4',
    family: 'momentum',
    text: 'What got easier this week than it used to be?',
  },
  {
    id: 'momentum-5',
    family: 'momentum',
    text: 'What small win deserves a sentence in your history?',
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
  {
    id: 'stuck-4',
    family: 'stuck',
    text: 'What are you carrying that was never yours to carry?',
  },
  {
    id: 'stuck-5',
    family: 'stuck',
    text: 'If the same thing stalls again next week, what would that tell you?',
  },
  // lived — the plain record
  { id: 'lived-1', family: 'lived', text: 'What did you actually do with your time this week?' },
  { id: 'lived-2', family: 'lived', text: 'If this week were a photo album, what would be in it?' },
  { id: 'lived-3', family: 'lived', text: 'What did an ordinary day this week look like?' },
  {
    id: 'lived-4',
    family: 'lived',
    text: 'Which hour of this week would you relive exactly as it was?',
  },
  {
    id: 'lived-5',
    family: 'lived',
    text: 'What filled the days that nobody will ever ask about?',
  },
  // new — novelty
  { id: 'new-1', family: 'new', text: 'What did you do for the first time, or after a long time?' },
  { id: 'new-2', family: 'new', text: 'What was new this week — even something small?' },
  {
    id: 'new-3',
    family: 'new',
    text: 'Where did this week take you that you hadn\u2019t planned?',
  },
  {
    id: 'new-4',
    family: 'new',
    text: 'What did you taste, hear, or see for the first time this week?',
  },
  {
    id: 'new-5',
    family: 'new',
    text: 'Who or what did you meet this week that you didn\u2019t know last week?',
  },
  // people — who was in it
  { id: 'people-1', family: 'people', text: 'Who did this week include?' },
  {
    id: 'people-2',
    family: 'people',
    text: 'Whose company made this week better — or who did you miss?',
  },
  { id: 'people-3', family: 'people', text: 'What did you do with or for someone else this week?' },
  {
    id: 'people-4',
    family: 'people',
    text: 'Which conversation this week is still echoing?',
  },
  {
    id: 'people-5',
    family: 'people',
    text: 'Who got the best of your attention this week — and did they deserve it?',
  },
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
  {
    id: 'want-4',
    family: 'want',
    text: 'Which dream came closer without you noticing at the time?',
  },
  {
    id: 'want-5',
    family: 'want',
    text: 'If next week could only move one dream, which should it be?',
  },
  // honest — the harder look
  { id: 'honest-1', family: 'honest', text: 'What would you rather not repeat next week?' },
  { id: 'honest-2', family: 'honest', text: 'Where did your time go that you didn\u2019t choose?' },
  { id: 'honest-3', family: 'honest', text: 'What are you pretending is fine this week?' },
  {
    id: 'honest-4',
    family: 'honest',
    text: 'What did you call rest that was really avoidance?',
  },
  {
    id: 'honest-5',
    family: 'honest',
    text: 'What would this week look like written by someone who watched you?',
  },
  // rest — restoration
  { id: 'rest-1', family: 'rest', text: 'What restored you this week?' },
  { id: 'rest-2', family: 'rest', text: 'When did you feel most like yourself this week?' },
  { id: 'rest-3', family: 'rest', text: 'What did this week give you back?' },
  {
    id: 'rest-4',
    family: 'rest',
    text: 'When did your shoulders actually drop this week?',
  },
  {
    id: 'rest-5',
    family: 'rest',
    text: 'What did you do slowly on purpose this week?',
  },
  // surprise — the unexpected
  { id: 'surprise-1', family: 'surprise', text: 'What surprised you this week?' },
  { id: 'surprise-2', family: 'surprise', text: 'What happened that you didn\u2019t see coming?' },
  { id: 'surprise-3', family: 'surprise', text: 'What turned out differently than you expected?' },
  {
    id: 'surprise-4',
    family: 'surprise',
    text: 'What went wrong this week in a way you\u2019re oddly grateful for?',
  },
  {
    id: 'surprise-5',
    family: 'surprise',
    text: 'Which plan bent this week, and was the bend better?',
  },
  // next — looking one week ahead
  { id: 'next-1', family: 'next', text: 'What\u2019s the one thing next week should contain?' },
  { id: 'next-2', family: 'next', text: 'What would make next week count, in one line?' },
  { id: 'next-3', family: 'next', text: 'What are you carrying into next week on purpose?' },
  {
    id: 'next-4',
    family: 'next',
    text: 'What are you deliberately leaving out of next week?',
  },
  {
    id: 'next-5',
    family: 'next',
    text: 'If next week had a title, what would you want it to be?',
  },
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
  /** Theme families detected locally from earlier answers this session. */
  detectedThemes?: string[];
  /** Question families already asked this session — excluded from the next pick. */
  askedFamilies?: string[];
  /** Which turn of the weekly interview this is (0 = opener). */
  turn?: number;
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
  if (signals.detectedThemes?.length) {
    parts.push(`themes in earlier answers: ${signals.detectedThemes.join(', ')}`);
  }
  if (signals.askedFamilies?.length) {
    parts.push(`families already asked: ${signals.askedFamilies.join(', ')}`);
  }
  if (typeof signals.turn === 'number' && signals.turn > 0) {
    parts.push(`interview turn: ${signals.turn}`);
  }
  return parts.join('; ');
}

// Theme detection runs locally — the answer itself never leaves the device.
// Only the matched family names become classifier signals.
const THEME_KEYWORDS: Array<{ family: QuestionFamily; pattern: RegExp }> = [
  {
    family: 'people',
    pattern:
      /\b(friends?|wife|husband|partner|mom|mother|dad|father|family|kids?|son|daughter|colleague|coworker|team|dinner with|met up|called|visited|date|birthday|parents?)\b/i,
  },
  {
    family: 'rest',
    pattern:
      /\b(slept?|sleep|nap|rested?|relax\w*|walks?|read|reading|movie|film|show|watched|slow|quiet|coffee|recover\w*|weekend|garden|bath|massage)\b/i,
  },
  {
    family: 'stuck',
    pattern:
      /\b(didn.?t get|didn.?t|postponed|put off|procrastinat\w*|missed|skipped|couldn.?t|failed|behind|too busy|forgot)\b/i,
  },
  {
    family: 'new',
    pattern:
      /\b(first time|tried|trying|never before|signed up|lessons?|classes?|began|started learning|new (job|hobby|place|restaurant|trail))\b/i,
  },
  {
    family: 'want',
    pattern:
      /\b(dream|goal|bucket list|always wanted|someday|plan to|booked|reservation|applied)\b/i,
  },
  {
    family: 'honest',
    pattern:
      /\b(wasted|mindless|scroll\w*|stressed|anxious|overwhelm\w*|exhausted|regret|shouldn.?t have|hated|doom)\b/i,
  },
  {
    family: 'surprise',
    pattern:
      /\b(surpris\w*|unexpected|suddenly|randomly|turned out|out of nowhere|didn.?t expect|ran into)\b/i,
  },
  {
    family: 'momentum',
    pattern:
      /\b(finished|completed|started|launched|shipped|progress|finally|got done|submitted|workout|ran|practiced|built|wrote|cooked|painted|recorded)\b/i,
  },
  {
    family: 'next',
    pattern: /\b(next week|plan\w*|tomorrow|upcoming|looking forward|will be)\b/i,
  },
];

/**
 * Detect which question families an answer touched — locally, so the
 * prose never leaves the device. 'lived' is the opener family and is
 * never detected: it is the default, not a theme.
 */
export function detectThemes(text: string): QuestionFamily[] {
  if (!text.trim()) return [];
  return THEME_KEYWORDS.filter(({ pattern }) => pattern.test(text)).map(({ family }) => family);
}

/** Families still available to ask — everything not already asked this session. */
export function remainingFamilies(askedFamilies: string[] = []): QuestionFamily[] {
  return QUESTION_FAMILIES.filter((family) => !askedFamilies.includes(family));
}

/** True when the context carries no meaningful signal — go straight to fallback. */
export function isContextEmpty(signals: NudgeSignals): boolean {
  return (
    signals.staleDreamCategories.length === 0 &&
    signals.entriesLastMonth === 0 &&
    signals.activeCommitments === 0 &&
    signals.activeDreams === 0 &&
    (signals.detectedThemes?.length ?? 0) === 0
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
