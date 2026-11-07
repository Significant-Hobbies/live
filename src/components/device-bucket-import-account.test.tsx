import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { BucketImportResult } from '~/lib/bucket-list-data';
import type { LocalBucketSnapshot } from '~/lib/local-bucket-import';
import { DeviceBucketImportControls, useDeviceBucketImport } from './device-bucket-import';

const { read, archive, save, download, refresh } = vi.hoisted(() => ({
  read: vi.fn(),
  archive: vi.fn(),
  save: vi.fn(),
  download: vi.fn(),
  refresh: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('~/lib/actions/local-bucket-import', () => ({ importLocalBucketItems: save }));
vi.mock('~/lib/bucket-list-data', async (original) => ({
  ...(await original<typeof import('~/lib/bucket-list-data')>()),
  downloadBucketJson: download,
}));
vi.mock('~/lib/local-bucket-import', async (original) => ({
  ...(await original<typeof import('~/lib/local-bucket-import')>()),
  readLocalBucketSnapshot: read,
  archiveImportedBucketSnapshot: archive,
}));

let root: Root;
let container: HTMLDivElement;
let state: ReturnType<typeof useDeviceBucketImport>;

function Harness({ userId }: { userId: string }) {
  state = useDeviceBucketImport(userId);
  return <DeviceBucketImportControls state={state} />;
}

function snapshot(count = 1): LocalBucketSnapshot {
  const items = Array.from({ length: count }, (_, index) => ({
    id: crypto.randomUUID(),
    title: `Account-bound goal ${index}`,
    status: 'planned' as const,
    steps: [],
    updates: [],
  }));
  return {
    envelope: {
      key: 'onboarding:bucket-items',
      domain: 'bucket-list',
      schemaVersion: 1,
      installationId: 'account-test',
      updatedAt: '2026-11-07T10:00:00.000Z',
      value: { items },
    },
    items,
    invalid: 0,
  };
}

async function renderOwner(userId: string) {
  await act(async () => root.render(<Harness key={userId} userId={userId} />));
}

beforeEach(async () => {
  vi.resetAllMocks();
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  read.mockResolvedValue(snapshot());
  archive.mockResolvedValue(true);
  save.mockImplementation(async ({ items }) => ({
    success: true,
    imported: items.length,
    matched: 0,
    conflicts: [],
  }));
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  await renderOwner('owner-a');
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

describe('device import account binding', () => {
  it('sends the initiating owner on every actual client batch', async () => {
    const current = snapshot(101);
    read.mockResolvedValue(current);
    await act(async () => state.importList());
    expect(save).toHaveBeenCalledTimes(2);
    expect(save.mock.calls.map(([input]) => [input.expectedUserId, input.items.length])).toEqual([
      ['owner-a', 100],
      ['owner-a', 1],
    ]);
    expect(archive).toHaveBeenCalledExactlyOnceWith(current);
    expect(state.complete).toBe(true);
  });

  it.each([1, 101])(
    'retains the full %i-item snapshot when the owner changes during an import',
    async (count) => {
      const current = snapshot(count);
      read.mockResolvedValue(current);
      let resolve!: (result: BucketImportResult) => void;
      save.mockImplementationOnce(
        () =>
          new Promise<BucketImportResult>((done) => {
            resolve = done;
          })
      );
      await act(async () => state.importList());
      expect(save).toHaveBeenCalledOnce();
      expect(save.mock.calls[0]![0].expectedUserId).toBe('owner-a');

      await renderOwner('owner-b');
      await act(async () =>
        resolve({ success: true, imported: Math.min(count, 100), matched: 0, conflicts: [] })
      );
      expect(save).toHaveBeenCalledOnce();
      expect(archive).not.toHaveBeenCalled();
      expect(state.snapshot).toEqual(current);
      expect(state.snapshot?.envelope.value.items).toHaveLength(count);
      expect(state.complete).toBe(false);
      expect(state.needsReview).toBe(false);
      expect(refresh).not.toHaveBeenCalled();

      await act(async () => state.importList());
      expect(save.mock.calls.slice(1).every(([input]) => input.expectedUserId === 'owner-b')).toBe(
        true
      );
      expect(archive).toHaveBeenCalledExactlyOnceWith(current);
      expect(state.complete).toBe(true);
    }
  );

  it('forgets saved-backup approval and rejects old archive handlers after an account change', async () => {
    save.mockResolvedValue({ success: true, imported: 0, matched: 0, conflicts: ['Goal'] });
    await act(async () => state.importList());
    await act(async () => state.beginArchiveReview());
    await act(async () => state.downloadBackup());
    await act(async () => state.confirmBackup(true));
    expect(state.archiveReview).toBe('backup_confirmed');
    const oldState = state;

    await renderOwner('owner-b');
    expect(state.archiveReview).toBe('idle');
    expect(state.needsReview).toBe(false);
    await act(async () => oldState.archiveCopy());
    expect(archive).not.toHaveBeenCalled();
    expect(state.snapshot?.envelope.value.items).toHaveLength(1);
  });
});
