import React, { act, useEffect, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FullScreenLabShell, useLabShell } from './full-screen-lab-shell';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function MockLabChild() {
  const labShell = useLabShell();
  const [gain, setGain] = useState(12);

  useEffect(() => {
    if (!labShell) return;
    labShell.registerSnapshotHandlers({
      getSnapshot: () => ({
        title: `Test Bench Gain=${gain}`,
        summary: `Configured gain ${gain}`,
        tags: ['pcb', 'test'],
        payload: { gain },
      }),
      onLoad: (ws) => {
        if (typeof ws.payload?.gain === 'number') {
          setGain(ws.payload.gain);
        }
      },
    });
  }, [labShell, gain]);

  return (
    <div data-testid="mock-child">
      <span data-testid="gain-value">Gain: {gain}</span>
      <button type="button" onClick={() => setGain(42)}>
        Set Gain 42
      </button>
    </div>
  );
}

describe('FullScreenLabShell & DB Snapshot Drawer', () => {
  let container: HTMLDivElement;
  let root: Root;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    window.localStorage.clear();
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    globalThis.fetch = originalFetch;
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('toggles Full Screen mode and All Labs switcher', async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ workspaces: [], storage: 'memory' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ) as unknown as typeof fetch;

    await act(async () => {
      root.render(
        <FullScreenLabShell
          labKind="pcb"
          title="A-Z PCB & Circuit Studio"
          category="PCB Lab"
          currentRoute="/manufacturing/pcb"
          edgeToEdge
        >
          <MockLabChild />
        </FullScreenLabShell>,
      );
    });

    expect(container.textContent).toContain('A-Z PCB & Circuit Studio');
    expect(container.textContent).toContain('Gain: 12');

    // Open All Labs switcher
    const allLabsBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('All Labs'),
    );
    expect(allLabsBtn).toBeTruthy();

    await act(async () => {
      allLabsBtn?.click();
    });
    expect(container.textContent).toContain('Hardware & Simulation Studios');
    expect(container.textContent).toContain('Digital Twin Telemetry');

    // Toggle Full Screen
    const fsBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.getAttribute('aria-label') === 'Enter Full Screen',
    );
    expect(fsBtn).toBeTruthy();

    await act(async () => {
      fsBtn?.click();
    });

    const exitBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.getAttribute('aria-label') === 'Exit Full Screen',
    );
    expect(exitBtn).toBeTruthy();
    expect(container.innerHTML).toContain('fixed inset-0 z-50');
  });

  it('saves snapshots with child payload and loads saved workspace back into child state', async () => {
    const savedRecord = {
      workspaceId: 'ws-loaded-1',
      kind: 'pcb',
      slugOrRoute: '/manufacturing/pcb',
      title: 'Loaded Esc Layout',
      summary: 'Loaded from bench',
      ownerHandle: 'rohan_k',
      ownerName: 'Rohan Kulkarni',
      tags: ['pcb'],
      payload: { gain: 99 },
      updatedAt: '2026-11-26T12:00:00.000Z',
    };

    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const method = init?.method ?? 'GET';
      if (method === 'POST') {
        const body = JSON.parse(String(init?.body ?? '{}'));
        return new Response(
          JSON.stringify({
            storage: 'memory',
            sharedPostId: body.publishToFeed ? 'post-shared-1' : undefined,
            workspace: {
              ...savedRecord,
              workspaceId: 'ws-new-1',
              title: body.title,
              payload: body.payload,
            },
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } },
        );
      }
      return new Response(JSON.stringify({ workspaces: [savedRecord], storage: 'memory' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await act(async () => {
      root.render(
        <FullScreenLabShell
          labKind="pcb"
          title="A-Z PCB & Circuit Studio"
          currentRoute="/manufacturing/pcb"
        >
          <MockLabChild />
        </FullScreenLabShell>,
      );
    });

    // Update child state and Share to Feed
    const setGainBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Set Gain 42'),
    );
    await act(async () => {
      setGainBtn?.click();
    });
    expect(container.textContent).toContain('Gain: 42');

    const shareBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Share to Feed'),
    );
    await act(async () => {
      shareBtn?.click();
    });

    const postCall = fetchMock.mock.calls.find((c) => c[1]?.method === 'POST');
    expect(postCall).toBeTruthy();
    const sentPayload = JSON.parse(String(postCall![1]?.body));
    expect(sentPayload.kind).toBe('pcb');
    expect(sentPayload.payload).toEqual({ gain: 42 });
    expect(sentPayload.publishToFeed).toBe(true);
    expect(container.textContent).toContain('Saved & published snapshot to community feed!');

    // Open Saved drawer and load initial server snapshot (gain: 99)
    const savedBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Saved ('),
    );
    await act(async () => {
      savedBtn?.click();
    });

    const loadButtons = Array.from(container.querySelectorAll('button')).filter((b) =>
      b.textContent?.includes('Load into Workspace'),
    );
    expect(loadButtons.length).toBeGreaterThanOrEqual(1);
    const loadLoadedBtn = loadButtons[loadButtons.length - 1]!;
    await act(async () => {
      loadLoadedBtn.click();
    });

    expect(container.textContent).toContain('Gain: 99');
  });
});
