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
import {
  type ExperienceEntry,
  findExperience,
  firstSteps,
  PAGED_EXPERIENCES,
  relatedExperiences,
} from '~/lib/experiences';
import { safeDecodeURIComponent } from '~/lib/slug';
import { SITE_URL } from '~/lib/site-metadata';

/** Preserve catalog URLs; detailed editorial plans can be added independently. */
export async function generateStaticParams() {
  return PAGED_EXPERIENCES.map((e) => ({ slug: e.slug }));
}

function resolve(raw: string): ExperienceEntry | undefined {
  const slug = safeDecodeURIComponent(raw);
  if (!slug) return undefined;
  const entry = findExperience(slug);
  // Findable in the corpus is not the same as having a page.
  return entry?.description ? entry : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const entry = resolve((await params).slug);
  if (!entry) return { title: 'Not found — SignificantHobbies' };
  const guide = EXPERIENCE_GUIDES[entry.slug];
  return experienceMetadata(
    guide?.title ?? `${entry.title} | Bucket list idea`,
    guide?.summary ?? entry.description ?? '',
    `/experiences/${entry.slug}`
  );
}

export default async function ExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerAuthSession();
  const entry = resolve((await params).slug);
  if (!entry) notFound();

  const guide = EXPERIENCE_GUIDES[entry.slug];
  const chain = guide?.steps ?? firstSteps(entry);
  const related = relatedExperiences(entry, 12)
    .sort(
      (a, b) =>
        Number(Boolean(EXPERIENCE_GUIDES[b.slug])) - Number(Boolean(EXPERIENCE_GUIDES[a.slug]))
    )
    .slice(0, 6);
  const collections = collectionsForExperience(entry.slug);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          url: `${SITE_URL}/experiences/${entry.slug}`,
          name: entry.title,
          description: guide?.summary ?? entry.description,
          ...(guide ? { dateModified: EXPERIENCE_CONTENT_UPDATED } : {}),
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
        {entry.emoji} {entry.title}
      </h1>

      <p className="mt-5 max-w-[62ch] text-lg text-foreground/80" style={{ lineHeight: 1.6 }}>
        {guide?.summary ?? entry.description}
      </p>

      <p className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <Tag>{entry.category}</Tag>
        {entry.region ? <Tag>{entry.region.replace(/-/g, ' ')}</Tag> : null}
        {entry.horizon ? <Tag>{entry.horizon.replace('-', ' ')}</Tag> : null}
      </p>

      <div className="mt-8">
        <AddToMyListButton
          title={entry.title}
          description={guide?.summary ?? entry.description}
          category={entry.category}
          sourceSlug={entry.slug}
          variant="primary"
          mode={session?.user ? 'account' : 'local'}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          {session?.user
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

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-card px-2.5 py-1 capitalize">
      {children}
    </span>
  );
}
