import { z } from 'zod';

export const SECTOR_IDS = [
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
] as const;

export type SectorId = (typeof SECTOR_IDS)[number];
export const sectorIdSchema = z.enum(SECTOR_IDS);

export const inrCostRangeSchema = z.object({
  minInr: z.number().nonnegative(),
  maxInr: z.number().positive(),
  label: z.string().min(1),
});
export type InrCostRange = z.infer<typeof inrCostRangeSchema>;

export const sectorJargonTermSchema = z.object({
  term: z.string().min(1),
  plainEnglish: z.string().min(1),
  whyItMattersInIndia: z.string().min(1),
});
export type SectorJargonTerm = z.infer<typeof sectorJargonTermSchema>;

export const VALUE_CHAIN_STAGE_IDS = [
  'raw_input',
  'sub_assembly',
  'integration_qa',
  'certification',
  'export',
] as const;
export type ValueChainStageId = (typeof VALUE_CHAIN_STAGE_IDS)[number];

export const valueChainStepSchema = z.object({
  stage: z.enum(VALUE_CHAIN_STAGE_IDS),
  title: z.string().min(1),
  indianReality: z.string().min(1),
  typicalMarginPercent: z.string().min(1),
});
export type ValueChainStep = z.infer<typeof valueChainStepSchema>;

export const recommendedWorkbenchSchema = z.object({
  label: z.string().min(1),
  route: z.string().startsWith('/'),
  purpose: z.string().min(1),
});
export type RecommendedWorkbench = z.infer<typeof recommendedWorkbenchSchema>;

export const starterProjectIdeaSchema = z.object({
  title: z.string().min(1),
  estimatedCostInr: z.number().min(2000).max(15000),
  skillsLearned: z.array(z.string().min(1)).min(2),
  exportHook: z.string().min(1),
});
export type StarterProjectIdea = z.infer<typeof starterProjectIdeaSchema>;

export const sectorCareerRoleSchema = z.object({
  title: z.string().min(1),
  entryTrack: z.string().min(1),
  indiaSalaryRangeInr: z.string().min(1),
});
export type SectorCareerRole = z.infer<typeof sectorCareerRoleSchema>;

export const sectorBlueprintSchema = z.object({
  id: sectorIdSchema,
  name: z.string().min(1),
  tagline: z.string().min(1),
  indiaClusterCities: z.array(z.string().min(1)).min(3),
  starterCostRangeInr: inrCostRangeSchema,
  pilotCostRangeInr: inrCostRangeSchema,
  plantCapexRangeInr: inrCostRangeSchema,
  globalExportDemand: z.string().min(10),
  keyExportCorridors: z.array(z.enum(['us', 'eu', 'uae_gcc', 'asean', 'africa'])).min(2),
  keyComplianceStandards: z.array(z.string().min(1)).min(3),
  jargonDecoder: z.array(sectorJargonTermSchema).min(3).max(4),
  valueChainSteps: z.array(valueChainStepSchema).length(5),
  recommendedWorkbenches: z.array(recommendedWorkbenchSchema).min(2),
  starterProjectIdeas: z.array(starterProjectIdeaSchema).min(2),
  careerRoles: z.array(sectorCareerRoleSchema).min(3),
});
export type SectorPathwayMeta = z.infer<typeof sectorBlueprintSchema>;

export const SECTOR_PATHWAYS_CORE: SectorPathwayMeta[] = [
  {
    id: 'semiconductors-electronics',
    name: 'Semiconductors, PCB & Embedded Electronics',
    tagline:
      'From 4-layer KiCad boards and SMT EMS lines to India OSAT packaging and export-grade industrial electronics.',
    indiaClusterCities: ['Bengaluru', 'Sriperumbudur', 'Noida', 'Sanand', 'Pune', 'Hyderabad'],
    starterCostRangeInr: { minInr: 2500, maxInr: 14500, label: '₹2,500 – ₹14,500' },
    pilotCostRangeInr: { minInr: 180000, maxInr: 1200000, label: '₹1.8 Lakh – ₹12 Lakh' },
    plantCapexRangeInr: {
      minInr: 25000000,
      maxInr: 1500000000,
      label: '₹2.5 Cr – ₹150 Cr (EMS / OSAT)',
    },
    globalExportDemand:
      'USD $42B+ China+1 EMS, industrial IoT gateways, smart meters, and power-control subassemblies ordered by US, EU, and GCC OEMs.',
    keyExportCorridors: ['us', 'eu', 'uae_gcc', 'asean'],
    keyComplianceStandards: [
      'BIS CRS (IS 13252 / IS 616)',
      'WPC ETA (2.4 GHz / Sub-GHz)',
      'FCC Part 15B / 15C',
      'CE RED & EMC (2014/53/EU)',
      'RoHS 3 & REACH',
    ],
    jargonDecoder: [
      {
        term: 'SMT / Pick-and-Place',
        plainEnglish:
          'Automated feeder machines mounting tiny SMD chips and passives onto solder-pasted PCBs before passing through a reflow oven.',
        whyItMattersInIndia:
          'EMS lines in Sriperumbudur, Noida, and Pune reduce per-board labor below ₹35 once batches cross 250 units.',
      },
      {
        term: 'Gerber & BOM Centroid',
        plainEnglish:
          'Standard fabrication artwork and XY component coordinates required by PCB fabs and assembly houses.',
        whyItMattersInIndia:
          'Clean DFM files prevent 2-week back-and-forth holds with domestic PCB houses in Bengaluru and Gandhinagar.',
      },
      {
        term: 'OSAT / ATMP',
        plainEnglish:
          'Outsourced Semiconductor Assembly and Test — packaging silicon wafers into QFN/BGA chips and validating electrical yields.',
        whyItMattersInIndia:
          'New OSAT parks in Sanand and Assam create domestic IC test/packaging engineering roles beyond pure chip design.',
      },
      {
        term: 'EMI/EMC Pre-Scan',
        plainEnglish:
          'Near-field RF sniffing of switching power noise on your bench before booking expensive regulatory chamber time.',
        whyItMattersInIndia:
          'Catches radiated spikes early and saves ₹1.5L–₹3.5L in failed NABL lab re-tests.',
      },
    ],
    valueChainSteps: [
      {
        stage: 'raw_input',
        title: 'FR-4 / Rogers Laminates & Silicon ICs',
        indianReality:
          'Active microcontrollers/MOSFETs largely imported via Mouser/DigiKey/element14 while bare PCBs come from Peenya or Gandhinagar.',
        typicalMarginPercent: '8% – 14%',
      },
      {
        stage: 'sub_assembly',
        title: 'SMT Stencil, Reflow & Wave Soldering',
        indianReality:
          'Contract EMS vendors in Noida, Chennai, and Pune run 0402/QFN/BGA placement with lead-free SAC305 profiles.',
        typicalMarginPercent: '12% – 18%',
      },
      {
        stage: 'integration_qa',
        title: 'AOI, X-Ray & Pogo-Pin ATE Flashing',
        indianReality:
          'Custom test jigs automate SWD/JTAG firmware flashing, rail current draw checks, and serial QR binding.',
        typicalMarginPercent: '18% – 26%',
      },
      {
        stage: 'certification',
        title: 'BIS CRS, WPC ETA & NABL ILAC-MRA Reports',
        indianReality:
          'Testing once at an ILAC-MRA NABL lab (ERTL/TÜV/UL India) generates CB/EMC data reusable for CE/FCC.',
        typicalMarginPercent: '24% – 35% (Defensible)',
      },
      {
        stage: 'export',
        title: 'ESD Packing, RoDTEP & Air Cargo Dispatch',
        indianReality:
          'HSN 8517/8542/9032 shipments clear ICEGATE via BLR/DEL Air Cargo with GST LUT zero-rating and RoDTEP scrips.',
        typicalMarginPercent: '28% – 42% (OEM / Product)',
      },
    ],
    recommendedWorkbenches: [
      {
        label: 'KiCad & EDA Schematic Studio',
        route: '/manufacturing/eda',
        purpose: 'Design multi-layer PCBs with impedance and ERC checks',
      },
      {
        label: 'EMI/EMC Near-Field Pre-Scan',
        route: '/emc',
        purpose: 'Catch CISPR 32 & FCC Part 15B emissions before lab booking',
      },
      {
        label: 'Component Sourcing & Landed Duty',
        route: '/sourcing',
        purpose: 'Compute Indian BCD/IGST landed cost and pin-compatible alternates',
      },
      {
        label: 'SMT Stencil & PCBA Turnkey Estimator',
        route: '/assembly',
        purpose: 'Optimize feeder setup, BOM kitting, and batch PCBA pricing',
      },
    ],
    starterProjectIdeas: [
      {
        title: 'ESP32-S3 RS-485 Industrial Modbus Energy Gateway',
        estimatedCostInr: 4800,
        skillsLearned: ['KiCad 4-layer layout', 'RS-485 galvanic isolation', 'Modbus RTU firmware'],
        exportHook: 'Drop-in factory floor telemetry retrofit for GCC and ASEAN SMEs.',
      },
      {
        title: 'USB-C PD 65W GaN Buck-Boost Bench Power Supply',
        estimatedCostInr: 7900,
        skillsLearned: ['High-frequency SMPS layout', 'Loop compensation', 'Thermal via stitching'],
        exportHook: 'Compact engineering bench tool designed to UL 62368-1 clearances.',
      },
    ],
    careerRoles: [
      {
        title: 'SMT Process & AOI Line Technician',
        entryTrack: 'ITI Electronics Mechanic / Polytechnic ECE',
        indiaSalaryRangeInr: '₹2.4L – ₹5.5L / yr',
      },
      {
        title: 'Hardware PCB Layout & Signal Integrity Engineer',
        entryTrack: 'B.Tech ECE / EEE (NIT / Tier-2)',
        indiaSalaryRangeInr: '₹6L – ₹18L / yr',
      },
      {
        title: 'Embedded Firmware & RTOS Architect',
        entryTrack: 'B.Tech ECE / CSE + bare-metal C portfolio',
        indiaSalaryRangeInr: '₹8L – ₹26L / yr',
      },
      {
        title: 'EMI/EMC & Regulatory Compliance Lead',
        entryTrack: 'B.Tech + NABL / TÜV lab experience',
        indiaSalaryRangeInr: '₹9L – ₹22L / yr',
      },
    ],
  },
  {
    id: 'ev-clean-energy',
    name: 'EV Powertrains, BMS & Clean Energy Storage',
    tagline:
      'High-reliability LFP/NMC battery packs, AIS-156 smart BMS, BLDC/PMSM FOC drives, and solar MPPT microgrids.',
    indiaClusterCities: ['Pune', 'Hosur', 'Bengaluru', 'Chennai', 'Ahmedabad', 'Coimbatore'],
    starterCostRangeInr: { minInr: 3500, maxInr: 15000, label: '₹3,500 – ₹15,000' },
    pilotCostRangeInr: { minInr: 350000, maxInr: 2500000, label: '₹3.5 Lakh – ₹25 Lakh' },
    plantCapexRangeInr: {
      minInr: 40000000,
      maxInr: 2500000000,
      label: '₹4 Cr – ₹250 Cr (Pack / Motor Line)',
    },
    globalExportDemand:
      'USD $55B+ light electric 2W/3W drivetrains, smart BMS boards, solar MPPT controllers, and commercial ESS systems across Africa, ASEAN, GCC, and Europe.',
    keyExportCorridors: ['africa', 'asean', 'uae_gcc', 'eu'],
    keyComplianceStandards: [
      'AIS-156 Amendment 3 (Thermal Runaway)',
      'UN 38.3 Lithium Battery Transport',
      'ISO 11898 CAN Bus & ISO 26262',
      'UL 2580 / IEC 62619 Storage Safety',
      'CE EMC & IP67 Enclosure',
    ],
    jargonDecoder: [
      {
        term: 'BMS (Battery Management System)',
        plainEnglish:
          'Protection and telemetry board tracking every cell voltage/temperature, balancing charge, and isolating faults in milliseconds.',
        whyItMattersInIndia:
          'Summer heatwaves above 45°C make cell-level thermal protection and EIS SoH tracking mandatory under AIS-156.',
      },
      {
        term: 'FOC (Field-Oriented Control)',
        plainEnglish:
          'Real-time vector math splitting 3-phase motor current into torque (Iq) and flux (Id) components for smooth, silent traction.',
        whyItMattersInIndia:
          'Powers India’s top electric scooters and retrofitted 3-wheelers built across Hosur, Pune, and Coimbatore.',
      },
      {
        term: 'AIS-156',
        plainEnglish:
          'ARAI automotive standard enforcing thermal propagation alerts, fuse protection, and water immersion safety on EV battery packs.',
        whyItMattersInIndia:
          'Passing AIS-156 creates immediate export credibility across tropical African and ASEAN 2W/3W markets.',
      },
      {
        term: 'UN 38.3',
        plainEnglish:
          'Eight mandatory UN transport tests (altitude, thermal shock, vibration, impact, crush) required before airlines or ships carry lithium cells.',
        whyItMattersInIndia:
          'Without UN 38.3 test summary and Class 9 DG packaging, customs and freight forwarders block battery exports at port.',
      },
    ],
    valueChainSteps: [
      {
        stage: 'raw_input',
        title: 'LFP/NMC Cells, SiC MOSFETs & Extruded Housings',
        indianReality:
          'Cells graded from domestic/imported lines; aluminum enclosures and copper busbars sourced from Pune/Coimbatore CNC shops.',
        typicalMarginPercent: '10% – 15%',
      },
      {
        stage: 'sub_assembly',
        title: 'Laser Busbar Welding, BMS SMT & Stator Winding',
        indianReality:
          'Automated cell IR sorting, spot/laser nickel-copper tab welding, and high-fill motor stator winding.',
        typicalMarginPercent: '15% – 22%',
      },
      {
        stage: 'integration_qa',
        title: 'EIS Cell Impedance, Thermal Soak & Dyno Load Runs',
        indianReality:
          'Packs undergo charge-discharge cycling and CAN telemetry verification on calibrated dynamometers.',
        typicalMarginPercent: '20% – 28%',
      },
      {
        stage: 'certification',
        title: 'ARAI/ICAT AIS-156, UN 38.3 & UL 2580 Sign-Off',
        indianReality:
          'Full pack certification in Pune/Manesar plus UN 38.3 transport dossier clears international freight lanes.',
        typicalMarginPercent: '25% – 34%',
      },
      {
        stage: 'export',
        title: 'Class 9 DG Crating & FTA Certificate of Origin',
        indianReality:
          'Shipped under HSN 8507/8501 with RVC origin docs under India-UAE CEPA and ASEAN AIFTA for reduced duty.',
        typicalMarginPercent: '26% – 38%',
      },
    ],
    recommendedWorkbenches: [
      {
        label: 'Battery EIS & SoH Diagnostics',
        route: '/battery-eis',
        purpose: 'Model Randles impedance and AIS-156 cell derate thresholds',
      },
      {
        label: 'BLDC / PMSM FOC Motor Simulator',
        route: '/motor-foc',
        purpose: 'Tune Clarke/Park PI loops and field weakening',
      },
      {
        label: 'CAN Bus ISO 11898 Analyzer',
        route: '/can-bus',
        purpose: 'Validate 500 kbps arbitration timing and split termination',
      },
      {
        label: 'Solar MPPT Controller Lab',
        route: '/solar-mppt',
        purpose: 'Simulate high-ambient thermal derating and global MPPT tracking',
      },
    ],
    starterProjectIdeas: [
      {
        title: '4S–16S Smart BMS Telemetry Bridge with CAN 2.0B & SoH Estimator',
        estimatedCostInr: 6500,
        skillsLearned: ['AFE cell voltage sensing', 'Isolated CAN transceiver', 'SoH impedance math'],
        exportHook: 'Fleet-management BMS telemetry add-on for East African and ASEAN e-rickshaws.',
      },
      {
        title: '48V 600W Solar MPPT Charge Controller for Off-Grid Microgrids',
        estimatedCostInr: 9200,
        skillsLearned: ['Synchronous buck power stage', 'P&O MPPT firmware', 'Heatsink thermal sizing'],
        exportHook: 'Exportable DC microgrid charger tuned for hot-climate deployments.',
      },
    ],
    careerRoles: [
      {
        title: 'Battery Pack Assembly & Laser Weld Operator',
        entryTrack: 'ITI Electrician / Fitter + EV Skill Certification',
        indiaSalaryRangeInr: '₹2.5L – ₹5.0L / yr',
      },
      {
        title: 'BMS Embedded Firmware & Safety Engineer',
        entryTrack: 'B.Tech EEE / ECE + CAN/BMS stack',
        indiaSalaryRangeInr: '₹7L – ₹20L / yr',
      },
      {
        title: 'Power Electronics & Traction Inverter Designer',
        entryTrack: 'M.Tech / B.Tech Power Electronics',
        indiaSalaryRangeInr: '₹10L – ₹28L / yr',
      },
      {
        title: 'Homologation & ARAI / UN 38.3 Test Lead',
        entryTrack: 'Diploma / B.Tech Mechanical or Electrical',
        indiaSalaryRangeInr: '₹6.5L – ₹16L / yr',
      },
    ],
  },
  {
    id: 'drones-defense-space',
    name: 'Drones, UAVs, Defense & Space Systems',
    tagline:
      'Indigenous flight controllers, precision carbon composites, agricultural/survey UAVs, and dual-use aerospace payloads.',
    indiaClusterCities: ['Hyderabad', 'Bengaluru', 'Coimbatore', 'Nagpur', 'Chennai', 'Pune'],
    starterCostRangeInr: { minInr: 4500, maxInr: 15000, label: '₹4,500 – ₹15,000' },
    pilotCostRangeInr: { minInr: 500000, maxInr: 4000000, label: '₹5 Lakh – ₹40 Lakh' },
    plantCapexRangeInr: {
      minInr: 30000000,
      maxInr: 1200000000,
      label: '₹3 Cr – ₹120 Cr (AS9100D Composite & Avionics)',
    },
    globalExportDemand:
      'USD $30B+ commercial agri-spraying UAVs, LiDAR mapping drones, CubeSat avionics, and ruggedized non-lethal telemetry across US, EU, GCC, and ASEAN.',
    keyExportCorridors: ['us', 'eu', 'uae_gcc', 'asean'],
    keyComplianceStandards: [
      'DGCA Type Certification & NPNT',
      'DGFT SCOMET Dual-Use Screening',
      'FAA Remote ID (14 CFR Part 89)',
      'AS9100D Aerospace QMS',
      'MIL-STD-810H Environmental & Shock',
    ],
    jargonDecoder: [
      {
        term: 'SCOMET',
        plainEnglish:
          'India’s dual-use export control list overseen by DGFT — high-endurance UAVs, tactical IMUs, and encrypted radios require special clearance.',
        whyItMattersInIndia:
          'Skipping SCOMET screening halts shipments at customs; commercial survey drones under thresholds file formal non-SCOMET declarations.',
      },
      {
        term: 'NPNT (No Permission No Takeoff)',
        plainEnglish:
          'Hardware-enforced cryptographic flight check verifying DigitalSky permission before UAV motors can arm.',
        whyItMattersInIndia:
          'Required for DGCA domestic sales while export variants swap cleanly to FAA Remote ID / EASA C-class firmware.',
      },
      {
        term: 'Prepreg Carbon Composite',
        plainEnglish:
          'Aerospace carbon cloth pre-coated with epoxy resin and cured under vacuum heat to achieve maximum stiffness per gram.',
        whyItMattersInIndia:
          'Composite airframe clusters in Bengaluru, Hyderabad, and Coimbatore fabricate custom monocoque frames in 2–3 weeks.',
      },
      {
        term: 'AS9100D',
        plainEnglish:
          'Aerospace quality standard layering configuration control, FOD prevention, and lot traceability over ISO 9001.',
        whyItMattersInIndia:
          'Unlocks global Tier-1 defense and space offset sub-contracts from US/EU primes.',
      },
    ],
    valueChainSteps: [
      {
        stage: 'raw_input',
        title: 'Carbon Prepreg, 7075-T6 Alloy & Flight IMUs',
        indianReality:
          'Airframe alloys machined locally; high-rate IMUs, RTK GNSS receivers, and BLDC magnets sourced globally.',
        typicalMarginPercent: '12% – 18%',
      },
      {
        stage: 'sub_assembly',
        title: 'Autoclave Layup, 5-Axis Gimbal CNC & Avionics SMT',
        indianReality:
          'Redundant STM32H7 flight controllers and vibration-damped sensor boards built in AS9100D shops.',
        typicalMarginPercent: '18% – 28%',
      },
      {
        stage: 'integration_qa',
        title: 'Thrust-Stand Calibration, HIL Sim & Flight Burn-In',
        indianReality:
          'Every airframe completes hover endurance, EMI compass interference, and failsafe RTL checks.',
        typicalMarginPercent: '24% – 34%',
      },
      {
        stage: 'certification',
        title: 'DGCA Type Cert, SCOMET Clearance & FAA/EASA ID',
        indianReality:
          'PLI Drones rewards 20% value addition while SCOMET / GAED authorization clears legitimate dual-use exports.',
        typicalMarginPercent: '30% – 42%',
      },
      {
        stage: 'export',
        title: 'ATA Carnet Demos, Ruggedized Pelican Kits & Spares',
        indianReality:
          'Exported with UN 38.3 pack documentation, field maintenance manuals, and long-term spares contracts.',
        typicalMarginPercent: '32% – 48%',
      },
    ],
    recommendedWorkbenches: [
      {
        label: 'RF Link & Microstrip Impedance Lab',
        route: '/rf-calc',
        purpose: 'Design 915 MHz / 2.4 GHz / 5.8 GHz telemetry feeds and matching',
      },
      {
        label: 'Flight Telemetry Digital Twin',
        route: '/telemetry',
        purpose: 'Inspect IMU roll/pitch attitude and ESC thermal curves',
      },
      {
        label: 'Firmware Flash & Bootloader Partitioner',
        route: '/firmware',
        purpose: 'Configure dual-bank OTA and signed NPNT/Remote ID partitions',
      },
      {
        label: 'Indian & Global Compliance Matcher',
        route: '/compliance',
        purpose: 'Map DGCA, WPC ETA, and export radio test timelines',
      },
    ],
    starterProjectIdeas: [
      {
        title: 'STM32H7 Flight Telemetry & Vibration Blackbox Logger Shield',
        estimatedCostInr: 8500,
        skillsLearned: ['SPI IMU vibration filtering', 'MAVLink serial telemetry', '4-layer PCB layout'],
        exportHook: 'Drop-in blackbox flight diagnostics board for commercial survey UAV builders.',
      },
      {
        title: 'Static Brushless Thrust-Stand & ESC Efficiency Rig (Up to 15 kgf)',
        estimatedCostInr: 11500,
        skillsLearned: ['HX711 load-cell calibration', 'Optical RPM sensing', 'BLDC thermal logging'],
        exportHook: 'Affordable propulsion QA fixture exportable to drone workshops worldwide.',
      },
    ],
    careerRoles: [
      {
        title: 'Composite Airframe Layup & UAV Rig Technician',
        entryTrack: 'ITI Fitter / Polytechnic Mechanical / DGCA RPTO',
        indiaSalaryRangeInr: '₹2.8L – ₹6.5L / yr',
      },
      {
        title: 'Flight Control & Sensor Fusion Engineer',
        entryTrack: 'B.Tech Aerospace / ECE (PX4 / ArduPilot)',
        indiaSalaryRangeInr: '₹8L – ₹24L / yr',
      },
      {
        title: 'RF Telemetry & Avionics Hardware Designer',
        entryTrack: 'B.Tech / M.Tech RF & Embedded',
        indiaSalaryRangeInr: '₹9L – ₹25L / yr',
      },
      {
        title: 'SCOMET Export & AS9100D Quality Manager',
        entryTrack: 'Engineering Grad + Aerospace QA Audit certification',
        indiaSalaryRangeInr: '₹10L – ₹26L / yr',
      },
    ],
  },
  {
    id: 'robotics-cnc-automation',
    name: 'Industrial Robotics, CNC Machining & Factory Automation',
    tagline:
      'Precision 5-axis machined sub-assemblies, servo actuators, PLC/EtherCAT control panels, and warehouse AMRs.',
    indiaClusterCities: ['Rajkot', 'Coimbatore', 'Pune', 'Bengaluru', 'Ludhiana', 'Faridabad'],
    starterCostRangeInr: { minInr: 3000, maxInr: 14000, label: '₹3,000 – ₹14,000' },
    pilotCostRangeInr: { minInr: 250000, maxInr: 2000000, label: '₹2.5 Lakh – ₹20 Lakh' },
    plantCapexRangeInr: {
      minInr: 20000000,
      maxInr: 800000000,
      label: '₹2 Cr – ₹80 Cr (5-Axis VMC / Cobot Cell)',
    },
    globalExportDemand:
      'USD $65B+ precision machined hydraulic/automotive sub-assemblies, planetary gearboxes, UL 508A control cabinets, and warehouse robotics to EU, US, and ASEAN.',
    keyExportCorridors: ['eu', 'us', 'asean', 'uae_gcc'],
    keyComplianceStandards: [
      'ISO 9001:2015 & PPAP Level 3',
      'IATF 16949 Automotive Tier-1',
      'CE Machinery Directive (2006/42/EC)',
      'UL 508A Industrial Control Panels',
      'ISO 10218 / TS 15066 Cobot Safety',
    ],
    jargonDecoder: [
      {
        term: 'PPAP Level 3',
        plainEnglish:
          '18-element manufacturing proof package (Control Plan, PFMEA, Cpk >= 1.33, Gage R&R) required before EU/US OEMs sign production POs.',
        whyItMattersInIndia:
          'Separates low-margin local job shops in Rajkot/Peenya from high-margin Tier-1 global exporters.',
      },
      {
        term: 'GD&T (Geometric Dimensioning)',
        plainEnglish:
          'Engineering blueprint symbols specifying exact flatness, perpendicularity, and true position within microns.',
        whyItMattersInIndia:
          'Eliminates assembly fit mismatches when parts machined in Coimbatore mate with robotics frames in Germany.',
      },
      {
        term: 'EtherCAT / CANopen',
        plainEnglish:
          'Deterministic real-time industrial fieldbuses keeping multi-axis servos synchronized to the microsecond.',
        whyItMattersInIndia:
          'Core skill bridging mechanical machine tool builders and embedded automation engineers.',
      },
      {
        term: 'CMM Inspection',
        plainEnglish:
          'Coordinate Measuring Machine probing micron tolerances automatically to generate digital inspection certificates.',
        whyItMattersInIndia:
          'Export buyers reject batches lacking CMM dimensional reports tied to steel heat/lot numbers.',
      },
    ],
    valueChainSteps: [
      {
        stage: 'raw_input',
        title: 'EN19 / SS316 Forgings, Castings & Servo Hardware',
        indianReality:
          'World-class grey/SG iron foundries and forging hubs in Rajkot, Kolhapur, and Coimbatore supply base billets.',
        typicalMarginPercent: '8% – 12%',
      },
      {
        stage: 'sub_assembly',
        title: '5-Axis VMC Turning/Milling & Control Panel Wiring',
        indianReality:
          'CNC machining cells paired with UL-rated industrial control cabinet wiring in Pune and Bengaluru.',
        typicalMarginPercent: '15% – 24%',
      },
      {
        stage: 'integration_qa',
        title: 'CMM Metrology, Profilometry & 48-Hr Endurance Run',
        indianReality:
          'Statistical process control (SPC) and laser interferometry validate repeatability prior to crating.',
        typicalMarginPercent: '20% – 28%',
      },
      {
        stage: 'certification',
        title: 'PPAP Level 3, IATF 16949 & CE Machinery / UL 508A',
        indianReality:
          'Material Mill Test Certificates (EN 10204 3.1) and CE safety relays pass European/US factory audits.',
        typicalMarginPercent: '24% – 35%',
      },
      {
        stage: 'export',
        title: 'VCI Anti-Rust Vacuum Packing & Sea Consolidation',
        indianReality:
          'ISPM-15 fumigated pallets shipped via Mundra, Nhava Sheva, or Chennai under HSN 8483/8537.',
        typicalMarginPercent: '26% – 38%',
      },
    ],
    recommendedWorkbenches: [
      {
        label: 'BLDC / Servo Motor FOC Simulator',
        route: '/motor-foc',
        purpose: 'Optimize servo current bandwidth and torque ripple',
      },
      {
        label: 'Thermal & Cold-Plate Profiler',
        route: '/thermal',
        purpose: 'Size heatsinks for compact industrial servo drives',
      },
      {
        label: 'Manufacturing RFQ & DFM Desk',
        route: '/manufacturing/rfq',
        purpose: 'Structure tolerance-checked BOMs and vendor RFQs',
      },
      {
        label: 'CANopen / ISO 11898 Bus Lab',
        route: '/can-bus',
        purpose: 'Verify industrial fieldbus timing and differential noise margins',
      },
    ],
    starterProjectIdeas: [
      {
        title: 'ESP32-Based CNC Spindle Vibration & Tool-Wear Monitor',
        estimatedCostInr: 4200,
        skillsLearned: ['3-axis MEMS FFT vibration', 'CT spindle current sensing', '24V industrial surge IO'],
        exportHook: 'Retrofittable IIoT downtime-prevention sensor for legacy machine shops.',
      },
      {
        title: 'Closed-Loop NEMA 23 BLDC/Stepper CANopen Joint Actuator',
        estimatedCostInr: 10800,
        skillsLearned: ['Magnetic encoder FOC', 'CNC bracket DFM', 'CAN fieldbus protocol'],
        exportHook: 'Modular cobot and pick-and-place actuator for global automation integrators.',
      },
    ],
    careerRoles: [
      {
        title: 'CNC VMC Setter & CMM Metrology Operator',
        entryTrack: 'ITI Turner / Machinist + NAPS Apprenticeship',
        indiaSalaryRangeInr: '₹2.6L – ₹6.0L / yr',
      },
      {
        title: 'PLC / SCADA & Industrial Robotics Integrator',
        entryTrack: 'Polytechnic Diploma / B.Tech Mechatronics',
        indiaSalaryRangeInr: '₹4.5L – ₹14L / yr',
      },
      {
        title: 'Manufacturing & PPAP Quality Assurance Engineer',
        entryTrack: 'B.Tech Mechanical / Production + Six Sigma',
        indiaSalaryRangeInr: '₹6L – ₹16L / yr',
      },
      {
        title: 'Autonomous Mobile Robot (AMR) Navigation Lead',
        entryTrack: 'B.Tech / M.Tech Robotics (ROS2 / SLAM)',
        indiaSalaryRangeInr: '₹12L – ₹30L / yr',
      },
    ],
  },
  {
    id: 'medtech-diagnostics',
    name: 'MedTech, Point-of-Care Diagnostics & Biomedical Hardware',
    tagline:
      'Affordable point-of-care diagnostic analyzers, patient monitors, microfluidics, and ISO 13485 surgical devices.',
    indiaClusterCities: ['Hyderabad', 'Bengaluru', 'Visakhapatnam', 'Pune', 'Vadodara', 'Baddi'],
    starterCostRangeInr: { minInr: 3500, maxInr: 15000, label: '₹3,500 – ₹15,000' },
    pilotCostRangeInr: { minInr: 450000, maxInr: 3500000, label: '₹4.5 Lakh – ₹35 Lakh' },
    plantCapexRangeInr: {
      minInr: 30000000,
      maxInr: 1000000000,
      label: '₹3 Cr – ₹100 Cr (ISO 13485 Cleanroom)',
    },
    globalExportDemand:
      'USD $38B+ point-of-care blood/ECG diagnostics, portable oxygen/ICU gear, and validated consumables exported to Africa, ASEAN, EU, and the US.',
    keyExportCorridors: ['africa', 'asean', 'eu', 'us'],
    keyComplianceStandards: [
      'CDSCO Medical Device Rules 2017 (Class A–D)',
      'ISO 13485:2016 Medical QMS',
      'IEC 60601-1 & 60601-1-2 (Safety & EMC)',
      'EU MDR (2017/745) CE Class IIa',
      'US FDA 510(k) & 21 CFR 820',
    ],
    jargonDecoder: [
      {
        term: 'IEC 60601-1',
        plainEnglish:
          'Patient electrical safety standard limiting micro-amp leakage current and enforcing reinforced 4 kV patient isolation barriers.',
        whyItMattersInIndia:
          'Even battery-powered wearables plugged into wall chargers must pass IEC 60601 creepage rules to export.',
      },
      {
        term: 'ISO 13485',
        plainEnglish:
          'Medical-grade quality system requiring Design History Files (DHF), cleanroom controls, and full CAPA lot traceability.',
        whyItMattersInIndia:
          'AMTZ Visakhapatnam and Hyderabad MedTech parks offer shared ISO 13485 facilities lowering startup capex.',
      },
      {
        term: 'CDSCO Class A–D',
        plainEnglish:
          'India’s statutory risk tiers spanning Class A low-risk swabs/stethoscopes through Class C/D ventilators and implants.',
        whyItMattersInIndia:
          'Exporting requires CDSCO Free Sale Certificate alongside target buyer country clearance.',
      },
      {
        term: 'US FDA 510(k)',
        plainEnglish:
          'Premarket submission demonstrating your diagnostic device is substantially equivalent to a legally marketed US device.',
        whyItMattersInIndia:
          'High-margin US hospital contracts become accessible once NABL IEC 60601 + clinical validation packs are complete.',
      },
    ],
    valueChainSteps: [
      {
        stage: 'raw_input',
        title: 'Medical Polymers, Biosensors & Isolated AFEs',
        indianReality:
          'USP Class VI resins and medical micro-pumps paired with specialized analog front-end ICs.',
        typicalMarginPercent: '10% – 16%',
      },
      {
        stage: 'sub_assembly',
        title: 'ISO Class 7/8 Cleanroom & Microfluidic Bonding',
        indianReality:
          'Cleanroom SMT conformal coating, laser microfluidic welding, and ultrasonic plastic sealing at AMTZ/Hyderabad.',
        typicalMarginPercent: '20% – 30%',
      },
      {
        stage: 'integration_qa',
        title: '4 kV Hipot Leakage & Clinical Phantom Validation',
        indianReality:
          'Every unit passes automated electrical leakage, optical calibration, and sensitivity/specificity trials.',
        typicalMarginPercent: '28% – 38%',
      },
      {
        stage: 'certification',
        title: 'CDSCO License, ISO 13485, EU MDR & FDA 510(k)',
        indianReality:
          'NABL ILAC-MRA IEC 60601-1 reports accelerate EU Notified Body, FDA, and African MOH registrations.',
        typicalMarginPercent: '35% – 50%',
      },
      {
        stage: 'export',
        title: 'UDI Lot Serialization & Ministry / Tender Supply',
        indianReality:
          'Dispatched under HSN 9018 with KEBS/HSA/FDA pre-clearance and cold-pack reagent logistics.',
        typicalMarginPercent: '38% – 55%',
      },
    ],
    recommendedWorkbenches: [
      {
        label: 'CDSCO & IEC 60601 Compliance Planner',
        route: '/compliance',
        purpose: 'Map NABL medical safety testing timelines and CDSCO fees',
      },
      {
        label: 'Clinical Telemetry & Biopotential Lab',
        route: '/telemetry',
        purpose: 'Inspect ECG/SpO2 waveform SNR and anomaly thresholds',
      },
      {
        label: 'IP Defense & Prior-Art Ledger',
        route: '/network/ip',
        purpose: 'Publish defensive disclosures and check Freedom-to-Operate',
      },
      {
        label: 'NABL Testbed & Lab Booking',
        route: '/testbeds',
        purpose: 'Reserve pre-compliance EMC and electrical safety testbeds',
      },
    ],
    starterProjectIdeas: [
      {
        title: 'Isolated 3-Lead ECG & PPG Optical Heart-Rate Analog Front-End Board',
        estimatedCostInr: 5800,
        skillsLearned: ['ADS1293 biopotential AFE', '4 kV galvanic isolation', '50 Hz notch DSP'],
        exportHook: 'Affordable rural telehealth screening module for Africa and South-East Asia.',
      },
      {
        title: 'Automated Portable Peristaltic Microfluidic Sample Mixer',
        estimatedCostInr: 8900,
        skillsLearned: ['Precision stepper flow control', 'Optical turbidity feedback', 'Cleanable housing'],
        exportHook: 'Point-of-care diagnostic bench prep unit for Tier-2 clinics globally.',
      },
    ],
    careerRoles: [
      {
        title: 'Cleanroom Medical Device Assembly Technician',
        entryTrack: 'ITI / Diploma Electronics or Biomedical',
        indiaSalaryRangeInr: '₹2.4L – ₹5.2L / yr',
      },
      {
        title: 'Biomedical Analog & Embedded Signal Engineer',
        entryTrack: 'B.Tech Biomedical / ECE',
        indiaSalaryRangeInr: '₹7L – ₹19L / yr',
      },
      {
        title: 'Regulatory Affairs & ISO 13485 QMS Specialist',
        entryTrack: 'M.Pharm / B.Tech Biotech + Regulatory Cert',
        indiaSalaryRangeInr: '₹8L – ₹22L / yr',
      },
      {
        title: 'Clinical Validation & Microfluidics R&D Lead',
        entryTrack: 'M.Tech / PhD Bioengineering',
        indiaSalaryRangeInr: '₹12L – ₹28L / yr',
      },
    ],
  },
  {
    id: 'consumer-hardware-appliances',
    name: 'Consumer Hardware, Smart Appliances & Audio Tech',
    tagline:
      'High-volume D2C hardware: steel injection molds, Matter/Wi-Fi smart appliances, BLDC fans, and audio/wearables.',
    indiaClusterCities: ['Noida', 'Pune', 'Sriperumbudur', 'Bhiwadi', 'Bengaluru', 'Ahmedabad'],
    starterCostRangeInr: { minInr: 2200, maxInr: 13500, label: '₹2,200 – ₹13,500' },
    pilotCostRangeInr: { minInr: 200000, maxInr: 1800000, label: '₹2 Lakh – ₹18 Lakh (Tooling)' },
    plantCapexRangeInr: {
      minInr: 15000000,
      maxInr: 600000000,
      label: '₹1.5 Cr – ₹60 Cr (Molding + Final Pack)',
    },
    globalExportDemand:
      'USD $80B+ energy-efficient BLDC appliances, smart kitchen electronics, Matter home switches, and rugged audio exported to GCC, US, EU, and ASEAN.',
    keyExportCorridors: ['uae_gcc', 'us', 'eu', 'asean'],
    keyComplianceStandards: [
      'BIS CRS & BEE Star Energy Labeling',
      'UL 62368-1 / UL 1026 Appliances',
      'FCC Part 15B/C & Matter Certification',
      'UAE ECAS / G-Mark & TDRA',
      'CE LVD / EMC / ErP EcoDesign',
    ],
    jargonDecoder: [
      {
        term: 'Injection Mold Tooling',
        plainEnglish:
          'Precision P20/H13 hardened steel cavities that stamp molten plastic granules into identical consumer housings in 20 seconds.',
        whyItMattersInIndia:
          'Tool rooms in Pune, Noida, and Ahmedabad charge ₹2.5L–₹12L upfront, dropping enclosure cost from ₹800 (3D print) to ₹28.',
      },
      {
        term: 'Draft Angle & DFM',
        plainEnglish:
          'Slight 1°–2° wall taper in plastic CAD allowing parts to release cleanly from steel molds without warping.',
        whyItMattersInIndia:
          'Fixing wall-thickness sink marks before cutting steel saves lakhs in mold rework.',
      },
      {
        term: 'Matter over Wi-Fi/Thread',
        plainEnglish:
          'Unified smart-home protocol letting devices pair seamlessly across Apple Home, Google, and Alexa.',
        whyItMattersInIndia:
          'Pre-certified ESP32/Nordic Matter modules unlock US/EU retail shelves without custom cloud lock-in.',
      },
      {
        term: 'MSRP Multiplier',
        plainEnglish:
          'Target retail price divided by landed manufacturing COGS — healthy retail brands need 3x–4x.',
        whyItMattersInIndia:
          'Protects founders from wiping out margins once Amazon FBA fees, freight, and customs duties hit.',
      },
    ],
    valueChainSteps: [
      {
        stage: 'raw_input',
        title: 'UL94-V0 Polymers, Pre-Cert RF Modules & BLDC Kits',
        indianReality:
          'Flame-retardant ABS/PC and sheet steel sourced domestically; Wi-Fi/BLE SoCs kitted via distribution.',
        typicalMarginPercent: '10% – 15%',
      },
      {
        stage: 'sub_assembly',
        title: 'Multi-Cavity Molding, Stamping & Single-Sided PCBA',
        indianReality:
          'Noida and Bhiwadi hubs excel at fast plastic molding combined with cost-optimized CEM-1/FR-4 PCB assembly.',
        typicalMarginPercent: '15% – 22%',
      },
      {
        stage: 'integration_qa',
        title: 'Drop Testing, Acoustic dB & Automated EOL Bench',
        indianReality:
          'Packaging drop tests (ISTA 2A), wattage checks, and barcoded warranty QR generation.',
        typicalMarginPercent: '20% – 28%',
      },
      {
        stage: 'certification',
        title: 'ECAS / G-Mark, UL / FCC & CE EcoDesign Compliance',
        indianReality:
          'Using pre-certified wireless modules cuts international RF/EMC lab bills by $4,500+ and 6 weeks.',
        typicalMarginPercent: '25% – 34%',
      },
      {
        stage: 'export',
        title: 'FBA Palletization, Retail Packaging & CEPA/Global Shipping',
        indianReality:
          'Shipped under HSN 8504/8516/8414 to Dubai Jebel Ali, Rotterdam, and Amazon US/EU fulfillment centers.',
        typicalMarginPercent: '30% – 45% (Brand D2C)',
      },
    ],
    recommendedWorkbenches: [
      {
        label: 'Hardware Teardowns & BOM Markup',
        route: '/teardowns',
        purpose: 'Study real Indian product margins, plastics, and enclosure DFM',
      },
      {
        label: 'Prototype Architect & EVT-PVT Planner',
        route: '/prototype',
        purpose: 'Map 3D print EVT to steel mold tooling DVT milestones',
      },
      {
        label: 'Milestone Crowdfunding Launchpad',
        route: '/launchpad',
        purpose: 'Validate pre-orders and non-dilutive hardware grants',
      },
      {
        label: 'BLDC Appliance Motor Simulator',
        route: '/motor-foc',
        purpose: 'Optimize ultra-quiet sinusoidal motor control for energy labels',
      },
    ],
    starterProjectIdeas: [
      {
        title: 'Matter-over-Wi-Fi Smart Energy Plug with BL0937 Metering',
        estimatedCostInr: 2800,
        skillsLearned: ['AC mains creepage rules', 'Matter SDK firmware', 'UL94-V0 enclosure CAD'],
        exportHook: 'Exportable smart-home retrofit plug for UAE and European e-commerce.',
      },
      {
        title: 'Silent BLDC Desk Air Purifier with PM2.5 Laser Sensor',
        estimatedCostInr: 6400,
        skillsLearned: ['Acoustic duct CAD', 'BLDC PWM fan curve', 'PM2.5 UART telemetry'],
        exportHook: 'Compact urban wellness appliance ready for MENA & SEA retail launch.',
      },
    ],
    careerRoles: [
      {
        title: 'Injection Molding & Tool-Room Technician',
        entryTrack: 'NTTF / CIPET / ITI Tool & Die Maker',
        indiaSalaryRangeInr: '₹2.8L – ₹7.0L / yr',
      },
      {
        title: 'Industrial & Mechanical Enclosure Designer',
        entryTrack: 'B.Des / B.Tech Mechanical (SolidWorks / Creo)',
        indiaSalaryRangeInr: '₹6L – ₹18L / yr',
      },
      {
        title: 'Consumer IoT & Matter Firmware Engineer',
        entryTrack: 'B.Tech ECE / CSE',
        indiaSalaryRangeInr: '₹8L – ₹22L / yr',
      },
      {
        title: 'D2C Hardware Product & Sourcing Manager',
        entryTrack: 'Engineering + Supply Chain / Ops',
        indiaSalaryRangeInr: '₹10L – ₹26L / yr',
      },
    ],
  },
  {
    id: 'technical-textiles-apparel',
    name: 'Technical Textiles, Smart Apparel & Med/Geo Textiles',
    tagline:
      'High-performance flame-retardant PPE, spunbond medical nonwovens, geotextiles, and conductive smart garments.',
    indiaClusterCities: ['Tiruppur', 'Surat', 'Coimbatore', 'Panipat', 'Ichalkaranji', 'Bhilwara'],
    starterCostRangeInr: { minInr: 2000, maxInr: 12000, label: '₹2,000 – ₹12,000' },
    pilotCostRangeInr: { minInr: 150000, maxInr: 1500000, label: '₹1.5 Lakh – ₹15 Lakh' },
    plantCapexRangeInr: {
      minInr: 18000000,
      maxInr: 750000000,
      label: '₹1.8 Cr – ₹75 Cr (Nonwoven / Shuttleless Loom)',
    },
    globalExportDemand:
      'USD $45B+ arc-flash/flame PPE, medical barrier nonwovens, civil geotextiles, and wearable smart-sensor garments exported to EU, US, UAE, and Africa.',
    keyExportCorridors: ['eu', 'us', 'uae_gcc', 'africa'],
    keyComplianceStandards: [
      'OEKO-TEX Standard 100 & GOTS',
      'EU PPE Regulation (EN ISO 11612 Flame)',
      'REACH SVHC Chemical Restrictions',
      'ASTM F1670/F1671 Medical Barrier',
      'EU Digital Product Passport (ESPR)',
    ],
    jargonDecoder: [
      {
        term: 'GSM & Denier',
        plainEnglish:
          'Fabric weight in grams per square meter (GSM) and individual filament thickness (Denier) dictating strength and drape.',
        whyItMattersInIndia:
          'Precision technical buyers specify ±3% GSM tolerances rather than generic cloth grades.',
      },
      {
        term: 'Spunbond / Meltblown Nonwoven',
        plainEnglish:
          'Directly extruded micro-fiber polymer webs bonded thermally without spinning yarn — core of surgical barriers and filtration.',
        whyItMattersInIndia:
          'Coimbatore (SITRA) and Surat lead India’s rapid shift into medical, hygiene, and agro nonwovens.',
      },
      {
        term: 'OEKO-TEX Standard 100',
        plainEnglish:
          'Independent toxicology lab certification proving zero banned azo dyes, heavy metals, or PFAS chemicals.',
        whyItMattersInIndia:
          'Mandatory gatekeeper for Tier-1 European apparel and protective wear importers.',
      },
      {
        term: 'Conductive E-Textile Yarn',
        plainEnglish:
          'Silver-plated nylon or carbon-doped threads sewn directly into fabrics to carry power and biometric sensor signals.',
        whyItMattersInIndia:
          'Bridges Tiruppur knitwear strength with Bengaluru embedded electronics for high-value smart safety gear.',
      },
    ],
    valueChainSteps: [
      {
        stage: 'raw_input',
        title: 'Aramid, rPET Chips, Organic Cotton & Conductive Yarn',
        indianReality:
          'Surat leads man-made filament yarns while Coimbatore/Tiruppur command combed organic cotton and technical blends.',
        typicalMarginPercent: '8% – 14%',
      },
      {
        stage: 'sub_assembly',
        title: 'Air-Jet Weaving, Circular Knitting & Functional Coating',
        indianReality:
          'Flame-retardant finishes, hydrophobic PTFE-free membranes, and snap-on e-textile embroidery.',
        typicalMarginPercent: '14% – 22%',
      },
      {
        stage: 'integration_qa',
        title: 'Martindale Abrasion, Tear & Hydrostatic Lab Testing',
        indianReality:
          'ATIRA/SITRA/BTTRA textile research centers run accredited physical and chemical barrier tests.',
        typicalMarginPercent: '18% – 26%',
      },
      {
        stage: 'certification',
        title: 'OEKO-TEX 100, REACH SVHC & EN ISO 11612 PPE',
        indianReality:
          'Digital Product Passport QR tracking + CE PPE module certifications enable high-value EU tender bids.',
        typicalMarginPercent: '24% – 35%',
      },
      {
        stage: 'export',
        title: 'Vacuum-Baled Dispatch, RoSCTL / RoDTEP & CEPA',
        indianReality:
          'India-UAE CEPA grants 0% preferential duty into GCC while EU/US orders move via Tuticorin and Hazira ports.',
        typicalMarginPercent: '26% – 40%',
      },
    ],
    recommendedWorkbenches: [
      {
        label: 'Wearable E-Textile PCB Bench',
        route: '/manufacturing/pcb',
        purpose: 'Design compact washable snap-connector sensor PCBs',
      },
      {
        label: 'Biometric Wearable Telemetry Viewer',
        route: '/telemetry',
        purpose: 'Stream sweat, posture, and heat-stress wearable data',
      },
      {
        label: 'Export Compliance & REACH Checker',
        route: '/compliance',
        purpose: 'Audit wearable radio, battery, and RoHS/REACH mandates',
      },
      {
        label: 'Component & Sensor Sourcing',
        route: '/sourcing',
        purpose: 'Compare landed prices for IMU, temperature, and BLE modules',
      },
    ],
    starterProjectIdeas: [
      {
        title: 'Washable Conductive-Yarn Heat-Stress & Posture Safety Vest',
        estimatedCostInr: 4900,
        skillsLearned: ['Silver-nylon lockstitch routing', 'Snap-on BLE sensor pod', 'Skin-temp telemetry'],
        exportHook: 'Worker heat-stroke prevention vest for GCC construction and industrial buyers.',
      },
      {
        title: 'Capacitive Moisture-Sensing Agro-Geotextile Mulch Mat',
        estimatedCostInr: 6200,
        skillsLearned: ['Nonwoven needle-punch layers', 'Capacitive moisture bridge', 'Solar LoRa logging'],
        exportHook: 'Water-saving smart geotextile for arid farms in UAE and East Africa.',
      },
    ],
    careerRoles: [
      {
        title: 'Shuttleless Loom / Circular Knit Master Technician',
        entryTrack: 'ITI Textile / Diploma Textile Technology',
        indiaSalaryRangeInr: '₹2.5L – ₹6.0L / yr',
      },
      {
        title: 'Technical Textile Coating & Polymer Chemist',
        entryTrack: 'B.Tech Textile Chemistry (ICT / DKTE / PSG)',
        indiaSalaryRangeInr: '₹5.5L – ₹14L / yr',
      },
      {
        title: 'Wearable E-Textiles & Smart Garment Engineer',
        entryTrack: 'B.Des Apparel + ECE / Embedded minor',
        indiaSalaryRangeInr: '₹6.5L – ₹17L / yr',
      },
      {
        title: 'EU/US Export Compliance & Sustainability Lead',
        entryTrack: 'MBA / Textile Tech + OEKO-TEX/ESG audit',
        indiaSalaryRangeInr: '₹8L – ₹20L / yr',
      },
    ],
  },
  {
    id: 'agro-food-coldchain',
    name: 'Agro-Processing, Precision Cold-Chain & Food Engineering',
    tagline:
      'Solar off-grid cold rooms, EN 12830 reefer loggers, optical spice sorters, and FSSAI/BRCGS export processing lines.',
    indiaClusterCities: ['Nashik', 'Pune', 'Indore', 'Guntur', 'Coimbatore', 'Kochi'],
    starterCostRangeInr: { minInr: 2500, maxInr: 13000, label: '₹2,500 – ₹13,000' },
    pilotCostRangeInr: { minInr: 180000, maxInr: 1600000, label: '₹1.8 Lakh – ₹16 Lakh' },
    plantCapexRangeInr: {
      minInr: 15000000,
      maxInr: 500000000,
      label: '₹1.5 Cr – ₹50 Cr (Solar Cold Room / IQF)',
    },
    globalExportDemand:
      'USD $35B+ solar-hybrid cold storage units, automated optical food sorters, reefer telemetry hardware, and value-added spices/dehydrated produce for GCC, EU, US, and Africa.',
    keyExportCorridors: ['uae_gcc', 'eu', 'us', 'africa'],
    keyComplianceStandards: [
      'FSSAI & APEDA Export Registration',
      'US FDA FSMA / FSVP',
      'ISO 22000 & HACCP Cold-Chain',
      'BRCGS Food Safety / GlobalG.A.P.',
      'EN 12830 Cold-Chain Temperature Recorders',
    ],
    jargonDecoder: [
      {
        term: 'PCM (Phase Change Material)',
        plainEnglish:
          'Thermal battery gel packs freezing during sunny hours to hold 2°C–8°C all night without diesel generators.',
        whyItMattersInIndia:
          'Makes farm-gate pre-cooling viable across rural Maharashtra, MP, and East Africa where grid power flickers.',
      },
      {
        term: 'EN 12830',
        plainEnglish:
          'Strict EU calibration standard certifying cold-chain loggers maintain ±0.5°C accuracy across transit temperatures.',
        whyItMattersInIndia:
          'Indian cold-chain hardware startups need EN 12830 + NABL traceable calibration certificates to win EU pharma/grape lanes.',
      },
      {
        term: 'HACCP',
        plainEnglish:
          'Hazard Analysis Critical Control Points — auditable log proving moisture, metal contaminants, and temperature stayed safe.',
        whyItMattersInIndia:
          'Required by UAE, US FDA, and European supermarket chains before onboarding agro-processing equipment or exporters.',
      },
      {
        term: 'IQF (Individual Quick Freezing)',
        plainEnglish:
          'Rapid blast freezing keeping fruits, spices, and seafood separated without cell-damaging ice blocks.',
        whyItMattersInIndia:
          'Boosts export realization 2x–3x over raw commodity crop exports.',
      },
    ],
    valueChainSteps: [
      {
        stage: 'raw_input',
        title: 'SS304/316 Food Steel, PUF Panels & Temp Sensors',
        indianReality:
          'Food-grade stainless fabrication in Pune/Indore paired with Sensirion/Pt1000 calibration sensors.',
        typicalMarginPercent: '10% – 15%',
      },
      {
        stage: 'sub_assembly',
        title: 'Solar DC Compressors, Optical Sorters & IP67 Loggers',
        indianReality:
          'Variable-speed BLDC compressors and edge-vision cameras assembled for dusty packhouse environments.',
        typicalMarginPercent: '16% – 24%',
      },
      {
        stage: 'integration_qa',
        title: 'NABL Thermal Calibration & Food-Contact Washdown QA',
        indianReality:
          'Full 72-hour heat-load soak tests at 48°C ambient simulating Rajasthan/Gulf summer transit.',
        typicalMarginPercent: '20% – 28%',
      },
      {
        stage: 'certification',
        title: 'FSSAI / APEDA, HACCP, EN 12830 & FDA FSMA',
        indianReality:
          'Digital excursion PDFs + phytosanitary and NABL calibration certificates clear port inspection.',
        typicalMarginPercent: '26% – 36%',
      },
      {
        stage: 'export',
        title: 'Reefer Telemetry Dispatch & Global FPO Deployment',
        indianReality:
          'Shipped to GCC cold hubs, East African agri-cooperatives, and US/EU specialty food importers.',
        typicalMarginPercent: '28% – 42%',
      },
    ],
    recommendedWorkbenches: [
      {
        label: 'Solar DC Refrigeration & MPPT Lab',
        route: '/solar-mppt',
        purpose: 'Size solar arrays for off-grid farm-gate cold storage',
      },
      {
        label: 'Cold-Chain Telemetry Digital Twin',
        route: '/telemetry',
        purpose: 'Monitor thermal excursions and compressor duty cycles',
      },
      {
        label: 'Thermal Heat-Load & Heatsink Modeler',
        route: '/thermal',
        purpose: 'Simulate ambient condenser dissipation in 50°C environments',
      },
      {
        label: 'NABL Chamber & Testbed Booking',
        route: '/testbeds',
        purpose: 'Schedule EN 12830 thermal chamber calibration checks',
      },
    ],
    starterProjectIdeas: [
      {
        title: 'EN 12830-Grade Cellular/BLE Cold-Chain Reefer Data Logger',
        estimatedCostInr: 4400,
        skillsLearned: ['Pt1000 precision bridge', 'Ultra-low-power sleep firmware', 'Tamper-evident CSV logs'],
        exportHook: 'Export-crate compliance logger for fresh produce and pharma shippers.',
      },
      {
        title: 'Edge-Vision Optical Defect Sorter for Spices & Pulses',
        estimatedCostInr: 11200,
        skillsLearned: ['Conveyor stepper sync', 'Camera color thresholding', 'Solenoid air-ejector timing'],
        exportHook: 'Affordable automated grading machine for FPOs and African agro-exporters.',
      },
    ],
    careerRoles: [
      {
        title: 'RAC (Refrigeration & Cold-Chain) Field Technician',
        entryTrack: 'ITI Refrigeration & AC / Polytechnic Mechanical',
        indiaSalaryRangeInr: '₹2.4L – ₹5.5L / yr',
      },
      {
        title: 'Food Processing Automation & Mechatronics Engineer',
        entryTrack: 'B.Tech Food Tech / Mechatronics (NIFTEM / Tier-2)',
        indiaSalaryRangeInr: '₹5.5L – ₹14L / yr',
      },
      {
        title: 'Cold-Chain IoT Firmware & Calibration Engineer',
        entryTrack: 'B.Tech ECE / Instrumentation',
        indiaSalaryRangeInr: '₹6.5L – ₹16L / yr',
      },
      {
        title: 'HACCP / BRCGS & APEDA Export QA Lead',
        entryTrack: 'M.Sc Food Science / Microbiology',
        indiaSalaryRangeInr: '₹7L – ₹18L / yr',
      },
    ],
  },
  {
    id: 'specialty-materials-chemicals',
    name: 'Specialty Chemicals, Composites, Polymers & Battery Materials',
    tagline:
      'REACH-compliant chemical intermediates, battery precursors, thermal interface silicones, and ZLD clean-chemistry.',
    indiaClusterCities: ['Vapi', 'Ankleshwar', 'Dahej', 'Vadodara', 'Chennai', 'Visakhapatnam'],
    starterCostRangeInr: { minInr: 2500, maxInr: 14000, label: '₹2,500 – ₹14,000' },
    pilotCostRangeInr: { minInr: 300000, maxInr: 3000000, label: '₹3 Lakh – ₹30 Lakh' },
    plantCapexRangeInr: {
      minInr: 35000000,
      maxInr: 1800000000,
      label: '₹3.5 Cr – ₹180 Cr (GMP Reactor / ZLD)',
    },
    globalExportDemand:
      'USD $50B+ global China+1 contract synthesis of agro/pharma intermediates, LFP cathode precursors, silicone TIMs, and conformal electronics coatings for EU, US, and ASEAN.',
    keyExportCorridors: ['eu', 'us', 'asean', 'uae_gcc'],
    keyComplianceStandards: [
      'EU REACH Registration & Only Representative',
      'GHS 16-Section SDS & IMDG Marine Code',
      'US EPA TSCA Inventory Compliance',
      'ISO 9001 / ISO 14001 / ZED Zero Defect',
      'RoHS 3 & UL 94 V-0 Flame Rating',
    ],
    jargonDecoder: [
      {
        term: 'EU REACH',
        plainEnglish:
          'Strict European chemical safety law requiring >1 tonne/year exporters to register toxicity and environmental dossiers via an EU representative.',
        whyItMattersInIndia:
          'Gujarat exporters with pre-registered REACH dossiers command 25%–40% higher European contract margins.',
      },
      {
        term: 'CAS No. & 16-Section SDS',
        plainEnglish:
          'Global chemical fingerprint ID paired with a mandatory safety sheet detailing flash points, spill PPE, and maritime hazard class.',
        whyItMattersInIndia:
          'Customs and shipping lines automatically hold drums or potting resins lacking compliant GHS SDS documents.',
      },
      {
        term: 'TIM (Thermal Interface Material)',
        plainEnglish:
          'Engineered silicone gap pads and phase-change pastes conducting heat safely out of EV battery cells and power ICs.',
        whyItMattersInIndia:
          'Massive domestic + export import-substitution opportunity replacing high-cost foreign thermal compounds.',
      },
      {
        term: 'ZLD (Zero Liquid Discharge)',
        plainEnglish:
          'Closed-loop wastewater recovery recycling 95%+ process water with zero polluted effluent release.',
        whyItMattersInIndia:
          'Essential environmental license and ESG badge demanded by Western chemical and electronics buyers.',
      },
    ],
    valueChainSteps: [
      {
        stage: 'raw_input',
        title: 'Dahej Petrochemical Feedstocks & Mineral Precursors',
        indianReality:
          'Refinery hubs in Gujarat and Visakhapatnam provide base solvents, aromatics, and specialty monomers.',
        typicalMarginPercent: '10% – 16%',
      },
      {
        stage: 'sub_assembly',
        title: 'Continuous-Flow Synthesis, Degassing & Compounding',
        indianReality:
          'Precision batch and micro-reactors in Ankleshwar/Vapi synthesize high-purity grades with tight moisture control.',
        typicalMarginPercent: '18% – 28%',
      },
      {
        stage: 'integration_qa',
        title: 'GC-MS / HPLC Purity Assay & Thermal Conductivity QA',
        indianReality:
          'Certificate of Analysis (CoA) per drum verifying ppm impurity limits, viscosity, and UL 94 flame retardancy.',
        typicalMarginPercent: '24% – 34%',
      },
      {
        stage: 'certification',
        title: 'EU REACH, US TSCA, RoHS 3 & UN IMDG Clearance',
        indianReality:
          'Clean REACH/TSCA legal filings and UN-certified packaging prevent costly European border rejections.',
        typicalMarginPercent: '30% – 42%',
      },
      {
        stage: 'export',
        title: 'UN HDPE/Steel Drums, IBC Totes & Hazira/Mundra Dispatch',
        indianReality:
          'Exported under HSN 28/29/38/39 with Advance Authorization duty-free raw material imports.',
        typicalMarginPercent: '32% – 46%',
      },
    ],
    recommendedWorkbenches: [
      {
        label: 'TIM Conductivity & Thermal Profiler',
        route: '/thermal',
        purpose: 'Compare thermal interface compounds in real heatsink stacks',
      },
      {
        label: 'RF Dielectric Substrate Explorer',
        route: '/rf-calc',
        purpose: 'Evaluate PTFE, Rogers, and FR-4 laminate dielectric losses',
      },
      {
        label: 'Battery Material EIS Impedance Lab',
        route: '/battery-eis',
        purpose: 'Analyze cathode/electrolyte conductivity and degradation',
      },
      {
        label: 'Process Physics & Heat-Transfer Sim',
        route: '/manufacturing/physics',
        purpose: 'Model reactor heat transfer and fluid containment tolerances',
      },
    ],
    starterProjectIdeas: [
      {
        title: 'Guarded Hot-Plate Thermal Conductivity Rig for Silicone TIM Pads',
        estimatedCostInr: 7800,
        skillsLearned: ['ASTM D5470 heat-flux method', 'PID heater control', 'Precision thermocouple DAQ'],
        exportHook: 'Benchtop QA tester for Indian thermal silicone and potting-resin formulators.',
      },
      {
        title: 'Automated pH, ORP & Turbidity Effluent Monitor for ZLD Units',
        estimatedCostInr: 5600,
        skillsLearned: ['Isolated BNC analog front-end', 'RS-485 Modbus logging', 'CPCB compliance alerts'],
        exportHook: 'Low-cost effluent telemetry sensor for SME chemical parks across Asia and Africa.',
      },
    ],
    careerRoles: [
      {
        title: 'Chemical Plant Reactor & DCS Panel Operator',
        entryTrack: 'ITI AOCP / B.Sc Chemistry',
        indiaSalaryRangeInr: '₹2.6L – ₹6.5L / yr',
      },
      {
        title: 'Analytical QA/QC Chemist (HPLC / GC-MS)',
        entryTrack: 'B.Sc / M.Sc Analytical Chemistry',
        indiaSalaryRangeInr: '₹4.2L – ₹11L / yr',
      },
      {
        title: 'Process Scale-Up & Continuous-Flow Engineer',
        entryTrack: 'B.Tech Chemical Engineering (ICT / NIT)',
        indiaSalaryRangeInr: '₹8L – ₹22L / yr',
      },
      {
        title: 'REACH / TSCA Regulatory & EHS Export Manager',
        entryTrack: 'M.Sc / Chemical Eng + Industrial Safety',
        indiaSalaryRangeInr: '₹10L – ₹25L / yr',
      },
    ],
  },
  {
    id: 'rail-marine-heavy-infra',
    name: 'Railways, Marine, Heavy Rolling Stock & Grid Infra',
    tagline:
      'EN 50155 rail electronics, fire-safe metro harnesses, smart grid IEC 61850 switchgear, and marine subsystems.',
    indiaClusterCities: ['Coimbatore', 'Chennai', 'Jamshedpur', 'Pune', 'Visakhapatnam', 'Vadodara'],
    starterCostRangeInr: { minInr: 4000, maxInr: 15000, label: '₹4,000 – ₹15,000' },
    pilotCostRangeInr: { minInr: 500000, maxInr: 4500000, label: '₹5 Lakh – ₹45 Lakh' },
    plantCapexRangeInr: {
      minInr: 50000000,
      maxInr: 2000000000,
      label: '₹5 Cr – ₹200 Cr (Heavy Fabrication & Bogie Shop)',
    },
    globalExportDemand:
      'USD $40B+ metro rolling stock sub-assemblies, EN 45545 fire-safe harnesses, SF6-free grid switchgear, and port/marine automation across Africa, GCC, ASEAN, and EU.',
    keyExportCorridors: ['africa', 'uae_gcc', 'asean', 'eu'],
    keyComplianceStandards: [
      'IRIS ISO/TS 22163 & RDSO Vendor Spec',
      'EN 50155 Railway Rolling Stock Electronics',
      'EN 45545-2 Fire & Smoke Toxicity',
      'IEC 61850 Smart Substation Telemetry',
      'IRS / Lloyd’s Register Marine Approval',
    ],
    jargonDecoder: [
      {
        term: 'EN 50155',
        plainEnglish:
          'Railway electronics standard demanding -40°C to +85°C survival, 10 ms power-dropout hold-up, and high lightning/surge immunity.',
        whyItMattersInIndia:
          'Building for Indian Railways Vande Bharat and Metro tenders directly prepares hardware for global Alstom/Siemens exports.',
      },
      {
        term: 'EN 45545-2',
        plainEnglish:
          'Rail fire-safety norm guaranteeing cables, plastics, and sealants self-extinguish with minimal toxic smoke inside tunnels.',
        whyItMattersInIndia:
          'Zero-halogen cable harness shops in Coimbatore and Chennai leverage this to win European metro exports.',
      },
      {
        term: 'IRIS (ISO/TS 22163)',
        plainEnglish:
          'Global railway industry quality certification auditing RAMS (Reliability, Availability, Maintainability, Safety) and obsolescence tracking.',
        whyItMattersInIndia:
          'Mandatory vendor passport for Indian Tier-1s supplying Europe, MENA, and African rail corridors.',
      },
      {
        term: 'IEC 61850',
        plainEnglish:
          'Digital substation communication protocol synchronizing grid protection relays in under 4 milliseconds.',
        whyItMattersInIndia:
          'Major export opportunity as global utilities modernize aging grids for renewable integration.',
      },
    ],
    valueChainSteps: [
      {
        stage: 'raw_input',
        title: 'Marine/Corten Steel, Halogen-Free Looms & Traction IGBTs',
        indianReality:
          'Structural steels from Jamshedpur/Vizag paired with halogen-free rail-grade harnesses and high-voltage semiconductors.',
        typicalMarginPercent: '10% – 15%',
      },
      {
        stage: 'sub_assembly',
        title: 'Robotic Welding, Harness Looming & Traction Inverters',
        indianReality:
          'Certified EN 15085 rail welders and precision harness shops in Coimbatore, Vadodara, and Chennai.',
        typicalMarginPercent: '16% – 25%',
      },
      {
        stage: 'integration_qa',
        title: 'Ultrasonic Weld NDT, 5 kV Hipot & Vibration Endurance',
        indianReality:
          'Salt-fog marine corrosion testing and full shock/vibration profiles matching rolling-stock axle loads.',
        typicalMarginPercent: '22% – 30%',
      },
      {
        stage: 'certification',
        title: 'IRIS ISO/TS 22163, EN 50155 / 45545-2 & Marine Type Cert',
        indianReality:
          'RDSO field provenance combined with international Lloyd’s/TÜV audits qualifies multi-year export tenders.',
        typicalMarginPercent: '26% – 38%',
      },
      {
        stage: 'export',
        title: 'Breakbulk / Flat-Rack Shipping & ECGC Credit Cover',
        indianReality:
          'Exported under EPC project contracts backed by ECGC political/commercial risk insurance.',
        typicalMarginPercent: '28% – 42%',
      },
    ],
    recommendedWorkbenches: [
      {
        label: 'High-Power Traction Motor FOC Lab',
        route: '/motor-foc',
        purpose: 'Simulate high-inertia traction torque and regenerative braking',
      },
      {
        label: 'Rugged CAN & Vehicle Bus Analyzer',
        route: '/can-bus',
        purpose: 'Verify shielded differential arbitration and error-frame tolerance',
      },
      {
        label: 'EMC Surge & Transient Pre-Scan',
        route: '/emc',
        purpose: 'Design TVS clamping for EN 50155 and IEC 61000-4-5 surges',
      },
      {
        label: 'High-Current Busbar & PCB Trace Calc',
        route: '/copilot',
        purpose: 'Size IPC-2152 power traces and heatsink dissipation',
      },
    ],
    starterProjectIdeas: [
      {
        title: 'EN 50155-Inspired 24V–110V Wide-Input Aux Power & Hold-Up Module',
        estimatedCostInr: 7400,
        skillsLearned: ['Wide-input DC-DC design', '10 ms holdup capacitor sizing', 'Surge TVS protection'],
        exportHook: 'Ruggedized rolling-stock and marine sensor power rail reference design.',
      },
      {
        title: 'Axle-Bearing Temperature & Acoustic Anomaly Predictive Node',
        estimatedCostInr: 9600,
        skillsLearned: ['Differential RTD PT100 bridge', 'Edge vibration FFT', 'IP67 anodized enclosure'],
        exportHook: 'Predictive rail and port-crane safety sensor for African & ASEAN operators.',
      },
    ],
    careerRoles: [
      {
        title: 'NDT Ultrasonic & Structural Welder (MIG/TIG)',
        entryTrack: 'ITI Welder + ASNT Level II Certification',
        indiaSalaryRangeInr: '₹3.0L – ₹7.5L / yr',
      },
      {
        title: 'Rolling Stock Harness & EN 50155 Electronics Engineer',
        entryTrack: 'Polytechnic / B.Tech EEE',
        indiaSalaryRangeInr: '₹5.5L – ₹15L / yr',
      },
      {
        title: 'Traction Power & Grid Switchgear Systems Lead',
        entryTrack: 'B.Tech / M.Tech Electrical Power',
        indiaSalaryRangeInr: '₹10L – ₹25L / yr',
      },
      {
        title: 'IRIS ISO/TS 22163 & Export Tender QA Manager',
        entryTrack: 'B.Tech Mechanical / Electrical + Lead Auditor',
        indiaSalaryRangeInr: '₹11L – ₹28L / yr',
      },
    ],
  },
];

/**
 * Look up full sector pathway metadata by its canonical SectorId.
 */
export function getSectorMeta(id: SectorId | string): SectorPathwayMeta | undefined {
  return SECTOR_PATHWAYS_CORE.find((sector) => sector.id === id);
}

/**
 * Recommend and rank Indian hardware/manufacturing sectors matching a skill, city,
 * compliance standard, or domain keyword. Empty queries return all 10 sectors.
 */
export function recommendSectorsForSkill(keyword: string): SectorPathwayMeta[] {
  const q = keyword.trim().toLowerCase();
  if (!q) {
    return SECTOR_PATHWAYS_CORE;
  }

  const tokens = q.split(/\s+/).filter(Boolean);

  const scored = SECTOR_PATHWAYS_CORE.map((sector) => {
    const highWeightFields = [
      sector.name,
      sector.tagline,
      ...sector.indiaClusterCities,
      ...sector.keyComplianceStandards,
      ...sector.starterProjectIdeas.flatMap((idea) => [
        idea.title,
        ...idea.skillsLearned,
        idea.exportHook,
      ]),
      ...sector.careerRoles.flatMap((role) => [role.title, role.entryTrack]),
    ]
      .join(' ')
      .toLowerCase();

    const mediumWeightFields = [
      sector.globalExportDemand,
      ...sector.jargonDecoder.flatMap((j) => [j.term, j.plainEnglish, j.whyItMattersInIndia]),
      ...sector.valueChainSteps.flatMap((v) => [v.title, v.indianReality]),
    ]
      .join(' ')
      .toLowerCase();

    let score = 0;

    if (highWeightFields.includes(q)) score += 12;
    if (mediumWeightFields.includes(q)) score += 6;

    for (const token of tokens) {
      if (token.length < 2) continue;
      if (highWeightFields.includes(token)) score += 4;
      else if (mediumWeightFields.includes(token)) score += 2;
    }

    return { sector, score };
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((entry) => entry.sector);
}
