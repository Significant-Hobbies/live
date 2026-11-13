'use client';

import { useEffect, useReducer, useState } from 'react';

export type AccountPresentation = {
  id: string;
  name: string | null;
  image: string | null;
  username: string | null;
};

function accountPresentation(value: unknown, userId: string): AccountPresentation | null {
  if (!value || typeof value !== 'object' || !('user' in value)) return null;
  const user = value.user;
  if (!user || typeof user !== 'object') return null;
  if (!('id' in user) || user.id !== userId) return null;
  if (!('name' in user) || (user.name !== null && typeof user.name !== 'string')) return null;
  if (!('image' in user) || (user.image !== null && typeof user.image !== 'string')) return null;
  if (!('username' in user) || (user.username !== null && typeof user.username !== 'string'))
    return null;
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
