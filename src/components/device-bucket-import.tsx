'use client';

import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useRouter } from 'next/navigation';
import { importLocalBucketItems } from '~/lib/actions/local-bucket-import';
import { downloadBucketJson } from '~/lib/bucket-list-data';
import {
  archiveImportedBucketSnapshot,
  importBucketItems,
  readLocalBucketSnapshot,
  type LocalBucketSnapshot,
} from '~/lib/local-bucket-import';

function exportCopy(current: LocalBucketSnapshot) {
  downloadBucketJson(
    {
      ...current.envelope.value,
      format: 'live-device-bucket-list',
      version: 1,
      exportedAt: new Date().toISOString(),
    },
    'live-device-bucket-list'
  );
}

function startBackupDownload(
  snapshot: LocalBucketSnapshot | null,
  setError: Dispatch<SetStateAction<string>>
) {
  if (!snapshot) return false;
  setError('');
  try {
    exportCopy(snapshot);
    return true;
  } catch {
    setError('The backup download could not be started. Your device copy is safe. Try again.');
    return false;
  }
}

type ArchiveReview = 'idle' | 'confirm' | 'download_started' | 'backup_confirmed';

function snapshotMessage(snapshot: LocalBucketSnapshot | null) {
  if (!snapshot?.invalid) return '';
  return snapshot.items.length === 0
    ? 'No device items can be imported. Download the full device copy to review its details before choosing whether to archive it.'
    : `${snapshot.invalid} device items need review. Import the valid items first; the full device copy will remain available for export.`;
}

function useDeviceImportState(authenticated: boolean) {
  const [snapshot, setSnapshot] = useState<LocalBucketSnapshot | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  const [archived, setArchived] = useState(false);
  const [needsReview, setNeedsReview] = useState(false);
  const [archiveReview, setArchiveReview] = useState<ArchiveReview>('idle');
  const [pending, startTransition] = useTransition();
  const active = useRef(false);
  function replaceSnapshot(next: LocalBucketSnapshot | null) {
    setSnapshot(next);
    setNeedsReview(Boolean(next?.invalid && next.items.length === 0));
    setArchiveReview('idle');
    setComplete(false);
    setArchived(false);
    setMessage(snapshotMessage(next));
  }
  useEffect(() => {
    if (!authenticated) return;
    active.current = true;
    let cancelled = false;
    void readLocalBucketSnapshot()
      .then((next) => {
        if (cancelled) return;
        replaceSnapshot(next);
      })
      .catch(() => {
        if (!cancelled)
          setError('The device list could not be opened. Reload to retry; its copy is safe.');
      });
    return () => {
      cancelled = true;
      active.current = false;
    };
  }, [authenticated]);
  return {
    snapshot,
    message,
    error,
    complete,
    archived,
    needsReview,
    archiveReview,
    pending,
    setMessage,
    setError,
    setComplete,
    setArchived,
    setNeedsReview,
    setArchiveReview,
    replaceSnapshot,
    startTransition,
    isActive: () => active.current,
    assertActive: () => {
      if (!active.current) throw new Error('Import owner changed.');
    },
  };
}

async function importDeviceSnapshot(
  userId: string,
  state: ReturnType<typeof useDeviceImportState>,
  router: ReturnType<typeof useRouter>
) {
  if (!state.isActive()) return;
  state.setError('');
  state.setNeedsReview(false);
  state.setArchiveReview('idle');
  state.setMessage('');
  try {
    const current = await readLocalBucketSnapshot();
    state.assertActive();
    state.replaceSnapshot(current);
    if (!current || current.items.length === 0) return;
    const result = await importBucketItems(current.items, async (batch) => {
      state.assertActive();
      return importLocalBucketItems({ ...batch, expectedUserId: userId });
    });
    state.assertActive();
    if (!result.success) {
      state.setError(result.error ?? 'Import failed. Your device copy is safe.');
      return;
    }
    if (result.conflicts.length || current.invalid) {
      const latest = await readLocalBucketSnapshot();
      state.assertActive();
      if (JSON.stringify(latest?.envelope) !== JSON.stringify(current.envelope)) {
        state.replaceSnapshot(latest);
        state.setMessage(
          'Your device list changed during import. Import again to review its latest version.'
        );
        router.refresh();
        return;
      }
      state.setNeedsReview(true);
      state.setMessage(
        `${result.imported} imported, ${result.matched} already saved. ${result.conflicts.length + current.invalid} device items need review. Your account versions are unchanged; the full device copy is kept here for export.`
      );
    } else if (await archiveImportedBucketSnapshot(current)) {
      state.replaceSnapshot(null);
      state.setComplete(true);
      state.setMessage('All items, steps and private updates are saved.');
    } else {
      state.replaceSnapshot(await readLocalBucketSnapshot());
      state.setMessage(
        'The imported copy is saved. Your device list changed during import, so its newer copy is kept here. Import again to review the latest version.'
      );
    }
    router.refresh();
  } catch {
    if (state.isActive())
      state.setError('Import could not be confirmed. Your device copy is safe. Retry to check it.');
  }
}

export function useDeviceBucketImport(userId: string | null) {
  const router = useRouter();
  const state = useDeviceImportState(Boolean(userId));

  async function archiveCopy() {
    if (
      !state.isActive() ||
      !state.snapshot ||
      !state.needsReview ||
      state.archiveReview !== 'backup_confirmed'
    )
      return;
    state.setError('');
    state.setArchiveReview('idle');
    try {
      if (await archiveImportedBucketSnapshot(state.snapshot)) {
        state.replaceSnapshot(null);
        state.setArchived(true);
        state.setMessage('Your account versions are unchanged. The device copy is archived.');
      } else {
        state.setNeedsReview(false);
        state.replaceSnapshot(await readLocalBucketSnapshot());
        state.setMessage(
          'The device copy changed, so it has not been archived. Export or import its latest version.'
        );
      }
    } catch {
      state.setError(
        'The device copy could not be archived. Its original is safe. Retry or export it.'
      );
    }
  }

  return {
    snapshot: state.snapshot,
    message: state.message,
    error: state.error,
    complete: state.complete,
    archived: state.archived,
    needsReview: state.needsReview,
    archiveReview: state.archiveReview,
    pending: state.pending,
    visible: Boolean(state.snapshot?.envelope.value.items.length || state.message || state.error),
    importList: () =>
      state.startTransition(async () => {
        if (userId) await importDeviceSnapshot(userId, state, router);
      }),
    exportCopy: () => startBackupDownload(state.snapshot, state.setError),
    beginArchiveReview: () => {
      if (state.needsReview) state.setArchiveReview('confirm');
    },
    cancelArchiveReview: () => state.setArchiveReview('idle'),
    downloadBackup: () => {
      if (!state.snapshot || !state.needsReview || state.archiveReview === 'idle') return;
      state.setArchiveReview('confirm');
      if (startBackupDownload(state.snapshot, state.setError))
        state.setArchiveReview('download_started');
    },
    confirmBackup: (saved: boolean) => {
      if (state.archiveReview === 'download_started' || state.archiveReview === 'backup_confirmed')
        state.setArchiveReview(saved ? 'backup_confirmed' : 'download_started');
    },
    archiveCopy: () => state.startTransition(archiveCopy),
  };
}

export function DeviceBucketImportControls({
  state,
}: {
  state: ReturnType<typeof useDeviceBucketImport>;
}) {
  const snapshot = state.snapshot;
  if (!snapshot?.envelope.value.items.length) return null;
  if (state.needsReview && state.archiveReview !== 'idle')
    return (
      <div className="space-y-2 text-sm">
        <p>
          Download the full device backup and check that you have saved it before archiving this
          device copy. No account items will change.
        </p>
        <label className="flex min-h-11 items-center gap-2">
          <input
            type="checkbox"
            checked={state.archiveReview === 'backup_confirmed'}
            disabled={state.pending || state.archiveReview === 'confirm'}
            onChange={(event) => state.confirmBackup(event.target.checked)}
          />
          I have saved the backup
        </label>
        {state.archiveReview !== 'confirm' && (
          <p>The download has started. Check your downloads and save the file before continuing.</p>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={state.pending}
            onClick={state.downloadBackup}
            className="min-h-11 rounded-lg border border-border px-4 py-2 text-sm"
          >
            Download device backup
          </button>
          <button
            type="button"
            disabled={state.pending || state.archiveReview !== 'backup_confirmed'}
            onClick={state.archiveCopy}
            className="min-h-11 rounded-lg border border-border px-4 py-2 text-sm"
          >
            Archive device copy
          </button>
          <button
            type="button"
            disabled={state.pending}
            onClick={state.cancelArchiveReview}
            className="min-h-11 px-3 py-2 text-sm"
          >
            Cancel archive
          </button>
        </div>
      </div>
    );
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
        onClick={state.exportCopy}
        className="min-h-11 rounded-lg border border-border px-4 py-2 text-sm"
      >
        Export device copy
      </button>
      {state.needsReview && (
        <button
          type="button"
          disabled={state.pending}
          onClick={state.beginArchiveReview}
          className="min-h-11 rounded-lg border border-border px-4 py-2 text-sm"
        >
          {snapshot.items.length === 0 ? 'Review device copy' : 'Keep account versions'}
        </button>
      )}
    </>
  );
}
