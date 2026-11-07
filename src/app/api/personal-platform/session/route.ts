import { getCloudflareContext } from '@opennextjs/cloudflare';
import { and, eq } from 'drizzle-orm';

import { account } from '@/db/schema';
import { auth } from '@/lib/auth';
import { personalMcpProduct, verifyPersonalMcpGoogleSubject } from '@/lib/personal-mcp-auth';
import { db } from '@/server/db';

function json(payload: unknown, status = 200): Response {
  return Response.json(payload, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function GET(request: Request): Promise<Response> {
  const products = new URL(request.url).searchParams.getAll('mcpProduct');
  if (products.length > 0) {
    const product = products[0] ?? '';
    const scope = request.headers.get('X-Personal-MCP-Scope') ?? '';
    if (products.length !== 1 || !personalMcpProduct(product, scope)) {
      return json({ code: 'FORBIDDEN', message: 'Unsupported MCP product or scope.' }, 403);
    }
    const bearer = /^Bearer ([^\s]+)$/iu.exec(request.headers.get('Authorization') ?? '');
    if (!bearer) {
      return json({ code: 'UNAUTHORIZED', message: 'A product access token is required.' }, 401);
    }
    let googleId: string | null = null;
    try {
      googleId = await verifyPersonalMcpGoogleSubject(
        bearer[1] ?? '',
        getCloudflareContext().env.AUTH0_ISSUER,
        product,
        scope
      );
    } catch {
      // Missing Worker configuration must never fall back to the browser session.
    }
    if (!googleId) {
      return json({ code: 'UNAUTHORIZED', message: 'Invalid product access token.' }, 401);
    }
    const linkedAccount = await db.query.account.findFirst({
      where: and(eq(account.providerId, 'google'), eq(account.accountId, googleId)),
      columns: { userId: true },
    });
    if (!linkedAccount?.userId) {
      return json(
        { code: 'FORBIDDEN', message: 'Sign in to Live with this Google account first.' },
        403
      );
    }
    return json({ userId: linkedAccount.userId });
  }

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user.id) {
    return json({ code: 'UNAUTHORIZED', message: 'Sign in to continue.' }, 401);
  }

  const appleAccount = await db.query.account.findFirst({
    where: and(eq(account.userId, session.user.id), eq(account.providerId, 'apple')),
    columns: { accountId: true },
  });

  return json({
    userId: session.user.id,
    email: session.user.email,
    appleSubject: appleAccount?.accountId ?? null,
  });
}
