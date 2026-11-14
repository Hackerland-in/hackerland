import { isAuthConfigured, getAuth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export async function GET(request: Request) {
  if (!isAuthConfigured()) {
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
