import { bucketTransferItemSchema, type BucketTransferItem } from './bucket-list-data';
import {
  browserRecordAdapter,
  compareAndReplaceLocalRecord,
  type LocalEnvelope,
} from './local-record-store';

const LOCAL_BUCKET_KEY = 'onboarding:bucket-items';
type BucketRecord = { items: unknown[]; [key: string]: unknown };
export type LocalBucketSnapshot = {
  envelope: LocalEnvelope<BucketRecord>;
  items: BucketTransferItem[];
  invalid: number;
};

function object(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function withStableIds(raw: unknown): unknown {
  const value = typeof raw === 'string' ? { title: raw } : raw;
  if (!object(value)) return raw;
  return {
    ...value,
    id: typeof value.id === 'string' && value.id ? value.id : crypto.randomUUID(),
    ...(Array.isArray(value.steps)
      ? {
          steps: value.steps.map((step) =>
            object(step) ? { ...step, id: step.id || crypto.randomUUID() } : step
          ),
        }
      : {}),
    ...(Array.isArray(value.updates)
      ? {
          updates: value.updates.map((update) =>
            object(update) ? { ...update, id: update.id || crypto.randomUUID() } : update
          ),
        }
      : {}),
  };
}

function transferItem(raw: unknown) {
  if (!object(raw)) return null;
  const fields = [
    'id',
    'title',
    'notes',
    'category',
    'status',
    'targetYear',
    'sourceSlug',
    'sourceItemTitle',
    'createdAt',
    'updatedAt',
    'completedAt',
    'steps',
    'updates',
  ];
  const defined = Object.fromEntries(
    fields.filter((field) => raw[field] !== undefined).map((field) => [field, raw[field]])
  );
  const result = bucketTransferItemSchema.safeParse({
    status: 'planned',
    notes: raw.description ?? null,
    category: null,
    targetYear: null,
    sourceSlug: null,
    sourceItemTitle: null,
    createdAt: null,
    updatedAt: null,
    completedAt: null,
    steps: [],
    updates: [],
    ...defined,
  });
  return result.success ? result.data : null;
}

export async function readLocalBucketSnapshot(): Promise<LocalBucketSnapshot | null> {
  const raw = await browserRecordAdapter().get(LOCAL_BUCKET_KEY);
  if (raw == null) return null;
  if (
    !object(raw) ||
    raw.key !== LOCAL_BUCKET_KEY ||
    raw.domain !== 'bucket-list' ||
    raw.schemaVersion !== 1 ||
    !object(raw.value) ||
    !Array.isArray(raw.value.items)
  )
    throw new Error('This device list needs review. Your original copy has not been changed.');
  const envelope = {
    ...raw,
    value: { ...raw.value, items: raw.value.items.map(withStableIds) },
  } as LocalEnvelope<BucketRecord>;
  if (
    JSON.stringify(envelope) !== JSON.stringify(raw) &&
    !(await compareAndReplaceLocalRecord(LOCAL_BUCKET_KEY, raw, envelope))
  )
    throw new Error('Your device list changed. Retry to import the latest copy.');
  const items = envelope.value.items.flatMap((value) => {
    const item = transferItem(value);
    return item ? [item] : [];
  });
  return { envelope, items, invalid: envelope.value.items.length - items.length };
}

export async function archiveImportedBucketSnapshot(snapshot: LocalBucketSnapshot) {
  return compareAndReplaceLocalRecord(LOCAL_BUCKET_KEY, snapshot.envelope, undefined, true);
}
