import { describe, expect, it } from 'vitest';

import {
  editorialArticles,
  getEditorialArticle,
  getEditorialArticlesForHobby,
} from './editorial-content';

describe('editorial content adapter', () => {
  it('keeps one canonical article for every slug', () => {
    const slugs = editorialArticles.map((article) => article.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('preserves legacy blog detail lookup', () => {
    const legacy = editorialArticles.find((article) => !article.package);
    expect(legacy).toBeDefined();
    expect(getEditorialArticle(legacy!.slug)).toEqual(legacy);
  });

  it('does not recommend geological or architectural articles for Art or the card game Bridge', () => {
    expect(
      getEditorialArticlesForHobby('Art').map((article) => article.experience?.experienceSlug)
    ).not.toContain('complete-an-earthcache-geology-field-challenge');
    expect(
      getEditorialArticlesForHobby('Bridge').map((article) => article.experience?.experienceSlug)
    ).not.toContain('learn-living-root-bridge-stewardship-from-a-local-guide');
  });
});
