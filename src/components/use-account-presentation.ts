'use client';

import { useEffect, useReducer, useState } from 'react';

type AccountPresentation = {
  id: string;
  name: string | null;
  image: string | null;
  username: string | null;
};

function nullableText(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

function accountPresentation(value: unknown, userId: string): AccountPresentation | null {
  if (!value || typeof value !== 'object' || !('user' in value)) return null;
  const user = value.user;
  if (!user || typeof user !== 'object') return null;
  if (!('id' in user) || user.id !== userId) return null;
  if (!('name' in user) || !nullableText(user.name)) return null;
  if (!('image' in user) || !nullableText(user.image)) return null;
  if (!('username' in user) || !nullableText(user.username)) return null;
  return { id: userId, name: user.name, image: user.image, username: user.username };
}

export function useAccountPresentation(userId: string | null) {
  const [user, setUser] = useState<AccountPresentation | null>(null);
  const [revision, refresh] = useReducer((value: number) => value + 1, 0);
  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    void fetch('/api/account-presentation', {
      credentials: 'same-origin',
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return;
        const nextUser = accountPresentation(await response.json(), userId);
        if (!controller.signal.aborted && nextUser) setUser(nextUser);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [userId, revision]);
  return { user: userId && user?.id === userId ? user : null, refresh };
}
