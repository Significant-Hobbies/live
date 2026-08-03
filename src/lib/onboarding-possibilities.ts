import { ALL_EXPERIENCES } from '~/lib/experiences';
import { HOBBY_CATEGORIES } from '~/lib/hobbies';

export type OnboardingPossibility = {
  title: string;
  category: 'travel' | 'adventure' | 'creative' | 'achievement' | 'social' | 'humanitarian';
  emoji: string;
};

const HOBBY_CATEGORY_TO_BUCKET: Record<string, OnboardingPossibility['category']> = {
  Creative: 'creative',
  Music: 'creative',
  Physical: 'adventure',
  Intellectual: 'achievement',
  Gaming: 'achievement',
  Outdoor: 'adventure',
  Culinary: 'creative',
  Collecting: 'achievement',
  Making: 'creative',
  Social: 'social',
};

const HOBBY_PATHS: Array<(hobby: string) => string> = [
  (hobby) => `Try ${hobby} for 30 days`,
  (hobby) => `Spend a weekend learning ${hobby}`,
  (hobby) => `Take an introductory class in ${hobby}`,
  (hobby) => `Find a local group for ${hobby}`,
  (hobby) => `Practice ${hobby} with a friend`,
  (hobby) => `Make a one-month ${hobby} project`,
  (hobby) => `Attend a live ${hobby} event`,
  (hobby) => `Learn the foundations of ${hobby}`,
  (hobby) => `Complete a beginner ${hobby} challenge`,
  (hobby) => `Create something through ${hobby}`,
  (hobby) => `Share a ${hobby} day with family`,
  (hobby) => `Find a mentor for ${hobby}`,
  (hobby) => `Teach someone one thing about ${hobby}`,
  (hobby) => `Document a season of ${hobby}`,
  (hobby) => `Build a personal ritual around ${hobby}`,
  (hobby) => `Join a welcoming ${hobby} community`,
  (hobby) => `Visit a place known for ${hobby}`,
  (hobby) => `Plan a solo ${hobby} day`,
  (hobby) => `Plan a low-cost ${hobby} experiment`,
  (hobby) => `Try ${hobby} outdoors`,
  (hobby) => `Try ${hobby} somewhere new`,
  (hobby) => `Make ${hobby} part of a slow Sunday`,
  (hobby) => `Spend 100 intentional hours on ${hobby}`,
  (hobby) => `Complete a small public ${hobby} project`,
  (hobby) => `Learn ${hobby} from a local expert`,
  (hobby) => `Take a short trip centered on ${hobby}`,
  (hobby) => `Host a small ${hobby} gathering`,
  (hobby) => `Read three great books about ${hobby}`,
  (hobby) => `Watch a master at ${hobby}`,
  (hobby) => `Make a thoughtful gift inspired by ${hobby}`,
  (hobby) => `Use ${hobby} to support a community`,
  (hobby) => `Start a 12-week ${hobby} practice`,
  (hobby) => `Explore the history of ${hobby}`,
  (hobby) => `Photograph a month of ${hobby}`,
  (hobby) => `Keep a field notebook about ${hobby}`,
  (hobby) => `Attend a festival or exhibition for ${hobby}`,
  (hobby) => `Introduce a younger person to ${hobby}`,
  (hobby) => `Revisit ${hobby} from childhood`,
  (hobby) => `Pair ${hobby} with a place you love`,
  (hobby) => `Create an annual tradition around ${hobby}`,
];

// An intentionally broad first shelf. This is editorially selected rather than
// inferred from catalog order; product analytics can replace the ordering once
// there is enough real usage to call it popularity with confidence.
const POPULAR_STARTING_TITLES = [
  'See the Northern Lights in Iceland or Norway',
  'Run a marathon',
  'Learn to play a musical instrument',
  'Host a dinner party for 20+ people',
  'Plant 1,000 trees',
  'Skydive from 15,000 feet',
  'Learn a new language to conversational fluency',
  'Start and grow a business',
  'Take a road trip with your best friends',
  'Write and finish a novel',
  'Learn to fly a plane',
  'Clean up a beach or river in your community',
  'See the Great Barrier Reef',
  'Learn to cook 10 world cuisines from scratch',
  'Climb a mountain over 4,000 metres',
  "Reconnect with someone you've lost touch with",
  'Learn to code and ship an app',
  'Record a song and release it',
] as const;

export function getOnboardingPossibilities(): OnboardingPossibility[] {
  const byTitle = new Map<string, OnboardingPossibility>();
  const add = (possibility: OnboardingPossibility) => {
    const key = possibility.title.trim().toLowerCase();
    if (!byTitle.has(key)) byTitle.set(key, possibility);
  };

  for (const experience of ALL_EXPERIENCES) add(experience);
  for (const group of HOBBY_CATEGORIES) {
    const category = HOBBY_CATEGORY_TO_BUCKET[group.name] ?? 'achievement';
    for (const hobby of group.hobbies) {
      for (const path of HOBBY_PATHS) {
        add({ title: path(hobby), category, emoji: group.emoji });
      }
    }
  }

  const allPossibilities = [...byTitle.values()];
  const byExactTitle = new Map(
    allPossibilities.map((possibility) => [possibility.title, possibility])
  );
  const popular = POPULAR_STARTING_TITLES.map((title) => byExactTitle.get(title)).filter(
    (possibility): possibility is OnboardingPossibility => Boolean(possibility)
  );
  const popularTitles = new Set<string>(POPULAR_STARTING_TITLES);

  return [
    ...popular,
    ...allPossibilities.filter((possibility) => !popularTitles.has(possibility.title)),
  ];
}
