import { describe, expect, it } from 'vitest';
import { GET, POST } from './route';

describe('/api/posts', () => {
  it('returns 503 for POST when auth is not configured', async () => {
    const req = new Request('http://localhost:3000/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Open-source LoRaWAN Agritech Node',
        body: 'Deployed 5 capacitive moisture sensor nodes across a test farm in Punjab.',
        kind: 'showcase',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe('auth_not_configured');
  });

  it('returns 200 and list of posts on GET', async () => {
    const req = new Request('http://localhost:3000/api/posts');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.posts)).toBe(true);
    expect(json.posts.length).toBeGreaterThan(0);
  });

  it('filters posts by kind on GET /api/posts?kind=question', async () => {
    const req = new Request('http://localhost:3000/api/posts?kind=question');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    for (const post of json.posts) {
      expect(post.kind).toBe('question');
    }
  });

  it('supports pagination on GET with limit and offset', async () => {
    const req = new Request('http://localhost:3000/api/posts?limit=2&offset=1');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.posts.length).toBeLessThanOrEqual(2);
  });
});
