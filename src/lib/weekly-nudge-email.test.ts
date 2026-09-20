import { describe, expect, it, vi } from 'vitest';

// The cron sender is a self-contained .mjs (Wrangler bundles it directly).
// These tests drive it with a mocked env — D1 rows and a captured EMAIL
// binding — so the Sunday filter, skip-written rule, and send shape are
// verified without a real database or mailbox.
import { sendWeeklyNudges } from '../../weekly-nudge-email.mjs';

type Row = Record<string, unknown>;

function makeEnv(opts: {
  users: Row[];
  writtenWeeks?: string[];
  counts?: { entries: number; commitments: number; dreams: number };
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
    },
  };
}

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
