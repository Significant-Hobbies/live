const BUDGET_CAP = 9_500;
const DEFAULT_OUTPUT_TOKENS = 512;
const MAX_OUTPUT_TOKENS = 8_192;
const BUFFER = 1.2;
const BUDGET_ORIGIN = 'https://internal.local';

type NeuronBudgetBinding = {
  idFromName(name: string): unknown;
  get(id: unknown): { fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> };
};

type AiBinding = {
  run: (model: string, input: unknown, options?: unknown) => Promise<unknown>;
};

type TextPricing = { inputNeuronsPerMillion: number; outputNeuronsPerMillion: number };

// Only include model IDs with a published, exact pricing entry. Legacy model
// aliases intentionally fail closed until their cost is verified.
const TEXT_PRICING: Record<string, TextPricing> = {
  '@cf/meta/llama-3.1-8b-instruct': {
    inputNeuronsPerMillion: 25_608,
    outputNeuronsPerMillion: 75_147,
  },
};

function estimateNeurons(model: string, input: unknown): number | null {
  const pricing = TEXT_PRICING[model];
  if (!pricing) return null;

  let serialized: string;
  try {
    serialized = JSON.stringify(input);
  } catch {
    return null;
  }
  if (typeof serialized !== 'string') return null;

  const inputTokens = Math.max(1, Math.ceil(new TextEncoder().encode(serialized).byteLength / 4));
  const rawOutput =
    input && typeof input === 'object' && 'max_tokens' in input
      ? Number((input as { max_tokens?: unknown }).max_tokens)
      : DEFAULT_OUTPUT_TOKENS;
  if (!Number.isFinite(rawOutput) || rawOutput < 0) return null;
  const outputTokens = Math.min(MAX_OUTPUT_TOKENS, Math.max(1, Math.ceil(rawOutput)));
  return Math.max(
    1,
    Math.ceil(
      ((inputTokens * pricing.inputNeuronsPerMillion +
        outputTokens * pricing.outputNeuronsPerMillion) /
        1_000_000) *
        BUFFER
    )
  );
}

type DebitResult = {
  allowed: boolean;
  used: number;
  remaining: number;
  retryAfter: number;
  dayKey: string;
};

async function reserveNeurons(
  budget: NeuronBudgetBinding | undefined,
  neurons: number
): Promise<DebitResult | null> {
  if (!budget) return null;
  try {
    const id = budget.idFromName('global-budget');
    const response = await budget.get(id).fetch(`${BUDGET_ORIGIN}/try-debit`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ neurons }),
    });
    if (!response.ok) return null;
    const debit = (await response.json()) as Partial<DebitResult>;
    if (
      typeof debit.allowed !== 'boolean' ||
      !Number.isInteger(debit.used) ||
      debit.used! < 0 ||
      debit.used! > BUDGET_CAP ||
      !Number.isInteger(debit.remaining) ||
      debit.remaining! < 0 ||
      debit.remaining! > BUDGET_CAP ||
      debit.used! + debit.remaining! !== BUDGET_CAP ||
      !Number.isInteger(debit.retryAfter) ||
      debit.retryAfter! < 0 ||
      typeof debit.dayKey !== 'string' ||
      debit.dayKey !== new Date().toISOString().slice(0, 10)
    )
      return null;
    return debit as DebitResult;
  } catch {
    return null;
  }
}

/** Wrap the direct binding so every SDK attempt reserves before inference. */
export function withWorkersAiBudget(
  binding: AiBinding | undefined,
  budget: NeuronBudgetBinding | undefined
): AiBinding | undefined {
  if (!binding) return undefined;
  return {
    run: async (model, input, options) => {
      const boundedInput =
        input && typeof input === 'object'
          ? {
              ...(input as Record<string, unknown>),
              max_tokens: Math.min(
                MAX_OUTPUT_TOKENS,
                Math.max(
                  1,
                  Number((input as { max_tokens?: unknown }).max_tokens ?? DEFAULT_OUTPUT_TOKENS)
                )
              ),
            }
          : input;
      const neurons = estimateNeurons(model, boundedInput);
      const reservation = neurons === null ? null : await reserveNeurons(budget, neurons);
      if (!reservation || !reservation.allowed) {
        const error = new Error(
          reservation
            ? `Workers AI daily budget exhausted (${reservation.used}/${BUDGET_CAP}).`
            : 'Workers AI daily budget state is unavailable.'
        ) as Error & {
          code: string;
          used: number | null;
          remaining: number | null;
          retryAfter: number | null;
          dayKey: string | null;
        };
        error.code =
          neurons === null
            ? 'neuron_budget_model_unpriced'
            : reservation
              ? 'neuron_budget_exhausted'
              : 'neuron_budget_unavailable';
        error.used = reservation?.used ?? null;
        error.remaining = reservation?.remaining ?? null;
        error.retryAfter = reservation?.retryAfter ?? null;
        error.dayKey = reservation?.dayKey ?? null;
        throw error;
      }
      return binding.run.call(binding, model, boundedInput, options);
    },
  };
}
