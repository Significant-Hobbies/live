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

const CLASSIFIER_ENDPOINT = 'https://classifier.dev/v1/classify';
const CLASSIFIER_TIMEOUT_MS = 3000;
const AI_MODEL = '@cf/meta/llama-3.1-8b-instruct-fast';

type ClassifierResult = { label?: unknown; confidence?: unknown };
type AiBinding = { run: (model: string, input: unknown) => Promise<unknown> };

/**
 * Generate one question for a family the bank has exhausted. Runs on
 * Workers AI with the same categorical context — never user prose.
 * Returns null on any failure; callers fall back to the rotation.
 */
async function generateQuestion(
  ai: AiBinding,
  family: string,
  context: string,
  seed: string
): Promise<WeeklyQuestion | null> {
  const bank = WEEKLY_QUESTIONS.filter((q) => q.family === family).map((q) => q.text);
  try {
    const result = (await ai.run(AI_MODEL, {
      messages: [
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
      max_tokens: 48,
      temperature: 0.7,
      seed: hashSeedForAi(seed),
    })) as { response?: unknown };
    const text = typeof result.response === 'string' ? result.response.trim() : '';
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
 * classifier.dev picks the question *family* from a categorical context
 * string built server-side — user-typed text (dream titles, entries) is
 * never sent. Any failure, empty context, or malformed response falls back
 * to the deterministic rotation: the ritual never depends on the service.
 */
export async function resolveWeeklyNudge(
  signals: NudgeSignals,
  weekOf: string,
  excludeIds: string[] = [],
  ai?: AiBinding | null
): Promise<WeeklyQuestion> {
  // Each turn gets its own seed so consecutive questions in one session
  // don't collapse onto the same deterministic pick.
  const seed = `${weekOf}#${signals.turn ?? 0}`;
  const fallback = () => fallbackQuestion(seed, excludeIds);
  if (isContextEmpty(signals)) return fallback();

  const asked = new Set(signals.askedFamilies ?? []);
  const labels = QUESTION_FAMILIES.filter((family) => !asked.has(family));
  if (!labels.length) return fallback();

  try {
    const response = await fetch(CLASSIFIER_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        inputs: [buildNudgeContext(signals)],
        labels,
      }),
      signal: AbortSignal.timeout(CLASSIFIER_TIMEOUT_MS),
      cache: 'no-store',
    });
    if (!response.ok) return fallback();

    const body = (await response.json()) as { results?: ClassifierResult[] };
    const label = body.results?.[0]?.label;
    if (typeof label !== 'string' || !isQuestionFamily(label)) {
      return fallback();
    }
    // The bank is the backbone; Workers AI extends it when a family has
    // nothing left to serve. Generation still sees only the context
    // string — never user prose.
    if (ai && familyExhausted(label, excludeIds)) {
      const generated = await generateQuestion(ai, label, buildNudgeContext(signals), seed);
      if (generated) return generated;
    }
    return questionForFamily(label, seed, excludeIds);
  } catch {
    return fallback();
  }
}
