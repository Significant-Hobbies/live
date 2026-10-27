import { FAMOUS_JOURNEYS } from './famous-journeys';
import { publicHomeMarkdown } from './public-home-source';
import { describe, expect, it, vi } from 'vitest';
import {
  publicEditorialPaths,
  renderPublicEditorialSource,
  renderPublicJourneySource,
} from './public-editorial-source';

describe('authored public editorial Markdown', () => {
  it.each(publicEditorialPaths)(
    'renders the complete source of %s without client hooks',
    (path) => {
      const result = renderPublicEditorialSource(path);
      expect(result).toContain('Source: https://live.significanthobbies.com');
      expect(result).toMatch(/^# /m);
      expect(result?.trim()).not.toBe('');
      expect(result).not.toContain('[object Object]');
    }
  );
  it('preserves anonymous tool prompts and comparison choices', () => {
    expect(renderPublicEditorialSource('/life-in-weeks')).toContain('What date were you born?');
    expect(renderPublicEditorialSource('/life-in-weeks')).toContain('Show me');
    expect(renderPublicEditorialSource('/compare')).toContain('Running vs Cycling');
    expect(renderPublicEditorialSource('/compare')).toContain('Search a hobby');
  });
  it('preserves detailed body copy instead of a summary', () => {
    expect(renderPublicEditorialSource('/about')).toContain(
      'The reps on a thing you actually care about'
    );
    expect(renderPublicEditorialSource('/cheap-hobbies')).toContain('The real cost of any hobby');
    expect(renderPublicEditorialSource('/bucket-list-before-30')).toContain('Most people haven');
  });
  it('includes full journey influence, surprises, dates and attribution', async () => {
    for (const person of FAMOUS_JOURNEYS) {
      const result = (await renderPublicJourneySource(person.slug))?.replace(
        /\\([\\`*_[\]#])/g,
        '$1'
      );
      expect(result).toContain(person.born);
      expect(result).toContain(person.hobbyInfluence);
      for (const hobby of person.surprisingHobbies) expect(result).toContain(hobby);
      if (person.quote) expect(result).toContain(person.quote.attribution || person.name);
    }
  });
  it('includes Gallery statement copy and current source catalog count', () => {
    const result = publicHomeMarkdown();
    expect(result).toContain('The life-in-weeks view puts your time in perspective');
    expect(result).toContain('Private by default');
    expect(result).not.toContain('{count}');
  });
  it('does not dispatch arbitrary private or unknown routes', () => {
    expect(renderPublicEditorialSource('/daily')).toBeNull();
    expect(renderPublicEditorialSource('/u/owner')).toBeNull();
  });
});

vi.mock('~/server/db', () => {
  const rows: never[] = [];
  const chain = Object.assign(Promise.resolve(rows), {
    from: () => chain,
    leftJoin: () => chain,
    innerJoin: () => chain,
    where: () => chain,
    groupBy: () => chain,
    orderBy: () => chain,
    limit: async () => rows,
  });
  return { db: { select: () => chain, query: { users: { findFirst: async () => null } } } };
});

vi.mock('~/server/experience-catalog', async () => {
  const { searchCatalogSeed } = await import('./catalog-seed');
  return { searchExperienceCatalog: searchCatalogSeed };
});
