import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

import { DreamAtlasExplorer } from '~/components/dream-atlas-explorer';
import { LocalLiveMore } from '~/components/local-live-more';
import { LocalOnboardingGate } from '~/components/local-onboarding-gate';
import { bucketListItems, users } from '~/db/schema';
import { EXPERIENCE_ENTRIES, firstSteps } from '~/lib/experiences';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';

export const metadata = {
  title: 'Live More — Significant Hobbies',
  robots: { index: false, follow: false },
};

const atlasEntries = EXPERIENCE_ENTRIES.map((entry) => ({
  slug: entry.slug,
  title: entry.title,
  description: entry.description,
  emoji: entry.emoji,
  category: entry.category,
  kind: entry.kind,
  location: entry.location,
  firstStep: firstSteps(entry)[0],
}));

export default async function LiveMorePage() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    return (
      <LocalOnboardingGate>
        <LocalLiveMore entries={atlasEntries} />
      </LocalOnboardingGate>
    );
  }

  const account = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { onboardingCompletedAt: true },
  });
  if (!account?.onboardingCompletedAt) redirect('/onboarding');

  const items = await db.query.bucketListItems.findMany({
    where: eq(bucketListItems.userId, session.user.id),
    orderBy: (item, { desc }) => [desc(item.updatedAt)],
  });
  const active = items.filter((item) => item.status !== 'done');
  return (
    <div className="bg-[#fbf8ef] px-4 py-8 text-[#211e18] sm:py-12">
      <div className="mx-auto max-w-6xl space-y-10 sm:space-y-14">
        <DreamAtlasExplorer
          entries={atlasEntries}
          name={session.user.name?.split(' ')[0]}
          mode="account"
          initialItems={active.map((item) => ({
            id: item.id,
            title: item.title,
            status: item.status === 'in_progress' ? 'in_progress' : 'planned',
          }))}
        />
      </div>
    </div>
  );
}
