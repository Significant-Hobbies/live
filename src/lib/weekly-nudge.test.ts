import { describe, expect, it, vi } from 'vitest';
import { QUESTION_FAMILIES, WEEKLY_QUESTIONS } from '~/lib/weekly-questions';
import { resolveWeeklyNudge } from '~/lib/weekly-nudge';

const signals = {
  staleDreamCategories: [],
  entriesLastMonth: 1,
  activeCommitments: 0,
  activeDreams: 0,
  isSuggestedDay: false,
  detectedThemes: [],
  askedFamilies: [],
  turn: 0,
};

describe('weekly nudge managed gateway', () => {
  it('sends only bounded categorical context through the Live gateway and validates generated output', async () => {
    const family = QUESTION_FAMILIES[0]!;
    let attempt = 0;
    const fetch = vi.fn(async (request: Request) => {
      expect(new URL(request.url).pathname).toBe('/v1/chat/completions');
      expect(request.headers.get('x-gateway-project-id')).toBe('live');
      expect(request.headers.get('authorization')).toBe('Bearer gateway-managed');
      const body = (await request.json()) as {
        model: string;
        max_tokens: number;
        response_format?: { type: string };
        messages: Array<{ content: string }>;
      };
      expect(body.model).toBe('auto');
      expect(body.messages[1]?.content).not.toContain('private journal prose');
      attempt += 1;
      if (attempt === 1) {
        expect(body.max_tokens).toBe(24);
        expect(body.response_format).toEqual({ type: 'json_object' });
        return Response.json({ choices: [{ message: { content: JSON.stringify({ family }) } }] });
      }
      expect(body.max_tokens).toBe(48);
      return Response.json({
        choices: [{ message: { content: 'What small thing felt meaningful this week?' } }],
      });
    });
    const excludeIds = WEEKLY_QUESTIONS.filter((question) => question.family === family).map(
      (question) => question.id
    );

    const result = await resolveWeeklyNudge(
      { ...signals, detectedThemes: [family] },
      '2026-10-01',
      excludeIds,
      { fetch }
    );

    expect(result.id).toMatch(/^ai-/);
    expect(result.family).toBe(family);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('uses the deterministic question bank when the managed binding is absent', async () => {
    const result = await resolveWeeklyNudge(signals, '2026-10-01', [], undefined);
    expect(result.id).not.toMatch(/^ai-/);
  });

  it('rejects an unrecognized gateway family and uses deterministic rotation', async () => {
    const fetch = vi.fn(async () =>
      Response.json({ choices: [{ message: { content: '{"family":"outside"}' } }] })
    );
    const result = await resolveWeeklyNudge(signals, '2026-10-01', [], { fetch });
    expect(result.id).not.toMatch(/^ai-/);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
