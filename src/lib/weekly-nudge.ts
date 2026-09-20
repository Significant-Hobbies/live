import {
  buildNudgeContext,
  fallbackQuestion,
  isContextEmpty,
  isQuestionFamily,
  QUESTION_FAMILIES,
  questionForFamily,
  type NudgeSignals,
  type WeeklyQuestion,
} from '~/lib/weekly-questions';

const CLASSIFIER_ENDPOINT = 'https://classifier.dev/v1/classify';
const CLASSIFIER_TIMEOUT_MS = 3000;

type ClassifierResult = { label?: unknown; confidence?: unknown };

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
  excludeIds: string[] = []
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
    return questionForFamily(label, seed, excludeIds);
  } catch {
    return fallback();
  }
}
