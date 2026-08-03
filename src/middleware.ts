import { type NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Root ownership is resolved in worker.mjs: anonymous requests receive the
  // Astro asset while authenticated requests reach the private Next root.
  void req;

  // Private top-level workspaces choose local or account storage themselves.
  // Owner-specific database record routes retain their server-side ownership
  // checks; the proxy must not prevent local-ready pages from rendering.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
