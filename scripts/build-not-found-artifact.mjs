import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { generateETag } from 'next/dist/server/lib/etag.js';

const NO_OP_MIDDLEWARE = 'fb4c7f4c1000b530f98f502dc05beec4fad327f3693ccc2a8f1958e571190eec';
const RSC_PROTOCOL = {
  header: 'rsc',
  varyHeader: 'rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch',
  prefetchHeader: 'next-router-prefetch',
  didPostponeHeader: 'x-nextjs-postponed',
  contentTypeHeader: 'text/x-component',
  suffix: '.rsc',
  prefetchSegmentHeader: 'next-router-segment-prefetch',
  prefetchSegmentSuffix: '.segment.rsc',
  prefetchSegmentDirSuffix: '.segments',
  clientParamParsing: false,
  dynamicRSCPrerender: false,
};
const MANIFEST_KEYS = new Set([
  'version',
  'pages404',
  'appType',
  'caseSensitive',
  'basePath',
  'redirects',
  'headers',
  'onMatchHeaders',
  'rewrites',
  'dynamicRoutes',
  'staticRoutes',
  'dataRoutes',
  'rsc',
  'rewriteHeaders',
]);

export function emitNotFoundArtifact(projectDir, buildId) {
  const readJson = (file) => JSON.parse(readFileSync(join(projectDir, file), 'utf8'));
  const routes = readJson('.next/routes-manifest.json');
  const appPaths = readJson('.next/app-path-routes-manifest.json');
  validateRoutingAuthority(projectDir, routes);
  const applicationRoutes = [...routes.staticRoutes, ...routes.dynamicRoutes];
  const compilerPages = new Set(applicationRoutes.map((route) => route.page));
  if (Object.values(appPaths).some((route) => !compilerPages.has(route)))
    throw new Error('Unknown404 compiler route coverage is incomplete.');
  const customRoutes = [
    ...routes.redirects,
    ...routes.headers,
    ...routes.onMatchHeaders,
    ...routes.rewrites.beforeFiles,
    ...routes.rewrites.afterFiles,
    ...routes.rewrites.fallback,
  ];
  const routeRegexes = [...applicationRoutes, ...customRoutes].map((route) => {
    if (
      typeof route.regex !== 'string' ||
      !route.regex.startsWith('^') ||
      !route.regex.endsWith('$')
    )
      throw new Error('Unknown404 compiler route matcher is unsupported.');
    new RegExp(route.regex);
    return route.regex;
  });
  const knownPaths = new Set(Object.keys(readJson('.next/server/pages-manifest.json')));
  collectAssetPaths(join(projectDir, '.open-next/assets'), '', knownPaths);
  const htmlFile = join(projectDir, '.next/server/app/_not-found.html');
  const html = readFileSync(htmlFile, 'utf8');
  const metadata = readJson('.next/server/app/_not-found.meta');
  if (metadata.status !== 404 || !/<meta name="robots" content="noindex"\/?>/.test(html))
    throw new Error('Unknown404 compiler artifact status or indexing boundary changed.');
  const assetPath = `/__live_prerender/${buildId}/_not-found/`;
  const destination = join(projectDir, '.open-next/assets', assetPath.slice(1));
  mkdirSync(destination, { recursive: true });
  cpSync(htmlFile, join(destination, 'index.html'));
  knownPaths.add(assetPath.slice(0, -1));
  knownPaths.add(`${assetPath}index.html`);
  return {
    assetPath,
    etag: generateETag(html),
    vary: routes.rsc.varyHeader,
    caseSensitive: routes.caseSensitive,
    routeRegexes: [...new Set(routeRegexes)],
    knownPaths: [...knownPaths].sort(),
  };
}

function validateRoutingAuthority(projectDir, routes) {
  const middleware = readFileSync(join(projectDir, 'src/middleware.ts'));
  const middlewareHash = createHash('sha256').update(middleware).digest('hex');
  const supportedProtocol =
    Object.keys(routes.rsc).length === Object.keys(RSC_PROTOCOL).length &&
    Object.entries(RSC_PROTOCOL).every(([key, value]) => routes.rsc[key] === value);
  const supportedRewrites = Object.keys(routes.rewrites).every((key) =>
    ['beforeFiles', 'afterFiles', 'fallback'].includes(key)
  );
  if (
    routes.version !== 3 ||
    routes.appType !== 'app' ||
    routes.basePath !== '' ||
    routes.pages404 !== true ||
    typeof routes.caseSensitive !== 'boolean' ||
    Object.keys(routes).some((key) => !MANIFEST_KEYS.has(key)) ||
    routes.dataRoutes.length ||
    !supportedProtocol ||
    !supportedRewrites ||
    middlewareHash !== NO_OP_MIDDLEWARE
  )
    throw new Error(
      'Unknown404 routing authority changed; qualify it before enabling the asset path.'
    );
}

function collectAssetPaths(directory, prefix, paths) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const pathname = `${prefix}/${entry.name}`;
    paths.add(pathname);
    if (entry.isDirectory()) collectAssetPaths(join(directory, entry.name), pathname, paths);
    else if (entry.isFile() && pathname.endsWith('.html')) {
      paths.add(pathname.slice(0, -5));
      if (entry.name === 'index.html') paths.add(prefix || '/');
    } else if (!entry.isFile())
      throw new Error('Unknown404 asset routing contains an unsupported entry.');
  }
}
