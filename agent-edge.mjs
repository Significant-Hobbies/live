/**
 * Portable agent-edge handler — copy or generate into each product.
 * Spec: fleet-ops/docs/agent-indexing-standard.md
 *
 * Usage in worker.mjs (before openNext.fetch):
 *   import { handleAgentEdge } from './agent-edge.mjs'
 *   const agent = handleAgentEdge(request)
 *   if (agent) return agent
 */

/** @type {{ name: string, url: string, llmsTxt: string, llmsFullTxt?: string, indexMd: string, catalog: object }} */
// biome-ignore format: generated payload from apply-agent-surfaces (JSON keys/quotes)
export const AGENT_SURFACE = {
  "name": "Significant Hobbies",
  "url": "https://significanthobbies.com",
  "llmsFullTxt": "# Significant Hobbies — full agent brief\n\nLife planner for private daily rituals and public living — hobbies, bucket lists, and side quests over time.\n\n## Index\n\n# Significant Hobbies\n\nLife planner: private daily rituals + public living (hobbies, bucket lists, side quests).\n\n## What it is\n\n- Hobby timelines and public exploration\n- Private rituals and progress tracking\n- Editorial content for agents at `/llms-full.txt`\n\n## Agent entrypoints\n\n- https://significanthobbies.com/llms.txt\n- https://significanthobbies.com/llms-full.txt\n- https://significanthobbies.com/api/ai\n- https://significanthobbies.com/index.md\n\nAuth-walled personal data is not agent-indexed.\n\n## Product links\n\n- Home: https://significanthobbies.com/ — Product landing\n- Explore: https://significanthobbies.com/explore — Public hobby timelines\n\n## Machine surfaces\n\n- https://significanthobbies.com/llms.txt\n- https://significanthobbies.com/llms-full.txt\n- https://significanthobbies.com/api/ai\n- https://significanthobbies.com/index.md\n- https://significanthobbies.com/sitemap.xml\n- https://significanthobbies.com/robots.txt\n\n## Contact / fleet\n\n- Fleet: https://sassmaker.com\n- Agent email for directory verification: sarthakagrawal@agentmail.to\n",
  "llmsTxt": "# Significant Hobbies\n\n> Life planner for private daily rituals and public living — hobbies, bucket lists, and side quests over time.\n\n## Product\n\n- [Home](https://significanthobbies.com/): Product landing\n- [Explore](https://significanthobbies.com/explore): Public hobby timelines\n\n## Machine surfaces\n\n- [Agent catalog](https://significanthobbies.com/api/ai): JSON inventory of public surfaces\n- [Homepage markdown](https://significanthobbies.com/index.md): Product brief without JS\n- [This index](https://significanthobbies.com/llms.txt)\n\n## Optional\n\n- [Foundry](https://sassmaker.com): Parent fleet showcase\n",
  "indexMd": "# Significant Hobbies\n\nLife planner: private daily rituals + public living (hobbies, bucket lists, side quests).\n\n## What it is\n\n- Hobby timelines and public exploration\n- Private rituals and progress tracking\n- Editorial content for agents at `/llms-full.txt`\n\n## Agent entrypoints\n\n- https://significanthobbies.com/llms.txt\n- https://significanthobbies.com/llms-full.txt\n- https://significanthobbies.com/api/ai\n- https://significanthobbies.com/index.md\n\nAuth-walled personal data is not agent-indexed.\n",
  "catalog": {
    "name": "Significant Hobbies",
    "version": "1",
    "url": "https://significanthobbies.com",
    "llms": "https://significanthobbies.com/llms.txt",
    "llmsFull": "https://significanthobbies.com/llms-full.txt",
    "sitemap": "https://significanthobbies.com/sitemap.xml",
    "robots": "https://significanthobbies.com/robots.txt",
    "markdown": {
      "suffix": ".md",
      "negotiation": true
    },
    "surfaces": [
      {
        "id": "home",
        "url": "https://significanthobbies.com/",
        "md": "https://significanthobbies.com/index.md",
        "kind": "static",
        "description": "Product home"
      },
      {
        "id": "explore",
        "url": "https://significanthobbies.com/explore",
        "md": "https://significanthobbies.com/explore.md",
        "kind": "static",
        "description": "Public hobby timelines"
      }
    ],
    "auth": {
      "public": true,
      "notes": "Auth-walled app routes are not agent-indexed unless listed here."
    }
  }
};

/**
 * @param {Request} request
 * @returns {Response | null}
 */
export function handleAgentEdge(request) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return null;
  const url = new URL(request.url);
  const path = url.pathname === '' ? '/' : url.pathname;

  if (path === '/llms.txt') {
    return text(AGENT_SURFACE.llmsTxt, 'text/plain; charset=utf-8');
  }
  if (path === '/llms-full.txt' && AGENT_SURFACE.llmsFullTxt) {
    return text(AGENT_SURFACE.llmsFullTxt, 'text/plain; charset=utf-8');
  }
  if (path === '/index.md') {
    return text(AGENT_SURFACE.indexMd, 'text/markdown; charset=utf-8');
  }
  if (path === '/api/ai') {
    // Re-bind origin so preview/custom domains stay correct
    const catalog = {
      ...AGENT_SURFACE.catalog,
      openapi: `${url.origin}/openapi.json`,
      url: url.origin,
      llms: `${url.origin}/llms.txt`,
      llmsFull: `${url.origin}/llms-full.txt`,
      sitemap: AGENT_SURFACE.catalog.sitemap
        ? String(AGENT_SURFACE.catalog.sitemap).replace(AGENT_SURFACE.url, url.origin)
        : `${url.origin}/sitemap.xml`,
      surfaces: (AGENT_SURFACE.catalog.surfaces || []).map((s) => ({
        ...s,
        url: s.url ? String(s.url).replace(AGENT_SURFACE.url, url.origin) : s.url,
        md: s.md ? String(s.md).replace(AGENT_SURFACE.url, url.origin) : s.md,
      })),
    };
    return json(catalog);
  }

  if (path === '/openapi.json') {
    return json(openApiSpec(url.origin));
  }

  // Homepage markdown negotiation
  if ((path === '/' || path === '') && wantsMarkdown(request)) {
    return text(AGENT_SURFACE.indexMd, 'text/markdown; charset=utf-8', {
      Link: '</index.md>; rel="alternate"; type="text/markdown"',
      Vary: 'Accept',
    });
  }

  return null;
}

function wantsMarkdown(request) {
  const accept = (request.headers.get('accept') || '').toLowerCase();
  if (!accept.includes('text/markdown')) return false;
  if (!accept.includes('text/html')) return true;
  return accept.indexOf('text/markdown') < accept.indexOf('text/html');
}

function text(body, type, extra = {}) {
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': type,
      'Cache-Control': 'public, max-age=300',
      ...extra,
    },
  });
}

function json(data) {
  return new Response(`${JSON.stringify(data, null, 2)}\n`, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}

/**
 * OpenAPI 3.1 description of the public, read-only agent surfaces.
 * Origin is rebound so preview/custom domains stay correct.
 *
 * @param {string} origin
 * @returns {object}
 */
function openApiSpec(origin) {
  return {
    openapi: '3.1.0',
    info: {
      title: 'Significant Hobbies — Agent API',
      version: '1',
      summary:
        'Read-only public agent surfaces for Significant Hobbies: hobby discovery, bucket lists, experiences, and side quests over time.',
      description:
        'All endpoints are unauthenticated and read-only. Authenticated daily practice and private user data are not agent-indexed. Public HTML routes support `Accept: text/markdown` content negotiation and a `.md` alternate.',
    },
    servers: [{ url: origin }],
    tags: [{ name: 'agent', description: 'Machine-readable agent surfaces' }],
    paths: {
      '/api/ai': {
        get: {
          tags: ['agent'],
          summary: 'Agent catalog',
          description:
            'JSON inventory of bounded public surfaces, the markdown negotiation contract, and the list of agent-readable routes. The canonical entry point for crawlers and agents.',
          operationId: 'getAgentCatalog',
          responses: {
            200: {
              description: 'Agent catalog',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Catalog' },
                },
              },
            },
          },
        },
      },
      '/llms.txt': {
        get: {
          tags: ['agent'],
          summary: 'llms.txt index',
          description:
            'Concise, human-and-agent-readable index of the site and its machine surfaces, following the llms.txt convention.',
          operationId: 'getLlmsTxt',
          responses: {
            200: {
              description: 'llms.txt index',
              content: { 'text/plain': { schema: { type: 'string' } } },
            },
          },
        },
      },
      '/llms-full.txt': {
        get: {
          tags: ['agent'],
          summary: 'Full agent brief',
          description:
            'Canonical editorial corpus concatenated into a single agent-readable document.',
          operationId: 'getLlmsFullTxt',
          responses: {
            200: {
              description: 'Full agent brief',
              content: { 'text/plain': { schema: { type: 'string' } } },
            },
          },
        },
      },
      '/sitemap.xml': {
        get: {
          tags: ['agent'],
          summary: 'Sitemap',
          description: 'XML sitemap of public, agent-readable routes.',
          operationId: 'getSitemap',
          responses: {
            200: {
              description: 'Sitemap XML',
              content: { 'application/xml': { schema: { type: 'string' } } },
            },
          },
        },
      },
      '/openapi.json': {
        get: {
          tags: ['agent'],
          summary: 'OpenAPI description',
          description: 'This document: a machine-readable description of the public agent API.',
          operationId: 'getOpenApi',
          responses: {
            200: {
              description: 'OpenAPI 3.1 document',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Catalog: {
          type: 'object',
          description: 'Bounded inventory of public agent surfaces.',
          properties: {
            name: { type: 'string' },
            version: { type: 'string' },
            url: { type: 'string', format: 'uri' },
            llms: { type: 'string', format: 'uri' },
            llmsFull: { type: 'string', format: 'uri' },
            sitemap: { type: 'string', format: 'uri' },
            robots: { type: 'string', format: 'uri' },
            openapi: { type: 'string', format: 'uri' },
            markdown: {
              type: 'object',
              properties: {
                suffix: { type: 'string', example: '.md' },
                negotiation: { type: 'boolean', example: true },
              },
            },
            surfaces: {
              type: 'array',
              items: { $ref: '#/components/schemas/Surface' },
            },
            auth: {
              type: 'object',
              properties: {
                public: { type: 'boolean' },
                notes: { type: 'string' },
              },
            },
          },
        },
        Surface: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            url: { type: 'string', format: 'uri' },
            md: { type: 'string', format: 'uri' },
            kind: { type: 'string', example: 'static' },
            description: { type: 'string' },
          },
        },
      },
    },
  };
}
