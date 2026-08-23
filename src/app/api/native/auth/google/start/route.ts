import { auth } from '@/lib/auth';
import { isAllowedNativeCallback, NATIVE_AUTH_CALLBACK } from '@/lib/native-handoff';

function json(payload: unknown, status: number): Response {
  return Response.json(payload, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function GET(request: Request): Promise<Response> {
  const requestURL = new URL(request.url);
  const callback = requestURL.searchParams.get('callback') ?? NATIVE_AUTH_CALLBACK;
  if (!isAllowedNativeCallback(callback)) {
    return json({ code: 'INVALID_CALLBACK', message: 'The native callback is not allowed.' }, 400);
  }

  const completeURL = new URL('/api/native/auth/google/complete', requestURL);
  completeURL.searchParams.set('callback', callback);
  const { response: result, headers } = await auth.api.signInSocial({
    body: {
      provider: 'google',
      callbackURL: completeURL.toString(),
      errorCallbackURL: completeURL.toString(),
    },
    headers: request.headers,
    returnHeaders: true,
  });
  if (!result.url) {
    return json({ code: 'OAUTH_START_FAILED', message: 'Google sign-in could not start.' }, 502);
  }
  headers.set('Location', result.url);
  headers.set('Cache-Control', 'no-store');
  return new Response(null, { status: 302, headers });
}
