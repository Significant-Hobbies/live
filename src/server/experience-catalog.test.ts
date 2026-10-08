import { beforeEach, describe, expect, it, vi } from 'vitest';
import { parseCatalogQuery } from '~/lib/catalog-seed';
import { EXPERIENCE_ENTRIES } from '~/lib/experiences';
import { searchExperienceCatalog } from './experience-catalog';

const { context, first, search } = vi.hoisted(() => ({
  context: vi.fn(),
  first: vi.fn(),
  search: vi.fn(),
}));
vi.mock('@opennextjs/cloudflare', () => ({ getCloudflareContext: context }));
vi.mock('./catalog-store', () => ({ searchStoredCatalog: search }));
beforeEach(() => {
  vi.clearAllMocks();
  context.mockReturnValue({ env: { DB: { prepare: () => ({ first }) } } });
});

describe('Catalog rollout reads', () => {
  it('uses the shared built-in seed before catalog tables exist', async () => {
    first.mockRejectedValue(new Error('D1_ERROR: no such table: ExperienceCatalog'));
    const page = await searchExperienceCatalog(
      parseCatalogQuery(new URLSearchParams('q=pot&pageSize=5'))
    );
    expect(page.source).toBe('seed');
    expect(page.items.length).toBeLessThanOrEqual(5);
    expect(search).not.toHaveBeenCalled();
  });
  it('does not hide built-in ideas during a partial seed import', async () => {
    first.mockResolvedValue(10);
    const page = await searchExperienceCatalog(parseCatalogQuery(new URLSearchParams()));
    expect(page.total).toBe(EXPERIENCE_ENTRIES.length);
    expect(page.source).toBe('seed');
  });
  it('uses the database after seeding and surfaces unrelated database failures', async () => {
    first.mockResolvedValue(EXPERIENCE_ENTRIES.length);
    search.mockResolvedValue({ source: 'database' });
    expect(await searchExperienceCatalog(parseCatalogQuery(new URLSearchParams()))).toEqual({
      source: 'database',
    });
    first.mockRejectedValue(new Error('Database temporarily unavailable'));
    await expect(searchExperienceCatalog(parseCatalogQuery(new URLSearchParams()))).rejects.toThrow(
      'temporarily unavailable'
    );
  });
});
