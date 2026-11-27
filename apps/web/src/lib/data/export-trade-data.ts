import {
  CORRIDOR_META,
  HSN_EXPORT_PROFILES,
  type ExportCorridorId,
  type ExportProductArchetype,
  type Incoterm,
  type SectorId,
} from '@hackerland/core';

export const EXPORT_CORRIDOR_SLUGS = ['us', 'eu', 'uae-gcc', 'asean', 'africa'] as const;
export type ExportCorridorSlug = (typeof EXPORT_CORRIDOR_SLUGS)[number];

const SLUG_TO_CORRIDOR_ID: Record<ExportCorridorSlug, ExportCorridorId> = {
  us: 'us',
  eu: 'eu',
  'uae-gcc': 'uae_gcc',
  asean: 'asean',
  africa: 'africa',
};

const CORRIDOR_ID_TO_SLUG: Record<ExportCorridorId, ExportCorridorSlug> = {
  us: 'us',
  eu: 'eu',
  uae_gcc: 'uae-gcc',
  asean: 'asean',
  africa: 'africa',
};

/** Maps a URL corridor slug (`uae-gcc`) to its canonical `@hackerland/core` ExportCorridorId (`uae_gcc`). */
export function corridorSlugToId(slug: string): ExportCorridorId | null {
  if (slug in SLUG_TO_CORRIDOR_ID) {
    return SLUG_TO_CORRIDOR_ID[slug as ExportCorridorSlug];
  }
  return null;
}

/** Maps a canonical ExportCorridorId (`uae_gcc`) to its URL slug (`uae-gcc`). */
export function corridorIdToSlug(corridorId: ExportCorridorId): ExportCorridorSlug {
  return CORRIDOR_ID_TO_SLUG[corridorId];
}

export interface ExportArchetypeMetadata {
  id: ExportProductArchetype;
  label: string;
  shortLabel: string;
  exampleProduct: string;
  defaultHsnCode: string;
  defaultBomInr: number;
  defaultMfgQaInr: number;
  defaultExWorksPriceInr: number;
  defaultImportedBomPercent: number;
  defaultTargetPriceUsd: number;
  typicalIndiaClusters: string[];
  defaultHasWireless: boolean;
  defaultHasLithiumBattery: boolean;
  defaultMainsAc: boolean;
  defaultSectorId: SectorId;
}

export const EXPORT_ARCHETYPE_METADATA: Record<ExportProductArchetype, ExportArchetypeMetadata> = {
  iot_wireless: {
    id: 'iot_wireless',
    label: 'IoT Wireless Gateways & Smart Sensors',
    shortLabel: 'IoT Wireless',
    exampleProduct: 'LoRaWAN / BLE Industrial Telemetry Gateway (ESP32-S3 / SX1262)',
    defaultHsnCode: '85176290',
    defaultBomInr: 1850,
    defaultMfgQaInr: 450,
    defaultExWorksPriceInr: 3600,
    defaultImportedBomPercent: 45,
    defaultTargetPriceUsd: 129,
    typicalIndiaClusters: ['Bengaluru Peenya', 'Noida Sector 63', 'Pune Hinjawadi'],
    defaultHasWireless: true,
    defaultHasLithiumBattery: false,
    defaultMainsAc: false,
    defaultSectorId: 'semiconductors-electronics',
  },
  ev_battery_bms: {
    id: 'ev_battery_bms',
    label: 'EV Battery Packs & Smart BMS Modules',
    shortLabel: 'EV Battery / BMS',
    exampleProduct: 'AIS-156 Compliant 48V LFP Pack & CAN-FD Active-Balancing BMS',
    defaultHsnCode: '85076000',
    defaultBomInr: 14200,
    defaultMfgQaInr: 2100,
    defaultExWorksPriceInr: 23500,
    defaultImportedBomPercent: 52,
    defaultTargetPriceUsd: 780,
    typicalIndiaClusters: ['Pune Chakan', 'Hosur EV Cluster', 'Chennai Oragadam'],
    defaultHasWireless: false,
    defaultHasLithiumBattery: true,
    defaultMainsAc: false,
    defaultSectorId: 'ev-clean-energy',
  },
  drone_uav: {
    id: 'drone_uav',
    label: 'Commercial Drones & UAV Systems',
    shortLabel: 'Drone / UAV',
    exampleProduct: 'Sub-25kg Precision Agri & Mapping Hexacopter + Flight Controller',
    defaultHsnCode: '88062200',
    defaultBomInr: 38000,
    defaultMfgQaInr: 9500,
    defaultExWorksPriceInr: 72000,
    defaultImportedBomPercent: 42,
    defaultTargetPriceUsd: 2450,
    typicalIndiaClusters: ['Chennai Aerospace Park', 'Bengaluru Devanahalli', 'Hyderabad Adibatla'],
    defaultHasWireless: true,
    defaultHasLithiumBattery: true,
    defaultMainsAc: false,
    defaultSectorId: 'drones-defense-space',
  },
  industrial_power_smps: {
    id: 'industrial_power_smps',
    label: 'Industrial SMPS, Inverters & Solar MPPT',
    shortLabel: 'Power / SMPS',
    exampleProduct: '3kW High-Efficiency Solar MPPT & DIN-Rail Industrial PSU',
    defaultHsnCode: '85044090',
    defaultBomInr: 4400,
    defaultMfgQaInr: 950,
    defaultExWorksPriceInr: 8100,
    defaultImportedBomPercent: 38,
    defaultTargetPriceUsd: 295,
    typicalIndiaClusters: ['Coimbatore SIDCO', 'Pune Bhosari', 'Ahmedabad Changodar'],
    defaultHasWireless: false,
    defaultHasLithiumBattery: false,
    defaultMainsAc: true,
    defaultSectorId: 'semiconductors-electronics',
  },
  medical_diagnostic: {
    id: 'medical_diagnostic',
    label: 'Medical Diagnostics & POC Analyzers',
    shortLabel: 'MedTech Diagnostic',
    exampleProduct: '12-Lead Portable ECG & Point-of-Care Hematology Analyzer',
    defaultHsnCode: '90181990',
    defaultBomInr: 9200,
    defaultMfgQaInr: 2800,
    defaultExWorksPriceInr: 19500,
    defaultImportedBomPercent: 35,
    defaultTargetPriceUsd: 690,
    typicalIndiaClusters: ['Visakhapatnam AMTZ', 'Hyderabad Genome Valley', 'Bengaluru Bommasandra'],
    defaultHasWireless: true,
    defaultHasLithiumBattery: true,
    defaultMainsAc: true,
    defaultSectorId: 'medtech-diagnostics',
  },
  precision_cnc_subassembly: {
    id: 'precision_cnc_subassembly',
    label: 'Precision 5-Axis CNC & Robotics Sub-Assemblies',
    shortLabel: 'Precision CNC',
    exampleProduct: 'Cycloidal Actuator Housing & 7075-T6 Aerospace Servo Manifold',
    defaultHsnCode: '84839000',
    defaultBomInr: 1900,
    defaultMfgQaInr: 1400,
    defaultExWorksPriceInr: 5200,
    defaultImportedBomPercent: 18,
    defaultTargetPriceUsd: 195,
    typicalIndiaClusters: ['Rajkot Shapar-Veraval', 'Coimbatore Kurichi', 'Pune Pimpri-Chinchwad'],
    defaultHasWireless: false,
    defaultHasLithiumBattery: false,
    defaultMainsAc: false,
    defaultSectorId: 'robotics-cnc-automation',
  },
};

export interface ExportCorridorPlaybook {
  slug: ExportCorridorSlug;
  corridorId: ExportCorridorId;
  name: string;
  shortName: string;
  regionTagline: string;
  headline: string;
  ftaBadge: string;
  ftaPerkSummary: string;
  regulatoryMarks: string[];
  indianOriginPorts: string[];
  destinationPorts: string[];
  seaTransitDays: string;
  airTransitDays: string;
  customsNotes: string[];
  buyerQualificationTips: string[];
  extraCorridorDocs: string[];
  recommendedArchetypes: ExportProductArchetype[];
  officialPortals: Array<{ label: string; url: string; purpose: string }>;
}

export const EXPORT_CORRIDORS_CATALOG: ExportCorridorPlaybook[] = [
  {
    slug: 'us',
    corridorId: 'us',
    name: 'United States Corridor',
    shortName: 'United States',
    regionTagline: 'North America · FCC / NRTL UL / FDA / FAA',
    headline: 'Highest unit realization & B2B/industrial OEM contract demand with strict NRTL & FCC checks.',
    ftaBadge: 'ITA-1 · 0% Duty on IoT/MedTech',
    ftaPerkSummary:
      'No bilateral India-US FTA, but WTO ITA-1 keeps HSN 8517 IoT gateways and HSN 9018 medical diagnostics at 0% MFN duty. CNC parts (2.5%) and Li-ion packs (3.4%) leverage US reshoring & China+1 sourcing.',
    regulatoryMarks: ['FCC Part 15B / 15C', 'UL 62368-1 / NRTL', 'UL 2580', 'FDA 510(k)', 'UN 38.3'],
    indianOriginPorts: ['JNPT Nhava Sheva (INNSA1)', 'Mundra (INMUN1)', 'BLR Air Cargo (INBLR4)'],
    destinationPorts: ['Los Angeles / Long Beach', 'Newark / Port Elizabeth', 'Chicago ORD Air'],
    seaTransitDays: '26–34 days',
    airTransitDays: '3–5 days',
    customsNotes: [
      'File Automated Export System (AES) / ISF 10+2 at least 24 hours prior to US-bound ocean vessel loading.',
      'Pre-certified FCC ID RF modules cut intentional radiator test fees by ~$5,500 and avoid 6 weeks of TCB sweeps.',
      'For lithium packs (HSN 85076000), carriers strictly enforce UN 38.3 Test Summary + PHMSA Class 9 DG labeling.',
    ],
    buyerQualificationTips: [
      'US Tier-1 industrial buyers insist on NRTL listing (UL / Intertek ETL / TÜV) and $2M–$5M product liability COI.',
      'Ensure firmware and open hardware modules avoid strong copyleft contamination (GPL-3.0 / CERN-OHL-S) before buyer IP audit.',
    ],
    extraCorridorDocs: [
      'FCC Supplier Declaration of Conformity (SDoC) & US Responsible Party contact',
      'TSCA Chemical Substance Import Certification (positive or negative)',
      'US Importer of Record (IOR) EIN / Customs Bond confirmation for DDP orders',
    ],
    recommendedArchetypes: ['iot_wireless', 'precision_cnc_subassembly', 'medical_diagnostic', 'industrial_power_smps'],
    officialPortals: [
      { label: 'USITC Harmonized Tariff Schedule', url: 'https://hts.usitc.gov', purpose: 'Verify 10-digit US HTSUS duty rates' },
      { label: 'FCC Equipment Authorization', url: 'https://www.fcc.gov/oet/ea', purpose: 'FCC ID & Part 15 SDoC rules' },
      { label: 'ICEGATE Indian Customs', url: 'https://www.icegate.gov.in', purpose: 'Shipping Bill & RoDTEP claim filing' },
    ],
  },
  {
    slug: 'eu',
    corridorId: 'eu',
    name: 'European Union & UK Corridor',
    shortName: 'EU & UK',
    regionTagline: 'Europe · CE RED/EMC/LVD / UKCA / RoHS 3 / REACH',
    headline: 'Deep industrial automation, clean-tech & medical OEM market anchored by CE Technical Files.',
    ftaBadge: 'CE + UKCA Bundled · 0% ITA-1 IoT',
    ftaPerkSummary:
      'ITA-1 yields 0% duty for HSN 8517 IoT & 9018 diagnostic instruments; EU buyers value Indian NABL ILAC-MRA CISPR 32 / IEC 62368-1 CB reports plus bundled UKCA Declarations of Conformity.',
    regulatoryMarks: ['CE RED (2014/53/EU)', 'CE EMC & LVD', 'UKCA', 'RoHS 3 & REACH', 'EU MDR / EASA'],
    indianOriginPorts: ['JNPT Nhava Sheva (INNSA1)', 'Chennai (INMAA1)', 'Delhi IGI Air (INDEL4)'],
    destinationPorts: ['Rotterdam (NL)', 'Hamburg (DE)', 'Felixstowe / London Gateway (UK)'],
    seaTransitDays: '21–28 days',
    airTransitDays: '2–4 days',
    customsNotes: [
      'Appoint an EU Authorized Representative (EAR) on product/packaging labels before customs arrival under Market Surveillance Regulation (EU) 2019/1020.',
      'Bundle EORI registration + ICS2 pre-arrival safety filing with your freight forwarder for air and sea lanes.',
      'WEEE national registration and crossed-out wheeled bin symbol are mandatory for all non-CNC electronics.',
    ],
    buyerQualificationTips: [
      'German and Nordic OEMs demand EN 10204 3.1 mill certificates for machined alloys and full RoHS 3 + REACH SVHC (<0.1% w/w) supplier declarations.',
      'AIAG PPAP Level 3 and ISO 9001 / IATF 16949 shorten Tier-1 vendor onboarding in Stuttgart and Eindhoven by 3–4 months.',
    ],
    extraCorridorDocs: [
      'Signed EU Declaration of Conformity (DoC) citing RED/EMC/LVD/RoHS directives',
      'EU Authorized Representative (EAR) mandate & UKCA Technical File cross-reference',
      'REACH SVHC <0.1% w/w BOM screening matrix & WEEE Producer ID',
    ],
    recommendedArchetypes: ['industrial_power_smps', 'precision_cnc_subassembly', 'iot_wireless', 'ev_battery_bms'],
    officialPortals: [
      { label: 'EU Access2Markets Tariff & Rules', url: 'https://trade.ec.europa.eu/access-to-markets', purpose: 'TARIC codes, RoHS & EU customs requirements' },
      { label: 'ECHA REACH SVHC Candidate List', url: 'https://echa.europa.eu/candidate-list-table', purpose: 'Chemical compliance screening' },
      { label: 'DGFT India CoO Portal', url: 'https://coo.dgft.gov.in', purpose: 'Electronic Certificate of Origin' },
    ],
  },
  {
    slug: 'uae-gcc',
    corridorId: 'uae_gcc',
    name: 'UAE & GCC Corridor',
    shortName: 'UAE & GCC',
    regionTagline: 'Middle East · India-UAE CEPA 0% Duty / ECAS / TDRA',
    headline: 'Fastest transit & 0% India-UAE CEPA preferential customs duty hub for GCC re-exports.',
    ftaBadge: 'India-UAE CEPA · 0% Duty',
    ftaPerkSummary:
      'India-UAE CEPA slashes standard 5% GCC customs tariff to 0% across electronics, Li-ion BMS, SMPS, drones, MedTech, and CNC assemblies when Indian Domestic Value Addition meets >=40% RVC.',
    regulatoryMarks: ['UAE ECAS (MoIAT)', 'G-Mark (GSO)', 'UAE TDRA Radio', 'UAE RoHS', 'MOHAP / GCAA'],
    indianOriginPorts: ['Mundra (INMUN1)', 'JNPT Nhava Sheva (INNSA1)', 'Cochin / Mumbai Air'],
    destinationPorts: ['Jebel Ali Port (Dubai)', 'Khalifa Port (Abu Dhabi)', 'DXB / DWC Air Cargo'],
    seaTransitDays: '4–7 days',
    airTransitDays: '1–2 days',
    customsNotes: [
      'Generate Electronic Preferential Certificate of Origin (CEPA e-CoO) on coo.dgft.gov.in proving >=40% Indian value addition + CTSH rule.',
      'Upload NABL ILAC-MRA IEC 62368-1 / RoHS 3 reports directly into the MoIAT portal for annual ECAS Certificate of Conformity.',
      'Ultra-short 4–7 day ocean sailing from Mundra/Nhava Sheva to Jebel Ali slashes working-capital transit inventory.',
    ],
    buyerQualificationTips: [
      'Jebel Ali Free Zone (JAFZA) distributors distribute across Saudi Arabia, Oman, Qatar, and East Africa — quote both FOB Nhava Sheva and CIF Jebel Ali.',
      'High ambient thermal ratings (55°C continuous derating) are a decisive technical win for GCC solar MPPT and EV storage buyers.',
    ],
    extraCorridorDocs: [
      'India-UAE CEPA Preferential Certificate of Origin (DGFT e-CoO)',
      'MoIAT ECAS / EQM Certificate of Conformity & UAE TDRA Type Approval',
      'Dubai Customs HS Code & Non-SCOMET technical spec sheet',
    ],
    recommendedArchetypes: ['ev_battery_bms', 'industrial_power_smps', 'drone_uav', 'precision_cnc_subassembly'],
    officialPortals: [
      { label: 'DGFT India-UAE CEPA CoO', url: 'https://coo.dgft.gov.in', purpose: 'Issue 0% duty CEPA Preferential CoO' },
      { label: 'UAE MoIAT ECAS Portal', url: 'https://moiat.gov.ae', purpose: 'ECAS & UAE RoHS conformity certificates' },
      { label: 'UAE TDRA Type Approval', url: 'https://tdra.gov.ae', purpose: 'Wireless & IoT radio equipment permit' },
    ],
  },
  {
    slug: 'asean',
    corridorId: 'asean',
    name: 'ASEAN Manufacturing & Tech Corridor',
    shortName: 'ASEAN (SG/MY/VN/TH)',
    regionTagline: 'Southeast Asia · ASEAN-India AIFTA / IMDA / CPSO / SIRIM',
    headline: 'High-velocity electronics, EV supply-chain & smart-factory integration via Chennai & BLR.',
    ftaBadge: 'ASEAN-India AIFTA · >=35% RVC',
    ftaPerkSummary:
      'ASEAN-India Free Trade Area (AIFTA) lowers 5%–10% MFN duties down to 0%–2.5% across IoT, power electronics, drones, and CNC assemblies with >=35% Indian RVC + CTSH origin compliance.',
    regulatoryMarks: ['IMDA Type Approval (SG)', 'CPSO SAFETY Mark', 'SIRIM (MY) / NBTC (TH)', 'HSA Medical', 'CAAS UAS'],
    indianOriginPorts: ['Chennai Port (INMAA1)', 'Kattupalli / Ennore', 'BLR / MAA Air Cargo'],
    destinationPorts: ['PSA Singapore', 'Port Klang (MY)', 'Laem Chabang (TH) / Cat Lai (VN)'],
    seaTransitDays: '6–11 days',
    airTransitDays: '1–3 days',
    customsNotes: [
      'Issue Form AI (ASEAN-India AIFTA Preferential Certificate of Origin) via EIC / FIEO on coo.dgft.gov.in confirming >=35% Indian value addition.',
      'Singapore IMDA accepts simplified Declaration of Conformity when backed by pre-certified CE RED / FCC RF test reports.',
      'Chennai-to-Singapore feeder vessels sail daily, ideal for sub-assemblies feeding ASEAN EMS & EV battery integrators.',
    ],
    buyerQualificationTips: [
      'Singapore and Penang EMS primes audit reel-to-unit QR traceability and dual-source BOM resilience prior to multi-year master supply agreements.',
      'Offer ECGC-backed 45–60 day Net terms once buyer credit limit is cleared via AD Bank.',
    ],
    extraCorridorDocs: [
      'AIFTA Form AI Certificate of Origin (>=35% Regional Value Content)',
      'IMDA Equipment Registration / CPSO CB Safety Certificate',
      'Commercial Invoice quoting FOB Chennai / CIF Singapore in USD or SGD',
    ],
    recommendedArchetypes: ['iot_wireless', 'ev_battery_bms', 'precision_cnc_subassembly', 'medical_diagnostic'],
    officialPortals: [
      { label: 'DGFT Form AI CoO Portal', url: 'https://coo.dgft.gov.in', purpose: 'ASEAN-India AIFTA Origin Filing' },
      { label: 'IMDA Singapore TLS', url: 'https://www.imda.gov.sg', purpose: 'Telecom & Short-Range Radio approval' },
      { label: 'EnterpriseSG Consumer Safety', url: 'https://www.enterprisesg.gov.sg', purpose: 'CPSO SAFETY Mark registration' },
    ],
  },
  {
    slug: 'africa',
    corridorId: 'africa',
    name: 'East & Southern Africa Corridor',
    shortName: 'East & Southern Africa',
    regionTagline: 'Kenya / South Africa / Nigeria · KEBS PVoC / SONCAP / CAK',
    headline: 'High-growth solar off-grid, MedTech diagnostics, agri-drones & industrial hardware market.',
    ftaBadge: 'KEBS PVoC & ECGC Export Credit',
    ftaPerkSummary:
      'Strong demand for Indian rugged solar MPPTs, Li-ion storage packs, and portable diagnostics. Pre-shipment Certificate of Conformity (PVoC / SONCAP) prevents port demurrage while ECGC shields credit risk.',
    regulatoryMarks: ['KEBS PVoC (Kenya)', 'SONCAP (Nigeria)', 'CAK / ICASA Radio', 'PPB / SAHPRA MedTech', 'UN 38.3'],
    indianOriginPorts: ['Mundra (INMUN1)', 'JNPT Nhava Sheva (INNSA1)', 'Tuticorin (INTUT1)'],
    destinationPorts: ['Mombasa (KE)', 'Dar es Salaam (TZ)', 'Durban (ZA) / Lagos Apapa (NG)'],
    seaTransitDays: '12–19 days',
    airTransitDays: '2–4 days',
    customsNotes: [
      'Book pre-shipment inspection with Intertek / SGS / Bureau Veritas in India 10 days before dispatch to secure KEBS PVoC / SONCAP CoC.',
      'Provide Indian NABL ILAC-MRA IEC test reports during PVoC application so inspectors waive costly duplicate destination lab testing.',
      'Pair shipments with ECGC Export Credit Insurance (85%–90% coverage) or confirmed irrevocable Letter of Credit (L/C).',
    ],
    buyerQualificationTips: [
      'Include rugged surge protection, wide 90–300V AC input tolerances, and spare replaceable fuse/field service kits.',
      'Supply clear installation training videos and 24-month swap-out warranty spares in initial container loads.',
    ],
    extraCorridorDocs: [
      'KEBS PVoC / SONCAP Pre-Shipment Certificate of Conformity (CoC)',
      'ECGC Buyer Credit Policy / Confirmed Irrevocable L/C Advice',
      'CDSCO Free Sale Certificate (for diagnostic medical devices)',
    ],
    recommendedArchetypes: ['industrial_power_smps', 'medical_diagnostic', 'ev_battery_bms', 'drone_uav'],
    officialPortals: [
      { label: 'ECGC Export Credit Portal', url: 'https://www.ecgc.in', purpose: 'Buyer credit & political risk cover' },
      { label: 'KEBS PVoC Inspection Portal', url: 'https://www.kebs.org', purpose: 'Pre-export conformity verification' },
      { label: 'DGFT Market Access Initiative', url: 'https://www.dgft.gov.in', purpose: 'Trade fair & lab reimbursement grants' },
    ],
  },
];

export interface OemBuyerPersona {
  id: 'tier1_auto_ev' | 'global_consumer_odm' | 'medtech_oem' | 'aerospace_defense';
  label: string;
  targetBuyerExample: string;
  recommendedArchetype: ExportProductArchetype;
  requiredStandardsNote: string;
  indiaHubs: string;
  defaults: {
    hasIso9001: boolean;
    hasPpapLevel3: boolean;
    hasIatf16949: boolean;
    hasIso13485: boolean;
    hasAs9100d: boolean;
    hardwareLicense: string;
    firmwareLicense: string;
    ftoClearanceDone: boolean;
    singleSourceBomCount: number;
    hasTraceabilityMes: boolean;
  };
}

export const OEM_BUYER_PERSONAS: OemBuyerPersona[] = [
  {
    id: 'tier1_auto_ev',
    label: 'Tier-1 Auto / EV Powertrain OEM',
    targetBuyerExample: 'Bosch / Continental / Middle-East & EU 2W-4W Fleet OEMs',
    recommendedArchetype: 'ev_battery_bms',
    requiredStandardsNote: 'Mandates IATF 16949, AIAG PPAP Level 3 (Cpk >= 1.33), QR cell-to-BMS MES traceability, and clean IP.',
    indiaHubs: 'Pune Chakan · Hosur · Chennai Oragadam',
    defaults: {
      hasIso9001: true,
      hasPpapLevel3: true,
      hasIatf16949: false,
      hasIso13485: false,
      hasAs9100d: false,
      hardwareLicense: 'CERN-OHL-P-2.0',
      firmwareLicense: 'Apache-2.0',
      ftoClearanceDone: true,
      singleSourceBomCount: 1,
      hasTraceabilityMes: true,
    },
  },
  {
    id: 'global_consumer_odm',
    label: 'Global Consumer & Industrial IoT ODM',
    targetBuyerExample: 'US/EU Smart Building, Telemetry & Industrial Automation Primes',
    recommendedArchetype: 'iot_wireless',
    requiredStandardsNote: 'Mandates ISO 9001, FCC/CE RED compliance, dual-source MCU/RF BOMs, and zero copyleft contamination.',
    indiaHubs: 'Bengaluru Peenya · Noida · Sriperumbudur',
    defaults: {
      hasIso9001: true,
      hasPpapLevel3: true,
      hasIatf16949: false,
      hasIso13485: false,
      hasAs9100d: false,
      hardwareLicense: 'Proprietary / Trade Secret',
      firmwareLicense: 'MIT',
      ftoClearanceDone: true,
      singleSourceBomCount: 0,
      hasTraceabilityMes: true,
    },
  },
  {
    id: 'medtech_oem',
    label: 'Global MedTech & Diagnostic OEM',
    targetBuyerExample: 'EU MDR / US FDA 510(k) Diagnostic & Point-of-Care Partners',
    recommendedArchetype: 'medical_diagnostic',
    requiredStandardsNote: 'Strictly requires ISO 13485 DHF/DMR, IEC 60601-1 safety file, UDI traceability, and zero FTO gaps.',
    indiaHubs: 'Visakhapatnam AMTZ · Hyderabad · Bengaluru',
    defaults: {
      hasIso9001: true,
      hasPpapLevel3: false,
      hasIatf16949: false,
      hasIso13485: true,
      hasAs9100d: false,
      hardwareLicense: 'Proprietary / Trade Secret',
      firmwareLicense: 'Proprietary',
      ftoClearanceDone: true,
      singleSourceBomCount: 1,
      hasTraceabilityMes: true,
    },
  },
  {
    id: 'aerospace_defense',
    label: 'Aerospace, UAV & Robotics Prime',
    targetBuyerExample: 'EASA / FAA Commercial UAV & EU Robotics Integrators',
    recommendedArchetype: 'drone_uav',
    requiredStandardsNote: 'Mandates AS9100D configuration control, AS9102 First Article Inspection, SCOMET clarity, and dual-source actuators.',
    indiaHubs: 'Bengaluru Devanahalli · Hyderabad Adibatla · Rajkot',
    defaults: {
      hasIso9001: true,
      hasPpapLevel3: true,
      hasIatf16949: false,
      hasIso13485: false,
      hasAs9100d: false,
      hardwareLicense: 'CERN-OHL-S-2.0',
      firmwareLicense: 'GPL-3.0',
      ftoClearanceDone: false,
      singleSourceBomCount: 3,
      hasTraceabilityMes: false,
    },
  },
];

export const SECTOR_OPTIONS_FOR_PLI: Array<{ id: SectorId; label: string }> = [
  { id: 'semiconductors-electronics', label: 'Semiconductors, Electronics & IoT' },
  { id: 'ev-clean-energy', label: 'EV Powertrain, BMS & Clean Energy' },
  { id: 'drones-defense-space', label: 'Drones, UAVs, Defense & Space' },
  { id: 'robotics-cnc-automation', label: 'Robotics, CNC & Industrial Automation' },
  { id: 'medtech-diagnostics', label: 'MedTech & Point-of-Care Diagnostics' },
  { id: 'consumer-hardware-appliances', label: 'Consumer Hardware & Smart Appliances' },
  { id: 'technical-textiles-apparel', label: 'Technical Textiles & Smart Wearables' },
  { id: 'agro-food-coldchain', label: 'AgriTech & Cold-Chain IoT' },
  { id: 'specialty-materials-chemicals', label: 'Specialty Battery Materials & Chemicals' },
  { id: 'rail-marine-heavy-infra', label: 'Rail, Marine & Heavy Infrastructure' },
];

export interface ExportDossierTemplateInput {
  exporterName: string;
  iecCode: string;
  gstin: string;
  lutArn: string;
  exitPort: string;
  consigneeName: string;
  corridor: ExportCorridorId;
  hsnCode: string;
  incoterm: Incoterm;
  quantity: number;
  unitPriceUsd: number;
  netWeightKg: number;
  grossWeightKg: number;
  includesBattery: boolean;
}

/** Formats an export-ready Commercial Invoice, Packing List & Statutory Declaration dossier. */
export function buildExportDossierTemplate(input: ExportDossierTemplateInput): string {
  const hsnProfile =
    HSN_EXPORT_PROFILES.find((p) => p.hsnCode === input.hsnCode) ?? HSN_EXPORT_PROFILES[0]!;
  const corridorLabel = CORRIDOR_META[input.corridor].label;
  const totalUsd = (input.quantity * input.unitPriceUsd).toFixed(2);
  const ftaNote = CORRIDOR_META[input.corridor].ftaAvailable
    ? `Preferential Origin Claimed: ${CORRIDOR_META[input.corridor].ftaSchemeName} (e-CoO via coo.dgft.gov.in)`
    : 'Non-Preferential Origin: Republic of India (Chamber / FIEO e-CoO)';

  return [
    '====================================================================',
    'COMMERCIAL INVOICE & PACKING LIST DOSSIER (INDIA EXPORT READY)',
    '====================================================================',
    `Exporter         : ${input.exporterName}`,
    `DGFT e-IEC       : ${input.iecCode}   |   GSTIN: ${input.gstin}`,
    `GST LUT (RFD-11) : ${input.lutArn} (Supply Meant for Export Under LUT Without Payment of IGST)`,
    `Exit Port / Hub  : ${input.exitPort}`,
    `Consignee / Dest : ${input.consigneeName} -> ${corridorLabel}`,
    `Terms (Incoterm) : ${input.incoterm} 2020`,
    '--------------------------------------------------------------------',
    `ITC-HS Code      : ${hsnProfile.hsnCode}`,
    `Goods Description: ${hsnProfile.description}`,
    `Quantity         : ${input.quantity.toLocaleString('en-IN')} Units`,
    `Unit Price (USD) : $${input.unitPriceUsd.toFixed(2)}   |   Total Invoice Value: $${totalUsd} USD`,
    `Packing Summary  : Net Weight ${input.netWeightKg.toFixed(1)} kg | Gross Weight ${input.grossWeightKg.toFixed(1)} kg`,
    '--------------------------------------------------------------------',
    'STATUTORY ICEGATE / DGFT DECLARATIONS:',
    `1. RoDTEP Claim  : WE INTEND TO CLAIM REWARDS UNDER RODTEP SCHEME (Code: RODTEPY, Rate: ${hsnProfile.rodtepRatePercent}%).`,
    `2. Origin Status : ${ftaNote}.`,
    hsnProfile.scometFlagged
      ? '3. SCOMET Notice : CONDITIONAL SCOMET REVIEW REQUIRED (Attach Signed Technical Parameter Matrix / GAED).'
      : '3. SCOMET Notice : Goods certified Non-SCOMET commercial industrial hardware under DGFT Appendix 3.',
    input.includesBattery
      ? '4. Dangerous Goods: Lithium-Ion Battery Shipment — UN 38.3 Test Summary & PI965/966/967 MSDS Enclosed.'
      : '4. Dangerous Goods: Non-Hazardous / Non-Restricted Cargo (No Lithium Cells / Non-DG Letter Attached).',
    '====================================================================',
  ].join('\n');
}
