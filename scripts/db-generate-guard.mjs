#!/usr/bin/env node
// Refuses `pnpm db:generate` while the Drizzle snapshot is stale.
//
// drizzle/meta/_journal.json only records migration 0000. Everything since
// (better-auth, life bingo, trajectory, quests, habit columns, creed/onboarding,
// visibility/timezone) arrived via `db:push` or hand-written SQL that was never
// added to the journal. So drizzle-kit diffs against an ancient baseline and
// emits CREATE TABLE for tables that already exist in production and ADD COLUMN
// for columns that already exist — output that fails on contact with the real
// database, and looks plausible enough to commit by mistake.
//
// This guard exists so the failure is a clear message instead of a bad
// migration. Remove it once the snapshot is rebaselined against production.
// See docs/knowledge/learnings.md L12.

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DRIZZLE_DIR = 'drizzle';
const JOURNAL = join(DRIZZLE_DIR, 'meta', '_journal.json');

function fail(lines) {
  console.error(`\n  db:generate is disabled in this repo.\n`);
  for (const line of lines) console.error(`  ${line}`);
  console.error('');
  process.exit(1);
}

let journalTags = [];
try {
  const journal = JSON.parse(readFileSync(JOURNAL, 'utf8'));
  journalTags = (journal.entries ?? []).map((e) => e.tag);
} catch (err) {
  fail([`Could not read ${JOURNAL}: ${err.message}`]);
}

const sqlFiles = readdirSync(DRIZZLE_DIR)
  .filter((f) => f.endsWith('.sql'))
  .map((f) => f.replace(/\.sql$/, ''))
  .sort();

const untracked = sqlFiles.filter((f) => !journalTags.includes(f));

fail([
  `The snapshot in ${JOURNAL} knows ${journalTags.length} migration(s): ${journalTags.join(', ')}`,
  `but ${DRIZZLE_DIR}/ holds ${sqlFiles.length}. Not in the journal:`,
  ...untracked.map((f) => `  - ${f}.sql`),
  '',
  'Running drizzle-kit generate here diffs against migration 0000 and emits',
  'CREATE TABLE / ADD COLUMN for objects that already exist in production.',
  '',
  'Migrations in this repo are hand-written. To add one:',
  `  1. edit src/db/schema.ts`,
  `  2. write ${DRIZZLE_DIR}/<n>_<name>.sql by hand (see 0003 for the convention)`,
  `  3. apply it yourself; do not assume any database has it`,
  '',
  'To rebaseline the snapshot and retire this guard, see',
  'docs/knowledge/learnings.md L12 and STATUS.md.',
  '',
  'If you really need the raw command: pnpm db:generate:unsafe',
]);
