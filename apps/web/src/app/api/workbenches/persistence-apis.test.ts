import { describe, expect, it } from 'vitest';
import { POST as socialPost, GET as socialGet } from '../social/route';
import { GET as wbGet, POST as wbPost, DELETE as wbDelete } from './route';
import { GET as bookingsGet, POST as bookingsPost } from '../bookings/route';
import { GET as ideasGet, POST as ideasPost } from '../ideas/route';

describe('DB-backed persistence API routes', () => {
  it('saves, lists, and deletes a PCB workspace in /api/workbenches and mirrors feed post when requested', async () => {
    const createRes = await wbPost(
      new Request('http://localhost/api/workbenches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'pcb',
          title: 'FOC ESC Rev 3',
          slugOrRoute: '/manufacturing/pcb',
          ownerHandle: 'siddharth_r',
          ownerName: 'Siddharth Rao',
          payload: { boardW: 60, boardH: 40, partsCount: 12 },
          publishToFeed: true,
        }),
      }),
    );
    expect(createRes.status).toBe(201);
    const createdJson = (await createRes.json()) as {
      success: boolean;
      workspace: { workspaceId: string; ownerHandle: string; title: string };
      sharedPostId?: string;
    };
    expect(createdJson.success).toBe(true);
    expect(createdJson.workspace.title).toBe('FOC ESC Rev 3');
    expect(createdJson.workspace.ownerHandle).toBe('siddharth_r');
    expect(createdJson.sharedPostId).toBeTruthy();

    const listRes = await wbGet(new Request('http://localhost/api/workbenches?kind=pcb'));
    const listJson = (await listRes.json()) as {
      workspaces: Array<{ workspaceId: string }>;
    };
    expect(listJson.workspaces.some((w) => w.workspaceId === createdJson.workspace.workspaceId)).toBe(
      true,
    );

    const delRes = await wbDelete(
      new Request(
        `http://localhost/api/workbenches?workspaceId=${encodeURIComponent(createdJson.workspace.workspaceId)}`,
        { method: 'DELETE' },
      ),
    );
    expect(delRes.status).toBe(200);
  });

  it('persists replies, published posts, and social graph via /api/social', async () => {
    const postRes = await socialPost(
      new Request('http://localhost/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish_post',
          kind: 'showcase',
          title: 'Trimmed MOSFET thermal dissipation on rev2 ESC',
          body: 'Switched to 2oz copper pour + stitched 14 thermal vias under the H-bridge.',
          authorHandle: 'ananya_m',
          authorName: 'Ananya Menon',
        }),
      }),
    );
    expect(postRes.status).toBe(201);
    const created = (await postRes.json()) as { post: { id: string } };

    const replyRes = await socialPost(
      new Request('http://localhost/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reply',
          postId: created.post.id,
          authorName: 'Vikram Nair',
          authorHandle: 'vikram_n',
          body: 'Nice drop in case temp! What stitch pitch did you end up using?',
        }),
      }),
    );
    expect(replyRes.status).toBe(201);

    const getRes = await socialGet(new Request('http://localhost/api/social?handle=ananya_m'));
    const getJson = (await getRes.json()) as {
      repliesByPostId: Record<string, Array<{ authorName: string }>>;
    };
    expect(getJson.repliesByPostId[created.post.id]?.[0]?.authorName).toBe('Vikram Nair');
  });

  it('persists testbed/club bookings and ideas/claims/IP disclosures', async () => {
    const tbRes = await bookingsPost(
      new Request('http://localhost/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'testbed_booking',
          testbedSlug: 'kochi-marine-tank',
          testbedTitle: 'Kochi ROV Wave Tank',
          slotLabel: 'Thu 10:00 IST',
          dutWeightGrams: 1450,
          railVoltage: 24,
          actorHandle: 'devika_s',
          actorName: 'Devika Sen',
        }),
      }),
    );
    expect(tbRes.status).toBe(201);

    const bList = await bookingsGet(new Request('http://localhost/api/bookings?namespace=booking'));
    const bJson = (await bList.json()) as {
      records: Array<{ payload: { testbedSlug?: string } }>;
    };
    expect(bJson.records.some((r) => r.payload.testbedSlug === 'kochi-marine-tank')).toBe(true);

    const claimRes = await ideasPost(
      new Request('http://localhost/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'claim_problem',
          problemId: 'prob_1',
          problemSlug: 'affordable-non-invasive-hemoglobin-screening',
          problemTitle: 'Non-Invasive Hemoglobin Screening',
          claimantHandle: 'rohan_k',
          claimantName: 'Rohan Kulkarni',
        }),
      }),
    );
    expect(claimRes.status).toBe(201);

    const iGet = await ideasGet(new Request('http://localhost/api/ideas?scope=problems'));
    const iJson = (await iGet.json()) as {
      problemClaims: Array<{ problemId: string }>;
    };
    expect(iJson.problemClaims.some((c) => c.problemId === 'prob_1')).toBe(true);
  });
});
