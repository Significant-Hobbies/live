import type { Metadata } from 'next';
import { markdownPathFor } from './agent-surfaces/http.mjs';
import home from '../../landing-astro/src/content/live.json';

export function withPublicMetadata(metadata: Metadata): Metadata {
  const canonical = metadata.alternates?.canonical;
  const url =
    typeof canonical === 'string'
      ? new URL(canonical, home.url)
      : canonical instanceof URL
        ? canonical
        : null;
  return {
    ...metadata,
    other: { ...metadata.other, 'ai-summary': metadata.description || home.page.description },
    ...(url
      ? {
          alternates: {
            ...metadata.alternates,
            types: {
              ...metadata.alternates?.types,
              'text/markdown': new URL(markdownPathFor(url.pathname), home.url).href,
            },
          },
        }
      : {}),
  };
}
