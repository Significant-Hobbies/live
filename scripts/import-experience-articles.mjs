import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

const args = process.argv.slice(2);
const value = (name) => {
  const index = args.indexOf(name);
  if (index < 0 || !args[index + 1]) throw new Error(`Missing ${name}`);
  return args[index + 1];
};
const root = process.cwd();
const draftsRoot = resolve(value('--draft-root'));
const reviewsRoot = join(draftsRoot, 'reviews');
const publishDate = value('--publish-date');
if (
  !/^\d{4}-\d{2}-\d{2}$/.test(publishDate) ||
  !Number.isFinite(Date.parse(publishDate)) ||
  new Date(publishDate).toISOString().slice(0, 10) !== publishDate
)
  throw new Error('Invalid publication date');
const preview = args.includes('--preview');
const targets = JSON.parse(
  readFileSync(join(root, 'src/content/experience-article-targets.json'), 'utf8')
);
const reviews = new Map();
for (const name of readdirSync(reviewsRoot)
  .filter((name) => name.endsWith('.json'))
  .sort()) {
  const document = JSON.parse(readFileSync(join(reviewsRoot, name), 'utf8'));
  for (const article of document.articles ?? []) {
    reviews.set(`${article.experienceSlug}:${article.sha256}`, {
      ...article,
      reviewFile: name,
      reviewer: document.reviewer,
      checkedAt:
        article.reviewedAt ?? article.recheckedAt ?? article.checkedAt ?? document.checkedAt,
    });
  }
}
const selected = [];
const missing = [];
for (const target of targets) {
  const files = ['a', 'b', 'c']
    .map((name) => join(draftsRoot, `writer-${name}`, 'articles', `${target.experienceSlug}.json`))
    .filter(existsSync);
  if (files.length > 1) throw new Error(`Duplicate draft ownership: ${target.experienceSlug}`);
  if (!files.length) {
    missing.push(target.experienceSlug);
    continue;
  }
  const bytes = readFileSync(files[0]);
  const digest = createHash('sha256').update(bytes).digest('hex');
  const review = reviews.get(`${target.experienceSlug}:${digest}`);
  if (review?.verdict !== 'pass' || !review.reviewer || !review.checkedAt) {
    missing.push(target.experienceSlug);
    continue;
  }
  const draft = JSON.parse(bytes);
  if (draft.experienceSlug !== target.experienceSlug || draft.slug !== target.articleSlug)
    throw new Error(`Wrong canonical mapping: ${target.experienceSlug}`);
  selected.push({ target, draft, digest, review });
}
if (!preview && (targets.length !== 700 || missing.length))
  throw new Error(
    `Publication requires all ${targets.length} articles with exact passing QA. Missing: ${missing.length}`
  );
const output = join(root, 'src/content/experience-articles');
const publicationFile = join(output, 'publication.json');
const previousPublication = existsSync(publicationFile)
  ? JSON.parse(readFileSync(publicationFile, 'utf8'))
  : null;
const publishedSlugs = new Set(
  previousPublication?.status === 'reviewed'
    ? previousPublication.articles.map((article) => article.experienceSlug)
    : []
);
mkdirSync(output, { recursive: true });
const groups = new Map();
const records = [];
const write = (file, text) => {
  mkdirSync(dirname(file), { recursive: true });
  if (!existsSync(file) || readFileSync(file, 'utf8') !== text) writeFileSync(file, text);
};
for (const { target, draft, digest, review } of selected) {
  const article = { ...draft, publishedAt: publishDate, updatedAt: publishDate };
  const file = join(output, `${target.experienceSlug}.json`);
  if (publishedSlugs.has(target.experienceSlug) && existsSync(file)) {
    const previous = JSON.parse(readFileSync(file, 'utf8'));
    article.publishedAt = previous.publishedAt ?? publishDate;
    const { publishedAt: _published, updatedAt: _updated, ...oldBody } = previous;
    if (JSON.stringify(oldBody) === JSON.stringify(draft))
      article.updatedAt = previous.updatedAt ?? publishDate;
  }
  const text = `${JSON.stringify(article, null, 2)}\n`;
  write(file, text);
  if (!groups.has(target.category)) groups.set(target.category, []);
  groups.get(target.category).push(basename(file));
  records.push({
    experienceSlug: target.experienceSlug,
    articleSlug: target.articleSlug,
    articleSha256: createHash('sha256').update(text).digest('hex'),
    draftSha256: digest,
    reviewFile: review.reviewFile,
    reviewer: review.reviewer,
    reviewedAt: review.checkedAt,
    verdict: 'pass',
  });
}
const index = [];
for (const [category, files] of [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  const constant = `${category.toUpperCase()}_ARTICLES`;
  const bindings = files.map((file) => ({
    file,
    name: `article_${basename(file, '.json').replace(/[^a-zA-Z0-9_]/g, '_')}`,
  }));
  if (new Set(bindings.map(({ name }) => name)).size !== bindings.length)
    throw new Error(`Duplicate article import binding in ${category}`);
  const imports = bindings.map(({ file, name }) => `import ${name} from './${file}';`).join('\n');
  const source = `import type { ExperienceArticle } from '~/lib/experience-article-model';\n${imports}\n\nexport const ${constant}: ExperienceArticle[] = [${bindings.map(({ name }) => name).join(', ')}];\n`;
  write(join(output, `${category}.ts`), source);
  index.push({ category, constant });
}
write(
  join(output, 'index.ts'),
  `import type { ExperienceArticle } from '~/lib/experience-article-model';\n${index.map(({ category, constant }) => `import { ${constant} } from './${category}';`).join('\n')}\n\nexport const EXPERIENCE_ARTICLES: ExperienceArticle[] = [${index.map(({ constant }) => `...${constant}`).join(', ')}];\n`
);
const formatted = spawnSync('pnpm', ['exec', 'biome', 'format', '--write', output], {
  cwd: root,
  encoding: 'utf8',
});
if (formatted.status !== 0)
  throw new Error(`Article formatting failed: ${formatted.stderr || formatted.stdout}`);
for (const record of records)
  record.articleSha256 = createHash('sha256')
    .update(readFileSync(join(output, `${record.experienceSlug}.json`)))
    .digest('hex');
write(
  join(output, 'publication.json'),
  `${JSON.stringify(
    {
      status: preview ? 'preview' : 'reviewed',
      articleCount: selected.length,
      expectedCount: targets.length,
      articles: records,
    },
    null,
    2
  )}\n`
);
console.log(
  JSON.stringify(
    {
      status: preview ? 'preview' : 'reviewed',
      articles: selected.length,
      missingExactPassingReview: missing.length,
    },
    null,
    2
  )
);
