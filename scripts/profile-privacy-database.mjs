import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';

const migration = '0009_noisy_dorian_gray.sql';
const apply = process.argv.includes('--apply');
if (!process.argv.includes('--remote')) throw new Error('Explicit --remote is required.');

function wrangler(args) {
  return execFileSync('pnpm', ['exec', 'wrangler', ...args], { encoding: 'utf8' });
}

function query(sql) {
  const output = JSON.parse(
    wrangler(['d1', 'execute', 'DB', '--remote', '--command', sql, '--json'])
  );
  if (!Array.isArray(output) || output.length !== 1 || !output[0].success)
    throw new Error('Database inspection did not return one successful result.');
  return output[0].results;
}

const applied = new Set(query('SELECT name FROM d1_migrations ORDER BY id').map((row) => row.name));
const pending = readdirSync('migrations/d1')
  .filter((name) => name.endsWith('.sql') && !applied.has(name))
  .sort();
const columns = query('PRAGMA table_info("User")').map((row) => row.name);
console.log(
  JSON.stringify({ pending, profileVisibilityColumn: columns.includes('profileVisibility') })
);

if (apply) {
  if (pending.length === 0 && columns.includes('profileVisibility')) {
    console.log('Profile privacy migration is already applied.');
  } else {
    if (pending.length !== 1 || pending[0] !== migration || columns.includes('profileVisibility'))
      throw new Error(
        'Only the unapplied profile privacy migration may run; inspect database drift.'
      );
    console.log(wrangler(['d1', 'time-travel', 'info', 'DB', '--json']));
    console.log(wrangler(['d1', 'migrations', 'apply', 'DB', '--remote']));
    const after = query('PRAGMA table_info("User")');
    const visibility = after.find((column) => column.name === 'profileVisibility');
    if (!visibility || visibility.notnull !== 1 || visibility.dflt_value !== "'private'")
      throw new Error('Profile privacy column failed post-migration verification.');
    if (!query('SELECT name FROM d1_migrations ORDER BY id').some((row) => row.name === migration))
      throw new Error('Profile privacy migration is absent from the applied ledger.');
    console.log('Profile privacy migration verified.');
  }
}
