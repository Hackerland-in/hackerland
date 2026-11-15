import { describe, expect, it } from 'vitest';
import { GET } from './route';

describe('GET /api/moderation/reports', () => {
  it('returns 200 with list of reports', async () => {
    const req = new Request('http://localhost:3000/api/moderation/reports');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.reports)).toBe(true);
    expect(json.reports.length).toBeGreaterThan(0);
  });

  it('filters reports by status', async () => {
    const req = new Request('http://localhost:3000/api/moderation/reports?status=pending');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    for (const report of json.reports) {
      expect(report.status).toBe('pending');
    }
  });

  it('filters reports by targetType', async () => {
    const req = new Request('http://localhost:3000/api/moderation/reports?targetType=post');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    for (const report of json.reports) {
      expect(report.targetType).toBe('post');
    }
  });
});
