// Quest chain decomposition engine — turns a bucket list item into a sequence
// of 3-5 progressive quests that unlock step by step. The chain goes from
// "try it once" → "go deeper" → "commit to the real thing."
//
// This is a PURE function — no DB calls, no side effects. The UI component
// handles starting/completing quests by checking the user's active quests.

import type { BucketItemCategory } from './famous-bucket-lists';

export type QuestChainStep = {
  questId: string; // "bc-{bucketItemId}-{stepNumber}"
  title: string;
  description: string;
  emoji: string;
  stepNumber: number; // 1, 2, 3...
  difficulty: 'easy' | 'medium' | 'hard';
};

export type QuestChainParams = {
  bucketItemId: string;
  title: string;
  category: string | null;
};

// ─── Category-aware chain templates ─────────────────────────────────────────
// Each template is a function that takes the bucket list item title and returns
// an array of step definitions (title, description, emoji, difficulty).
// The chain goes from low-commitment "try it once" to high-commitment "do the
// real thing."

type StepTemplate = {
  title: string;
  description: string;
  emoji: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

type ChainTemplate = (itemTitle: string) => StepTemplate[];

// ─── Travel ─────────────────────────────────────────────────────────────────
// Research destination → Try a local version → Plan the trip → Book it

const TRAVEL_TEMPLATE: ChainTemplate = (itemTitle) => [
  {
    title: `Research ${itemTitle}`,
    description: `Spend 1 hour learning about ${itemTitle}. Read travel blogs, watch videos, and note the best time to go, costs, and what to expect.`,
    emoji: '🔍',
    difficulty: 'easy',
  },
  {
    title: `Try a local taste of ${itemTitle}`,
    description: `Find a local version of the experience — a restaurant, a neighborhood, a cultural event. Go this week. See if the vibe pulls you in.`,
    emoji: '🗺️',
    difficulty: 'easy',
  },
  {
    title: `Plan the ${itemTitle} trip`,
    description: `Draft a real itinerary. Pick dates, set a budget, list what you'd do each day. This is the step where it stops being a dream and starts being a plan.`,
    emoji: '📋',
    difficulty: 'medium',
  },
  {
    title: `Book ${itemTitle}`,
    description: `Put down a deposit or buy the ticket. Lock in the date. Once money is committed, the trip becomes real.`,
    emoji: '✈️',
    difficulty: 'hard',
  },
];

// ─── Adventure ──────────────────────────────────────────────────────────────
// Try beginner version → Intermediate → The real thing

const ADVENTURE_TEMPLATE: ChainTemplate = (itemTitle) => [
  {
    title: `Try a beginner version of ${itemTitle}`,
    description: `Find the easiest, most accessible version of ${itemTitle} near you. Just 1 hour. See if you enjoy the core activity before committing to the big version.`,
    emoji: '🥾',
    difficulty: 'easy',
  },
  {
    title: `Take on an intermediate challenge`,
    description: `Step it up one level. Find a local trail, gym, or course that approximates ${itemTitle} at half the intensity. Build your confidence and fitness.`,
    emoji: '⛰️',
    difficulty: 'medium',
  },
  {
    title: `Train specifically for ${itemTitle}`,
    description: `Commit to a training plan for the next month. Build the endurance, strength, or skill you'll need. Track your progress weekly.`,
    emoji: '💪',
    difficulty: 'medium',
  },
  {
    title: `Do ${itemTitle}`,
    description: `This is it. Book the guide, pick the date, and go. You've earned the right to attempt the real thing — now go do it.`,
    emoji: '🏔️',
    difficulty: 'hard',
  },
];

// ─── Creative ───────────────────────────────────────────────────────────────
// Try the medium → Make something small → Make something bigger → Share it

const CREATIVE_TEMPLATE: ChainTemplate = (itemTitle) => [
  {
    title: `Try the medium behind ${itemTitle}`,
    description: `Get the basic tools for ${itemTitle} and spend an afternoon experimenting. No goal, no pressure — just feel the materials and see what comes out.`,
    emoji: '🎨',
    difficulty: 'easy',
  },
  {
    title: `Make something small`,
    description: `Complete one small, finished piece related to ${itemTitle}. A sketch, a verse, a short recording. The point is to finish something, not to make it great.`,
    emoji: '✏️',
    difficulty: 'easy',
  },
  {
    title: `Make something bigger`,
    description: `Take on a larger project for ${itemTitle}. Something that takes multiple sessions. Push past the point where you'd normally quit.`,
    emoji: '🖌️',
    difficulty: 'medium',
  },
  {
    title: `Share your ${itemTitle} work`,
    description: `Put your work out there — post it online, show a friend, enter a local show. The act of sharing completes the creative loop.`,
    emoji: '📣',
    difficulty: 'hard',
  },
];

// ─── Achievement ────────────────────────────────────────────────────────────
// Research → Start training/practice → Milestone 1 → The achievement

const ACHIEVEMENT_TEMPLATE: ChainTemplate = (itemTitle) => [
  {
    title: `Research what ${itemTitle} takes`,
    description: `Find people who've done ${itemTitle}. Read their stories, note their timelines, and figure out what skills, resources, and time you'll need.`,
    emoji: '📚',
    difficulty: 'easy',
  },
  {
    title: `Start training for ${itemTitle}`,
    description: `Begin a daily or weekly practice routine. Even 20 minutes a day counts. The goal is consistency, not intensity — yet.`,
    emoji: '🎯',
    difficulty: 'medium',
  },
  {
    title: `Hit your first milestone`,
    description: `Define a measurable halfway point for ${itemTitle} and reach it. A qualifying time, a partial completion, a proof-of-concept. Celebrate it.`,
    emoji: '🏁',
    difficulty: 'medium',
  },
  {
    title: `Achieve ${itemTitle}`,
    description: `Go for the real thing. You've put in the reps — now execute. Document it so you have proof you did it.`,
    emoji: '🏆',
    difficulty: 'hard',
  },
];

// ─── Relationships ──────────────────────────────────────────────────────────
// Reach out → Small gathering → Bigger event

const RELATIONSHIPS_TEMPLATE: ChainTemplate = (itemTitle) => [
  {
    title: `Reach out about ${itemTitle}`,
    description: `Send a message to one person who'd be part of ${itemTitle}. A friend, a group, a community. Just start the conversation.`,
    emoji: '💬',
    difficulty: 'easy',
  },
  {
    title: `Plan a small gathering`,
    description: `Get 2-3 people together for a low-stakes version of ${itemTitle}. A coffee, a call, a casual hang. Test the waters.`,
    emoji: '🤝',
    difficulty: 'medium',
  },
  {
    title: `Make ${itemTitle} happen`,
    description: `Organize the real thing — the dinner, the trip, the event. You've built the momentum; now commit to a date and follow through.`,
    emoji: '🎉',
    difficulty: 'hard',
  },
];

// ─── Contribution ───────────────────────────────────────────────────────────
// Research causes → Volunteer locally → Commit to a project

const CONTRIBUTION_TEMPLATE: ChainTemplate = (itemTitle) => [
  {
    title: `Research causes behind ${itemTitle}`,
    description: `Spend an hour learning which organizations and causes align with ${itemTitle}. Find 3 you respect and note how they help.`,
    emoji: '🔎',
    difficulty: 'easy',
  },
  {
    title: `Volunteer locally`,
    description: `Find a local opportunity related to ${itemTitle} and show up once this month. Just one shift. See if the work resonates with you.`,
    emoji: '🤲',
    difficulty: 'medium',
  },
  {
    title: `Commit to ${itemTitle}`,
    description: `Pick one organization or project and make a real commitment — a recurring donation, a regular volunteer slot, or a personal project. Sustained help beats one-off help.`,
    emoji: '🌍',
    difficulty: 'hard',
  },
];

// ─── Food ───────────────────────────────────────────────────────────────────
// Try it locally → Cook it yourself → Go to the source

const FOOD_TEMPLATE: ChainTemplate = (itemTitle) => [
  {
    title: `Try a version of ${itemTitle} locally`,
    description: `Find the closest approximation of ${itemTitle} near you — a restaurant, a market, a shop. Taste it. See if it pulls you in.`,
    emoji: '🍽️',
    difficulty: 'easy',
  },
  {
    title: `Make it yourself`,
    description: `Find a recipe or technique behind ${itemTitle} and attempt it at home. It won't be perfect. The point is to understand the food from the inside.`,
    emoji: '👨‍🍳',
    difficulty: 'medium',
  },
  {
    title: `Go deeper with ${itemTitle}`,
    description: `Take it to the source — travel for it, take a class, or master the technique. Turn curiosity into a real relationship with the food.`,
    emoji: '🌍',
    difficulty: 'hard',
  },
];

// ─── Health ─────────────────────────────────────────────────────────────────
// Start small → Build consistency → Hit the goal

const HEALTH_TEMPLATE: ChainTemplate = (itemTitle) => [
  {
    title: `Start a small version of ${itemTitle}`,
    description: `Find the easiest entry point to ${itemTitle} — a 10-minute walk, a beginner routine, one good night's sleep. Just start this week.`,
    emoji: '🚶',
    difficulty: 'easy',
  },
  {
    title: `Build a weekly rhythm`,
    description: `Turn ${itemTitle} into a habit. Commit to 3 sessions a week for a month. Track it. The goal is consistency, not intensity.`,
    emoji: '📅',
    difficulty: 'medium',
  },
  {
    title: `Achieve ${itemTitle}`,
    description: `Go for the real milestone — the target weight, the distance, the certification. You've built the base; now push to the goal.`,
    emoji: '💪',
    difficulty: 'hard',
  },
];

// ─── Mindfulness ────────────────────────────────────────────────────────────
// Try it once → Build a practice → Go deep

const MINDFULNESS_TEMPLATE: ChainTemplate = (itemTitle) => [
  {
    title: `Try ${itemTitle} for 10 minutes`,
    description: `Find the simplest way to experience ${itemTitle} — a short meditation, a walk in nature, a moment of silence. Just 10 minutes. See what shifts.`,
    emoji: '🌿',
    difficulty: 'easy',
  },
  {
    title: `Practice ${itemTitle} for a week`,
    description: `Commit to ${itemTitle} daily for 7 days. Keep it small — 10-15 minutes. The point is to feel what consistency reveals that one session doesn't.`,
    emoji: '🧘',
    difficulty: 'medium',
  },
  {
    title: `Go deep with ${itemTitle}`,
    description: `Take ${itemTitle} to its real form — a retreat, a silent week, a daily practice you commit to for a season. Let it change how you pay attention.`,
    emoji: '🕯️',
    difficulty: 'hard',
  },
];

// ─── Reflection ──────────────────────────────────────────────────────────────
// Start writing → Review patterns → Share or complete

const REFLECTION_TEMPLATE: ChainTemplate = (itemTitle) => [
  {
    title: `Start ${itemTitle} privately`,
    description: `Begin ${itemTitle} in whatever form feels natural — a journal entry, a letter you don't send, a voice memo. No audience. Just begin.`,
    emoji: '✍️',
    difficulty: 'easy',
  },
  {
    title: `Go back and look for patterns`,
    description: `After a few weeks of ${itemTitle}, re-read what you've written. What repeats? What surprises you? The insight is in the pattern, not the individual entry.`,
    emoji: '🔍',
    difficulty: 'medium',
  },
  {
    title: `Complete ${itemTitle}`,
    description: `Bring ${itemTitle} to a close — send the letter, finish the memoir, have the conversation, share the story. The reflection becomes real when it reaches someone.`,
    emoji: '📖',
    difficulty: 'hard',
  },
];

// ─── Default / uncategorized ────────────────────────────────────────────────
// Try it once → Go deeper → Commit to it

const DEFAULT_TEMPLATE: ChainTemplate = (itemTitle) => [
  {
    title: `Try ${itemTitle} once`,
    description: `Find the simplest way to experience ${itemTitle} and do it this week. No commitment — just see if it's something you want to pursue.`,
    emoji: '✨',
    difficulty: 'easy',
  },
  {
    title: `Go deeper with ${itemTitle}`,
    description: `Take the next step. Invest a few hours, learn the basics, and push past the surface-level experience. See if it holds your interest.`,
    emoji: '🌊',
    difficulty: 'medium',
  },
  {
    title: `Commit to ${itemTitle}`,
    description: `Make a real commitment — sign up, book it, or set a deadline. Turn the curiosity into a plan with a date attached.`,
    emoji: '🔑',
    difficulty: 'hard',
  },
];

// ─── Template registry ──────────────────────────────────────────────────────

const TEMPLATES: Record<string, ChainTemplate> = {
  travel: TRAVEL_TEMPLATE,
  adventure: ADVENTURE_TEMPLATE,
  creative: CREATIVE_TEMPLATE,
  achievement: ACHIEVEMENT_TEMPLATE,
  relationships: RELATIONSHIPS_TEMPLATE,
  contribution: CONTRIBUTION_TEMPLATE,
  food: FOOD_TEMPLATE,
  health: HEALTH_TEMPLATE,
  mindfulness: MINDFULNESS_TEMPLATE,
  reflection: REFLECTION_TEMPLATE,
};

// ─── Main export ────────────────────────────────────────────────────────────

export function generateQuestChain(params: QuestChainParams): QuestChainStep[] {
  const { bucketItemId, title, category } = params;

  // Pick the template — fall back to default for unknown/null categories
  const template = category && TEMPLATES[category] ? TEMPLATES[category] : DEFAULT_TEMPLATE;

  const steps = template(title);

  return steps.map((step, index) => ({
    questId: `bc-${bucketItemId}-${index + 1}`,
    title: step.title,
    description: step.description,
    emoji: step.emoji,
    stepNumber: index + 1,
    difficulty: step.difficulty,
  }));
}
