import { describe, it, expect } from 'vitest';
import { PLANT_BLUEPRINTS } from './how-to-start-data';

describe('How to Start Manufacturing Blueprints', () => {
  it('contains comprehensive industrial manufacturing blueprints', () => {
    expect(PLANT_BLUEPRINTS.length).toBeGreaterThanOrEqual(7);

    for (const plant of PLANT_BLUEPRINTS) {
      expect(plant.slug).toBeTruthy();
      expect(plant.title).toBeTruthy();
      expect(plant.category).toBeTruthy();
      expect(plant.overview).toBeTruthy();
      expect(plant.capitalRequirements.pilotCapEx).toBeTruthy();
      expect(plant.capitalRequirements.commercialCapEx).toBeTruthy();
      expect(plant.capitalRequirements.landSqFt).toBeTruthy();
      expect(plant.machineryList.length).toBeGreaterThanOrEqual(4);
      expect(plant.executionRoadmap.length).toBeGreaterThanOrEqual(4);
      expect(plant.rawMaterialsAndSupplyChain.indianIndustrialClusters.length).toBeGreaterThan(0);
      expect(plant.certificationsAndCompliance.mandatory.length).toBeGreaterThan(0);
      expect(plant.governmentSchemes.length).toBeGreaterThan(0);
    }
  });

  it('includes semiconductor fab & ATMP packaging blueprint', () => {
    const fab = PLANT_BLUEPRINTS.find((p) => p.slug === 'fab-manufacturing');
    expect(fab).toBeDefined();
    expect(fab?.capitalRequirements.cleanroomClass).toContain('ISO');
    expect(fab?.governmentSchemes.some((s) => s.schemeName.includes('Semiconductor'))).toBe(true);
    expect(fab?.machineryList.some((m) => m.name.includes('Wafer Dicing') || m.name.includes('Die Bonder'))).toBe(true);
  });

  it('includes carbon fiber composites hub blueprint', () => {
    const cf = PLANT_BLUEPRINTS.find((p) => p.slug === 'carbon-fiber-hub');
    expect(cf).toBeDefined();
    expect(cf?.machineryList.some((m) => m.name.includes('Autoclave'))).toBe(true);
    expect(cf?.machineryList.some((m) => m.name.includes('Waterjet') || m.name.includes('Prepreg'))).toBe(true);
  });

  it('includes multilayer PCB design and fabrication plant blueprint', () => {
    const pcb = PLANT_BLUEPRINTS.find((p) => p.slug === 'pcb-plant');
    expect(pcb).toBeDefined();
    expect(pcb?.machineryList.some((m) => m.name.includes('Laser Photolithography') || m.name.includes('Etching'))).toBe(true);
    expect(pcb?.certificationsAndCompliance.mandatory).toContain('IPC-A-610 Class 2 & 3');
  });

  it('includes cycle / bicycle manufacturing plant blueprint', () => {
    const cycle = PLANT_BLUEPRINTS.find((p) => p.slug === 'cycle-manufacturing');
    expect(cycle).toBeDefined();
    expect(cycle?.rawMaterialsAndSupplyChain.indianIndustrialClusters).toContain('Ludhiana Industrial Hub (Punjab)');
    expect(cycle?.machineryList.some((m) => m.name.includes('Welding') || m.name.includes('Wheel'))).toBe(true);
    expect(cycle?.certificationsAndCompliance.mandatory).toContain('BIS IS 10613 (Safety requirements for Bicycles)');
  });

  it('includes precision mechanical small cycle parts manufacturing blueprint', () => {
    const parts = PLANT_BLUEPRINTS.find((p) => p.slug === 'precision-mechanical-parts');
    expect(parts).toBeDefined();
    expect(parts?.machineryList.some((m) => m.name.includes('Swiss-Type') || m.name.includes('Hobbing'))).toBe(true);
    expect(parts?.unitEconomics.typicalGrossMargin).toBeTruthy();
  });

  it('includes mobile phone parts and module assembly blueprint', () => {
    const mobile = PLANT_BLUEPRINTS.find((p) => p.slug === 'mobile-parts');
    expect(mobile).toBeDefined();
    expect(mobile?.machineryList.some((m) => m.name.includes('Camera Module') || m.name.includes('Active Alignment'))).toBe(true);
  });

  it('includes researched EV battery pack and aerospace drone facilities', () => {
    const ev = PLANT_BLUEPRINTS.find((p) => p.slug === 'ev-battery-pack');
    expect(ev).toBeDefined();
    expect(ev?.certificationsAndCompliance.mandatory).toContain('AIS-156 (Amendment III for Electric 2W/3W)');

    const drone = PLANT_BLUEPRINTS.find((p) => p.slug === 'drone-aerospace');
    expect(drone).toBeDefined();
    expect(drone?.certificationsAndCompliance.mandatory).toContain('DGCA Type Certification');
  });
});
