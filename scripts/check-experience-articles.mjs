import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { basename, resolve, join } from 'node:path';

const root = process.cwd();
const draftsIndex = process.argv.indexOf('--drafts');
const draftRoot = draftsIndex >= 0 ? resolve(process.argv[draftsIndex + 1]) : null;
const targets = JSON.parse(
  readFileSync(join(root, 'src/content/experience-article-targets.json'), 'utf8')
);
const targetMap = new Map(targets.map((target) => [target.experienceSlug, target]));
const folders = draftRoot
  ? ['a', 'b', 'c'].map((name) => join(draftRoot, `writer-${name}`, 'articles'))
  : [join(root, 'src/content/experience-articles')];
const files = folders.flatMap((folder) =>
  readdirSync(folder, { withFileTypes: true })
    .filter(
      (file) => file.isFile() && file.name.endsWith('.json') && file.name !== 'publication.json'
    )
    .map((file) => join(folder, file.name))
);
const issues = [];
const seenSlugs = new Set();
const seenTitles = new Set();
const seenExperiences = new Set();
const paragraphs = new Map();
const articleDigests = new Map();
const add = (slug, message) => issues.push({ experienceSlug: slug, message });
const normalize = (value) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

for (const file of files) {
  const bytes = readFileSync(file);
  let article;
  try {
    article = JSON.parse(bytes);
  } catch {
    add(file, 'Invalid JSON');
    continue;
  }
  const slug = article.experienceSlug;
  const target = targetMap.get(slug);
  if (basename(file) !== `${slug}.json`)
    add(slug, 'Article filename must match its canonical experience slug');
  articleDigests.set(slug, createHash('sha256').update(bytes).digest('hex'));
  if (!target || article.slug !== target.articleSlug)
    add(slug, 'Canonical experience/article mapping does not match the public inventory');
  if (seenExperiences.has(slug) || seenSlugs.has(article.slug))
    add(slug, 'Duplicate experience or article slug');
  seenExperiences.add(slug);
  seenSlugs.add(article.slug);
  if (typeof article.title === 'string') {
    const title = normalize(article.title);
    if (seenTitles.has(title)) add(slug, 'Duplicate article headline');
    seenTitles.add(title);
  }
  if (
    typeof article.title !== 'string' ||
    article.title.trim().length < 20 ||
    normalize(article.title) === normalize(target?.title ?? '')
  )
    add(slug, 'Article needs its own descriptive headline');
  if (
    typeof article.description !== 'string' ||
    article.description.length < 120 ||
    article.description.length > 170
  )
    add(slug, 'Search description must be 120–170 characters');
  if (typeof article.intent !== 'string' || article.intent.length < 40)
    add(slug, 'Missing substantive reader intent');
  if (
    !Array.isArray(article.sections) ||
    article.sections.length < 4 ||
    article.sections.length > 7
  ) {
    add(slug, 'Expected four to seven substantive sections');
    continue;
  }
  let words = 0;
  const headings = new Set();
  const ownParagraphs = [];
  for (const section of article.sections) {
    if (
      typeof section.heading !== 'string' ||
      section.heading.length < 8 ||
      headings.has(normalize(section.heading))
    )
      add(slug, 'Missing or repeated descriptive section heading');
    headings.add(normalize(section.heading ?? ''));
    if (!Array.isArray(section.paragraphs) || section.paragraphs.length === 0) {
      add(slug, 'Section has no prose');
      continue;
    }
    for (const paragraph of [...section.paragraphs, ...(section.bullets ?? [])]) {
      if (typeof paragraph !== 'string' || paragraph.trim().length < 12) {
        add(slug, 'Empty or malformed prose');
        continue;
      }
      words += paragraph.trim().split(/\s+/).length;
      if (
        /\b(?:assignment brief|this assignment|this draft|(?:in|during) (?:this|our) (?:source review|research|review)|topic-intents\.json|writer-contract\.md|source-checks\.jsonl|articleSlug|experienceSlug|staged catalog|canonical (?:seed|goal|experience))\b/i.test(
          paragraph
        )
      )
        add(slug, 'Internal authoring instructions leaked into article prose');
      const normalized = normalize(paragraph);
      if (normalized.split(' ').length >= 25) {
        if (
          ownParagraphs.some(
            (previous) => previous.includes(normalized) || normalized.includes(previous)
          )
        )
          add(slug, 'Repeated long passage within this article');
        ownParagraphs.push(normalized);
      }
      const previous = paragraphs.get(normalized);
      if (normalized.split(' ').length >= 25 && previous)
        add(slug, `Repeated long paragraph also in ${previous}`);
      paragraphs.set(normalized, slug);
    }
  }
  if (words < 450) add(slug, `Article has only ${words} body words`);
  if (!Array.isArray(article.sources) || article.sources.length === 0)
    add(slug, 'Missing primary sources');
  const sourceUrls = new Set();
  for (const source of article.sources ?? []) {
    try {
      const url = new URL(source.url);
      if (url.protocol !== 'https:' || /(^|\.)example\.(com|org|net)$|localhost/.test(url.hostname))
        add(slug, 'Invalid source destination');
    } catch {
      add(slug, 'Malformed source URL');
    }
    if (
      !source.title?.trim() ||
      !source.publisher?.trim() ||
      (source.purpose?.trim().length ?? 0) < 15
    )
      add(slug, 'Source needs a title, publisher and specific purpose');
    if (sourceUrls.has(source.url)) add(slug, 'Duplicate source URL');
    sourceUrls.add(source.url);
  }
  if (
    !Array.isArray(article.relatedExperienceSlugs) ||
    article.relatedExperienceSlugs.length < 2 ||
    article.relatedExperienceSlugs.length > 4
  )
    add(slug, 'Expected two to four relevant related experiences');
  const related = new Set();
  for (const other of article.relatedExperienceSlugs ?? []) {
    if (!targetMap.has(other) || other === slug || related.has(other))
      add(slug, `Invalid, duplicate or self-related experience: ${other}`);
    related.add(other);
  }
  if (!draftRoot) {
    for (const date of [article.publishedAt, article.updatedAt])
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(date ?? '') ||
        !Number.isFinite(Date.parse(date)) ||
        new Date(date).toISOString().slice(0, 10) !== date
      )
        add(slug, 'Missing valid editorial date');
    if (article.updatedAt < article.publishedAt) add(slug, 'Update date precedes publication');
  }
}

if (!draftRoot) {
  if (targets.length !== 700 || seenExperiences.size !== targets.length)
    add('catalog', `Expected exactly ${targets.length} articles, found ${seenExperiences.size}`);
  const publication = JSON.parse(
    readFileSync(join(root, 'src/content/experience-articles/publication.json'), 'utf8')
  );
  if (publication.status !== 'reviewed') add('catalog', 'Publication is still a preview');
  if (publication.articleCount !== files.length || publication.expectedCount !== targets.length)
    add('catalog', 'Publication counts do not match the article inventory');
  const reviews = new Map(publication.articles.map((article) => [article.experienceSlug, article]));
  if (reviews.size !== files.length || publication.articles.length !== files.length)
    add('catalog', 'Publication review inventory is incomplete or duplicated');
  for (const [slug, digest] of articleDigests) {
    const review = reviews.get(slug);
    if (
      !review ||
      review.articleSha256 !== digest ||
      review.verdict !== 'pass' ||
      review.articleSlug !== targetMap.get(slug)?.articleSlug ||
      !review.reviewer ||
      !review.reviewFile ||
      !review.reviewedAt ||
      !/^[a-f0-9]{64}$/.test(review.draftSha256 ?? '')
    )
      add(slug, 'Article bytes lack a matching passing editorial review');
  }
}
console.log(
  JSON.stringify(
    {
      mode: draftRoot ? 'drafts' : 'publication',
      articles: seenExperiences.size,
      expected: targets.length,
      issues,
    },
    null,
    2
  )
);
process.exitCode = issues.length ? 1 : 0;
