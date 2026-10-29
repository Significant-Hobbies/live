import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getServerAuthSession, redirect } = vi.hoisted(() => ({
  getServerAuthSession: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`);
  }),
}));
vi.mock('~/server/auth', () => ({ getServerAuthSession }));
vi.mock('next/navigation', () => ({ redirect }));
vi.mock('~/components/aceternity', () => ({
  FadeIn: () => null,
  SpotlightCard: () => null,
  TextGenerateEffect: () => null,
}));
vi.mock('./login-form', () => ({ LoginForm: () => null }));

import LoginPage from './page';

describe('account reminder login destination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getServerAuthSession.mockResolvedValue({ user: { id: 'account-owner' } });
  });
  it('returns an already signed-in owner directly to the journal', async () => {
    await expect(
      LoginPage({ searchParams: Promise.resolve({ callbackUrl: '/journal' }) })
    ).rejects.toThrow('redirect:/journal');
    expect(redirect).toHaveBeenCalledWith('/journal');
  });
  it('keeps a manipulated callback on the app', async () => {
    await expect(
      LoginPage({ searchParams: Promise.resolve({ callbackUrl: 'https://evil.example' }) })
    ).rejects.toThrow('redirect:/bucket-list');
    expect(redirect).toHaveBeenCalledWith('/bucket-list');
  });
});
