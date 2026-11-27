import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { PLANT_BLUEPRINTS } from './how-to-start-data';
import { HowToStartHub } from './how-to-start-hub';
import { PlantBudgetEstimator } from './plant-budget-estimator';
import { COMPLIANCE_ROADMAPS } from '@/lib/data/compliance-data';
import { PCBA_ASSEMBLY_CATALOG } from '@/lib/data/assembly-data';
import { TESTBED_FACILITIES } from '@/lib/data/testbeds-data';
import sitemap from '@/app/sitemap';

describe('How to Start Manufacturing Blueprints', () => {
  it('contains comprehensive industrial manufacturing blueprints', () => {
    expect(PLANT_BLUEPRINTS.length).toBeGreaterThanOrEqual(7);
    expect(PLANT_BLUEPRINTS).toHaveLength(12);

    const uniqueSlugs = new Set(PLANT_BLUEPRINTS.map((p) => p.slug));
    expect(uniqueSlugs.size).toBe(12);

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

  it('includes the 4 new export-focused & youth-inspiring manufacturing blueprints', () => {
    const medtech = PLANT_BLUEPRINTS.find((p) => p.slug === 'medtech-diagnostics-plant');
    expect(medtech).toBeDefined();
    expect(medtech?.category).toBe('MedTech & Diagnostics');
    expect(medtech?.certificationsAndCompliance.mandatory.some((c) => c.includes('ISO 13485'))).toBe(true);
    expect(medtech?.certificationsAndCompliance.mandatory.some((c) => c.includes('CDSCO'))).toBe(true);

    const solar = PLANT_BLUEPRINTS.find((p) => p.slug === 'solar-inverter-bess-plant');
    expect(solar).toBeDefined();
    expect(solar?.category).toBe('Clean Energy');
    expect(solar?.certificationsAndCompliance.mandatory.some((c) => c.includes('UL 1741'))).toBe(true);

    const textiles = PLANT_BLUEPRINTS.find((p) => p.slug === 'technical-textiles-mill');
    expect(textiles).toBeDefined();
    expect(textiles?.category).toBe('Technical Textiles');
    expect(textiles?.rawMaterialsAndSupplyChain.indianIndustrialClusters.some((c) => c.includes('Surat'))).toBe(true);
    expect(textiles?.rawMaterialsAndSupplyChain.indianIndustrialClusters.some((c) => c.includes('Tiruppur'))).toBe(true);
    expect(textiles?.certificationsAndCompliance.mandatory.some((c) => c.includes('OEKO-TEX'))).toBe(true);

    const agro = PLANT_BLUEPRINTS.find((p) => p.slug === 'agro-food-coldchain-plant');
    expect(agro).toBeDefined();
    expect(agro?.category).toBe('Agro-Processing & Cold Chain');
    expect(agro?.rawMaterialsAndSupplyChain.indianIndustrialClusters.some((c) => c.includes('Coimbatore'))).toBe(true);
    expect(agro?.rawMaterialsAndSupplyChain.indianIndustrialClusters.some((c) => c.includes('Nashik'))).toBe(true);
    expect(agro?.governmentSchemes.some((s) => s.schemeName.includes('PMFME'))).toBe(true);
  });

  it('eliminates the Zero-to-Factory Cliff with Missing-Middle pilot & export links on every blueprint', () => {
    const complianceSlugs = new Set(COMPLIANCE_ROADMAPS.map((r) => r.slug));
    const assemblySlugs = new Set(PCBA_ASSEMBLY_CATALOG.map((a) => a.slug));
    const testbedSlugs = new Set(TESTBED_FACILITIES.map((t) => t.slug));

    for (const plant of PLANT_BLUEPRINTS) {
      expect(plant.estimatorBaseCapExCrores).toBeGreaterThan(0);

      expect(plant.pilotScaleOption).toBeDefined();
      expect(plant.pilotScaleOption?.budgetRangeInr).toBeTruthy();
      expect(plant.pilotScaleOption?.midpointLakhs).toBeGreaterThanOrEqual(5);
      expect(plant.pilotScaleOption?.midpointLakhs).toBeLessThanOrEqual(40);
      expect(plant.pilotScaleOption?.batchSize).toBeTruthy();
      expect(plant.pilotScaleOption?.bridgeModel).toBeTruthy();
      expect(plant.pilotScaleOption?.indianBridgePartners.length).toBeGreaterThan(0);
      expect(plant.pilotScaleOption?.graduationGate).toBeTruthy();

      expect(plant.linkedLabs?.length).toBeGreaterThan(0);
      expect(plant.linkedComplianceSlug).toBeTruthy();
      expect(complianceSlugs.has(plant.linkedComplianceSlug!)).toBe(true);
      if (plant.linkedAssemblySlug) {
        expect(assemblySlugs.has(plant.linkedAssemblySlug)).toBe(true);
      }
      if (plant.linkedTestbedSlug) {
        expect(testbedSlugs.has(plant.linkedTestbedSlug)).toBe(true);
      }

      expect(plant.exportHsCodes?.length).toBeGreaterThan(0);
      expect(plant.exportCorridors?.length).toBeGreaterThan(0);
    }
  });

  it('aligns sitemap dynamically with all 12 blueprints, removes dead URLs, and includes sectors & export corridors', async () => {
    const entries = await sitemap();
    const urls = new Set(entries.map((e) => e.url));

    for (const plant of PLANT_BLUEPRINTS) {
      expect(urls.has(`https://www.hackerland.in/how-to-start/${plant.slug}`)).toBe(true);
    }

    const deadLegacySlugs = [
      'ev-powertrain',
      'aerospace-avionics',
      'iot-sensors',
      'precision-cnc',
      '3d-printing-farm',
    ];
    for (const dead of deadLegacySlugs) {
      expect(urls.has(`https://www.hackerland.in/how-to-start/${dead}`)).toBe(false);
    }

    const requiredNewRoutes = [
      '/sectors',
      '/export',
      '/export/us',
      '/export/eu',
      '/export/uae-gcc',
      '/export/asean',
      '/export/africa',
    ];
    for (const route of requiredNewRoutes) {
      expect(urls.has(`https://www.hackerland.in${route}`)).toBe(true);
    }
  });

  it('renders HowToStartHub and PlantBudgetEstimator with Start-Smaller ladder and all 12 presets', () => {
    const hubHtml = renderToStaticMarkup(React.createElement(HowToStartHub));
    expect(hubHtml).toContain('12 Industries');
    expect(hubHtml).toContain('Start Smaller:');
    expect(hubHtml).toContain('EMS Pilot Batch (₹5L–₹35L)');
    expect(hubHtml).toContain('/sectors');
    expect(hubHtml).toContain('/learn');
    expect(hubHtml).toContain('/manufacturing');
    expect(hubHtml).toContain('/sourcing');
    expect(hubHtml).toContain('/assembly');
    expect(hubHtml).toContain('/compliance');
    expect(hubHtml).toContain('/export');

    const estimatorHtml = renderToStaticMarkup(React.createElement(PlantBudgetEstimator));
    expect(estimatorHtml).toContain('12 Make-In-India Presets');
    expect(estimatorHtml).toContain('EMS / Job-Shop Pilot (₹5L–₹40L)');
    for (const plant of PLANT_BLUEPRINTS) {
      expect(estimatorHtml).toContain(plant.slug);
    }
  });
});
