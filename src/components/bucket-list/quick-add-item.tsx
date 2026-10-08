'use client';

import { useRouter } from 'next/navigation';
import { ManualItemInput } from './manual-item-input';
import { addBucketListItem } from '~/lib/actions/bucket-list';

export function QuickAddBucketItem() {
  const router = useRouter();
  return (
    <ManualItemInput
      dark
      canSubmitToCatalog
      onAdd={async (item) => {
        await addBucketListItem(item);
        router.refresh();
        return true;
      }}
    />
  );
}
