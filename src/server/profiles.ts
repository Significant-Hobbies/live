import { eq } from 'drizzle-orm';

import { bucketListItems, users } from '~/db/schema';
import { and, desc } from 'drizzle-orm';
import { db } from '~/server/db';

/** A private profile is available only to its authenticated owner. */
export async function getVisibleProfile(username: string, viewerId?: string | null) {
  const profile = await db.query.users.findFirst({
    where: eq(users.username, username),
    columns: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      website: true,
      creed: true,
      createdAt: true,
      earnedBadges: true,
      birthYear: true,
      profileVisibility: true,
    },
  });
  if (!profile || (profile.profileVisibility !== 'public' && profile.id !== viewerId)) return null;
  return profile;
}

/** Notes, steps and progress updates are never part of the public projection. */
export function getPublicProfileItems(userId: string) {
  return db
    .select({
      id: bucketListItems.id,
      title: bucketListItems.title,
      category: bucketListItems.category,
      status: bucketListItems.status,
      targetYear: bucketListItems.targetYear,
    })
    .from(bucketListItems)
    .where(and(eq(bucketListItems.userId, userId), eq(bucketListItems.visibility, 'public')))
    .orderBy(desc(bucketListItems.createdAt));
}
