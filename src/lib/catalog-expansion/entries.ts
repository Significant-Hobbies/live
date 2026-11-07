import type { CuratedExperience } from './types';
import { CREATIVE_EXPERIENCES } from './entries/creative';
import { FOOD_EXPERIENCES } from './entries/food';
import { RELATIONSHIPS_EXPERIENCES } from './entries/relationships';
import { MINDFULNESS_EXPERIENCES } from './entries/mindfulness';
import { REFLECTION_EXPERIENCES } from './entries/reflection';
import { ACHIEVEMENT_EXPERIENCES } from './entries/achievement';
import { CONTRIBUTION_EXPERIENCES } from './entries/contribution';
import { ADVENTURE_EXPERIENCES } from './entries/adventure';
import { HEALTH_EXPERIENCES } from './entries/health';
import { TRAVEL_EXPERIENCES } from './entries/travel';

export const CURATED_EXPERIENCES: CuratedExperience[] = [
  ...CREATIVE_EXPERIENCES,
  ...FOOD_EXPERIENCES,
  ...RELATIONSHIPS_EXPERIENCES,
  ...MINDFULNESS_EXPERIENCES,
  ...REFLECTION_EXPERIENCES,
  ...ACHIEVEMENT_EXPERIENCES,
  ...CONTRIBUTION_EXPERIENCES,
  ...ADVENTURE_EXPERIENCES,
  ...HEALTH_EXPERIENCES,
  ...TRAVEL_EXPERIENCES,
];
