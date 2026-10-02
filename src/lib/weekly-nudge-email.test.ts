import { afterEach, describe, expect, it, vi } from 'vitest';

// The cron sender is a self-contained .mjs (Wrangler bundles it directly).
// These tests drive it with a mocked env — D1 rows and a captured EMAIL
// binding — so the Sunday filter, skip-written rule, and send shape are
// verified without a real database or mailbox.
import { sendWeeklyNudges } from '../../weekly-nudge-email.mjs';
import { fallbackQuestion, QUESTION_FAMILIES, questionForFamily } from './weekly-questions';

type Row = Record<string, unknown>;

function makeEnv(opts: {
  users: Row[];
  writtenWeeks?: string[];
  counts?: { entries: number; commitments: number; dreams: number };
  gateway?: { fetch: (request: Request) => Promise<Response> };
}) {
  const sent: Array<{ to: string; subject: string; text: string; html: string }> = [];
  const writtenWeeks = new Set(opts.writtenWeeks ?? []);
  const counts = opts.counts ?? { entries: 0, commitments: 0, dreams: 0 };

  const query = (sql: string, args: unknown[]) => ({
    all: async () => {
      if (sql.includes('FROM User')) return { results: opts.users };
      if (sql.includes('DISTINCT category')) return { results: [] };
      return { results: [] };
    },
    first: async () => {
      if (sql.includes('FROM WeeklyLogEntry') && sql.includes('weekOf')) {
        const key = `${args[0]}:${args[1]}`;
        return writtenWeeks.has(key) ? 'entry-1' : null;
      }
      if (sql.includes('FROM WeeklyLogEntry')) return counts.entries;
      if (sql.includes('FROM Commitment')) return counts.commitments;
      if (sql.includes('FROM BucketListItem')) return counts.dreams;
      return null;
    },
  });

  return {
    sent,
    env: {
      DB: {
        prepare: (sql: string) => {
          const bound: unknown[] = [];
          const q = query(sql, bound);
          return {
            bind: (...args: unknown[]) => {
              bound.push(...args);
              return q;
            },
            all: q.all,
            first: q.first,
          };
        },
      },
      EMAIL: { send: async (msg: (typeof sent)[number]) => sent.push(msg) },
      FREE_AI: opts.gateway,
    },
  };
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function utcDayOfWeek(): number {
  const dayKey = new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC' }).format(new Date());
  return new Date(`${dayKey}T12:00:00Z`).getUTCDay();
}

const utcUser = {
  id: 'u1',
  name: 'Sarthak Tester',
  email: 'sarthak@example.com',
  timezone: 'UTC',
  weekStartsOn: 'monday',
  weeklyEmailOptIn: 1,
};

describe('sendWeeklyNudges', () => {
  it('classifies the cron email through the private managed gateway with bounded output', async () => {
    vi.useFakeTimers({ now: new Date('2026-10-04T12:00:00.000Z') });
    const family = QUESTION_FAMILIES[0]!;
    const gatewayFetch = vi.fn(async (request: Request) => {
      expect(new URL(request.url).pathname).toBe('/v1/chat/completions');
      expect(request.method).toBe('POST');
      expect(request.headers.get('x-gateway-project-id')).toBe('live');
      expect(request.headers.get('authorization')).toBe('Bearer gateway-managed');
      expect(request.signal.aborted).toBe(false);
      const body = (await request.json()) as {
        model: string;
        project_id: string;
        max_tokens: number;
        response_format: { type: string };
        messages: Array<{ content: string }>;
      };
      expect(body.model).toBe('auto');
      expect(body.project_id).toBe('live');
      expect(body.max_tokens).toBe(24);
      expect(body.response_format).toEqual({ type: 'json_object' });
      expect(body.messages[1]?.content).toContain('categorical signals');
      expect(body.messages[1]?.content).not.toContain('Sarthak Tester');
      return Response.json({ choices: [{ message: { content: JSON.stringify({ family }) } }] });
    });
    const externalFetch = vi.spyOn(globalThis, 'fetch');
    const { env, sent } = makeEnv({
      users: [utcUser],
      counts: { entries: 1, commitments: 0, dreams: 0 },
      gateway: { fetch: gatewayFetch },
    });

    await sendWeeklyNudges(env as never);

    expect(gatewayFetch).toHaveBeenCalledTimes(1);
    expect(externalFetch).not.toHaveBeenCalled();
    expect(sent).toHaveLength(1);
    expect(sent[0]?.text).toContain(questionForFamily(family, '2026-09-28').text);
  });

  it('keeps the deterministic email question when the managed gateway is absent', async () => {
    vi.useFakeTimers({ now: new Date('2026-10-04T12:00:00.000Z') });
    const externalFetch = vi.spyOn(globalThis, 'fetch');
    const { env, sent } = makeEnv({
      users: [utcUser],
      counts: { entries: 1, commitments: 0, dreams: 0 },
    });

    await sendWeeklyNudges(env as never);

    expect(externalFetch).not.toHaveBeenCalled();
    expect(sent).toHaveLength(1);
    expect(sent[0]?.text).toContain(fallbackQuestion('2026-09-28').text);
  });

  it('rejects an unknown managed family and uses the deterministic question bank', async () => {
    vi.useFakeTimers({ now: new Date('2026-10-04T12:00:00.000Z') });
    const gatewayFetch = vi.fn(async () =>
      Response.json({ choices: [{ message: { content: '{"family":"outside"}' } }] })
    );
    const { env, sent } = makeEnv({
      users: [utcUser],
      counts: { entries: 1, commitments: 0, dreams: 0 },
      gateway: { fetch: gatewayFetch },
    });

    await sendWeeklyNudges(env as never);

    expect(gatewayFetch).toHaveBeenCalledTimes(1);
    expect(sent).toHaveLength(1);
    expect(sent[0]?.text).toContain(fallbackQuestion('2026-09-28').text);
  });

  it('emails an opted-in user whose local day is Sunday and week is unwritten', async () => {
    const { env, sent } = makeEnv({ users: [utcUser] });
    await sendWeeklyNudges(env as never);
    if (utcDayOfWeek() === 0) {
      expect(sent).toHaveLength(1);
      expect(sent[0].to).toBe('sarthak@example.com');
      expect(sent[0].subject).toContain('week');
      expect(sent[0].text).toContain('Hi Sarthak');
      expect(sent[0].text).toContain('live.significanthobbies.com/journal');
      expect(sent[0].html).toContain('?');
    } else {
      expect(sent).toHaveLength(0);
    }
  });

  it('never nudges a week that is already on record', async () => {
    const written = [`u1:${currentWeekOf()}`];
    const { env, sent } = makeEnv({ users: [utcUser], writtenWeeks: written });
    await sendWeeklyNudges(env as never);
    expect(sent).toHaveLength(0);
  });

  it('sends nothing when no one opted in', async () => {
    const { env, sent } = makeEnv({ users: [] });
    await sendWeeklyNudges(env as never);
    expect(sent).toHaveLength(0);
  });

  it('a failed recipient query logs and exits instead of crashing the cron', async () => {
    const errorEnv = {
      DB: {
        prepare: () => ({
          all: async () => {
            throw new Error('no such table: User');
          },
        }),
      },
      EMAIL: { send: vi.fn() },
    };
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(sendWeeklyNudges(errorEnv as never)).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

function currentWeekOf(): string {
  const dayKey = new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC' }).format(new Date());
  const dow = new Date(`${dayKey}T12:00:00Z`).getUTCDay();
  const monday = new Date(`${dayKey}T00:00:00Z`);
  monday.setUTCDate(monday.getUTCDate() - ((dow + 6) % 7));
  return monday.toISOString().slice(0, 10);
}
