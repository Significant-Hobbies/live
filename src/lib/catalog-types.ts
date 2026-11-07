import type { ExperienceCategory, ExperienceEntry, ExperienceKind } from './experiences';

type CatalogIdea = ExperienceEntry;
export type CatalogQuery = {
  query: string;
  category: ExperienceCategory | 'all';
  kind: ExperienceKind | 'all';
  page: number;
  pageSize: number;
};
export type CatalogPage = {
  items: CatalogIdea[];
  total: number;
  matches: number;
  page: number;
  pageSize: number;
  source: 'database' | 'seed';
  categories: Array<{ id: ExperienceCategory; label: string }>;
};
