import { describe, expect, it } from 'vitest';
import { POST } from './route';

describe('/api/posts/[id]/react', () => {
  it('returns 503 when auth is not configured', async () => {
    const req = new Request('http://localhost:3000/api/posts/post-1/react', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req, { params: Promise.resolve({ id: 'post-1' }) });
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe('auth_not_configured');
  });
});
