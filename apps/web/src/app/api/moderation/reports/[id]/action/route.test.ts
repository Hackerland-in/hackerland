import { describe, expect, it } from 'vitest';
import { POST } from './route';

describe('POST /api/moderation/reports/[id]/action', () => {
  it('returns 400 for malformed json', async () => {
    const req = new Request('http://localhost/api/moderation/reports/rep_001/action', {
      method: 'POST',
      body: 'invalid-json',
    });
    const params = Promise.resolve({ id: 'rep_001' });
    const res = await POST(req, { params });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('invalid_json');
  });

  it('updates report action and status successfully', async () => {
    const req = new Request('http://localhost/api/moderation/reports/rep_001/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'hidden',
        status: 'actioned',
      }),
    });
    const params = Promise.resolve({ id: 'rep_001' });
    const res = await POST(req, { params });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.report.id).toBe('rep_001');
    expect(data.report.status).toBe('actioned');
    expect(data.report.actionTaken).toBe('hidden');
    expect(data.report.resolvedBy).toBe('mod_admin');
  });
});
