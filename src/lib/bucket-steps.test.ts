import { describe, expect, it } from 'vitest';
import { visibleBucketSteps } from './bucket-steps';

describe('visibleBucketSteps', () => {
  it('keeps manual steps and only completed legacy evidence in their original order', () => {
    const rows = [
      {
        id: '1',
        questId: 'bc-active',
        type: 'static',
        title: 'Generated active',
        status: 'active',
      },
      { id: '2', questId: 'step-a', type: 'bucket-step', title: 'My step', status: 'active' },
      {
        id: '3',
        questId: 'bc-done',
        type: 'rediscovery',
        title: 'Lived evidence',
        status: 'completed',
      },
      { id: '4', questId: 'bc-abandoned', type: 'static', title: 'Abandoned', status: 'abandoned' },
      { id: '5', questId: 'sq-other', type: 'static', title: 'Unrelated', status: 'completed' },
      { id: '6', questId: 'step-b', type: 'bucket-step', title: 'Done step', status: 'completed' },
      {
        id: '7',
        questId: 'step-c',
        type: 'bucket-step',
        title: 'Still manual',
        status: 'abandoned',
      },
    ];
    const original = structuredClone(rows);
    expect(visibleBucketSteps(rows)).toEqual([
      { id: '2', text: 'My step', done: false },
      { id: '3', text: 'Lived evidence', done: true, readOnly: true },
      { id: '6', text: 'Done step', done: true },
      { id: '7', text: 'Still manual', done: false },
    ]);
    expect(rows).toEqual(original);
  });
});
