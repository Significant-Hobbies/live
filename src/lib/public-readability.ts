import { createAgentSurfaceManifest } from './agent-surfaces/manifest.mjs';
import { createAgentSurfaceHandler } from './agent-surfaces/handler.mjs';
import { markdownPathFor } from './agent-surfaces/http.mjs';
import { publicStaticSitemap } from './public-sitemap';
import { renderPublicRouteMarkdown } from './public-route-markdown';
import home from '../../landing-astro/src/content/live.json';

const origin = home.url;
const routes = publicStaticSitemap().map((entry) => {
  const path = new URL(entry.url).pathname;
  return {
    path,
    url: entry.url,
    md: origin + markdownPathFor(path),
    title: path === '/' ? home.page.title : path.split('/').at(-1)!.replaceAll('-', ' '),
    description: '',
    full: path !== '/explore' && !path.startsWith('/hobbies/'),
  };
});
// Keep core pages ahead of large detail collections in the bounded full export.
const detailRank = (path: string) =>
  path.split('/').length > 2 && !path.startsWith('/tools/') && path !== '/hobbies/random' ? 1 : 0;
routes.sort((left, right) => detailRank(left.path) - detailRank(right.path));
const publicReadabilityManifest = createAgentSurfaceManifest({
  name: 'Live',
  url: origin,
  summary: home.page.description,
  contact: 'https://github.com/Significant-Hobbies/live/issues',
  trainingAllowed: true,
  sitemap: `${origin}/sitemap.xml`,
  openapi: `${origin}/openapi.json`,
  excludedPaths: [
    '/api',
    '/auth',
    '/login',
    '/daily',
    '/settings',
    '/timeline',
    '/bucket-list',
    '/journal',
    '/habits',
    '/commitments',
    '/history',
    '/local-workspace',
    '/hub',
  ],
  notes: [
    'Private and browser-local records are excluded. Opt-in public profiles are served only after checking current PUBLIC visibility and are not cached or included in the combined corpus.',
  ],
  surfaces: routes.map((route) => ({
    id: route.path === '/' ? 'home' : route.path.slice(1),
    url: route.url,
    md: route.md,
    kind: 'static',
    description: route.title,
  })),
});
export const handlePublicReadability = createAgentSurfaceHandler({
  manifest: publicReadabilityManifest,
  listMarkdownRoutes: () => routes,
  loadMarkdown: (path: string) => renderPublicRouteMarkdown(path),
});
