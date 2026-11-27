import { z } from 'zod';
import { sectorIdSchema, type SectorId } from './sectors';

export const EXPORT_CORRIDOR_IDS = ['us', 'eu', 'uae_gcc', 'asean', 'africa'] as const;
export type ExportCorridorId = (typeof EXPORT_CORRIDOR_IDS)[number];
export const exportCorridorIdSchema = z.enum(EXPORT_CORRIDOR_IDS);

export const EXPORT_PRODUCT_ARCHETYPES = [
  'iot_wireless',
  'ev_battery_bms',
  'drone_uav',
  'industrial_power_smps',
  'medical_diagnostic',
  'precision_cnc_subassembly',
] as const;
export type ExportProductArchetype = (typeof EXPORT_PRODUCT_ARCHETYPES)[number];
export const exportProductArchetypeSchema = z.enum(EXPORT_PRODUCT_ARCHETYPES);

export const INCOTERMS = ['EXW', 'FCA', 'FOB', 'CIF', 'DAP', 'DDP'] as const;
export type Incoterm = (typeof INCOTERMS)[number];
export const incotermSchema = z.enum(INCOTERMS);

export const SCOMET_RISK_LEVELS = [
  'clear_non_scomet',
  'conditional_screening',
  'restricted_dual_use',
] as const;
export type ScometRiskLevel = (typeof SCOMET_RISK_LEVELS)[number];
export const scometRiskLevelSchema = z.enum(SCOMET_RISK_LEVELS);

export const triggeredStandardSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  authority: z.string().min(1),
  mandatory: z.boolean(),
  notes: z.string().min(1),
});
export type TriggeredStandard = z.infer<typeof triggeredStandardSchema>;

export const exportRegulatoryMappingSchema = z.object({
  corridor: exportCorridorIdSchema,
  corridorLabel: z.string().min(1),
  productArchetype: exportProductArchetypeSchema,
  triggeredStandards: z.array(triggeredStandardSchema).min(1),
  scometStatus: scometRiskLevelSchema,
  scometCategoryCode: z.string().min(1),
  scometRationale: z.string().min(1),
  preCertifiedRfModuleSavings: z.object({
    applicable: z.boolean(),
    estimatedCostSavedUsd: z.number().nonnegative(),
    estimatedWeeksSaved: z.number().nonnegative(),
    notes: z.string().min(1),
  }),
  ilacMraNablCredit: z.object({
    eligible: z.boolean(),
    acceptedTests: z.array(z.string()),
    estimatedCostCreditUsd: z.number().nonnegative(),
    notes: z.string().min(1),
  }),
  estimatedTotalComplianceUsd: z.number().nonnegative(),
  estimatedTimelineWeeks: z.number().nonnegative(),
});
export type ExportRegulatoryMapping = z.infer<typeof exportRegulatoryMappingSchema>;

export const hsnExportProfileSchema = z.object({
  hsnCode: z.string().min(4),
  description: z.string().min(1),
  productArchetype: exportProductArchetypeSchema,
  rodtepRatePercent: z.number().nonnegative(),
  rodtepCapInrPerUnit: z.number().nonnegative().optional(),
  dutyDrawbackRatePercent: z.number().nonnegative(),
  igstRatePercent: z.number().nonnegative(),
  mfnImportDutyByCorridor: z.record(exportCorridorIdSchema, z.number().nonnegative()),
  preferentialFtaDutyByCorridor: z.record(exportCorridorIdSchema, z.number().nonnegative()),
  ftaMinRvcPercentByCorridor: z.record(exportCorridorIdSchema, z.number().nonnegative()),
  scometFlagged: z.boolean(),
  notes: z.string().min(1),
});
export type HsnExportProfile = z.infer<typeof hsnExportProfileSchema>;

export const pliAndExportSchemeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  ministryOrAgency: z.string().min(1),
  category: z.enum([
    'pli_production',
    'export_remission',
    'duty_free_input',
    'market_access_credit',
  ]),
  eligibleSectors: z.array(sectorIdSchema),
  eligibleArchetypes: z.array(exportProductArchetypeSchema),
  incentiveRateSummary: z.string().min(1),
  minimumTurnoverOrInvestmentInr: z.string().min(1),
  keyEligibilityRules: z.array(z.string().min(1)).min(1),
  officialPortal: z.string().min(1),
});
export type PliAndExportScheme = z.infer<typeof pliAndExportSchemeSchema>;

export const oemAuditChecklistItemSchema = z.object({
  id: z.string().min(1),
  category: z.enum([
    'quality_management',
    'ppap_traceability',
    'ip_licensing',
    'supply_chain_resilience',
  ]),
  title: z.string().min(1),
  standardRef: z.string().min(1),
  critical: z.boolean(),
  passed: z.boolean(),
  remediationNote: z.string().min(1),
});
export type OemAuditChecklistItem = z.infer<typeof oemAuditChecklistItemSchema>;

export const CORRIDOR_META: Record<
  ExportCorridorId,
  {
    label: string;
    ftaSchemeName: string | null;
    ftaAvailable: boolean;
    defaultFreightPerShipmentInr: number;
    defaultDestinationLastMilePerUnitInr: number;
    defaultBrokeragePerUnitInr: number;
  }
> = {
  us: {
    label: 'United States (FCC / UL / FDA)',
    ftaSchemeName: null,
    ftaAvailable: false,
    defaultFreightPerShipmentInr: 68000,
    defaultDestinationLastMilePerUnitInr: 340,
    defaultBrokeragePerUnitInr: 180,
  },
  eu: {
    label: 'European Union & UK (CE / UKCA / REACH)',
    ftaSchemeName: null,
    ftaAvailable: false,
    defaultFreightPerShipmentInr: 56000,
    defaultDestinationLastMilePerUnitInr: 290,
    defaultBrokeragePerUnitInr: 165,
  },
  uae_gcc: {
    label: 'UAE & GCC (India-UAE CEPA / TDRA / ECAS)',
    ftaSchemeName: 'India-UAE CEPA',
    ftaAvailable: true,
    defaultFreightPerShipmentInr: 28000,
    defaultDestinationLastMilePerUnitInr: 160,
    defaultBrokeragePerUnitInr: 95,
  },
  asean: {
    label: 'ASEAN Corridor (AIFTA / IMDA / EnterpriseSG)',
    ftaSchemeName: 'ASEAN-India AIFTA',
    ftaAvailable: true,
    defaultFreightPerShipmentInr: 34000,
    defaultDestinationLastMilePerUnitInr: 190,
    defaultBrokeragePerUnitInr: 110,
  },
  africa: {
    label: 'East & Southern Africa (KEBS / SONCAP / AfCFTA Hubs)',
    ftaSchemeName: null,
    ftaAvailable: false,
    defaultFreightPerShipmentInr: 46000,
    defaultDestinationLastMilePerUnitInr: 260,
    defaultBrokeragePerUnitInr: 150,
  },
};

export const HSN_EXPORT_PROFILES: HsnExportProfile[] = [
  {
    hsnCode: '85176290',
    description: 'IoT Wireless Gateways, Telemetry Modems & Connected Electronic Modules',
    productArchetype: 'iot_wireless',
    rodtepRatePercent: 1.0,
    dutyDrawbackRatePercent: 1.5,
    igstRatePercent: 18,
    mfnImportDutyByCorridor: { us: 0, eu: 0, uae_gcc: 5, asean: 5, africa: 10 },
    preferentialFtaDutyByCorridor: { us: 0, eu: 0, uae_gcc: 0, asean: 0, africa: 10 },
    ftaMinRvcPercentByCorridor: { us: 0, eu: 0, uae_gcc: 40, asean: 35, africa: 0 },
    scometFlagged: false,
    notes: 'ITA-1 electronics duty-free in US/EU; UAE CEPA eliminates 5% GCC duty at >=40% VA.',
  },
  {
    hsnCode: '85076000',
    description: 'Lithium-Ion Battery Packs, Smart BMS & Clean Energy Storage Modules',
    productArchetype: 'ev_battery_bms',
    rodtepRatePercent: 1.4,
    dutyDrawbackRatePercent: 1.8,
    igstRatePercent: 18,
    mfnImportDutyByCorridor: { us: 3.4, eu: 2.7, uae_gcc: 5, asean: 10, africa: 15 },
    preferentialFtaDutyByCorridor: { us: 3.4, eu: 2.7, uae_gcc: 0, asean: 2.5, africa: 15 },
    ftaMinRvcPercentByCorridor: { us: 0, eu: 0, uae_gcc: 40, asean: 35, africa: 0 },
    scometFlagged: false,
    notes: 'Requires UN 38.3 and Class 9 Dangerous Goods declaration for air/sea transit.',
  },
  {
    hsnCode: '88062200',
    description: 'Unmanned Aircraft (UAVs) & Commercial Survey / Agri Drone Platforms',
    productArchetype: 'drone_uav',
    rodtepRatePercent: 1.2,
    dutyDrawbackRatePercent: 1.5,
    igstRatePercent: 18,
    mfnImportDutyByCorridor: { us: 0, eu: 2.7, uae_gcc: 5, asean: 7.5, africa: 10 },
    preferentialFtaDutyByCorridor: { us: 0, eu: 2.7, uae_gcc: 0, asean: 0, africa: 10 },
    ftaMinRvcPercentByCorridor: { us: 0, eu: 0, uae_gcc: 40, asean: 35, africa: 0 },
    scometFlagged: true,
    notes: 'Subject to DGFT SCOMET Category 5B/6A007 screening depending on payload, endurance & IMU.',
  },
  {
    hsnCode: '85044090',
    description: 'Industrial SMPS Power Supplies, Inverters & Solar MPPT Controllers',
    productArchetype: 'industrial_power_smps',
    rodtepRatePercent: 1.5,
    dutyDrawbackRatePercent: 1.7,
    igstRatePercent: 18,
    mfnImportDutyByCorridor: { us: 1.5, eu: 3.3, uae_gcc: 5, asean: 10, africa: 12 },
    preferentialFtaDutyByCorridor: { us: 1.5, eu: 3.3, uae_gcc: 0, asean: 0, africa: 12 },
    ftaMinRvcPercentByCorridor: { us: 0, eu: 0, uae_gcc: 40, asean: 35, africa: 0 },
    scometFlagged: false,
    notes: 'Strong RoDTEP + Drawback offset; high demand in UAE/Africa solar & industrial automation.',
  },
  {
    hsnCode: '90181990',
    description: 'Electro-Diagnostic Medical Analyzers, ECG Monitors & POC Devices',
    productArchetype: 'medical_diagnostic',
    rodtepRatePercent: 0.9,
    dutyDrawbackRatePercent: 1.2,
    igstRatePercent: 12,
    mfnImportDutyByCorridor: { us: 0, eu: 0, uae_gcc: 5, asean: 5, africa: 10 },
    preferentialFtaDutyByCorridor: { us: 0, eu: 0, uae_gcc: 0, asean: 0, africa: 10 },
    ftaMinRvcPercentByCorridor: { us: 0, eu: 0, uae_gcc: 40, asean: 35, africa: 0 },
    scometFlagged: false,
    notes: '12% IGST bracket; requires CDSCO Free Sale Certificate and IEC 60601-1 safety report.',
  },
  {
    hsnCode: '84839000',
    description: 'Precision 5-Axis CNC Machined Transmission & Robotics Sub-Assemblies',
    productArchetype: 'precision_cnc_subassembly',
    rodtepRatePercent: 1.8,
    dutyDrawbackRatePercent: 2.0,
    igstRatePercent: 18,
    mfnImportDutyByCorridor: { us: 2.5, eu: 2.7, uae_gcc: 5, asean: 10, africa: 15 },
    preferentialFtaDutyByCorridor: { us: 2.5, eu: 2.7, uae_gcc: 0, asean: 0, africa: 15 },
    ftaMinRvcPercentByCorridor: { us: 0, eu: 0, uae_gcc: 40, asean: 35, africa: 0 },
    scometFlagged: false,
    notes: 'High Indian domestic value addition (>=65%) routinely satisfies UAE CEPA & ASEAN AIFTA RVC.',
  },
];

export interface ExportRegulatoryInput {
  corridor: ExportCorridorId;
  productArchetype: ExportProductArchetype;
  hasWirelessRadio?: boolean;
  usesPreCertifiedRfModule?: boolean;
  hasLithiumBattery?: boolean;
  mainsVoltageAc?: boolean;
  includesEncryptionOrHighPrecisionImu?: boolean;
  hasExistingNablIlacReport?: boolean;
  includeUkcaWithEu?: boolean;
}

function roundTo(val: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(val * factor) / factor;
}

/**
 * Evaluates triggered overseas regulatory standards, DGFT SCOMET dual-use exposure,
 * pre-certified RF module savings, and NABL ILAC-MRA lab report reuse credits.
 */
export function evaluateExportRegulatoryStack(
  input: ExportRegulatoryInput,
): ExportRegulatoryMapping {
  const { corridor, productArchetype } = input;
  const hasWireless =
    input.hasWirelessRadio ??
    (productArchetype === 'iot_wireless' || productArchetype === 'drone_uav');
  const usesPreCertifiedRf = input.usesPreCertifiedRfModule ?? false;
  const hasLithium =
    input.hasLithiumBattery ??
    (productArchetype === 'ev_battery_bms' || productArchetype === 'drone_uav');
  const mainsAc =
    input.mainsVoltageAc ??
    (productArchetype === 'industrial_power_smps' || productArchetype === 'medical_diagnostic');
  const dualUseFlag = input.includesEncryptionOrHighPrecisionImu ?? false;
  const hasNablIlac = input.hasExistingNablIlacReport ?? false;
  const includeUkca = input.includeUkcaWithEu ?? true;

  const standards: TriggeredStandard[] = [];
  let baseCostUsd = 0;
  let timelineWeeks = 3;

  // Environmental & chemical compliance baseline across global electronics/machined assemblies
  if (corridor === 'eu') {
    standards.push(
      {
        code: 'RoHS 3 (2015/863/EU)',
        name: 'Restriction of Hazardous Substances Directive',
        authority: 'European Commission',
        mandatory: true,
        notes: 'Requires SAC305 lead-free soldering and RoHS DoC + supplier material declarations.',
      },
      {
        code: 'REACH (EC 1907/2006)',
        name: 'SVHC Chemical Substances Disclosure',
        authority: 'ECHA (European Chemicals Agency)',
        mandatory: true,
        notes: 'Verify <0.1% w/w Substances of Very High Concern in plastics, platings, and cables.',
      },
      {
        code: 'WEEE (2012/19/EU)',
        name: 'Waste Electrical and Electronic Equipment Registration',
        authority: 'EU Member State National Registries',
        mandatory: productArchetype !== 'precision_cnc_subassembly',
        notes: 'Crossed-out wheeled bin marking + authorized EU producer responsibility registration.',
      },
    );
    baseCostUsd += 950;
  } else if (corridor === 'uae_gcc') {
    standards.push({
      code: 'RoHS 3 (UAE Cabinet Decision 10/2017)',
      name: 'UAE RoHS Hazardous Substance Compliance',
      authority: 'MoIAT (Ministry of Industry & Advanced Technology)',
      mandatory: true,
      notes: 'Mandatory RoHS technical file uploaded to MoIAT portal for ECAS clearance.',
    });
    baseCostUsd += 650;
  } else if (corridor === 'us' || corridor === 'asean' || corridor === 'africa') {
    standards.push({
      code: 'RoHS 3 / Material Declaration',
      name: 'Lead-Free & Hazardous Material Compliance',
      authority: 'Global Tier-1 / Customs Compliance',
      mandatory: productArchetype !== 'precision_cnc_subassembly',
      notes: 'Standard RoHS 3 CoC + California Prop 65 / TSCA check for US shipments.',
    });
    baseCostUsd += 550;
  }

  // Corridor-specific RF, EMC, Safety, Medical, UAV rules
  if (corridor === 'us') {
    if (productArchetype !== 'precision_cnc_subassembly') {
      standards.push({
        code: 'FCC Part 15B',
        name: 'Unintentional Radiator Digital Emissions (SDoC / Class A or B)',
        authority: 'US Federal Communications Commission',
        mandatory: true,
        notes: 'Covers all digital clocks >9 kHz including MCU/SMPS boards.',
      });
      baseCostUsd += 2600;
      timelineWeeks = Math.max(timelineWeeks, 5);
    }
    if (hasWireless) {
      standards.push({
        code: 'FCC Part 15C',
        name: 'Intentional Radiator RF Transceiver Certification (2.4 GHz / Sub-GHz)',
        authority: 'US FCC / TCB',
        mandatory: true,
        notes: usesPreCertifiedRf
          ? 'Permissive host verification only using modular FCC ID (saves full intentional RF scan).'
          : 'Full TCB RF spurious, PSD, and SAR/MPE lab testing required for chip-down layout.',
      });
      baseCostUsd += usesPreCertifiedRf ? 1400 : 6900;
      timelineWeeks = Math.max(timelineWeeks, usesPreCertifiedRf ? 5 : 11);
    }
    if (mainsAc || productArchetype === 'iot_wireless') {
      standards.push({
        code: 'UL 62368-1',
        name: 'Audio/Video, IT & Communication Equipment Electrical Safety',
        authority: 'UL / NRTL (Intertek ETL / TÜV)',
        mandatory: mainsAc,
        notes: 'NRTL listing or CB report required by US industrial buyers and Amazon retail.',
      });
      baseCostUsd += mainsAc ? 5200 : 1800;
      timelineWeeks = Math.max(timelineWeeks, 8);
    }
    if (hasLithium) {
      standards.push({
        code: 'UL 2580 / UL 2054',
        name: 'EV & Portable Lithium Battery Pack Safety Standard',
        authority: 'UL / NRTL',
        mandatory: productArchetype === 'ev_battery_bms',
        notes: 'Covers crush, short-circuit, overcharge, and BMS functional safety.',
      });
      baseCostUsd += 7800;
      timelineWeeks = Math.max(timelineWeeks, 12);
    }
    if (productArchetype === 'drone_uav') {
      standards.push({
        code: 'FAA Remote ID (14 CFR Part 89)',
        name: 'Standard Remote Identification Broadcast Compliance',
        authority: 'US Federal Aviation Administration',
        mandatory: true,
        notes: 'Requires ASTM F3411 Wi-Fi/BLE broadcast Declaration of Compliance.',
      });
      baseCostUsd += 2900;
      timelineWeeks = Math.max(timelineWeeks, 8);
    }
    if (productArchetype === 'medical_diagnostic') {
      standards.push({
        code: 'FDA 510(k) & 21 CFR 820 (QMSR)',
        name: 'US FDA Premarket Clearance & Medical Quality System',
        authority: 'US Food and Drug Administration',
        mandatory: true,
        notes: 'Predicate equivalence dossier + IEC 60601-1/1-2 safety & EMC test reports.',
      });
      baseCostUsd += 16500;
      timelineWeeks = Math.max(timelineWeeks, 24);
    }
  } else if (corridor === 'eu') {
    if (productArchetype !== 'precision_cnc_subassembly') {
      standards.push({
        code: 'CE EMC (2014/30/EU)',
        name: 'European Electromagnetic Compatibility Directive (EN 55032 / EN 61000)',
        authority: 'European Union CE',
        mandatory: !hasWireless,
        notes: 'Radiated/conducted emissions and ESD/surge immunity compliance.',
      });
      baseCostUsd += hasWireless ? 0 : 3100;
      timelineWeeks = Math.max(timelineWeeks, 6);
    }
    if (hasWireless) {
      standards.push({
        code: 'CE RED (2014/53/EU)',
        name: 'Radio Equipment Directive (EN 300 328 / EN 301 489)',
        authority: 'EU Notified Body',
        mandatory: true,
        notes: usesPreCertifiedRf
          ? 'Leverages pre-certified RF module test suite; host EMC + LVD safety verification only.'
          : 'Full RED Article 3.1/3.2 RF spectrum + EMC + cybersecurity assessment required.',
      });
      baseCostUsd += usesPreCertifiedRf ? 2400 : 7900;
      timelineWeeks = Math.max(timelineWeeks, usesPreCertifiedRf ? 6 : 12);
    }
    if (mainsAc) {
      standards.push({
        code: 'CE LVD (2014/35/EU - EN 62368-1)',
        name: 'Low Voltage Electrical Safety Directive',
        authority: 'European Union CE',
        mandatory: true,
        notes: 'Applies to AC/DC equipment >=50V AC / 75V DC and safety-critical adapters.',
      });
      baseCostUsd += 3600;
      timelineWeeks = Math.max(timelineWeeks, 7);
    }
    if (includeUkca && productArchetype !== 'precision_cnc_subassembly') {
      standards.push({
        code: 'UKCA (SI 2017/1206 / SI 2016/1091)',
        name: 'UK Conformity Assessed Marking (Great Britain)',
        authority: 'UK OPSS / Approved Body',
        mandatory: false,
        notes: 'Recognizes CE test data cleanly when UK Declaration of Conformity is bundled.',
      });
      baseCostUsd += 750;
    }
    if (productArchetype === 'drone_uav') {
      standards.push({
        code: 'EASA Open/Specific (EU 2019/945)',
        name: 'European Drone Class Identification & Direct Remote ID',
        authority: 'EASA',
        mandatory: true,
        notes: 'Requires geo-awareness, low-noise dB declaration, and EASA Remote ID.',
      });
      baseCostUsd += 4200;
      timelineWeeks = Math.max(timelineWeeks, 10);
    }
    if (productArchetype === 'medical_diagnostic') {
      standards.push({
        code: 'EU MDR (2017/745)',
        name: 'European Medical Device Regulation (Class IIa/IIb)',
        authority: 'EU Notified Body (BSI / TÜV SÜD)',
        mandatory: true,
        notes: 'Requires ISO 13485 QMS, Clinical Evaluation Report (CER), and EUDAMED UDI.',
      });
      baseCostUsd += 18500;
      timelineWeeks = Math.max(timelineWeeks, 26);
    }
  } else if (corridor === 'uae_gcc') {
    standards.push({
      code: 'UAE ECAS / G-Mark (GSO)',
      name: 'Emirates Conformity Assessment Scheme & GCC Technical Regulation',
      authority: 'MoIAT UAE / GSO',
      mandatory: productArchetype !== 'precision_cnc_subassembly',
      notes: 'Annual ECAS Certificate of Conformity using CB / NABL ILAC-MRA reports.',
    });
    baseCostUsd += 2200;
    timelineWeeks = Math.max(timelineWeeks, 5);

    if (hasWireless) {
      standards.push({
        code: 'UAE TDRA Type Approval',
        name: 'Telecommunications & Digital Government Regulatory Authority Radio Permit',
        authority: 'UAE TDRA',
        mandatory: true,
        notes: usesPreCertifiedRf
          ? 'Streamlined TDRA registration via modular CE RED report.'
          : 'Requires full RF test reports (EN 300 328 / FCC) + local UAE importer registration.',
      });
      baseCostUsd += usesPreCertifiedRf ? 1200 : 3400;
      timelineWeeks = Math.max(timelineWeeks, 6);
    }
    if (productArchetype === 'medical_diagnostic') {
      standards.push({
        code: 'UAE MOHAP Medical Device Registration',
        name: 'Ministry of Health & Prevention Device Clearance',
        authority: 'UAE MOHAP',
        mandatory: true,
        notes: 'Expedited when product already holds CDSCO Free Sale + CE MDR or FDA 510(k).',
      });
      baseCostUsd += 3800;
      timelineWeeks = Math.max(timelineWeeks, 12);
    }
    if (productArchetype === 'drone_uav') {
      standards.push({
        code: 'UAE GCAA Unmanned Aircraft Clearance',
        name: 'General Civil Aviation Authority Drone Compliance',
        authority: 'UAE GCAA',
        mandatory: true,
        notes: 'Commercial geo-fencing and operator registration required before field import.',
      });
      baseCostUsd += 2500;
    }
  } else if (corridor === 'asean') {
    if (hasWireless) {
      standards.push({
        code: 'IMDA Type Approval (Singapore)',
        name: 'Info-communications Media Development Authority Short-Range Radio Approval',
        authority: 'IMDA Singapore (plus SIRIM MY / NBTC TH)',
        mandatory: true,
        notes: usesPreCertifiedRf
          ? 'Simplified Declaration of Conformity using modular CE/FCC RF test report.'
          : 'Equipment registration requiring EN/FCC RF spectrum & SAR reports.',
      });
      baseCostUsd += usesPreCertifiedRf ? 950 : 2800;
      timelineWeeks = Math.max(timelineWeeks, 5);
    }
    if (mainsAc) {
      standards.push({
        code: 'CPSO SAFETY Mark (Singapore)',
        name: 'EnterpriseSG Consumer Protection Safety Registration',
        authority: 'Enterprise Singapore',
        mandatory: true,
        notes: 'Requires CB Test Certificate (IEC 62368-1 / IEC 60335) from CBTL/NABL partner.',
      });
      baseCostUsd += 2400;
      timelineWeeks = Math.max(timelineWeeks, 6);
    }
    if (productArchetype === 'medical_diagnostic') {
      standards.push({
        code: 'HSA Medical Device Registration',
        name: 'Health Sciences Authority / ASEAN MDD Listing',
        authority: 'HSA Singapore',
        mandatory: true,
        notes: 'Class B/C expedited route with ISO 13485 and IEC 60601-1 test pack.',
      });
      baseCostUsd += 4200;
      timelineWeeks = Math.max(timelineWeeks, 14);
    }
    if (productArchetype === 'drone_uav') {
      standards.push({
        code: 'CAAS Unmanned Aircraft Permit',
        name: 'Civil Aviation Authority of Singapore UAS Compliance',
        authority: 'CAAS',
        mandatory: true,
        notes: 'Operator and airframe safety dossier needed for commercial flights.',
      });
      baseCostUsd += 2100;
    }
  } else if (corridor === 'africa') {
    standards.push({
      code: 'KEBS PVoC / SONCAP',
      name: 'Kenya Bureau of Standards Pre-Export Verification of Conformity (plus SONCAP NG)',
      authority: 'KEBS / Intertek / SGS Inspection',
      mandatory: true,
      notes: 'Pre-shipment Certificate of Conformity (CoC) verified via NABL/ILAC lab report at port.',
    });
    baseCostUsd += 1650;
    timelineWeeks = Math.max(timelineWeeks, 4);

    if (hasWireless) {
      standards.push({
        code: 'CAK / ICASA Type Approval',
        name: 'Communications Authority of Kenya & South Africa ICASA Radio Approval',
        authority: 'CAK / ICASA',
        mandatory: true,
        notes: 'Accepts CE RED / FCC RF reports with local authorized representative filing.',
      });
      baseCostUsd += usesPreCertifiedRf ? 1100 : 2400;
      timelineWeeks = Math.max(timelineWeeks, 6);
    }
    if (productArchetype === 'medical_diagnostic') {
      standards.push({
        code: 'Kenya PPB / SAHPRA Medical Device Listing',
        name: 'National Medical Device Import Authorization',
        authority: 'PPB Kenya / SAHPRA ZA',
        mandatory: true,
        notes: 'Requires ISO 13485, CDSCO Free Sale Certificate, and IEC 60601-1 report.',
      });
      baseCostUsd += 2800;
      timelineWeeks = Math.max(timelineWeeks, 10);
    }
  }

  // UN 38.3 for lithium batteries across every air/sea corridor
  if (hasLithium) {
    standards.push({
      code: 'UN 38.3',
      name: 'UN Manual of Tests & Criteria (Section 38.3) Lithium Battery Transport',
      authority: 'IATA DGR / IMDG / PHMSA',
      mandatory: true,
      notes: '8 mandatory safety tests (altitude, thermal, vibration, shock, short-circuit, crush) + Test Summary.',
    });
    baseCostUsd += 3800;
    timelineWeeks = Math.max(timelineWeeks, 8);
  }

  if (productArchetype === 'precision_cnc_subassembly' && corridor !== 'eu') {
    standards.push({
      code: 'EN 10204 3.1 / PPAP Level 3',
      name: 'Material Mill Test Certificate & Dimensional Control Plan',
      authority: 'Global Tier-1 OEM Qualification',
      mandatory: true,
      notes: 'Batch metallurgical CoA + CMM dimensional inspection report for every export crate.',
    });
    baseCostUsd += 900;
  }

  // SCOMET Dual-Use Screening (DGFT Appendix 3 Schedule 2)
  let scometStatus: ScometRiskLevel = 'clear_non_scomet';
  let scometCategoryCode = 'Non-SCOMET (General Industrial / Commercial Goods)';
  let scometRationale =
    'Standard commercial hardware below DGFT dual-use thresholds; file standard Non-SCOMET technical self-declaration in ICEGATE.';

  if (productArchetype === 'drone_uav' && dualUseFlag) {
    scometStatus = 'restricted_dual_use';
    scometCategoryCode = 'SCOMET Category 5B / 6A007 (UAV & Tactical Inertial Navigation)';
    scometRationale =
      'High-precision tactical IMU, encrypted long-range radio, or autonomous BVLOS UAV systems trigger mandatory DGFT SCOMET export licensing before customs Let Export Order.';
  } else if (productArchetype === 'drone_uav' || dualUseFlag) {
    scometStatus = 'conditional_screening';
    scometCategoryCode =
      productArchetype === 'drone_uav'
        ? 'SCOMET Category 5B Screening (Commercial Sub-2kg / <30 min Endurance Check)'
        : 'SCOMET Category 5A2 / 6A Screening (Encryption / High-Spec Sensor Check)';
    scometRationale =
      'Requires formal technical parameter matrix (payload mass, endurance, encryption key length, IMU bias stability) confirming exemption or GAED clearance prior to dispatch.';
  } else if (productArchetype === 'precision_cnc_subassembly') {
    scometStatus = 'conditional_screening';
    scometCategoryCode = 'SCOMET Category 1C / 2B Screening (End-User & Aerospace Alloy Check)';
    scometRationale =
      'Precision 5-axis machined aerospace/nuclear tolerances require buyer End-User Statement (EUS) confirming non-military, non-nuclear commercial use.';
  }

  // Pre-certified RF Module Savings
  const rfSavings = hasWireless
    ? usesPreCertifiedRf
      ? {
          applicable: true,
          estimatedCostSavedUsd: 5500,
          estimatedWeeksSaved: 6,
          notes:
            'Using an FCC/CE/WPC pre-certified RF module avoids full intentional-radiator spurious & DFS lab sweeps, cutting certification cost ~$5,500 and timeline by ~6 weeks.',
        }
      : {
          applicable: true,
          estimatedCostSavedUsd: 0,
          estimatedWeeksSaved: 0,
          notes:
            'Chip-down RF layout incurs full intentional radiator testing. Switching to a pre-certified module (e.g., ESP32-S3-WROOM / nRF9160 SiP) saves ~$5,500 and 6 weeks.',
        }
    : {
        applicable: false,
        estimatedCostSavedUsd: 0,
        estimatedWeeksSaved: 0,
        notes: 'No intentional RF transceiver present; wireless modular certification savings not applicable.',
      };

  // ILAC-MRA NABL Lab Report Reuse Credit
  const acceptedTests: string[] = [];
  if (productArchetype !== 'precision_cnc_subassembly') {
    acceptedTests.push('CISPR 32 / EN 55032 Radiated & Conducted EMC');
  }
  if (mainsAc || productArchetype === 'medical_diagnostic') {
    acceptedTests.push(
      productArchetype === 'medical_diagnostic'
        ? 'IEC 60601-1 Patient Electrical Safety (CB Scheme)'
        : 'IEC 62368-1 Electrical Safety (CB Scheme)',
    );
  }
  if (hasLithium) {
    acceptedTests.push('UN 38.3 Lithium Transport & Abuse Testing');
  }

  const eligibleForIlacCredit = acceptedTests.length > 0 && hasNablIlac;
  const potentialIlacCreditUsd = roundTo(baseCostUsd * 0.35, 0);
  const ilacCreditUsd = eligibleForIlacCredit ? potentialIlacCreditUsd : 0;

  const ilacMraNablCredit = {
    eligible: eligibleForIlacCredit,
    acceptedTests,
    estimatedCostCreditUsd: ilacCreditUsd,
    notes: eligibleForIlacCredit
      ? `Existing NABL ILAC-MRA lab reports (e.g., ERTL/ETDC/TÜV/UL India) waive duplicate foreign lab testing, saving ~$${ilacCreditUsd.toLocaleString('en-US')}.`
      : acceptedTests.length > 0
        ? `Testing first at an Indian ILAC-MRA NABL lab unlocks ~$${potentialIlacCreditUsd.toLocaleString('en-US')} in foreign re-test fee avoidance via mutual recognition.`
        : 'Mechanical sub-assemblies rely on EN 10204 3.1 mill certificates & NABL CMM calibration rather than EMC/safety chambers.',
  };

  const netComplianceUsd = Math.max(0, roundTo(baseCostUsd - ilacCreditUsd, 0));

  return {
    corridor,
    corridorLabel: CORRIDOR_META[corridor].label,
    productArchetype,
    triggeredStandards: standards,
    scometStatus,
    scometCategoryCode,
    scometRationale,
    preCertifiedRfModuleSavings: rfSavings,
    ilacMraNablCredit,
    estimatedTotalComplianceUsd: netComplianceUsd,
    estimatedTimelineWeeks: timelineWeeks,
  };
}

export interface ExportUnitEconomicsInput {
  corridor: ExportCorridorId;
  productArchetype?: ExportProductArchetype;
  bomCostInr: number;
  manufacturingAndQaCostInr: number;
  packagingAndExportPrepInr?: number;
  exWorksPriceInr?: number;
  targetExWorksMarkupPercent?: number;
  quantity?: number;
  exchangeRateInrPerUsd?: number;
  inlandLogisticsAndChaPerShipmentInr?: number;
  portHandlingAndThcPerShipmentInr?: number;
  internationalFreightPerShipmentInr?: number;
  marineInsuranceRatePercent?: number;
  destinationClearanceAndLastMilePerUnitInr?: number;
  domesticValueAddPercent: number;
  rodtepRatePercent?: number;
  dutyDrawbackRatePercent?: number;
  igstRatePercent?: number;
  mfnImportDutyPercent?: number;
  preferentialFtaDutyPercent?: number;
  ftaMinRvcPercent?: number;
  usePreferentialFta?: boolean;
  usingAdvanceAuthorization?: boolean;
  targetRetailMsrpUsd?: number;
}

export interface IncotermWaterfallStep {
  incoterm: Incoterm;
  label: string;
  inrPerUnit: number;
  usdPerUnit: number;
  totalBatchInr: number;
  totalBatchUsd: number;
  addedCostPerUnitInr: number;
}

export interface ExportUnitEconomicsResult {
  corridor: ExportCorridorId;
  corridorLabel: string;
  hsnCode: string;
  quantity: number;
  exchangeRateInrPerUsd: number;
  unitProductionCostInr: number;
  exWorksPriceInr: number;
  incotermWaterfall: IncotermWaterfallStep[];
  exwInr: number;
  fcaInr: number;
  fobInr: number;
  cifInr: number;
  dapInr: number;
  ddpInr: number;
  exwUsd: number;
  fcaUsd: number;
  fobUsd: number;
  cifUsd: number;
  dapUsd: number;
  ddpUsd: number;
  rodtepCreditInr: number;
  dutyDrawbackInr: number;
  igstWorkingCapitalSavedInr: number;
  /** Net effective Ex-Works realization per unit (EXW Selling Price + RoDTEP + Duty Drawback credits). */
  netEffectiveExWorksInr: number;
  /** Net effective Ex-Works manufacturing cost per unit (Production COGS - RoDTEP - Duty Drawback credits). */
  netEffectiveExWorksCostInr: number;
  ftaCheck: {
    ftaApplicable: boolean;
    ftaSchemeName: string;
    domesticValueAddPercent: number;
    minRvcThresholdPercent: number;
    eligible: boolean;
    mfnDutyPercent: number;
    preferentialFtaDutyPercent: number;
    appliedDutyPercent: number;
    mfnDutyPerUnitInr: number;
    appliedDutyPerUnitInr: number;
    ftaDutyDeltaPerUnitInr: number;
    ftaDutyDeltaPerUnitUsd: number;
  };
  grossMarginPercent: number;
  grossMarginWithoutIncentivesPercent: number;
  targetRetailMsrpUsd: number;
  msrpMultiplier: number;
  warningFlags: string[];
}

/**
 * Computes full Indian export Incoterm waterfall (EXW -> FCA -> FOB -> CIF -> DAP -> DDP),
 * RoDTEP/Duty Drawback/IGST LUT credits, FTA RVC duty savings (UAE CEPA / ASEAN AIFTA),
 * gross margin %, MSRP multiplier, and actionable unit-economics warnings.
 */
export function calculateExportUnitEconomics(
  input: ExportUnitEconomicsInput,
): ExportUnitEconomicsResult {
  const archetype = input.productArchetype ?? 'iot_wireless';
  const hsnProfile =
    HSN_EXPORT_PROFILES.find((h) => h.productArchetype === archetype) ?? HSN_EXPORT_PROFILES[0]!;
  const corridorMeta = CORRIDOR_META[input.corridor];

  const qty = Math.max(1, Math.round(input.quantity ?? 500));
  const fx = Math.max(1, input.exchangeRateInrPerUsd ?? 84.5);
  const packagingInr = Math.max(0, input.packagingAndExportPrepInr ?? 120);
  const unitProductionCostInr = roundTo(
    Math.max(0, input.bomCostInr) + Math.max(0, input.manufacturingAndQaCostInr) + packagingInr,
  );

  const markupPct = input.targetExWorksMarkupPercent ?? 35;
  const exWorksPriceInr = roundTo(
    input.exWorksPriceInr ?? unitProductionCostInr * (1 + markupPct / 100),
  );

  const inlandAndChaPerUnit =
    Math.max(0, input.inlandLogisticsAndChaPerShipmentInr ?? 18500) / qty;
  const portThcPerUnit = Math.max(0, input.portHandlingAndThcPerShipmentInr ?? 14000) / qty;
  const freightPerUnit =
    Math.max(0, input.internationalFreightPerShipmentInr ?? corridorMeta.defaultFreightPerShipmentInr) /
    qty;

  const exwInr = roundTo(exWorksPriceInr);
  const fcaInr = roundTo(exwInr + inlandAndChaPerUnit);
  const fobInr = roundTo(fcaInr + portThcPerUnit);

  const marineInsuranceRate = Math.max(0, input.marineInsuranceRatePercent ?? 0.35) / 100;
  // Standard marine insurance assessed at 110% of (FOB + Freight)
  const cfrInr = fobInr + freightPerUnit;
  const insurancePerUnit = cfrInr * 1.1 * marineInsuranceRate;
  const cifInr = roundTo(cfrInr + insurancePerUnit);

  const destinationLastMile = Math.max(
    0,
    input.destinationClearanceAndLastMilePerUnitInr ??
      corridorMeta.defaultDestinationLastMilePerUnitInr,
  );
  const dapInr = roundTo(cifInr + destinationLastMile);

  // FTA Regional Value Content (RVC) check
  const mfnDutyPercent =
    input.mfnImportDutyPercent ?? hsnProfile.mfnImportDutyByCorridor[input.corridor];
  const prefDutyPercent =
    input.preferentialFtaDutyPercent ?? hsnProfile.preferentialFtaDutyByCorridor[input.corridor];
  const minRvcThreshold =
    input.ftaMinRvcPercent ?? hsnProfile.ftaMinRvcPercentByCorridor[input.corridor];

  const domesticVa = Math.min(100, Math.max(0, input.domesticValueAddPercent));
  const ftaEligible = corridorMeta.ftaAvailable && domesticVa >= minRvcThreshold;
  const applyFta = ftaEligible && (input.usePreferentialFta ?? true);
  const appliedDutyPercent = applyFta ? prefDutyPercent : mfnDutyPercent;

  const mfnDutyPerUnitInr = roundTo(cifInr * (mfnDutyPercent / 100));
  const appliedDutyPerUnitInr = roundTo(cifInr * (appliedDutyPercent / 100));
  const ftaDutyDeltaPerUnitInr = roundTo(Math.max(0, mfnDutyPerUnitInr - appliedDutyPerUnitInr));
  const ftaDutyDeltaPerUnitUsd = roundTo(ftaDutyDeltaPerUnitInr / fx);

  const ddpInr = roundTo(dapInr + appliedDutyPerUnitInr + corridorMeta.defaultBrokeragePerUnitInr);

  const exwUsd = roundTo(exwInr / fx);
  const fcaUsd = roundTo(fcaInr / fx);
  const fobUsd = roundTo(fobInr / fx);
  const cifUsd = roundTo(cifInr / fx);
  const dapUsd = roundTo(dapInr / fx);
  const ddpUsd = roundTo(ddpInr / fx);

  const incotermWaterfall: IncotermWaterfallStep[] = [
    {
      incoterm: 'EXW',
      label: 'Ex Works (Indian Factory Gate)',
      inrPerUnit: exwInr,
      usdPerUnit: exwUsd,
      totalBatchInr: roundTo(exwInr * qty),
      totalBatchUsd: roundTo(exwUsd * qty),
      addedCostPerUnitInr: 0,
    },
    {
      incoterm: 'FCA',
      label: 'Free Carrier (Cleared at ICD / Origin Hub)',
      inrPerUnit: fcaInr,
      usdPerUnit: fcaUsd,
      totalBatchInr: roundTo(fcaInr * qty),
      totalBatchUsd: roundTo(fcaUsd * qty),
      addedCostPerUnitInr: roundTo(fcaInr - exwInr),
    },
    {
      incoterm: 'FOB',
      label: 'Free On Board (Loaded at Nhava Sheva / BLR Air Cargo)',
      inrPerUnit: fobInr,
      usdPerUnit: fobUsd,
      totalBatchInr: roundTo(fobInr * qty),
      totalBatchUsd: roundTo(fobUsd * qty),
      addedCostPerUnitInr: roundTo(fobInr - fcaInr),
    },
    {
      incoterm: 'CIF',
      label: 'Cost, Insurance & Freight (Destination Port)',
      inrPerUnit: cifInr,
      usdPerUnit: cifUsd,
      totalBatchInr: roundTo(cifInr * qty),
      totalBatchUsd: roundTo(cifUsd * qty),
      addedCostPerUnitInr: roundTo(cifInr - fobInr),
    },
    {
      incoterm: 'DAP',
      label: 'Delivered At Place (Buyer Warehouse Pre-Duty)',
      inrPerUnit: dapInr,
      usdPerUnit: dapUsd,
      totalBatchInr: roundTo(dapInr * qty),
      totalBatchUsd: roundTo(dapUsd * qty),
      addedCostPerUnitInr: roundTo(dapInr - cifInr),
    },
    {
      incoterm: 'DDP',
      label: 'Delivered Duty Paid (Cleared to Overseas Buyer Door)',
      inrPerUnit: ddpInr,
      usdPerUnit: ddpUsd,
      totalBatchInr: roundTo(ddpInr * qty),
      totalBatchUsd: roundTo(ddpUsd * qty),
      addedCostPerUnitInr: roundTo(ddpInr - dapInr),
    },
  ];

  // Export Remission & Working Capital Incentives
  const rodtepRate = Math.max(0, input.rodtepRatePercent ?? hsnProfile.rodtepRatePercent);
  const rawRodtep = fobInr * (rodtepRate / 100);
  const rodtepCreditInr = roundTo(
    hsnProfile.rodtepCapInrPerUnit !== undefined
      ? Math.min(rawRodtep, hsnProfile.rodtepCapInrPerUnit)
      : rawRodtep,
  );

  // Under CBIC rules, standard All Industry Rate (AIR) Duty Drawback cannot be double-claimed alongside Advance Authorization on identical inputs
  const dbkRate = input.usingAdvanceAuthorization
    ? 0
    : Math.max(0, input.dutyDrawbackRatePercent ?? hsnProfile.dutyDrawbackRatePercent);
  const dutyDrawbackInr = roundTo(fobInr * (dbkRate / 100));

  const igstRate = Math.max(0, input.igstRatePercent ?? hsnProfile.igstRatePercent);
  const igstWorkingCapitalSavedInr = roundTo(exwInr * (igstRate / 100));

  const netEffectiveExWorksInr = roundTo(exwInr + rodtepCreditInr + dutyDrawbackInr);
  const netEffectiveExWorksCostInr = roundTo(
    Math.max(0, unitProductionCostInr - rodtepCreditInr - dutyDrawbackInr),
  );

  const grossMarginWithoutIncentivesPercent =
    exwInr > 0 ? roundTo(((exwInr - unitProductionCostInr) / exwInr) * 100) : 0;
  const grossMarginPercent =
    netEffectiveExWorksInr > 0
      ? roundTo(((netEffectiveExWorksInr - unitProductionCostInr) / netEffectiveExWorksInr) * 100)
      : 0;

  const productionCostUsd = Math.max(0.01, unitProductionCostInr / fx);
  const targetRetailMsrpUsd = roundTo(input.targetRetailMsrpUsd ?? ddpUsd * 2.5);
  const msrpMultiplier = roundTo(targetRetailMsrpUsd / productionCostUsd);

  const warningFlags: string[] = [];
  if (grossMarginPercent < 20) {
    warningFlags.push(
      `Low export gross margin (${grossMarginPercent}%): below 20% leaves minimal buffer for FX swings or warranty returns.`,
    );
  }
  if (msrpMultiplier < 2.5) {
    warningFlags.push(
      `MSRP-to-COGS multiplier (${msrpMultiplier}x) is below 2.5x — retail/distributor channels typically require 3x–4x after DDP freight and duties.`,
    );
  }
  if (corridorMeta.ftaAvailable && !ftaEligible) {
    warningFlags.push(
      `FTA RVC shortfall: ${domesticVa}% Indian value addition is below ${minRvcThreshold}% ${corridorMeta.ftaSchemeName} threshold — buyer pays ${mfnDutyPercent}% MFN duty instead of ${prefDutyPercent}%.`,
    );
  }
  if (exwInr > 0 && (ddpInr - exwInr) / exwInr > 0.35) {
    warningFlags.push(
      `High export logistics drag: freight, CHA, and destination duties add ${roundTo(((ddpInr - exwInr) / exwInr) * 100)}% above EXW. Consider consolidating batch MOQ >= ${Math.max(qty * 2, 1000)} units.`,
    );
  }
  if (input.usingAdvanceAuthorization && (input.dutyDrawbackRatePercent ?? 0) > 0) {
    warningFlags.push(
      'Advance Authorization selected: standard AIR Duty Drawback is zeroed to prevent CBIC double-claim disallowance.',
    );
  }

  return {
    corridor: input.corridor,
    corridorLabel: corridorMeta.label,
    hsnCode: hsnProfile.hsnCode,
    quantity: qty,
    exchangeRateInrPerUsd: fx,
    unitProductionCostInr,
    exWorksPriceInr: exwInr,
    incotermWaterfall,
    exwInr,
    fcaInr,
    fobInr,
    cifInr,
    dapInr,
    ddpInr,
    exwUsd,
    fcaUsd,
    fobUsd,
    cifUsd,
    dapUsd,
    ddpUsd,
    rodtepCreditInr,
    dutyDrawbackInr,
    igstWorkingCapitalSavedInr,
    netEffectiveExWorksInr,
    netEffectiveExWorksCostInr,
    ftaCheck: {
      ftaApplicable: corridorMeta.ftaAvailable,
      ftaSchemeName: corridorMeta.ftaSchemeName ?? 'Standard MFN Tariff (No Bilateral FTA)',
      domesticValueAddPercent: domesticVa,
      minRvcThresholdPercent: minRvcThreshold,
      eligible: ftaEligible,
      mfnDutyPercent,
      preferentialFtaDutyPercent: prefDutyPercent,
      appliedDutyPercent,
      mfnDutyPerUnitInr,
      appliedDutyPerUnitInr,
      ftaDutyDeltaPerUnitInr,
      ftaDutyDeltaPerUnitUsd,
    },
    grossMarginPercent,
    grossMarginWithoutIncentivesPercent,
    targetRetailMsrpUsd,
    msrpMultiplier,
    warningFlags,
  };
}

export const EXPORT_PAPERWORK_GATE_IDS = [
  'iec',
  'ad_code_icegate',
  'gst_lut',
  'rodtep_scrip',
  'scomet_screening',
  'un383_msds',
  'certificate_of_origin',
  'commercial_invoice_packing',
  'shipping_bill_bl',
  'rbi_edpms_ebrc',
] as const;
export type ExportPaperworkGateId = (typeof EXPORT_PAPERWORK_GATE_IDS)[number];

export interface ExportPaperworkGate {
  id: ExportPaperworkGateId;
  stepNumber: number;
  title: string;
  authority: string;
  critical: boolean;
  requiredDocument: string;
  portalUrl: string;
  actionNote: string;
}

export const EXPORT_PAPERWORK_GATES: ExportPaperworkGate[] = [
  {
    id: 'iec',
    stepNumber: 1,
    title: 'Importer Exporter Code (e-IEC)',
    authority: 'DGFT (Ministry of Commerce)',
    critical: true,
    requiredDocument: 'PAN-linked 10-digit e-IEC Certificate (annual Apr–Jun KYC update)',
    portalUrl: 'https://www.dgft.gov.in',
    actionNote: 'Mandatory before any Shipping Bill can be filed on ICEGATE.',
  },
  {
    id: 'ad_code_icegate',
    stepNumber: 2,
    title: 'Bank AD Code & IFSC Registration at Port',
    authority: 'ICEGATE Customs / Authorised Dealer Bank',
    critical: true,
    requiredDocument: '14-digit Bank AD Code Letter mapped to port code (e.g. INNSA1 / INBLR4)',
    portalUrl: 'https://www.icegate.gov.in',
    actionNote: 'Required per exit sea/air port so RoDTEP & Shipping Bill clearance work.',
  },
  {
    id: 'gst_lut',
    stepNumber: 3,
    title: 'GST Letter of Undertaking (Form RFD-11)',
    authority: 'GSTN / CBIC',
    critical: true,
    requiredDocument: 'Annual Zero-Rated Export LUT ARN Certificate',
    portalUrl: 'https://www.gst.gov.in',
    actionNote: 'Exports without locking 18% working capital into upfront IGST refund queues.',
  },
  {
    id: 'rodtep_scrip',
    stepNumber: 4,
    title: 'RoDTEP Claim & e-Scrip Ledger Setup',
    authority: 'ICEGATE / DGFT',
    critical: false,
    requiredDocument: 'RODTEPY Scheme Code declaration in Shipping Bill item details',
    portalUrl: 'https://www.icegate.gov.in',
    actionNote: 'Forgetting RODTEPY flag at Shipping Bill filing forfeits 0.9%–1.8% remission.',
  },
  {
    id: 'scomet_screening',
    stepNumber: 5,
    title: 'SCOMET Dual-Use Screening & Technical Declaration',
    authority: 'DGFT SCOMET Cell',
    critical: true,
    requiredDocument: 'Signed Non-SCOMET technical matrix or SCOMET export license',
    portalUrl: 'https://www.dgft.gov.in',
    actionNote: 'Mandatory customs hold check for UAVs, IMUs, encryption, and aerospace CNC parts.',
  },
  {
    id: 'un383_msds',
    stepNumber: 6,
    title: 'UN 38.3 Test Summary & 16-Section MSDS / Non-DG Letter',
    authority: 'IATA DGR / IMDG / Freight Forwarder',
    critical: true,
    requiredDocument: 'UN 38.3 Test Summary + PI965/966/967 declaration or Non-DG certificate',
    portalUrl: 'https://www.iata.org',
    actionNote: 'Airlines and shipping lines immediately offload shipments lacking battery safety sheets.',
  },
  {
    id: 'certificate_of_origin',
    stepNumber: 7,
    title: 'Certificate of Origin (Preferential CEPA/AIFTA or Non-Pref)',
    authority: 'DGFT Common Digital Platform / FIEO / EIC',
    critical: false,
    requiredDocument: 'Electronic CoO verifying Indian RVC >= 35%–40% for FTA corridors',
    portalUrl: 'https://coo.dgft.gov.in',
    actionNote: 'Saves overseas buyer 5%–10% import duty in UAE CEPA and ASEAN AIFTA corridors.',
  },
  {
    id: 'commercial_invoice_packing',
    stepNumber: 8,
    title: 'Commercial Invoice, Packing List & 8-Digit HSN',
    authority: 'Exporter / CHA Customs Broker',
    critical: true,
    requiredDocument: 'Signed Invoice & Box-wise Net/Gross Weight Packing List with Incoterm',
    portalUrl: 'https://www.icegate.gov.in',
    actionNote: 'Must declare exact Incoterm (EXW/FOB/CIF), currency, LUT ARN, and HSN.',
  },
  {
    id: 'shipping_bill_bl',
    stepNumber: 9,
    title: 'ICEGATE Shipping Bill, LEO & AWB / Bill of Lading',
    authority: 'Indian Customs / Shipping Line / Airline',
    critical: true,
    requiredDocument: 'Let Export Order (LEO) endorsed Shipping Bill + Master/House AWB or B/L',
    portalUrl: 'https://www.icegate.gov.in',
    actionNote: 'Legal proof of physical export required for GST zero-rating and e-BRC.',
  },
  {
    id: 'rbi_edpms_ebrc',
    stepNumber: 10,
    title: 'RBI EDPMS Reconciliation & Bank e-BRC Closure',
    authority: 'Reserve Bank of India / AD Bank / DGFT',
    critical: false,
    requiredDocument: 'FIRC / e-BRC generated within 9 months of export realization',
    portalUrl: 'https://www.dgft.gov.in',
    actionNote: 'Unreconciled EDPMS entries after 9 months block future export remittances & IEC status.',
  },
];

export interface ExportPaperworkWorkflowResult {
  readinessScore: number;
  completedCount: number;
  totalCount: number;
  completedGateIds: ExportPaperworkGateId[];
  missingBlockers: ExportPaperworkGate[];
  criticalBlockerCount: number;
  status: 'shipment_ready' | 'conditional_incentive_gaps' | 'blocked';
}

/**
 * Evaluates Indian export compliance workflow readiness (0-100) across all 10 standard
 * statutory & logistics gates from DGFT e-IEC through RBI EDPMS / e-BRC closure.
 */
export function evaluateExportPaperworkWorkflow(
  completedGateIds: string[],
): ExportPaperworkWorkflowResult {
  const validGateSet = new Set<string>(EXPORT_PAPERWORK_GATE_IDS);
  const completedSet = new Set<ExportPaperworkGateId>();

  for (const id of completedGateIds) {
    if (validGateSet.has(id)) {
      completedSet.add(id as ExportPaperworkGateId);
    }
  }

  const missingBlockers = EXPORT_PAPERWORK_GATES.filter((gate) => !completedSet.has(gate.id)).sort(
    (a, b) => Number(b.critical) - Number(a.critical) || a.stepNumber - b.stepNumber,
  );

  const criticalBlockerCount = missingBlockers.filter((g) => g.critical).length;
  const completedCount = completedSet.size;
  const totalCount = EXPORT_PAPERWORK_GATES.length;
  const readinessScore = Math.round((completedCount / totalCount) * 100);

  let status: ExportPaperworkWorkflowResult['status'] = 'blocked';
  if (readinessScore === 100) {
    status = 'shipment_ready';
  } else if (criticalBlockerCount === 0) {
    status = 'conditional_incentive_gaps';
  }

  return {
    readinessScore,
    completedCount,
    totalCount,
    completedGateIds: EXPORT_PAPERWORK_GATE_IDS.filter((id) => completedSet.has(id)),
    missingBlockers,
    criticalBlockerCount,
    status,
  };
}

export const PLI_AND_EXPORT_SCHEMES: PliAndExportScheme[] = [
  {
    id: 'pli_drones',
    name: 'PLI Drones',
    ministryOrAgency: 'Ministry of Civil Aviation (MoCA)',
    category: 'pli_production',
    eligibleSectors: ['drones-defense-space'],
    eligibleArchetypes: ['drone_uav'],
    incentiveRateSummary: '20% of value addition (net sales minus cost of imported/domestic bought-out parts)',
    minimumTurnoverOrInvestmentInr: '₹2 Cr annual sales (MSME drones) / ₹50 Lakh (component makers)',
    keyEligibilityRules: [
      'Minimum 40% value addition on airframes, flight controllers, motors, or sensors.',
      'Accessible specifically to Indian MSMEs & startups with low ₹2 Cr threshold.',
    ],
    officialPortal: 'https://www.civilaviation.gov.in',
  },
  {
    id: 'pli_acc_battery',
    name: 'PLI ACC Battery',
    ministryOrAgency: 'Ministry of Heavy Industries (MHI)',
    category: 'pli_production',
    eligibleSectors: ['ev-clean-energy', 'specialty-materials-chemicals'],
    eligibleArchetypes: ['ev_battery_bms'],
    incentiveRateSummary: 'Up to ₹2,000/kWh subsidy tied to cell chemistry efficiency & domestic VA >= 60%',
    minimumTurnoverOrInvestmentInr: 'GWh-scale commitment (>=5 GWh / ₹1,000+ Cr capex)',
    keyEligibilityRules: [
      'Targets gigafactory cell manufacturing and integrated cathode/anode value chains.',
      'Module-only BMS/pack assemblers below GWh scale partner via consortiums or use RoDTEP/Auto PLI.',
    ],
    officialPortal: 'https://heavyindustries.gov.in',
  },
  {
    id: 'pli_electronics',
    name: 'PLI Electronics',
    ministryOrAgency: 'MeitY (Ministry of Electronics & IT)',
    category: 'pli_production',
    eligibleSectors: ['semiconductors-electronics', 'consumer-hardware-appliances'],
    eligibleArchetypes: ['iot_wireless', 'industrial_power_smps'],
    incentiveRateSummary: '4% to 6% on incremental net sales of PCBA, IoT hardware, servers & power electronics',
    minimumTurnoverOrInvestmentInr: '₹10 Cr – ₹50 Cr incremental capex (IT Hardware 2.0 / SPECS 25% capex)',
    keyEligibilityRules: [
      'Covers SMT assemblies, gateways, industrial electronics, and power electronics sub-assemblies.',
      'SPECS scheme also reimburses 25% capital expenditure for electronic component fabs.',
    ],
    officialPortal: 'https://www.meity.gov.in',
  },
  {
    id: 'pli_auto_components',
    name: 'PLI Auto Components',
    ministryOrAgency: 'Ministry of Heavy Industries (MHI)',
    category: 'pli_production',
    eligibleSectors: ['ev-clean-energy', 'robotics-cnc-automation', 'rail-marine-heavy-infra'],
    eligibleArchetypes: ['ev_battery_bms', 'precision_cnc_subassembly'],
    incentiveRateSummary: '8% to 18% incentive on Advanced Automotive Technology (AAT) components',
    minimumTurnoverOrInvestmentInr: '₹250 Cr global revenue or ₹100 Cr New Non-Automotive Investor net worth',
    keyEligibilityRules: [
      'Covers BMS, EV motor controllers, BLDC traction drives, and precision CNC EV powertrain parts.',
      'Requires minimum 50% domestic value addition (DVA) certified by ARAI/ICAT.',
    ],
    officialPortal: 'https://heavyindustries.gov.in',
  },
  {
    id: 'rodtep',
    name: 'RoDTEP',
    ministryOrAgency: 'DGFT / CBIC',
    category: 'export_remission',
    eligibleSectors: [
      'semiconductors-electronics',
      'ev-clean-energy',
      'drones-defense-space',
      'robotics-cnc-automation',
      'medtech-diagnostics',
      'consumer-hardware-appliances',
      'technical-textiles-apparel',
      'agro-food-coldchain',
      'specialty-materials-chemicals',
      'rail-marine-heavy-infra',
    ],
    eligibleArchetypes: [
      'iot_wireless',
      'ev_battery_bms',
      'drone_uav',
      'industrial_power_smps',
      'medical_diagnostic',
      'precision_cnc_subassembly',
    ],
    incentiveRateSummary: '0.8% to 2.5% of FOB value refunded via transferable duty credit e-scrips',
    minimumTurnoverOrInvestmentInr: 'Zero minimum turnover — available from export shipment #1',
    keyEligibilityRules: [
      'Must declare RODTEPY code on ICEGATE Shipping Bill at time of export.',
      'Offsets unrefunded electricity duty, mandi/fuel levies, and embedded state taxes.',
    ],
    officialPortal: 'https://www.icegate.gov.in',
  },
  {
    id: 'duty_drawback',
    name: 'Duty Drawback',
    ministryOrAgency: 'CBIC (Central Board of Indirect Taxes & Customs)',
    category: 'export_remission',
    eligibleSectors: [
      'semiconductors-electronics',
      'ev-clean-energy',
      'drones-defense-space',
      'robotics-cnc-automation',
      'medtech-diagnostics',
      'consumer-hardware-appliances',
      'technical-textiles-apparel',
      'agro-food-coldchain',
      'specialty-materials-chemicals',
      'rail-marine-heavy-infra',
    ],
    eligibleArchetypes: [
      'iot_wireless',
      'ev_battery_bms',
      'drone_uav',
      'industrial_power_smps',
      'medical_diagnostic',
      'precision_cnc_subassembly',
    ],
    incentiveRateSummary: '1.0% to 2.2% AIR cash refund (or Brand Rate for higher imported IC/cell content)',
    minimumTurnoverOrInvestmentInr: 'Zero minimum — directly credited to AD Bank account after LEO',
    keyEligibilityRules: [
      'Refunds customs duty paid on imported chips, copper, alloys, and packaging incorporated into exports.',
      'Brand Rate fixation allows reclaiming actual BCD if imported BOM > 50%.',
    ],
    officialPortal: 'https://www.cbic.gov.in',
  },
  {
    id: 'advance_authorization',
    name: 'Advance Authorization',
    ministryOrAgency: 'DGFT (Regional Authority)',
    category: 'duty_free_input',
    eligibleSectors: [
      'semiconductors-electronics',
      'ev-clean-energy',
      'drones-defense-space',
      'robotics-cnc-automation',
      'medtech-diagnostics',
      'consumer-hardware-appliances',
      'technical-textiles-apparel',
      'specialty-materials-chemicals',
    ],
    eligibleArchetypes: [
      'iot_wireless',
      'ev_battery_bms',
      'drone_uav',
      'industrial_power_smps',
      'medical_diagnostic',
    ],
    incentiveRateSummary: '0% BCD, 0% SWS, and 0% IGST upfront on imported ICs, Li-ion cells & raw inputs',
    minimumTurnoverOrInvestmentInr: 'Zero minimum — requires 15% positive value addition within 18 months',
    keyEligibilityRules: [
      'Eliminates 7.5%–15% Basic Customs Duty + 18% IGST cash lockup on imported components.',
      'Replaces standard AIR Duty Drawback on duty-free inputs under SION or Self-Ratification norms.',
    ],
    officialPortal: 'https://www.dgft.gov.in',
  },
  {
    id: 'dgft_mai',
    name: 'DGFT MAI',
    ministryOrAgency: 'DGFT / Export Promotion Councils (EEPC / ESC / Pharmexcil)',
    category: 'market_access_credit',
    eligibleSectors: [
      'semiconductors-electronics',
      'ev-clean-energy',
      'drones-defense-space',
      'robotics-cnc-automation',
      'medtech-diagnostics',
      'consumer-hardware-appliances',
      'technical-textiles-apparel',
      'agro-food-coldchain',
      'specialty-materials-chemicals',
      'rail-marine-heavy-infra',
    ],
    eligibleArchetypes: [
      'iot_wireless',
      'ev_battery_bms',
      'drone_uav',
      'industrial_power_smps',
      'medical_diagnostic',
      'precision_cnc_subassembly',
    ],
    incentiveRateSummary: 'Up to 65%–75% grant reimbursement on international trade fairs & CE/FCC/FDA testing fees',
    minimumTurnoverOrInvestmentInr: 'MSMEs with valid Udyam + RCMC membership (<=₹50 Cr export turnover priority)',
    keyEligibilityRules: [
      'Reimburses up to ₹50 Lakh/yr for statutory overseas product registrations (FDA/CE/REACH/UL).',
      'Subsidizes exhibition booths at Electronica, CES, Arab Health, GITEX, and Hannover Messe.',
    ],
    officialPortal: 'https://www.dgft.gov.in',
  },
  {
    id: 'ecgc',
    name: 'ECGC',
    ministryOrAgency: 'ECGC Ltd. (Govt of India Export Credit Agency)',
    category: 'market_access_credit',
    eligibleSectors: [
      'semiconductors-electronics',
      'ev-clean-energy',
      'drones-defense-space',
      'robotics-cnc-automation',
      'medtech-diagnostics',
      'consumer-hardware-appliances',
      'technical-textiles-apparel',
      'agro-food-coldchain',
      'specialty-materials-chemicals',
      'rail-marine-heavy-infra',
    ],
    eligibleArchetypes: [
      'iot_wireless',
      'ev_battery_bms',
      'drone_uav',
      'industrial_power_smps',
      'medical_diagnostic',
      'precision_cnc_subassembly',
    ],
    incentiveRateSummary: 'Covers 80%–90% of buyer credit default / political risk + unlocks collateral-light EPC bank credit',
    minimumTurnoverOrInvestmentInr: 'Zero minimum turnover (Small Exporter Policy covers <=₹5 Cr exporters at ~0.4% premium)',
    keyEligibilityRules: [
      'Enables 60–90 day Net Payment Terms to overseas OEM buyers without risking founder capital.',
      'Reduces pre-shipment Export Packing Credit (EPC) interest rates at SBI/HDFC/EXIM Bank.',
    ],
    officialPortal: 'https://www.ecgc.in',
  },
];

export interface PliIncentiveMatchInput {
  sectorId?: SectorId;
  productArchetype?: ExportProductArchetype;
  annualExportTurnoverInr?: number;
  annualIncrementalInvestmentInr?: number;
  domesticValueAddPercent?: number;
  importsRawMaterialsForReExport?: boolean;
  corridor?: ExportCorridorId;
  hasMsmeUdyamRegistration?: boolean;
}

export interface PliIncentiveMatchResult {
  scheme: PliAndExportScheme;
  relevanceScore: number;
  eligibilityTier: 'primary_match' | 'conditional_match' | 'scale_gated';
  estimatedAnnualBenefitInr: number;
  estimatedBenefitNote: string;
  nextAction: string;
}

/**
 * Ranks Indian PLI & export promotion schemes (PLI Drones, PLI ACC Battery, PLI Electronics,
 * PLI Auto Components, RoDTEP, Duty Drawback, Advance Authorization, DGFT MAI, ECGC)
 * based on sector, archetype, scale, import intensity, and target corridor.
 */
export function matchPliAndExportIncentives(
  input: PliIncentiveMatchInput,
): PliIncentiveMatchResult[] {
  const turnoverInr = Math.max(0, input.annualExportTurnoverInr ?? 10_000_000); // Default ₹1 Cr baseline
  const capexInr = Math.max(0, input.annualIncrementalInvestmentInr ?? 2_500_000);
  const domesticVa = Math.min(100, Math.max(0, input.domesticValueAddPercent ?? 45));
  const importsInputs = input.importsRawMaterialsForReExport ?? true;
  const isMsme = input.hasMsmeUdyamRegistration ?? turnoverInr <= 500_000_000;

  const results: PliIncentiveMatchResult[] = PLI_AND_EXPORT_SCHEMES.map((scheme) => {
    let score = 40;
    let tier: PliIncentiveMatchResult['eligibilityTier'] = 'conditional_match';
    let estimatedAnnualBenefitInr = 0;
    let estimatedBenefitNote = '';
    let nextAction = '';

    const sectorMatch = input.sectorId ? scheme.eligibleSectors.includes(input.sectorId) : false;
    const archetypeMatch = input.productArchetype
      ? scheme.eligibleArchetypes.includes(input.productArchetype)
      : false;

    if (sectorMatch) score += 26;
    if (archetypeMatch) score += 22;

    if (scheme.id === 'rodtep') {
      score = 92;
      tier = 'primary_match';
      const rate = 0.014;
      estimatedAnnualBenefitInr = Math.round(turnoverInr * rate);
      estimatedBenefitNote = `~₹${estimatedAnnualBenefitInr.toLocaleString('en-IN')}/yr in transferable e-scrips (~1.4% avg FOB remission) with zero turnover minimum.`;
      nextAction = 'Map Bank AD Code on ICEGATE and select RODTEPY in every Shipping Bill.';
    } else if (scheme.id === 'duty_drawback') {
      score = importsInputs ? 78 : 88;
      tier = importsInputs ? 'conditional_match' : 'primary_match';
      estimatedAnnualBenefitInr = Math.round(turnoverInr * 0.016);
      estimatedBenefitNote = importsInputs
        ? `~₹${estimatedAnnualBenefitInr.toLocaleString('en-IN')}/yr AIR cash refund (~1.6% FOB) if not claiming Advance Authorization on the same imported inputs.`
        : `~₹${estimatedAnnualBenefitInr.toLocaleString('en-IN')}/yr direct customs duty drawback refunded to AD Bank post-LEO.`;
      nextAction = 'Verify 8-digit HSN AIR Drawback schedule or apply for CBIC Brand Rate.';
    } else if (scheme.id === 'advance_authorization') {
      score = importsInputs ? 91 : 48;
      tier = importsInputs ? 'primary_match' : 'conditional_match';
      // ~40% imported BOM avoiding 7.5% BCD + 10% SWS (8.25% effective duty) + 18% cash float
      estimatedAnnualBenefitInr = Math.round(turnoverInr * 0.35 * 0.0825);
      estimatedBenefitNote = importsInputs
        ? `Saves ~₹${estimatedAnnualBenefitInr.toLocaleString('en-IN')}/yr in waived BCD/SWS on imported chips/cells + removes 18% IGST lockup (requires >=15% VA).`
        : 'Applicable if shifting toward imported active silicon, lithium cells, or specialty polymers (>15% VA).';
      nextAction = 'File ANF-4A on DGFT portal under Self-Ratification or SION norms.';
    } else if (scheme.id === 'dgft_mai') {
      score = isMsme ? 86 : 62;
      tier = isMsme ? 'primary_match' : 'conditional_match';
      estimatedAnnualBenefitInr = isMsme ? 1200000 : 600000;
      estimatedBenefitNote =
        'Reimburses up to 65%–75% of CE/FCC/FDA compliance testing and international trade show stalls (up to ₹50L/yr ceiling).';
      nextAction = 'Obtain RCMC from EEPC India / ESC / Pharmexcil before booking overseas trade fairs or labs.';
    } else if (scheme.id === 'ecgc') {
      const emergingCorridor =
        input.corridor === 'africa' || input.corridor === 'asean' || input.corridor === 'uae_gcc';
      score = emergingCorridor ? 89 : 76;
      tier = 'primary_match';
      estimatedAnnualBenefitInr = Math.round(turnoverInr * 0.05);
      estimatedBenefitNote = emergingCorridor
        ? `Protects 85%–90% of buyer credit exposure in ${input.corridor?.toUpperCase()} corridors and unlocks lower-cost EPC bank credit.`
        : 'Enables 60–90 day open-account terms with US/EU Tier-1 buyers while protecting against buyer insolvency.';
      nextAction = 'Enroll in ECGC Small Exporter Policy (SEP) or Export Turnover Policy via AD Bank.';
    } else if (scheme.id === 'pli_drones') {
      const eligibleScale = turnoverInr >= 20_000_000 || capexInr >= 5_000_000;
      if (sectorMatch || archetypeMatch) {
        score = eligibleScale && domesticVa >= 40 ? 96 : 78;
        tier = eligibleScale && domesticVa >= 40 ? 'primary_match' : 'conditional_match';
      } else {
        score = 18;
        tier = 'scale_gated';
      }
      const vaAmount = Math.round(turnoverInr * (domesticVa / 100));
      estimatedAnnualBenefitInr = Math.round(vaAmount * 0.2);
      estimatedBenefitNote =
        sectorMatch || archetypeMatch
          ? `20% value-addition PLI payout (~₹${estimatedAnnualBenefitInr.toLocaleString('en-IN')}/yr at ${domesticVa}% DVA); MSME threshold starts at ₹2 Cr sales.`
          : 'Restricted strictly to DGCA-compliant UAV airframes and indigenous drone components.';
      nextAction = 'Track MoCA PLI application window and audit >=40% domestic value addition.';
    } else if (scheme.id === 'pli_electronics') {
      const scaleReady = capexInr >= 50_000_000;
      if (sectorMatch || archetypeMatch) {
        score = scaleReady ? 90 : 72;
        tier = scaleReady ? 'primary_match' : 'scale_gated';
      } else {
        score = 24;
        tier = 'scale_gated';
      }
      estimatedAnnualBenefitInr = Math.round(turnoverInr * 0.05);
      estimatedBenefitNote = scaleReady
        ? `4%–6% incremental sales incentive (~₹${estimatedAnnualBenefitInr.toLocaleString('en-IN')}/yr) + 25% SPECS component capex support.`
        : 'Direct PLI requires multi-crore incremental capex; MSMEs can partner with PLI EMS anchors in Sriperumbudur/Noida.';
      nextAction = 'Evaluate MeitY SPECS 25% capital subsidy or partner as Tier-2 vendor to PLI anchor EMS.';
    } else if (scheme.id === 'pli_auto_components') {
      const scaleReady = turnoverInr >= 250_000_000 || capexInr >= 100_000_000;
      if (sectorMatch || archetypeMatch) {
        score = scaleReady && domesticVa >= 50 ? 91 : 69;
        tier = scaleReady && domesticVa >= 50 ? 'primary_match' : 'scale_gated';
      } else {
        score = 22;
        tier = 'scale_gated';
      }
      estimatedAnnualBenefitInr = Math.round(turnoverInr * 0.12);
      estimatedBenefitNote = scaleReady
        ? `8%–18% incentive on AAT EV/CNC assemblies (~₹${estimatedAnnualBenefitInr.toLocaleString('en-IN')}/yr at >=50% ARAI-certified DVA).`
        : 'AAT Tier-1 PLI has high ₹250 Cr turnover gates; startups qualify as certified Tier-2 EV sub-assembly suppliers.';
      nextAction = 'Document >=50% DVA bill-of-materials for ARAI/ICAT AAT verification.';
    } else if (scheme.id === 'pli_acc_battery') {
      const gwhScale = capexInr >= 5_000_000_000;
      if (sectorMatch || archetypeMatch) {
        score = gwhScale ? 93 : 56;
        tier = gwhScale ? 'primary_match' : 'scale_gated';
      } else {
        score = 15;
        tier = 'scale_gated';
      }
      estimatedAnnualBenefitInr = gwhScale ? Math.round(turnoverInr * 0.15) : 0;
      estimatedBenefitNote = gwhScale
        ? 'Eligible for GWh-scale cell chemistry incentive with >=60% domestic value addition.'
        : 'GWh-scale capex gated (₹1,000+ Cr); BMS and pack integrators should prioritize RoDTEP, Advance Auth, and Auto PLI.';
      nextAction = 'Cell R&D teams should align with MHI ACC recipients or domestic cathode/cell consortia.';
    }

    return {
      scheme,
      relevanceScore: Math.min(100, Math.max(0, score)),
      eligibilityTier: tier,
      estimatedAnnualBenefitInr,
      estimatedBenefitNote,
      nextAction,
    };
  });

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

export interface OemQualificationInput {
  productArchetype: ExportProductArchetype;
  hasIso9001?: boolean;
  hasPpapLevel3?: boolean;
  hasIatf16949?: boolean;
  hasIso13485?: boolean;
  hasAs9100d?: boolean;
  hardwareLicense?: string;
  firmwareLicense?: string;
  ftoClearanceDone?: boolean;
  singleSourceBomCount?: number;
  hasTraceabilityMes?: boolean;
}

export interface OemQualificationReadinessResult {
  verdict: 'oem_audit_ready' | 'conditional_gaps' | 'not_ready';
  score: number;
  ipFtoClean: boolean;
  copyleftFlags: string[];
  singleSourceRiskLevel: 'low' | 'moderate' | 'high';
  checklist: OemAuditChecklistItem[];
  criticalGaps: string[];
  remediationPlan: string[];
}

const STRONG_COPYLEFT_PATTERNS = ['CERN-OHL-S', 'GPL-3.0', 'AGPL-3.0', 'GPL-2.0-ONLY'];

function detectCopyleftLicense(license?: string): string | null {
  if (!license) return null;
  const upper = license.trim().toUpperCase();
  // Do not false-flag LGPL or permissive CERN-OHL-P / CERN-OHL-W
  if (upper.includes('CERN-OHL-S')) return 'CERN-OHL-S';
  if (upper.includes('AGPL-3.0')) return 'AGPL-3.0';
  if (upper.includes('GPL-3.0') && !upper.includes('LGPL-3.0')) return 'GPL-3.0';
  if (STRONG_COPYLEFT_PATTERNS.some((p) => upper === p)) return upper;
  return null;
}

/**
 * Evaluates Tier-1 Global OEM buyer qualification readiness across ISO 9001, IATF 16949,
 * ISO 13485, AS9100D, PPAP Level 3, IP/FTO cleanliness (explicitly flagging copyleft
 * CERN-OHL-S / GPL-3.0 contamination), and single-source BOM supply risk.
 */
export function evaluateOemQualificationReadiness(
  input: OemQualificationInput,
): OemQualificationReadinessResult {
  const { productArchetype } = input;
  const hasIso9001 = input.hasIso9001 ?? false;
  const hasPpapLevel3 = input.hasPpapLevel3 ?? false;
  const hasIatf16949 = input.hasIatf16949 ?? false;
  const hasIso13485 = input.hasIso13485 ?? false;
  const hasAs9100d = input.hasAs9100d ?? false;
  const ftoDone = input.ftoClearanceDone ?? false;
  const singleSourceCount = Math.max(0, Math.round(input.singleSourceBomCount ?? 0));
  const hasMes = input.hasTraceabilityMes ?? false;

  const copyleftFlags: string[] = [];
  const hwFlag = detectCopyleftLicense(input.hardwareLicense);
  if (hwFlag) copyleftFlags.push(`Hardware: ${hwFlag}`);
  const fwFlag = detectCopyleftLicense(input.firmwareLicense);
  if (fwFlag) copyleftFlags.push(`Firmware: ${fwFlag}`);

  const ipFtoClean = copyleftFlags.length === 0 && ftoDone;
  const hasCopyleftContamination = copyleftFlags.length > 0;

  let singleSourceRiskLevel: 'low' | 'moderate' | 'high' = 'low';
  if (singleSourceCount >= 3) singleSourceRiskLevel = 'high';
  else if (singleSourceCount >= 1) singleSourceRiskLevel = 'moderate';

  const checklist: OemAuditChecklistItem[] = [];
  let score = 0;

  // 1. ISO 9001 Baseline (20 pts)
  if (hasIso9001) score += 20;
  checklist.push({
    id: 'iso_9001',
    category: 'quality_management',
    title: 'ISO 9001:2015 Quality Management System',
    standardRef: 'ISO 9001:2015',
    critical: true,
    passed: hasIso9001,
    remediationNote: hasIso9001
      ? 'Active ISO 9001 QMS verified for incoming QC, CAPA, and supplier audits.'
      : 'Obtain NABL/IAF-accredited ISO 9001:2015 certification before OEM vendor onboarding.',
  });

  // 2. Domain-Specific QMS (20 pts)
  let domainQmsPassed = true;
  let domainQmsTitle = 'Sector Quality & Process Controls';
  let domainQmsRef = 'ISO 9001 / IPC-A-610 Class 2-3';
  let domainQmsCritical = false;
  let domainQmsNote = 'IPC-A-610 workmanship standard aligned with electronics assembly.';

  if (productArchetype === 'ev_battery_bms' || productArchetype === 'precision_cnc_subassembly') {
    domainQmsPassed = hasIatf16949;
    domainQmsTitle = 'IATF 16949 Automotive Quality System';
    domainQmsRef = 'IATF 16949:2016';
    domainQmsCritical = true;
    domainQmsNote = hasIatf16949
      ? 'IATF 16949 certified for automotive Tier-1 zero-defect manufacturing.'
      : 'Tier-1 EV & automotive OEMs require IATF 16949 certification or formal gap-closure roadmap.';
  } else if (productArchetype === 'medical_diagnostic') {
    domainQmsPassed = hasIso13485;
    domainQmsTitle = 'ISO 13485 Medical Device QMS';
    domainQmsRef = 'ISO 13485:2016';
    domainQmsCritical = true;
    domainQmsNote = hasIso13485
      ? 'ISO 13485 DHF/DMR medical quality system active.'
      : 'Mandatory for CDSCO export Free Sale, EU MDR, and FDA 510(k) OEM supply.';
  } else if (productArchetype === 'drone_uav') {
    domainQmsPassed = hasAs9100d;
    domainQmsTitle = 'AS9100D Aerospace & Defense QMS';
    domainQmsRef = 'AS9100D / EN 9100';
    domainQmsCritical = true;
    domainQmsNote = hasAs9100d
      ? 'AS9100D configuration control and FOD program verified.'
      : 'Global UAV/aerospace primes mandate AS9100D traceability and first-article inspection (AS9102).';
  } else {
    domainQmsPassed = hasIso9001;
  }

  if (domainQmsPassed) score += 20;
  checklist.push({
    id: 'domain_qms',
    category: 'quality_management',
    title: domainQmsTitle,
    standardRef: domainQmsRef,
    critical: domainQmsCritical,
    passed: domainQmsPassed,
    remediationNote: domainQmsNote,
  });

  // 3. PPAP Level 3 (20 pts)
  if (hasPpapLevel3) score += 20;
  checklist.push({
    id: 'ppap_level_3',
    category: 'ppap_traceability',
    title: 'PPAP Level 3 Package (PFMEA, Control Plan, MSA, Cpk >= 1.33)',
    standardRef: 'AIAG PPAP Level 3',
    critical:
      productArchetype === 'ev_battery_bms' || productArchetype === 'precision_cnc_subassembly',
    passed: hasPpapLevel3,
    remediationNote: hasPpapLevel3
      ? 'Full 18-element PPAP Level 3 dossier & PSW approved.'
      : 'Compile DFMEA/PFMEA, Gage R&R, and 300-pc run-at-rate Cpk >= 1.33 capability study.',
  });

  // 4. IP & FTO Cleanliness (20 pts)
  if (!hasCopyleftContamination && ftoDone) score += 20;
  else if (!hasCopyleftContamination && !ftoDone) score += 10;

  checklist.push({
    id: 'ip_fto_cleanliness',
    category: 'ip_licensing',
    title: 'IP Freedom-to-Operate (FTO) & Copyleft License Audit',
    standardRef: 'Clean-Room IP / Permissive OSS (MIT / Apache-2.0 / CERN-OHL-P)',
    critical: true,
    passed: ipFtoClean,
    remediationNote: hasCopyleftContamination
      ? `Strong copyleft risk detected (${copyleftFlags.join(', ')}): OEM legal teams reject CERN-OHL-S and GPL-3.0 dependencies due to mandatory source/schematic disclosure.`
      : ftoDone
        ? 'Permissive / proprietary licensing and target-corridor FTO search verified clean.'
        : 'Licenses are clean, but formal US/EP/IN patent Freedom-to-Operate clearance is still pending.',
  });

  // 5. Single-Source Supply Chain Risk (15 pts)
  if (singleSourceCount === 0) score += 15;
  else if (singleSourceCount <= 2) score += 7;
  checklist.push({
    id: 'dual_source_bom',
    category: 'supply_chain_resilience',
    title: 'Dual-Source BOM & Pin-Compatible Alternates',
    standardRef: 'OEM Business Continuity / AML',
    critical: singleSourceCount >= 3,
    passed: singleSourceCount === 0,
    remediationNote:
      singleSourceCount === 0
        ? 'All critical BOM components have >=2 qualified distributors or pin-compatible alternates.'
        : `${singleSourceCount} single-source component(s) present — qualify secondary pin-compatible MPNs on Hackerland Sourcing Workbench.`,
  });

  // 6. Serialization & MES Traceability (5 pts)
  if (hasMes) score += 5;
  checklist.push({
    id: 'mes_traceability',
    category: 'ppap_traceability',
    title: 'Reel-to-Unit QR Serialization & MES Traceability',
    standardRef: 'AIS-156 / UDI / Lot Recall Readiness',
    critical: false,
    passed: hasMes,
    remediationNote: hasMes
      ? 'Full unit serial genealogy linked to firmware hash and ICT/ATE pass logs.'
      : 'Bind QR unit serial numbers to PCBA reel batches and end-of-line ATE test logs.',
  });

  const criticalGaps = checklist
    .filter((item) => !item.passed && item.critical)
    .map((item) => `${item.title}: ${item.remediationNote}`);

  const remediationPlan = checklist
    .filter((item) => !item.passed)
    .map((item) => item.remediationNote);

  let verdict: OemQualificationReadinessResult['verdict'] = 'conditional_gaps';
  if (
    hasCopyleftContamination ||
    !hasIso9001 ||
    (productArchetype === 'medical_diagnostic' && !hasIso13485) ||
    score < 55
  ) {
    verdict = 'not_ready';
  } else if (score >= 85 && criticalGaps.length === 0) {
    verdict = 'oem_audit_ready';
  }

  return {
    verdict,
    score: Math.min(100, Math.max(0, score)),
    ipFtoClean,
    copyleftFlags,
    singleSourceRiskLevel,
    checklist,
    criticalGaps,
    remediationPlan,
  };
}
