import { EXPERIENCE_ARTICLES } from '~/content/experience-articles';
import targetsJson from '~/content/experience-article-targets.json';
import type { ExperienceArticle, ExperienceArticleTarget } from './experience-article-model';

const EXPERIENCE_ARTICLE_TARGETS = targetsJson as ExperienceArticleTarget[];
const targets = new Map(
  EXPERIENCE_ARTICLE_TARGETS.map((target) => [target.experienceSlug, target])
);
const byExperience = new Map(
  EXPERIENCE_ARTICLES.map((article) => [article.experienceSlug, article])
);

export function experienceArticleTarget(experienceSlug: string) {
  return targets.get(experienceSlug);
}

export function experienceArticle(experienceSlug: string) {
  return byExperience.get(experienceSlug);
}

export function experienceArticlePath(article: Pick<ExperienceArticle, 'slug'>) {
  return `/blog/${article.slug}`;
}

export { EXPERIENCE_ARTICLES };
