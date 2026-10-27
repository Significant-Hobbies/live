import { markdownResponse } from '~/lib/agent-surfaces/http.mjs';
import { type NextRequest, NextResponse } from 'next/server';

import { renderPublicRouteMarkdown } from '~/lib/public-route-markdown';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');
  if (!path?.startsWith('/')) {
    return NextResponse.json({ error: 'A public path is required.' }, { status: 400 });
  }

  const markdown = await renderPublicRouteMarkdown(path);
  if (!markdown) {
    return new NextResponse('# Not found\n', {
      status: 404,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    });
  }

  return markdownResponse(markdown, request, {
    // This is the internal source API. Only the edge's reviewed static-document
    // boundary may cache a response; normalized aliases must not cache profiles.
    'Cache-Control': 'private, no-store',
  });
}
