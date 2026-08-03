'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { addBucketListItem } from '~/lib/actions/bucket-list';

export function QuickAddBucketItem() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [pending, startTransition] = useTransition();
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const value = title.trim();
        if (!value) return;
        startTransition(async () => {
          await addBucketListItem({ title: value });
          setTitle('');
          router.refresh();
        });
      }}
      className="flex flex-col gap-3 rounded-2xl bg-[#211e18] p-4 text-white sm:flex-row sm:items-center"
    >
      <label htmlFor="bucket-quick-add" className="shrink-0 font-serif text-xl">
        I want to…
      </label>
      <input
        id="bucket-quick-add"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        maxLength={200}
        placeholder="see the northern lights"
        className="min-h-11 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-base text-white placeholder:text-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e957]"
      />
      <button
        type="submit"
        disabled={pending || !title.trim()}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#f7e957] px-5 font-bold text-[#211e18] disabled:opacity-50"
      >
        <Plus className="size-4" />
        {pending ? 'Adding…' : 'Add it'}
      </button>
    </form>
  );
}
