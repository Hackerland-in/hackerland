import { describe, expect, it } from 'vitest';
import { GET, POST } from './route';

describe('GET /api/notifications', () => {
  it('returns notification list and unread count', async () => {
    const req = new Request('http://localhost/api/notifications');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.notifications)).toBe(true);
    expect(typeof data.unreadCount).toBe('number');
  });
});

describe('POST /api/notifications', () => {
  it('rejects invalid json', async () => {
    const req = new Request('http://localhost/api/notifications', {
      method: 'POST',
      body: 'invalid-json',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('marks all as read', async () => {
    const req = new Request('http://localhost/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark_all_read' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });
});
