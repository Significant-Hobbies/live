'use client';

import { ArrowRight, Dice5 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { LiveMoreBucketFocus } from '~/components/live-more-bucket-focus';
import { LiveMoreDiscovery } from '~/components/live-more-discovery';
import { StorageModeProvider, StorageModeStatus } from '~/components/storage-mode-provider';
import { browserRecordAdapter, readLocalRecord } from '~/lib/local-record-store';

type Suggestion = {
  title: string;
  category:
    | 'travel'
    | 'adventure'
    | 'creative'
    | 'achievement'
    | 'relationships'
    | 'contribution'
    | 'food'
    | 'health'
    | 'mindfulness'
    | 'reflection';
  emoji: string;
  reason: string;
};

export function LocalLiveMore({ suggestions }: { suggestions: Suggestion[] }) {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [bucket, setBucket] = useState<Record<string, unknown> | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const adapter = browserRecordAdapter();
    Promise.all([
      readLocalRecord(adapter, 'onboarding:profile', 'onboarding', isObject),
      readLocalRecord(adapter, 'onboarding:bucket-items', 'bucket-list', isObject),
    ]).then(([nextProfile, nextBucket]) => {
      setProfile(nextProfile);
      setBucket(nextBucket);
      setLoaded(true);
    });
  }, []);

  const name = typeof profile?.name === 'string' ? profile.name.split(' ')[0] : null;
  const rawItems = Array.isArray(bucket?.items) ? bucket.items : [];
  const items = rawItems.flatMap((item, index) =>
    isObject(item) &&
    typeof item.title === 'string' &&
    (typeof item.status !== 'string' || item.status !== 'done')
      ? [{ id: `local-${index}`, title: item.title }]
      : []
  );
  const goals = Array.isArray(bucket?.annualGoals)
    ? bucket.annualGoals.filter((value): value is string => typeof value === 'string')
    : typeof bucket?.annualFocus === 'string'
      ? [bucket.annualFocus]
      : [];

  return (
    <StorageModeProvider mode="local">
      <div className="bg-[#fbf8ef] px-4 py-8 text-[#211e18] sm:py-12">
        <div className="mx-auto max-w-6xl space-y-10 sm:space-y-14">
          <div className="flex justify-end">
            <StorageModeStatus />
          </div>
          {loaded ? (
            <LiveMoreBucketFocus initialItems={items} goals={goals} mode="local" name={name} />
          ) : null}
          <LiveMoreDiscovery suggestions={suggestions} mode="local" />
          <section className="grid gap-4">
            <LocalPath
              href="/life-bingo"
              icon={<Dice5 />}
              title="Life Bingo"
              color="bg-[#f7e957]"
            />
          </section>
        </div>
      </div>
    </StorageModeProvider>
  );
}

function LocalPath({
  href,
  icon,
  title,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className={`flex min-h-36 items-end justify-between rounded-2xl p-6 ${color}`}
    >
      <div>
        {icon}
        <h2 className="mt-4 font-serif text-3xl">{title}</h2>
      </div>
      <ArrowRight className="size-5" />
    </Link>
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object';
}
