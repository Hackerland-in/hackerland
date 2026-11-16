import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ThermalCatalog } from './thermal-catalog';
import { ThermalNetworkDiagram } from './thermal-network-diagram';
import { HeatsinkFinVisualizer } from './heatsink-fin-visualizer';
import { ThermalCalculatorWorkbench } from './thermal-calculator-workbench';
import { ThermalDetailView } from './thermal-detail-view';
import { THERMAL_PROFILES_REGISTRY } from '@/lib/data/thermal-data';
import { calculateThermalDissipation } from '@hackerland/core';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Thermal Management & Heat Sink Profiler Components', () => {
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

  it('renders ThermalCatalog with curated power stacks', () => {
    act(() => {
      root.render(<ThermalCatalog initialProjects={THERMAL_PROFILES_REGISTRY} />);
    });

    expect(container.textContent).toContain('Thermal Management & Heat Sink Profiler');
    expect(container.textContent).toContain('Curated Indian Power Stacks');
    expect(container.textContent).toContain('10 kW Electric Bus Traction Inverter (Wolfspeed SiC)');
    expect(container.textContent).toContain('300W Rooftop Solar GaN Microinverter');
  });

  it('filters ThermalCatalog by search keyword', () => {
    act(() => {
      root.render(<ThermalCatalog initialProjects={THERMAL_PROFILES_REGISTRY} />);
    });

    const searchInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    expect(searchInput).toBeTruthy();

    act(() => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeInputValueSetter?.call(searchInput, 'Jetson');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('NVIDIA Jetson Orin Edge AI Rugged Embedded Box');
    expect(container.textContent).not.toContain('Wolfspeed SiC');
  });

  it('renders ThermalNetworkDiagram with SVG ladder and temperature nodes', () => {
    const project = THERMAL_PROFILES_REGISTRY[0];
    expect(project).toBeDefined();

    const result = calculateThermalDissipation({
      powerDissipationWatts: project!.powerDissipationWatts,
      ambientTemperatureC: project!.operatingAmbientTemperatureC,
      maxJunctionTemperatureC: project!.params.maxJunctionTemperatureC,
      junctionToCaseResistanceCPerW: project!.params.junctionToCaseResistanceCPerW,
      timMaterial: project!.timMaterial,
      timContactAreaCm2: project!.params.timContactAreaCm2,
      heatsinkMaterial: project!.heatsinkMaterial,
      coolingMethod: project!.coolingMethod,
      heatsinkWidthMm: project!.params.heatsinkWidthMm,
      heatsinkLengthMm: project!.params.heatsinkLengthMm,
      baseThicknessMm: project!.params.baseThicknessMm,
      finHeightMm: project!.params.finHeightMm,
      finThicknessMm: project!.params.finThicknessMm,
      numberOfFins: project!.params.numberOfFins,
    });

    act(() => {
      root.render(
        <ThermalNetworkDiagram
          result={result}
          powerWatts={project!.powerDissipationWatts}
          ambientTempC={project!.operatingAmbientTemperatureC}
          maxJunctionTempC={project!.params.maxJunctionTemperatureC}
        />
      );
    });

    expect(container.textContent).toContain('1D Lumped-Parameter Thermal Resistance Network');
    expect(container.textContent).toContain('Junction Temp (T_j)');
    expect(container.textContent).toContain('Thermal Headroom');
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders HeatsinkFinVisualizer with fin geometry and convection mode', () => {
    act(() => {
      root.render(
        <HeatsinkFinVisualizer
          widthMm={100}
          lengthMm={120}
          baseThicknessMm={8}
          finHeightMm={35}
          finThicknessMm={1.8}
          numberOfFins={18}
          material="aluminum_6063_t5"
          coolingMethod="forced_convection_low_cfm"
          finEfficiencyPercent={84.2}
          totalSurfaceAreaCm2={1540}
          heatTransferCoefficient={22.5}
        />
      );
    });

    expect(container.textContent).toContain('Heat Sink Cross-Section & Boundary Layer Convection');
    expect(container.textContent).toContain('Fin Efficiency (η_fin)');
    expect(container.textContent).toContain('84.2%');
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders ThermalCalculatorWorkbench and reacts to slider adjustments', () => {
    act(() => {
      root.render(<ThermalCalculatorWorkbench initialPowerWatts={50} />);
    });

    expect(container.textContent).toContain('Computational Heat Sink Sizer');
    expect(container.textContent).toContain('Power Dissipation (P_diss)');
    expect(container.textContent).toContain('50 W');

    const powerInput = container.querySelector('input[type="range"]') as HTMLInputElement;
    expect(powerInput).toBeTruthy();

    act(() => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeInputValueSetter?.call(powerInput, '80');
      powerInput.dispatchEvent(new Event('input', { bubbles: true }));
      powerInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('80 W');
  });

  it('renders ThermalDetailView with test facility and design notes', () => {
    const project = THERMAL_PROFILES_REGISTRY[0];
    expect(project).toBeDefined();

    act(() => {
      root.render(<ThermalDetailView project={project!} />);
    });

    expect(container.textContent).toContain(project!.title);
    expect(container.textContent).toContain(project!.indianTestFacility);
    expect(container.textContent).toContain('Thermal Interface & Mechanical Packaging Directives');
  });
});
