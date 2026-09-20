'use server';

import { and, asc, desc, eq, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { commitments, habitLogs, habits, journalEntries, timelines, users } from '~/db/schema';
import { DEFAULT_FREQUENCY, isValidFrequency } from '~/lib/habit-utils';
import {
  habitCommitmentIdForVerifiedTarget,
  habitCommitmentLabel,
  type HabitCommitmentChoice,
} from '~/lib/habit-commitment';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';

// ── Habits ──────────────────────────────────────────────────────────────────

export async function getHabits() {
  const session = await getServerAuthSession();
  if (!session?.user) return [];

  const rows = await db
    .select()
    .from(habits)
    .where(and(eq(habits.userId, session.user.id), eq(habits.status, 'active')));

  return rows;
}

export async function getHabitCommitmentChoices(): Promise<HabitCommitmentChoice[]> {
  const session = await getServerAuthSession();
  if (!session?.user) return [];

  const rows = await db
    .select({
      id: commitments.id,
      hobbyName: commitments.hobbyName,
      goalDays: commitments.goalDays,
    })
    .from(commitments)
    .where(and(eq(commitments.userId, session.user.id), ne(commitments.status, 'abandoned')))
    .orderBy(desc(commitments.updatedAt));

  return rows.map((commitment) => ({
    id: commitment.id,
    label: habitCommitmentLabel(commitment.hobbyName, commitment.goalDays),
    href: '/commitments',
  }));
}

async function verifyOwnedHabitCommitment(
  userId: string,
  commitmentId: string
): Promise<string | null> {
  const [owned] = await db
    .select({ id: commitments.id })
    .from(commitments)
    .where(
      and(
        eq(commitments.id, commitmentId),
        eq(commitments.userId, userId),
        ne(commitments.status, 'abandoned')
      )
    )
    .limit(1);
  return owned?.id ?? null;
}

export async function createHabit(
  name: string,
  targetFrequency?: string,
  icon?: string,
  commitmentId?: string | null
): Promise<{ id: string; name: string } | null> {
  const session = await getServerAuthSession();
  if (!session?.user) return null;
  const trimmed = name.trim();
  if (!trimmed) return null;

  const freq = isValidFrequency(targetFrequency) ? targetFrequency! : DEFAULT_FREQUENCY;
  const trimmedIcon = icon?.trim() || null;
  const requestedCommitmentId = commitmentId?.trim() || null;
  const verifiedCommitmentId = requestedCommitmentId
    ? await verifyOwnedHabitCommitment(session.user.id, requestedCommitmentId)
    : null;

  const [habit] = await db
    .insert(habits)
    .values({
      userId: session.user.id,
      name: trimmed,
      targetFrequency: freq,
      icon: trimmedIcon,
      commitmentId: habitCommitmentIdForVerifiedTarget(requestedCommitmentId, verifiedCommitmentId),
    })
    .returning({ id: habits.id, name: habits.name });
  revalidatePath('/habits');
  return habit ?? null;
}

export async function setHabitCommitment(
  habitId: string,
  commitmentId: string | null
): Promise<boolean> {
  const session = await getServerAuthSession();
  if (!session?.user) return false;

  const requestedCommitmentId = commitmentId?.trim() || null;
  const verifiedCommitmentId = requestedCommitmentId
    ? await verifyOwnedHabitCommitment(session.user.id, requestedCommitmentId)
    : null;
  const [updated] = await db
    .update(habits)
    .set({
      commitmentId: habitCommitmentIdForVerifiedTarget(requestedCommitmentId, verifiedCommitmentId),
    })
    .where(and(eq(habits.id, habitId), eq(habits.userId, session.user.id)))
    .returning({ id: habits.id });

  if (!updated) return false;
  revalidatePath('/habits');
  return true;
}

export async function deleteHabit(id: string) {
  const session = await getServerAuthSession();
  if (!session?.user) return;

  await db
    .update(habits)
    .set({ status: 'archived' })
    .where(and(eq(habits.id, id), eq(habits.userId, session.user.id)));
  revalidatePath('/habits');
}

// ── Habit logs (check-ins) ──────────────────────────────────────────────────

export async function getHabitLogsForDate(dayDate: string) {
  const session = await getServerAuthSession();
  if (!session?.user) return [];

  const rows = await db
    .select()
    .from(habitLogs)
    .where(and(eq(habitLogs.userId, session.user.id), eq(habitLogs.dayDate, dayDate)));

  return rows;
}

export async function toggleHabitLog(habitId: string, dayDate: string, completed: boolean) {
  const session = await getServerAuthSession();
  if (!session?.user) return;

  // Upsert: if a log exists for this habit+date, update it; otherwise insert.
  const existing = await db
    .select()
    .from(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.dayDate, dayDate)))
    .limit(1);

  if (existing.length > 0) {
    await db.update(habitLogs).set({ completed }).where(eq(habitLogs.id, existing[0].id));
  } else {
    await db.insert(habitLogs).values({
      habitId,
      userId: session.user.id,
      dayDate,
      completed,
    });
  }
  revalidatePath('/habits');
}

// ── Journal entries ─────────────────────────────────────────────────────────

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

// ── Profile ─────────────────────────────────────────────────────────────────

export async function getUserProfile() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const rows = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);

  return rows[0] ?? null;
}
