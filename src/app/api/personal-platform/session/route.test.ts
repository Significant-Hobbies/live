// @vitest-environment node
import { SQLiteSyncDialect } from 'drizzle-orm/sqlite-core';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { verifyPersonalMcpGoogleSubject } from '@/lib/personal-mcp-auth';

const state = vi.hoisted(() => ({
  session: null as null | { user: { id: string; email: string } },
  appleSubject: null as string | null,
  mcpAccounts: [{ userId: 'linked-user' }],
  issuer: 'https://test.auth0.com/' as string | undefined,
  getSession: vi.fn(),
  findFirst: vi.fn(),
  findMany: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: state.getSession } },
}));

vi.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: () => ({ env: { AUTH0_ISSUER: state.issuer } }),
}));

vi.mock('@/server/db', () => ({
  db: {
    query: {
      account: {
        findFirst: state.findFirst,
        findMany: state.findMany,
      },
    },
  },
}));

import { GET } from './route';

describe('Personal Platform identity session', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.session = null;
    state.appleSubject = null;
    state.getSession.mockImplementation(async () => state.session);
    state.findFirst.mockImplementation(async () =>
      state.appleSubject === null ? undefined : { accountId: state.appleSubject }
    );
  });

  it('fails closed without a Better Auth bearer session', async () => {
    const response = await GET(
      new Request('https://live.significanthobbies.com/api/personal-platform/session')
    );
    expect(response.status).toBe(401);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });

  it('returns the permanent user ID and linked Apple subject', async () => {
    state.session = { user: { id: 'shared-user', email: 'owner@example.com' } };
    state.appleSubject = 'apple-subject';

    const response = await GET(
      new Request('https://live.significanthobbies.com/api/personal-platform/session', {
        headers: { Authorization: 'Bearer signed-session' },
      })
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).toEqual({
      userId: 'shared-user',
      email: 'owner@example.com',
      appleSubject: 'apple-subject',
    });
  });
});

describe('Personal Platform product MCP identity', () => {
  let signingKey: CryptoKey;
  let publicKey: JsonWebKey;
  const audience = 'https://mcp.significanthobbies.com/anchor/mcp';
  const now = Math.floor(Date.now() / 1_000);
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');

  async function token(
    claims: Record<string, unknown> = {},
    header = { alg: 'RS256', kid: 'test' }
  ) {
    const body = `${encode(header)}.${encode({
      iss: 'https://test.auth0.com/',
      aud: audience,
      sub: 'google-oauth2|google-123',
      iat: now - 10,
      exp: now + 300,
      scope: 'anchor.read anchor.write',
      ...claims,
    })}`;
    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      signingKey,
      new TextEncoder().encode(body)
    );
    return `${body}.${Buffer.from(signature).toString('base64url')}`;
  }

  async function request(claims = {}, scope = 'anchor.read', query = 'mcpProduct=anchor') {
    return GET(
      new Request(`https://live.significanthobbies.com/api/personal-platform/session?${query}`, {
        headers: {
          Authorization: `Bearer ${await token(claims)}`,
          'X-Personal-MCP-Scope': scope,
          Cookie: 'better-auth.session_token=valid-browser-cookie',
        },
      })
    );
  }

  beforeAll(async () => {
    const pair = (await crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
      },
      true,
      ['sign', 'verify']
    )) as CryptoKeyPair;
    signingKey = pair.privateKey;
    publicKey = await crypto.subtle.exportKey('jwk', pair.publicKey);
  });

  beforeEach(() => {
    vi.clearAllMocks();
    state.issuer = 'https://test.auth0.com/';
    state.mcpAccounts = [{ userId: 'linked-user' }];
    state.session = { user: { id: 'browser-user', email: 'private@example.com' } };
    state.getSession.mockImplementation(async () => state.session);
    state.findMany.mockImplementation(async () => state.mcpAccounts);
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ keys: [{ ...publicKey, kid: 'test' }] }))
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  it('supports independently supplied public keys and exact Auth0 audience arrays', async () => {
    const googleId = await verifyPersonalMcpGoogleSubject(
      await token({ aud: [audience, 'https://test.auth0.com/userinfo'] }),
      state.issuer,
      'anchor',
      'anchor.read',
      { keys: [{ ...publicKey, kid: 'test' }], now }
    );
    expect(googleId).toBe('google-123');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects a changed signature and an algorithm substitution', async () => {
    const signed = await token();
    const [header, payload, signature] = signed.split('.');
    const forged = `${header}.${payload}.${signature?.startsWith('A') ? 'B' : 'A'}${signature?.slice(1)}`;
    for (const value of [forged, await token({}, { alg: 'HS256', kid: 'test' })]) {
      expect(
        await verifyPersonalMcpGoogleSubject(value, state.issuer, 'anchor', 'anchor.read', {
          keys: [{ ...publicKey, kid: 'test' }],
          now,
        })
      ).toBeNull();
    }
  });

  it('rejects missing or ambiguous signing keys and unavailable JWKS', async () => {
    const signed = await token();
    const key = { ...publicKey, kid: 'test' };
    for (const keys of [[], [key, key]]) {
      expect(
        await verifyPersonalMcpGoogleSubject(signed, state.issuer, 'anchor', 'anchor.read', {
          keys,
          now,
        })
      ).toBeNull();
    }
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 503 }));
    expect((await request()).status).toBe(401);
    expect(state.getSession).not.toHaveBeenCalled();
  });

  it.each([301, 302, 307, 308])(
    'rejects a JWKS redirect (%s) without following it',
    async (status) => {
      vi.mocked(fetch).mockResolvedValue(
        new Response(null, {
          status,
          headers: { Location: 'https://untrusted.example/jwks.json' },
        })
      );
      expect((await request()).status).toBe(401);
      expect(fetch).toHaveBeenCalledOnce();
      expect(fetch).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({ redirect: 'manual' })
      );
      expect(state.findMany).not.toHaveBeenCalled();
    }
  );

  it('accepts at most 60 seconds of issuer clock lead while keeping expiry strict', async () => {
    for (const claims of [{ iat: now + 60 }, { nbf: now + 60 }]) {
      expect(
        await verifyPersonalMcpGoogleSubject(
          await token(claims),
          state.issuer,
          'anchor',
          'anchor.read',
          {
            keys: [{ ...publicKey, kid: 'test' }],
            now,
          }
        )
      ).toBe('google-123');
    }
    for (const claims of [{ iat: now + 61 }, { nbf: now + 61 }]) {
      expect(
        await verifyPersonalMcpGoogleSubject(
          await token(claims),
          state.issuer,
          'anchor',
          'anchor.read',
          {
            keys: [{ ...publicKey, kid: 'test' }],
            now,
          }
        )
      ).toBeNull();
    }
    expect(
      await verifyPersonalMcpGoogleSubject(
        await token({ exp: now }),
        state.issuer,
        'anchor',
        'anchor.read',
        {
          keys: [{ ...publicKey, kid: 'test' }],
          now,
        }
      )
    ).toBeNull();
  });

  it.each(['anchor.read', 'anchor.write'])(
    'resolves the linked Google provider identity for %s',
    async (scope) => {
      const response = await request({ scope: 'anchor.read anchor.write' }, scope);
      expect(response.status).toBe(200);
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect(await response.json()).toEqual({ userId: 'linked-user' });
      expect(state.getSession).not.toHaveBeenCalled();
      const query = state.findMany.mock.calls[0]?.[0];
      expect(query.columns).toEqual({ userId: true });
      expect(query.limit).toBe(2);
      const sql = new SQLiteSyncDialect().sqlToQuery(query.where);
      expect(sql.sql).toContain('"auth_account"."providerId" = ?');
      expect(sql.sql).toContain('"auth_account"."accountId" = ?');
      expect(sql.params).toEqual(['google', 'google-123']);
      expect(fetch).toHaveBeenCalledWith(
        new URL('https://test.auth0.com/.well-known/jwks.json'),
        expect.objectContaining({ redirect: 'manual' })
      );
    }
  );

  it.each([
    { aud: 'https://mcp.significanthobbies.com/reader/mcp' },
    { aud: `${audience}/other` },
    { iss: 'https://attacker.auth0.com/' },
    { scope: 'reader.read' },
    { scope: 'anchor.read', permissions: [] },
    { scope: 'anchor.read', permissions: ['anchor.read', 'anchor.write'] },
    { scope: undefined, permissions: ['anchor.read', 'anchor.write'] },
    { scope: undefined, scopes: ['anchor.read', 'anchor.write'] },
    { scope: ['anchor.read', 'anchor.write'] },
    { exp: now - 1 },
    { exp: now + 4_000 },
    { iat: now + 120 },
    { iat: undefined },
    { exp: undefined },
    { nbf: now + 120 },
    { nbf: 'yesterday' },
    { sub: 'auth0|google-123' },
    { sub: 'google-oauth2|' },
  ])('rejects invalid claims without native fallback: %j', async (claims) => {
    const response = await request(claims, 'anchor.write');
    expect(response.status).toBe(401);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(state.getSession).not.toHaveBeenCalled();
    expect(state.findFirst).not.toHaveBeenCalled();
    expect(state.findMany).not.toHaveBeenCalled();
  });

  it.each([
    ['mcpProduct=reader', 'reader.read'],
    ['mcpProduct=anchor', 'reader.read'],
    ['mcpProduct=anchor', ''],
    ['mcpProduct=', 'anchor.read'],
    ['mcpProduct=anchor&mcpProduct=anchor', 'anchor.read'],
  ])('rejects unknown or ambiguous product/scope: %s %s', async (query, scope) => {
    const response = await request({}, scope, query);
    expect(response.status).toBe(403);
    expect(state.getSession).not.toHaveBeenCalled();
    expect(state.findFirst).not.toHaveBeenCalled();
    expect(state.findMany).not.toHaveBeenCalled();
  });

  it('rejects an unlinked provider without matching a private email or creating an account', async () => {
    state.mcpAccounts = [];
    const response = await request({ email: 'private@example.com' });
    expect(response.status).toBe(403);
    expect(state.findMany).toHaveBeenCalledOnce();
    expect(await response.json()).toMatchObject({
      message: 'Link this Google account to your existing Live account before connecting Anchor.',
    });
    expect(state.getSession).not.toHaveBeenCalled();
  });

  it('returns a private no-store service error when account resolution fails', async () => {
    state.findMany.mockRejectedValueOnce(new Error('private database failure details'));
    const response = await request();
    expect(response.status).toBe(503);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).toEqual({
      code: 'SERVICE_UNAVAILABLE',
      message: 'Account resolution is temporarily unavailable. Try again.',
    });
    expect(state.getSession).not.toHaveBeenCalled();
  });

  it.each(['first-user', 'other-user'])(
    'fails closed for duplicate Google provider rows (second owner: %s)',
    async (secondUserId) => {
      state.mcpAccounts = [{ userId: 'first-user' }, { userId: secondUserId }];
      const response = await request();
      expect(response.status).toBe(403);
      expect(state.findMany).toHaveBeenCalledOnce();
      expect(state.getSession).not.toHaveBeenCalled();
    }
  );

  it('requires the original bearer token even when a valid native session exists', async () => {
    const response = await GET(
      new Request(
        'https://live.significanthobbies.com/api/personal-platform/session?mcpProduct=anchor',
        { headers: { 'X-Personal-MCP-Scope': 'anchor.read' } }
      )
    );
    expect(response.status).toBe(401);
    expect(state.getSession).not.toHaveBeenCalled();
  });

  it('fails closed when the trusted issuer is not configured', async () => {
    state.issuer = undefined;
    expect((await request()).status).toBe(401);
    expect(fetch).not.toHaveBeenCalled();
    expect(state.getSession).not.toHaveBeenCalled();
  });
});
