'use server';

import { asc, eq } from 'drizzle-orm';

import { journalEntries } from '~/db/schema';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';

export async function getAllJournalEntries() {
  const session = await getServerAuthSession();
  if (!session?.user) return [];

  return db
    .select({
      id: journalEntries.id,
      dayDate: journalEntries.dayDate,
      amEntry: journalEntries.amEntry,
      pmEntry: journalEntries.pmEntry,
      timelineId: journalEntries.timelineId,
      commitmentId: journalEntries.commitmentId,
      noveltyId: journalEntries.noveltyId,
      noveltyText: journalEntries.noveltyText,
      noveltyCompleted: journalEntries.noveltyCompleted,
    })
    .from(journalEntries)
    .where(eq(journalEntries.userId, session.user.id))
    .orderBy(asc(journalEntries.dayDate));
}
