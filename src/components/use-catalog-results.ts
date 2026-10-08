'use client';

import { useEffect, useRef, useState } from 'react';
import type { CatalogPage, CatalogQuery } from '~/lib/catalog-types';

function catalogSearchParams(query: CatalogQuery) {
  return new URLSearchParams({
    q: query.query.trim(),
    category: query.category,
    kind: query.kind,
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
}

export function useCatalogResults(query: CatalogQuery, enabled = true, initialData?: CatalogPage) {
  const key = catalogSearchParams(query).toString();
  const initialKey = useRef(initialData ? key : '');
  const initialPage = useRef(initialData);
  const [result, setResult] = useState<{
    key: string;
    data?: CatalogPage;
    loading: boolean;
    error: string;
  }>({
    key: initialData ? key : '',
    data: initialData,
    loading: enabled && !initialData,
    error: '',
  });
  useEffect(() => {
    if (!enabled) return;
    if (initialPage.current && key === initialKey.current) {
      setResult({ key, data: initialPage.current, loading: false, error: '' });
      return;
    }
    const controller = new AbortController();
    setResult({ key, loading: true, error: '' });
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(`/api/experience-catalog?${key}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Catalog unavailable');
        const data: CatalogPage = await response.json();
        if (!controller.signal.aborted) setResult({ key, data, loading: false, error: '' });
      } catch {
        if (!controller.signal.aborted)
          setResult({
            key,
            loading: false,
            error: 'Ideas could not be loaded. Try again in a moment.',
          });
      }
    }, 150);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [key, enabled]);
  return enabled && result.key === key
    ? result
    : { key, loading: enabled, error: '', data: undefined };
}
