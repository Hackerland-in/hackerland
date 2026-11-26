import type { WorkflowNamespace } from '@hackerland/db';
import {
  listWorkflowNamespace,
  persistPostToDbOrMemory,
  writeWorkflowState,
} from '@/lib/data/db-persistence';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nsParam = searchParams.get('namespace');
  const namespace: WorkflowNamespace =
    nsParam === 'club_membership' || nsParam === 'young_innovator'
      ? nsParam
      : 'booking';

  const records = await listWorkflowNamespace<Record<string, unknown>>(namespace);
  return Response.json({
    success: true,
    namespace,
    records,
  });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const kind = typeof body.kind === 'string' ? body.kind : '';
  const actorHandle =
    typeof body.actorHandle === 'string' && body.actorHandle.trim()
      ? body.actorHandle.trim().toLowerCase()
      : 'rohan_k';
  const actorName =
    typeof body.actorName === 'string' && body.actorName.trim()
      ? body.actorName.trim()
      : 'Rohan Kulkarni';

  if (kind === 'testbed_booking') {
    const testbedSlug = typeof body.testbedSlug === 'string' ? body.testbedSlug.trim() : '';
    const testbedTitle =
      typeof body.testbedTitle === 'string' ? body.testbedTitle.trim() : testbedSlug;
    const slotLabel = typeof body.slotLabel === 'string' ? body.slotLabel.trim() : '';
    const dutWeightGrams = Number(body.dutWeightGrams) || 0;
    const railVoltage = Number(body.railVoltage) || 0;
    const notes = typeof body.notes === 'string' ? body.notes.trim() : '';

    if (!testbedSlug || !slotLabel) {
      return Response.json({ error: 'slot_and_testbed_required' }, { status: 400 });
    }

    const bookingId = `tb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const record = {
      id: bookingId,
      kind,
      testbedSlug,
      testbedTitle,
      slotLabel,
      dutWeightGrams,
      railVoltage,
      notes,
      bookedByName: actorName,
      bookedByHandle: actorHandle,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    const storage = await writeWorkflowState('booking', bookingId, record, actorHandle);
    return Response.json({ success: true, booking: record, storage }, { status: 201 });
  }

  if (kind === 'club_equipment_booking') {
    const clubSlug = typeof body.clubSlug === 'string' ? body.clubSlug.trim() : '';
    const equipmentId = typeof body.equipmentId === 'string' ? body.equipmentId.trim() : '';
    const equipmentName =
      typeof body.equipmentName === 'string' ? body.equipmentName.trim() : equipmentId;
    const slotWindow = typeof body.slotWindow === 'string' ? body.slotWindow.trim() : '';

    if (!clubSlug || !equipmentId) {
      return Response.json({ error: 'club_and_equipment_required' }, { status: 400 });
    }

    const bookingId = `eq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const record = {
      id: bookingId,
      kind,
      clubSlug,
      equipmentId,
      equipmentName,
      slotWindow: slotWindow || 'Tomorrow 14:00–16:00 IST',
      bookedByName: actorName,
      bookedByHandle: actorHandle,
      status: 'reserved',
      createdAt: new Date().toISOString(),
    };

    const storage = await writeWorkflowState('booking', bookingId, record, actorHandle);
    return Response.json({ success: true, booking: record, storage }, { status: 201 });
  }

  if (kind === 'club_membership') {
    const clubSlug = typeof body.clubSlug === 'string' ? body.clubSlug.trim() : '';
    const clubName = typeof body.clubName === 'string' ? body.clubName.trim() : clubSlug;
    if (!clubSlug) {
      return Response.json({ error: 'club_slug_required' }, { status: 400 });
    }
    const key = `${clubSlug}:${actorHandle}`;
    const record = {
      id: key,
      clubSlug,
      clubName,
      memberName: actorName,
      memberHandle: actorHandle,
      joined: body.joined !== false,
      updatedAt: new Date().toISOString(),
    };
    const storage = await writeWorkflowState('club_membership', key, record, actorHandle);
    return Response.json({ success: true, membership: record, storage }, { status: 201 });
  }

  if (kind === 'guardian_consent' || kind === 'young_innovator_join') {
    const key = `yi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const record = {
      id: key,
      kind,
      actorName,
      actorHandle,
      details: body.details && typeof body.details === 'object' ? body.details : {},
      createdAt: new Date().toISOString(),
    };
    const storage = await writeWorkflowState('young_innovator', key, record, actorHandle);

    if (body.publishToFeed === true && typeof body.summary === 'string' && body.summary.trim()) {
      await persistPostToDbOrMemory({
        kind: 'update',
        title: typeof body.title === 'string' ? body.title : `${actorName} joined Student Tinkerers`,
        body: body.summary.trim(),
        tags: ['young-innovators', 'school-tinkerers'],
        author: {
          handle: actorHandle,
          name: actorName,
          headline: 'Student Hardware Builder',
          badges: [{ label: 'ATL Maker', tone: 'make' }],
        },
      });
    }

    return Response.json({ success: true, record, storage }, { status: 201 });
  }

  return Response.json({ error: 'unknown_booking_kind' }, { status: 400 });
}
