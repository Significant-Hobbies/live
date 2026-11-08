// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const runner = resolve('scripts/profile-privacy-database.mjs');
const migration = '0009_noisy_dorian_gray.sql';

function fixture({ applied = ['0000.sql'], column = false, extra = false, failed = false } = {}) {
  const cwd = mkdtempSync(join(tmpdir(), 'live-privacy-db-test-'));
  mkdirSync(join(cwd, 'migrations/d1'), { recursive: true });
  for (const name of ['0000.sql', migration, ...(extra ? ['0008.sql'] : [])])
    writeFileSync(join(cwd, 'migrations/d1', name), '');
  writeFileSync(join(cwd, 'state.json'), JSON.stringify({ applied, column, failed }));
  writeFileSync(
    join(cwd, 'pnpm'),
    `#!/usr/bin/env node
const fs = require('node:fs');
const args = process.argv.slice(2);
fs.appendFileSync('calls.jsonl', JSON.stringify(args) + '\\n');
const state = JSON.parse(fs.readFileSync('state.json', 'utf8'));
if (args.includes('execute')) {
  const sql = args[args.indexOf('--command') + 1];
  const results = sql.startsWith('SELECT') ? state.applied.map(name => ({ name })) :
    (state.column ? [{ name: 'profileVisibility', notnull: 1, dflt_value: "'private'" }] : []);
  process.stdout.write(JSON.stringify([{ success: !state.failed, results }]));
} else if (args.includes('apply')) {
  state.applied.push('${migration}'); state.column = true;
  fs.writeFileSync('state.json', JSON.stringify(state));
  process.stdout.write('Applied migration');
} else process.stdout.write('Recovery bookmark');
`,
    { mode: 0o755 }
  );
  return {
    run: (args: string[]) =>
      spawnSync(process.execPath, [runner, ...args], {
        cwd,
        env: { ...process.env, PATH: `${cwd}:${process.env.PATH}` },
        encoding: 'utf8',
      }),
    calls: () =>
      readFileSync(join(cwd, 'calls.jsonl'), 'utf8')
        .trim()
        .split('\n')
        .map((line) => JSON.parse(line) as string[]),
  };
}

describe('bounded profile privacy database operation', () => {
  it('requires an explicit remote target', () => {
    expect(fixture().run([]).status).not.toBe(0);
  });

  it('inspects without writing by default', () => {
    const f = fixture();
    expect(f.run(['--remote']).status).toBe(0);
    expect(f.calls()).toHaveLength(2);
    expect(f.calls().every((args) => args.includes('execute'))).toBe(true);
  });

  it('rejects other pending migrations before any write', () => {
    const f = fixture({ extra: true });
    expect(f.run(['--remote', '--apply']).status).not.toBe(0);
    expect(f.calls().some((args) => args.includes('apply'))).toBe(false);
  });

  it('rejects inconsistent schema and failed inspections', () => {
    for (const options of [{ column: true }, { failed: true }]) {
      const f = fixture(options);
      expect(f.run(['--remote', '--apply']).status).not.toBe(0);
      expect(f.calls().some((args) => args.includes('apply'))).toBe(false);
    }
  });

  it('captures recovery information before applying and verifies schema and ledger afterward', () => {
    const f = fixture();
    const result = f.run(['--remote', '--apply']);
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain('migration verified');
    const calls = f.calls();
    expect(calls[2]).toContain('time-travel');
    expect(calls[3]).toContain('apply');
    expect(calls.slice(4)).toHaveLength(2);
  });

  it('does not repeat the backfill when the migration is already applied', () => {
    const f = fixture({ applied: ['0000.sql', migration], column: true });
    expect(f.run(['--remote', '--apply']).status).toBe(0);
    expect(f.calls()).toHaveLength(2);
    expect(f.calls().some((args) => args.includes('apply'))).toBe(false);
  });
});
