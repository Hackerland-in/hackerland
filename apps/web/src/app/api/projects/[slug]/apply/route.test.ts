import { describe, expect, it } from 'vitest';
import { POST } from './route';

describe('/api/projects/[slug]/apply', () => {
  it('returns 503 when auth is not configured', async () => {
    const req = new Request('http://localhost:3000/api/projects/aeroglide/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roleTitle: 'Flight Software & Telemetry Lead',
        note: 'Experienced in FreeRTOS and STM32 flight controller loops.',
      }),
    });

    const res = await POST(req, { params: Promise.resolve({ slug: 'aeroglide' }) });
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe('auth_not_configured');
  });
});
