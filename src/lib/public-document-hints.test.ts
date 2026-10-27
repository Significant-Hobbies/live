import { describe, expect, it } from 'vitest';
import { withPublicDocumentHints } from '../../public-document-hints.mjs';

describe('HTML discovery hints', () => {
  const html = '<main>Original HTML</main>';
  const handler = withPublicDocumentHints(
    async () =>
      new Response(html, {
        headers: {
          'Content-Type': 'text/html',
          Vary: 'Cookie',
          Link: '</style.css>; rel="preload"',
        },
      })
  );
  it('keeps body and existing headers while advertising Markdown', async () => {
    const response = await handler(
      new Request('https://live.significanthobbies.com/about'),
      {},
      {}
    );
    expect(await response.text()).toBe(html);
    expect(response.headers.get('vary')).toBe('Cookie, Accept');
    expect(response.headers.get('link')).toContain('</about.md>');
    expect(response.headers.get('link')).toContain('</style.css>');
    expect(response.headers.get('link')).toContain('</llms.txt>');
  });
  it.each(['/daily', '/u/person', '/u/person/timeline', '/hub'])(
    'does not advertise private or separately owned %s',
    async (path) => {
      const response = await handler(
        new Request(`https://live.significanthobbies.com${path}`),
        {},
        {}
      );
      expect(response.headers.get('vary')).toBe('Cookie');
      expect(response.headers.get('link')).not.toContain('.md');
    }
  );
  it('preserves apex Hub ownership', async () => {
    const response = await handler(new Request('https://significanthobbies.com/'), {}, {});
    expect(response.headers.get('link')).not.toContain('.md');
  });
});
