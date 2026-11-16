import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ClubsDirectory } from './clubs-directory';
import { ClubDetailView } from './club-detail-view';
import { CLUBS_DATA } from '@/lib/data/clubs-data';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('ClubsDirectory Component', () => {
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

  it('renders directory heading and initial clubs count', () => {
    act(() => {
      root.render(<ClubsDirectory initialClubs={CLUBS_DATA} />);
    });

    expect(container.textContent).toContain('ACTIVE INTRA-CLUB CHALLENGES & SQUAD HACKATHONS');
    expect(container.textContent).toContain('SHOWING 6 INNOVATION HUBS');
    expect(container.textContent).toContain('Maker Village Kochi ATL & FabLab Hub');
    expect(container.textContent).toContain('DPS R.K. Puram Atal Tinkering Lab');
  });

  it('filters clubs by search input', () => {
    act(() => {
      root.render(<ClubsDirectory initialClubs={CLUBS_DATA} />);
    });

    const searchInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    expect(searchInput).toBeTruthy();

    act(() => {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeSetter?.call(searchInput, 'Kochi');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('Maker Village Kochi ATL & FabLab Hub');
    expect(container.textContent).not.toContain('DPS R.K. Puram Atal Tinkering Lab');
  });

  it('renders detailed chapter profile and equipment roster in ClubDetailView', () => {
    const kochiClub = CLUBS_DATA[0]!;
    act(() => {
      root.render(<ClubDetailView club={kochiClub} />);
    });

    expect(container.textContent).toContain(kochiClub.name);
    expect(container.textContent).toContain('Chief FabLab Technologist & Innovation Director');
    expect(container.textContent).toContain('Voltera V-One PCB Printer');
    expect(container.textContent).toContain('Keysight DSOX1204G 4-Ch 200MHz Oscilloscope');
    expect(container.textContent).toContain('Monsoon Flood Sensing Mesh Challenge');
  });
});
