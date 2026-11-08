import { type BlogPost, blogPosts, type ContentBlock } from '~/lib/blog-posts';
import {
  type ContentPackage,
  getPackagesForHobby,
  getPublishedPackages,
} from '~/lib/content-packages';
import { EXPERIENCE_ARTICLES, experienceArticleTarget } from './experience-articles';
import {
  articleWordCount,
  experienceArticleBlocks,
  type ExperienceArticle,
} from './experience-article-model';

export type EditorialArticle = BlogPost & {
  package?: ContentPackage;
  experience?: ExperienceArticle;
};

function experienceToArticle(article: ExperienceArticle): EditorialArticle {
  const target = experienceArticleTarget(article.experienceSlug);
  if (!target) throw new Error(`Unknown article experience: ${article.experienceSlug}`);
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.description,
    category: target.category[0].toUpperCase() + target.category.slice(1),
    emoji: target.emoji,
    readTime: Math.max(1, Math.ceil(articleWordCount(article) / 200)),
    publishedAt: article.publishedAt,
    content: experienceArticleBlocks(article),
    experience: article,
  };
}

function packageBlocks(pkg: ContentPackage): ContentBlock[] {
  return pkg.sections.flatMap((section) => [
    { type: 'heading' as const, level: 2 as const, text: section.heading },
    ...section.paragraphs.map((text) => ({ type: 'paragraph' as const, text })),
  ]);
}

function packageToArticle(pkg: ContentPackage): EditorialArticle {
  return {
    slug: pkg.slug,
    title: pkg.title,
    excerpt: pkg.excerpt,
    category: pkg.category,
    emoji: pkg.emoji,
    readTime: pkg.readTime,
    publishedAt: pkg.publishedAt!,
    content: packageBlocks(pkg),
    package: pkg,
  };
}

function assertNoDuplicateSlugs(articles: EditorialArticle[]): EditorialArticle[] {
  const seen = new Set<string>();
  for (const article of articles) {
    if (seen.has(article.slug)) throw new Error(`duplicate editorial slug: ${article.slug}`);
    seen.add(article.slug);
  }
  return articles;
}

export const editorialArticles = assertNoDuplicateSlugs([
  ...EXPERIENCE_ARTICLES.map(experienceToArticle),
  ...getPublishedPackages().map(packageToArticle),
  ...blogPosts,
]);

export function getEditorialArticle(slug: string): EditorialArticle | undefined {
  return editorialArticles.find((article) => article.slug === slug);
}

export function getEditorialArticlesForHobby(hobby: string): EditorialArticle[] {
  const packageArticles = getPackagesForHobby(hobby).map(packageToArticle);
  const search = hobby.toLowerCase();
  const topic = (value: string) => (value.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).join(' ');
  const legacy = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(search) ||
      post.excerpt.toLowerCase().includes(search) ||
      post.content.some(
        (block) => block.type === 'paragraph' && block.text.toLowerCase().includes(search)
      )
  );
  const experiences = editorialArticles.filter(
    (article) =>
      article.experience &&
      experienceArticleTarget(article.experience.experienceSlug)?.tags?.some(
        (tag) => topic(tag) === topic(hobby)
      )
  );
  return assertNoDuplicateSlugs([...packageArticles, ...legacy, ...experiences]).slice(0, 4);
}
