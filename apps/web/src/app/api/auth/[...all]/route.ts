import { isAuthConfigured, getAuth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export async function GET(request: Request) {
  if (!isAuthConfigured()) {
    // Without auth nobody can be signed in. Answer session checks the way
    // Better Auth does for a signed-out visitor, so every page's header does
    // not log a 503; all other endpoints still report the missing config.
    if (new URL(request.url).pathname.endsWith('/get-session')) {
      return Response.json(null);
    }
    return Response.json({ error: 'auth_not_configured' }, { status: 503 });
  }
  return toNextJsHandler(getAuth()!).GET(request);
}

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return Response.json({ error: 'auth_not_configured' }, { status: 503 });
  }
  return toNextJsHandler(getAuth()!).POST(request);
}
