import { getCloudflareContext } from '@opennextjs/cloudflare';
import { and, eq } from 'drizzle-orm';

import { account } from '@/db/schema';
import { auth } from '@/lib/auth';
import { personalMcpProduct, verifyPersonalMcpGoogleSubject } from '@/lib/personal-mcp-auth';
import { db } from '@/server/db';

function json(payload: unknown, status = 200): Response {
  return Response.json(payload, { status, headers: { 'Cache-Control': 'no-store' } });
}

async function mcpGoogleSubject(
  request: Request,
  product: string,
  scope: string
): Promise<string | Response> {
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
  return googleId;
}

async function mcpSession(request: Request, products: string[]): Promise<Response> {
  const product = products[0] ?? '';
  const scope = request.headers.get('X-Personal-MCP-Scope') ?? '';
  const productConfig = personalMcpProduct(product, scope);
  if (products.length !== 1 || !productConfig) {
    return json({ code: 'FORBIDDEN', message: 'Unsupported MCP product or scope.' }, 403);
  }
  const googleId = await mcpGoogleSubject(request, product, scope);
  if (typeof googleId !== 'string') return googleId;
  let linkedAccounts: { userId: string }[];
  try {
    linkedAccounts = await db.query.account.findMany({
      where: and(eq(account.providerId, 'google'), eq(account.accountId, googleId)),
      columns: { userId: true },
      limit: 2,
    });
  } catch {
    return json(
      {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Account resolution is temporarily unavailable. Try again.',
      },
      503
    );
  }
  const linkedAccount = linkedAccounts.length === 1 ? linkedAccounts[0] : undefined;
  if (!linkedAccount?.userId) {
    return json(
      {
        code: 'FORBIDDEN',
        message: 'Link this Google account to your existing Live account before connecting Anchor.',
      },
      403
    );
  }
  return json({
    userId: linkedAccount.userId,
    mcpProduct: product,
    scope,
    audience: productConfig.audience,
    authorizationVersion: 1,
  });
}

export async function GET(request: Request): Promise<Response> {
  const products = new URL(request.url).searchParams.getAll('mcpProduct');
  if (products.length > 0) return mcpSession(request, products);

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
