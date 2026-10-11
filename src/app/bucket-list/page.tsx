import type { Metadata } from 'next';
import { asc, desc, eq } from 'drizzle-orm';
import { MyList } from '~/components/bucket-list/my-list';
import { bucketListItems, bucketLists, userQuests } from '~/db/schema';
import { visibleBucketSteps } from '~/lib/bucket-steps';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';

export const metadata: Metadata = { title: 'My list', robots: { index: false, follow: false } };

export default async function BucketListPage() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) return <MyList key="local" />;
  const [items, quests, boards] = await Promise.all([
    db
      .select()
      .from(bucketListItems)
      .where(eq(bucketListItems.userId, session.user.id))
      .orderBy(desc(bucketListItems.updatedAt)),
    db
      .select()
      .from(userQuests)
      .where(eq(userQuests.userId, session.user.id))
      .orderBy(asc(userQuests.startedAt)),
    // Saved Life Bingo boards keep a quiet entry point from My list.
    db
      .select({ id: bucketLists.id, title: bucketLists.title })
      .from(bucketLists)
      .where(eq(bucketLists.userId, session.user.id))
      .orderBy(desc(bucketLists.updatedAt)),
  ]);
  return (
    <MyList
      key={session.user.id}
      boards={boards}
      initialItems={items.map((item) => ({
        ...item,
        status: item.status === 'done' || item.status === 'in_progress' ? item.status : 'planned',
        notes: item.description,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        completedAt: item.completedAt?.toISOString() ?? null,
        steps: visibleBucketSteps(quests.filter((quest) => quest.sourceBucketItemId === item.id)),
      }))}
    />
  );
}
