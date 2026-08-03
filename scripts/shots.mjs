#!/usr/bin/env node
// Dev-only screenshot helper for design review.
//
// Signs in through better-auth's gated email endpoint (ENABLE_TEST_AUTH=1) and
// captures the logged-in surfaces at desktop and mobile widths. Existed because
// the logged-in UI is otherwise unreviewable: Google OAuth is the only
// production sign-in path and Playwright cannot complete it.
//
// Usage: node scripts/shots.mjs [outDir]

import { mkdirSync } from 'node:fs';
// @playwright/test is the installed package; plain `playwright` is not a dep.
import { chromium, devices } from '@playwright/test';

const BASE = process.env.SHOTS_BASE_URL ?? 'http://localhost:3000';
const OUT = process.argv[2] ?? '.shots';
const EMAIL = 'e2e-authenticated@significanthobbies.test';
const PASSWORD = 'e2e-test-password-not-a-secret';

const ROUTES = [
  ['today', '/'],
  ['daily', '/daily'],
  ['trajectory', '/trajectory'],
  ['commitments', '/commitments'],
  ['bucket-list', '/bucket-list'],
  ['live-more', '/live-more'],
  ['profile', '/u/e2etester'],
  ['history', '/history'],
];

const VIEWPORTS = [
  ['desktop', { width: 1440, height: 900 }],
  ['tablet', { width: 768, height: 1024 }],
  ['mobile', devices['Pixel 7'].viewport],
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
try {
  for (const [vpName, viewport] of VIEWPORTS) {
    // `.scroll-reveal` uses `animation-timeline: view()`, whose progress stays
    // at 0% (opacity 0) for anything that never enters the scrollport — which in
    // a fullPage capture means most of the page renders blank. The reduced-motion
    // rules force opacity 1, so review shots are taken that way to show real
    // content rather than the reveal's initial frame.
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 2,
      reducedMotion: process.env.SHOTS_MOTION === 'allow' ? 'no-preference' : 'reduce',
    });
    const page = await context.newPage();

    const signIn = await page.request.post(`${BASE}/api/auth/sign-in/email`, {
      data: { email: EMAIL, password: PASSWORD },
      failOnStatusCode: false,
    });
    if (!signIn.ok()) {
      throw new Error(
        `Sign-in failed (${signIn.status()}). Start the server with: pnpm dev:test-auth`
      );
    }

    for (const [name, route] of ROUTES) {
      await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 60_000 });
      // Let entrance animations settle so shots are not caught mid-transition.
      await page.waitForTimeout(700);
      const file = `${OUT}/${vpName}-${name}.png`;
      await page.screenshot({ path: file, fullPage: true });
      console.log(`${file}  <-  ${route}`);
    }
    await context.close();
  }
} finally {
  await browser.close();
}
