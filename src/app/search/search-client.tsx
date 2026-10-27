'use client';

import { PublicSearchInput } from '~/components/public-pages/search-input';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

interface Props {
  initialQuery: string;
}

export function SearchPageClient({ initialQuery }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setValue(v);
      if (v.trim()) {
        router.push(`/search?q=${encodeURIComponent(v.trim())}`);
      } else {
        router.push('/search');
      }
    },
    [router]
  );

  return <PublicSearchInput value={value} handleChange={handleChange} />;
}
