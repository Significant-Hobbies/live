import type { ExperienceCategory, ExperienceEntry, ExperienceKind } from '~/lib/experiences';

export type DreamAtlasEntry = Pick<
  ExperienceEntry,
  'slug' | 'title' | 'description' | 'emoji' | 'category' | 'kind' | 'location'
> & {
  firstStep?: {
    title: string;
    body: string;
    emoji: string;
  };
};

export type DreamAtlasMatch = {
  entry: DreamAtlasEntry;
  score: number;
  strength: 'native' | 'related';
};

export type DreamTerritory = {
  id: string;
  label: string;
  description: string;
  prompts: string[];
  color: string;
  emoji: string;
};

export const DREAM_TERRITORIES: DreamTerritory[] = [
  {
    id: 'motion-edge',
    label: 'Motion & edge',
    description: 'Speed, height, distance, weather, and the useful kind of fear.',
    prompts: [
      'Drive a racecar at full speed',
      'Skydive from 15,000 feet',
      'Climb a mountain over 4,000 metres',
    ],
    color: 'bg-[#ffd0bd]',
    emoji: '↗',
  },
  {
    id: 'make-perform',
    label: 'Make & perform',
    description: 'Songs, films, books, stages, paint, and things that did not exist before you.',
    prompts: ['Record a song and release it', 'Create a short film', 'Write and finish a novel'],
    color: 'bg-[#c5abfa]',
    emoji: '✦',
  },
  {
    id: 'world-wonder',
    label: 'World & wonder',
    description: 'Places, festivals, natural spectacles, and a planet larger than routine.',
    prompts: [
      'Live abroad for at least one full year',
      'Experience Carnival in Rio de Janeiro',
      'Visit every continent',
    ],
    color: 'bg-[#b9dcf5]',
    emoji: '◎',
  },
  {
    id: 'belong-play',
    label: 'Belong & play',
    description: 'Gatherings, games, crowds, costumes, and memorable reasons to join in.',
    prompts: [
      'Host a dinner party for 20+ people',
      'Attend a multi-day music festival',
      'Join a community choir or theatre group',
    ],
    color: 'bg-[#f7e957]',
    emoji: '∞',
  },
  {
    id: 'become',
    label: 'Become someone else',
    description: 'Try on another discipline, role, rhythm, or way of seeing the world.',
    prompts: [
      'Learn to fly a plane',
      'Do a serious meditation retreat (10+ days)',
      'Learn a new language to conversational fluency',
    ],
    color: 'bg-[#dceabf]',
    emoji: '◇',
  },
  {
    id: 'build-give',
    label: 'Build & give',
    description: 'Businesses, institutions, service, generosity, and work that outlasts you.',
    prompts: [
      'Start and grow a business',
      'Start a foundation',
      'Build something that outlasts you',
    ],
    color: 'bg-[#a8dc91]',
    emoji: '＋',
  },
] as const;

const STOPWORDS = new Set([
  'a',
  'an',
  'and',
  'as',
  'at',
  'be',
  'for',
  'finish',
  'from',
  'go',
  'have',
  'in',
  'it',
  'my',
  'of',
  'on',
  'participate',
  'start',
  'the',
  'to',
  'with',
]);

export function normalizeDreamTitle(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function tokens(value: string): string[] {
  return [
    ...new Set(
      normalizeDreamTitle(value)
        .split(' ')
        .filter((token) => token.length > 2 && !STOPWORDS.has(token))
    ),
  ];
}

function tokensRelate(left: string, right: string): boolean {
  if (left === right) return true;
  const prefixMatch =
    Math.min(left.length, right.length) >= 4 && (left.startsWith(right) || right.startsWith(left));
  const compoundMatch =
    (left === 'car' && right === 'racecar') || (left === 'racecar' && right === 'car');
  return prefixMatch || compoundMatch;
}

function countTokenMatches(queryTokens: string[], candidateTokens: string[]): number {
  return queryTokens.filter((queryToken) =>
    candidateTokens.some((candidateToken) => tokensRelate(queryToken, candidateToken))
  ).length;
}

export function searchDreamAtlas(
  entries: DreamAtlasEntry[],
  query: string,
  limit = 8
): DreamAtlasMatch[] {
  const normalizedQuery = normalizeDreamTitle(query);
  const queryTokens = tokens(query);
  if (!normalizedQuery || queryTokens.length === 0) return [];

  return entries
    .map((entry) => {
      const normalizedTitle = normalizeDreamTitle(entry.title);
      const titleMatches = countTokenMatches(queryTokens, tokens(entry.title));
      const descriptionMatches = countTokenMatches(queryTokens, tokens(entry.description ?? ''));
      const categoryMatch = queryTokens.includes(entry.category) ? 1 : 0;
      const exact = normalizedTitle === normalizedQuery;
      const phraseMatch =
        normalizedTitle.includes(normalizedQuery) || normalizedQuery.includes(normalizedTitle);
      const requiredTitleMatches = Math.max(1, Math.ceil(queryTokens.length / 2));
      const strength: DreamAtlasMatch['strength'] =
        exact || phraseMatch || titleMatches >= requiredTitleMatches ? 'native' : 'related';
      const score =
        (exact ? 100 : 0) +
        (phraseMatch ? 54 : 0) +
        titleMatches * 18 +
        descriptionMatches * 4 +
        categoryMatch * 6;
      return { entry, score, strength };
    })
    .filter((match) => match.score > 0)
    .sort((left, right) => {
      if (left.strength !== right.strength) return left.strength === 'native' ? -1 : 1;
      return right.score - left.score || left.entry.title.localeCompare(right.entry.title);
    })
    .slice(0, Math.max(1, limit));
}

export function hasNativeDreamMatch(matches: DreamAtlasMatch[]): boolean {
  return matches.some((match) => match.strength === 'native');
}

export function parseDreamList(value: string, limit = 100): string[] {
  const seen = new Set<string>();
  const dreams: string[] = [];

  for (const rawLine of value.split(/\r?\n/)) {
    const title = rawLine
      .trim()
      .replace(/^(?:[-*•]\s+|\d{1,3}\s*[.)\]:-]\s*)/, '')
      .trim();
    if (!title || /^bucket\s+list:?$/i.test(title) || title.length > 200) continue;
    const key = normalizeDreamTitle(title);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    dreams.push(title);
    if (dreams.length >= limit) break;
  }

  return dreams;
}

export function externalDreamResearchLinks(query: string): Array<{
  label: string;
  detail: string;
  href: string;
}> {
  const exact = query.trim();
  const google = (suffix: string) =>
    `https://www.google.com/search?q=${encodeURIComponent(`${exact} ${suffix}`.trim())}`;

  return [
    {
      label: 'Search the wider world',
      detail: 'Look for current official experiences, programmes, events, and places.',
      href: google('experience official'),
    },
    {
      label: 'Find a version near you',
      detail: 'See whether there is a local, introductory, or one-day form of the dream.',
      href: google('experience near me'),
    },
    {
      label: 'Read first-hand stories',
      detail: 'Learn what people who attempted something similar wish they had known.',
      href: google('first hand experience story'),
    },
  ];
}

export function dreamCategoryLabel(category: ExperienceCategory): string {
  return category === 'relationships'
    ? 'belonging'
    : category === 'contribution'
      ? 'building & giving'
      : category;
}

export function dreamKindLabel(kind: ExperienceKind): string {
  return kind === 'destination' ? 'place' : kind;
}
