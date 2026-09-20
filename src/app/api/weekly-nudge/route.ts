import { NextResponse } from 'next/server';

import { resolveWeeklyNudge } from '~/lib/weekly-nudge';
import { weekStartFor, normalizeWeekStartsOn } from '~/lib/weekly-log';
import { dayKeyIn } from '~/lib/day';
import { isQuestionFamily, type NudgeSignals } from '~/lib/weekly-questions';

export const dynamic = 'force-dynamic';

const WEEK_OF_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function cleanSignals(value: unknown): NudgeSignals | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  const categories = Array.isArray(raw.staleDreamCategories)
    ? raw.staleDreamCategories
        .filter((c): c is string => typeof c === 'string' && c.length > 0 && c.length <= 40)
        .slice(0, 10)
    : [];
  const count = (v: unknown, max: number) =>
    typeof v === 'number' && Number.isInteger(v) && v >= 0 ? Math.min(v, max) : 0;
  const families = (v: unknown, max: number) =>
    Array.isArray(v) ? v.filter((f): f is string => isQuestionFamily(f)).slice(0, max) : [];
  return {
    staleDreamCategories: categories,
    entriesLastMonth: count(raw.entriesLastMonth, 52),
    activeCommitments: count(raw.activeCommitments, 100),
    activeDreams: count(raw.activeDreams, 1000),
    isSuggestedDay: raw.isSuggestedDay === true,
    detectedThemes: families(raw.detectedThemes, 10),
    askedFamilies: families(raw.askedFamilies, 10),
    turn: count(raw.turn, 20),
  };
}

/**
 * Nudge-question resolution for signed-out (local) users. Accepts only
 * categorical signals and ids — the route builds the classifier context
 * itself, so arbitrary text can never reach classifier.dev through it.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const raw = (body ?? {}) as Record<string, unknown>;
  const signals = cleanSignals(raw.signals);
  if (!signals) return NextResponse.json({ error: 'Invalid signals' }, { status: 400 });

  const today = dayKeyIn(null);
  const weekStartsOn = normalizeWeekStartsOn(raw.weekStartsOn);
  const weekOf =
    typeof raw.weekOf === 'string' && WEEK_OF_PATTERN.test(raw.weekOf)
      ? raw.weekOf
      : weekStartFor(today, weekStartsOn);
  const excludeIds = Array.isArray(raw.excludeIds)
    ? raw.excludeIds.filter((id): id is string => typeof id === 'string').slice(0, 40)
    : [];

  const question = await resolveWeeklyNudge(signals, weekOf, excludeIds);
  return NextResponse.json({ question });
}
