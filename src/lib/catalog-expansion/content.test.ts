import { describe, expect, it } from 'vitest';
import { EXPERIENCE_CATEGORIES, findExperience } from '../experiences';
import { CURATED_EXPERIENCES } from './entries';
import { CURATED_EXPERIENCE_GUIDES } from './plans';

describe('curated experience expansion', () => {
  it('keeps each named activity card when several references share the same portal', () => {
    const cards = [
      ['play-an-introductory-game-of-boccia', 'Boccia'],
      ['try-goalball-at-an-inclusive-sports-session', 'Goalball'],
      ['play-sitting-volleyball-with-an-inclusive-club', 'Sitting Volleyball'],
      ['try-polybat-on-an-adapted-table', 'Classic Polybat'],
      ['join-an-adapted-tee-ball-session', 'Tee Ball'],
    ];
    for (const [slug, card] of cards) {
      expect(
        CURATED_EXPERIENCE_GUIDES[slug].resources.some((resource) => resource.title.includes(card)),
        slug
      ).toBe(true);
    }
  });

  it('adds substantial variety across every existing category', () => {
    expect(CURATED_EXPERIENCES.length).toBeGreaterThanOrEqual(200);
    for (const category of EXPERIENCE_CATEGORIES) {
      expect(
        CURATED_EXPERIENCES.filter((entry) => entry.category === category).length,
        category
      ).toBeGreaterThanOrEqual(10);
    }
    for (const company of ['solo', 'pair', 'group'] as const) {
      expect(
        CURATED_EXPERIENCES.filter((entry) => entry.company.includes(company)).length,
        company
      ).toBeGreaterThanOrEqual(25);
    }
    expect(
      CURATED_EXPERIENCES.filter((entry) => entry.budget === 'free' || entry.budget === 'low')
        .length
    ).toBeGreaterThanOrEqual(100);
  });

  it('gives every addition a unique identity and a complete authored plan', () => {
    const slugs = CURATED_EXPERIENCES.map((entry) => entry.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(Object.keys(CURATED_EXPERIENCE_GUIDES).sort()).toEqual([...slugs].sort());
    for (const entry of CURATED_EXPERIENCES) {
      expect(entry.slug, entry.title).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(entry.description.trim().length, entry.slug).toBeGreaterThan(40);
      expect(entry.description.trim(), entry.slug).not.toBe(entry.title.trim());
      expect(entry.tags.length, entry.slug).toBeGreaterThanOrEqual(3);
      expect(findExperience(entry.slug)?.title, entry.slug).toBe(entry.title);
      const guide = CURATED_EXPERIENCE_GUIDES[entry.slug];
      expect(guide.steps.length, entry.slug).toBeGreaterThanOrEqual(3);
      for (const field of ['time', 'cost', 'place', 'preparation', 'completion', 'tip'] as const) {
        expect(guide[field].trim().length, `${entry.slug} ${field}`).toBeGreaterThan(20);
      }
      for (const step of guide.steps) {
        expect(step.body.trim().length, `${entry.slug} ${step.title}`).toBeGreaterThan(60);
      }
    }
  });

  it('keeps source evidence present, usable and tied to a real editorial revision', () => {
    for (const [slug, guide] of Object.entries(CURATED_EXPERIENCE_GUIDES)) {
      expect(guide.resources.length, slug).toBeGreaterThan(0);
      const urls = guide.resources.map((resource) => resource.url);
      expect(new Set(urls).size, slug).toBe(urls.length);
      expect(guide.updatedAt, slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isFinite(Date.parse(guide.updatedAt)), slug).toBe(true);
      for (const resource of guide.resources) {
        const url = new URL(resource.url);
        expect(url.protocol, slug).toBe('https:');
        expect(url.hostname, slug).not.toMatch(/(^|\.)example\.(com|net|org)$/);
        expect(url.hostname, slug).not.toBe('localhost');
        expect(resource.title.trim().length, slug).toBeGreaterThan(5);
        expect(resource.publisher.trim().length, slug).toBeGreaterThan(1);
        expect(resource.purpose.trim().length, slug).toBeGreaterThan(10);
      }
    }
  });
});
