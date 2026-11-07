import { beforeEach, describe, expect, it, vi } from 'vitest';
import { archiveImportedBucketSnapshot, readLocalBucketSnapshot } from './local-bucket-import';

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

describe('device bucket import preparation', () => {
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
