import type { Metadata } from 'next';
import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { ArrowRight, Check, Grid3X3, Plus } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { bucketListItems, bucketLists, users } from '~/db/schema';
import { BucketItemControls } from '~/components/bucket-list/bucket-item-controls';
import { QuickAddBucketItem } from '~/components/bucket-list/quick-add-item';
import { LocalBucketList } from '~/components/bucket-list/local-bucket-list';
import { LocalOnboardingGate } from '~/components/local-onboarding-gate';
import { QuestChainCard } from '~/components/bucket-list/quest-chain-card';
import { getActiveQuests, getCompletedQuests } from '~/lib/actions/user-quests';
import { draftFromStoredRecord, getBingoProgress } from '~/lib/life-bingo';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';

export const metadata: Metadata = {
  title: 'Your Bucket Lists',
  robots: { index: false, follow: false },
};

export default async function BucketListPage() {
  const session = await getServerAuthSession();
  if (!session?.user?.id)
    return (
      <LocalOnboardingGate>
        <LocalBucketList />
      </LocalOnboardingGate>
    );

  const account = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { onboardingCompletedAt: true },
  });
  if (!account?.onboardingCompletedAt) redirect('/onboarding');

  const [rows, items, activeQuests, completedQuests] = await Promise.all([
    db
      .select()
      .from(bucketLists)
      .where(eq(bucketLists.userId, session.user.id))
      .orderBy(desc(bucketLists.updatedAt)),
    db
      .select()
      .from(bucketListItems)
      .where(eq(bucketListItems.userId, session.user.id))
      .orderBy(desc(bucketListItems.updatedAt)),
    getActiveQuests(),
    getCompletedQuests(),
  ]);
  const chainQuests = [...activeQuests, ...completedQuests].map((quest) => ({
    id: quest.id,
    questId: quest.questId,
    status: quest.status,
    title: quest.title,
  }));

  const lists = rows.flatMap((row) => {
    const draft = draftFromStoredRecord(row);
    return draft ? [{ row, draft, progress: getBingoProgress(draft) }] : [];
  });

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f7f1e7] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-emerald-700">
              Your life, on purpose
            </p>
            <h1 className="mt-2 font-serif text-5xl font-semibold tracking-[-0.045em] text-stone-900 sm:text-6xl">
              Your Bucket List
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-stone-600">
              Every meaningful someday in one place. Side quests are for this week; these can stay
              with you for years.
            </p>
          </div>
          <Button
            asChild
            className="h-11 rounded-xl bg-[#176b4a] px-5 text-white hover:bg-[#10583d]"
          >
            <Link href="/bucket-list/new">
              <Plus className="h-4 w-4" /> Make a Bingo board
            </Link>
          </Button>
        </header>

        <div className="mt-9">
          <QuickAddBucketItem />
        </div>

        {items.length > 0 && (
          <section className="mt-8 grid gap-5 lg:grid-cols-2">
            {(['active', 'done'] as const).map((group) => {
              const groupItems = items.filter((item) =>
                group === 'done' ? item.status === 'done' : item.status !== 'done'
              );
              return (
                <div
                  key={group}
                  className="rounded-[1.5rem] border border-[#d9cfbd] bg-[#fffdf8] p-5 sm:p-6"
                >
                  <div className="flex items-baseline justify-between">
                    <h2 className="font-serif text-3xl text-stone-900">
                      {group === 'done' ? 'Lived' : 'Still calling'}
                    </h2>
                    <span className="text-xs font-bold text-stone-500">{groupItems.length}</span>
                  </div>
                  {groupItems.length ? (
                    <ul className="mt-4 divide-y divide-[#e8dfd1]">
                      {groupItems.map((item) => (
                        <li key={item.id} className="py-4">
                          {item.status === 'done' ? (
                            <p className="font-serif text-xl text-stone-500 line-through">
                              {item.title}
                            </p>
                          ) : (
                            <QuestChainCard
                              bucketItemId={item.id}
                              title={item.title}
                              category={item.category}
                              activeQuests={chainQuests}
                            />
                          )}
                          {item.description && (
                            <p className="mt-1 text-sm text-stone-600">{item.description}</p>
                          )}
                          <BucketItemControls
                            id={item.id}
                            status={item.status}
                            visibility={item.visibility}
                            title={item.title}
                            targetYear={item.targetYear}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-5 text-sm text-stone-500">
                      {group === 'done'
                        ? 'Completed experiences will stay here as part of your story.'
                        : 'Add the first thing you do not want to leave unlived.'}
                    </p>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {lists.length === 0 && items.length === 0 ? (
          <section className="mt-12 overflow-hidden rounded-[2rem] border border-[#d9cfbd] bg-[#fffdf8] p-8 shadow-[0_24px_70px_rgba(72,58,38,0.08)] sm:p-12">
            <div className="grid items-center gap-10 md:grid-cols-[1fr_0.8fr]">
              <div>
                <p className="font-serif text-3xl text-emerald-700">
                  Your first square is waiting.
                </p>
                <h2 className="mt-3 font-serif text-5xl font-semibold leading-[0.95] tracking-tight text-stone-900">
                  Make a list that makes you want to leave the house.
                </h2>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-stone-600">
                  Pick what you want more of. We’ll give you nine specific experiences you can edit,
                  complete, and share.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="mt-7 rounded-xl bg-[#176b4a] text-white hover:bg-[#10583d]"
                >
                  <Link href="/bucket-list/new">
                    Make my first list <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div
                className="grid rotate-[2deg] grid-cols-3 gap-2 rounded-2xl bg-[#f5ecdc] p-4 shadow-inner"
                aria-hidden="true"
              >
                {[
                  'Try something new',
                  'Go somewhere alone',
                  'Make a tiny thing',
                  'Host the dinner',
                  'Say yes',
                  'Watch sunrise',
                  'Learn the song',
                  'Call an old friend',
                  'Get wonderfully lost',
                ].map((text, index) => (
                  <div
                    key={text}
                    className={`flex aspect-square items-center justify-center rounded-lg border p-2 text-center text-[0.6rem] font-semibold ${index === 4 ? 'border-[#1e3029] bg-[#1e3029] text-white' : 'border-[#cbbca5] bg-[#fffaf0] text-stone-700'}`}
                  >
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : lists.length > 0 ? (
          <section className="mt-12">
            <div className="mb-4">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
                Playful views
              </p>
              <h2 className="mt-1 font-serif text-3xl text-stone-900">Your Bingo boards</h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {lists.map(({ row, draft, progress }) => (
                <Link
                  key={row.id}
                  href={`/bucket-list/${row.id}`}
                  className="group rounded-2xl border border-[#d9cfbd] bg-[#fffdf8] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-emerald-700">
                        {draft.horizon.replace('chapter', 'next chapter')}
                      </p>
                      <h2 className="mt-1 font-serif text-3xl font-semibold leading-tight text-stone-900">
                        {draft.title}
                      </h2>
                    </div>
                    <Grid3X3 className="h-5 w-5 text-stone-300 transition group-hover:text-emerald-700" />
                  </div>
                  <div className="mt-7 flex items-end justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                      <Check className="h-3.5 w-3.5 text-emerald-700" /> {progress.completed} of{' '}
                      {progress.total} lived
                    </div>
                    <span className="text-[0.62rem] font-bold uppercase tracking-wider text-stone-400">
                      {row.visibility.toLowerCase()}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full bg-emerald-700"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
