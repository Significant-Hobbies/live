import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ExperienceCollectionLinks } from '~/components/experience-collection-links';
import { JsonLd } from '~/components/json-ld';
import { EXPERIENCE_COLLECTIONS, findExperienceCollection } from '~/lib/experience-collections';
import { EXPERIENCE_CONTENT_UPDATED } from '~/lib/experience-guides';
import { findExperience } from '~/lib/experiences';
import { experienceBreadcrumbs, experienceMetadata } from '~/lib/experience-seo';
import { SITE_URL } from '~/lib/site-metadata';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return EXPERIENCE_COLLECTIONS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const collection = findExperienceCollection((await params).slug);
  if (!collection) return { title: 'Collection not found' };
  return experienceMetadata(
    collection.title,
    collection.description,
    `/experiences/collections/${collection.slug}`
  );
}

export default async function ExperienceCollectionPage({ params }: Props) {
  const collection = findExperienceCollection((await params).slug);
  if (!collection) notFound();
  const path = `/experiences/collections/${collection.slug}`;
  const entries = collection.items.map((item) => {
    const entry = findExperience(item.slug);
    if (!entry?.description)
      throw new Error(`Collection references an unavailable experience: ${item.slug}`);
    return { ...item, entry };
  });

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: collection.title,
          description: collection.description,
          url: `${SITE_URL}${path}`,
          dateModified: EXPERIENCE_CONTENT_UPDATED,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: entries.length,
            itemListElement: entries.map(({ entry }, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: entry.title,
              url: `${SITE_URL}/experiences/${entry.slug}`,
            })),
          },
        }}
      />
      <JsonLd
        data={experienceBreadcrumbs([
          { name: 'Catalog', path: '/experiences' },
          { name: 'Collections', path: '/experiences/collections' },
          { name: collection.title, path },
        ])}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link href="/experiences/collections" className="inline-block py-2 hover:text-foreground">
          ← All collections
        </Link>
      </nav>
      <h1
        className="mt-6 font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl"
        style={{ textWrap: 'balance', lineHeight: 1.12 }}
      >
        {collection.title}
      </h1>
      <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-foreground/80">
        {collection.introduction}
      </p>
      <section className="mt-14">
        <h2 className="font-serif text-2xl text-foreground">How to choose</h2>
        <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-muted-foreground">
          {collection.choosing}
        </p>
      </section>
      <section className="mt-14">
        <h2 className="font-serif text-2xl text-foreground">{entries.length} ideas to explore</h2>
        <p className="mt-3 text-base text-muted-foreground">
          Open an idea for its practical plan and add it to your list if it fits.
        </p>
        <ul className="mt-5 divide-y divide-border border-t border-border">
          {entries.map(({ entry, why }) => (
            <li key={entry.slug} className="py-5">
              <Link
                href={`/experiences/${entry.slug}`}
                prefetch={false}
                className="inline-flex min-h-11 items-center py-1 text-lg font-medium text-foreground underline underline-offset-4"
              >
                {entry.title}
              </Link>
              <p className="mt-2 max-w-[62ch] text-base leading-relaxed text-muted-foreground">
                {why}
              </p>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-14">
        <h2 className="font-serif text-2xl text-foreground">A different kind of experience?</h2>
        <ExperienceCollectionLinks
          collections={EXPERIENCE_COLLECTIONS.filter((item) => item.slug !== collection.slug)}
        />
        <p className="mt-6 text-base text-muted-foreground">
          Or{' '}
          <Link href="/experiences" className="text-foreground underline underline-offset-4">
            search the full catalog
          </Link>{' '}
          for something specific.
        </p>
      </section>
    </div>
  );
}
