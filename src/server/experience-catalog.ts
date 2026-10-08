import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { CatalogQuery } from '~/lib/catalog-types';
import { searchCatalogSeed } from '~/lib/catalog-seed';
import { EXPERIENCE_ENTRIES } from '~/lib/experiences';
import { searchStoredCatalog } from './catalog-store';

export function catalogDatabase() {
  return getCloudflareContext().env.DB;
}

export async function searchExperienceCatalog(query: CatalogQuery) {
  try {
    const database = catalogDatabase();
    if (!database) return searchCatalogSeed(query);
    const seedCount = await database
      .prepare("SELECT count(*) AS count FROM ExperienceCatalog WHERE source = 'seed'")
      .first('count');
    // A partially imported seed must not make most built-in ideas disappear.
    if (Number(seedCount) < EXPERIENCE_ENTRIES.length) return searchCatalogSeed(query);
    return await searchStoredCatalog(database, query);
  } catch (error) {
    if (error instanceof Error && /no such table: ExperienceCatalog/.test(error.message))
      return searchCatalogSeed(query);
    throw error;
  }
}
