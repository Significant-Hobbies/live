// @vitest-environment node

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const script = fileURLToPath(new URL('../../scripts/check-code-health.mjs', import.meta.url));
const optionalAuthIds = ['GHSA-965c-763c-88jm', 'GHSA-q84f-53jg-9ppm', 'GHSA-r4xp-prcw-77qf'];
const authAdvisories = optionalAuthIds.map((github_advisory_id, index) => ({
  github_advisory_id,
  module_name: 'better-auth',
  severity: index === 0 ? 'critical' : 'high',
}));

function gate(advisories: object[], guardExit = 0, completeReport = true) {
  const directory = mkdtempSync(join(tmpdir(), 'live-audit-gate-'));
  const pnpm = join(directory, 'pnpm');
  writeFileSync(
    pnpm,
    `#!${process.execPath}\nif (process.argv[2] === 'audit') process.stdout.write(process.env.TEST_AUDIT_REPORT);\nelse if (process.argv.slice(2).join(' ') === 'exec vitest run src/lib/auth-dependency-qualification.test.ts') process.exit(Number(process.env.TEST_GUARD_EXIT));\nelse process.exit(2);\n`,
    { mode: 0o700 }
  );
  const report = completeReport
    ? {
        advisories: Object.fromEntries(advisories.map((advisory, i) => [i, advisory])),
        metadata: { vulnerabilities: {} },
      }
    : { error: 'registry unavailable' };
  try {
    return spawnSync(process.execPath, [script, 'dependencies'], {
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: `${directory}:${process.env.PATH}`,
        TEST_AUDIT_REPORT: JSON.stringify(report),
        TEST_GUARD_EXIT: String(guardExit),
      },
    });
  } finally {
    unlinkSync(pnpm);
    rmdirSync(directory);
  }
}

describe('dependency release gate', () => {
  it('qualifies only the exact optional-auth findings after the actual-config guard passes', () => {
    const result = gate(authAdvisories);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('3 qualified non-applicable optional-auth advisories');
  });
  it('fails closed when the production auth qualification fails', () => {
    const result = gate(authAdvisories, 1);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('exited with status 1');
  });
  it('still rejects an unrelated critical advisory', () => {
    const result = gate([
      ...authAdvisories,
      {
        github_advisory_id: 'GHSA-new-critical',
        module_name: 'other-package',
        severity: 'critical',
      },
    ]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('GHSA-new-critical');
  });
  it('does not qualify a matching advisory identifier on another package', () => {
    const result = gate([{ ...authAdvisories[0], module_name: 'other-package' }]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(optionalAuthIds[0]);
  });
  it('does not accept an unavailable or incomplete audit as zero vulnerabilities', () => {
    const result = gate([], 0, false);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('complete vulnerability report');
  });
});
