import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

const search = vi.hoisted(() => vi.fn());
vi.mock('~/server/experience-catalog', () => ({ searchExperienceCatalog: search }));
beforeEach(() => vi.clearAllMocks());
describe('Public catalog API', () => {
  it('rejects invalid pagination without accessing storage', async () => {
    const result = await GET(new Request('http://localhost/api/experience-catalog?pageSize=100'));
    expect(result.status).toBe(400);
    expect(search).not.toHaveBeenCalled();
  });
  it('does not expose backend error details on failure', async () => {
    search.mockRejectedValue(new Error('Internal database information'));
    const result = await GET(new Request('http://localhost/api/experience-catalog'));
    expect(result.status).toBe(503);
    expect(await result.text()).not.toContain('Internal database information');
  });
});
