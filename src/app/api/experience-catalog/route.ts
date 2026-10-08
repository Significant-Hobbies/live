import { parseCatalogQuery } from '~/lib/catalog-seed';
import { searchExperienceCatalog } from '~/server/experience-catalog';

export async function GET(request: Request) {
  let query: ReturnType<typeof parseCatalogQuery>;
  try {
    query = parseCatalogQuery(new URL(request.url).searchParams);
  } catch {
    return Response.json({ error: 'Invalid catalog filters' }, { status: 400 });
  }
  try {
    return Response.json(await searchExperienceCatalog(query), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return Response.json({ error: 'Ideas could not be loaded. Try again.' }, { status: 503 });
  }
}
