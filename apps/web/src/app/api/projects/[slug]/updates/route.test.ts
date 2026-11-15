import { describe, expect, it } from 'vitest';
import { POST } from './route';

describe('/api/projects/[slug]/updates', () => {
  it('returns 503 when auth is not configured', async () => {
    const req = new Request('http://localhost:3000/api/projects/aeroglide/updates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Completed high-altitude wind tunnel tests',
        body: 'Wing spar deflection remained within 2% margin at 22 m/s test airflow.',
      }),
    });

    const res = await POST(req, { params: Promise.resolve({ slug: 'aeroglide' }) });
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe('auth_not_configured');
  });
});
