import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  INDIA_STATES_AND_UTS_DIRECTORY,
  type IndiaZoneId,
} from '@/lib/data/india-ecosystem-data';
import { IndiaResourcesHub } from './india-resources-hub';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const VALID_ZONES = new Set<IndiaZoneId>([
  'north',
  'west',
  'south',
  'east',
  'northeast',
  'central',
]);

describe('INDIA_STATES_AND_UTS_DIRECTORY', () => {
  it('covers all 28 Indian States and 8 Union Territories without duplicates', () => {
    expect(INDIA_STATES_AND_UTS_DIRECTORY).toHaveLength(36);
    const states = INDIA_STATES_AND_UTS_DIRECTORY.filter((e) => !e.isUt);
    const uts = INDIA_STATES_AND_UTS_DIRECTORY.filter((e) => e.isUt);
    expect(states).toHaveLength(28);
    expect(uts).toHaveLength(8);

    const codes = new Set(INDIA_STATES_AND_UTS_DIRECTORY.map((e) => e.code));
    const names = new Set(INDIA_STATES_AND_UTS_DIRECTORY.map((e) => e.name));
    expect(codes.size).toBe(36);
    expect(names.size).toBe(36);

    for (const entry of INDIA_STATES_AND_UTS_DIRECTORY) {
      expect(VALID_ZONES.has(entry.zone)).toBe(true);
      expect(entry.statePortalUrl.startsWith('https://')).toBe(true);
      expect(entry.prototypingAccess.length).toBeGreaterThan(5);
    }
  });
});

describe('IndiaResourcesHub Pan-India 36 States & UTs UI', () => {
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
  });

  it('renders every state & UT quick selector and filters interactively', async () => {
    await act(async () => {
      root.render(<IndiaResourcesHub />);
    });

    expect(container.textContent).toContain('All 28 States & 8 Union Territories (36/36)');
    expect(container.textContent).toContain('Sikkim');
    expect(container.textContent).toContain('Ladakh (UT)');
    expect(container.textContent).toContain('Manipur');
    expect(container.textContent).toContain('Lakshadweep (UT)');

    // Click Ladakh (UT) pill to inspect its mission portal and cold-arid lab
    const ladakhBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Ladakh (UT)'),
    );
    expect(ladakhBtn).toBeTruthy();

    await act(async () => {
      ladakhBtn?.click();
    });

    expect(container.textContent).toContain('UT Ladakh Industrial & Startup Cell');
    expect(container.textContent).toContain('DIHAR (DRDO) Cold-Arid Lab Leh');

    // Clear filter and search for Tripura
    const clearBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Clear state filter'),
    );
    expect(clearBtn).toBeTruthy();
    await act(async () => {
      clearBtn?.click();
    });

    const searchInput = container.querySelector('input[type="search"]') as HTMLInputElement;
    expect(searchInput).toBeTruthy();

    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      setter?.call(searchInput, 'Tripura');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect(container.textContent).toContain('All 28 States & 8 Union Territories (1/36)');
    expect(container.textContent).toContain('Tripura Startup / Directorate of IT');
  });
});
