import { NextResponse } from 'next/server';

import { publicExperienceCatalog } from '~/server/experience-catalog';

import { searchPublicExperiences } from '@/lib/mcp-public';

export async function GET(request: Request) {
  return NextResponse.json(
    searchPublicExperiences(new URL(request.url).searchParams, await publicExperienceCatalog()),
    {
      headers: { 'Cache-Control': 'public, max-age=60, s-maxage=60' },
    }
  );
}
