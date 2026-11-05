import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { EXPERIENCE_ENTRIES } from './experiences';
import { experienceImage } from './experience-images';

describe('experience photography', () => {
  it('provides locally served, existing image variants for every catalog entry', () => {
    for (const entry of EXPERIENCE_ENTRIES) {
      const image = experienceImage(entry.title, entry.category);
      expect(image, entry.title).not.toBeNull();
      if (!image) continue;
      const sources = [
        image.src,
        ...(image.srcSet?.split(', ').map((src) => src.split(' ')[0]) ?? []),
      ];
      for (const src of sources) {
        expect(src.startsWith('/'), entry.title).toBe(true);
        expect(existsSync(join(process.cwd(), 'public', src)), `${entry.title}: ${src}`).toBe(true);
      }
    }
  });

  it('uses destination imagery ahead of broad activity matches', () => {
    expect(experienceImage('Swim in the Dead Sea', 'travel')?.src).toContain('/dead-sea-');
    expect(experienceImage('See the Pyramids of Giza', 'travel')?.src).toContain('/pyramids-');
    expect(experienceImage('Take a pottery class', 'creative')?.src).toContain('pottery');
  });

  it('leaves unrelated custom wording without an invented picture', () => {
    expect(experienceImage('Move to Singapore')).toBeNull();
    expect(experienceImage('Start something new')).toBeNull();
    expect(experienceImage('My own thing', 'unknown')).toBeNull();
  });
});
