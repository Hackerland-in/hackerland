import { describe, expect, it } from 'vitest';
import { GET } from './[...all]/route';

describe('/api/auth route', () => {
  it('returns 503 when auth is not configured and does not throw on module import', async () => {
    delete process.env.MONGODB_URI;
    delete process.env.BETTER_AUTH_SECRET;

    const request = new Request('http://localhost/api/auth/session');
    const response = await GET(request);

    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body).toEqual({ error: 'auth_not_configured' });
  });
});
