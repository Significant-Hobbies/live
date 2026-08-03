import { describe, expect, it } from 'vitest';
import { getOnboardingPossibilities } from './onboarding-possibilities';

describe('onboarding possibility catalog', () => {
  it('offers at least five thousand distinct searchable paths', () => {
    const possibilities = getOnboardingPossibilities();
    const titles = new Set(possibilities.map((possibility) => possibility.title.toLowerCase()));

    expect(possibilities.length).toBeGreaterThanOrEqual(5_000);
    expect(titles.size).toBe(possibilities.length);
  });

  it('includes both curated experiences and generated hobby paths', () => {
    const titles = getOnboardingPossibilities().map((possibility) => possibility.title);

    expect(titles).toContain('Revisit Drawing from childhood');
    expect(titles).toContain('Bhutan');
  });

  it('opens with a balanced popular shelf instead of the first catalog category', () => {
    const popular = getOnboardingPossibilities().slice(0, 18);
    const categories = new Set(popular.map((possibility) => possibility.category));

    expect(popular).toHaveLength(18);
    expect(categories).toEqual(
      new Set(['travel', 'adventure', 'creative', 'achievement', 'social', 'humanitarian'])
    );
    expect(popular.filter((possibility) => possibility.category === 'travel').length).toBeLessThan(
      5
    );
  });
});
