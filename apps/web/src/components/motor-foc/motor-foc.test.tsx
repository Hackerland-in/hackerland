import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MotorCatalog } from './motor-catalog';
import { SvpwmHexagonVisualizer } from './svpwm-hexagon-visualizer';
import { FocWaveformVisualizer } from './foc-waveform-visualizer';
import { MotorFocWorkbench } from './motor-foc-workbench';
import { MotorDetailView } from './motor-detail-view';
import { MOTOR_FOC_PROJECTS_REGISTRY } from '@/lib/data/motor-foc-data';
import { simulateMotorFoc } from '@hackerland/core';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Motor FOC & SVPWM Simulator Components', () => {
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

  it('renders MotorCatalog with curated Indian powertrains', () => {
    act(() => {
      root.render(<MotorCatalog initialProjects={MOTOR_FOC_PROJECTS_REGISTRY} />);
    });

    expect(container.textContent).toContain('BLDC & PMSM Field-Oriented Control (FOC) Simulator');
    expect(container.textContent).toContain('Curated Indian Powertrains');
    expect(container.textContent).toContain('Ather 450X 6 kW IPM PMSM Mid-Drive Controller');
    expect(container.textContent).toContain('Ola S1 Pro 8.5 kW IPM High-Speed Traction Motor');
    expect(container.textContent).toContain('PM-KUSUM Component-B');
  });

  it('filters MotorCatalog by search keyword', () => {
    act(() => {
      root.render(<MotorCatalog initialProjects={MOTOR_FOC_PROJECTS_REGISTRY} />);
    });

    const searchInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    expect(searchInput).toBeTruthy();

    act(() => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeInputValueSetter?.call(searchInput, 'Euler');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('Euler HiLoad 10.96 kW Liquid-Cooled EV 3-Wheeler Motor');
    expect(container.textContent).not.toContain('Ather 450X 6 kW IPM PMSM');
  });

  it('renders SvpwmHexagonVisualizer with 6 sectors, active vectors, and dwell times', () => {
    act(() => {
      root.render(
        <SvpwmHexagonVisualizer
          currentSector={2}
          modulationIndex={0.88}
          dwellTimeT1Us={18.5}
          dwellTimeT2Us={22.0}
          dwellTimeT0Us={9.5}
          dcBusVoltageV={51.2}
        />
      );
    });

    expect(container.textContent).toContain('Space Vector PWM (SVPWM) Voltage Hexagon');
    expect(container.textContent).toContain('Sector 2');
    expect(container.textContent).toContain('m = 0.88');
    expect(container.textContent).toContain('SVPWM Dwell Times');
    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.querySelectorAll('polygon').length).toBeGreaterThanOrEqual(6);
  });

  it('renders FocWaveformVisualizer with 3-phase currents and duty cycle toggle', () => {
    const project = MOTOR_FOC_PROJECTS_REGISTRY[0]!;
    const simResult = simulateMotorFoc({
      targetSpeedRpm: 3200,
      loadTorqueNm: 15,
      motor: project.motorParams,
    });

    act(() => {
      root.render(
        <FocWaveformVisualizer
          waveforms={simResult.waveforms}
          idCurrentA={simResult.idCurrentA}
          iqCurrentA={simResult.iqCurrentA}
          phaseCurrentRmsA={simResult.phaseCurrentRmsA}
        />
      );
    });

    expect(container.textContent).toContain('3-Phase Stator Current');
    expect(container.textContent).toContain('Phase A (U)');
    expect(container.textContent).toContain('Phase B (V)');
    expect(container.textContent).toContain('Phase C (W)');

    // Click toggle to switch to duty cycles
    const dutyButton = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Saddle Duty Cycles')
    );
    expect(dutyButton).toBeTruthy();

    act(() => {
      dutyButton?.click();
    });

    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders MotorFocWorkbench and responds to preset clicks', () => {
    const project = MOTOR_FOC_PROJECTS_REGISTRY[0]!;

    act(() => {
      root.render(
        <MotorFocWorkbench
          initialMotor={project.motorParams}
          initialSpeedRpm={3000}
          initialTorqueNm={12}
        />
      );
    });

    expect(container.textContent).toContain('FOC Control & Inverter Parameters');
    expect(container.textContent).toContain('Target Mechanical Speed');
    expect(container.textContent).toContain('PI Controller Gains & Electrical States');

    // Click Euler climb preset
    const buttons = Array.from(container.querySelectorAll('button'));
    const eulerBtn = buttons.find((b) => b.textContent?.includes('Euler HiLoad'));
    expect(eulerBtn).toBeTruthy();

    act(() => {
      eulerBtn?.click();
    });

    expect(container.textContent).toContain('55 N·m');
  });

  it('renders MotorDetailView with NABL test facility, directives, and workbench', () => {
    const project = MOTOR_FOC_PROJECTS_REGISTRY[0]!;

    act(() => {
      root.render(<MotorDetailView project={project} />);
    });

    expect(container.textContent).toContain(project.title);
    expect(container.textContent).toContain(project.indianContextFacility);
    expect(container.textContent).toContain(project.standardsCompliance);
    expect(container.textContent).toContain('Engineering Directives & Design Archaeology');
    expect(container.textContent).toContain(project.designDirectives[0]);
    expect(container.textContent).toContain('Interactive FOC Loop & SVPWM Hexagon Simulator');
  });
});
