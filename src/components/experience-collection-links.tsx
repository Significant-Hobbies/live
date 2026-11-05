import Link from 'next/link';

import type { ExperienceCollection } from '~/lib/experience-collections';
import { ExperiencePhoto } from '~/components/experience-photo';

const collectionSubjects: Record<string, string> = {
  'low-cost': 'painting',
  solo: 'pottery',
  weekend: 'cooking',
  'with-friends': 'friends',
  'at-home': 'cooking',
};

export function ExperienceCollectionLinks({
  collections,
}: {
  collections: ExperienceCollection[];
}) {
  return (
    <ul className="mt-4 divide-y divide-border border-t border-border">
      {collections.map((collection) => (
        <li key={collection.slug}>
          <Link
            href={`/experiences/collections/${collection.slug}`}
            className="flex min-h-20 items-center gap-4 rounded-lg py-3 text-base text-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <ExperiencePhoto
              title={
                collectionSubjects[collection.slug] ??
                collection.items[0]?.slug.replaceAll('-', ' ') ??
                ''
              }
              decorative
              sizes="80px"
              className="h-16 w-20 shrink-0 rounded-lg"
            />
            <span className="flex-1">{collection.title}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
