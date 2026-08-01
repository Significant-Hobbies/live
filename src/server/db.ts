import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';

import * as schema from '~/db/schema';

function createDrizzleClient() {
  const { env } = getCloudflareContext();
  return drizzle(env.DB, { schema });
}

const globalForDrizzle = globalThis as unknown as {
  db: ReturnType<typeof createDrizzleClient> | undefined;
};

type DB = ReturnType<typeof createDrizzleClient>;

function getDb(): DB {
  if (!globalForDrizzle.db) globalForDrizzle.db = createDrizzleClient();
  return globalForDrizzle.db;
}

// Resolve the request-scoped Cloudflare binding lazily. Eager resolution at
// module load breaks Next.js build-time route analysis, where no Worker request
// context exists yet.
export const db = new Proxy({} as DB, {
  get(_, prop) {
    return Reflect.get(getDb() as object, prop);
  },
});
