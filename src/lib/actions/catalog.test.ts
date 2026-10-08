import { beforeEach, describe, expect, it, vi } from 'vitest';
import { submitCatalogIdea } from './catalog';

const { session, submit, database } = vi.hoisted(() => ({
  session: vi.fn(),
  submit: vi.fn(),
  database: {},
}));
vi.mock('~/server/auth', () => ({ getServerAuthSession: session }));
vi.mock('~/server/experience-catalog', () => ({ catalogDatabase: () => database }));
vi.mock('~/server/catalog-store', () => ({ submitStoredCatalogIdea: submit }));
beforeEach(() => {
  vi.clearAllMocks();
  session.mockResolvedValue({ user: { id: 'alice' } });
  submit.mockResolvedValue({ id: 'idea', status: 'pending' });
});

describe('Explicit catalog submissions', () => {
  it('requires an authenticated user', async () => {
    session.mockResolvedValue(null);
    await expect(
      submitCatalogIdea({ title: 'Make a neighbourhood cookbook', category: 'creative' })
    ).rejects.toThrow('Sign in');
    expect(submit).not.toHaveBeenCalled();
  });
  it('uses the session owner and validates the submitted fields', async () => {
    expect(
      await submitCatalogIdea({ title: '  Make a neighbourhood cookbook  ', category: 'creative' })
    ).toEqual({ id: 'idea', status: 'pending' });
    expect(submit).toHaveBeenCalledWith(
      database,
      'alice',
      'Make a neighbourhood cookbook',
      'creative'
    );
    await expect(submitCatalogIdea({ title: 'abc', category: 'unknown' })).rejects.toThrow();
  });
  it('does not pretend to accept a submission before its schema exists', async () => {
    submit.mockRejectedValue(new Error('D1_ERROR: no such table: CatalogSubmission'));
    await expect(
      submitCatalogIdea({ title: 'Make a neighbourhood cookbook', category: 'creative' })
    ).rejects.toThrow('not set up yet');
  });
});
