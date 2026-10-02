import {
  buildNudgeContext,
  fallbackQuestion,
  isContextEmpty,
  isQuestionFamily,
  QUESTION_FAMILIES,
  questionForFamily,
  WEEKLY_QUESTIONS,
  type NudgeSignals,
  type WeeklyQuestion,
} from '~/lib/weekly-questions';

const CLASSIFIER_TIMEOUT_MS = 3000;

type AiGatewayBinding = { fetch: (request: Request) => Promise<Response> };

async function gatewayCompletion(
  gateway: AiGatewayBinding,
  messages: Array<{ role: 'system' | 'user'; content: string }>,
  maxTokens: number,
  json = false,
  sampling?: { temperature: number; seed: number }
): Promise<string> {
  const response = await gateway.fetch(
    new Request('https://fleet-gateway.internal/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer gateway-managed',
        'x-gateway-project-id': 'live',
      },
      body: JSON.stringify({
        model: 'auto',
        messages,
        max_tokens: maxTokens,
        ...(json ? { response_format: { type: 'json_object' } } : {}),
        ...sampling,
      }),
      signal: AbortSignal.timeout(CLASSIFIER_TIMEOUT_MS),
    })
  );
  if (!response.ok) throw new Error(`Managed AI gateway returned ${response.status}`);
  const result = (await response.json()) as {
    choices?: Array<{ message?: { content?: unknown } }>;
  };
  const content = result.choices?.[0]?.message?.content;
  return typeof content === 'string' ? content.trim() : '';
}

async function classifyQuestionFamily(
  gateway: AiGatewayBinding,
  context: string,
  labels: string[]
): Promise<string | null> {
  try {
    const content = await gatewayCompletion(
      gateway,
      [
        {
          role: 'system',
          content:
            'Classify a weekly reflection into one allowed family. Return JSON only: {"family":"..."}.',
        },
        {
          role: 'user',
          content: `Choose the best family from [${labels.join(', ')}] for these categorical signals: ${context}.`,
        },
      ],
      24,
      true
    );
    const result = JSON.parse(content) as { family?: unknown };
    return typeof result.family === 'string' &&
      labels.includes(result.family) &&
      isQuestionFamily(result.family)
      ? result.family
      : null;
  } catch {
    return null;
  }
}

/**
 * Generate one question for a family the bank has exhausted. Runs on
 * Workers AI with the same categorical context — never user prose.
 * Returns null on any failure; callers fall back to the rotation.
 */
async function generateQuestion(
  gateway: AiGatewayBinding,
  family: string,
  context: string,
  seed: string
): Promise<WeeklyQuestion | null> {
  const bank = WEEKLY_QUESTIONS.filter((q) => q.family === family).map((q) => q.text);
  try {
    const text = await gatewayCompletion(
      gateway,
      [
        {
          role: 'system',
          content:
            'You write gentle weekly-log questions in a warm, plain voice. ' +
            'Return exactly one question, under 20 words, ending with a question mark. ' +
            'No preamble, no quotes, no emoji.',
        },
        {
          role: 'user',
          content:
            `Write one "${family}" weekly-log question for this situation: ${context}. ` +
            `It must not repeat these existing questions: ${bank.join(' | ')}`,
        },
      ],
      48,
      false,
      { temperature: 0.7, seed: hashSeedForAi(seed) }
    );
    if (text.length < 12 || text.length > 160 || !text.endsWith('?') || text.includes('\n')) {
      return null;
    }
    return {
      id: `ai-${family}-${hashSeedForAi(seed)}`,
      family: family as WeeklyQuestion['family'],
      text,
    };
  } catch {
    return null;
  }
}

function hashSeedForAi(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(hash) % 100000;
}

/** True when every bank question in `family` has been served already. */
function familyExhausted(family: string, excludeIds: string[]): boolean {
  return WEEKLY_QUESTIONS.filter((q) => q.family === family).every((q) =>
    excludeIds.includes(q.id)
  );
}

/**
 * Resolve the week's nudge question.
 *
 * The managed gateway picks the question family from categorical context
 * built server-side — user-typed text (dream titles, entries) is never sent.
 * Any failure, empty context, or malformed response falls back to the bank.
 */
export async function resolveWeeklyNudge(
  signals: NudgeSignals,
  weekOf: string,
  excludeIds: string[] = [],
  gateway?: AiGatewayBinding | null
): Promise<WeeklyQuestion> {
  // Each turn gets its own seed so consecutive questions in one session
  // don't collapse onto the same deterministic pick.
  const seed = `${weekOf}#${signals.turn ?? 0}`;
  const fallback = () => fallbackQuestion(seed, excludeIds);
  if (isContextEmpty(signals)) return fallback();

  const asked = new Set(signals.askedFamilies ?? []);
  const labels = QUESTION_FAMILIES.filter((family) => !asked.has(family));
  if (!labels.length) return fallback();

  if (!gateway) return fallback();
  const context = buildNudgeContext(signals);
  const label = await classifyQuestionFamily(gateway, context, labels);
  if (!label) return fallback();
  // The bank is the backbone; managed AI extends it only after exhaustion.
  const generated = familyExhausted(label, excludeIds)
    ? await generateQuestion(gateway, label, context, seed)
    : null;
  return generated ?? questionForFamily(label, seed, excludeIds);
}
