// @vitest-environment node

/**
 * Account and persistence qualification on real storage (P06 / live#14).
 *
 * Until now the suite proved the pure routing helpers and the IndexedDB
 * transaction contract, but the cross-account and durability claims lived only
 * in Playwright or in source-string assertions. This file runs the production
 * query and session code against a real SQLite database: the shipped
 * `migrations/d1` SQL is applied to `node:sqlite`, then wrapped in a minimal
 * D1 binding so `drizzle-orm/d1` — the same driver `src/server/db.ts` uses —
 * executes every query. Sessions are minted by a real better-auth handler and
 * verified through the app's own `~/lib/auth` module, whose database binding
 * is pointed at the same store, so issuance and verification cross the real
 * adapter boundary rather than a fixture.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync, type StatementSync } from 'node:sqlite';

import { type Auth, betterAuth, type BetterAuthOptions } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import * as schema from '~/db/schema';
import {
  account,
  bucketListItems,
  habitLogs,
  habits,
  session,
  user,
  users,
  verification,
} from '~/db/schema';
import {
  addBucketListItem,
  removeBucketListItem,
  updateBucketListItem,
  updateBucketListItemStatus,
} from '~/lib/actions/bucket-list';
import { importLocalAccountData } from '~/lib/actions/local-import';
import { getServerAuthSession } from '~/server/auth';
import { readLiveRecords, readLiveSummary } from './personal-platform-live';

const harness = vi.hoisted(() => ({
  database: null as MemoryD1 | null,
  db: null as ReturnType<typeof drizzle> | null,
}));

vi.mock('~/server/db', () => ({
  get db() {
    return harness.db;
  },
}));
vi.mock('~/server/auth', () => ({ getServerAuthSession: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn() }));
vi.mock('~/lib/analytics', () => ({ trackCoreAction: vi.fn() }));

const mockSession = vi.mocked(getServerAuthSession);

type SqlParam = string | number | bigint | null | Uint8Array;

function normalizeParam(value: unknown): SqlParam {
  if (value === undefined || value === null) return null;
  if (typeof value === 'boolean') return value ? 1 : 0;
  return value as SqlParam;
}

/**
 * The slice of the D1 binding contract `drizzle-orm/d1` actually calls:
 * `prepare().bind()` plus `run`/`all`/`raw`/`first`, and `batch` for grouped
 * writes. A SQL pattern can be armed via `failOn` so the next matching
 * statement rejects — the storage-failure leg of the retry contract.
 */
class MemoryD1 {
  private fault: RegExp | null = null;
  private readonly sqlite: DatabaseSync;

  constructor(sqlite: DatabaseSync) {
    this.sqlite = sqlite;
  }

  failOn(pattern: RegExp | null) {
    this.fault = pattern;
  }

  prepare(sql: string) {
    const fault = this.fault;
    const stmt = this.sqlite.prepare(sql);
    return new BoundStatement(stmt, () => fault?.test(sql) ?? false);
  }

  async batch(statements: BoundStatement[]) {
    this.sqlite.exec('BEGIN');
    try {
      const results = [];
      for (const statement of statements) results.push(await statement.all());
      this.sqlite.exec('COMMIT');
      return results;
    } catch (error) {
      this.sqlite.exec('ROLLBACK');
      throw error;
    }
  }

  exec(sql: string) {
    this.sqlite.exec(sql);
    return { count: 0, duration: 0 };
  }
}

class BoundStatement {
  private params: SqlParam[] = [];
  private readonly stmt: StatementSync;
  private readonly faulted: () => boolean;

  constructor(stmt: StatementSync, faulted: () => boolean) {
    this.stmt = stmt;
    this.faulted = faulted;
  }

  bind(...params: unknown[]) {
    this.params = params.map(normalizeParam);
    return this;
  }

  private guard() {
    if (this.faulted()) throw new Error('Injected D1 storage failure');
  }

  async run() {
    this.guard();
    const result = this.stmt.run(...this.params);
    return {
      success: true,
      meta: { changes: result.changes, last_row_id: Number(result.lastInsertRowid) },
    };
  }

  async all() {
    this.guard();
    return { results: this.stmt.all(...this.params) as Record<string, unknown>[], success: true };
  }

  async raw() {
    this.guard();
    return (this.stmt.all(...this.params) as Record<string, unknown>[]).map((row) =>
      Object.values(row)
    );
  }

  async first(column?: string) {
    this.guard();
    const row = this.stmt.get(...this.params) as Record<string, unknown> | undefined;
    if (!row) return null;
    return column === undefined ? row : (row[column] ?? null);
  }
}

function migratedDatabase(): MemoryD1 {
  const sqlite = new DatabaseSync(':memory:');
  const dir = join(process.cwd(), 'migrations', 'd1');
  for (const file of readdirSync(dir)
    .filter((name) => name.endsWith('.sql'))
    .sort()) {
    sqlite.exec(readFileSync(join(dir, file), 'utf8'));
  }
  return new MemoryD1(sqlite);
}

function issuer(db: ReturnType<typeof drizzle>): Auth<BetterAuthOptions> {
  return betterAuth({
    // Same local-development fallback secret as ~/lib/auth, so the signed
    // session cookies this issuer mints verify under the production module.
    secret: 'significant-hobbies-local-development-secret-32-chars',
    baseURL: 'http://localhost:3000',
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema: { user, session, account, verification },
    }),
    emailAndPassword: { enabled: true },
  }) as unknown as Auth<BetterAuthOptions>;
}

interface SignedInAccount {
  userId: string;
  /** Signed `token.hmac` cookie value, exactly as a browser would send it. */
  cookie: string;
  /** Raw session token as stored in `auth_session.token`. */
  token: string;
}

async function signUp(
  issuerAuth: Auth<BetterAuthOptions>,
  email: string,
  name: string
): Promise<SignedInAccount> {
  const response = await issuerAuth.handler(
    new Request('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
      body: JSON.stringify({ email, password: 'p06-test-password-not-a-secret', name }),
    })
  );
  if (response.status !== 200) {
    throw new Error(`sign-up failed with status ${response.status}`);
  }
  const cookie = response.headers
    .getSetCookie()
    .map((value) => /better-auth\.session_token=([^;]+)/.exec(value)?.[1])
    .find(Boolean);
  if (!cookie) throw new Error('sign-up did not set a session cookie');
  const body = (await response.json()) as { user: { id: string } };
  // Mirror src/lib/auth.ts's databaseHook: auth_user rows need a matching
  // app-level User row for ownership foreign keys.
  await harness.db!.insert(users).values({ id: body.user.id, name, email }).onConflictDoNothing();
  return {
    userId: body.user.id,
    cookie,
    token: cookie.split('.')[0] as string,
  };
}

/**
 * Production auth serves an https base URL, so its cookie can carry the
 * `__Secure-` prefix; send both spellings so the real lookup runs regardless
 * of which name the module resolves first.
 */
function sessionHeaders(cookie: string): Headers {
  return new Headers({
    cookie: `better-auth.session_token=${cookie}; __Secure-better-auth.session_token=${cookie}`,
  });
}

function requestWith(accountInfo: SignedInAccount, forwardedUserId: string): Request {
  return new Request('https://live.significanthobbies.com/api/personal-platform/live/summary', {
    headers: {
      cookie: `better-auth.session_token=${accountInfo.cookie}; __Secure-better-auth.session_token=${accountInfo.cookie}`,
      'X-Personal-User-Id': forwardedUserId,
    },
  });
}

function asUser(accountInfo: SignedInAccount) {
  mockSession.mockResolvedValue({
    user: {
      id: accountInfo.userId,
      email: null,
      name: null,
      image: null,
      username: null,
    },
  });
}

async function itemRows(userId: string) {
  return harness.db!.select().from(bucketListItems).where(eq(bucketListItems.userId, userId));
}

let db!: ReturnType<typeof drizzle>;
let store!: MemoryD1;
let auth!: Auth<BetterAuthOptions>;
let personalPlatformUser!: (request: Request) => Promise<string | Response>;

beforeAll(async () => {
  store = migratedDatabase();
  db = drizzle(store as unknown as Parameters<typeof drizzle>[0], { schema });
  harness.database = store;
  harness.db = db;
  // Loaded after the db binding is mocked so the production auth module's
  // adapter talks to this store rather than the Cloudflare context.
  auth = (await import('~/lib/auth')).auth as unknown as Auth<BetterAuthOptions>;
  personalPlatformUser = (await import('~/app/api/personal-platform/live/route-helpers'))
    .personalPlatformUser;
});

describe('session authority on durable storage', () => {
  it('resolves each issued cookie to its own account through the configured auth module', async () => {
    const issuerAuth = issuer(db);
    const a = await signUp(issuerAuth, 'p06-a@example.test', 'Account A');
    const b = await signUp(issuerAuth, 'p06-b@example.test', 'Account B');
    expect(a.userId).not.toBe(b.userId);

    const sessionA = await auth.api.getSession({ headers: sessionHeaders(a.cookie) });
    expect(sessionA?.user.id).toBe(a.userId);
    const sessionB = await auth.api.getSession({ headers: sessionHeaders(b.cookie) });
    expect(sessionB?.user.id).toBe(b.userId);
  });

  it('fails closed for expired and forged sessions instead of reviving them', async () => {
    const issuerAuth = issuer(db);
    const a = await signUp(issuerAuth, 'p06-expiry@example.test', 'Expiry Check');

    await expect(
      auth.api.getSession({ headers: sessionHeaders('forged-token-value') })
    ).resolves.toBeNull();

    await db
      .update(session)
      .set({ expiresAt: new Date(Date.now() - 60_000) })
      .where(eq(session.token, a.token));
    await expect(auth.api.getSession({ headers: sessionHeaders(a.cookie) })).resolves.toBeNull();

    const expired = await personalPlatformUser(requestWith(a, a.userId));
    expect(expired).toBeInstanceOf(Response);
    expect((expired as Response).status).toBe(401);
  });
});

describe('two-account read isolation', () => {
  it('scopes summaries and records to the session owner only', async () => {
    const issuerAuth = issuer(db);
    const a = await signUp(issuerAuth, 'p06-iso-a@example.test', 'Isolated A');
    const b = await signUp(issuerAuth, 'p06-iso-b@example.test', 'Isolated B');
    await db.insert(bucketListItems).values([
      { userId: a.userId, title: 'A private dream', status: 'planned' },
      { userId: b.userId, title: 'B private dream', status: 'done' },
    ]);

    const summaryA = await readLiveSummary(a.userId);
    expect(summaryA.activeCount).toBe(1);
    expect(summaryA.latest?.title).toBe('A private dream');

    const recordsB = await readLiveRecords(b.userId, {
      limit: 50,
      offset: 0,
      includeSensitive: true,
    });
    expect(recordsB.items).toHaveLength(1);
    expect(recordsB.items[0]?.record.title).toBe('B private dream');

    expect(await personalPlatformUser(requestWith(a, a.userId))).toBe(a.userId);
    expect(await personalPlatformUser(requestWith(b, b.userId))).toBe(b.userId);

    // B's session forwarded as A's id, and a forwarded id with no session at
    // all, both fail closed.
    const spoofed = await personalPlatformUser(requestWith(b, a.userId));
    expect(spoofed).toBeInstanceOf(Response);
    expect((spoofed as Response).status).toBe(401);

    const anonymous = await personalPlatformUser(
      new Request('https://live.significanthobbies.com/api/personal-platform/live/summary', {
        headers: { 'X-Personal-User-Id': a.userId },
      })
    );
    expect(anonymous).toBeInstanceOf(Response);
    expect((anonymous as Response).status).toBe(401);
  });
});

describe('bucket item writes follow durable commit', () => {
  it('a retried create after a lost acknowledgement reuses the stored row', async () => {
    const issuerAuth = issuer(db);
    const a = await signUp(issuerAuth, 'p06-retry@example.test', 'Retry Owner');
    asUser(a);

    const first = await addBucketListItem({ title: 'See the aurora' });
    expect(first).toEqual({ success: true, id: first.id, added: true });

    // The acknowledgement was lost on the wire, so the client sends the same
    // mutation again — the stored row must be returned, not duplicated.
    const retry = await addBucketListItem({ title: 'See the aurora' });
    expect(retry).toEqual({ success: true, id: first.id, added: false });
    await expect(itemRows(a.userId)).resolves.toHaveLength(1);

    // The dedupe key is normalized, so casing/whitespace variants of the same
    // retry converge on the same row too.
    const variant = await addBucketListItem({ title: 'SEE   THE AURORA!' });
    expect(variant).toEqual({ success: true, id: first.id, added: false });
    await expect(itemRows(a.userId)).resolves.toHaveLength(1);
  });

  it('rejects when storage fails instead of reporting success before commit', async () => {
    const issuerAuth = issuer(db);
    const a = await signUp(issuerAuth, 'p06-fault@example.test', 'Fault Owner');
    asUser(a);

    store.failOn(/insert/i);
    await expect(addBucketListItem({ title: 'Lost in transit' })).rejects.toThrow();
    store.failOn(null);
    await expect(itemRows(a.userId)).resolves.toHaveLength(0);
  });

  it('scopes status, edit and delete to the owner — a second account cannot mutate them', async () => {
    const issuerAuth = issuer(db);
    const a = await signUp(issuerAuth, 'p06-own-a@example.test', 'Owner A');
    const b = await signUp(issuerAuth, 'p06-own-b@example.test', 'Owner B');

    asUser(a);
    const created = await addBucketListItem({ title: 'A only dream' });
    expect(created.added).toBe(true);

    asUser(b);
    await expect(updateBucketListItemStatus(created.id as string, 'done')).resolves.toEqual({
      success: true,
    });
    await expect(updateBucketListItem(created.id as string, { targetYear: 2030 })).resolves.toEqual(
      { success: true }
    );
    await expect(removeBucketListItem(created.id as string)).resolves.toEqual({
      success: true,
    });

    // Every mutation returned success without touching A's row — the update
    // shapes are idempotent no-ops for a non-owner, so B's retries stay safe.
    const rows = await itemRows(a.userId);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.status).toBe('planned');
    expect(rows[0]?.targetYear).toBeNull();
    expect(rows[0]?.completedAt).toBeNull();

    asUser(a);
    await updateBucketListItemStatus(created.id as string, 'done');
    const [done] = await itemRows(a.userId);
    expect(done?.status).toBe('done');
    expect(done?.completedAt).toBeInstanceOf(Date);
    await removeBucketListItem(created.id as string);
    await expect(itemRows(a.userId)).resolves.toHaveLength(0);
  });
});

describe('local account import replay', () => {
  const localHabit = {
    id: 'local-habit-p06',
    name: 'Evening walk',
    status: 'active',
    targetFrequency: 'daily',
    icon: null,
  };

  it('replays queued mutations without duplicating rows and fails closed across accounts', async () => {
    const issuerAuth = issuer(db);
    const a = await signUp(issuerAuth, 'p06-imp-a@example.test', 'Import A');
    const b = await signUp(issuerAuth, 'p06-imp-b@example.test', 'Import B');

    const payload = {
      profile: null,
      onboarding: null,
      daily: {
        habits: [localHabit],
        logs: [
          {
            id: 'local-log-p06',
            habitId: localHabit.id,
            dayDate: '2026-09-19',
            completed: true,
          },
        ],
        journals: [],
      },
      commitments: null,
    };

    asUser(a);
    await expect(importLocalAccountData(payload)).resolves.toEqual({ success: true });
    // A lost acknowledgement means the client replays the whole import — the
    // stable local ids make the second run a no-op rather than a second copy.
    await expect(importLocalAccountData(payload)).resolves.toEqual({ success: true });
    expect(await db.select().from(habits).where(eq(habits.id, localHabit.id))).toHaveLength(1);
    expect(await db.select().from(habitLogs).where(eq(habitLogs.id, 'local-log-p06'))).toHaveLength(
      1
    );

    // B signing in on the same device must not absorb rows already owned by A:
    // the id guard rejects the replay rather than re-keying A's records.
    asUser(b);
    const crossAccount = await importLocalAccountData(payload);
    expect(crossAccount.success).toBe(false);
    expect(await db.select().from(habits).where(eq(habits.userId, b.userId))).toHaveLength(0);
  });
});
