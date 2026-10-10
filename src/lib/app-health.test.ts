import { afterEach, describe, expect, it, vi } from 'vitest';

import { observeRequest } from '../../app-health.mjs';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

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

describe('App Health stage timing', () => {
  async function observe(path: string, headers: HeadersInit, sampleRate = '1', cold = 0) {
    const send = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    vi.stubGlobal('fetch', send);
    const pending: Promise<unknown>[] = [];
    const request = new Request(`https://live.significanthobbies.com${path}`);
    Object.defineProperty(request, 'cf', { value: { colo: 'BOM' } });
    observeRequest(
      request,
      new Response(null, { status: 200, headers }),
      21.6,
      {
        APP_HEALTH_INGEST_KEY: 'test-key',
        APP_HEALTH_STAGE_SAMPLE_RATE: sampleRate,
        APP_HEALTH_ENVIRONMENT: ' preview ',
      },
      { waitUntil: (promise: Promise<unknown>) => pending.push(promise) },
      cold
    );
    await Promise.all(pending);
    return send.mock.calls.filter(([url]) => url === 'https://ingest.sassmaker.com/v1/logs');
  }

  it('emits the exact HTML route props and LogBatchV1 envelope', async () => {
    const calls = await observe(
      '/explore?private=query',
      { 'content-type': 'text/html; charset=utf-8', 'x-edge-cache': 'HIT' },
      '1',
      1
    );
    expect(calls).toHaveLength(1);
    expect(calls[0][1].headers.authorization).toBe('Bearer test-key');
    expect(JSON.parse(calls[0][1].body as string)).toEqual({
      batch_id: expect.any(String),
      schema_version: 'v1',
      environment: 'preview',
      logs: [
        {
          log_id: expect.any(String),
          timestamp: expect.any(Number),
          event: 'api.stage_timing',
          level: 'debug',
          props: {
            route: '/explore',
            status: 200,
            total_ms: 22,
            edge_cache: 'HIT',
            inner_cache: 'NONE',
            colo: 'BOM',
            cold: 1,
          },
        },
      ],
    });
  });

  it('does not emit a log at sample rate zero', async () => {
    expect(await observe('/', { 'content-type': 'text/html' }, '0')).toHaveLength(0);
  });

  it('does not emit a log for non-HTML static routes', async () => {
    expect(await observe('/favicon.ico', { 'content-type': 'image/x-icon' })).toHaveLength(0);
  });

  it('uses a route template for a dynamic path', async () => {
    const calls = await observe('/experiences/some-slug', { 'content-type': 'text/html' });
    expect(JSON.parse(calls[0][1].body as string).logs[0].props.route).toBe('/experiences/:slug');
  });

  it('marks only the first request entering the isolate as cold', async () => {
    vi.resetModules();
    const { withTiming } = await import('../../timing.mjs');
    const send = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    vi.stubGlobal('fetch', send);
    const pending: Promise<unknown>[] = [];
    const timed = withTiming(async () => new Response(null));
    const env = { APP_HEALTH_INGEST_KEY: 'test-key', APP_HEALTH_STAGE_SAMPLE_RATE: '1' };
    const ctx = { waitUntil: (promise: Promise<unknown>) => pending.push(promise) };
    await Promise.all([
      timed(new Request('https://live.significanthobbies.com/'), env, ctx),
      timed(new Request('https://live.significanthobbies.com/'), env, ctx),
    ]);
    await Promise.all(pending);
    const props = send.mock.calls
      .filter(([url]) => url === 'https://ingest.sassmaker.com/v1/logs')
      .map(([, options]) => JSON.parse(options.body as string).logs[0].props);
    expect(props.map((value) => value.cold)).toEqual([1, 0]);
    expect(props[0]).toMatchObject({ colo: 'unknown', edge_cache: 'NONE' });
  });
});
