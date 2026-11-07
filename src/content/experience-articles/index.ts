import type { ExperienceArticle } from '~/lib/experience-article-model';
import { ACHIEVEMENT_ARTICLES } from './achievement';
import { ADVENTURE_ARTICLES } from './adventure';
import { CONTRIBUTION_ARTICLES } from './contribution';
import { CREATIVE_ARTICLES } from './creative';
import { FOOD_ARTICLES } from './food';
import { HEALTH_ARTICLES } from './health';
import { MINDFULNESS_ARTICLES } from './mindfulness';
import { REFLECTION_ARTICLES } from './reflection';
import { RELATIONSHIPS_ARTICLES } from './relationships';
import { TRAVEL_ARTICLES } from './travel';

export const EXPERIENCE_ARTICLES: ExperienceArticle[] = [
  ...ACHIEVEMENT_ARTICLES,
  ...ADVENTURE_ARTICLES,
  ...CONTRIBUTION_ARTICLES,
  ...CREATIVE_ARTICLES,
  ...FOOD_ARTICLES,
  ...HEALTH_ARTICLES,
  ...MINDFULNESS_ARTICLES,
  ...REFLECTION_ARTICLES,
  ...RELATIONSHIPS_ARTICLES,
  ...TRAVEL_ARTICLES,
];
