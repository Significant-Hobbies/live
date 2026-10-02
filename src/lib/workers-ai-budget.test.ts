import { describe, expect, it, vi } from 'vitest';
import { withWorkersAiBudget } from './workers-ai-budget';

function fakeBudget(allowed: boolean) {
  const fetch = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
    void init;
    return Response.json({
      allowed,
      used: allowed ? 25 : 9_500,
      remaining: allowed ? 9_475 : 0,
      retryAfter: allowed ? 0 : 100,
      dayKey: '2026-10-02',
    });
  });
  return {
    fetch,
    namespace: {
      idFromName: vi.fn(() => 'global-budget'),
      get: vi.fn(() => ({ fetch })),
    },
  };
}

describe('Workers AI daily budget guard', () => {
  it('reserves before each call and passes a bounded payload to the binding', async () => {
    const budget = fakeBudget(true);
    const run = vi.fn(async (_model: string, _input: unknown) => ({ response: 'ok' }));
    const guarded = withWorkersAiBudget({ run }, budget.namespace)!;

    await guarded.run('@cf/meta/llama-3.1-8b-instruct', { messages: [], max_tokens: 50_000 });

    expect(budget.fetch).toHaveBeenCalledOnce();
    expect(JSON.parse(String(budget.fetch.mock.calls[0]?.[1]?.body)).neurons).toBeGreaterThan(0);
    expect(run).toHaveBeenCalledWith(
      '@cf/meta/llama-3.1-8b-instruct',
      { messages: [], max_tokens: 8_192 },
      undefined
    );
    await guarded.run('@cf/meta/llama-3.1-8b-instruct', { messages: [], max_tokens: 48 });
    expect(budget.fetch).toHaveBeenCalledTimes(2);
  });

  it('denies before inference when the shared daily budget is exhausted', async () => {
    const budget = fakeBudget(false);
    const run = vi.fn(async () => ({ response: 'must not run' }));
    const guarded = withWorkersAiBudget({ run }, budget.namespace)!;

    await expect(
      guarded.run('@cf/meta/llama-3.1-8b-instruct', { messages: [], max_tokens: 48 })
    ).rejects.toMatchObject({
      code: 'neuron_budget_exhausted',
      used: 9_500,
      remaining: 0,
      retryAfter: 100,
      dayKey: '2026-10-02',
    });
    expect(run).not.toHaveBeenCalled();
  });

  it('fails closed on the legacy fast alias without attempting inference or a debit', async () => {
    const budget = fakeBudget(true);
    const run = vi.fn(async () => ({ response: 'must not run' }));
    const guarded = withWorkersAiBudget({ run }, budget.namespace)!;

    await expect(
      guarded.run('@cf/meta/llama-3.1-8b-instruct-fast', { messages: [], max_tokens: 48 })
    ).rejects.toMatchObject({ code: 'neuron_budget_model_unpriced' });
    expect(budget.fetch).not.toHaveBeenCalled();
    expect(run).not.toHaveBeenCalled();
  });

  it('does not infer or report fabricated usage when the shared binding is missing', async () => {
    const run = vi.fn(async () => ({ response: 'must not run' }));
    const guarded = withWorkersAiBudget({ run }, undefined)!;

    await expect(
      guarded.run('@cf/meta/llama-3.1-8b-instruct', { messages: [], max_tokens: 48 })
    ).rejects.toMatchObject({
      code: 'neuron_budget_unavailable',
      used: null,
      remaining: null,
      dayKey: null,
    });
    expect(run).not.toHaveBeenCalled();
  });
});
