import { describe, expect, it } from 'vitest';

import { type LocalRecordAdapter, readLocalRecord } from './local-record-store';
import {
  addDreamsToLocalRecord,
  LOCAL_DREAMS_KEY,
  setCallingDreamInLocalRecord,
} from './local-dreams';

function memoryAdapter(): LocalRecordAdapter & { values: Map<string, unknown> } {
  const values = new Map<string, unknown>();
  return {
    values,
    async get(key) {
      return values.get(key);
    },
    async put(key, value) {
      values.set(key, value);
    },
    async remove(key) {
      values.delete(key);
    },
  };
}

describe('addDreamsToLocalRecord', () => {
  it('appends dreams without replacing other local bucket metadata', async () => {
    const adapter = memoryAdapter();
    const first = await addDreamsToLocalRecord(
      [{ title: 'Go to space' }, { title: 'Start my band', category: 'creative' }],
      adapter
    );
    const second = await addDreamsToLocalRecord(
      [{ title: 'go-to-space' }, { title: 'Visit CES' }],
      adapter
    );

    expect(first.added).toEqual(['Go to space', 'Start my band']);
    expect(second.added).toEqual(['Visit CES']);
    expect(second.duplicates).toEqual(['go-to-space']);
    expect(adapter.values.has(LOCAL_DREAMS_KEY)).toBe(true);
  });

  it('does not write when every dream is already present', async () => {
    const adapter = memoryAdapter();
    await addDreamsToLocalRecord([{ title: 'Fly a plane' }], adapter);
    const before = adapter.values.get(LOCAL_DREAMS_KEY);
    const result = await addDreamsToLocalRecord([{ title: 'FLY A PLANE' }], adapter);

    expect(result.added).toEqual([]);
    expect(result.duplicates).toEqual(['FLY A PLANE']);
    expect(adapter.values.get(LOCAL_DREAMS_KEY)).toBe(before);
  });

  it('calls a dream forward without demoting other in-progress dreams', async () => {
    const adapter = memoryAdapter();
    await addDreamsToLocalRecord(
      [{ title: 'Start my band' }, { title: 'Go to space' }, { title: 'Run a marathon' }],
      adapter
    );
    await setCallingDreamInLocalRecord('Go to space', adapter);
    await setCallingDreamInLocalRecord('Run a marathon', adapter);

    const record = await readLocalRecord(
      adapter,
      LOCAL_DREAMS_KEY,
      'bucket-list',
      (value): value is { items: Array<{ title: string; status: string }> } =>
        Boolean(
          value && typeof value === 'object' && 'items' in value && Array.isArray(value.items)
        )
    );

    expect(record?.items.map((item) => item.title)).toEqual([
      'Run a marathon',
      'Go to space',
      'Start my band',
    ]);
    expect(record?.items[0]?.status).toBe('in_progress');
    expect(record?.items[1]?.status).toBe('in_progress');
  });

  it('does not rewrite the record when the selected dream does not exist', async () => {
    const adapter = memoryAdapter();
    await addDreamsToLocalRecord([{ title: 'Fly a plane' }], adapter);
    const before = adapter.values.get(LOCAL_DREAMS_KEY);

    expect(await setCallingDreamInLocalRecord('Go to space', adapter)).toEqual({
      updated: false,
    });
    expect(adapter.values.get(LOCAL_DREAMS_KEY)).toBe(before);
  });
});
