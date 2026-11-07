import { beforeEach, describe, expect, it, vi } from 'vitest';
import { parseCatalogQuery } from '~/lib/catalog-seed';
import { EXPERIENCE_ENTRIES } from '~/lib/experiences';
import { findPublicExperience, searchExperienceCatalog } from './experience-catalog';

const { context, all } = vi.hoisted(() => ({ context: vi.fn(), all: vi.fn() }));
vi.mock('@opennextjs/cloudflare', () => ({ getCloudflareContext: context }));
beforeEach(() => {
  vi.clearAllMocks();
  context.mockReturnValue({ env: { DB: { prepare: () => ({ all }) } } });
});
const query = () => parseCatalogQuery(new URLSearchParams());

describe('Catalog rollout reads', () => {
  it('uses the built-in catalog only for missing bindings or tables', async () => {
    all.mockRejectedValue(new Error('D1_ERROR: no such table: ExperienceCatalog'));
    expect((await searchExperienceCatalog(query())).source).toBe('seed');
    context.mockReturnValue({ env: {} });
    expect((await searchExperienceCatalog(query())).total).toBe(EXPERIENCE_ENTRIES.length);
  });
  it('keeps community and all bundled entries during a partial import', async () => {
    all.mockResolvedValue({
      results: [
        {
          slug: 'shared-weaving',
          title: 'Shared weaving session',
          description: null,
          emoji: '✨',
          category: 'creative',
          kind: 'idea',
        },
      ],
    });
    const page = await searchExperienceCatalog(query());
    expect(page.total).toBe(EXPERIENCE_ENTRIES.length + 1);
    expect(page.source).toBe('database');
    expect((await findPublicExperience('shared-weaving'))?.title).toBe('Shared weaving session');
  });
  it('surfaces unrelated database and context failures', async () => {
    all.mockRejectedValue(new Error('Database temporarily unavailable'));
    await expect(searchExperienceCatalog(query())).rejects.toThrow('temporarily unavailable');
    context.mockImplementation(() => {
      throw new Error('Unexpected environment failure');
    });
    await expect(searchExperienceCatalog(query())).rejects.toThrow('Unexpected environment');
  });
});
