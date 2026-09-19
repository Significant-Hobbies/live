import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { session as authSession } from '~/db/schema';
import { auth } from '~/lib/auth';
import { db } from '~/server/db';

/**
 * Test-only expiry of the caller's own session row. Qualifying the
 * expired-session return path in a real browser (live#14, P06) requires the
 * stored session to actually age out — a fabricated cookie would not exercise
 * the session authority. Shares the neighboring complete-onboarding
 * endpoint's double gate, so it 404s outside local test-auth runs.
 */
export async function POST() {
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_TEST_AUTH !== '1') {
    return new NextResponse(null, { status: 404 });
  }
  const current = await auth.api.getSession({ headers: await headers() });
  if (!current?.session.token) return new NextResponse(null, { status: 401 });

  await db
    .update(authSession)
    .set({ expiresAt: new Date(Date.now() - 60_000) })
    .where(eq(authSession.token, current.session.token));
  return NextResponse.json({ success: true });
}
