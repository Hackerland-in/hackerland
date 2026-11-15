import { describe, expect, it } from 'vitest';
import { POST } from './route';

describe('POST /api/reports', () => {
  it('rejects invalid JSON with 400', async () => {
    const req = new Request('http://localhost:3000/api/reports', {
      method: 'POST',
      body: 'invalid-json{',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('invalid_json');
  });

  it('rejects invalid targetType with 400', async () => {
    const req = new Request('http://localhost:3000/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetType: 'invalid_entity',
        targetId: 'xyz123',
        reason: 'spam',
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('invalid_target_type');
  });

  it('rejects missing targetId with 400', async () => {
    const req = new Request('http://localhost:3000/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetType: 'post',
        targetId: '   ',
        reason: 'spam',
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('invalid_target_id');
  });

  it('rejects invalid reason with 400', async () => {
    const req = new Request('http://localhost:3000/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetType: 'post',
        targetId: 'post_101',
        reason: 'dislike_the_font',
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('invalid_reason');
  });

  it('accepts valid report submission and returns 201 with created report', async () => {
    const req = new Request('http://localhost:3000/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetType: 'post',
        targetId: 'post_101',
        reason: 'spam',
        details: 'Automated spam comments on robotics post.',
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.report).toBeDefined();
    expect(json.report.targetType).toBe('post');
    expect(json.report.targetId).toBe('post_101');
    expect(json.report.reason).toBe('spam');
    expect(json.report.status).toBe('pending');
    expect(json.report.actionTaken).toBe('none');
  });
});
