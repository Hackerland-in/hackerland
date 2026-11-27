import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ALL_LAB_NODES } from '@/lib/data/fixtures/labs';
import { LabNodeCard } from './lab-node-card';
import { ActiveBuildJourneyBar } from '@/components/social/active-build-journey-bar';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const mockUsePathname = vi.fn(() => '/labs');

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

describe('Pan-India Lab Nodes & LabNodeCard', () => {
  let container: HTMLDivElement;
  let root: Root;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('provides at least 12 distinct pan-India lab nodes', () => {
    expect(ALL_LAB_NODES.length).toBeGreaterThanOrEqual(12);
    const slugs = new Set(ALL_LAB_NODES.map((l) => l.slug));
    expect(slugs.size).toBe(ALL_LAB_NODES.length);
  });

  it('opens inline booking form and posts club_equipment_booking to /api/bookings', async () => {
    const sampleLab = ALL_LAB_NODES[0]!;
    const fetchSpy = vi.fn(async () =>
      new Response(
        JSON.stringify({
          success: true,
          booking: { id: 'eq-test-123', status: 'reserved' },
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await act(async () => {
      root.render(<LabNodeCard lab={sampleLab} />);
    });

    const openBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Book Bench / HIL Rig'),
    );
    expect(openBtn).toBeTruthy();

    await act(async () => {
      openBtn?.click();
    });

    const noteInput = Array.from(container.querySelectorAll('input')).find((i) =>
      i.placeholder.includes('What are you prototyping'),
    );
    expect(noteInput).toBeTruthy();

    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      setter?.call(noteInput, 'BMS thermal cycling run');
      noteInput?.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const submitBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Confirm Pass'),
    );
    expect(submitBtn).toBeTruthy();

    await act(async () => {
      submitBtn?.click();
    });

    expect(container.textContent).toContain('Pass ID: eq-test-123');
    expect(container.textContent).toContain('Pass Confirmed');
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const [url, init] = fetchSpy.mock.calls[0]! as unknown as [string, RequestInit];
    expect(url).toBe('/api/bookings');
    expect(init?.method).toBe('POST');
    const parsedBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
    expect(parsedBody.kind).toBe('club_equipment_booking');
    expect(parsedBody.clubSlug).toBe(sampleLab.slug);
    expect(parsedBody.equipmentId).toBe(sampleLab.tools[0]);
    expect(String(parsedBody.slotWindow)).toContain('BMS thermal cycling run');
  });
});

describe('ActiveBuildJourneyBar', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.restoreAllMocks();
  });

  it('hides on / and renders 5-step journey navigation on inner routes', async () => {
    mockUsePathname.mockReturnValue('/');
    await act(async () => {
      root.render(<ActiveBuildJourneyBar />);
    });
    expect(container.innerHTML).toBe('');

    mockUsePathname.mockReturnValue('/labs');
    await act(async () => {
      root.render(<ActiveBuildJourneyBar />);
    });
    expect(container.textContent).toContain('1. Ideate');
    expect(container.textContent).toContain('2. Learn & Sectors');
    expect(container.textContent).toContain('3. Squad & Funding');
    expect(container.textContent).toContain('4. Build & Fab');
    expect(container.textContent).toContain('5. Certify & Export');
    expect(container.textContent).toContain('Grants & Labs');
  });
});
