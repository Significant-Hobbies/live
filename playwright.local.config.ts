import { defineConfig, devices } from '@playwright/test';

// Local verification config: points at an already-running dev server instead
// of spawning `pnpm dev:test-auth` on the hardcoded :3000 (squatted locally).
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: 0,
  workers: 4,
  reporter: 'list',
  use: { baseURL: 'http://localhost:3001', trace: 'on-first-retry', screenshot: 'only-on-failure' },
  projects: [{ name: 'desktop', use: { ...devices['Desktop Chrome'] } }],
});
