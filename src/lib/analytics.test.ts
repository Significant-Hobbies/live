import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('posthog-js', () => ({ default: { capture: vi.fn() } }));

import posthog from 'posthog-js';
import { trackCoreAction, trackEvent, trackPageView } from './analytics';

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

describe('Live product attribution', () => {
  it('keeps page and core actions separate from Hub in the browser', () => {
    trackPageView();
    trackCoreAction('bucket_list_completed');

    expect(posthog.capture).toHaveBeenNthCalledWith(1, 'page_view', {
      project_id: 'live',
    });
    expect(posthog.capture).toHaveBeenNthCalledWith(2, 'core_action', {
      action: 'bucket_list_completed',
      project_id: 'live',
    });
  });

  it('does not let caller properties relabel a Live event as Hub', () => {
    trackEvent('discovery_engaged', {
      project_id: 'significanthobbies',
      surface: 'quiz',
    });

    expect(posthog.capture).toHaveBeenCalledWith('discovery_engaged', {
      project_id: 'live',
      surface: 'quiz',
    });
  });

  it('attributes server-side core actions to Live without sending journal content', () => {
    const send = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('fetch', send);

    trackCoreAction('bucket_list_saved', 'fixture-user');

    expect(send).toHaveBeenCalledOnce();
    const [url, request] = send.mock.calls[0];
    expect(url).toBe('https://us.i.posthog.com/i/v0/e/');
    const event = JSON.parse(request.body);
    expect(event).toMatchObject({
      event: 'core_action',
      distinct_id: 'fixture-user',
      properties: { project_id: 'live', action: 'bucket_list_saved' },
    });
    expect(Object.keys(event.properties).sort()).toEqual(['action', 'project_id']);
    expect(posthog.capture).not.toHaveBeenCalled();
  });

  it('keeps a failed analytics request from interrupting a server action', async () => {
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('unavailable')));

    expect(() => trackCoreAction('bucket_list_saved', 'fixture-user')).not.toThrow();
    await Promise.resolve();
  });
});
