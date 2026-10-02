import { describe, expect, it } from 'vitest';

import {
  EXPERIENCE_COLLECTIONS,
  collectionsForExperience,
  findExperienceCollection,
} from './experience-collections';
import { EXPERIENCE_GUIDES, EXPERIENCE_CONTENT_UPDATED } from './experience-guides';
import { EXPERIENCE_ENTRIES, EXPERIENCES_BY_CATEGORY, findExperience } from './experiences';
import { experienceBreadcrumbs, experienceMetadata } from './experience-seo';
import { SITE_URL } from './site-metadata';
import { renderPublicRouteMarkdown } from './public-route-markdown';

describe('practical experience content', () => {
  it('keeps HTML and machine-readable guide content aligned', async () => {
    for (const [slug, guide] of Object.entries(EXPERIENCE_GUIDES)) {
      const markdown = await renderPublicRouteMarkdown(`/experiences/${slug}`);
      expect(markdown, slug).toContain(guide.preparation);
      expect(markdown, slug).toContain(guide.completion);
      expect(markdown, slug).toContain(guide.steps[0].body);
    }
    for (const collection of EXPERIENCE_COLLECTIONS) {
      const markdown = await renderPublicRouteMarkdown(
        `/experiences/collections/${collection.slug}`
      );
      expect(markdown).toContain(collection.choosing);
      for (const item of collection.items) expect(markdown).toContain(`/experiences/${item.slug}`);
    }
    expect(await renderPublicRouteMarkdown('/experiences/collections/missing')).toBeNull();
  });
  it('only enhances existing public activity URLs and has no repeated plans', () => {
    const plans = Object.entries(EXPERIENCE_GUIDES);
    expect(plans.length).toBeGreaterThanOrEqual(24);
    const bodies = new Set<string>();
    for (const [slug, guide] of plans) {
      expect(findExperience(slug)?.description, slug).toBeTruthy();
      expect(guide.steps.length, slug).toBeGreaterThanOrEqual(3);
      for (const text of [
        guide.time,
        guide.cost,
        guide.place,
        guide.preparation,
        guide.completion,
        guide.tip,
      ]) {
        expect(text.trim().length, slug).toBeGreaterThan(20);
      }
      for (const step of guide.steps) {
        expect(bodies.has(step.body), `${slug} repeats a step from another guide`).toBe(false);
        bodies.add(step.body);
      }
      expect(
        collectionsForExperience(slug).length,
        `${slug} needs a discovery link`
      ).toBeGreaterThan(0);
    }
    expect(EXPERIENCE_CONTENT_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('keeps every collection distinct and every member link usable', () => {
    expect(new Set(EXPERIENCE_COLLECTIONS.map((c) => c.slug)).size).toBe(
      EXPERIENCE_COLLECTIONS.length
    );
    const selections = new Set<string>();
    for (const collection of EXPERIENCE_COLLECTIONS) {
      expect(findExperienceCollection(collection.slug)).toBe(collection);
      expect(collection.items.length).toBeGreaterThanOrEqual(6);
      const slugs = collection.items.map((item) => item.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
      const selection = [...slugs].sort().join('|');
      expect(selections.has(selection), collection.slug).toBe(false);
      selections.add(selection);
      for (const item of collection.items) {
        expect(findExperience(item.slug)?.description, item.slug).toBeTruthy();
        expect(EXPERIENCE_GUIDES[item.slug], item.slug).toBeDefined();
        expect(item.why.trim().length, item.slug).toBeGreaterThan(30);
      }
    }
    expect(findExperienceCollection('missing')).toBeUndefined();
  });

  it('can link every idea in the category roundup by its exact corpus title', () => {
    const titles = new Set(EXPERIENCE_ENTRIES.map((entry) => entry.title));
    for (const category of Object.values(EXPERIENCES_BY_CATEGORY)) {
      for (const title of category.ideas) expect(titles.has(title), title).toBe(true);
    }
  });

  it('builds canonical metadata and ordered breadcrumbs for a collection', () => {
    const path = '/experiences/collections/weekend';
    const metadata = experienceMetadata('Weekend ideas', 'A practical selection.', path);
    expect(metadata.alternates?.canonical).toBe(path);
    expect(metadata.openGraph).toMatchObject({ url: path, description: 'A practical selection.' });
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' });
    const breadcrumbs = experienceBreadcrumbs([
      { name: 'Catalog', path: '/experiences' },
      { name: 'Weekend', path },
    ]);
    expect(breadcrumbs.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Catalog', item: `${SITE_URL}/experiences` },
      { '@type': 'ListItem', position: 2, name: 'Weekend', item: `${SITE_URL}${path}` },
    ]);
  });
});
