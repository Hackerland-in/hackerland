import { listNotifications } from '@/lib/data/queries';
import { connectDb, NotificationModel } from '@hackerland/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || undefined;

  try {
    const notifs = await listNotifications(userId);
    const unreadCount = notifs.filter((n) => !n.read).length;

    return Response.json({
      success: true,
      unreadCount,
      notifications: notifs,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to query notifications';
    return Response.json({ error: 'server_error', message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const { action, id } = body;

  if (action === 'mark_all_read') {
    if (process.env.MONGODB_URI) {
      try {
        await connectDb();
        await NotificationModel.updateMany({ read: false }, { $set: { read: true } });
      } catch (err: unknown) {
        console.warn('MongoDB error updating notifications:', err);
      }
    }
    return Response.json({ success: true, message: 'All notifications marked as read' });
  }

  if (action === 'mark_read' && typeof id === 'string') {
    if (process.env.MONGODB_URI) {
      try {
        await connectDb();
        await NotificationModel.findByIdAndUpdate(id, { $set: { read: true } });
      } catch (err: unknown) {
        console.warn('MongoDB error updating notification:', err);
      }
    }
    return Response.json({ success: true, message: `Notification ${id} marked as read` });
  }

  return Response.json({ error: 'invalid_action' }, { status: 400 });
}
