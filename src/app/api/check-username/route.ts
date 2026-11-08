import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { users } from '~/db/schema';
import { db } from '~/server/db';
import { PUBLIC_USERNAME_PATTERN } from '~/lib/public-username';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username || !PUBLIC_USERNAME_PATTERN.test(username)) {
    return NextResponse.json({ available: false, reason: 'invalid' });
  }

  const existing = await db.query.users.findFirst({
    where: eq(users.username, username),
    columns: { username: true },
  });

  return NextResponse.json({
    available: !existing,
    reason: existing ? 'taken' : null,
  });
}
