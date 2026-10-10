import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readProjectFile = (path: string) => readFile(resolve(process.cwd(), path), 'utf8');
const content = JSON.parse(await readProjectFile('landing-astro/src/content/live.json'));
const layout = await readProjectFile('landing-astro/src/layouts/Layout.astro');
const privacy = await readProjectFile('src/app/privacy/page.tsx');
const livePage = await readProjectFile('landing-astro/src/pages/live.astro');
const appHealthLogger = await readProjectFile('landing-astro/public/app-health-log.js');

describe('Live newsletter capture', () => {
  it('tracks the primary catalog CTA in App Health', () => {
    expect(layout.match(/setAttribute\('data-log', 'catalog_opened'\)/gu)).toHaveLength(1);
    expect(layout).toContain('main > section:first-child a[href="/experiences"]');
    expect(layout.indexOf("document.addEventListener('DOMContentLoaded'")).toBeLessThan(
      layout.indexOf('src="/app-health-log.js"')
    );
    expect(content.hero.primary.href).toBe('/experiences');
    expect(livePage).toContain('<GalleryPage content={content} />');
    expect(appHealthLogger).toContain('tracker.track(name)');
  });

  it('flushes App Health events before plain same-tab CTA navigation', () => {
    expect(appHealthLogger).toContain('tracker.flush()');
    expect(appHealthLogger).toContain('setTimeout(navigate, 4000)');
    expect(appHealthLogger).toContain('!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey');
  });

  it('uses the catalog-scoped StudioFooter newsletter form', () => {
    expect(content.footer.catalogId).toBe('live');
    expect(content.footer.capture).toBe('newsletter');
    expect(content.footer.links).toContainEqual({ label: 'Privacy', href: '/privacy' });
    expect(layout).toContain('<Base {...baseProps(content)}>');
    expect(layout).not.toContain('https://sassmaker.com/newsletter-capture.js');
  });

  it('discloses email and consent storage outside Live account data', () => {
    expect(privacy).toContain('email address and consent');
    expect(privacy).toContain('stored by SaaS Maker');
    expect(privacy).toMatch(/not stored in\s+Live's/u);
  });
});
