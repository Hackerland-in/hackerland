import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { RfCatalog } from './rf-catalog';
import { RfStackupCalculator } from './rf-stackup-calculator';
import { SmithChartVisualizer } from './smith-chart-visualizer';
import { RfMatchingSynthesizer } from './rf-matching-synthesizer';
import { RfPresetDetail } from './rf-preset-detail';
import { RF_PRESETS } from '@/lib/data/rf-data';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('RF Impedance & Transmission Line Synthesizer Components', () => {
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

  it('renders RfCatalog with curated RF stacks', () => {
    act(() => {
      root.render(<RfCatalog presets={RF_PRESETS} />);
    });

    expect(container.textContent).toContain('RF Impedance & Transmission Line Synthesizer');
    expect(container.textContent).toContain('Curated Indian RF Stacks');
    expect(container.textContent).toContain('IN865 LoRaWAN Gateway Front-End (Semtech SX1302)');
    expect(container.textContent).toContain('NavIC / GPS Dual-Band GNSS Receiver (L5 Band)');
  });

  it('renders RfStackupCalculator with waveguide cross section and results', () => {
    act(() => {
      root.render(
        <RfStackupCalculator
          initialLineType="microstrip"
          initialSubstrate="rogers_ro4350b"
          initialFreqGHz={2.45}
          initialWidthMm={1.13}
          initialHeightMm={0.508}
        />
      );
    });

    expect(container.textContent).toContain('Characteristic Z₀');
    expect(container.textContent).toContain('Effective ε_eff');
    expect(container.textContent).toContain('Skin Depth');
    expect(container.textContent).toContain('Dielectric Substrate');
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('solves target 50 ohm trace width upon auto-solve button click', () => {
    act(() => {
      root.render(
        <RfStackupCalculator
          initialLineType="microstrip"
          initialSubstrate="fr4_standard"
          initialFreqGHz={1.0}
          initialWidthMm={0.5} // intentionally off-target
          initialHeightMm={1.6}
        />
      );
    });

    const solveBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Auto-Solve')
    );
    expect(solveBtn).toBeTruthy();

    act(() => {
      solveBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    // On 1.6mm FR-4, 50-ohm microstrip width is ~3.0mm
    expect(container.textContent).toContain('Matched (50Ω ±2Ω)');
  });

  it('renders SmithChartVisualizer with SVG circles and points', () => {
    act(() => {
      root.render(
        <SmithChartVisualizer
          points={[
            { label: 'Load (ZL)', real: 0.5, imag: -0.3 },
            { label: 'Matched (50Ω)', real: 0, imag: 0 },
          ]}
          vswr={1.8}
        />
      );
    });

    expect(container.textContent).toContain('Normalized Smith Chart (Z₀ = 50Ω)');
    expect(container.textContent).toContain('VSWR: 1.80:1');
    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.textContent).toContain('Load Z_L');
  });

  it('renders RfMatchingSynthesizer and switches matching modes', () => {
    act(() => {
      root.render(<RfMatchingSynthesizer />);
    });

    expect(container.textContent).toContain('Smith Chart & Complex Impedance Conjugate Matcher');
    expect(container.textContent).toContain('Low-Pass (Harmonic Suppress)');

    const highPassBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('High-Pass')
    );
    expect(highPassBtn).toBeTruthy();

    act(() => {
      highPassBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(container.textContent).toContain('High-Pass');
  });

  it('renders RfPresetDetail with layer stackup and DRC rules', () => {
    const preset = RF_PRESETS[0];
    expect(preset).toBeDefined();

    act(() => {
      root.render(<RfPresetDetail preset={preset!} />);
    });

    expect(container.textContent).toContain(preset!.title);
    expect(container.textContent).toContain(preset!.layerStackup);
    expect(container.textContent).toContain(preset!.indianContextFacility);
    expect(container.textContent).toContain('RF Design Rules & DRC Constraints');
  });
});
