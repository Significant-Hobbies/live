// @vitest-environment node
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const fromProject = createRequire(import.meta.url);
const fromShadcn = createRequire(fromProject.resolve('shadcn'));
const fromGlob = createRequire(fromShadcn.resolve('fast-glob'));
const fromMicromatch = createRequire(fromGlob.resolve('micromatch'));
const braces = fromMicromatch('braces') as {
  expand: (pattern: string) => string[];
  compile: (pattern: string) => string;
};

describe('Installed braces depth mitigation', () => {
  it('preserves ordinary source glob expansion', () => {
    expect(braces.expand('src/{app,lib}/**/*.{ts,tsx}')).toEqual([
      'src/app/**/*.ts',
      'src/app/**/*.tsx',
      'src/lib/**/*.ts',
      'src/lib/**/*.tsx',
    ]);
  });

  it('rejects deeply nested brace patterns before recursive walkers exhaust the stack', () => {
    const attack = `${'{'.repeat(4_000)}a,b${'}'.repeat(4_000)}`;
    expect(() => braces.compile(attack)).toThrow('Brace pattern nesting exceeds 128 levels');
    expect(() => braces.expand(attack)).toThrow('Brace pattern nesting exceeds 128 levels');
  });
});
