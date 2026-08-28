import { beforeEach, describe, expect, it, vi } from 'vitest';

const { signInSocial } = vi.hoisted(() => ({ signInSocial: vi.fn() }));

vi.mock('@/lib/auth', () => ({
  auth: { api: { signInSocial } },
}));

import { GET } from './route';

describe('native Google auth start', () => {
  beforeEach(() => {
    signInSocial.mockReset();
  });

  it('preserves Better Auth state cookies on the Google redirect', async () => {
    signInSocial.mockResolvedValue({
      response: { url: 'https://accounts.google.test/authorize' },
      headers: new Headers({ 'Set-Cookie': 'oauth-state=one-time; HttpOnly; Secure' }),
    });

    const response = await GET(
      new Request(
        'https://live.significanthobbies.com/api/native/auth/google/start?callback=calorie%3A%2F%2Fauth'
      )
    );

    expect(signInSocial).toHaveBeenCalledWith(expect.objectContaining({ returnHeaders: true }));
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('https://accounts.google.test/authorize');
    expect(response.headers.get('Set-Cookie')).toContain('oauth-state=one-time');
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });
});
