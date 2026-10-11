import { describe, expect, it, vi } from 'vitest';
import { localMyListStorage } from './my-list-storage';
import type { LocalRecordAdapter } from '~/lib/local-record-store';

vi.mock('~/lib/actions/bucket-list', () => ({}));
vi.mock('~/lib/actions/bucket-steps', () => ({}));

function memoryAdapter(value: unknown) {
  const values = new Map([
    [
      'onboarding:bucket-items',
      {
        key: 'onboarding:bucket-items',
        domain: 'bucket-list',
        schemaVersion: 1,
        installationId: 'test',
        updatedAt: '2026-08-01',
        value,
      },
    ],
  ]);
  const adapter: LocalRecordAdapter = {
    get: async (key) => values.get(key),
    put: vi.fn(async (key, next) => {
      values.set(key, next as never);
    }),
    remove: vi.fn(),
  };
  return { adapter, values };
}

describe('local My list storage', () => {
  it('reads strings and objects without writing, then preserves unknown fields and stable IDs', async () => {
    const { adapter, values } = memoryAdapter({
      annualFocus: 'Adventure',
      custom: { keep: true },
      items: [
        'Learn to sail',
        { title: 'Print a Benchy', unusual: ['keep me'], status: 'in_progress' },
      ],
    });
    const storage = localMyListStorage(adapter);
    const items = await storage.load();
    expect(adapter.put).not.toHaveBeenCalled();
    const next = await storage.update(items[0]!.id, { notes: 'With a friend.' });
    expect(next[0]!.id).toBe(items[0]!.id);
    expect(next[1]!.unusual).toEqual(['keep me']);
    expect(values.get('onboarding:bucket-items')?.value).toMatchObject({
      annualFocus: 'Adventure',
      custom: { keep: true },
    });
    expect(await localMyListStorage(adapter).load()).toEqual(next);
  });
  it('lets steps finish in any order without completing the item', async () => {
    const { adapter } = memoryAdapter({ items: [{ id: 'item', title: 'Sail', extra: 42 }] });
    const storage = localMyListStorage(adapter);
    await storage.load();
    await storage.addStep('item', 'Find a club');
    const added = await storage.addStep('item', 'Ask a friend');
    const next = await storage.setStep('item', added[0]!.steps[1]!.id, true);
    expect(next[0]!.status).toBe('planned');
    expect(next[0]!.steps.map((step) => step.done)).toEqual([false, true]);
    expect(next[0]!.extra).toBe(42);
  });
  it('retains the prior record and loaded items when a transaction fails', async () => {
    const { adapter, values } = memoryAdapter({ items: ['Sail'] });
    const storage = localMyListStorage(adapter);
    const before = await storage.load();
    vi.mocked(adapter.put).mockRejectedValueOnce(new Error('aborted'));
    await expect(storage.add({ title: 'Swim' })).rejects.toThrow('aborted');
    expect(values.get('onboarding:bucket-items')?.value).toEqual({ items: ['Sail'] });
    expect(await storage.update(before[0]!.id, { status: 'done' })).toHaveLength(1);
  });
});
