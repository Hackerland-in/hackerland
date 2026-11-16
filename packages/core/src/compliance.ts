import { z } from 'zod';

export const statutoryBodySchema = z.enum([
  'bis_crs', // Bureau of Indian Standards - Compulsory Registration Scheme
  'bis_isi', // Bureau of Indian Standards - ISI Mark Scheme
  'wpc_eta', // Wireless Planning & Coordination - Equipment Type Approval
  'tec_mtcte', // Telecommunication Engineering Centre - Mandatory Testing
  'dgca_type', // Directorate General of Civil Aviation - Drone Type Certification
  'ais_automotive', // Automotive Industry Standards (ARAI / ICAT)
  'cdsco_med', // Central Drugs Standard Control Organisation - Medical Devices
  'bee_energy', // Bureau of Energy Efficiency - Star Labeling
]);
export type StatutoryBody = z.infer<typeof statutoryBodySchema>;

export const hardwareProductCategorySchema = z.enum([
  'iot_wireless',
  'drone_uav',
  'ev_powertrain',
  'power_adapter',
  'medical_device',
  'telecom_networking',
  'consumer_electronics',
]);
export type HardwareProductCategory = z.infer<typeof hardwareProductCategorySchema>;

export const complianceStandardSchema = z.object({
  code: z.string(),
  name: z.string(),
  body: statutoryBodySchema,
  mandatory: z.boolean(),
  description: z.string(),
  testParameters: z.array(z.string()),
});
export type ComplianceStandard = z.infer<typeof complianceStandardSchema>;

export const testingLabQuoteSchema = z.object({
  labName: z.string(),
  nablAccreditationNo: z.string(),
  city: z.string(),
  state: z.string(),
  estimatedCostInr: z.number(),
  estimatedLeadTimeWeeks: z.number(),
  sampleUnitsRequired: z.number(),
  testsCovered: z.array(z.string()),
});
export type TestingLabQuote = z.infer<typeof testingLabQuoteSchema>;

export const preComplianceChecklistTaskSchema = z.object({
  id: z.string(),
  task: z.string(),
  critical: z.boolean(),
  tip: z.string(),
});
export type PreComplianceChecklistTask = z.infer<typeof preComplianceChecklistTaskSchema>;

export const complianceRoadmapItemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  productCategory: hardwareProductCategorySchema,
  tagline: z.string(),
  description: z.string(),
  statutoryBodies: z.array(statutoryBodySchema),
  applicableStandards: z.array(complianceStandardSchema),
  mandatoryGovtPortals: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
      department: z.string(),
    }),
  ),
  sampleUnitsTotal: z.number(),
  estimatedTotalTestingCostInr: z.object({
    minInr: z.number(),
    maxInr: z.number(),
  }),
  estimatedTimelineWeeks: z.object({
    minWeeks: z.number(),
    maxWeeks: z.number(),
  }),
  penaltiesForNonCompliance: z.string(),
  recommendedLabs: z.array(testingLabQuoteSchema),
  preComplianceChecklist: z.array(preComplianceChecklistTaskSchema),
  documentationRequirements: z.array(z.string()),
});
export type ComplianceRoadmapItem = z.infer<typeof complianceRoadmapItemSchema>;

/**
 * Hardware compliance feature matcher:
 * Takes physical hardware attributes and returns the set of statutory Indian regulations triggered.
 */
export function matchComplianceRequirements(specs: {
  hasWirelessRf: boolean; // Wi-Fi, BLE, LoRa, 4G, sub-GHz
  hasLiIonBattery: boolean; // Li-ion / LiFePO4 cells or pack
  isAutomotiveEv: boolean; // Electric vehicle traction battery
  isDroneUav: boolean; // Unmanned aerial vehicle
  hasMainsAcSmps: boolean; // Plugged into 230V AC mains
  isTelecomModem: boolean; // Cellular gateway / router / optical
  isMedicalBio: boolean; // Patient body contact / diagnostic
}): {
  bodiesTriggered: StatutoryBody[];
  primaryStandards: string[];
  estimatedBaseCostInr: number;
  estimatedTotalWeeks: number;
  sampleUnitsNeeded: number;
} {
  const bodies: StatutoryBody[] = [];
  const standards: string[] = [];
  let cost = 0;
  let weeks = 0;
  let samples = 0;

  if (specs.hasWirelessRf) {
    bodies.push('wpc_eta');
    standards.push('WPC ETA (GSR 564(E) / ETSI EN 300 328 / EN 300 220)');
    cost += 25000;
    weeks = Math.max(weeks, 3);
    samples += 1;
  }

  if (specs.hasLiIonBattery) {
    if (specs.isAutomotiveEv) {
      bodies.push('ais_automotive');
      standards.push('AIS-156 Phase 2 / AIS-038 Rev 2 (EV Thermal Runaway & Ingress)');
      cost += 380000;
      weeks = Math.max(weeks, 10);
      samples += 3;
    } else {
      bodies.push('bis_crs');
      standards.push('BIS IS 16046 (Part 2):2018 (Secondary Li-ion Battery Safety)');
      cost += 140000;
      weeks = Math.max(weeks, 6);
      samples += 25; // cell testing requires destructive batch samples
    }
  }

  if (specs.isDroneUav) {
    bodies.push('dgca_type');
    standards.push('DGCA Drone Rules 2021 (Rule 8 & 9 Type Certification, Form D-1)');
    cost += 450000;
    weeks = Math.max(weeks, 14);
    samples += 2;
  }

  if (specs.hasMainsAcSmps) {
    bodies.push('bis_crs');
    standards.push('BIS IS 13252 (Part 1):2010 (Mains IT Power Adapter Safety)');
    cost += 95000;
    weeks = Math.max(weeks, 5);
    samples += 6;
  }

  if (specs.isTelecomModem) {
    bodies.push('tec_mtcte');
    standards.push('TEC MTCTE Phase III/IV (Telecom Security & Radio Interoperability)');
    cost += 180000;
    weeks = Math.max(weeks, 8);
    samples += 2;
  }

  if (specs.isMedicalBio) {
    bodies.push('cdsco_med');
    standards.push('CDSCO Medical Device Rules 2017 (Class B Device ISO 13485 / IEC 60601)');
    cost += 260000;
    weeks = Math.max(weeks, 12);
    samples += 4;
  }

  // Deduplicate statutory bodies
  const uniqueBodies = Array.from(new Set(bodies));

  return {
    bodiesTriggered: uniqueBodies,
    primaryStandards: standards,
    estimatedBaseCostInr: cost,
    estimatedTotalWeeks: weeks,
    sampleUnitsNeeded: samples,
  };
}

/**
 * Evaluates pre-compliance checklist readiness and identifies critical test-blocking risks.
 */
export function evaluatePreComplianceReadiness(
  checkedTaskIds: string[],
  allTasks: PreComplianceChecklistTask[],
): {
  readinessScore: number; // 0 to 100
  completedCount: number;
  totalCount: number;
  criticalMissing: PreComplianceChecklistTask[];
  status: 'lab_ready' | 'moderate_risk' | 'high_risk_of_failure';
} {
  if (allTasks.length === 0) {
    return {
      readinessScore: 100,
      completedCount: 0,
      totalCount: 0,
      criticalMissing: [],
      status: 'lab_ready',
    };
  }

  const checkedSet = new Set(checkedTaskIds);
  let completed = 0;
  const criticalMissing: PreComplianceChecklistTask[] = [];

  for (const t of allTasks) {
    if (checkedSet.has(t.id)) {
      completed += 1;
    } else if (t.critical) {
      criticalMissing.push(t);
    }
  }

  const readinessScore = Math.round((completed / allTasks.length) * 100);

  let status: 'lab_ready' | 'moderate_risk' | 'high_risk_of_failure' = 'lab_ready';
  if (criticalMissing.length > 0 || readinessScore < 60) {
    status = criticalMissing.length >= 2 ? 'high_risk_of_failure' : 'moderate_risk';
  }

  return {
    readinessScore,
    completedCount: completed,
    totalCount: allTasks.length,
    criticalMissing,
    status,
  };
}

/**
 * Human-format cost in Indian Rupees (₹ Lakhs or thousands).
 */
export function formatComplianceCost(inr: number): string {
  if (inr >= 100000) {
    return `₹${(inr / 100000).toFixed(2)} Lakhs`;
  }
  return `₹${inr.toLocaleString('en-IN')}`;
}
