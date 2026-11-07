import type { BucketItemCategory } from '../famous-bucket-lists';

export type CuratedExperience = {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  category: BucketItemCategory;
  kind: 'idea';
  location: 'anywhere' | 'specific-place';
  tags: string[];
  budget: 'free' | 'low' | 'moderate' | 'substantial';
  effort: 'short' | 'session' | 'weekend' | 'ongoing';
  company: ('solo' | 'pair' | 'group')[];
};

export type ExperienceResource = {
  title: string;
  url: string;
  publisher: string;
  purpose: string;
};

export type ExperienceGuide = {
  title: string;
  summary: string;
  time: string;
  cost: string;
  place: string;
  preparation: string;
  steps: { title: string; body: string }[];
  completion: string;
  tip: string;
  resources?: ExperienceResource[];
  updatedAt?: string;
};

export type CuratedExperienceGuide = ExperienceGuide & {
  resources: ExperienceResource[];
  updatedAt: string;
};
