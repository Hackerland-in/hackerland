import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BatteryEisCatalog } from './battery-eis-catalog';
import { NyquistPlotVisualizer } from './nyquist-plot-visualizer';
import { BodePlotVisualizer } from './bode-plot-visualizer';
import { RandlesCircuitFitter } from './randles-circuit-fitter';
import { BatteryEisDetailView } from './battery-eis-detail-view';
import { BATTERY_EIS_REGISTRY } from '@/lib/data/battery-eis-data';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Battery EIS & State-of-Health Components', () => {
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

  it('renders BatteryEisCatalog with summary metrics and cell projects', () => {
    act(() => {
      root.render(<BatteryEisCatalog initialProjects={BATTERY_EIS_REGISTRY} />);
    });

    expect(container.textContent).toContain('Battery State-of-Health (SoH) & EIS Analyzer');
    expect(container.textContent).toContain('Total Characterized Cells');
    expect(container.textContent).toContain('LFP 32700 6.0Ah Baseline Cell');
    expect(container.textContent).toContain('NMC 21700 5.0Ah High-Energy Cell');
  });

  it('filters BatteryEisCatalog by search keyword', () => {
    act(() => {
      root.render(<BatteryEisCatalog initialProjects={BATTERY_EIS_REGISTRY} />);
    });

    const searchInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    expect(searchInput).toBeTruthy();

    act(() => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeInputValueSetter?.call(searchInput, 'Sodium');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('Indigenous Sodium-Ion (Na-Ion) 32140 Prismatic 15Ah Prototype');
    expect(container.textContent).not.toContain('Ather 450X');
  });

  it('renders NyquistPlotVisualizer with SVG axes and zero-crossing marker', () => {
    const project = BATTERY_EIS_REGISTRY[0];
    expect(project).toBeDefined();

    act(() => {
      root.render(
        <NyquistPlotVisualizer
          measuredSpectrum={project!.eisSpectrum}
          fittedEcm={project!.fittedEcm}
          cellTitle={project!.title}
        />
      );
    });

    expect(container.textContent).toContain('Nyquist Impedance Spectrum');
    expect(container.textContent).toContain('Real Impedance Z′ (mΩ)');
    expect(container.textContent).toContain('-Imaginary Impedance -Z″ (mΩ)');
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders BodePlotVisualizer with magnitude and phase curves', () => {
    const project = BATTERY_EIS_REGISTRY[0];
    expect(project).toBeDefined();

    act(() => {
      root.render(<BodePlotVisualizer measuredSpectrum={project!.eisSpectrum} />);
    });

    expect(container.textContent).toContain('Bode Frequency Response');
    expect(container.textContent).toContain('|Z| (mΩ)');
    expect(container.textContent).toContain('Phase (°)');
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders RandlesCircuitFitter and responds to parameter changes', () => {
    const project = BATTERY_EIS_REGISTRY[0];
    expect(project).toBeDefined();

    act(() => {
      root.render(<RandlesCircuitFitter initialParams={project!.fittedEcm} />);
    });

    expect(container.textContent).toContain('Equivalent Circuit Model (ECM) Fitter');
    expect(container.textContent).toContain('Bulk R₀ (Electrolyte)');
    expect(container.textContent).toContain('Charge-Transfer R_ct');
    expect(container.textContent).toContain('Warburg Diffusion (σ_w)');

    const rBulkInput = container.querySelector('input[type="range"]') as HTMLInputElement;
    expect(rBulkInput).toBeTruthy();

    act(() => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeInputValueSetter?.call(rBulkInput, '0.030');
      rBulkInput.dispatchEvent(new Event('input', { bubbles: true }));
      rBulkInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('30.00 mΩ');
  });

  it('renders BatteryEisDetailView with AIS-156 safety verdict and diagnostics', () => {
    const project = BATTERY_EIS_REGISTRY[3]; // The lithium plating failure cell
    expect(project).toBeDefined();

    act(() => {
      root.render(<BatteryEisDetailView project={project!} />);
    });

    expect(container.textContent).toContain(project!.title);
    expect(container.textContent).toContain('AIS-156 Phase 2 / Amendment 3 Verdict: quarantine isolate');
    expect(container.textContent).toContain('critical');
    expect(container.textContent).toContain('State of Health (SoH)');
    expect(container.textContent).toContain('ARAI Pune');
  });
});
