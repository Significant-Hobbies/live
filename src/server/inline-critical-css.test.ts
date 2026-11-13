import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, expect, it } from 'vitest';

const files: string[] = [];
const directories: string[] = [];
afterEach(() => {
  for (const file of files.splice(0)) if (existsSync(file)) unlinkSync(file);
  for (const directory of directories.splice(0).reverse())
    if (existsSync(directory)) rmdirSync(directory);
});

it('preserves React-owned body styles while extracting external critical CSS', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'live-critical-css-'));
  directories.push(fixture);
  for (const relative of ['.next', '.next/static', '.next/server', '.next/server/app']) {
    const directory = join(fixture, relative);
    mkdirSync(directory);
    directories.push(directory);
  }
  const cssFile = join(fixture, '.next/static/test.css');
  const htmlFile = join(fixture, '.next/server/app/article.html');
  files.push(cssFile, htmlFile);
  const ownedStyle = '\n.widget { color: tomato; }\n.widget[data-open="true"] { padding: 12px; }\n';
  writeFileSync(cssFile, '.critical { color: green; } .not-used { display: none; }');
  writeFileSync(
    htmlFile,
    `<!doctype html><html><head><link rel="stylesheet" href="/_next/static/test.css"></head><body><p class="critical">Article</p><div class="widget">Feedback</div><style data-react-owned="widget">${ownedStyle}</style><section aria-label="Notifications"></section></body></html>`
  );
  execFileSync(process.execPath, [resolve('scripts/run-inline-critical-css.mjs'), '--strict'], {
    cwd: fixture,
    encoding: 'utf8',
    timeout: 15_000,
  });
  const output = new DOMParser().parseFromString(readFileSync(htmlFile, 'utf8'), 'text/html');
  const managed = output.querySelector('style[data-react-owned="widget"]');
  expect(managed?.parentElement).toBe(output.body);
  expect(managed?.textContent).toBe(ownedStyle);
  expect(managed?.previousElementSibling?.className).toBe('widget');
  expect(managed?.nextElementSibling?.tagName).toBe('SECTION');
  expect(output.head.querySelector('style')?.textContent).toContain('.critical');
  expect(output.head.querySelector('style')?.textContent).not.toContain('.not-used');
});
