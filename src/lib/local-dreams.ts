import {
  browserRecordAdapter,
  type LocalRecordAdapter,
  readLocalRecord,
  writeLocalRecord,
} from '~/lib/local-record-store';
import { normalizeDreamTitle } from '~/lib/dream-atlas';

export const LOCAL_DREAMS_KEY = 'onboarding:bucket-items';

export type LocalDreamInput = {
  title: string;
  description?: string;
  category?: string;
  sourceSlug?: string;
};

type LocalDreamRecord = Record<string, unknown> & {
  items?: unknown[];
};

export type AddLocalDreamsResult = {
  added: string[];
  duplicates: string[];
};

export type SetCallingDreamResult = {
  updated: boolean;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object';
}

function isLocalDreamRecord(value: unknown): value is LocalDreamRecord {
  return isObject(value) && (!('items' in value) || Array.isArray(value.items));
}

function titleFromStoredDream(value: unknown): string | null {
  if (typeof value === 'string') return value.trim() || null;
  return isObject(value) && typeof value.title === 'string' ? value.title.trim() || null : null;
}

export async function addDreamsToLocalRecord(
  inputs: LocalDreamInput[],
  adapter: LocalRecordAdapter = browserRecordAdapter()
): Promise<AddLocalDreamsResult> {
  const current =
    (await readLocalRecord(adapter, LOCAL_DREAMS_KEY, 'bucket-list', isLocalDreamRecord)) ?? {};
  const rawItems = Array.isArray(current.items) ? current.items : [];
  const seen = new Set(
    rawItems.flatMap((item) => {
      const title = titleFromStoredDream(item);
      return title ? [normalizeDreamTitle(title)] : [];
    })
  );
  const added: string[] = [];
  const duplicates: string[] = [];
  const nextItems = [...rawItems];

  for (const input of inputs) {
    const title = input.title.trim();
    const key = normalizeDreamTitle(title);
    if (!title || !key || seen.has(key)) {
      if (title) duplicates.push(title);
      continue;
    }
    seen.add(key);
    added.push(title);
    nextItems.push({
      title,
      status: 'planned',
      ...(input.description ? { description: input.description } : {}),
      ...(input.category ? { category: input.category } : {}),
      ...(input.sourceSlug ? { sourceSlug: input.sourceSlug } : {}),
    });
  }

  if (added.length > 0) {
    await writeLocalRecord(adapter, LOCAL_DREAMS_KEY, 'bucket-list', {
      ...current,
      items: nextItems,
    });
  }

  return { added, duplicates };
}

export async function setCallingDreamInLocalRecord(
  title: string,
  adapter: LocalRecordAdapter = browserRecordAdapter()
): Promise<SetCallingDreamResult> {
  const current = await readLocalRecord(
    adapter,
    LOCAL_DREAMS_KEY,
    'bucket-list',
    isLocalDreamRecord
  );
  if (!current || !Array.isArray(current.items)) return { updated: false };

  const key = normalizeDreamTitle(title);
  const selectedIndex = current.items.findIndex((item) => {
    const storedTitle = titleFromStoredDream(item);
    return storedTitle ? normalizeDreamTitle(storedTitle) === key : false;
  });
  if (selectedIndex === -1) return { updated: false };

  const selected = current.items[selectedIndex];
  const selectedTitle = titleFromStoredDream(selected);
  if (!selectedTitle) return { updated: false };
  const promoted = isObject(selected)
    ? { ...selected, status: 'in_progress' }
    : { title: selectedTitle, status: 'in_progress' };
  const nextItems = [promoted, ...current.items.filter((_, index) => index !== selectedIndex)];

  await writeLocalRecord(adapter, LOCAL_DREAMS_KEY, 'bucket-list', {
    ...current,
    items: nextItems,
  });
  return { updated: true };
}
