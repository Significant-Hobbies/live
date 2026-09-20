'use server';

import { and, asc, desc, eq, gt, lt, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { bucketListItems, commitments, users, weeklyLogEntries } from '~/db/schema';
import { dayKeyIn, isValidTimeZone } from '~/lib/day';
import {
  normalizeWeekStartsOn,
  STALE_DREAM_DAYS,
  weekStartFor,
  type WeekStartsOn,
} from '~/lib/weekly-log';
import { WEEKLY_QUESTIONS, type NudgeSignals } from '~/lib/weekly-questions';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';

// ── Entries ────────────────────────────────────────────────────────────────

export async function getWeeklyLogEntries() {
  const session = await getServerAuthSession();
  if (!session?.user) return [];

  return db
    .select({
      id: weeklyLogEntries.id,
      weekOf: weeklyLogEntries.weekOf,
      text: weeklyLogEntries.text,
      promptText: weeklyLogEntries.promptText,
      updatedAt: weeklyLogEntries.updatedAt,
    })
    .from(weeklyLogEntries)
    .where(eq(weeklyLogEntries.userId, session.user.id))
    .orderBy(desc(weeklyLogEntries.weekOf));
}

const WEEK_OF_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_ENTRY_LENGTH = 8000;

export async function saveWeeklyLogEntry(
  weekOf: string,
  text: string,
  promptText?: string | null
): Promise<{ saved: boolean }> {
  const session = await getServerAuthSession();
  if (!session?.user) return { saved: false };

  const trimmed = text.trim().slice(0, MAX_ENTRY_LENGTH);
  if (!WEEK_OF_PATTERN.test(weekOf) || !trimmed) return { saved: false };
  const cleanPrompt = promptText?.trim().slice(0, 500) || null;

  const [existing] = await db
    .select({ id: weeklyLogEntries.id })
    .from(weeklyLogEntries)
    .where(and(eq(weeklyLogEntries.userId, session.user.id), eq(weeklyLogEntries.weekOf, weekOf)))
    .limit(1);

  if (existing) {
    await db
      .update(weeklyLogEntries)
      .set({ text: trimmed, promptText: cleanPrompt, updatedAt: new Date() })
      .where(eq(weeklyLogEntries.id, existing.id));
  } else {
    await db.insert(weeklyLogEntries).values({
      userId: session.user.id,
      weekOf,
      text: trimmed,
      promptText: cleanPrompt,
    });
  }
  revalidatePath('/journal');
  revalidatePath('/history');
  return { saved: true };
}

// ── Week-start preference ──────────────────────────────────────────────────

export async function getWeekStartsOn(): Promise<WeekStartsOn> {
  const session = await getServerAuthSession();
  if (!session?.user) return 'monday';

  const [row] = await db
    .select({ weekStartsOn: users.weekStartsOn })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  return normalizeWeekStartsOn(row?.weekStartsOn);
}

export async function setWeekStartsOn(value: string): Promise<{ saved: boolean }> {
  const session = await getServerAuthSession();
  if (!session?.user) return { saved: false };
  const normalized = normalizeWeekStartsOn(value);
  await db.update(users).set({ weekStartsOn: normalized }).where(eq(users.id, session.user.id));
  revalidatePath('/journal');
  return { saved: true };
}

// ── Stale dreams & nudge signals ───────────────────────────────────────────

export type StaleDream = {
  id: string;
  title: string;
  category: string | null;
  daysSinceMovement: number;
};

export async function getStaleDreams(limit = 3): Promise<StaleDream[]> {
  const session = await getServerAuthSession();
  if (!session?.user) return [];

  const cutoff = new Date(Date.now() - STALE_DREAM_DAYS * 24 * 60 * 60 * 1000);
  const rows = await db
    .select({
      id: bucketListItems.id,
      title: bucketListItems.title,
      category: bucketListItems.category,
      updatedAt: bucketListItems.updatedAt,
    })
    .from(bucketListItems)
    .where(
      and(
        eq(bucketListItems.userId, session.user.id),
        ne(bucketListItems.status, 'done'),
        lt(bucketListItems.updatedAt, cutoff)
      )
    )
    .orderBy(asc(bucketListItems.updatedAt))
    .limit(limit);

  const dayMs = 24 * 60 * 60 * 1000;
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    daysSinceMovement: Math.max(0, Math.floor((Date.now() - row.updatedAt.getTime()) / dayMs)),
  }));
}

/**
 * Categorical signals for the nudge classifier — taxonomy values and counts
 * only, never titles or entry text.
 */
export async function getNudgeSignals(timezone: string | null): Promise<NudgeSignals> {
  const session = await getServerAuthSession();
  const tz = isValidTimeZone(timezone ?? '') ? timezone : null;
  const empty: NudgeSignals = {
    staleDreamCategories: [],
    entriesLastMonth: 0,
    activeCommitments: 0,
    activeDreams: 0,
    isSuggestedDay: true,
  };
  if (!session?.user) return empty;

  const stale = await getStaleDreams(5);
  const monthAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);
  const [recentEntries, activeCommitmentRows, activeDreamRows] = await Promise.all([
    db
      .select({ id: weeklyLogEntries.id })
      .from(weeklyLogEntries)
      .where(
        and(eq(weeklyLogEntries.userId, session.user.id), gt(weeklyLogEntries.updatedAt, monthAgo))
      ),
    db
      .select({ id: commitments.id })
      .from(commitments)
      .where(and(eq(commitments.userId, session.user.id), ne(commitments.status, 'abandoned'))),
    db
      .select({ id: bucketListItems.id })
      .from(bucketListItems)
      .where(and(eq(bucketListItems.userId, session.user.id), ne(bucketListItems.status, 'done'))),
  ]);

  const today = dayKeyIn(tz);
  return {
    staleDreamCategories: [
      ...new Set(stale.map((dream) => dream.category).filter((c): c is string => !!c)),
    ],
    entriesLastMonth: recentEntries.length,
    activeCommitments: activeCommitmentRows.length,
    activeDreams: activeDreamRows.length,
    isSuggestedDay: new Date(`${today}T00:00:00Z`).getUTCDay() === 0,
  };
}

/** Question ids to exclude — derived from the prompts already served. */
export async function getRecentPromptIds(): Promise<string[]> {
  const session = await getServerAuthSession();
  if (!session?.user) return [];

  const rows = await db
    .select({ promptText: weeklyLogEntries.promptText })
    .from(weeklyLogEntries)
    .where(eq(weeklyLogEntries.userId, session.user.id))
    .orderBy(desc(weeklyLogEntries.weekOf))
    .limit(8);

  const served = new Set(rows.map((r) => r.promptText).filter(Boolean));
  return WEEKLY_QUESTIONS.filter((q) => served.has(q.text)).map((q) => q.id);
}
