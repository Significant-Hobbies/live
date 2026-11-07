import type { ContentBlock } from './blog-posts';
import type { ExperienceCategory } from './experiences';

export type ExperienceArticle = {
  experienceSlug: string;
  slug: string;
  title: string;
  description: string;
  intent: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  sources: { title: string; url: string; publisher: string; purpose: string }[];
  relatedExperienceSlugs: string[];
  publishedAt: string;
  updatedAt: string;
};

export type ExperienceArticleTarget = {
  experienceSlug: string;
  articleSlug: string;
  title: string;
  category: ExperienceCategory;
  emoji: string;
};

export function experienceArticleBlocks(article: ExperienceArticle): ContentBlock[] {
  return article.sections.flatMap((section) => [
    { type: 'heading' as const, level: 2 as const, text: section.heading },
    ...section.paragraphs.map((text) => ({ type: 'paragraph' as const, text })),
    ...(section.bullets?.length ? [{ type: 'list' as const, items: section.bullets }] : []),
  ]);
}

export function articleWordCount(article: ExperienceArticle) {
  return article.sections
    .flatMap((section) => [...section.paragraphs, ...(section.bullets ?? [])])
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
