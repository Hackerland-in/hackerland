import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SprintCatalog } from './sprint-catalog';
import { SprintCountdownTimer } from './sprint-countdown-timer';
import { SprintSubmissionDrawer } from './sprint-submission-drawer';
import { SprintDetailView } from './sprint-detail-view';
import { SPRINTS_CATALOG } from '@/lib/data/sprints-data';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Sprints & Rapid Hardware Hackathons Components', () => {
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

  it('renders SprintCatalog with statistics and sprint cards', () => {
    act(() => {
      root.render(<SprintCatalog initialSprints={SPRINTS_CATALOG} />);
    });

    expect(container.textContent).toContain('Total Prize Escrow');
    expect(container.textContent).toContain('Squads Building');
    expect(container.textContent).toContain('48H Indigenous Autopilot & Gimbal Sprint');
    expect(container.textContent).toContain('AIS-156 Phase 2 Dual-Stage Smart BMS Sprint');
    expect(container.textContent).toContain('Mindgrove Secure IoT RISC-V Silicon Driver Sprint');
  });

  it('filters sprints by search query', () => {
    act(() => {
      root.render(<SprintCatalog initialSprints={SPRINTS_CATALOG} />);
    });

    const searchInput = container.querySelector('input[type="search"]') as HTMLInputElement;
    expect(searchInput).toBeTruthy();

    act(() => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeInputValueSetter?.call(searchInput, 'Mindgrove');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('Mindgrove Secure IoT RISC-V Silicon Driver Sprint');
    expect(container.textContent).not.toContain('48H Indigenous Autopilot & Gimbal Sprint');
  });

  it('renders SprintCountdownTimer with milestone tags and timeline status', () => {
    const sprint = SPRINTS_CATALOG[0]!;
    act(() => {
      root.render(<SprintCountdownTimer sprint={sprint} />);
    });

    expect(container.textContent).toContain('Sprint Timeline Status');
    expect(container.textContent).toContain('48 Hours Total');
    expect(container.textContent).toContain('H+12');
    expect(container.textContent).toContain('H+24');
    expect(container.textContent).toContain('H+36');
    expect(container.textContent).toContain('H+48');
  });

  it('renders SprintSubmissionDrawer and validates inputs', () => {
    const sprint = SPRINTS_CATALOG[0]!;
    act(() => {
      root.render(
        <SprintSubmissionDrawer
          sprint={sprint}
          isOpen={true}
          onClose={() => {}}
        />
      );
    });

    expect(container.textContent).toContain('Submit Milestone Artifacts');
    expect(container.textContent).toContain('Sprint Escrow Check-in');

    const form = container.querySelector('form');
    expect(form).toBeTruthy();

    act(() => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(container.textContent).toContain('Please fix the following:');
    expect(container.textContent).toContain('CAD / Hardware artifact URL is required for this milestone');
  });

  it('renders SprintDetailView with prize breakdown and jury panel', () => {
    const sprint = SPRINTS_CATALOG[0]!;
    act(() => {
      root.render(<SprintDetailView sprint={sprint} />);
    });

    expect(container.textContent).toContain('48H Indigenous Autopilot & Gimbal Sprint');
    expect(container.textContent).toContain('Non-Dilutive Prize Distribution');
    expect(container.textContent).toContain('1st Place');
    expect(container.textContent).toContain('50% of pool');
    expect(container.textContent).toContain('Sprint Milestones & Evaluation Gates');
    expect(container.textContent).toContain('Sponsored Hardware Perks & Lab Vouchers');
    expect(container.textContent).toContain('Jury & Evaluation Panel');
  });
});
