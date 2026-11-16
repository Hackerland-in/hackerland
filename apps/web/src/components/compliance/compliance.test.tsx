import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ComplianceWizard } from './compliance-wizard';
import { PreComplianceAuditor } from './pre-compliance-auditor';
import { LabQuoteEstimator } from './lab-quote-estimator';
import { ComplianceDetailView } from './compliance-detail-view';
import { COMPLIANCE_ROADMAPS } from '@/lib/data/compliance-data';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Compliance & Regulatory Wizard Components', () => {
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

  it('renders ComplianceWizard with 30-second profiler and roadmaps', () => {
    act(() => {
      root.render(<ComplianceWizard initialRoadmaps={COMPLIANCE_ROADMAPS} />);
    });

    expect(container.textContent).toContain('Hardware Regulatory & NABL Lab Certification Wizard');
    expect(container.textContent).toContain('30-SECOND HARDWARE REGULATORY PROFILER');
    expect(container.textContent).toContain('Wireless RF (Wi-Fi/BLE/LoRa)');
    expect(container.textContent).toContain('Lithium-ion Battery Pack');
    expect(container.textContent).toContain('DGCA Commercial Drone Type Certification');
    expect(container.textContent).toContain('AIS-156 Phase 2 EV Battery Pack Safety Certification');
  });

  it('renders PreComplianceAuditor and updates readiness score when task is toggled', () => {
    const tasks = COMPLIANCE_ROADMAPS[0]?.preComplianceChecklist ?? [];
    act(() => {
      root.render(<PreComplianceAuditor tasks={tasks} title="Drone Pre-Compliance Audit" />);
    });

    expect(container.textContent).toContain('Drone Pre-Compliance Audit');
    expect(container.textContent).toContain('Readiness Score');
    expect(container.textContent).toContain('0 of 4 Checks Verified');

    // Click first task
    const firstCheckbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(firstCheckbox).toBeTruthy();

    act(() => {
      firstCheckbox.click();
    });

    expect(container.textContent).toContain('1 of 4 Checks Verified');
  });

  it('renders LabQuoteEstimator with NABL accredited test houses and fees', () => {
    const labs = COMPLIANCE_ROADMAPS[0]?.recommendedLabs ?? [];
    act(() => {
      root.render(<LabQuoteEstimator labs={labs} />);
    });

    expect(container.textContent).toContain('NABL ACCREDITED TESTING LABORATORIES');
    expect(container.textContent).toContain('SAMEER Centre for Electromagnetics');
    expect(container.textContent).toContain('CSIR-NAL');
    expect(container.textContent).toContain('TC-5432');
    expect(container.textContent).toContain('₹2.10 Lakhs');
  });

  it('renders ComplianceDetailView with penalties, test parameters, and portals', () => {
    const roadmap = COMPLIANCE_ROADMAPS[1]!; // AIS-156
    act(() => {
      root.render(<ComplianceDetailView item={roadmap} />);
    });

    expect(container.textContent).toContain('AIS-156 Phase 2 EV Battery Pack Safety Certification');
    expect(container.textContent).toContain('STATUTORY PENALTIES FOR NON-COMPLIANT SALE / DEPLOYMENT');
    expect(container.textContent).toContain('APPLICABLE STATUTORY STANDARDS & CHAMBER TEST PARAMETERS');
    expect(container.textContent).toContain('STATUTORY GOVERNMENT FILING PORTALS');
    expect(container.textContent).toContain('MoRTH VAHAN Portal');
    expect(container.textContent).toContain('SUBMISSION DOSSIER REQUIREMENTS');
  });
});
