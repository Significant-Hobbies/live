import Link from 'next/link';
import { AddToMyListButton } from './add-to-my-list-button';
import type { ExperienceArticle } from '~/lib/experience-article-model';
import { experienceArticleTarget } from '~/lib/experience-articles';

export function ExperienceArticleAction({ article }: { article: ExperienceArticle }) {
  const target = experienceArticleTarget(article.experienceSlug);
  if (!target) return null;
  return (
    <section
      className="mb-10 rounded-2xl border border-border bg-card/40 p-6"
      aria-label="Plan this experience"
    >
      <p className="mb-2 font-medium text-foreground">{target.title}</p>
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
        Keep the idea in your list, then add your own steps, notes, and updates as it takes shape.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <AddToMyListButton
          title={target.title}
          category={target.category}
          sourceSlug={target.experienceSlug}
          variant="primary"
        />
        <Link
          href={`/experiences/${target.experienceSlug}`}
          className="text-sm text-foreground underline underline-offset-4"
        >
          View the experience plan
        </Link>
      </div>
    </section>
  );
}

export function ExperienceArticleReferences({ article }: { article: ExperienceArticle }) {
  const related = article.relatedExperienceSlugs.flatMap((slug) => {
    const target = experienceArticleTarget(slug);
    return target ? [target] : [];
  });
  return (
    <div className="mt-12 space-y-10">
      <section aria-labelledby="article-sources">
        <h2 id="article-sources" className="mb-4 text-2xl font-bold text-foreground">
          Sources and further reading
        </h2>
        <ul className="space-y-5">
          {article.sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4"
              >
                {source.title}
              </a>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {source.publisher} · {source.purpose}
              </p>
            </li>
          ))}
        </ul>
      </section>
      {related.length > 0 ? (
        <section aria-labelledby="article-experiences">
          <h2 id="article-experiences" className="mb-4 text-2xl font-bold text-foreground">
            Keep exploring
          </h2>
          <ul className="divide-y divide-border border-y border-border">
            {related.map((target) => (
              <li key={target.experienceSlug}>
                <Link
                  href={`/experiences/${target.experienceSlug}`}
                  className="flex gap-3 py-4 text-foreground hover:underline"
                >
                  <span aria-hidden="true">{target.emoji}</span>
                  {target.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
