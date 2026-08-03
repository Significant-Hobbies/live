#!/usr/bin/env node

import { mkdirSync, writeFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';

const base = process.env.AUDIT_BASE_URL ?? 'http://localhost:3000';
const out = process.argv[2] ?? '.fleet/design-evidence/product-audit';
const viewports = [
  ['mobile', { width: 390, height: 844 }],
  ['desktop', { width: 1440, height: 1000 }],
];

const states = {
  public: [
    ['landing', '/', 200],
    ['about', '/about', 200],
    ['blog', '/blog', 200],
    ['article', '/blog/side-quests', 200],
    ['bucket-list-before-30', '/bucket-list-before-30', 200],
    ['bucket-list-before-50', '/bucket-list-before-50', 200],
    ['bucket-list-ideas', '/bucket-list-ideas', 200],
    ['changelog', '/changelog', 200],
    ['cheap-hobbies', '/cheap-hobbies', 200],
    ['compare', '/compare', 200],
    ['compare-journeys', '/compare-journeys', 200],
    ['possibilities', '/find-your-hobby', 200],
    ['experiences', '/experiences', 200],
    ['experience-detail', '/experiences/stonehenge-england', 200],
    ['explore', '/explore', 200],
    ['get-started', '/get-started', 200],
    ['hobbies', '/hobbies', 200],
    ['hobby-category', '/hobbies/category/creative', 200],
    ['random-hobby', '/hobbies/random', 200],
    ['hobbies-for-adults', '/hobbies-for-adults', 200],
    ['hobbies-for-mental-health', '/hobbies-for-mental-health', 200],
    ['hobbies-for-resume', '/hobbies-for-resume', 200],
    ['hobbies-to-try', '/hobbies-to-try', 200],
    ['how-to-bucket-list', '/how-to-make-a-bucket-list', 200],
    ['journeys', '/journeys', 200],
    ['life-in-weeks', '/life-in-weeks', 200],
    ['life-bingo', '/life-bingo', 200],
    ['login', '/login', 200],
    ['public-lists', '/bucket-lists', 200],
    ['public-list-detail', '/bucket-lists/barack-obama', 200],
    ['journey', '/journeys/steve-jobs', 200],
    ['hobby', '/hobbies/guitar', 200],
    ['manifesto', '/manifesto', 200],
    ['onboarding', '/onboarding', 200],
    ['privacy', '/privacy', 200],
    ['public-profile', '/u/stevejobs', 200],
    ['search', '/search', 200],
    ['starter-kits', '/starter-kits', 200],
    ['terms', '/terms', 200],
    ['recent-timelines', '/timelines/recent', 200],
    ['tools', '/tools', 200],
    ['cost-calculator', '/tools/cost-calculator', 200],
    ['time-calculator', '/tools/time-calculator', 200],
    ['travel-bucket-list', '/travel-bucket-list', 200],
    ['product-explainer', '/what-are-significant-hobbies', 200],
    ['not-found', '/definitely-not-a-real-page', 404],
  ],
  local: [
    ['dashboard', '/', 200],
    ['live-more', '/live-more', 200],
    ['daily', '/daily', 200],
    ['history', '/history', 200],
    ['trajectory', '/trajectory', 200],
    ['bucket-list', '/bucket-list', 200],
    ['bucket-list-new', '/bucket-list/new', 200],
    ['commitments', '/commitments', 200],
    ['settings', '/settings', 200],
    ['timeline', '/timeline', 200],
    ['timeline-new', '/timeline/new', 200],
    ['side-quests', '/side-quests', 200],
  ],
  account: [
    ['dashboard', '/', 200],
    ['live-more', '/live-more', 200],
    ['daily', '/daily', 200],
    ['history', '/history', 200],
    ['trajectory', '/trajectory', 200],
    ['bucket-list', '/bucket-list', 200],
    ['bucket-list-new', '/bucket-list/new', 200],
    ['commitments', '/commitments', 200],
    ['settings', '/settings', 200],
    ['timeline', '/timeline', 200],
    ['timeline-new', '/timeline/new', 200],
  ],
  incomplete: [
    ['dashboard', '/', 200, '/onboarding'],
    ['live-more', '/live-more', 200, '/onboarding'],
    ['daily', '/daily', 200, '/onboarding'],
    ['history', '/history', 200, '/onboarding'],
    ['trajectory', '/trajectory', 200, '/onboarding'],
    ['bucket-list', '/bucket-list', 200, '/onboarding'],
    ['bucket-list-new', '/bucket-list/new', 200, '/bucket-list/new'],
    ['commitments', '/commitments', 200, '/onboarding'],
    ['settings', '/settings', 200, '/onboarding'],
    ['timeline', '/timeline', 200, '/onboarding'],
    ['timeline-new', '/timeline/new', 200, '/timeline/new'],
    ['side-quests', '/side-quests', 200, '/side-quests'],
  ],
};

mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const report = [];

async function seedLocal(page) {
  await page.goto(`${base}/onboarding`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(async () => {
    const database = await new Promise((resolve, reject) => {
      const request = indexedDB.open('significant-hobbies-local', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('records');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const transaction = database.transaction('records', 'readwrite');
      const now = new Date().toISOString();
      const records = [
        {
          key: 'onboarding:profile',
          domain: 'onboarding',
          schemaVersion: 1,
          installationId: 'audit-device',
          updatedAt: now,
          value: { name: 'Local Audit', birthDate: '1990-01-01' },
        },
        {
          key: 'onboarding:bucket-items',
          domain: 'bucket-list',
          schemaVersion: 1,
          installationId: 'audit-device',
          updatedAt: now,
          value: {
            items: [{ title: 'See the northern lights', status: 'planned' }],
            annualFocus: 'Make room for wonder',
          },
        },
      ];
      for (const record of records) transaction.objectStore('records').put(record, record.key);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
    database.close();
  });
}

async function signIn(page) {
  const email = 'e2e-authenticated@significanthobbies.test';
  const password = 'e2e-test-password-not-a-secret';
  await page.request.post(`${base}/api/auth/sign-up/email`, {
    data: { email, password, name: 'E2E Tester' },
    failOnStatusCode: false,
  });
  const signInResponse = await page.request.post(`${base}/api/auth/sign-in/email`, {
    data: { email, password },
    failOnStatusCode: false,
  });
  if (!signInResponse.ok() && signInResponse.status() !== 403) {
    throw new Error(`Test sign-in failed with ${signInResponse.status()}`);
  }
  const onboarding = await page.request.post(`${base}/api/test/complete-onboarding`, {
    failOnStatusCode: false,
  });
  if (!onboarding.ok()) throw new Error(`Account onboarding failed with ${onboarding.status()}`);
}

async function signInIncomplete(page, suffix) {
  const email = `e2e-incomplete-${suffix}@significanthobbies.test`;
  const password = 'e2e-test-password-not-a-secret';
  await page.request.post(`${base}/api/auth/sign-up/email`, {
    data: { email, password, name: 'New Person' },
    failOnStatusCode: false,
  });
  const response = await page.request.post(`${base}/api/auth/sign-in/email`, {
    data: { email, password },
    failOnStatusCode: false,
  });
  if (!response.ok() && response.status() !== 403) {
    throw new Error(`Incomplete-account sign-in failed with ${response.status()}`);
  }
}

try {
  for (const [viewportName, viewport] of viewports) {
    for (const [state, routes] of Object.entries(states)) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const consoleErrors = [];
      const failedResponses = [];
      page.on('console', (message) => {
        if (
          message.type() === 'error' &&
          !message
            .text()
            .startsWith('Failed to load resource: the server responded with a status of')
        ) {
          consoleErrors.push(message.text());
        }
      });
      page.on('pageerror', (error) => consoleErrors.push(error.message));
      page.on('response', (response) => {
        if (response.status() >= 400) {
          failedResponses.push({ status: response.status(), url: response.url() });
        }
      });

      if (state === 'local') await seedLocal(page);
      if (state === 'account') await signIn(page);
      if (state === 'incomplete') await signInIncomplete(page, viewportName);

      for (const [name, route, expectedStatus, expectedPath] of routes) {
        consoleErrors.length = 0;
        failedResponses.length = 0;
        const response = await page.goto(`${base}${route}`, {
          waitUntil: 'domcontentloaded',
          timeout: 60_000,
        });
        await page.waitForTimeout(500);

        const status = response?.status() ?? 0;
        const finalUrl = page.url();
        const mainCount = await page.locator('main#main').count();
        const h1Count = await page.locator('main#main h1').count();
        const visibleH1 = await page.locator('main#main h1:visible').count();
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        const overflowElements =
          overflow > 1
            ? await page.evaluate(() =>
                [...document.querySelectorAll('body *')]
                  .map((element) => {
                    const rect = element.getBoundingClientRect();
                    return {
                      element: element.tagName.toLowerCase(),
                      className: element.getAttribute('class') ?? '',
                      left: Math.round(rect.left),
                      right: Math.round(rect.right),
                      width: Math.round(rect.width),
                    };
                  })
                  .filter(
                    ({ left, right }) =>
                      left < -1 || right > document.documentElement.clientWidth + 1
                  )
                  .slice(0, 20)
              )
            : [];
        const serious = (await new AxeBuilder({ page }).analyze()).violations.filter(
          ({ impact }) => impact === 'serious' || impact === 'critical'
        );
        const unexpectedResponses = failedResponses.filter(
          ({ status: responseStatus, url }) =>
            !url.startsWith('https://vitals.fleet.workers.dev/') &&
            (url !== finalUrl || responseStatus !== expectedStatus)
        );
        const unexpectedFooter =
          (state === 'local' || state === 'account') &&
          [
            '/',
            '/live-more',
            '/daily',
            '/history',
            '/trajectory',
            '/bucket-list',
            '/commitments',
            '/settings',
            '/timeline',
            '/side-quests',
          ].includes(route)
            ? await page.locator('[data-site-footer]').count()
            : 0;

        const issues = [];
        if (status !== expectedStatus) issues.push(`status ${status}, expected ${expectedStatus}`);
        if (expectedPath && new URL(finalUrl).pathname !== expectedPath) {
          issues.push(`ended at ${new URL(finalUrl).pathname}, expected ${expectedPath}`);
        }
        if (mainCount !== 1) issues.push(`${mainCount} main#main landmarks`);
        if (h1Count !== 1 || visibleH1 !== 1) issues.push(`${h1Count} h1 (${visibleH1} visible)`);
        if (overflow > 1) issues.push(`${overflow}px horizontal overflow`);
        if (serious.length) issues.push(`axe: ${serious.map(({ id }) => id).join(', ')}`);
        if (consoleErrors.length) issues.push(`console: ${consoleErrors.join(' | ')}`);
        if (unexpectedResponses.length) {
          issues.push(
            `responses: ${unexpectedResponses.map(({ status: responseStatus, url }) => `${responseStatus} ${url}`).join(' | ')}`
          );
        }
        if (unexpectedFooter) issues.push('public footer shown inside workspace');

        const screenshot = `${out}/${viewportName}-${state}-${name}.png`;
        await page.screenshot({ path: screenshot, fullPage: true });
        report.push({
          viewport: viewportName,
          state,
          name,
          route,
          finalUrl,
          status,
          mainCount,
          h1Count,
          overflow,
          overflowElements,
          serious: serious.map(({ id, impact, help, nodes }) => ({
            id,
            impact,
            help,
            nodes: nodes.map(({ target, html, failureSummary }) => ({
              target,
              html,
              failureSummary,
            })),
          })),
          consoleErrors,
          failedResponses: unexpectedResponses,
          screenshot,
          issues,
        });
        console.log(
          `${issues.length ? 'FAIL' : 'PASS'} ${viewportName} ${state} ${route}${issues.length ? ` — ${issues.join('; ')}` : ''}`
        );
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
}

writeFileSync(`${out}/report.json`, `${JSON.stringify(report, null, 2)}\n`);
const failures = report.filter(({ issues }) => issues.length);
console.log(`\n${report.length - failures.length}/${report.length} surfaces passed the audit.`);
if (failures.length) process.exitCode = 1;
