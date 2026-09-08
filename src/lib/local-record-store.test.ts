import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  browserRecordAdapter,
  readLocalRecord,
  writeLocalRecord,
  type LocalRecordAdapter,
} from './local-record-store';

function memoryAdapter(options?: { failWrites?: boolean }) {
  const records = new Map<string, unknown>();
  const adapter: LocalRecordAdapter = {
    async get(key) {
      return records.get(key);
    },
    async put(key, value) {
      if (options?.failWrites) throw new Error('quota exceeded');
      records.set(key, value);
    },
    async remove(key) {
      records.delete(key);
    },
  };
  return { adapter, records };
}

describe('local record store', () => {
  it('persists and validates isolated domain records', async () => {
    const { adapter } = memoryAdapter();
    await writeLocalRecord(adapter, 'trajectory:state', 'trajectory', { name: 'one' });
    await writeLocalRecord(adapter, 'daily:state', 'daily', { name: 'two' });

    await expect(
      readLocalRecord(
        adapter,
        'trajectory:state',
        'trajectory',
        (value): value is { name: string } =>
          !!value && typeof value === 'object' && 'name' in value
      )
    ).resolves.toEqual({ name: 'one' });
  });

  it('quarantines invalid records instead of loading them', async () => {
    const { adapter, records } = memoryAdapter();
    records.set('trajectory:state', { schemaVersion: 99, value: 'future' });
    await expect(
      readLocalRecord(
        adapter,
        'trajectory:state',
        'trajectory',
        (value): value is string => typeof value === 'string'
      )
    ).resolves.toBeNull();
    expect(records.has('trajectory:state')).toBe(false);
    expect([...records.keys()].some((key) => key.startsWith('quarantine:trajectory:state:'))).toBe(
      true
    );
  });

  it('reports unavailable or exhausted storage', async () => {
    const { adapter } = memoryAdapter({ failWrites: true });
    await expect(writeLocalRecord(adapter, 'key', 'domain', {})).rejects.toThrow('quota exceeded');
  });
});

describe('browser transaction durability', () => {
  afterEach(() => vi.unstubAllGlobals());

  function controlledDatabase() {
    const request = { result: undefined, onsuccess: () => {}, onerror: () => {} };
    const transaction = {
      error: new DOMException('Save aborted', 'AbortError'),
      oncomplete: () => {},
      onabort: () => {},
      onerror: () => {},
      objectStore: () => ({ put: () => request }),
    };
    const database = { transaction: () => transaction, close: vi.fn() };
    const open = { result: database, onsuccess: () => {} };
    vi.stubGlobal('indexedDB', {
      open: () => {
        queueMicrotask(() => open.onsuccess());
        return open;
      },
    });
    return { request, transaction, database };
  }

  it('does not acknowledge a successful request until its transaction commits', async () => {
    const { request, transaction, database } = controlledDatabase();
    let saved = false;
    const pending = browserRecordAdapter()
      .put('bucket', {})
      .then(() => {
        saved = true;
      });
    await Promise.resolve();
    await Promise.resolve();
    request.onsuccess();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(saved).toBe(false);
    transaction.oncomplete();
    await pending;
    expect(saved).toBe(true);
    expect(database.close).toHaveBeenCalledOnce();
  });

  it('rejects an abort even after the write request succeeded', async () => {
    const { request, transaction, database } = controlledDatabase();
    const pending = browserRecordAdapter().put('bucket', {});
    const rejected = expect(pending).rejects.toThrow('Save aborted');
    await Promise.resolve();
    await Promise.resolve();
    request.onsuccess();
    transaction.onabort();
    await rejected;
    expect(database.close).toHaveBeenCalledOnce();
  });
});
