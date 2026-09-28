import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readProjectFile = (path: string) => readFile(resolve(process.cwd(), path), 'utf8');
const footer = await readProjectFile('landing-astro/src/components/FleetFooter.astro');
const layout = await readProjectFile('landing-astro/src/layouts/Layout.astro');
const privacy = await readProjectFile('src/app/privacy/page.tsx');
const foundry = JSON.parse(await readProjectFile('foundry.json')) as { projectKey?: string };
const livePage = await readProjectFile('landing-astro/src/pages/live.astro');
const featureRow = await readProjectFile('landing-astro/src/components/FeatureRow.astro');
const appHealthLogger = await readProjectFile('landing-astro/public/app-health-log.js');

describe('Live newsletter capture', () => {
  it('tracks the primary hobby finder CTA in App Health', () => {
    expect(livePage.match(/data-log="hobby_finder_opened"/gu)).toHaveLength(1);
    expect(appHealthLogger).toContain('window.appHealth.track(name)');
  });

  it('tracks the primary timeline builder CTA click in App Health', () => {
    expect(featureRow).toContain('data-log="hobby_timeline_builder_opened"');
    expect(featureRow).toContain('href="/timeline/new"');
  });

  it('uses the product-scoped key in the shared consented footer form', () => {
    expect(foundry.projectKey).toMatch(/^pk_[A-Za-z0-9]+$/u);
    expect(footer).toContain('project-key={newsletterProjectKey}');
    expect(footer).toContain('kind="newsletter"');
    expect(footer).toContain('source="live-footer"');
    expect(footer).toContain('theme="light"');
    expect(footer).toContain('style="--newsletter-capture-muted: #62625a"');
    expect(layout).toContain('https://sassmaker.com/newsletter-capture.js');
  });

  it('discloses email and consent storage outside Live account data', () => {
    expect(privacy).toContain('email address and consent');
    expect(privacy).toContain('stored by SaaS Maker');
    expect(privacy).toMatch(/not stored in\s+Live's/u);
  });
});
