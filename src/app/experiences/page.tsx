import type { Metadata } from 'next';
import Link from 'next/link';
import { getServerAuthSession } from '~/server/auth';
import { ExperienceCollectionLinks } from '~/components/experience-collection-links';
import { JsonLd } from '~/components/json-ld';
import { EXPERIENCE_COLLECTIONS } from '~/lib/experience-collections';
import { EXPERIENCE_CONTENT_UPDATED } from '~/lib/experience-guides';

import { parseCatalogQuery } from '~/lib/catalog-seed';
import { searchExperienceCatalog } from '~/server/experience-catalog';
import { DEFAULT_SOCIAL_IMAGE, SITE_URL } from '~/lib/site-metadata';
import { ExperiencesClient } from './experiences-client';

const description =
  'Every experience we know about, in one searchable list: places to go, milestones to reach, and ideas worth stealing. No account needed.';
export const metadata: Metadata = {
  title: { absolute: 'Experiences worth making room for' },
  description,
  alternates: { canonical: '/experiences' },
  openGraph: {
    title: 'Experiences worth making room for',
    description,
    url: `${SITE_URL}/experiences`,
    type: 'website',
    images: [{ url: DEFAULT_SOCIAL_IMAGE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Experiences worth making room for',
    description,
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

export default async function ExperiencesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams))
    if (typeof value === 'string') params.set(key, value);
  // Ignore malformed entry URLs without rendering an error page.
  let query: ReturnType<typeof parseCatalogQuery>;
  try {
    query = parseCatalogQuery(params);
  } catch {
    query = parseCatalogQuery(new URLSearchParams());
  }
  query.pageSize = 20;
  const [session, catalog] = await Promise.all([
    getServerAuthSession(),
    searchExperienceCatalog(query),
  ]);
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Bucket list experience catalog',
          description,
          url: `${SITE_URL}/experiences`,
          dateModified: EXPERIENCE_CONTENT_UPDATED,
        }}
      />
      <h1
        className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl"
        style={{ textWrap: 'balance', lineHeight: 1.12 }}
      >
        Things you could do.
      </h1>
      <p className="mt-5 max-w-[62ch] text-lg text-foreground/80" style={{ lineHeight: 1.6 }}>
        {catalog.total} ideas in one shared catalog — places to go, milestones worth reaching, and
        things worth trying. Explore by category, and keep the ones that matter in your own list.
      </p>

      <p className="mt-4 text-base text-muted-foreground">
        Want a shorter starting list?{' '}
        <Link
          href="/experiences/collections"
          className="text-foreground underline underline-offset-4"
        >
          Browse collections for weekends, solo time and more
        </Link>
        .
      </p>

      <ExperiencesClient
        initialPage={catalog}
        initialQuery={query}
        mode={session?.user ? 'account' : 'local'}
      />

      <section className="mt-14">
        <h2 className="font-serif text-2xl text-foreground">Choose from a collection</h2>
        <p className="mt-3 text-base text-muted-foreground">
          Ideas grouped by the time, budget and company you have.
        </p>
        <ExperienceCollectionLinks collections={EXPERIENCE_COLLECTIONS} />
      </section>

      <p className="mt-12 text-base text-muted-foreground">
        Not sure where to start?{' '}
        <Link href="/life-in-weeks" className="text-foreground underline underline-offset-4">
          See how many weeks you have left
        </Link>{' '}
        first — it makes the choosing easier.
      </p>
    </div>
  );
}
