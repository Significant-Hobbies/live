import { handlePublicReadability } from '~/lib/public-readability';
export const dynamic = 'force-dynamic';
const documents = new Set([
  '/llms.txt',
  '/llms-full.txt',
  '/ai.txt',
  '/api/ai',
  '/api/md/_catalog',
]);
export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get('path');
  if (!path || !documents.has(path)) return new Response('Not found', { status: 404 });
  return (
    (await handlePublicReadability(
      new Request(new URL(path, 'https://significanthobbies.com'), { method: request.method })
    )) ?? new Response('Not found', { status: 404 })
  );
}
export const HEAD = GET;
export const OPTIONS = GET;
