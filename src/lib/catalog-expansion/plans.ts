import type { CuratedExperienceGuide } from './types';
import { CREATIVE_GUIDES } from './plans/creative';
import { FOOD_GUIDES } from './plans/food';
import { RELATIONSHIPS_GUIDES } from './plans/relationships';
import { MINDFULNESS_GUIDES } from './plans/mindfulness';
import { REFLECTION_GUIDES } from './plans/reflection';
import { ACHIEVEMENT_GUIDES } from './plans/achievement';
import { CONTRIBUTION_GUIDES } from './plans/contribution';
import { ADVENTURE_GUIDES } from './plans/adventure';
import { HEALTH_GUIDES } from './plans/health';
import { TRAVEL_GUIDES } from './plans/travel';

export const CURATED_EXPERIENCE_GUIDES: Record<string, CuratedExperienceGuide> = {
  ...CREATIVE_GUIDES,
  ...FOOD_GUIDES,
  ...RELATIONSHIPS_GUIDES,
  ...MINDFULNESS_GUIDES,
  ...REFLECTION_GUIDES,
  ...ACHIEVEMENT_GUIDES,
  ...CONTRIBUTION_GUIDES,
  ...ADVENTURE_GUIDES,
  ...HEALTH_GUIDES,
  ...TRAVEL_GUIDES,
};
