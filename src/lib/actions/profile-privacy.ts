'use server';

import { and, eq, isNull, notExists } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { users } from '~/db/schema';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';
import { PUBLIC_USERNAME_PATTERN } from '~/lib/public-username';

const Visibility = z.enum(['private', 'public']);

function profileHandle(current: string | null, raw: unknown, visibility: 'private' | 'public') {
  if (current) return { username: current, claiming: false };
  if (visibility === 'private') return { username: null, claiming: false };
  const requested = z.string().trim().regex(PUBLIC_USERNAME_PATTERN).safeParse(raw);
  return requested.success ? { username: requested.data, claiming: true } : null;
}

export async function setProfileVisibility(
  next: 'private' | 'public',
  newUsername?: string
): Promise<{ success: true; username: string } | { success: false; error: string }> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) return { success: false, error: 'Sign in to change profile visibility.' };
  const parsed = Visibility.safeParse(next);
  if (!parsed.success) return { success: false, error: 'Choose Private or Public.' };
  const current = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { username: true },
  });
  if (!current) return { success: false, error: 'Profile not found.' };
  const handle = profileHandle(current.username, newUsername, parsed.data);
  if (!handle)
    return {
      success: false,
      error: 'Choose a username with 3–20 lowercase letters, numbers or hyphens.',
    };
  const ownerState = current.username
    ? eq(users.username, current.username)
    : isNull(users.username);
  const available =
    handle.claiming && handle.username
      ? notExists(
          db.select({ id: users.id }).from(users).where(eq(users.username, handle.username))
        )
      : undefined;
  const changed = await db
    .update(users)
    .set({
      profileVisibility: parsed.data,
      ...(handle.claiming ? { username: handle.username } : {}),
    })
    .where(and(eq(users.id, session.user.id), ownerState, available))
    .returning({ username: users.username });
  if (!changed.length)
    return {
      success: false,
      error: 'That username is taken or your profile changed. Reload and try again.',
    };
  revalidatePath('/settings');
  if (changed[0].username) revalidatePath(`/u/${changed[0].username}`);
  revalidatePath('/sitemap.xml');
  return { success: true, username: changed[0].username ?? '' };
}
