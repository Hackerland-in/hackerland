import { describe, expect, it } from 'vitest';
import { POST } from './route';

describe('/api/projects', () => {
  it('returns 503 when auth is not configured', async () => {
    const req = new Request('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Stratospheric Air Sensor',
        summary: 'High altitude glider measuring nitrous oxide plumes',
        tracks: ['make', 'research'],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe('auth_not_configured');
  });
});
