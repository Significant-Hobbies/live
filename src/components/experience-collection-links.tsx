import Link from 'next/link';

import type { ExperienceCollection } from '~/lib/experience-collections';

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
            className="block py-3 text-base text-foreground underline-offset-4 hover:underline"
          >
            {collection.title} →
          </Link>
        </li>
      ))}
    </ul>
  );
}
