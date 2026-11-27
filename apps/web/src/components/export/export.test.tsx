import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ExportHubStudio } from './export-hub-studio';
import { ExportRegulatoryBridge } from './export-regulatory-bridge';
import { IncotermsMarginCalculator } from './incoterms-margin-calculator';
import { DgftPaperworkWizard } from './dgft-paperwork-wizard';
import { CorridorDirectory } from './corridor-directory';
import { OemQualificationSimulator } from './oem-qualification-simulator';
import { CorridorDetailView } from './corridor-detail-view';
import { EXPORT_CORRIDORS_CATALOG } from '@/lib/data/export-trade-data';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';
import { ComplianceWizard } from '@/components/compliance/compliance-wizard';
import { ComplianceDetailView } from '@/components/compliance/compliance-detail-view';
import { COMPLIANCE_ROADMAPS } from '@/lib/data/compliance-data';
import { SourcingDetailView } from '@/components/sourcing/sourcing-detail-view';
import { COMPONENT_SOURCING_REGISTRY } from '@/lib/data/sourcing-data';
import { IpDefenseLedgerView } from '@/components/network/ip/ip-defense-ledger-view';
import { IP_DEFENSE_PUBLICATIONS } from '@/lib/data/ip-defense-data';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function setNativeInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function setNativeSelectValue(select: HTMLSelectElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value')?.set;
  setter?.call(select, value);
  select.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('Global Export & Trade Hub (/export)', () => {
  let container: HTMLDivElement;
  let root: Root;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    localStorage.clear();
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

  it('renders ExportHubStudio and switches across all 5 interactive tabs', () => {
    act(() => {
      root.render(<ExportHubStudio />);
    });

    expect(container.textContent).toContain('Global Export & Trade Hub (India → World)');
    expect(container.textContent).toContain('Indian NABL Baseline → Global Regulatory Bridge');

    const tabs = Array.from(container.querySelectorAll('[role="tab"]')) as HTMLButtonElement[];
    expect(tabs).toHaveLength(5);

    // Tab 2: HSN & Incoterms Margin
    act(() => {
      tabs[1]?.click();
    });
    expect(container.textContent).toContain('8-Digit ITC-HS & Incoterms 2020 Export Margin Simulator');

    // Tab 3: DGFT Paperwork & PLI
    act(() => {
      tabs[2]?.click();
    });
    expect(container.textContent).toContain('10-Step Indian Export Readiness Gate');
    expect(container.textContent).toContain('PLI & Indian Export Incentive Matchmaker');

    // Tab 4: Global Trade Corridors
    act(() => {
      tabs[3]?.click();
    });
    expect(container.textContent).toContain('India → Global Trade Corridors & Port Playbooks');
    expect(container.textContent).toContain('/export/uae-gcc');

    // Tab 5: OEM Qualification & PPAP
    act(() => {
      tabs[4]?.click();
    });
    expect(container.textContent).toContain('International Tier-1 OEM Qualification & PPAP Level 3 Simulator');
  });

  it('triggers SCOMET dual-use alert, UN 38.3 lithium alert, and RF/NABL savings in ExportRegulatoryBridge', () => {
    act(() => {
      root.render(<ExportRegulatoryBridge />);
    });

    // Default IoT wireless with pre-certified RF & NABL reuse
    expect(container.textContent).toContain('$5,500 Saved');
    expect(container.textContent).toContain('FCC Part 15C');
    expect(container.textContent).toContain('CLEAR · NON-SCOMET');

    // Switch to Drone / UAV archetype
    const droneBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Drone / UAV'),
    );
    expect(droneBtn).toBeTruthy();
    act(() => {
      droneBtn?.click();
    });

    expect(container.textContent).toContain('UN 38.3 Lithium Battery Transport Mandatory');
    expect(container.textContent).toContain('CONDITIONAL SCOMET SCREENING');

    // Enable Tactical IMU / Encryption toggle -> restricted SCOMET
    const imuCheckbox = Array.from(container.querySelectorAll('label')).find((l) =>
      l.textContent?.includes('Tactical IMU'),
    )?.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(imuCheckbox).toBeTruthy();

    act(() => {
      imuCheckbox.click();
    });

    expect(container.textContent).toContain('RESTRICTED · DGFT SCOMET LICENSE');
    expect(container.textContent).toContain('SCOMET Category 5B / 6A007');
  });

  it('recalculates Incoterm quotes, UAE CEPA FTA eligibility, and GST LUT working capital', () => {
    act(() => {
      root.render(<IncotermsMarginCalculator initialCorridor="uae_gcc" initialHsnCode="85076000" />);
    });

    expect(container.textContent).toContain('Selected CIF Quote / Unit');
    expect(container.textContent).toContain('FTA Eligible');
    expect(container.textContent).toContain('India-UAE CEPA');

    // Switch Incoterm to DDP
    const ddpBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'DDP',
    );
    expect(ddpBtn).toBeTruthy();
    act(() => {
      ddpBtn?.click();
    });
    expect(container.textContent).toContain('Selected DDP Quote / Unit');

    // Raise Imported BOM % to 70% -> DVA 30% < 40% RVC threshold -> FTA shortfall warning
    const importedBomInput = container.querySelector(
      'input[aria-label="Imported BOM Percentage"]',
    ) as HTMLInputElement;
    expect(importedBomInput).toBeTruthy();
    act(() => {
      setNativeInputValue(importedBomInput, '70');
    });

    expect(container.textContent).toContain('RVC / Toggle Gap');
    expect(container.textContent).toContain('FTA RVC shortfall');

    // Turn off GST LUT -> triggers upfront IGST cash lockup warning
    const lutCheckbox = Array.from(container.querySelectorAll('label')).find((l) =>
      l.textContent?.includes('GST LUT (Form RFD-11)'),
    )?.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(lutCheckbox).toBeTruthy();

    act(() => {
      lutCheckbox.click();
    });
    expect(container.textContent).toContain('GST LUT (Form RFD-11) disabled');
  });

  it('updates DGFT readiness score across 10 gates, generates invoice dossier, and scores PLI schemes', () => {
    act(() => {
      root.render(<DgftPaperworkWizard />);
    });

    // Starts with 3 default gates (30%)
    expect(container.textContent).toContain('Readiness Score: 30% (3 of 10 Gates Verified)');
    expect(container.textContent).toContain('4 Critical Blockers Remaining');
    expect(container.textContent).toContain('RODTEPY');

    const markAllBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Mark All Complete'),
    );
    expect(markAllBtn).toBeTruthy();
    act(() => {
      markAllBtn?.click();
    });

    expect(container.textContent).toContain('Readiness Score: 100% (10 of 10 Gates Verified)');
    expect(container.textContent).toContain('Shipment Ready (100%)');

    // PLI Matchmaker defaults to drones-defense-space -> PLI Drones near top
    expect(container.textContent).toContain('PLI Drones');
    expect(container.textContent).toContain('RoDTEP');

    const sectorSelect = container.querySelector('select[aria-label="PLI Sector"]') as HTMLSelectElement;
    expect(sectorSelect).toBeTruthy();
    act(() => {
      setNativeSelectValue(sectorSelect, 'ev-clean-energy');
    });
    expect(container.textContent).toContain('PLI Auto Components');
  });

  it('renders CorridorDirectory with all 5 corridor links and FTA filtering', () => {
    act(() => {
      root.render(<CorridorDirectory />);
    });

    expect(container.textContent).toContain('United States Corridor');
    expect(container.textContent).toContain('European Union & UK Corridor');
    expect(container.textContent).toContain('UAE & GCC Corridor');
    expect(container.textContent).toContain('ASEAN Manufacturing & Tech Corridor');
    expect(container.textContent).toContain('East & Southern Africa Corridor');

    const ftaFilterBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Preferential FTA Corridors'),
    );
    expect(ftaFilterBtn).toBeTruthy();
    act(() => {
      ftaFilterBtn?.click();
    });

    expect(container.textContent).toContain('UAE & GCC Corridor');
    expect(container.textContent).toContain('ASEAN Manufacturing & Tech Corridor');
    expect(container.textContent).not.toContain('United States Corridor');
  });

  it('evaluates Tier-1 OEM audit readiness and flags CERN-OHL-S / GPL-3.0 copyleft linking to /network/ip', () => {
    act(() => {
      root.render(<OemQualificationSimulator />);
    });

    // Switch to Aerospace/UAV prime preset (has CERN-OHL-S + GPL-3.0 + no AS9100D)
    const aeroBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Aerospace, UAV & Robotics Prime'),
    );
    expect(aeroBtn).toBeTruthy();
    act(() => {
      aeroBtn?.click();
    });

    expect(container.textContent).toContain('Not Ready for Tier-1 Audit');
    expect(container.textContent).toContain('Copyleft Contamination Detected');
    expect(container.textContent).toContain('CERN-OHL-S');
    expect(container.textContent).toContain('GPL-3.0');
    const ipLink = container.querySelector('a[href="/network/ip"]');
    expect(ipLink).toBeTruthy();

    // Switch to Global Consumer & Industrial IoT ODM preset (clean permissive IP + 100/100)
    const odmBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Global Consumer & Industrial IoT ODM'),
    );
    expect(odmBtn).toBeTruthy();
    act(() => {
      odmBtn?.click();
    });

    expect(container.textContent).toContain('OEM Audit Ready (100/100)');
    expect(container.textContent).toContain('Clean-Room IP Verified');
  });

  it('renders CorridorDetailView inside FullScreenLabShell with pre-set corridor calculator and snapshot save', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      if (init?.method === 'POST') {
        return new Response(
          JSON.stringify({
            success: true,
            workspace: {
              workspaceId: 'ws_export_uae_1',
              kind: 'export_trade',
              slugOrRoute: '/export/uae-gcc',
              title: 'UAE & GCC Scenario',
              ownerHandle: 'rohan_k',
              ownerName: 'Rohan Kulkarni',
              tags: ['export_trade', 'uae_gcc'],
              payload: { corridorId: 'uae_gcc' },
              updatedAt: '2026-11-27T05:00:00.000Z',
            },
            storage: 'memory',
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } },
        );
      }
      return new Response(JSON.stringify({ workspaces: [], storage: 'memory' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const uaePlaybook = EXPORT_CORRIDORS_CATALOG.find((c) => c.slug === 'uae-gcc')!;
    await act(async () => {
      root.render(
        <SocialCommunityProvider>
          <FullScreenLabShell
            labKind="export_trade"
            title={uaePlaybook.name}
            subtitle={uaePlaybook.regionTagline}
            category="Global Export Corridor"
            badge={uaePlaybook.ftaBadge}
            backHref="/export"
            backLabel="Export & Trade Hub"
            currentRoute="/export/uae-gcc"
          >
            <CorridorDetailView playbook={uaePlaybook} />
          </FullScreenLabShell>
        </SocialCommunityProvider>,
      );
    });

    expect(container.textContent).toContain('UAE & GCC Corridor');
    expect(container.textContent).toContain('India-UAE CEPA');
    expect(container.textContent).toContain('Jebel Ali Port (Dubai)');
    expect(container.textContent).toContain('Save Corridor Snapshot');
    expect(container.textContent).toContain('8-Digit ITC-HS & Incoterms 2020 Export Margin Simulator');

    const saveBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Save Corridor Snapshot'),
    );
    expect(saveBtn).toBeTruthy();

    await act(async () => {
      saveBtn?.click();
    });

    const postCall = fetchMock.mock.calls.find((c) => c[1]?.method === 'POST');
    expect(postCall).toBeTruthy();
    const sentBody = JSON.parse(String(postCall?.[1]?.body ?? '{}')) as {
      kind?: string;
      payload?: { corridorId?: string };
    };
    expect(sentBody.kind).toBe('export_trade');
    expect(sentBody.payload?.corridorId).toBe('uae_gcc');
  });

  it('exposes non-breaking cross-links to /export, /emc, and /testbeds across Compliance, Sourcing, and IP Defense', () => {
    act(() => {
      root.render(<ComplianceWizard initialRoadmaps={COMPLIANCE_ROADMAPS} />);
    });
    expect(container.querySelector('a[href="/export"]')).toBeTruthy();
    expect(container.querySelector('a[href="/emc"]')).toBeTruthy();
    expect(container.querySelector('a[href="/testbeds"]')).toBeTruthy();

    act(() => {
      root.render(<ComplianceDetailView item={COMPLIANCE_ROADMAPS[0]!} />);
    });
    expect(container.querySelector('a[href="/export"]')).toBeTruthy();
    expect(container.querySelector('a[href="/emc"]')).toBeTruthy();
    expect(container.querySelector('a[href="/testbeds"]')).toBeTruthy();

    act(() => {
      root.render(<SourcingDetailView record={COMPONENT_SOURCING_REGISTRY[0]!} />);
    });
    expect(container.querySelector('a[href="/export?tab=incoterms"]')).toBeTruthy();
    expect(container.querySelector('a[href="/export?tab=oem"]')).toBeTruthy();

    act(() => {
      root.render(<IpDefenseLedgerView initialPublications={IP_DEFENSE_PUBLICATIONS} />);
    });
    expect(container.querySelector('a[href="/export?tab=oem"]')).toBeTruthy();
  });
});
