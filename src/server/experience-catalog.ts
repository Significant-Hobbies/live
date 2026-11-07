import { cache } from 'react';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { CatalogQuery } from '~/lib/catalog-types';
import { CATALOG_CATEGORIES } from '~/lib/catalog-seed';
import { BUNDLED_PUBLIC_CATALOG, catalogPage } from '~/lib/catalog-model';
import { readStoredPublicCatalog } from './catalog-store';

export function catalogDatabase() {
  return getCloudflareContext().env.DB;
}

export const publicExperienceCatalog = cache(async () => {
  let database: ReturnType<typeof catalogDatabase> | undefined;
  try {
    database = catalogDatabase();
  } catch (error) {
    if (
      error instanceof Error &&
      /getCloudflareContext|Cloudflare context|CloudflareContext/.test(error.message)
    )
      return BUNDLED_PUBLIC_CATALOG;
    throw error;
  }
  if (!database) return BUNDLED_PUBLIC_CATALOG;
  try {
    return await readStoredPublicCatalog(database);
  } catch (error) {
    if (error instanceof Error && /no such table: ExperienceCatalog/.test(error.message))
      return BUNDLED_PUBLIC_CATALOG;
    throw error;
  }
});

export async function searchExperienceCatalog(query: CatalogQuery) {
  return catalogPage(await publicExperienceCatalog(), query, CATALOG_CATEGORIES);
}

export async function findPublicExperience(slug: string) {
  return (await publicExperienceCatalog()).bySlug.get(slug);
}
