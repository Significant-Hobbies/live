// @vitest-environment node

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const importer = fileURLToPath(
  new URL('../../scripts/import-experience-articles.mjs', import.meta.url)
);
const checker = fileURLToPath(
  new URL('../../scripts/check-experience-articles.mjs', import.meta.url)
);
const digest = (bytes: string) => createHash('sha256').update(bytes).digest('hex');

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'live-article-publication-'));
  const write = (path: string, value: unknown) => {
    const file = join(root, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, `${JSON.stringify(value)}\n`);
  };
  const targets = Array.from({ length: 700 }, (_, index) => ({
    experienceSlug: `activity-${index}`,
    articleSlug: `activity-${index}-guide`,
    title: `Activity ${index}`,
    category: 'creative',
    emoji: '🎨',
  }));
  write('src/content/experience-article-targets.json', targets);
  const reviews = targets.map((target, index) => {
    const article = {
      experienceSlug: target.experienceSlug,
      slug: target.articleSlug,
      title: `A specific first project for activity number ${index}`,
      description:
        'Choose a manageable first project, compare the practical options, prepare the materials and review a finished attempt before choosing your next step.',
      intent: 'Answers a specific beginner question with a complete project and practical choices.',
      sections: Array.from({ length: 4 }, (_, section) => ({
        heading: `Project phase ${section + 1}`,
        paragraphs: [
          `Fixture ${index} section ${section}: ${'original project guidance '.repeat(40)}`,
        ],
      })),
      sources: [
        {
          title: 'Primary reference',
          url: 'https://www.nasa.gov/',
          publisher: 'NASA',
          purpose: 'A primary reference used only as a synthetic test fixture.',
        },
      ],
      relatedExperienceSlugs: [
        targets[(index + 1) % 700].experienceSlug,
        targets[(index + 2) % 700].experienceSlug,
      ],
    };
    const path = `drafts/writer-a/articles/${target.experienceSlug}.json`;
    write(path, article);
    return {
      experienceSlug: target.experienceSlug,
      sha256: digest(readFileSync(join(root, path), 'utf8')),
      verdict: 'pass',
    };
  });
  write('drafts/reviews/a001.json', {
    reviewer: 'Fixture independent reviewer',
    checkedAt: '2026-11-08',
    articles: reviews,
  });
  const bin = join(root, 'bin');
  mkdirSync(bin);
  // Real formatting is exercised by the native import; isolate only that process here.
  writeFileSync(
    join(bin, 'pnpm'),
    `#!${process.execPath}\nprocess.exit(process.argv.slice(2, 5).join(' ') === 'exec biome format' ? 0 : 2);\n`,
    { mode: 0o700 }
  );
  const run = (script: string, args: string[] = []) =>
    spawnSync(process.execPath, [script, ...args], {
      cwd: root,
      encoding: 'utf8',
      env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
    });
  const publish = () =>
    run(importer, ['--draft-root', join(root, 'drafts'), '--publish-date', '2026-11-08']);
  const cleanup = (directory = root) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) cleanup(path);
      else unlinkSync(path);
    }
    rmdirSync(directory);
  };
  return { root, write, run, publish, cleanup, reviews };
}

describe('experience article publication boundary', () => {
  it('publishes a complete reviewed catalog and detects edited bytes or a preview manifest', () => {
    const f = fixture();
    try {
      f.write('drafts/reviews/a002.json', {
        reviewer: 'Fixture correction reviewer',
        checkedAt: '2026-11-08T08:00:00Z',
        articles: [
          {
            ...f.reviews[0],
            reviewedAt: '2026-11-08T08:40:00Z',
            recheckedAt: '2026-11-08T08:30:00Z',
          },
          { ...f.reviews[1], recheckedAt: '2026-11-08T08:45:00Z' },
        ],
      });
      expect(f.publish().status).toBe(0);
      expect(f.run(checker).status).toBe(0);
      const records = JSON.parse(
        readFileSync(join(f.root, 'src/content/experience-articles/publication.json'), 'utf8')
      ).articles;
      expect(records[0].reviewedAt).toBe('2026-11-08T08:40:00Z');
      expect(records[1].reviewedAt).toBe('2026-11-08T08:45:00Z');
      expect(records[2].reviewedAt).toBe('2026-11-08');
      const file = join(f.root, 'src/content/experience-articles/activity-0.json');
      const original = readFileSync(file, 'utf8');
      writeFileSync(file, original.replace('A specific first project', 'An edited first project'));
      const changed = f.run(checker);
      expect(changed.status).toBe(1);
      expect(changed.stdout).toContain('lack a matching passing editorial review');
      writeFileSync(file, original);
      const path = 'src/content/experience-articles/publication.json';
      const manifest = JSON.parse(readFileSync(join(f.root, path), 'utf8'));
      f.write(path, { ...manifest, status: 'preview' });
      const preview = f.run(checker);
      expect(preview.status).toBe(1);
      expect(preview.stdout).toContain('Publication is still a preview');
    } finally {
      f.cleanup();
    }
  });

  it('rejects a later revision decision and stale draft review before changing published files', () => {
    const f = fixture();
    try {
      expect(f.publish().status).toBe(0);
      const path = join(f.root, 'src/content/experience-articles/publication.json');
      const original = readFileSync(path, 'utf8');
      f.write('drafts/reviews/a002.json', {
        reviewer: 'Fixture reviewer',
        checkedAt: '2026-11-08',
        articles: [{ ...f.reviews[0], verdict: 'revise' }],
      });
      expect(f.publish().stderr).toContain('Missing: 1');
      expect(readFileSync(path, 'utf8')).toBe(original);
      f.write('drafts/reviews/a002.json', { articles: [] });
      const draft = join(f.root, 'drafts/writer-a/articles/activity-0.json');
      writeFileSync(draft, `${readFileSync(draft, 'utf8')} `);
      expect(f.publish().stderr).toContain('Missing: 1');
      expect(readFileSync(path, 'utf8')).toBe(original);
      unlinkSync(draft);
      expect(f.publish().stderr).toContain('Missing: 1');
      expect(readFileSync(path, 'utf8')).toBe(original);
    } finally {
      f.cleanup();
    }
  });
});
