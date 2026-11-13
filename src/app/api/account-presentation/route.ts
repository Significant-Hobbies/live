import { getServerAuthSession } from '~/server/auth';

export async function GET() {
  const session = await getServerAuthSession();
  return Response.json(
    {
      user: session?.user
        ? {
            id: session.user.id,
            name: session.user.name ?? null,
            image: session.user.image ?? null,
            username: session.user.username,
          }
        : null,
    },
    {
      status: session?.user ? 200 : 401,
      headers: { 'Cache-Control': 'private, no-store' },
    }
  );
}
