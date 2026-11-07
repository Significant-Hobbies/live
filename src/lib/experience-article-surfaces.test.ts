import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const { article } = vi.hoisted(() => ({
  article: {
    experienceSlug: 'build-a-folding-paper-peepshow',
    slug: 'build-a-folding-paper-peepshow',
    title: 'Folding paper peepshows: plan the view before the folds',
    description:
      'A practical guide to choosing a scene, testing sightlines and building a folding paper peepshow, with construction references and a small first attempt.',
    intent: 'Internal editorial intent belongs to the authoring record, not the reader interface.',
    sections: [
      {
        heading: 'Choose the view through the opening',
        paragraphs: [
          'Make a scene with a foreground, middle distance and background. Test the sightline before adding the folds.',
        ],
      },
      {
        heading: 'Prototype the folding structure',
        paragraphs: ['Use temporary folds to check spacing before gluing the panels.'],
      },
    ],
    sources: [
      {
        title: 'Museum construction reference',
        url: 'https://example.org/construction',
        publisher: 'Museum example',
        purpose: 'The reference supports the folding structure and the order of construction.',
      },
    ],
    relatedExperienceSlugs: [
      'animate-a-strip-in-a-homemade-zoetrope',
      'build-a-hand-cranked-cardboard-automaton',
    ],
    publishedAt: '2026-11-08',
    updatedAt: '2026-11-09',
  },
}));
vi.mock('~/content/experience-articles', () => ({ EXPERIENCE_ARTICLES: [article] }));
vi.mock('@opennextjs/cloudflare', () => ({ getCloudflareContext: () => ({ env: {} }) }));

import BlogPage from '~/components/public-pages/blog-detail';
import { renderExperienceContent } from '~/components/public-pages/experience-detail';
import { getEditorialArticle, editorialArticles } from './editorial-content';
import { BUNDLED_PUBLIC_CATALOG } from './catalog-model';
import { getPublicExperience } from './mcp-public';
import { buildArticleJsonLd, buildArticleMetadata } from './editorial-seo';
import { renderPublicRouteMarkdown } from './public-route-markdown';
import { publicStaticSitemap } from './public-sitemap';
import { generateMetadata as blogIndexMetadata } from '~/components/public-pages/blog-index';

describe('experience articles on public surfaces', () => {
  it('renders original article content, source links and a working route back to the experience', async () => {
    const html = renderToStaticMarkup(
      await BlogPage({ params: Promise.resolve({ slug: article.slug }) })
    );
    const markdown = await renderPublicRouteMarkdown(`/blog/${article.slug}`);
    for (const text of [
      article.title,
      article.sections[0].paragraphs[0],
      article.sources[0].url,
      'Sources and further reading',
      'View the experience plan',
    ]) {
      expect(html).toContain(text);
      expect(markdown).toContain(text);
    }
    expect(html).toContain(`href="/experiences/${article.experienceSlug}"`);
    expect(html).toContain('href="#section-0"');
    expect(html).not.toContain(article.intent);
    expect(markdown).not.toContain(article.intent);
  });

  it('links the experience and AI detail to the same dedicated article', async () => {
    const html = renderToStaticMarkup(
      await renderExperienceContent(
        Promise.resolve({ slug: article.experienceSlug }),
        false,
        BUNDLED_PUBLIC_CATALOG
      )
    );
    expect(html).toContain(`href="/blog/${article.slug}"`);
    expect(html).toContain(article.description);
    expect(getPublicExperience(article.experienceSlug)?.article).toEqual({
      title: article.title,
      description: article.description,
      canonicalUrl: `https://significanthobbies.com/blog/${article.slug}`,
    });
  });

  it('uses the same visible dates, canonical and primary references in metadata and the sitemap', () => {
    const post = getEditorialArticle(article.slug)!;
    const metadata = buildArticleMetadata(post);
    const schema = buildArticleJsonLd(post);
    expect(metadata.alternates?.canonical).toBe(
      `https://significanthobbies.com/blog/${article.slug}`
    );
    expect(metadata.openGraph).toMatchObject({ type: 'article', title: article.title });
    expect(schema).toMatchObject({
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      citation: [article.sources[0].url],
      about: { url: `https://significanthobbies.com/experiences/${article.experienceSlug}` },
    });
    expect(
      publicStaticSitemap().find((item) => item.url === metadata.alternates?.canonical)
        ?.lastModified
    ).toBe(article.updatedAt);
  });

  it('keeps paginated HTML metadata and Markdown discovery on the selected page', async () => {
    const metadata = await blogIndexMetadata({ searchParams: Promise.resolve({ page: '2' }) });
    expect(metadata.alternates?.canonical).toBe('https://significanthobbies.com/blog?page=2');
    const markdown = await renderPublicRouteMarkdown('/blog?page=2');
    expect(markdown).toContain(editorialArticles[18].title);
    expect(markdown).not.toContain(article.title);
    const search = await blogIndexMetadata({
      searchParams: Promise.resolve({ q: 'paper peepshow' }),
    });
    expect(search.robots).toMatchObject({ index: false, follow: true });
    expect(await renderPublicRouteMarkdown('/bucket-list?article=anything')).toBeNull();
  });
});
