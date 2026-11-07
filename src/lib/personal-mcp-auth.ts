const PRODUCTS = {
  anchor: {
    audience: 'https://mcp.significanthobbies.com/anchor/mcp',
    scopes: ['anchor.read', 'anchor.write'],
  },
} as const;

const GOOGLE_SUBJECT = /^google-oauth2\|([A-Za-z0-9._-]{3,256})$/u;
const MAX_TOKEN_LIFETIME_SECONDS = 3_600;
const CLOCK_TOLERANCE_SECONDS = 60;
type SigningKey = JsonWebKey & { kid?: string };

export function personalMcpProduct(product: string, scope: string) {
  if (product !== 'anchor' || !PRODUCTS.anchor.scopes.some((value) => value === scope)) {
    return null;
  }
  return PRODUCTS.anchor;
}

function auth0Issuer(value: string | undefined): string | null {
  try {
    const url = new URL(value ?? '');
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      url.port ||
      url.pathname !== '/' ||
      url.search ||
      url.hash ||
      !url.hostname.endsWith('.auth0.com')
    ) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

function decode(segment: string): Uint8Array<ArrayBuffer> {
  if (!/^[A-Za-z0-9_-]+$/u.test(segment)) throw new Error('Invalid JWT encoding');
  return Uint8Array.from(atob(segment.replace(/-/gu, '+').replace(/_/gu, '/')), (char) =>
    char.charCodeAt(0)
  );
}

function object(segment: string): Record<string, unknown> {
  const value: unknown = JSON.parse(new TextDecoder().decode(decode(segment)));
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Invalid JWT object');
  }
  return value as Record<string, unknown>;
}

/** Validate the original access token here; the forwarded scope header grants no authority. */
export async function verifyPersonalMcpGoogleSubject(
  token: string,
  issuerValue: string | undefined,
  product: string,
  requiredScope: string,
  options: { keys?: SigningKey[]; now?: number } = {}
): Promise<string | null> {
  const config = personalMcpProduct(product, requiredScope);
  const issuer = auth0Issuer(issuerValue);
  if (!config || !issuer || token.length > 16_384) return null;
  try {
    const segments = token.split('.');
    if (segments.length !== 3) return null;
    const [encodedHeader, encodedPayload, encodedSignature] = segments as [string, string, string];
    const header = object(encodedHeader);
    if (
      header.alg !== 'RS256' ||
      typeof header.kid !== 'string' ||
      !header.kid ||
      header.kid.length > 256 ||
      header.crit !== undefined ||
      header.b64 !== undefined
    ) {
      return null;
    }

    let keys = options.keys;
    if (!keys) {
      const response = await fetch(new URL('.well-known/jwks.json', issuer), {
        signal: AbortSignal.timeout(5_000),
        redirect: 'manual',
        cf: { cacheEverything: true, cacheTtl: 300 },
      } as RequestInit);
      if (!response.ok) return null;
      const jwks: { keys?: SigningKey[] } = await response.json();
      keys = jwks.keys;
    }
    if (!Array.isArray(keys)) return null;
    const candidates = keys.filter(
      (key) =>
        key.kid === header.kid &&
        key.kty === 'RSA' &&
        (key.alg === undefined || key.alg === 'RS256') &&
        (key.use === undefined || key.use === 'sig') &&
        (key.key_ops === undefined || key.key_ops.includes('verify'))
    );
    if (candidates.length !== 1) return null;
    const key = await crypto.subtle.importKey(
      'jwk',
      candidates[0] as JsonWebKey,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );
    if (
      !(await crypto.subtle.verify(
        'RSASSA-PKCS1-v1_5',
        key,
        decode(encodedSignature),
        new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
      ))
    ) {
      return null;
    }
    const payload = object(encodedPayload);
    const now = options.now ?? Date.now() / 1_000;
    const audiences = typeof payload.aud === 'string' ? [payload.aud] : payload.aud;
    // RBAC permissions describe capability, not this client's delegated consent.
    const grantedScopes = new Set(
      typeof payload.scope === 'string' ? payload.scope.split(' ').filter(Boolean) : []
    );
    const subject = typeof payload.sub === 'string' ? GOOGLE_SUBJECT.exec(payload.sub) : null;
    if (
      payload.iss !== issuer ||
      !Array.isArray(audiences) ||
      !audiences.every((audience) => typeof audience === 'string') ||
      !audiences.includes(config.audience) ||
      !Number.isSafeInteger(payload.iat) ||
      !Number.isSafeInteger(payload.exp) ||
      (payload.iat as number) > now + CLOCK_TOLERANCE_SECONDS ||
      (payload.exp as number) <= now ||
      (payload.exp as number) <= (payload.iat as number) ||
      (payload.exp as number) - (payload.iat as number) > MAX_TOKEN_LIFETIME_SECONDS ||
      (payload.nbf !== undefined &&
        (!Number.isSafeInteger(payload.nbf) ||
          (payload.nbf as number) > now + CLOCK_TOLERANCE_SECONDS ||
          (payload.nbf as number) >= (payload.exp as number))) ||
      !grantedScopes.has(requiredScope) ||
      !subject
    ) {
      return null;
    }
    return subject[1] ?? null;
  } catch {
    return null;
  }
}
