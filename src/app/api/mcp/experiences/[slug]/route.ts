import { NextResponse } from 'next/server';

import { publicExperienceCatalog } from '~/server/experience-catalog';

import { getPublicExperience } from '@/lib/mcp-public';

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const item = getPublicExperience(slug, await publicExperienceCatalog());
  return item
    ? NextResponse.json(
        { item },
        { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=60' } }
      )
    : NextResponse.json(
        { code: 'NOT_FOUND', message: 'Experience not found.' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
}
