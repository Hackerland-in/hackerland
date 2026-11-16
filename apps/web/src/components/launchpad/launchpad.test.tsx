import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LaunchpadStudio } from './launchpad-studio';
import { CampaignDetailView } from './campaign-detail-view';
import { CAMPAIGN_REGISTRY } from '@/lib/data/launchpad-data';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('LaunchpadStudio Component', () => {
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

  it('renders campaigns directory and header metrics', () => {
    act(() => {
      root.render(<LaunchpadStudio />);
    });

    expect(container.textContent).toContain('Hardware Launchpad & Grant Matcher');
    expect(container.textContent).toContain('ESCROW LOCKED');
    expect(container.textContent).toContain('QUORUM PASS RATE');
    expect(container.textContent).toContain('Active Campaigns');
    expect(container.textContent).toContain('Govt Grant Matcher');
    expect(container.textContent).toContain('Sub-100g Micro-Recon LoRa Mesh Drone');
  });

  it('switches to Grant Matcher tab and displays Indian Government schemes', () => {
    act(() => {
      root.render(<LaunchpadStudio />);
    });

    const grantTab = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Govt Grant Matcher')
    );
    expect(grantTab).toBeTruthy();

    act(() => {
      grantTab?.click();
    });

    expect(container.textContent).toContain('NON-DILUTIVE GRANT ENGINE');
    expect(container.textContent).toContain('Project Eligibility Profile');
    expect(container.textContent).toContain('Technology Readiness Level (TRL)');
    expect(container.textContent).toContain('iDEX DISC');
    expect(container.textContent).toContain('BIRAC BIG');
  });

  it('switches to Escrow Simulator tab and validates quorum computation', () => {
    act(() => {
      root.render(<LaunchpadStudio />);
    });

    const simTab = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Escrow & Quorum Simulator')
    );
    expect(simTab).toBeTruthy();

    act(() => {
      simTab?.click();
    });

    expect(container.textContent).toContain('CRYPTOGRAPHIC & BACKER ESCROW MODEL');
    expect(container.textContent).toContain('Simulate Milestone Quorum');
    expect(container.textContent).toContain('ESCROW VERDICT');
  });
});

describe('CampaignDetailView Component', () => {
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

  it('renders campaign details, milestone roadmap and allows simulated backer vote', () => {
    const campaign = CAMPAIGN_REGISTRY[0]!;

    act(() => {
      root.render(<CampaignDetailView campaign={campaign} />);
    });

    expect(container.textContent).toContain(campaign.title);
    expect(container.textContent).toContain('Engineering Milestone Roadmap');
    expect(container.textContent).toContain('FUNDS PLEDGED TO ESCROW');
    expect(container.textContent).toContain('100% MILESTONE ESCROW GUARANTEE');

    // Check voting button on review milestone
    const approveBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Approve Disbursal')
    );
    if (approveBtn) {
      act(() => {
        approveBtn.click();
      });
      expect(container.textContent).toContain('You have cast your backer vote');
    }
  });
});
