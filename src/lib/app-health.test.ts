import { afterEach, describe, expect, it, vi } from 'vitest';

import { observeRequest } from '../../app-health.mjs';

afterEach(() => vi.unstubAllGlobals());

describe('App Health endpoint observer', () => {
  it('sends contract-compatible numeric timestamps and keeps healthy/error status', async () => {
    const send = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    vi.stubGlobal('fetch', send);
    const pending: Promise<unknown>[] = [];
    const ctx = { waitUntil: (promise: Promise<unknown>) => pending.push(promise) };

    observeRequest(
      new Request('https://live.significanthobbies.com/api/health'),
      new Response(null, { status: 503 }),
      21.4,
      { APP_HEALTH_INGEST_KEY: 'test-key' },
      ctx
    );
    await Promise.all(pending);

    const batch = JSON.parse(send.mock.calls[0][1].body as string);
    expect(Number.isInteger(batch.events[0].timestamp)).toBe(true);
    expect(batch.events[0]).toMatchObject({
      method: 'GET',
      route: '/api/health',
      status_code: 503,
      duration_ms: 21,
    });
  });
});
