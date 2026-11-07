import type { Metadata } from 'next';

import type { EditorialArticle } from '~/lib/editorial-content';
import { DEFAULT_SOCIAL_IMAGE, SITE_URL } from '~/lib/site-metadata';
import { experienceArticleTarget } from './experience-articles';
import { experienceImage } from './experience-images';
import { articleWordCount } from './experience-article-model';

export function articleCanonicalUrl(article: EditorialArticle): string {
  return `${SITE_URL}/blog/${article.slug}`;
}

export function buildArticleMetadata(article: EditorialArticle): Metadata {
  const canonical = articleCanonicalUrl(article);
  const target = article.experience
    ? experienceArticleTarget(article.experience.experienceSlug)
    : undefined;
  const image = target ? experienceImage(target.title) : null;
  const thumbnail = article.package?.youtube?.thumbnailUrl;
  const socialImage = image ? `${SITE_URL}${image.src}` : (thumbnail ?? DEFAULT_SOCIAL_IMAGE);

  return {
    title: { absolute: article.title },
    description: article.excerpt,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title: article.title,
      description: article.excerpt,
      images: [{ url: socialImage }],
      ...(thumbnail ? { videos: [{ url: article.package!.youtube!.url }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [socialImage],
    },
  };
}

export function buildArticleJsonLd(article: EditorialArticle): Record<string, unknown> {
  const target = article.experience
    ? experienceArticleTarget(article.experience.experienceSlug)
    : undefined;
  const image = target ? experienceImage(target.title) : null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    ...(article.experience
      ? {
          dateModified: article.experience.updatedAt,
          wordCount: articleWordCount(article.experience),
          inLanguage: 'en',
          ...(image ? { image: [`${SITE_URL}${image.src}`] } : {}),
          about: {
            '@type': 'Thing',
            name: experienceArticleTarget(article.experience.experienceSlug)?.title,
            url: `${SITE_URL}/experiences/${article.experience.experienceSlug}`,
          },
          citation: article.experience.sources.map((source) => source.url),
        }
      : {}),
    author: {
      '@type': 'Organization',
      name: 'SignificantHobbies',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SignificantHobbies',
    },
    mainEntityOfPage: articleCanonicalUrl(article),
  };
}

export function buildVideoJsonLd(article: EditorialArticle): Record<string, unknown> | null {
  const video = article.package?.youtube;
  if (!video) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: article.title,
    description: article.excerpt,
    uploadDate: video.publishedAt,
    contentUrl: video.url,
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.videoId}`,
    ...(video.thumbnailUrl ? { thumbnailUrl: video.thumbnailUrl } : {}),
    ...(video.chapters?.length
      ? {
          hasPart: video.chapters.map((chapter, index, chapters) => ({
            '@type': 'Clip',
            name: chapter.title,
            startOffset: chapter.startSeconds,
            ...(chapters[index + 1] ? { endOffset: chapters[index + 1].startSeconds } : {}),
            url: `${video.url}&t=${chapter.startSeconds}`,
          })),
        }
      : {}),
  };
}
