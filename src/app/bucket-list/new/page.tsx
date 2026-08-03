import type { Metadata } from 'next';
import { BucketListWorkspace } from '~/components/bucket-list/bucket-list-workspace';
import { getQuestById } from '~/lib/side-quests';
import { getServerAuthSession } from '~/server/auth';

export const metadata: Metadata = {
  title: 'Make Your Bucket List',
  description: 'Create a personal bucket list and turn it into a playable Life Bingo board.',
  robots: { index: false, follow: false },
};

export default async function NewBucketListPage({
  searchParams,
}: {
  searchParams: Promise<{ quest?: string }>;
}) {
  const session = await getServerAuthSession();
  const { quest: questId } = await searchParams;
  const quest = questId ? getQuestById(questId) : null;
  return (
    <BucketListWorkspace
      isAuthenticated={Boolean(session?.user)}
      queuedQuest={quest ? { id: quest.id, title: quest.title } : null}
    />
  );
}
