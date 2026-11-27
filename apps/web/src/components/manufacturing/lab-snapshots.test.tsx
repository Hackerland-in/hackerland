import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';
import { VentureProvider } from '@/components/social/venture-context';
import { HdlSimulator } from './hdl/hdl-simulator';
import { OpenEdaStudio } from './eda/open-eda-studio';
import { CircuitoBuilder } from './circuito/circuito-builder';
import { IssSimulator } from './iss/iss-simulator';
import { FalstadSimulator } from './falstad/falstad-simulator';
import { ActualHardwareSimulator } from './hardware-simulator/actual-hardware-simulator';
import { HardwareBenchStudio } from './bench/hardware-bench-studio';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function stubLabFetch(capturePost: (body: Record<string, unknown>) => void) {
  return vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
    if (init?.method === 'POST' && typeof init.body === 'string') {
      const parsed = JSON.parse(init.body) as Record<string, unknown>;
      if (String(url).includes('/api/workbenches')) {
        capturePost(parsed);
        return new Response(
          JSON.stringify({
            storage: 'memory',
            workspace: {
              workspaceId: `ws_${Date.now()}`,
              kind: parsed.kind ?? 'eda',
              slugOrRoute: parsed.slugOrRoute ?? '/manufacturing',
              title: parsed.title ?? 'Snapshot',
              ownerHandle: 'rohan_k',
              ownerName: 'Rohan Kulkarni',
              tags: parsed.tags ?? [],
              payload: parsed.payload ?? {},
              updatedAt: new Date().toISOString(),
            },
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } },
        );
      }
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ workspaces: [], storage: 'memory' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as unknown as typeof fetch;
}

describe('Manufacturing Labs DB Snapshot Persistence Wiring', () => {
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

  async function triggerQuickSave() {
    const drawerOpen = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Saved ('),
    );
    expect(drawerOpen).toBeTruthy();
    await act(async () => {
      drawerOpen?.click();
    });

    const saveDbBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Save Snapshot'),
    );
    expect(saveDbBtn).toBeTruthy();
    await act(async () => {
      saveDbBtn?.click();
    });
  }

  it('captures live Verilog snapshot from HdlSimulator via FullScreenLabShell', async () => {
    let savedBody: Record<string, unknown> | null = null;
    globalThis.fetch = stubLabFetch((body) => {
      savedBody = body;
    });

    await act(async () => {
      root.render(
        <VentureProvider>
          <FullScreenLabShell
            labKind="eda"
            title="HDL Studio"
            category="RTL"
            currentRoute="/manufacturing/hdl"
          >
            <HdlSimulator />
          </FullScreenLabShell>
        </VentureProvider>,
      );
    });

    await triggerQuickSave();
    expect(savedBody).not.toBeNull();
    expect(String((savedBody as unknown as Record<string, unknown>).title)).toContain('HDL RTL:');
    const payload = (savedBody as unknown as Record<string, Record<string, unknown>>).payload!;
    expect(payload.selectedPresetId).toBe('counter-4bit');
    expect(payload.activeTab).toBe('all');
  });

  it('captures silicon target and stage from OpenEdaStudio', async () => {
    let savedBody: Record<string, unknown> | null = null;
    globalThis.fetch = stubLabFetch((body) => {
      savedBody = body;
    });

    await act(async () => {
      root.render(
        <VentureProvider>
          <FullScreenLabShell
            labKind="eda"
            title="EDA Studio"
            category="ASIC"
            currentRoute="/manufacturing/eda"
          >
            <OpenEdaStudio />
          </FullScreenLabShell>
        </VentureProvider>,
      );
    });

    await triggerQuickSave();
    expect(savedBody).not.toBeNull();
    expect(String((savedBody as unknown as Record<string, unknown>).title)).toContain('EDA Silicon:');
    const payload = (savedBody as unknown as Record<string, Record<string, unknown>>).payload!;
    expect(payload.selectedPresetId).toBe('pico-rv32');
    expect(payload.activeStage).toBe('synthesis');
  });

  it('captures MCU & component array from CircuitoBuilder and ISS program state from IssSimulator', async () => {
    let circuitoBody: Record<string, unknown> | null = null;
    globalThis.fetch = stubLabFetch((body) => {
      circuitoBody = body;
    });

    await act(async () => {
      root.render(
        <VentureProvider>
          <FullScreenLabShell
            labKind="prototype"
            title="Circuito Studio"
            category="Wiring"
            currentRoute="/manufacturing/circuito"
          >
            <CircuitoBuilder />
          </FullScreenLabShell>
        </VentureProvider>,
      );
    });

    await triggerQuickSave();
    expect(String((circuitoBody as unknown as Record<string, unknown>).title)).toContain('Circuito:');
    const cPayload = (circuitoBody as unknown as Record<string, Record<string, unknown>>).payload!;
    expect(cPayload.selectedControllerId).toBe('esp32-s3');
    expect(Array.isArray(cPayload.selectedComponentIds)).toBe(true);

    let issBody: Record<string, unknown> | null = null;
    globalThis.fetch = stubLabFetch((body) => {
      issBody = body;
    });

    await act(async () => {
      root.render(
        <VentureProvider>
          <FullScreenLabShell
            labKind="eda"
            title="RISC-V ISS"
            category="CPU"
            currentRoute="/manufacturing/iss"
          >
            <IssSimulator />
          </FullScreenLabShell>
        </VentureProvider>,
      );
    });

    await triggerQuickSave();
    expect(String((issBody as unknown as Record<string, unknown>).title)).toContain('RISC-V ISS:');
    const issPayload = (issBody as unknown as Record<string, Record<string, unknown>>).payload!;
    expect(issPayload.selectedPresetId).toBe('fibonacci');
  });

  it('captures SPICE, Falstad netlist, and HardwareBench state into DB snapshots', async () => {
    let falstadBody: Record<string, unknown> | null = null;
    globalThis.fetch = stubLabFetch((body) => {
      falstadBody = body;
    });

    await act(async () => {
      root.render(
        <VentureProvider>
          <FullScreenLabShell
            labKind="spice"
            title="Falstad Sim"
            category="SPICE"
            currentRoute="/manufacturing/falstad"
          >
            <FalstadSimulator />
          </FullScreenLabShell>
        </VentureProvider>,
      );
    });

    await triggerQuickSave();
    expect(String((falstadBody as unknown as Record<string, unknown>).title)).toContain('Falstad SPICE:');
    const fPayload = (falstadBody as unknown as Record<string, Record<string, unknown>>).payload!;
    expect(typeof fPayload.netlistText).toBe('string');

    let spiceBody: Record<string, unknown> | null = null;
    globalThis.fetch = stubLabFetch((body) => {
      spiceBody = body;
    });

    await act(async () => {
      root.render(
        <VentureProvider>
          <FullScreenLabShell
            labKind="spice"
            title="Actual SPICE"
            category="SPICE"
            currentRoute="/manufacturing/spice"
          >
            <ActualHardwareSimulator />
          </FullScreenLabShell>
        </VentureProvider>,
      );
    });

    await triggerQuickSave();
    expect(String((spiceBody as unknown as Record<string, unknown>).title)).toContain('SPICE:');

    let benchBody: Record<string, unknown> | null = null;
    globalThis.fetch = stubLabFetch((body) => {
      benchBody = body;
    });

    await act(async () => {
      root.render(
        <VentureProvider>
          <FullScreenLabShell
            labKind="prototype"
            title="Hardware Bench"
            category="MCU"
            currentRoute="/manufacturing/bench"
          >
            <HardwareBenchStudio />
          </FullScreenLabShell>
        </VentureProvider>,
      );
    });

    await triggerQuickSave();
    expect(String((benchBody as unknown as Record<string, unknown>).title)).toContain('MCU Bench:');
  });
});
