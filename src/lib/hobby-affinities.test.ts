import { describe, expect, it } from 'vitest';

import { ALL_HOBBIES, getCategoryForHobby } from './hobbies';
import { getRelatedHobbies, HOBBY_AFFINITIES } from './hobby-affinities';

/**
 * `getRelatedHobbies` filters out any affinity whose name is not in the
 * taxonomy — silently. Two entries pointed at 'Collecting', which is a
 * *category* name rather than a hobby, so "History" and "Jewelry making" quietly
 * offered 2 related hobbies instead of 3 and nothing ever surfaced it.
 *
 * These tests assert the catalogue is internally consistent, so the next typo is
 * a failure rather than a quietly shorter list.
 */
describe('HOBBY_AFFINITIES integrity', () => {
  const lower = new Set(ALL_HOBBIES.map((h) => h.toLowerCase()));

  it('every affinity target is a real hobby in the taxonomy', () => {
    const unknown: string[] = [];
    for (const [source, targets] of Object.entries(HOBBY_AFFINITIES)) {
      for (const { name } of targets) {
        if (!lower.has(name.toLowerCase())) unknown.push(`${source} → ${name}`);
      }
    }
    expect(unknown, `these affinity targets are not hobbies: ${unknown.join(', ')}`).toEqual([]);
  });

  it('every affinity key is a real hobby too', () => {
    const unknown = Object.keys(HOBBY_AFFINITIES).filter((k) => !lower.has(k.toLowerCase()));
    expect(unknown, `these affinity keys are not hobbies: ${unknown.join(', ')}`).toEqual([]);
  });

  it('every target carries a reason', () => {
    for (const targets of Object.values(HOBBY_AFFINITIES)) {
      for (const t of targets) {
        expect(t.reason.trim().length).toBeGreaterThan(10);
      }
    }
  });

  it('recovers the two entries that pointed at a category instead of a hobby', () => {
    // Both named 'Collecting'. Jewelry making now offers its intended three;
    // History reaches two, because its third entry (Reading) is *also*
    // Intellectual and the cross-category rule drops it by design — see the
    // same-category test below, which is a separate and much larger issue.
    expect(getRelatedHobbies('Jewelry making').map((h) => h.name)).toEqual([
      'Drawing',
      'Yoga',
      'Watches',
    ]);
    expect(getRelatedHobbies('History').map((h) => h.name)).toEqual(['Travel', 'Coins']);
  });

  it('never leaves a hobby with no related hobbies at all', () => {
    // Filmmaking had all three of its entries dropped as same-category, so its
    // "related hobbies" section rendered empty while the catalogue looked full.
    const empty = Object.keys(HOBBY_AFFINITIES).filter((h) => getRelatedHobbies(h).length === 0);
    expect(empty, `these hobbies show no related hobbies: ${empty.join(', ')}`).toEqual([]);
  });

  it('never suggests a hobby from the source’s own category', () => {
    // The cross-category rule is what makes these suggestions useful rather than
    // a second copy of the same-category list shown elsewhere on the page.
    for (const source of Object.keys(HOBBY_AFFINITIES)) {
      const sourceCat = getCategoryForHobby(source)?.name;
      if (!sourceCat) continue;
      for (const { name } of getRelatedHobbies(source)) {
        expect(getCategoryForHobby(name)?.name, `${source} → ${name}`).not.toBe(sourceCat);
      }
    }
  });
});
