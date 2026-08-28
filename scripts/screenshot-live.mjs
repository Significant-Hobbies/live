// Screenshot the live production site for visual review.
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const SHOTS = [
  { name: 'landing', url: 'https://live.significanthobbies.com/', fullPage: false },
  { name: 'landing-full', url: 'https://live.significanthobbies.com/', fullPage: true },
  { name: 'hobbies', url: 'https://live.significanthobbies.com/hobbies', fullPage: false },
  { name: 'explore', url: 'https://live.significanthobbies.com/explore', fullPage: false },
  { name: 'today', url: 'https://live.significanthobbies.com/', fullPage: false },
  { name: 'daily', url: 'https://live.significanthobbies.com/daily', fullPage: false },
  { name: 'commitments', url: 'https://live.significanthobbies.com/commitments', fullPage: false },
  { name: 'manifesto', url: 'https://live.significanthobbies.com/manifesto', fullPage: false },
  { name: 'tools', url: 'https://live.significanthobbies.com/tools', fullPage: false },
  { name: 'blog', url: 'https://live.significanthobbies.com/blog', fullPage: false },
  { name: 'side-quests', url: 'https://live.significanthobbies.com/side-quests', fullPage: false },
  { name: 'login', url: 'https://live.significanthobbies.com/login', fullPage: false },
];

const browser = await chromium.launch();
const outDir = 'screenshots-live';
mkdirSync(outDir, { recursive: true });

for (const shot of SHOTS) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await page.goto(shot.url, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${outDir}/${shot.name}.png`, fullPage: shot.fullPage });
    console.log(`OK ${shot.name}`);
  } catch (e) {
    console.log(`FAIL ${shot.name}: ${e.message}`);
  }
  await page.close();
}

await browser.close();
console.log('Done');
