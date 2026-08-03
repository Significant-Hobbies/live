import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { users } from '~/db/schema';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';

export async function POST() {
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_TEST_AUTH !== '1') {
    return new NextResponse(null, { status: 404 });
  }
  const session = await getServerAuthSession();
  if (!session?.user) return new NextResponse(null, { status: 401 });

  await db
    .update(users)
    .set({ onboardingCompletedAt: new Date() })
    .where(eq(users.id, session.user.id));
  return NextResponse.json({ success: true });
}
