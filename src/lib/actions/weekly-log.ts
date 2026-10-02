'use server';

import { and, desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { users, weeklyLogEntries } from '~/db/schema';
import { normalizeWeekStartsOn, type WeekStartsOn } from '~/lib/weekly-log';
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
      turnsJson: weeklyLogEntries.turnsJson,
      updatedAt: weeklyLogEntries.updatedAt,
    })
    .from(weeklyLogEntries)
    .where(eq(weeklyLogEntries.userId, session.user.id))
    .orderBy(desc(weeklyLogEntries.weekOf));
}

const WEEK_OF_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_ENTRY_LENGTH = 8000;
const MAX_TURNS = 12;

type WeeklyTurn = { questionText: string; answer: string };

function cleanTurns(turns: WeeklyTurn[] | undefined): string | null {
  if (!Array.isArray(turns) || !turns.length) return null;
  const clean = turns
    .slice(0, MAX_TURNS)
    .map((turn) => ({
      questionText: String(turn.questionText ?? '').slice(0, 500),
      answer: String(turn.answer ?? '').slice(0, MAX_ENTRY_LENGTH),
    }))
    .filter((turn) => turn.questionText && turn.answer);
  return clean.length ? JSON.stringify(clean) : null;
}

export async function saveWeeklyLogEntry(
  weekOf: string,
  text: string,
  promptText?: string | null,
  turns?: WeeklyTurn[]
): Promise<{ saved: boolean }> {
  const session = await getServerAuthSession();
  if (!session?.user) return { saved: false };

  const trimmed = text.trim().slice(0, MAX_ENTRY_LENGTH);
  if (!WEEK_OF_PATTERN.test(weekOf) || !trimmed) return { saved: false };
  const cleanPrompt = promptText?.trim().slice(0, 500) || null;
  const cleanTurnsJson = cleanTurns(turns);

  const [existing] = await db
    .select({ id: weeklyLogEntries.id })
    .from(weeklyLogEntries)
    .where(and(eq(weeklyLogEntries.userId, session.user.id), eq(weeklyLogEntries.weekOf, weekOf)))
    .limit(1);

  if (existing) {
    await db
      .update(weeklyLogEntries)
      .set({
        text: trimmed,
        promptText: cleanPrompt,
        ...(turns === undefined ? {} : { turnsJson: cleanTurnsJson }),
        updatedAt: new Date(),
      })
      .where(eq(weeklyLogEntries.id, existing.id));
  } else {
    await db.insert(weeklyLogEntries).values({
      userId: session.user.id,
      weekOf,
      text: trimmed,
      promptText: cleanPrompt,
      turnsJson: cleanTurnsJson,
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

// ── Sunday email nudge ──────────────────────────────────────────────────────

export async function getWeeklyEmailOptIn(): Promise<boolean> {
  const session = await getServerAuthSession();
  if (!session?.user) return false;
  const [row] = await db
    .select({ weeklyEmailOptIn: users.weeklyEmailOptIn })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  return row?.weeklyEmailOptIn === true;
}

export async function setWeeklyEmailOptIn(optIn: boolean): Promise<{ saved: boolean }> {
  const session = await getServerAuthSession();
  if (!session?.user) return { saved: false };
  await db
    .update(users)
    .set({ weeklyEmailOptIn: optIn === true })
    .where(eq(users.id, session.user.id));
  revalidatePath('/journal');
  return { saved: true };
}
