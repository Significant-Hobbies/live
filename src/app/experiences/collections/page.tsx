import Link from 'next/link';

import { ExperienceCollectionLinks } from '~/components/experience-collection-links';
import { JsonLd } from '~/components/json-ld';
import { EXPERIENCE_COLLECTIONS } from '~/lib/experience-collections';
import { EXPERIENCE_CONTENT_UPDATED } from '~/lib/experience-guides';
import { experienceBreadcrumbs, experienceMetadata } from '~/lib/experience-seo';
import { SITE_URL } from '~/lib/site-metadata';

const title = 'Bucket list collections: choose your next experience';
const description =
  'Explore curated bucket list collections for weekends, solo time, low budgets, creative projects, home and experiences with friends.';
export const metadata = experienceMetadata(title, description, '/experiences/collections');

export default function ExperienceCollectionsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: title,
          description,
          url: `${SITE_URL}/experiences/collections`,
          dateModified: EXPERIENCE_CONTENT_UPDATED,
        }}
      />
      <JsonLd
        data={experienceBreadcrumbs([
          { name: 'Catalog', path: '/experiences' },
          { name: 'Collections', path: '/experiences/collections' },
        ])}
      />
      <nav className="text-sm text-muted-foreground">
        <Link href="/experiences" className="inline-block py-2 hover:text-foreground">
          ← Everything you could do
        </Link>
      </nav>
      <h1
        className="mt-6 font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl"
        style={{ textWrap: 'balance', lineHeight: 1.12 }}
      >
        Choose by the kind of time you have.
      </h1>
      <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-foreground/80">
        A few deliberate selections from the catalog. Start with a weekend, a small budget, time on
        your own or something to make with a friend.
      </p>
      <section className="mt-14">
        <h2 className="font-serif text-2xl text-foreground">Find a collection</h2>
        <ExperienceCollectionLinks collections={EXPERIENCE_COLLECTIONS} />
      </section>
      <p className="mt-12 text-base leading-relaxed text-muted-foreground">
        Each collection explains why the ideas belong together. Follow an activity to see its
        planning estimates, preparation and first steps. You can save ideas privately to{' '}
        <Link href="/bucket-list" className="text-foreground underline underline-offset-4">
          My list
        </Link>{' '}
        and mark them fulfilled when you finish.
      </p>
    </div>
  );
}
