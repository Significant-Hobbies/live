import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { emitNotFoundArtifact } from '../../scripts/build-not-found-artifact.mjs';

const { generateRoutesManifest } = createRequire(join(process.cwd(), 'package.json'))(
  'next/dist/build/generate-routes-manifest.js'
);
const middleware = readFileSync(join(process.cwd(), 'src/middleware.ts'), 'utf8');
const dirs = [
  'src',
  '.next',
  '.next/server',
  '.next/server/app',
  '.next/server/pages',
  '.open-next',
  '.open-next/assets',
  '.open-next/assets/docs',
  '.open-next/assets/__live_prerender',
  '.open-next/assets/__live_prerender/build-fixture',
  '.open-next/assets/__live_prerender/build-fixture/_not-found',
];
const files = [
  'src/middleware.ts',
  '.next/routes-manifest.json',
  '.next/app-path-routes-manifest.json',
  '.next/server/pages-manifest.json',
  '.next/server/app/_not-found.html',
  '.next/server/app/_not-found.meta',
  '.open-next/assets/docs/guide.html',
  '.open-next/assets/__live_prerender/build-fixture/_not-found/index.html',
];
const roots: string[] = [];
const html =
  '<html><head><meta name="robots" content="noindex"></head><body>Existing404</body></html>';

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'live-compiler404-'));
  roots.push(root);
  for (const directory of dirs) mkdirSync(join(root, directory));
  const { routesManifest } = generateRoutesManifest({
    pageKeys: { pages: [], app: ['/_not-found', '/about', '/experiences/[slug]'] },
    config: { experimental: {}, basePath: '', cacheComponents: false },
    redirects: [],
    headers: [],
    onMatchHeaders: [],
    rewrites: { beforeFiles: [], afterFiles: [], fallback: [] },
    restrictedRedirectPaths: [],
    isAppPPREnabled: false,
    appType: 'app',
  });
  const json = (file: string, value: unknown) =>
    writeFileSync(join(root, file), JSON.stringify(value));
  json('.next/routes-manifest.json', routesManifest);
  json('.next/app-path-routes-manifest.json', {
    '/_not-found/page': '/_not-found',
    '/about/page': '/about',
    '/experiences/[slug]/page': '/experiences/[slug]',
  });
  json('.next/server/pages-manifest.json', { '/404': 'pages/404.html', '/500': 'pages/500.html' });
  json('.next/server/app/_not-found.meta', { status: 404 });
  writeFileSync(join(root, '.next/server/app/_not-found.html'), html);
  writeFileSync(join(root, 'src/middleware.ts'), middleware);
  writeFileSync(join(root, '.open-next/assets/docs/guide.html'), 'Public asset');
  return { root, routesManifest, json };
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    for (const file of files) if (existsSync(join(root, file))) unlinkSync(join(root, file));
    for (const directory of [...dirs].reverse()) rmdirSync(join(root, directory));
    rmdirSync(root);
  }
});

describe('generated unknown404 authority', () => {
  it('uses real Next compiler matchers and copies the exact noindex404 artifact', () => {
    const { root, routesManifest } = fixture();
    const authority = emitNotFoundArtifact(root, 'build-fixture');
    expect(authority.routeRegexes).toEqual(
      [...routesManifest.staticRoutes, ...routesManifest.dynamicRoutes].map(
        (route: { regex: string }) => route.regex
      )
    );
    expect(authority.knownPaths).toEqual(
      expect.arrayContaining(['/docs', '/docs/guide', '/docs/guide.html', '/404', '/500'])
    );
    expect(
      readFileSync(join(root, '.open-next/assets', authority.assetPath, 'index.html'), 'utf8')
    ).toBe(html);
  });

  it.each([
    'basePath',
    'unknown-field',
    'protocol',
    'protocol-field',
    'rewrite-field',
    'data-route',
    'missing-app-route',
    'matcher',
    'middleware',
    'status',
    'noindex',
  ])('fails closed when %s authority changes', (change) => {
    const { root, routesManifest: routes, json } = fixture();
    if (change === 'basePath') routes.basePath = '/new';
    if (change === 'unknown-field') routes.newRoutingFeature = true;
    if (change === 'protocol') routes.rsc.header = 'new-flight-header';
    if (change === 'protocol-field') routes.rsc.newProtocolFeature = true;
    if (change === 'rewrite-field') routes.rewrites.newPhase = [];
    if (change === 'data-route') routes.dataRoutes.push({ page: '/new' });
    if (change === 'matcher') routes.staticRoutes[0].regex = 'unanchored';
    json('.next/routes-manifest.json', routes);
    if (change === 'missing-app-route')
      json('.next/app-path-routes-manifest.json', { '/private/page': '/private' });
    if (change === 'middleware')
      writeFileSync(
        join(root, 'src/middleware.ts'),
        'export function middleware() { return new Response("Private"); }'
      );
    if (change === 'status') json('.next/server/app/_not-found.meta', { status: 200 });
    if (change === 'noindex')
      writeFileSync(
        join(root, '.next/server/app/_not-found.html'),
        '<html><body>404</body></html>'
      );
    expect(() => emitNotFoundArtifact(root, 'build-fixture')).toThrow();
  });
});
