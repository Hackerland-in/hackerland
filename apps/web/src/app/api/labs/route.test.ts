import { describe, expect, it } from 'vitest';
import { GET, POST } from './route';

describe('/api/labs', () => {
  it('returns 503 for POST when auth is not configured', async () => {
    const req = new Request('http://localhost:3000/api/labs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Government Model School ATL',
        type: 'atl',
        institution: 'Govt Model Senior Secondary School',
        location: {
          city: 'Chandigarh',
          state: 'Chandigarh',
          pincode: '160019',
        },
        tools: ['3D Printers', 'Oscilloscopes', 'SMT Soldering'],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe('auth_not_configured');
  });

  it('returns 200 and list of lab nodes on GET', async () => {
    const req = new Request('http://localhost:3000/api/labs');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.labs)).toBe(true);
    expect(json.labs.length).toBeGreaterThan(0);
  });

  it('filters lab nodes by type on GET /api/labs?type=atl', async () => {
    const req = new Request('http://localhost:3000/api/labs?type=atl');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    for (const lab of json.labs) {
      expect(lab.type).toBe('atl');
    }
  });

  it('filters lab nodes by tool on GET /api/labs?tool=Oscilloscopes', async () => {
    const req = new Request('http://localhost:3000/api/labs?tool=Oscilloscopes');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    for (const lab of json.labs) {
      expect(
        lab.tools.some((t: string) => t.toLowerCase().includes('oscilloscope')),
      ).toBe(true);
    }
  });

  it('supports pagination on GET with limit and offset', async () => {
    const req = new Request('http://localhost:3000/api/labs?limit=2&offset=1');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.labs.length).toBeLessThanOrEqual(2);
  });
});
