import { describe, expect, it } from 'vitest';
import { GET, POST } from './route';

describe('/api/me/profile', () => {
  it('returns 503 when auth is not configured', async () => {
    // In our test environment, MONGODB_URI and BETTER_AUTH_SECRET are unset
    const req = new Request('http://localhost:3000/api/me/profile');
    const resGet = await GET(req);
    expect(resGet.status).toBe(503);
    const jsonGet = await resGet.json();
    expect(jsonGet.error).toBe('auth_not_configured');

    const resPost = await POST(
      new Request('http://localhost:3000/api/me/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: 'test-user' }),
      }),
    );
    expect(resPost.status).toBe(503);
    const jsonPost = await resPost.json();
    expect(jsonPost.error).toBe('auth_not_configured');
  });
});
