'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { importLocalBucketItems } from '~/lib/actions/local-bucket-import';
import { downloadBucketJson } from '~/lib/bucket-list-data';
import {
  archiveImportedBucketSnapshot,
  readLocalBucketSnapshot,
  type LocalBucketSnapshot,
} from '~/lib/local-bucket-import';

export function useDeviceBucketImport(authenticated: boolean) {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<LocalBucketSnapshot | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  const [pending, startTransition] = useTransition();
  useEffect(() => {
    if (!authenticated) return;
    let cancelled = false;
    void readLocalBucketSnapshot()
      .then((next) => {
        if (cancelled) return;
        setSnapshot(next);
        if (next?.invalid)
          setMessage(
            `${next.invalid} device items need review. Export your device copy to keep all of their details.`
          );
      })
      .catch(() => {
        if (!cancelled)
          setError('The device list could not be opened. Reload to retry; its copy is safe.');
      });
    return () => {
      cancelled = true;
    };
  }, [authenticated]);

  async function importSnapshot() {
    setError('');
    try {
      const current = await readLocalBucketSnapshot();
      setSnapshot(current);
      if (!current || current.items.length === 0) return;
      const result = await importLocalBucketItems({ items: current.items });
      if (!result.success) {
        setError(result.error ?? 'Import failed. Your device copy is safe.');
        return;
      }
      if (result.conflicts.length || current.invalid) {
        setMessage(
          `${result.imported} imported, ${result.matched} already saved. ${result.conflicts.length + current.invalid} device items need review. Your account versions are unchanged; the full device copy is kept here for export.`
        );
      } else if (await archiveImportedBucketSnapshot(current)) {
        setSnapshot(null);
        setComplete(true);
        setMessage('All items, steps and private updates are saved.');
      } else {
        setMessage(
          'The imported copy is saved. Your device list changed during import, so its newer copy is kept here. Import again to review the latest version.'
        );
        setSnapshot(await readLocalBucketSnapshot());
      }
      router.refresh();
    } catch {
      setError('Import could not be confirmed. Your device copy is safe. Retry to check it.');
    }
  }

  return {
    snapshot,
    message,
    error,
    complete,
    pending,
    visible: Boolean(snapshot?.envelope.value.items.length || message || error),
    importList: () => startTransition(importSnapshot),
  };
}

export function DeviceBucketImportControls({
  state,
}: {
  state: ReturnType<typeof useDeviceBucketImport>;
}) {
  const snapshot = state.snapshot;
  if (!snapshot?.envelope.value.items.length) return null;
  return (
    <>
      <button
        type="button"
        disabled={state.pending || snapshot.items.length === 0}
        onClick={state.importList}
        className="min-h-11 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Import device list ({snapshot.items.length})
      </button>
      <button
        type="button"
        disabled={state.pending}
        onClick={() =>
          downloadBucketJson(
            {
              format: 'live-device-bucket-list',
              version: 1,
              exportedAt: new Date().toISOString(),
              ...snapshot.envelope.value,
            },
            'live-device-bucket-list'
          )
        }
        className="min-h-11 rounded-lg border border-border px-4 py-2 text-sm"
      >
        Export device copy
      </button>
    </>
  );
}
