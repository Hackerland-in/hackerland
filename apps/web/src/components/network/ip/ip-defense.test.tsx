import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { IpDefenseLedgerView } from './ip-defense-ledger-view';
import { DefensivePublicationDetail } from './defensive-publication-detail';
import { IP_DEFENSE_PUBLICATIONS } from '@/lib/data/ip-defense-data';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('IpDefenseLedgerView Component', () => {
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

  it('renders ledger heading, verifier tool, and initial publications', () => {
    act(() => {
      root.render(<IpDefenseLedgerView initialPublications={IP_DEFENSE_PUBLICATIONS} />);
    });

    expect(container.textContent).toContain('Open Invention Network & IP Defense Ledger');
    expect(container.textContent).toContain('CRYPTOGRAPHIC PRIOR-ART INTEGRITY VERIFIER');
    expect(container.textContent).toContain('Decentralized CAN-FD Active Cell Balancing BMS');
    expect(container.textContent).toContain('Autonomous Tilt-Rotor UAV Magnetic Cargo Latch');
  });

  it('filters publications by search query', () => {
    act(() => {
      root.render(<IpDefenseLedgerView initialPublications={IP_DEFENSE_PUBLICATIONS} />);
    });

    const searchInput = container.querySelector(
      'input[placeholder*="Search prior art disclosures"]'
    ) as HTMLInputElement;
    expect(searchInput).toBeTruthy();

    act(() => {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeSetter?.call(searchInput, 'Cycloidal');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('Backlash-Free Dual-Stage Cycloidal Speed Reducer');
    expect(container.textContent).not.toContain('Decentralized CAN-FD Active Cell Balancing BMS');
  });

  it('verifies candidate sha256 hash using the in-page verifier tool', () => {
    act(() => {
      root.render(<IpDefenseLedgerView initialPublications={IP_DEFENSE_PUBLICATIONS} />);
    });

    const verifierInput = container.querySelector(
      'input[placeholder*="Paste any SHA-256 digest"]'
    ) as HTMLInputElement;
    expect(verifierInput).toBeTruthy();

    const sampleHash = IP_DEFENSE_PUBLICATIONS[0]!.timestampProof.sha256Hash;

    act(() => {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeSetter?.call(verifierInput, sampleHash);
      verifierInput.dispatchEvent(new Event('input', { bubbles: true }));
      verifierInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const verifyButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(verifyButton).toBeTruthy();

    act(() => {
      verifyButton.click();
    });

    expect(container.textContent).toContain('VERIFIED PRIOR ART RECORD FOUND: #ip-led-2026-0814');
  });
});

describe('DefensivePublicationDetail Component', () => {
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

  it('renders complete statutory claims, proof strip, and open artifacts', () => {
    const pub = IP_DEFENSE_PUBLICATIONS[0]!;
    act(() => {
      root.render(<DefensivePublicationDetail publication={pub} />);
    });

    expect(container.textContent).toContain(pub.title);
    expect(container.textContent).toContain('RFC 3161 CRYPTOGRAPHIC TIMESTAMP TOKEN');
    expect(container.textContent).toContain(pub.timestampProof.sha256Hash);
    expect(container.textContent).toContain('Novel Technical Claims & Hardware Mechanisms');
    expect(container.textContent).toContain('rvce-chimera-bms-schematic-v2.1.pdf');
    expect(container.textContent).toContain('USPTO 35 U.S.C. § 102(a)(1)');
  });
});
