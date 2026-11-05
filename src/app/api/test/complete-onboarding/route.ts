import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { users } from '~/db/schema';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_TEST_AUTH !== '1') {
    return new NextResponse(null, { status: 404 });
  }
  const session = await getServerAuthSession();
  if (!session?.user) return new NextResponse(null, { status: 401 });
  const { username } = z
    .object({
      username: z
        .string()
        .regex(/^[a-z0-9-]{3,30}$/)
        .optional(),
    })
    .parse(await request.json().catch(() => ({})));

  await db
    .update(users)
    .set({ onboardingCompletedAt: new Date(), ...(username ? { username } : {}) })
    .where(eq(users.id, session.user.id));
  return NextResponse.json({ success: true });
}
