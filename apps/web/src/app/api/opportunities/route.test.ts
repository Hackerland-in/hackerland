import { describe, expect, it } from 'vitest';
import { GET, POST } from './route';

describe('/api/opportunities', () => {
  it('returns 503 for POST when auth is not configured', async () => {
    const req = new Request('http://localhost:3000/api/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind: 'bounty',
        title: 'Calibrate UAV Pitot Tube Sensor Array',
        summary: 'Bench test dynamic pressure sensor calibration algorithms in laminar flow tunnel.',
        sponsor: { name: 'AeroGlide Avionics' },
        reward: { amount: 25000, currency: 'INR' },
        tracks: ['make', 'code'],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe('auth_not_configured');
  });

  it('returns 200 and list of opportunities on GET', async () => {
    const req = new Request('http://localhost:3000/api/opportunities');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.opportunities)).toBe(true);
    expect(json.opportunities.length).toBeGreaterThan(0);
  });

  it('filters opportunities by kind on GET /api/opportunities?kind=bounty', async () => {
    const req = new Request('http://localhost:3000/api/opportunities?kind=bounty');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    for (const opp of json.opportunities) {
      expect(opp.kind).toBe('bounty');
    }
  });

  it('supports pagination on GET with limit and offset', async () => {
    const req = new Request('http://localhost:3000/api/opportunities?limit=2&offset=1');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.opportunities.length).toBeLessThanOrEqual(2);
  });
});
