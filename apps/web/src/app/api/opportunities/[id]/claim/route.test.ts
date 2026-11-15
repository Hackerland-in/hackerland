import { describe, expect, it } from 'vitest';
import { POST } from './route';

describe('/api/opportunities/[id]/claim', () => {
  it('returns 503 when auth is not configured', async () => {
    const req = new Request('http://localhost:3000/api/opportunities/opp-bounty-kisan-1/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        note: 'I have 3 years of agronomy sensor data modeling experience.',
      }),
    });

    const res = await POST(req, {
      params: Promise.resolve({ id: 'opp-bounty-kisan-1' }),
    });
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe('auth_not_configured');
  });
});
