const DAILY_CAP = 9_500;
const DEFAULT_OUTPUT_TOKENS = 512;
const MAX_OUTPUT_TOKENS = 8_192;
const INPUT_BUFFER = 1.2;
const BUDGET_ORIGIN = 'https://internal.local';

type BudgetBinding = {
  idFromName(name: string): unknown;
  get(id: unknown): { fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> };
};

type AiBinding = {
  run: (model: string, input: unknown, options?: unknown) => Promise<unknown>;
};

type Debit = {
  allowed: boolean;
  used: number;
  remaining: number;
  retryAfter: number;
  dayKey: string;
};

type Plan = { input: Record<string, unknown>; neurons: number } | { error: string };

// Only the approved exact 3.1 8B fp8 fast ID is priced here.
const TEXT_PRICING: Record<string, { input: number; output: number }> = {
  '@cf/meta/llama-3.1-8b-instruct-fp8-fast': { input: 4_119, output: 34_868 },
};

function planRequest(model: string, value: unknown): Plan {
  const pricing = TEXT_PRICING[model];
  if (!pricing) return { error: 'neuron_budget_model_unpriced' };
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { error: 'neuron_budget_input_invalid' };
  }

  const source = value as Record<string, unknown>;
  const requested = 'max_tokens' in source ? source.max_tokens : DEFAULT_OUTPUT_TOKENS;
  if (typeof requested !== 'number' || !Number.isSafeInteger(requested) || requested <= 0) {
    return { error: 'neuron_budget_input_invalid' };
  }
  const outputTokens = Math.min(requested, MAX_OUTPUT_TOKENS);
  const input = { ...source, max_tokens: outputTokens };

  let serialized: string;
  try {
    serialized = JSON.stringify(input);
  } catch {
    return { error: 'neuron_budget_input_invalid' };
  }
  if (typeof serialized !== 'string') return { error: 'neuron_budget_input_invalid' };

  const inputBytes = new TextEncoder().encode(serialized).byteLength;
  const neurons = Math.max(
    1,
    Math.ceil(
      (inputBytes * pricing.input * INPUT_BUFFER + outputTokens * pricing.output) / 1_000_000
    )
  );
  return neurons > DAILY_CAP ? { error: 'neuron_budget_request_too_large' } : { input, neurons };
}

function isDebit(value: unknown, status: number, neurons: number): value is Debit {
  if (status !== 200 || value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const result = value as Record<string, unknown>;
  if (typeof result.allowed !== 'boolean') return false;
  if (!hasSafeCounters(result.used, result.remaining)) return false;
  if (!hasValidRetry(result.allowed, result.retryAfter, result.used, neurons)) return false;
  return result.dayKey === new Date().toISOString().slice(0, 10);
}

function hasSafeCounters(used: unknown, remaining: unknown): used is number {
  return (
    typeof used === 'number' &&
    Number.isSafeInteger(used) &&
    used >= 0 &&
    used <= DAILY_CAP &&
    typeof remaining === 'number' &&
    Number.isSafeInteger(remaining) &&
    remaining >= 0 &&
    used + remaining === DAILY_CAP
  );
}

function hasValidRetry(allowed: boolean, retryAfter: unknown, used: number, neurons: number) {
  if (typeof retryAfter !== 'number' || !Number.isSafeInteger(retryAfter) || retryAfter < 0) {
    return false;
  }
  return allowed
    ? retryAfter === 0 && used >= neurons
    : retryAfter > 0 && used + neurons > DAILY_CAP;
}

async function reserve(budget: BudgetBinding | undefined, neurons: number): Promise<Debit | null> {
  if (!budget) return null;
  try {
    const id = budget.idFromName('global-budget');
    const response = await budget.get(id).fetch(`${BUDGET_ORIGIN}/try-debit`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ neurons }),
    });
    const body: unknown = await response.json().catch(() => null);
    return isDebit(body, response.status, neurons) ? body : null;
  } catch {
    return null;
  }
}

function budgetError(
  code: string,
  debit: Debit | null = null,
  message = 'Workers AI daily budget state is unavailable.'
) {
  return Object.assign(new Error(message), {
    code,
    used: debit?.used ?? null,
    remaining: debit?.remaining ?? null,
    retryAfter: debit?.retryAfter ?? null,
    dayKey: debit?.dayKey ?? null,
  });
}

/** Wrap each Workers AI attempt so every SDK retry gets its own reservation. */
export function withWorkersAiBudget(
  binding: AiBinding | undefined,
  budget: BudgetBinding | undefined
): AiBinding | undefined {
  if (!binding) return undefined;
  return {
    run: async (model, value, options) => {
      const plan = planRequest(model, value);
      if ('error' in plan) throw budgetError(plan.error);
      const debit = await reserve(budget, plan.neurons);
      if (!debit) throw budgetError('neuron_budget_unavailable');
      if (!debit.allowed) {
        throw budgetError(
          'neuron_budget_exhausted',
          debit,
          `Workers AI daily budget exhausted (${debit.used}/${DAILY_CAP}).`
        );
      }
      return binding.run.call(binding, model, plan.input, options);
    },
  };
}
