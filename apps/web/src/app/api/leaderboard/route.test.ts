import { describe, expect, it } from 'vitest';
import { GET } from './route';

describe('/api/leaderboard', () => {
  it('returns 200 and ranked leaderboard list on GET', async () => {
    const req = new Request('http://localhost:3000/api/leaderboard');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.leaderboard)).toBe(true);
    expect(json.leaderboard.length).toBeGreaterThan(0);

    // Verify ordering by reputation descending
    for (let i = 0; i < json.leaderboard.length - 1; i++) {
      expect(json.leaderboard[i].reputation).toBeGreaterThanOrEqual(
        json.leaderboard[i + 1].reputation,
      );
      expect(json.leaderboard[i].rank).toBe(i + 1);
    }
  });

  it('filters leaderboard by track on GET /api/leaderboard?track=make', async () => {
    const req = new Request('http://localhost:3000/api/leaderboard?track=make');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    for (const entry of json.leaderboard) {
      expect(entry.tracks).toContain('make');
    }
  });

  it('supports limit query parameter', async () => {
    const req = new Request('http://localhost:3000/api/leaderboard?limit=3');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.leaderboard.length).toBeLessThanOrEqual(3);
  });
});
