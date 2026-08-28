import { describe, expect, it } from 'vitest';

import { EXPERIENCE_ENTRIES } from './experiences';
import {
  externalDreamResearchLinks,
  hasNativeDreamMatch,
  normalizeDreamTitle,
  parseDreamList,
  searchDreamAtlas,
} from './dream-atlas';

describe('parseDreamList', () => {
  it('parses a numbered personal bucket list without losing its wording', () => {
    expect(
      parseDreamList(`
        Bucket List
        1. Go to space
        2) On a farm in Switzerland eat chocolate next to a black and white cow
        - Start my band
        4: Go to space
      `)
    ).toEqual([
      'Go to space',
      'On a farm in Switzerland eat chocolate next to a black and white cow',
      'Start my band',
    ]);
  });

  it('deduplicates case and punctuation while keeping the first exact version', () => {
    expect(parseDreamList('Fly a plane\nfly-a-plane\nFLY A PLANE')).toEqual(['Fly a plane']);
  });

  it('honours the import limit and ignores unsafe oversized rows', () => {
    expect(parseDreamList(`One\nTwo\nThree`, 2)).toEqual(['One', 'Two']);
    expect(parseDreamList('x'.repeat(201))).toEqual([]);
  });
});

describe('searchDreamAtlas', () => {
  it('finds a direct native experience across natural wording', () => {
    const matches = searchDreamAtlas(
      EXPERIENCE_ENTRIES,
      'Participate in a car race with a sports car',
      8
    );
    expect(matches[0]?.entry.title).toBe('Drive a racecar at full speed');
    expect(matches[0]?.strength).toBe('native');
    expect(hasNativeDreamMatch(matches)).toBe(true);
    expect(matches.filter((match) => match.strength === 'native')).toHaveLength(1);
  });

  it('does not pretend that an unsupported dream has native coverage', () => {
    const matches = searchDreamAtlas(EXPERIENCE_ENTRIES, 'Go to space', 5);
    expect(hasNativeDreamMatch(matches)).toBe(false);
  });

  it('does not treat a generic action verb as native evidence', () => {
    const matches = searchDreamAtlas(EXPERIENCE_ENTRIES, 'Start my band', 5);
    expect(hasNativeDreamMatch(matches)).toBe(false);
  });

  it('normalizes diacritics and punctuation for stable deduplication', () => {
    expect(normalizeDreamTitle('  Tomatina — España! ')).toBe('tomatina espana');
  });
});

describe('externalDreamResearchLinks', () => {
  it('creates explicit outward research doors without claiming native coverage', () => {
    const links = externalDreamResearchLinks('Visit CES');
    expect(links).toHaveLength(3);
    expect(links.every((link) => link.href.startsWith('https://www.google.com/search?'))).toBe(
      true
    );
    expect(links[0]?.href).toContain('Visit%20CES');
  });
});
