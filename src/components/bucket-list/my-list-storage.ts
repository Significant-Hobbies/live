import {
  addBucketListItem,
  removeBucketListItem,
  updateBucketListItem,
  updateBucketListItemStatus,
  updateBucketListItemVisibility,
} from '~/lib/actions/bucket-list';
import { addBucketStep, removeBucketStep, setBucketStepDone } from '~/lib/actions/bucket-steps';
import type { BucketStep } from '~/lib/bucket-steps';
import {
  browserRecordAdapter,
  readLocalRecord,
  writeLocalRecord,
  type LocalRecordAdapter,
} from '~/lib/local-record-store';

export type MyListItem = {
  id: string;
  title: string;
  status: 'planned' | 'in_progress' | 'done';
  targetYear?: number | null;
  visibility?: string;
  notes?: string | null;
  steps: BucketStep[];
  createdAt?: string | null;
  updatedAt?: string | null;
  completedAt?: string | null;
  [key: string]: unknown;
};

type NewItem = { title: string; description?: string; category?: string };
type ItemPatch = Partial<Pick<MyListItem, 'status' | 'targetYear' | 'visibility' | 'notes'>>;
type BucketRecord = { items?: Array<string | Record<string, unknown>>; [key: string]: unknown };

export interface MyListStorage {
  load(): Promise<MyListItem[]>;
  add(item: NewItem): Promise<MyListItem[]>;
  update(id: string, patch: ItemPatch): Promise<MyListItem[]>;
  remove(id: string): Promise<MyListItem[]>;
  addStep(id: string, text: string): Promise<MyListItem[]>;
  setStep(id: string, stepId: string, done: boolean): Promise<MyListItem[]>;
  removeStep(id: string, stepId: string): Promise<MyListItem[]>;
}

function newItem(input: NewItem, id = crypto.randomUUID()): MyListItem {
  return {
    ...input,
    id,
    status: 'planned',
    visibility: 'private',
    notes: input.description ?? null,
    steps: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function patchItem(item: MyListItem, patch: ItemPatch): MyListItem {
  return {
    ...item,
    ...patch,
    updatedAt: new Date().toISOString(),
    ...(patch.status
      ? { completedAt: patch.status === 'done' ? new Date().toISOString() : null }
      : {}),
  };
}

export function localMyListStorage(
  adapter: LocalRecordAdapter = browserRecordAdapter()
): MyListStorage {
  let record: BucketRecord = {};
  let items: MyListItem[] = [];
  // Leave unrecognised records in place on every write as well.
  let unrecognised: BucketRecord['items'] = [];
  async function persist(next: MyListItem[]) {
    const value = { ...record, items: [...next, ...(unrecognised ?? [])] };
    await writeLocalRecord(adapter, 'onboarding:bucket-items', 'bucket-list', value);
    record = value;
    items = next;
    return items;
  }
  async function update(id: string, patch: ItemPatch) {
    return persist(items.map((item) => (item.id === id ? patchItem(item, patch) : item)));
  }
  async function changeSteps(id: string, change: (steps: BucketStep[]) => BucketStep[]) {
    return persist(
      items.map((item) => (item.id === id ? { ...item, steps: change(item.steps) } : item))
    );
  }
  return {
    async load() {
      record =
        (await readLocalRecord(
          adapter,
          'onboarding:bucket-items',
          'bucket-list',
          (value): value is BucketRecord => !!value && typeof value === 'object'
        )) ?? {};
      unrecognised = [];
      items = (Array.isArray(record.items) ? record.items : []).flatMap((raw) => {
        const item = typeof raw === 'string' ? { title: raw } : raw;
        if (!item || typeof item.title !== 'string') {
          unrecognised?.push(raw);
          return [];
        }
        return [
          {
            ...item,
            id: typeof item.id === 'string' && item.id ? item.id : crypto.randomUUID(),
            title: item.title,
            status:
              item.status === 'done' || item.status === 'in_progress' ? item.status : 'planned',
            steps: Array.isArray(item.steps) ? item.steps : [],
          } as MyListItem,
        ];
      });
      return items;
    },
    add: (input) => persist([...items, newItem(input)]),
    update,
    remove: (id) => persist(items.filter((item) => item.id !== id)),
    addStep: (id, text) =>
      changeSteps(id, (steps) => [...steps, { id: crypto.randomUUID(), text, done: false }]),
    setStep: (id, stepId, done) =>
      changeSteps(id, (steps) =>
        steps.map((step) => (step.id === stepId ? { ...step, done } : step))
      ),
    removeStep: (id, stepId) =>
      changeSteps(id, (steps) => steps.filter((step) => step.id !== stepId)),
  };
}

export function serverMyListStorage(initial: MyListItem[]): MyListStorage {
  let items = initial;
  function replace(id: string, change: (item: MyListItem) => MyListItem) {
    items = items.map((item) => (item.id === id ? change(item) : item));
    return items;
  }
  return {
    load: async () => items,
    async add(input) {
      const result = await addBucketListItem(input);
      if (!result.success || !result.id) throw new Error('Item could not be saved');
      if (result.added === false) throw new Error('This item is already in your list.');
      items = [...items, newItem(input, result.id)];
      return items;
    },
    async update(id, patch) {
      if (patch.status) await updateBucketListItemStatus(id, patch.status);
      if (patch.visibility === 'public' || patch.visibility === 'private')
        await updateBucketListItemVisibility(id, patch.visibility);
      if ('targetYear' in patch || 'notes' in patch)
        await updateBucketListItem(id, {
          ...('targetYear' in patch ? { targetYear: patch.targetYear } : {}),
          ...('notes' in patch ? { description: patch.notes } : {}),
        });
      return replace(id, (item) => patchItem(item, patch));
    },
    async remove(id) {
      await removeBucketListItem(id);
      items = items.filter((item) => item.id !== id);
      return items;
    },
    async addStep(id, text) {
      const step = await addBucketStep(id, text);
      return replace(id, (item) => ({
        ...item,
        steps: [...item.steps, { id: step.id, text, done: false }],
      }));
    },
    async setStep(id, stepId, done) {
      await setBucketStepDone(stepId, done);
      return replace(id, (item) => ({
        ...item,
        steps: item.steps.map((step) => (step.id === stepId ? { ...step, done } : step)),
      }));
    },
    async removeStep(id, stepId) {
      await removeBucketStep(stepId);
      return replace(id, (item) => ({
        ...item,
        steps: item.steps.filter((step) => step.id !== stepId),
      }));
    },
  };
}
