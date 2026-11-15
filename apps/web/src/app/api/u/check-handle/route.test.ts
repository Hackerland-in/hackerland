import { describe, expect, it } from 'vitest';
import { GET } from './route';

describe('GET /api/u/check-handle', () => {
  it('returns 400 when handle query parameter is missing or empty', async () => {
    const req1 = new Request('http://localhost:3000/api/u/check-handle');
    const res1 = await GET(req1);
    expect(res1.status).toBe(400);
    const json1 = await res1.json();
    expect(json1.available).toBe(false);

    const req2 = new Request('http://localhost:3000/api/u/check-handle?handle=   ');
    const res2 = await GET(req2);
    expect(res2.status).toBe(400);
  });

  it('rejects invalid handle formats', async () => {
    const invalidHandles = ['ab', 'a'.repeat(31), 'hello_world', '-leading', 'trailing-', 'with space'];
    for (const h of invalidHandles) {
      const req = new Request(`http://localhost:3000/api/u/check-handle?handle=${encodeURIComponent(h)}`);
      const res = await GET(req);
      const json = await res.json();
      expect(json.available).toBe(false);
      expect(json.error).toBeDefined();
    }
  });

  it('reports reserved fixture handles as unavailable', async () => {
    const req = new Request('http://localhost:3000/api/u/check-handle?handle=meera-iyer');
    const res = await GET(req);
    const json = await res.json();
    expect(json.available).toBe(false);
    expect(json.error).toBe('Handle is already taken');
  });

  it('reports a valid unused handle as available', async () => {
    const req = new Request('http://localhost:3000/api/u/check-handle?handle=unique-maker-42');
    const res = await GET(req);
    const json = await res.json();
    expect(json.available).toBe(true);
    expect(json.error).toBeUndefined();
  });
});
