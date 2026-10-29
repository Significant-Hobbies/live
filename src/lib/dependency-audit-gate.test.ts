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

const passedQualification = {
  success: true,
  numTotalTests: 1,
  numPassedTests: 1,
  numFailedTests: 0,
  numPendingTests: 0,
  numTodoTests: 0,
  numTotalTestSuites: 1,
  numPassedTestSuites: 1,
  numFailedTestSuites: 0,
  numPendingTestSuites: 0,
  testResults: [{ status: 'passed' }],
};

function gate(
  advisories: object[],
  guardExit = 0,
  completeReport = true,
  guardReport = JSON.stringify(passedQualification)
) {
  const directory = mkdtempSync(join(tmpdir(), 'live-audit-gate-'));
  const pnpm = join(directory, 'pnpm');
  writeFileSync(
    pnpm,
    `#!${process.execPath}\nif (process.argv[2] === 'audit') process.stdout.write(process.env.TEST_AUDIT_REPORT);\nelse if (process.argv.slice(2, 6).join(' ') === 'exec vitest run src/lib/auth-dependency-qualification.test.ts') { process.stdout.write(process.env.TEST_GUARD_REPORT); process.exit(Number(process.env.TEST_GUARD_EXIT)); }\nelse process.exit(2);\n`,
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
        TEST_GUARD_REPORT: guardReport,
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
  it.each([
    [
      'skipped test',
      JSON.stringify({ ...passedQualification, numPassedTests: 0, numPendingTests: 1 }),
    ],
    ['todo test', JSON.stringify({ ...passedQualification, numPassedTests: 0, numTodoTests: 1 })],
    [
      'zero executed tests',
      JSON.stringify({ ...passedQualification, numTotalTests: 0, numPassedTests: 0 }),
    ],
    ['pending suite', JSON.stringify({ ...passedQualification, numPendingTestSuites: 1 })],
    [
      'skipped suite result',
      JSON.stringify({ ...passedQualification, testResults: [{ status: 'skipped' }] }),
    ],
    ['unsuccessful suite run', JSON.stringify({ ...passedQualification, success: false })],
    ['empty report', ''],
    ['malformed report', '{'],
    ['missing counters', '{}'],
  ])('rejects a %s even when Vitest exits zero', (_label, guardReport) => {
    const result = gate(authAdvisories, 0, true, guardReport);
    expect(result.status).toBe(1);
    expect(result.stdout).not.toContain('qualified non-applicable optional-auth advisories');
  });
});
