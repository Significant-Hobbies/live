'use client';

import { useEffect, useState } from 'react';

import { DreamAtlasExplorer } from '~/components/dream-atlas-explorer';
import { StorageModeProvider, StorageModeStatus } from '~/components/storage-mode-provider';
import type { DreamAtlasEntry } from '~/lib/dream-atlas';
import { browserRecordAdapter, readLocalRecord } from '~/lib/local-record-store';

export function LocalLiveMore({ entries }: { entries: DreamAtlasEntry[] }) {
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
      ? [
          {
            id: `local-${index}`,
            title: item.title,
            status: item.status === 'in_progress' ? ('in_progress' as const) : ('planned' as const),
          },
        ]
      : []
  );
  return (
    <StorageModeProvider mode="local">
      <div className="bg-[#fbf8ef] px-4 py-8 text-[#211e18] sm:py-12">
        <div className="mx-auto max-w-6xl space-y-10 sm:space-y-14">
          <div className="flex justify-end">
            <StorageModeStatus />
          </div>
          {loaded ? (
            <DreamAtlasExplorer entries={entries} initialItems={items} mode="local" name={name} />
          ) : null}
        </div>
      </div>
    </StorageModeProvider>
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object';
}
