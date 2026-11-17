import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SolarCatalog } from './solar-catalog';
import { IvPvCurveVisualizer } from './iv-pv-curve-visualizer';
import { MpptTrackerSimulator } from './mppt-tracker-simulator';
import { SolarConverterWorkbench } from './solar-converter-workbench';
import { SolarDetailView } from './solar-detail-view';
import { SOLAR_MPPT_PROJECTS_REGISTRY } from '@/lib/data/solar-mppt-data';
import { simulateSolarMppt } from '@hackerland/core';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Solar PV & MPPT Simulator Components', () => {
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

  it('renders SolarCatalog with curated Indian solar projects', () => {
    act(() => {
      root.render(<SolarCatalog initialProjects={SOLAR_MPPT_PROJECTS_REGISTRY} />);
    });

    expect(container.textContent).toContain('Solar PV & MPPT Battery Charge Controller Simulator');
    expect(container.textContent).toContain('Curated Indian Solar Projects');
    expect(container.textContent).toContain('540W Monocrystalline Bifacial Canal-Top Panel');
    expect(container.textContent).toContain('2.2 kW Solar Agricultural BLDC Water Pump');
    expect(container.textContent).toContain('DRDO Leh');
  });

  it('filters SolarCatalog by search keyword', () => {
    act(() => {
      root.render(<SolarCatalog initialProjects={SOLAR_MPPT_PROJECTS_REGISTRY} />);
    });

    const searchInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    expect(searchInput).toBeTruthy();

    act(() => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeInputValueSetter?.call(searchInput, 'Ladakh');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('100W Sub-Zero High-Altitude Defence MPPT (DRDO Leh -30°C)');
    expect(container.textContent).not.toContain('540W Monocrystalline Bifacial Canal-Top Panel');
  });

  it('renders IvPvCurveVisualizer with SVG curves and MPP indicators', () => {
    const project = SOLAR_MPPT_PROJECTS_REGISTRY[0]!;
    const simResult = simulateSolarMppt({
      irradianceWPerM2: 1000,
      cellTemperatureC: 25,
      panelSpecs: project.panelSpecs,
      algorithm: 'incremental_conductance',
      targetBatteryType: 'lfp_48v',
      converterSwitchingFreqKhz: 150,
    });

    act(() => {
      root.render(
        <IvPvCurveVisualizer
          ivCurve={simResult.ivCurve}
          pvCurve={simResult.pvCurve}
          vmppActualV={simResult.vmppActualV}
          imppActualA={simResult.imppActualA}
          pmppActualW={simResult.pmppActualW}
          vocActualV={simResult.vocActualV}
          iscActualA={simResult.iscActualA}
          fillFactor={simResult.fillFactor}
        />
      );
    });

    expect(container.textContent).toContain('Photovoltaic IV & PV Characteristic Curves');
    expect(container.textContent).toContain('Fill Factor (FF)');
    expect(container.textContent).toContain('MPP:');
    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.querySelectorAll('polyline').length).toBeGreaterThanOrEqual(2);
  });

  it('renders MpptTrackerSimulator with state machine steps and controls', () => {
    const project = SOLAR_MPPT_PROJECTS_REGISTRY[0]!;
    const simResult = simulateSolarMppt({
      irradianceWPerM2: 1000,
      cellTemperatureC: 25,
      panelSpecs: project.panelSpecs,
      algorithm: 'incremental_conductance',
      targetBatteryType: 'lfp_48v',
    });

    act(() => {
      root.render(
        <MpptTrackerSimulator
          algorithm="incremental_conductance"
          vmppActualV={simResult.vmppActualV}
          pmppActualW={simResult.pmppActualW}
          trackingEfficiencyPercent={simResult.trackingEfficiencyPercent}
          pvCurve={simResult.pvCurve}
        />
      );
    });

    expect(container.textContent).toContain('MPPT Real-Time Tracking Loop Simulator');
    expect(container.textContent).toContain('incremental_conductance');
    expect(container.textContent).toContain('Current Iteration');
    expect(container.textContent).toContain('Tracking Efficiency');
    expect(container.textContent).toContain('Pause');
  });

  it('renders SolarConverterWorkbench and responds to preset clicks', () => {
    const project = SOLAR_MPPT_PROJECTS_REGISTRY[0]!;

    act(() => {
      root.render(
        <SolarConverterWorkbench
          initialPanelSpecs={project.panelSpecs}
          initialAlgorithm="incremental_conductance"
          initialBattery="lfp_48v"
        />
      );
    });

    expect(container.textContent).toContain('PV & MPPT Simulator Parameters');
    expect(container.textContent).toContain('Solar Irradiance (G)');
    expect(container.textContent).toContain('Synchronous Buck Converter Sizing');

    // Click Thar Desert preset
    const buttons = Array.from(container.querySelectorAll('button'));
    const desertButton = buttons.find((b) => b.textContent?.includes('Thar Desert'));
    expect(desertButton).toBeTruthy();

    act(() => {
      desertButton?.click();
    });

    expect(container.textContent).toContain('65°C');
  });

  it('renders SolarDetailView with NABL test facility, directives, and workbench', () => {
    const project = SOLAR_MPPT_PROJECTS_REGISTRY[0]!;

    act(() => {
      root.render(<SolarDetailView project={project} />);
    });

    expect(container.textContent).toContain(project.title);
    expect(container.textContent).toContain(project.indianContextFacility);
    expect(container.textContent).toContain(project.standardsCompliance);
    expect(container.textContent).toContain('Engineering Directives & Design Archaeology');
    expect(container.textContent).toContain(project.designDirectives[0]);
    expect(container.textContent).toContain('Interactive Simulation & Converter Sizing');
  });
});
