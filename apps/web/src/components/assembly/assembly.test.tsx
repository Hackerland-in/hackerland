import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AssemblyCatalog } from './assembly-catalog';
import { PnpCentroidVisualizer } from './pnp-centroid-visualizer';
import { TurnkeyCostEstimator } from './turnkey-cost-estimator';
import { AssemblyDetailView } from './assembly-detail-view';
import { PCBA_ASSEMBLY_CATALOG } from '@/lib/data/assembly-data';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Assembly Line & SMT Stencil Visualizer Components', () => {
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

  it('renders AssemblyCatalog with projects and top statistics', () => {
    act(() => {
      root.render(<AssemblyCatalog initialProjects={PCBA_ASSEMBLY_CATALOG} />);
    });

    expect(container.textContent).toContain('PCBA Projects');
    expect(container.textContent).toContain('Total Placements');
    expect(container.textContent).toContain('ArduPilot Autopilot Flight Controller PCBA');
    expect(container.textContent).toContain('AIS-156 Smart 16S BMS Master Board');
  });

  it('filters AssemblyCatalog by search keyword', () => {
    act(() => {
      root.render(<AssemblyCatalog initialProjects={PCBA_ASSEMBLY_CATALOG} />);
    });

    const searchInput = container.querySelector('input[type="search"]') as HTMLInputElement;
    expect(searchInput).toBeTruthy();

    act(() => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeInputValueSetter?.call(searchInput, 'Kaynes');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('ArduPilot Autopilot Flight Controller PCBA');
    expect(container.textContent).not.toContain('AIS-156 Smart 16S BMS Master Board');
  });

  it('renders PnpCentroidVisualizer and toggles top and bottom placement sides', () => {
    const project = PCBA_ASSEMBLY_CATALOG[0]!;
    act(() => {
      root.render(
        <PnpCentroidVisualizer
          boardDimensions={project.boardDimensions}
          placements={project.placements}
          projectName={project.name}
        />
      );
    });

    expect(container.textContent).toContain('Pick-and-Place Machine Placement Map');
    expect(container.textContent).toContain('Top Side');
    expect(container.textContent).toContain('Bottom Side');

    // Switch to bottom side
    const bottomBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Bottom Side')
    );
    expect(bottomBtn).toBeTruthy();

    act(() => {
      bottomBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders TurnkeyCostEstimator and updates costs on tier selection', () => {
    const project = PCBA_ASSEMBLY_CATALOG[0]!;
    act(() => {
      root.render(<TurnkeyCostEstimator project={project} />);
    });

    expect(container.textContent).toContain('Turnkey PCBA Cost Modeling');
    expect(container.textContent).toContain('Total Turnkey Assembly Fee');
    expect(container.textContent).toContain('Standard Prototyping');

    // Select Aerospace tier
    const aeroBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Aerospace & Defence')
    );
    expect(aeroBtn).toBeTruthy();

    act(() => {
      aeroBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(container.textContent).toContain('Effective Assembly Cost Per Board:');
  });

  it('renders AssemblyDetailView with feeder breakdown and EMS partner details', () => {
    const project = PCBA_ASSEMBLY_CATALOG[0]!;
    act(() => {
      root.render(<AssemblyDetailView project={project} />);
    });

    expect(container.textContent).toContain('ArduPilot Autopilot Flight Controller PCBA');
    expect(container.textContent).toContain('SMT Feeder Setup & Packaging Distribution');
    expect(container.textContent).toContain('Total Components');
    expect(container.textContent).toContain('Kaynes Technology India Ltd');
    expect(container.textContent).toContain('Mysore, Karnataka');
    expect(container.textContent).toContain('AS 9100D');
  });
});
