import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EmcCatalog } from './emc-catalog';
import { EmcSpectralAnalyzer } from './emc-spectral-analyzer';
import { NearFieldProbeHeatmap } from './near-field-probe-heatmap';
import { EmcFilterCalculator } from './emc-filter-calculator';
import { EmcDetailView } from './emc-detail-view';
import { EMC_SCAN_REGISTRY } from '@/lib/data/emc-data';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('EMI/EMC Pre-Scan Analyzer & Near-Field Probe Visualizer Components', () => {
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

  it('renders EmcCatalog with projects and top statistics', () => {
    act(() => {
      root.render(<EmcCatalog initialProjects={EMC_SCAN_REGISTRY} />);
    });

    expect(container.textContent).toContain('Pre-Compliance Scans');
    expect(container.textContent).toContain('First-Pass Compliance');
    expect(container.textContent).toContain('AIS-156 EV BMS Isolated CAN & Buck Conducted Emissions (CISPR 25)');
    expect(container.textContent).toContain('Quad-Rotor Flight Controller 400MHz Clock Radiated Emissions (CISPR 32)');
  });

  it('filters EmcCatalog by search keyword', () => {
    act(() => {
      root.render(<EmcCatalog initialProjects={EMC_SCAN_REGISTRY} />);
    });

    const searchInput = container.querySelector('input[type="search"]') as HTMLInputElement;
    expect(searchInput).toBeTruthy();

    act(() => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeInputValueSetter?.call(searchInput, 'GaN');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('3kW GaN Microinverter High dv/dt Switching Emissions');
    expect(container.textContent).not.toContain('Ather 450 Compatible');
  });

  it('renders EmcSpectralAnalyzer with chart paths and compliance verdict', () => {
    const project = EMC_SCAN_REGISTRY[0]!;
    act(() => {
      root.render(
        <EmcSpectralAnalyzer
          spectralTrace={project.spectralTrace}
          standardTitle={project.standard}
        />
      );
    });

    expect(container.textContent).toContain('Rohde & Schwarz Spectrum Receiver Pre-Scan');
    expect(container.textContent).toContain('COMPLIANT');
    expect(container.textContent).toContain('Worst Margin:');
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders NearFieldProbeHeatmap and selects hotspot diagnostic info', () => {
    const project = EMC_SCAN_REGISTRY[0]!;
    act(() => {
      root.render(
        <NearFieldProbeHeatmap
          hotspots={project.hotspots}
          dutName={project.deviceUnderTesting}
        />
      );
    });

    expect(container.textContent).toContain('Near-Field H-Field / E-Field Probe Scanner');
    expect(container.textContent).toContain('SW_NODE_LM5164');
    expect(container.textContent).toContain('Prescribed Engineering Fix:');
  });

  it('renders EmcFilterCalculator and computes choke inductance', () => {
    act(() => {
      root.render(<EmcFilterCalculator />);
    });

    expect(container.textContent).toContain('Common-Mode Choke & LC Filter Calculator');
    expect(container.textContent).toContain('Minimum Common-Mode Inductance (Lcm)');
    expect(container.textContent).toContain('Calculated Insertion Loss Attenuation');
  });

  it('renders EmcDetailView with full dashboard and recommendations', () => {
    const project = EMC_SCAN_REGISTRY[0]!;
    act(() => {
      root.render(<EmcDetailView project={project} />);
    });

    expect(container.textContent).toContain('AIS-156 EV BMS Isolated CAN & Buck Conducted Emissions (CISPR 25)');
    expect(container.textContent).toContain('Prescribed EMI Filter & PCB Stackup Recommendations');
    expect(container.textContent).toContain('Test Setup & Lab Instrumentation Methodology');
  });
});
