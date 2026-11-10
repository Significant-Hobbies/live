import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  archiveImportedBucketSnapshot,
  importBucketItems,
  readLocalBucketSnapshot,
} from './local-bucket-import';
import type { BucketTransferItem } from './bucket-list-data';

const { records, replace } = vi.hoisted(() => ({
  records: new Map<string, unknown>(),
  replace: vi.fn(),
}));
vi.mock('./local-record-store', () => ({
  browserRecordAdapter: () => ({ get: async (key: string) => records.get(key) }),
  compareAndReplaceLocalRecord: replace,
}));
const key = 'onboarding:bucket-items';
function seed(items: unknown[]) {
  records.set(key, {
    key,
    domain: 'bucket-list',
    schemaVersion: 1,
    installationId: 'test',
    updatedAt: '2026-11-07T10:00:00.000Z',
    value: { custom: 'keep', items },
  });
}
beforeEach(() => {
  records.clear();
  replace.mockReset();
  replace.mockImplementation(async (name, expected, next) => {
    if (JSON.stringify(records.get(name)) !== JSON.stringify(expected)) return false;
    if (next === undefined) records.delete(name);
    else records.set(name, next);
    return true;
  });
});

describe('bounded device import batches', () => {
  function item(index: number): BucketTransferItem {
    return {
      id: `item-${index}`,
      title: `Goal ${index}`,
      status: 'planned',
      steps: [],
      updates: [],
    };
  }
  const accepted = (imported: number) => ({ success: true, imported, matched: 0, conflicts: [] });

  it('imports every item beyond the server cap and retries a partial acknowledgement with the same IDs', async () => {
    const items = Array.from({ length: 101 }, (_, index) => item(index));
    const saved = new Set<string>();
    let failLast = true;
    const save = vi.fn(async ({ items: batch }: { items: BucketTransferItem[] }) => {
      expect(batch.length).toBeLessThanOrEqual(100);
      if (batch[0]!.id === 'item-100' && failLast) {
        failLast = false;
        return { ...accepted(0), success: false, error: 'Interrupted' };
      }
      const added = batch.filter((entry) => !saved.has(entry.id));
      batch.forEach((entry) => {
        saved.add(entry.id);
      });
      return { ...accepted(added.length), matched: batch.length - added.length };
    });
    expect(await importBucketItems(items, save)).toMatchObject({
      success: false,
      imported: 100,
      error: 'Interrupted',
    });
    expect(await importBucketItems(items, save)).toMatchObject({
      success: true,
      imported: 1,
      matched: 100,
    });
    expect([...saved]).toEqual(items.map((entry) => entry.id));
  });

  it('partitions child graphs and encoded payload bytes without dropping evidence', async () => {
    const items = Array.from({ length: 6 }, (_, index) => ({
      ...item(index),
      steps: Array.from({ length: 100 }, (_, step) => ({
        id: `step-${step}`,
        text: 'A next step',
        done: false,
      })),
      updates: Array.from({ length: 100 }, () => ({
        id: crypto.randomUUID(),
        text: 'A private update',
        createdAt: new Date().toISOString(),
      })),
    }));
    const save = vi.fn(async ({ items: batch }: { items: BucketTransferItem[] }) => {
      expect(
        batch.reduce((count, entry) => count + entry.steps.length + entry.updates.length, 0)
      ).toBeLessThanOrEqual(1000);
      expect(
        new TextEncoder().encode(JSON.stringify({ items: batch })).byteLength
      ).toBeLessThanOrEqual(700_000);
      return accepted(batch.length);
    });
    expect(await importBucketItems(items, save)).toMatchObject({ success: true, imported: 6 });
    expect(save.mock.calls.flatMap(([input]) => input.items)).toEqual(items);
    save.mockClear();
    const heavy = items.slice(0, 2).map((entry) => ({
      ...entry,
      updates: entry.updates.map((update) => ({ ...update, text: '語'.repeat(2000) })),
    }));
    expect(await importBucketItems(heavy, save)).toMatchObject({ success: true, imported: 2 });
    expect(save).toHaveBeenCalledTimes(2);
  });
});

describe('device bucket import preparation', () => {
  it('preserves exact tentative dates when preparing the account import', async () => {
    seed([{ id: 'date-item', title: 'Sail', targetYear: 2031, targetDate: '2031-06-12' }]);
    expect((await readLocalBucketSnapshot())!.items[0]).toMatchObject({
      targetDate: '2031-06-12',
      targetYear: 2031,
    });
  });
  it('materializes stable legacy identifiers, maps description, and preserves cleared notes', async () => {
    seed([
      'Sail',
      { title: 'Swim', description: 'Legacy note' },
      { title: 'Paint', description: 'Cleared old note', notes: null },
    ]);
    const first = (await readLocalBucketSnapshot())!;
    const retry = (await readLocalBucketSnapshot())!;
    expect(first.items.map((item) => item.id)).toEqual(retry.items.map((item) => item.id));
    expect(first.items[1]!.notes).toBe('Legacy note');
    expect(first.items[2]!.notes).toBeNull();
    expect(first.envelope.value.custom).toBe('keep');
  });
  it('retains unrecognized data in the original snapshot for device export', async () => {
    seed([
      { title: 'Sail' },
      { future: 'unknown shape' },
      { title: 'Long', notes: 'x'.repeat(501) },
    ]);
    const snapshot = (await readLocalBucketSnapshot())!;
    expect(snapshot.items).toHaveLength(1);
    expect(snapshot.invalid).toBe(2);
    expect(snapshot.envelope.value.items).toHaveLength(3);
    expect(records.has(key)).toBe(true);
  });
  it('archives only the acknowledged snapshot and refuses to consume a concurrent edit', async () => {
    seed([{ title: 'Sail' }]);
    const snapshot = (await readLocalBucketSnapshot())!;
    seed([{ title: 'Newer device edit' }]);
    expect(await archiveImportedBucketSnapshot(snapshot)).toBe(false);
    expect(records.has(key)).toBe(true);
    expect(replace).toHaveBeenLastCalledWith(key, snapshot.envelope, undefined, true);
  });
  it('leaves the source available when the archive transaction aborts', async () => {
    seed([{ title: 'Sail', id: 'stable' }]);
    const snapshot = (await readLocalBucketSnapshot())!;
    replace.mockRejectedValueOnce(new Error('Aborted archive'));
    await expect(archiveImportedBucketSnapshot(snapshot)).rejects.toThrow('Aborted archive');
    expect(records.has(key)).toBe(true);
  });
});
