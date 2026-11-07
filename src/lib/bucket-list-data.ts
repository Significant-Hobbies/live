import { z } from 'zod';
import type { MyListItem } from '~/components/bucket-list/my-list-storage';
import { normalizeDreamTitle } from './dream-atlas';
import { EXPERIENCE_CATEGORIES } from './experiences';

export const bucketTransferItemSchema = z
  .object({
    id: z.string().min(1).max(100),
    title: z.string().trim().min(1).max(200),
    notes: z.string().max(500).nullable().optional(),
    category: z.enum(EXPERIENCE_CATEGORIES).nullable().optional(),
    status: z.enum(['planned', 'in_progress', 'done']),
    targetYear: z.number().int().min(1900).max(2200).nullable().optional(),
    sourceSlug: z.string().max(200).nullable().optional(),
    sourceItemTitle: z.string().max(200).nullable().optional(),
    createdAt: z.string().datetime().nullable().optional(),
    updatedAt: z.string().datetime().nullable().optional(),
    completedAt: z.string().datetime().nullable().optional(),
    steps: z
      .array(
        z
          .object({
            id: z.string().min(1).max(100),
            text: z.string().trim().min(1).max(200),
            done: z.boolean(),
            readOnly: z.boolean().optional(),
          })
          .strict()
      )
      .max(100),
    updates: z
      .array(
        z
          .object({
            id: z.uuid(),
            text: z.string().trim().min(1).max(2000),
            createdAt: z.string().datetime(),
          })
          .strict()
      )
      .max(100),
  })
  .strict();

export type BucketTransferItem = z.infer<typeof bucketTransferItemSchema>;
export type MyListQuery = {
  search: string;
  status: 'all' | MyListItem['status'];
  category: string;
};

export function matchesMyListQuery(item: MyListItem, query: MyListQuery) {
  const text = normalizeDreamTitle(
    [item.title, item.notes, ...item.steps.map((step) => step.text)].join(' ')
  );
  return (
    (!query.search || text.includes(normalizeDreamTitle(query.search))) &&
    (query.status === 'all' || item.status === query.status) &&
    (query.category === 'all' || (item.category || 'uncategorized') === query.category)
  );
}

export function bucketListExport(items: MyListItem[]) {
  return {
    format: 'live-bucket-list',
    version: 1,
    exportedAt: new Date().toISOString(),
    items: items.map((item) => {
      const fields = [
        'notes',
        'category',
        'targetYear',
        'sourceSlug',
        'sourceItemTitle',
        'createdAt',
        'updatedAt',
        'completedAt',
      ] as const;
      return {
        ...Object.fromEntries(fields.map((field) => [field, item[field] ?? null])),
        id: item.id,
        title: item.title,
        status: item.status,
        visibility: item.visibility ?? 'private',
        steps: item.steps,
        updates: item.updates ?? [],
      };
    }),
  };
}

export function downloadBucketJson(value: unknown, filename = 'live-bucket-list') {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' })
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
