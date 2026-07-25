'use server';

import { and, asc, desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { commitments, stamps, users } from '~/db/schema';
import { dayKeyIn } from '~/lib/day';
import {
  computeStreak,
  dayIndexFor,
  evaluateStreakBadges,
  inferProofType,
  isCommitmentComplete,
  normalizeProofUrl,
  type StampRow,
} from '~/lib/commitments';
import { parseStringArray } from '~/lib/utils';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';

const StartCommitmentSchema = z.object({
  hobbyName: z.string().min(1).max(80),
  goalDays: z.number().int().min(1).max(1000).default(30),
});

export async function startCommitment(input: {
  hobbyName: string;
  goalDays?: number;
}): Promise<{ success: boolean; commitmentId?: string; error?: string }> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) throw new Error('Not authenticated');

  const parsed = StartCommitmentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Invalid commitment input' };
  }

  // Block duplicate active commitments for the same hobby — one streak per
  // hobby at a time keeps the grid legible.
  const existing = await db.query.commitments.findFirst({
    where: and(
      eq(commitments.userId, session.user.id),
      eq(commitments.hobbyName, parsed.data.hobbyName),
      eq(commitments.status, 'active')
    ),
    columns: { id: true },
  });
  if (existing) {
    return {
      success: false,
      error: `You already have an active commitment for ${parsed.data.hobbyName}`,
    };
  }

  const [created] = await db
    .insert(commitments)
    .values({
      userId: session.user.id,
      hobbyName: parsed.data.hobbyName,
      goalDays: parsed.data.goalDays,
      status: 'active',
      startDate: new Date(),
    })
    .returning({ id: commitments.id });

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { username: true },
  });
  if (user?.username) revalidatePath(`/u/${user.username}`);
  revalidatePath('/commitments');
  revalidatePath('/dashboard');

  return { success: true, commitmentId: created?.id };
}

const LogStampSchema = z.object({
  commitmentId: z.string().min(1).max(40),
  proofUrl: z.string().min(1).max(2000),
  note: z.string().max(500).optional(),
});

export async function logStamp(input: {
  commitmentId: string;
  proofUrl: string;
  note?: string;
}): Promise<{ success: boolean; newBadges?: string[]; error?: string }> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) throw new Error('Not authenticated');

  const parsed = LogStampSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Invalid stamp input' };
  }

  const proofUrl = normalizeProofUrl(parsed.data.proofUrl);
  if (!proofUrl) {
    return { success: false, error: 'Proof is required' };
  }
  const proofType = inferProofType(proofUrl);

  // Verify ownership + active status
  const commitment = await db.query.commitments.findFirst({
    where: and(
      eq(commitments.id, parsed.data.commitmentId),
      eq(commitments.userId, session.user.id)
    ),
  });
  if (!commitment) {
    return { success: false, error: 'Commitment not found' };
  }
  if (commitment.status !== 'active') {
    return { success: false, error: 'This commitment is no longer active' };
  }

  // Stamp against the user's own calendar day, not the server's. Reading the
  // zone here rather than using `new Date()` locally keeps "one stamp per day"
  // aligned with the day the user believes they are in.
  const stamper = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { timezone: true },
  });
  const dayDate = dayKeyIn(stamper?.timezone);
  const dayIndex = dayIndexFor(commitment.startDate, dayDate);

  // One stamp per day — enforced by unique index, but check first to give a
  // friendly error instead of a raw constraint violation.
  const existing = await db.query.stamps.findFirst({
    where: and(eq(stamps.commitmentId, commitment.id), eq(stamps.dayDate, dayDate)),
    columns: { id: true },
  });
  if (existing) {
    return { success: false, error: 'You already stamped today for this commitment' };
  }

  await db.insert(stamps).values({
    commitmentId: commitment.id,
    userId: session.user.id,
    dayDate,
    dayIndex,
    proofUrl,
    proofType,
    note: parsed.data.note?.trim() || null,
  });

  // Evaluate streak badges across all of the user's commitments.
  const allCommitments = await db.query.commitments.findMany({
    where: eq(commitments.userId, session.user.id),
  });
  let longestStreak = 0;
  for (const c of allCommitments) {
    const cStamps = await db.query.stamps.findMany({
      where: eq(stamps.commitmentId, c.id),
      columns: { dayDate: true, dayIndex: true, proofUrl: true, proofType: true, note: true },
      orderBy: [asc(stamps.dayDate)],
    });
    const info = computeStreak(cStamps as StampRow[]);
    if (info.longestStreak > longestStreak) longestStreak = info.longestStreak;
  }
  const shouldEarn = evaluateStreakBadges(longestStreak);

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { earnedBadges: true, username: true },
  });
  const earnedBadges = parseStringArray(user?.earnedBadges);
  const newBadges = shouldEarn.filter((b) => !earnedBadges.includes(b));
  if (newBadges.length > 0 && user) {
    await db
      .update(users)
      .set({ earnedBadges: JSON.stringify([...earnedBadges, ...newBadges]) })
      .where(eq(users.id, session.user.id));
  }

  // Mark commitment complete if goal reached.
  const freshStamps = await db.query.stamps.findMany({
    where: eq(stamps.commitmentId, commitment.id),
    columns: { dayDate: true },
  });
  if (isCommitmentComplete(freshStamps as StampRow[], commitment.goalDays)) {
    await db
      .update(commitments)
      .set({ status: 'completed', completedAt: new Date(), updatedAt: new Date() })
      .where(eq(commitments.id, commitment.id));
  } else {
    await db
      .update(commitments)
      .set({ updatedAt: new Date() })
      .where(eq(commitments.id, commitment.id));
  }

  if (user?.username) revalidatePath(`/u/${user.username}`);
  revalidatePath('/commitments');
  revalidatePath('/dashboard');

  return { success: true, newBadges };
}

export async function abandonCommitment(commitmentId: string): Promise<{ success: boolean }> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) throw new Error('Not authenticated');

  await db
    .update(commitments)
    .set({ status: 'abandoned', updatedAt: new Date() })
    .where(and(eq(commitments.id, commitmentId), eq(commitments.userId, session.user.id)));

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { username: true },
  });
  if (user?.username) revalidatePath(`/u/${user.username}`);
  revalidatePath('/commitments');
  revalidatePath('/dashboard');

  return { success: true };
}

/**
 * Fetch the current user's commitments with stamps attached, for the
 * commitments page and dashboard.
 */
export async function getMyCommitments() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) return [];

  const userCommitments = await db.query.commitments.findMany({
    where: eq(commitments.userId, session.user.id),
    orderBy: (c) => [desc(c.createdAt)],
  });

  const withStamps = await Promise.all(
    userCommitments.map(async (c) => {
      const cStamps = await db.query.stamps.findMany({
        where: eq(stamps.commitmentId, c.id),
        orderBy: [asc(stamps.dayDate)],
      });
      return { ...c, stamps: cStamps as StampRow[] };
    })
  );
  return withStamps;
}

/**
 * Fetch a profile owner's commitments + stamps for the profile view.
 *
 * Abandoned commitments are always hidden. Beyond that, only commitments the
 * user has explicitly marked public are returned — `includePrivate` is for the
 * owner viewing their own profile, so they can see and toggle what visitors
 * cannot. Never pass it for a visitor request.
 */
export async function getPublicCommitmentsForUser(userId: string, includePrivate = false) {
  const userCommitments = await db.query.commitments.findMany({
    where: and(eq(commitments.userId, userId)),
    orderBy: (c) => [desc(c.createdAt)],
  });
  const visible = userCommitments.filter(
    (c) => c.status !== 'abandoned' && (includePrivate || c.visibility === 'public')
  );

  const withStamps = await Promise.all(
    visible.map(async (c) => {
      const cStamps = await db.query.stamps.findMany({
        where: eq(stamps.commitmentId, c.id),
        orderBy: [asc(stamps.dayDate)],
      });
      return { ...c, stamps: cStamps as StampRow[] };
    })
  );
  return withStamps;
}

// ─── Profile visibility ─────────────────────────────────────────────────────

/**
 * Opt a commitment in or out of the owner's public profile.
 *
 * Commitments are private by default, so this is the only way one becomes
 * visible to visitors.
 */
export async function setCommitmentVisibility(
  commitmentId: string,
  isPublic: boolean
): Promise<{ success: boolean; error?: string }> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) return { success: false, error: 'Not authenticated' };

  const owned = await db.query.commitments.findFirst({
    where: and(eq(commitments.id, commitmentId), eq(commitments.userId, session.user.id)),
    columns: { id: true },
  });
  if (!owned) return { success: false, error: 'Commitment not found' };

  await db
    .update(commitments)
    .set({ visibility: isPublic ? 'public' : 'private', updatedAt: new Date() })
    .where(eq(commitments.id, commitmentId));

  const me = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { username: true },
  });
  if (me?.username) revalidatePath(`/u/${me.username}`);
  revalidatePath('/commitments');

  return { success: true };
}
