import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { problemSchema } from '@hackerland/core';
import { ALL_PEOPLE, ALL_PROFILES } from '@/lib/data/fixtures/people';
import { ALL_POSTS } from '@/lib/data/fixtures/posts';
import { ALL_ROADMAPS } from '@/lib/data/fixtures/roadmaps';
import { UNSOLVED_PROBLEMS_CATALOG } from '@/lib/data/problems-data';
import { FullScreenLabShell, useLabShell } from '@/components/labs/full-screen-lab-shell';
import { VentureProvider, useVenture } from './venture-context';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Pan-India People, Posts, Problems & Cross-Sector Roadmaps', () => {
  it('includes 12 pan-India builders across regional cities and non-manufacturing tracks', () => {
    expect(ALL_PEOPLE).toHaveLength(12);
    expect(ALL_PROFILES).toHaveLength(12);

    const locations = ALL_PROFILES.map((p) => p.location).join(' | ');
    expect(locations).toContain('Rajkot');
    expect(locations).toContain('Guwahati');
    expect(locations).toContain('Tiruppur');
    expect(locations).toContain('Srinagar');
    expect(locations).toContain('Bhubaneswar');
    expect(locations).toContain('Patna');
  });

  it('keeps ALL_POSTS sorted descending with POST_UPDATE_AEROGLIDE first', () => {
    expect(ALL_POSTS.length).toBeGreaterThanOrEqual(9);
    expect(ALL_POSTS[0]?.id).toBe('post-aeroglide-update-1');

    for (let i = 0; i < ALL_POSTS.length - 1; i++) {
      const current = new Date(ALL_POSTS[i]!.createdAt).getTime();
      const next = new Date(ALL_POSTS[i + 1]!.createdAt).getTime();
      expect(current).toBeGreaterThanOrEqual(next);
    }
  });

  it('validates all pan-India problems including textiles, DPI software & regional infrastructure', () => {
    expect(UNSOLVED_PROBLEMS_CATALOG.length).toBeGreaterThanOrEqual(9);
    for (const prob of UNSOLVED_PROBLEMS_CATALOG) {
      expect(() => problemSchema.parse(prob)).not.toThrow();
    }
    const slugs = UNSOLVED_PROBLEMS_CATALOG.map((p) => p.slug);
    expect(slugs).toContain('inline-dye-bath-zld-sensor-textiles');
    expect(slugs).toContain('vernacular-voice-ondc-export-catalog-dpi');
    expect(slugs).toContain('northeast-flash-flood-lora-bamboo-buoy');
  });

  it('includes cross-sector open roadmaps for export, ONDC/Bhashini DPI, agri & textiles', () => {
    const slugs = ALL_ROADMAPS.map((r) => r.slug);
    expect(slugs).toContain('export-compliance-and-global-trade');
    expect(slugs).toContain('india-dpi-ondc-bhashini-ai');
    expect(slugs).toContain('agri-coldchain-food-processing');
    expect(slugs).toContain('technical-textiles-gi-crafts-export');
  });
});

function VentureLinkedLabProbe() {
  const labShell = useLabShell();
  const { activeVenture } = useVenture();

  return (
    <div>
      <span data-testid="linked-pcb">{activeVenture?.pcbWorkspaceId ?? 'none'}</span>
      <span data-testid="venture-stage">{activeVenture?.currentStage ?? 0}</span>
      <button
        type="button"
        onClick={() =>
          void labShell?.saveWorkspace({
            title: 'Tiruppur Dye Sensor Rev B',
            payload: { layers: 4 },
          })
        }
      >
        Trigger Save
      </button>
    </div>
  );
}

describe('FullScreenLabShell to VentureProvider auto-linking', () => {
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

  it('links saved PCB workspace ID onto the active Venture thread at stage 4', async () => {
    globalThis.fetch = vi.fn(async (_url, init) => {
      if (init?.method === 'POST') {
        return new Response(
          JSON.stringify({
            storage: 'memory',
            workspace: {
              workspaceId: 'ws_pcb_tiruppur_01',
              kind: 'pcb',
              slugOrRoute: '/manufacturing/pcb',
              title: 'Tiruppur Dye Sensor Rev B',
              ownerHandle: 'karthik-subramanian',
              ownerName: 'Karthik Subramanian',
              tags: ['pcb'],
              payload: { layers: 4 },
              updatedAt: new Date().toISOString(),
            },
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } },
        );
      }
      return new Response(JSON.stringify({ workspaces: [], storage: 'memory' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as unknown as typeof fetch;

    await act(async () => {
      root.render(
        <VentureProvider>
          <FullScreenLabShell
            labKind="pcb"
            title="A-Z PCB Studio"
            category="Hardware"
            currentRoute="/manufacturing/pcb"
          >
            <VentureLinkedLabProbe />
          </FullScreenLabShell>
        </VentureProvider>,
      );
    });

    const saveBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Trigger Save'),
    );
    expect(saveBtn).toBeTruthy();

    await act(async () => {
      saveBtn?.click();
    });

    expect(container.querySelector('[data-testid="linked-pcb"]')?.textContent).toBe(
      'ws_pcb_tiruppur_01',
    );
    expect(container.querySelector('[data-testid="venture-stage"]')?.textContent).toBe('4');
  });
});
