import { withPublicMetadata } from '~/lib/public-metadata';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getServerAuthSession } from '~/server/auth';
import { notFound } from 'next/navigation';

import { AddToMyListButton } from '~/components/add-to-my-list-button';
import { JsonLd } from '~/components/json-ld';
import { ExperienceCollectionLinks } from '~/components/experience-collection-links';
import { collectionsForExperience } from '~/lib/experience-collections';
import { EXPERIENCE_GUIDES, EXPERIENCE_CONTENT_UPDATED } from '~/lib/experience-guides';
import { experienceBreadcrumbs, experienceMetadata } from '~/lib/experience-seo';
import { findExperience, firstSteps, PAGED_EXPERIENCES } from '~/lib/experiences';
import { publicExperienceCatalog } from '~/server/experience-catalog';
import { relatedPublicExperiences, type PublicCatalog } from '~/lib/catalog-model';
import { safeDecodeURIComponent } from '~/lib/slug';
import { SITE_URL } from '~/lib/site-metadata';
import { ExperiencePhoto } from '~/components/experience-photo';

/** Preserve catalog URLs; detailed editorial plans can be added independently. */
export async function generateStaticParams() {
  return PAGED_EXPERIENCES.map((e) => ({ slug: e.slug }));
}

function resolve(raw: string, catalog: PublicCatalog) {
  const slug = safeDecodeURIComponent(raw);
  return slug ? catalog.bySlug.get(slug) : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const entry = resolve((await params).slug, await publicExperienceCatalog());
  if (!entry) return withPublicMetadata({ title: 'Not found' });
  const guide = EXPERIENCE_GUIDES[entry.editorialSlug ?? ''];
  const authored = findExperience(entry.editorialSlug ?? '');
  return withPublicMetadata({
    ...experienceMetadata(
      (authored?.title === entry.title ? guide?.title : undefined) ??
        `${entry.title} | Bucket list idea`,
      (authored?.description === entry.description ? guide?.summary : undefined) ??
        entry.description ??
        '',
      `/experiences/${entry.slug}`
    ),
    ...(!entry.curated ? { robots: { index: false, follow: true } } : {}),
  });
}

export default async function ExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerAuthSession();
  return renderExperienceContent(params, !!session?.user);
}

export async function renderExperienceContent(
  params: Promise<{ slug: string }>,
  isLoggedIn = false,
  suppliedCatalog?: PublicCatalog
) {
  const catalog = suppliedCatalog ?? (await publicExperienceCatalog());
  const entry = resolve((await params).slug, catalog);
  if (!entry) notFound();

  const guide = EXPERIENCE_GUIDES[entry.editorialSlug ?? ''];
  const chain = guide?.steps ?? (entry.curated ? firstSteps(entry) : []);
  const related = relatedPublicExperiences(catalog, entry);
  const collections = collectionsForExperience(entry.editorialSlug ?? entry.slug);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          url: `${SITE_URL}/experiences/${entry.slug}`,
          name: entry.title,
          description: entry.description ?? guide?.summary,
          ...(guide ? { dateModified: guide.updatedAt ?? EXPERIENCE_CONTENT_UPDATED } : {}),
        }}
      />
      <JsonLd
        data={experienceBreadcrumbs([
          { name: 'Catalog', path: '/experiences' },
          { name: entry.title, path: `/experiences/${entry.slug}` },
        ])}
      />

      <nav className="text-sm text-muted-foreground">
        <Link href="/experiences" className="hover:text-foreground">
          ← Everything you could do
        </Link>
      </nav>

      <h1
        className="mt-6 font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl"
        style={{ textWrap: 'balance', lineHeight: 1.12 }}
      >
        {entry.title}
      </h1>

      <p className="mt-5 max-w-[62ch] text-lg text-muted-foreground" style={{ lineHeight: 1.6 }}>
        {entry.description ?? guide?.summary}
      </p>

      <p className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <ExperienceTag>{entry.category}</ExperienceTag>
        {entry.region ? <ExperienceTag>{entry.region.replace(/-/g, ' ')}</ExperienceTag> : null}
        {entry.horizon ? <ExperienceTag>{entry.horizon.replace('-', ' ')}</ExperienceTag> : null}
      </p>

      <ExperiencePhoto
        title={entry.title}
        category={entry.category}
        eager
        sizes="(min-width: 768px) 704px, 100vw"
        className="mt-7 aspect-[2/1] w-full rounded-2xl"
      />

      <div className="mt-8">
        <AddToMyListButton
          title={entry.title}
          description={entry.description ?? guide?.summary}
          category={entry.category}
          sourceSlug={entry.slug}
          variant="primary"
          mode={isLoggedIn ? 'account' : 'local'}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          {isLoggedIn
            ? 'Saves privately to your account.'
            : 'Saves privately on this device. No account needed.'}
        </p>
      </div>

      {guide ? (
        <>
          <section className="mt-14" aria-labelledby="planning-heading">
            <h2 id="planning-heading" className="font-serif text-2xl text-foreground">
              Plan the experience
            </h2>
            <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-muted-foreground">
              {guide.summary}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Planning estimates, not a price quote or a deadline. Your version may vary.
            </p>
            <dl className="mt-5 space-y-4 text-base">
              {[
                ['Time', guide.time],
                ['Cost', guide.cost],
                ['Where', guide.place],
              ].map(([label, text]) => (
                <div key={label}>
                  <dt className="font-medium text-foreground">{label}</dt>
                  <dd className="mt-1 max-w-[62ch] text-muted-foreground">{text}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="mt-14">
            <h2 className="font-serif text-2xl text-foreground">Before you start</h2>
            <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-muted-foreground">
              {guide.preparation}
            </p>
          </section>
        </>
      ) : null}

      {entry.famous ? (
        <p className="mt-6 max-w-[62ch] text-base text-muted-foreground">
          <Link
            href={`/bucket-lists/${entry.famous.slug}`}
            prefetch={false}
            className="font-medium text-foreground underline underline-offset-4"
          >
            {entry.famous.name}
          </Link>{' '}
          {entry.famous.note}.
        </p>
      ) : null}

      {chain.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-serif text-2xl text-foreground">How you would actually start</h2>
          <ol className="mt-5 space-y-4">
            {chain.map((step) => (
              <li key={step.title} className="border-border border-l-2 pl-4">
                <p className="font-medium text-foreground">{step.title}</p>
                <p className="mt-1 max-w-[62ch] text-base text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {!entry.curated ? (
        <p className="mt-10 text-sm text-muted-foreground">
          A community idea. A detailed editorial plan has not been added yet.
        </p>
      ) : null}

      {guide ? (
        <section className="mt-14">
          <h2 className="font-serif text-2xl text-foreground">What counts as done</h2>
          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-muted-foreground">
            {guide.completion}
          </p>
          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-muted-foreground">
            {guide.tip}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            When you finish, mark it fulfilled in{' '}
            <Link href="/bucket-list" className="text-foreground underline underline-offset-4">
              My list
            </Link>
            . You can remember it in your{' '}
            <Link href="/journal" className="text-foreground underline underline-offset-4">
              weekly journal
            </Link>
            .
          </p>
        </section>
      ) : null}

      {guide?.resources?.length ? (
        <section className="mt-14" aria-labelledby="sources-heading">
          <h2 id="sources-heading" className="font-serif text-2xl text-foreground">
            Useful sources
          </h2>
          <ul className="mt-5 space-y-4">
            {guide.resources.map((resource) => (
              <li key={resource.url}>
                <a
                  href={resource.url}
                  className="text-foreground underline underline-offset-4"
                  rel="noopener noreferrer"
                >
                  {resource.title}
                </a>
                <p className="mt-1 text-sm text-muted-foreground">
                  {resource.publisher} · {resource.purpose}
                </p>
              </li>
            ))}
          </ul>
          {guide.updatedAt ? (
            <p className="mt-4 text-xs text-muted-foreground">Guide updated {guide.updatedAt}</p>
          ) : null}
        </section>
      ) : null}

      {collections.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-serif text-2xl text-foreground">Explore a collection</h2>
          <ExperienceCollectionLinks collections={collections} />
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-serif text-2xl text-foreground">If this appeals, so might these</h2>
          <ul className="mt-4 divide-y divide-border border-border border-t">
            {related.map((r) => (
              <li key={r.slug} className="py-3">
                {r.description ? (
                  <Link
                    href={`/experiences/${r.slug}`}
                    prefetch={false}
                    className="text-base text-foreground underline-offset-4 hover:underline"
                  >
                    {r.emoji} {r.title}
                  </Link>
                ) : (
                  <span className="text-base text-muted-foreground">
                    {r.emoji} {r.title}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

export function ExperienceTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-card px-2.5 py-1 capitalize">
      {children}
    </span>
  );
}
