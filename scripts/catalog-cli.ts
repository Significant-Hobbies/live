#!/usr/bin/env tsx
import { writeFile } from 'node:fs/promises';
import { getPlatformProxy } from 'wrangler';
import { catalogSeedSql } from '../src/lib/catalog-seed';
import { reviewStoredCatalogIdea } from '../src/server/catalog-store';

function option(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index < 0 ? undefined : process.argv[index + 1];
}
function required(name: string) {
  const value = option(name);
  if (!value || value.startsWith('--')) throw new Error(`Missing --${name}`);
  return value;
}

async function main() {
  const command = process.argv[2];
  if (!['seed', 'pending', 'review'].includes(command ?? ''))
    throw new Error('Use seed, pending or review');
  if (process.argv.includes('--remote'))
    throw new Error(
      'This tool only supports local data. Production writes require a separate operator release.'
    );
  if (command === 'seed' && option('output')) {
    const path = required('output');
    if (!path.endsWith('.sql')) throw new Error('Seed output must be a .sql artifact');
    await writeFile(path, catalogSeedSql());
    console.log(`Seed SQL prepared at ${path}; no database was changed.`);
    return;
  }
  if (!process.argv.includes('--local'))
    throw new Error('Pass --local explicitly to operate on local data');
  const platform = await getPlatformProxy<CloudflareEnv>({ configPath: './wrangler.local.toml' });
  try {
    if (command === 'seed') {
      await platform.env.DB.exec(catalogSeedSql());
      console.log(
        'Seed ideas inserted locally; existing catalog entries and personal lists were preserved.'
      );
    } else if (command === 'pending') {
      const result = await platform.env.DB.prepare(
        "SELECT id,title,category,createdAt FROM CatalogSubmission WHERE status = 'pending' ORDER BY createdAt LIMIT 100"
      ).all();
      console.log(JSON.stringify(result.results, null, 2));
    } else {
      const decision = required('decision');
      if (decision !== 'approve' && decision !== 'reject')
        throw new Error('Decision must be approve or reject');
      await reviewStoredCatalogIdea(
        platform.env.DB,
        required('id'),
        decision,
        required('reviewer')
      );
      console.log(`Local submission ${decision}d.`);
    }
  } finally {
    await platform.dispose();
  }
}
main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Catalog operation failed');
  process.exitCode = 1;
});
