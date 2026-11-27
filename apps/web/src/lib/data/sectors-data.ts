import {
  SECTOR_IDS,
  SECTOR_PATHWAYS_CORE,
  getSectorMeta,
  recommendSectorsForSkill,
  type SectorId,
  type SectorPathwayMeta,
} from '@hackerland/core';
import type { ComplianceRoadmapItem } from '@hackerland/core';
import {
  PLANT_BLUEPRINTS,
  type PlantBlueprint,
} from '@/components/domain/how-to-start/how-to-start-data';
import { COMPLIANCE_ROADMAPS } from './compliance-data';
import { ALL_ROADMAPS } from './fixtures/roadmaps';
import {
  BROAD_SECTOR_SPOTLIGHTS,
  FREE_PROTOTYPING_ACCESS,
  FREE_RESOURCES_LIBRARY,
  INDIA_FUNDING_PROGRAMS,
  type PanIndiaSectorSpotlight,
} from './india-ecosystem-data';
import { MUSEUM_EXHIBITS } from './museum-data';
import { FEATURED_BUILD_STORIES } from './stories-data';
import { TEARDOWNS_DATA } from './teardowns-data';
import type { RoadmapView } from './types';

export type RecommendedGrantTag =
  | 'NIDHI-PRAYAS'
  | 'SISFS'
  | 'BIRAC'
  | 'iDEX'
  | 'NTTM'
  | 'MoFPI'
  | 'PMEGP'
  | 'ISM DLI'
  | 'PLI'
  | 'MeitY TIDE 2.0'
  | 'RDSO';

export interface SectorGrantBadgeMeta {
  tag: RecommendedGrantTag;
  fullName: string;
  amountLabel: string;
  equityNote: string;
  noCompanyNeeded: boolean;
  officialUrl: string;
}

export interface SectorZeroCostRoute {
  label: string;
  route: string;
  description: string;
}

export interface SectorVernacularCourse {
  title: string;
  provider: 'NPTEL / SWAYAM' | 'IIT Bombay Spoken Tutorial' | 'Skill India Digital';
  languages: string;
  url: string;
  note: string;
}

export interface SectorAutopsyRef {
  kind: 'story' | 'teardown' | 'museum';
  slug: string;
  takeaway: string;
}

export interface ResolvedAutopsyLink extends SectorAutopsyRef {
  title: string;
  route: string;
}

export interface SectorPilotBridge {
  batchRangeLabel: string;
  emsAndJobShops: string;
  sharedNationalLabs: string;
  executionWorkbenches: { label: string; route: string; detail: string }[];
}

export interface SectorPathwayEnrichment {
  sectorId: SectorId;
  shortLabel: string;
  accentTone: 'accent' | 'make' | 'code' | 'design' | 'research' | 'earn' | 'learn';
  additionalRegionalHubs: string[];
  matchedRoadmapSlugs: string[];
  plantBlueprintSlugs: string[];
  complianceSlugs: string[];
  autopsyLinks: SectorAutopsyRef[];
  zeroCostPrototypingRoutes: SectorZeroCostRoute[];
  vernacularCourses: SectorVernacularCourse[];
  pilotBridge: SectorPilotBridge;
  grantTags: RecommendedGrantTag[];
  grantNotes: string;
  digitalAndCraftBridgeNote: string;
  spotlightId?: string;
}

export interface EnrichedSectorPathway extends SectorPathwayMeta {
  enrichment: SectorPathwayEnrichment;
  allClusterCities: string[];
  matchedRoadmaps: RoadmapView[];
  matchedPlants: PlantBlueprint[];
  matchedCompliances: ComplianceRoadmapItem[];
  resolvedAutopsies: ResolvedAutopsyLink[];
  grantDetails: SectorGrantBadgeMeta[];
  spotlightBridge?: PanIndiaSectorSpotlight;
}

export const GRANT_CATALOG: Record<RecommendedGrantTag, SectorGrantBadgeMeta> = {
  'NIDHI-PRAYAS': {
    tag: 'NIDHI-PRAYAS',
    fullName: 'DST NIDHI-PRAYAS Prototype Grant',
    amountLabel: 'Up to ₹10 Lakh',
    equityNote: '0% Equity · Individual / Student Eligible',
    noCompanyNeeded: true,
    officialUrl: 'https://www.nidhi-prayas.org/',
  },
  SISFS: {
    tag: 'SISFS',
    fullName: 'Startup India Seed Fund Scheme (DPIIT)',
    amountLabel: '₹20L Grant + ₹50L Debt',
    equityNote: '0% Equity on PoC Grant',
    noCompanyNeeded: false,
    officialUrl: 'https://seedfund.startupindia.gov.in/',
  },
  BIRAC: {
    tag: 'BIRAC',
    fullName: 'BIRAC BIG (Biotechnology Ignition Grant)',
    amountLabel: 'Up to ₹50 Lakh (18 mo)',
    equityNote: '0% Equity · Researchers & MedTech',
    noCompanyNeeded: true,
    officialUrl: 'https://birac.nic.in/',
  },
  iDEX: {
    tag: 'iDEX',
    fullName: 'iDEX DISC / ADITI (Ministry of Defence)',
    amountLabel: '₹1.5 Cr – ₹25 Cr',
    equityNote: '0% Equity · Co-Development Grant',
    noCompanyNeeded: true,
    officialUrl: 'https://idex.gov.in/',
  },
  NTTM: {
    tag: 'NTTM',
    fullName: 'National Technical Textiles Mission (GREAT)',
    amountLabel: 'Up to ₹50 Lakh',
    equityNote: '0% Equity · Startup & Research',
    noCompanyNeeded: false,
    officialUrl: 'https://nttm.texmin.gov.in/',
  },
  MoFPI: {
    tag: 'MoFPI',
    fullName: 'MoFPI PMFME / Operation Greens Subsidy',
    amountLabel: '35% Credit-Linked Subsidy',
    equityNote: '0% Equity · Agro & Cold-Chain',
    noCompanyNeeded: true,
    officialUrl: 'https://pmfme.mofpi.gov.in/',
  },
  PMEGP: {
    tag: 'PMEGP',
    fullName: 'MSME PMEGP & PM Vishwakarma Machinery Subsidy',
    amountLabel: 'Up to ₹50L Mfg (15–35% Subsidy)',
    equityNote: '0% Equity · Diploma / Artisans / Workshops',
    noCompanyNeeded: true,
    officialUrl: 'https://www.kviconline.gov.in/pmegpeportal/',
  },
  'ISM DLI': {
    tag: 'ISM DLI',
    fullName: 'India Semiconductor Mission Design Linked Incentive',
    amountLabel: 'Up to ₹15 Cr (50% CapEx)',
    equityNote: '0% Equity Reimbursement',
    noCompanyNeeded: false,
    officialUrl: 'https://ism.gov.in/',
  },
  PLI: {
    tag: 'PLI',
    fullName: 'Production Linked Incentive (ACC / Drones / Textiles / White Goods)',
    amountLabel: '4% – 20% Incremental Sales',
    equityNote: 'Non-Dilutive Production Incentive',
    noCompanyNeeded: false,
    officialUrl: 'https://www.investindia.gov.in/production-linked-incentives-schemes-india',
  },
  'MeitY TIDE 2.0': {
    tag: 'MeitY TIDE 2.0',
    fullName: 'MeitY TIDE 2.0 EiR & Prototype Grant',
    amountLabel: '₹4L EiR – ₹7L Grant',
    equityNote: '0% Equity · 48 Centres',
    noCompanyNeeded: true,
    officialUrl: 'https://meitystartuphub.in/',
  },
  RDSO: {
    tag: 'RDSO',
    fullName: 'Indian Railways RDSO Innovation Grant',
    amountLabel: 'Up to ₹1.5 Cr (50% Match)',
    equityNote: '0% Equity · Track & Rolling Stock',
    noCompanyNeeded: false,
    officialUrl: 'https://innovation.indianrailways.gov.in/',
  },
};

export const SECTOR_PATHWAY_ENRICHMENTS: Record<SectorId, SectorPathwayEnrichment> = {
  'semiconductors-electronics': {
    sectorId: 'semiconductors-electronics',
    shortLabel: 'Silicon & PCB',
    accentTone: 'code',
    additionalRegionalHubs: ['Dholera', 'Guwahati', 'Kochi', 'Jaipur'],
    matchedRoadmapSlugs: [
      'kicad-pcb-design',
      'embedded-systems-from-zero',
      'rust-systems-programming',
      'systems-engineering-and-architecture',
    ],
    plantBlueprintSlugs: ['fab-manufacturing', 'pcb-plant', 'mobile-parts'],
    complianceSlugs: ['bis-crs-smps-adapter', 'wpc-eta-lora-iot', 'tec-mtcte-cellular-router'],
    autopsyLinks: [
      {
        kind: 'story',
        slug: 'tapi-photonics-surat-laser-galvo-spindles',
        takeaway: 'How Surat engineers replaced ₹18L imported laser controller cards with domestic PCBA.',
      },
      {
        kind: 'teardown',
        slug: 'india-smart-grid-lorawan-energy-meter',
        takeaway: 'Inside an IS 16444 smart energy meter: surge MOVs, CT sensing, and LoRaWAN certification.',
      },
      {
        kind: 'museum',
        slug: 'uncertified-rf-module-nhava-sheva-seizure',
        takeaway: 'Why uncertified Wi-Fi/BLE boards get held at Nhava Sheva & BLR Air Cargo without WPC ETA.',
      },
    ],
    zeroCostPrototypingRoutes: [
      {
        label: 'KiCad & EDA Schematic Studio',
        route: '/manufacturing/eda',
        description: 'Capture multi-layer schematics, DRC checks & Gerber previews directly in browser.',
      },
      {
        label: 'PCB Layout & Impedance Lab',
        route: '/manufacturing/pcb',
        description: 'Inspect stackups, differential pairs & DFM clearances for Indian PCB fabs.',
      },
      {
        label: 'RISC-V ISS & Verilog HDL Labs',
        route: '/manufacturing/hdl',
        description: 'Simulate digital RTL logic and bare-metal firmware with ₹0 lab fee.',
      },
      {
        label: 'SPICE Analog & Falstad Sim',
        route: '/manufacturing/spice',
        description: 'Test buck converters, MOSFET switching & op-amp filters before ordering parts.',
      },
      {
        label: 'Youth 8–26 & ATL Track',
        route: '/young-innovators',
        description: 'Block-to-Pico & ESP32 beginner projects for school, ITI, and college makers.',
      },
      {
        label: 'All Free Tools & Grants',
        route: '/resources',
        description: 'Access I-STEM cleanrooms, Tiny Tapeout shuttles & 22-language courses.',
      },
    ],
    vernacularCourses: [
      {
        title: 'Digital Circuits, VLSI Design & Embedded Systems',
        provider: 'NPTEL / SWAYAM',
        languages: 'English + 10 Indian Language Transcripts',
        url: 'https://nptel.ac.in/',
        note: 'IIT Madras & IIT Delhi full semester lectures with verified exam certificates.',
      },
      {
        title: 'KiCad, Arduino & Linux Step-by-Step Tutorials',
        provider: 'IIT Bombay Spoken Tutorial',
        languages: '22 Scheduled Indian Languages (Hindi, Tamil, Marathi, Bengali, Gujarati + more)',
        url: 'https://spoken-tutorial.org/',
        note: 'Self-paced mother-tongue screencasts built for polytechnic & tier-2/3 students.',
      },
      {
        title: 'SMT Assembly Operator & Electronics Mechanic NSQF',
        provider: 'Skill India Digital',
        languages: '12+ Regional Indian Languages',
        url: 'https://www.skillindiadigital.gov.in/',
        note: 'Practical shop-floor credentials for Peenya, Noida & Sriperumbudur EMS plants.',
      },
    ],
    pilotBridge: {
      batchRangeLabel: '10 – 250 Boards via Domestic EMS',
      emsAndJobShops:
        'LionCircuits (Bengaluru), PCB Power (Gandhinagar), and Peenya/Noida turnkey SMT houses handle 4–8 layer ENIG boards with stencil + reflow.',
      sharedNationalLabs:
        'Book oscilloscopes, logic analyzers & pre-compliance EMI chambers via I-STEM (IITs/NITs), T-Works Hyderabad, or nearest Atal Tinkering Lab (ATL).',
      executionWorkbenches: [
        { label: 'SMT & PCBA Turnkey Estimator', route: '/assembly', detail: 'Estimate feeder setup, BOM kitting & batch yield.' },
        { label: 'Component Sourcing & BCD/IGST', route: '/sourcing', detail: 'Compare Mouser/DigiKey landed duty vs domestic distributors.' },
        { label: 'EMI/EMC Near-Field Pre-Scan', route: '/emc', detail: 'Catch radiated switching spikes before NABL testing.' },
        { label: 'Shared Labs & Testbeds', route: '/testbeds', detail: 'Find NABL EMC/RF & environmental test chambers.' },
      ],
    },
    grantTags: ['NIDHI-PRAYAS', 'ISM DLI', 'MeitY TIDE 2.0', 'SISFS'],
    grantNotes:
      'Solo builders can raise ₹4L–₹10L via MeitY TIDE 2.0 EiR or DST NIDHI-PRAYAS before incorporating; chip/IP startups qualify for ISM DLI up to ₹15 Cr.',
    digitalAndCraftBridgeNote:
      'Pairs with Open AI & Bhashini Edge TinyML firmware (/learn?track=code) and custom Channapatna/bamboo or anodized enclosures from GI artisan clusters.',
    spotlightId: 'semiconductors-electronics',
  },

  'ev-clean-energy': {
    sectorId: 'ev-clean-energy',
    shortLabel: 'EV & Clean Energy',
    accentTone: 'make',
    additionalRegionalHubs: ['Vadodara', 'Rewa', 'Indore', 'Bhopal'],
    matchedRoadmapSlugs: [
      'embedded-systems-from-zero',
      'kicad-pcb-design',
      'systems-engineering-and-architecture',
    ],
    plantBlueprintSlugs: ['ev-battery-pack', 'solar-inverter-bess-plant', 'cycle-manufacturing'],
    complianceSlugs: ['ais156-ev-battery-pack', 'bis-crs-smps-adapter'],
    autopsyLinks: [
      {
        kind: 'story',
        slug: 'ather-energy-first-smart-ev',
        takeaway: 'How Ather solved 45°C Indian monsoon thermal management in early battery packs.',
      },
      {
        kind: 'story',
        slug: 'kulkarni-patil-pune-ev-bldc-exports',
        takeaway: 'Bhosari Pune 900 sq ft workshop scaling BLDC traction drives to German & Thai OEMs.',
      },
      {
        kind: 'teardown',
        slug: 'ather-450-smart-bms-and-telematics',
        takeaway: 'Cell balancing topology, CAN telemetry & potted IP67 aluminum pack architecture.',
      },
      {
        kind: 'museum',
        slug: 'uncertified-liion-pack-air-cargo-rejection',
        takeaway: 'Why skipping UN 38.3 and AIS-156 nail penetration testing kills export shipments.',
      },
    ],
    zeroCostPrototypingRoutes: [
      {
        label: 'Battery EIS & Pack Lab',
        route: '/battery-eis',
        description: 'Model LiFePO4/NMC internal resistance, Nyquist plots & thermal runaway margins.',
      },
      {
        label: 'BLDC / PMSM Motor FOC Lab',
        route: '/motor-foc',
        description: 'Tune field-oriented control PID loops, phase currents & torque curves.',
      },
      {
        label: 'CAN-FD Vehicle Bus Analyzer',
        route: '/can-bus',
        description: 'Simulate J1939/CANopen frames between BMS, VCU and motor inverter.',
      },
      {
        label: 'Solar MPPT & BESS Simulator',
        route: '/solar-mppt',
        description: 'Evaluate Perturb & Observe vs Incremental Conductance under cloud shading.',
      },
      {
        label: 'EV Drivetrain Physics Sim',
        route: '/manufacturing/physics/ev',
        description: 'Test gradeability, regen braking & range across Indian urban drive cycles.',
      },
      {
        label: 'Youth 8–26 EV & Solar Track',
        route: '/young-innovators',
        description: 'Build safe low-voltage solar & motor prototypes at ATL and college labs.',
      },
      {
        label: 'Free Resources, ARAI & Grants',
        route: '/resources',
        description: 'Discover ARAI shared dynos, I-STEM cell cyclers & student grants.',
      },
    ],
    vernacularCourses: [
      {
        title: 'Electric Vehicles, Power Electronics & Battery Management',
        provider: 'NPTEL / SWAYAM',
        languages: 'English + Hindi, Tamil, Marathi, Telugu Subtitles',
        url: 'https://nptel.ac.in/',
        note: 'IIT Madras & IIT Guwahati courses covering traction inverters & BMS estimation.',
      },
      {
        title: 'OpenModelica, Scilab & KiCad Power Circuit Simulations',
        provider: 'IIT Bombay Spoken Tutorial',
        languages: '22 Scheduled Indian Languages',
        url: 'https://spoken-tutorial.org/',
        note: 'Hands-on simulation tutorials free for ITI, diploma & engineering students.',
      },
      {
        title: 'EV Service Technician & Solar PV Installer (Suryamitra)',
        provider: 'Skill India Digital',
        languages: '12+ Regional Indian Languages',
        url: 'https://www.skillindiadigital.gov.in/',
        note: 'Industry-recognized certification for Bhosari, Hosur & Coimbatore EV hubs.',
      },
    ],
    pilotBridge: {
      batchRangeLabel: '10 – 50 Packs / Controllers via Shared Dyno & EMS',
      emsAndJobShops:
        'Partner with Pune (Chakan/Bhosari), Hosur, and Coimbatore wire-harness shops, laser nickel-busbar welders, and die-cast enclosure foundries.',
      sharedNationalLabs:
        'Reserve cell cyclers, vibration tables, and thermal chambers at ARAI Pune, ICAT Manesar, NATRAX Pithampur, and I-STEM IIT labs.',
      executionWorkbenches: [
        { label: 'PCBA & BMS Turnkey Assembly', route: '/assembly', detail: 'Quote heavy-copper 2oz/3oz BMS PCB assembly.' },
        { label: 'Enclosure & Busbar RFQ', route: '/manufacturing/rfq', detail: 'Price sheet-metal battery trays & CNC cooling plates.' },
        { label: 'Cell & MOSFET Sourcing', route: '/sourcing', detail: 'Plan landed cost for LFP cells, CAN transceivers & GaN/SiC FETs.' },
        { label: 'EV Testbeds & Labs', route: '/testbeds', detail: 'Locate AIS-156 pre-compliance drop & thermal chambers.' },
      ],
    },
    grantTags: ['NIDHI-PRAYAS', 'SISFS', 'PLI', 'PMEGP'],
    grantNotes:
      'Use NIDHI-PRAYAS (₹10L) for your first AIS-156 pre-test pack, SISFS (₹20L) for ARAI/ICAT certification, and PMEGP/PLI ACC for pack assembly lines.',
    digitalAndCraftBridgeNote:
      'Connects with Bhashini vernacular driver diagnostics apps (/learn?track=code) and circular battery black-mass recycling workflows.',
    spotlightId: 'ev-clean-energy',
  },

  'drones-defense-space': {
    sectorId: 'drones-defense-space',
    shortLabel: 'Drones & Space',
    accentTone: 'research',
    additionalRegionalHubs: ['Kanpur', 'Thiruvananthapuram', 'Ahmedabad', 'Sriharikota'],
    matchedRoadmapSlugs: [
      'cubesat-engineering',
      'embedded-systems-from-zero',
      'robotics-and-ros2',
      'deep-learning-and-tinyml',
    ],
    plantBlueprintSlugs: ['drone-aerospace', 'carbon-fiber-hub'],
    complianceSlugs: ['dgca-drone-type-certification', 'wpc-eta-lora-iot'],
    autopsyLinks: [
      {
        kind: 'story',
        slug: 'spacex-falcon-reusable-rocket',
        takeaway: 'First-principles thrust-to-weight budgeting & rapid flight-test iteration discipline.',
      },
      {
        kind: 'teardown',
        slug: 'dji-mavic-mini-drone-flight-controller',
        takeaway: 'Dual-IMU vibration isolation, optical-flow fusion & compact ESC heat dissipation.',
      },
      {
        kind: 'museum',
        slug: 'lily-robotics-flying-camera',
        takeaway: 'Lesson in shipping reliable waterproof hardware & honest flight-test validation.',
      },
    ],
    zeroCostPrototypingRoutes: [
      {
        label: '6-DOF Drone Flight Physics Lab',
        route: '/manufacturing/physics/drone',
        description: 'Tune PID roll/pitch/yaw stability, payload endurance & wind gusts in browser.',
      },
      {
        label: 'Rocket Nozzle & Staging Sim',
        route: '/manufacturing/physics/rocket',
        description: 'Calculate delta-V, specific impulse & apogee trajectory before static tests.',
      },
      {
        label: 'RF Link Budget & Microstrip Lab',
        route: '/rf-calc',
        description: 'Calculate 915 MHz / 2.4 GHz / 5.8 GHz BVLOS telemetry link margins.',
      },
      {
        label: 'Telemetry Digital Twin & Firmware',
        route: '/telemetry',
        description: 'Inspect MAVLink sensor streams, dual-bank OTA & signed NPNT bootloaders.',
      },
      {
        label: 'Youth 8–26 Flight & ATL Track',
        route: '/young-innovators',
        description: 'Safe micro-drone & CubeSat telemetry challenges for student makers.',
      },
      {
        label: 'iDEX & IN-SPACe Funding Guide',
        route: '/resources',
        description: 'Access IN-SPACe payload test facilities & zero-equity defense grants.',
      },
    ],
    vernacularCourses: [
      {
        title: 'Spacecraft Dynamics, Flight Mechanics & Unmanned Aerial Systems',
        provider: 'NPTEL / SWAYAM',
        languages: 'English + Regional Subtitles',
        url: 'https://nptel.ac.in/',
        note: 'IIT Kanpur, IIT Madras & IIST curriculum for aerospace & UAV guidance.',
      },
      {
        title: 'FreeCAD, Blender & Python for Flight Kinematics',
        provider: 'IIT Bombay Spoken Tutorial',
        languages: '22 Scheduled Indian Languages',
        url: 'https://spoken-tutorial.org/',
        note: 'Design carbon-fiber arm brackets and simulation scripts in your mother tongue.',
      },
      {
        title: 'Drone Technician & Remote Pilot Assembly Readiness',
        provider: 'Skill India Digital',
        languages: '12+ Regional Indian Languages',
        url: 'https://www.skillindiadigital.gov.in/',
        note: 'Field assembly, ESC calibration & DGCA maintenance logbook training.',
      },
    ],
    pilotBridge: {
      batchRangeLabel: '5 – 40 Airframes via Composite & Avionics Job-Shops',
      emsAndJobShops:
        'Coimbatore, Bengaluru & Hyderabad carbon-prepreg layup shops and 5-axis CNC houses cut monocoque arms and gimbal mounts without expensive molds.',
      sharedNationalLabs:
        'Test inside IIT Kanpur / IIT Madras flight cages, IN-SPACe Ahmedabad thermal-vacuum facilities, and DGCA authorized RPTO ranges.',
      executionWorkbenches: [
        { label: 'CNC & Carbon Airframe RFQ', route: '/manufacturing/rfq', detail: 'Estimate CNC 7075-T6 brackets & CF plate routing.' },
        { label: 'Signed Firmware & NPNT Partitioner', route: '/firmware', detail: 'Configure OTA & DigitalSky/Remote ID boot partitions.' },
        { label: 'DGCA & WPC Compliance Matcher', route: '/compliance', detail: 'Estimate NABL EMC + DGCA type cert timelines.' },
        { label: 'Testbed & Flight Cage Directory', route: '/testbeds', detail: 'Locate vibration shakers & wind-tunnel slots.' },
      ],
    },
    grantTags: ['iDEX', 'NIDHI-PRAYAS', 'SISFS', 'PLI'],
    grantNotes:
      'iDEX DISC / ADITI grants ₹1.5 Cr–₹25 Cr against real Armed Forces problem statements; PLI Drones rewards 20% domestic value addition.',
    digitalAndCraftBridgeNote:
      'Integrates edge computer vision (/learn?track=research) for precision crop spraying & GIS mapping alongside SCOMET dual-use export checks.',
    spotlightId: 'drones-defense-space',
  },

  'robotics-cnc-automation': {
    sectorId: 'robotics-cnc-automation',
    shortLabel: 'Robotics & CNC',
    accentTone: 'make',
    additionalRegionalHubs: ['Aurangabad', 'Jamshedpur', 'Bhubaneswar', 'Indore'],
    matchedRoadmapSlugs: [
      'robotics-and-ros2',
      'mechanical-cad-and-enclosures',
      'embedded-systems-from-zero',
      'deep-learning-and-tinyml',
    ],
    plantBlueprintSlugs: ['precision-mechanical-parts', 'pcb-plant'],
    complianceSlugs: ['bis-crs-smps-adapter', 'tec-mtcte-cellular-router'],
    autopsyLinks: [
      {
        kind: 'story',
        slug: 'narmada-precision-rajkot-coimbatore-castings',
        takeaway: 'How polytechnic diploma machinists in Rajkot & Coimbatore scaled PPAP castings to US OEMs.',
      },
      {
        kind: 'story',
        slug: 'tapi-photonics-surat-laser-galvo-spindles',
        takeaway: 'Replacing high-cost imported industrial motion & galvo controllers in Surat.',
      },
      {
        kind: 'museum',
        slug: 'single-source-mcu-coimbatore-agri-po-halt',
        takeaway: 'Why qualifying pin-compatible MCUs & multi-vendor connectors prevents factory line halts.',
      },
    ],
    zeroCostPrototypingRoutes: [
      {
        label: 'CNC & Sheet Metal Instant RFQ',
        route: '/manufacturing/rfq',
        description: 'Calculate machining cycle time, tolerances, anodizing & batch unit cost.',
      },
      {
        label: 'Servo & BLDC Motion FOC Lab',
        route: '/motor-foc',
        description: 'Tune closed-loop field-oriented servo drives for cobots and AGVs.',
      },
      {
        label: 'Thermal Heatsink & Drive Cooling',
        route: '/thermal',
        description: 'Size aluminum extrusions & airflow for 24x7 factory floor controllers.',
      },
      {
        label: '3D Kinematics & Physics Workbench',
        route: '/manufacturing/physics/3d',
        description: 'Test rigid-body linkages, mobile base dynamics & conveyor timing.',
      },
      {
        label: 'CANopen / Industrial Bus Sim',
        route: '/can-bus',
        description: 'Validate multi-axis servo synchronization & emergency-stop heartbeats.',
      },
      {
        label: 'Youth 8–26 Robotics & CAD Track',
        route: '/young-innovators',
        description: 'Start with desktop robot arms, 3D printing & ITI/diploma CNC basics.',
      },
      {
        label: 'Central Tool Rooms & Grants',
        route: '/resources',
        description: 'Book IGTR Ahmedabad, CTTC Bhubaneswar & CITD Hyderabad CNC centres.',
      },
    ],
    vernacularCourses: [
      {
        title: 'Industrial Robotics, CAD/CAM & Manufacturing Automation',
        provider: 'NPTEL / SWAYAM',
        languages: 'English + Hindi, Marathi, Tamil, Gujarati Transcripts',
        url: 'https://nptel.ac.in/',
        note: 'Covers kinematics, PLC ladder logic, GD&T tolerances & CNC post-processors.',
      },
      {
        title: 'FreeCAD, QCAD & Blender Industrial Modelling',
        provider: 'IIT Bombay Spoken Tutorial',
        languages: '22 Scheduled Indian Languages',
        url: 'https://spoken-tutorial.org/',
        note: 'Zero-license parametric STEP CAD for diploma & ITI machinists.',
      },
      {
        title: 'CNC Turning/VMC Setter & Industrial Electrician',
        provider: 'Skill India Digital',
        languages: '12+ Regional Indian Languages',
        url: 'https://www.skillindiadigital.gov.in/',
        note: 'Shop-floor metrology, Fanuc/Siemens G-code & safety interlock credentials.',
      },
    ],
    pilotBridge: {
      batchRangeLabel: '10 – 100 Assemblies via Rajkot / Coimbatore / Peenya Clusters',
      emsAndJobShops:
        'Tap Rajkot (Shapar-Veraval), Coimbatore (SIDCO), Ludhiana & Peenya machine shops for 5-axis VMC turning, wire EDM, and powder coating.',
      sharedNationalLabs:
        'Access MSME Central Tool Rooms (IGTR Ahmedabad, CTTC Bhubaneswar, TRTC Patna) and T-Works Hyderabad at nominal hourly rates.',
      executionWorkbenches: [
        { label: 'CNC / Sheet Metal RFQ Calculator', route: '/manufacturing/rfq', detail: 'Compare 10-unit vs 200-unit machining economics.' },
        { label: 'Controller PCBA Estimator', route: '/assembly', detail: 'Bundle industrial opto-isolated PCBs with machined chassis.' },
        { label: 'Component Sourcing Matrix', route: '/sourcing', detail: 'Avoid single-source MCU/encoder bottlenecks.' },
        { label: 'Regional Fab & Tooling Labs', route: '/labs', detail: 'Find nearby CNC, CMM metrology & maker workshops.' },
      ],
    },
    grantTags: ['NIDHI-PRAYAS', 'PMEGP', 'SISFS'],
    grantNotes:
      'Diploma & ITI workshop founders can access up to ₹50L under PMEGP (15–35% subsidy) or ₹10L NIDHI-PRAYAS for novel robotic tooling.',
    digitalAndCraftBridgeNote:
      'Bridges ROS 2 / TinyML vision inspection (/learn?track=make) with traditional foundry, bamboo-CNC, and brass-turning artisan workshops.',
    spotlightId: 'robotics-cnc-precision',
  },

  'medtech-diagnostics': {
    sectorId: 'medtech-diagnostics',
    shortLabel: 'MedTech & Bio',
    accentTone: 'research',
    additionalRegionalHubs: ['Guwahati', 'Srinagar', 'Delhi NCR', 'Chennai'],
    matchedRoadmapSlugs: [
      'embedded-systems-from-zero',
      'product-design-foundations',
      'deep-learning-and-tinyml',
      'kicad-pcb-design',
    ],
    plantBlueprintSlugs: ['medtech-diagnostics-plant', 'pcb-plant'],
    complianceSlugs: ['cdsco-med-class-b-vital-monitor', 'wpc-eta-lora-iot'],
    autopsyLinks: [
      {
        kind: 'museum',
        slug: 'theranos-minilab-edison',
        takeaway: 'Why clinical concordance, microfluidic physics & honest NABL validation are non-negotiable.',
      },
      {
        kind: 'teardown',
        slug: 'india-smart-grid-lorawan-energy-meter',
        takeaway: 'Reference architecture for medical-grade galvanic isolation & low-noise analog front ends.',
      },
      {
        kind: 'story',
        slug: 'tapi-photonics-surat-laser-galvo-spindles',
        takeaway: 'Optical precision & photodiode signal conditioning engineered in India.',
      },
    ],
    zeroCostPrototypingRoutes: [
      {
        label: 'Analog Bio-Signal SPICE Lab',
        route: '/manufacturing/spice',
        description: 'Simulate instrumentation amplifiers, 50Hz notch filters & PPG/ECG front ends.',
      },
      {
        label: 'Hardware Bench & Scope Lab',
        route: '/manufacturing/bench',
        description: 'Debug sensor ADC noise floors & power-supply ripple before patient trials.',
      },
      {
        label: 'Clinical Telemetry Sandbox',
        route: '/telemetry',
        description: 'Stream simulated SpO2, heart-rate & point-of-care analyzer diagnostics.',
      },
      {
        label: 'ISO 13485 & IEC 60601 Testbeds',
        route: '/testbeds',
        description: 'Locate AMTZ Visakhapatnam & NABL medical safety testing chambers.',
      },
      {
        label: 'Youth Health-Tech Track',
        route: '/young-innovators',
        description: 'Build non-invasive assistive devices & accessible ergonomics prototypes.',
      },
      {
        label: 'BIRAC & BioNEST Directory',
        route: '/resources',
        description: 'Find ₹50L zero-equity BIRAC BIG grants & wet-lab incubators pan-India.',
      },
    ],
    vernacularCourses: [
      {
        title: 'Biomedical Instrumentation, Microfluidics & Medical Image AI',
        provider: 'NPTEL / SWAYAM',
        languages: 'English + Regional Transcripts',
        url: 'https://nptel.ac.in/',
        note: 'IIT Madras, IIT Bombay & IISc courses covering bio-potentials & IEC 60601 safety.',
      },
      {
        title: 'Scilab, Python Signal Processing & FreeCAD Prosthetics',
        provider: 'IIT Bombay Spoken Tutorial',
        languages: '22 Scheduled Indian Languages',
        url: 'https://spoken-tutorial.org/',
        note: 'Analyze PPG/ECG waveforms and design assistive braces in local languages.',
      },
      {
        title: 'Medical Equipment Technician & QMS Documentation',
        provider: 'Skill India Digital',
        languages: '12+ Regional Indian Languages',
        url: 'https://www.skillindiadigital.gov.in/',
        note: 'Hospital device calibration, preventive maintenance & cleanroom hygiene training.',
      },
    ],
    pilotBridge: {
      batchRangeLabel: '10 – 50 Clinical Pilot Units under CDSCO MD-13 Test License',
      emsAndJobShops:
        'AMTZ (Visakhapatnam) and Hyderabad/Bengaluru ISO 13485 contract manufacturers offer cleanroom SMT, injection-molded cartridges, and EtO sterilization.',
      sharedNationalLabs:
        'Use BIRAC BioNEST incubators (Hyderabad, Bengaluru, Guwahati BioTech Park, Srinagar IIIM) and AMTZ Kalam Convention Center shared labs.',
      executionWorkbenches: [
        { label: 'CDSCO & IEC 60601 Compliance', route: '/compliance', detail: 'Estimate Class A/B/C testing fees & MD-13 timelines.' },
        { label: 'Cleanroom PCBA Assembly', route: '/assembly', detail: 'Quote medical-grade conformal-coated PCB batches.' },
        { label: 'Enclosure & Cartridge RFQ', route: '/manufacturing/rfq', detail: 'Price biocompatible ABS/PC housings & soft tooling.' },
        { label: 'Prior-Art & IP Defense Ledger', route: '/network/ip', detail: 'Timestamp clinical device disclosures before hospital pilots.' },
      ],
    },
    grantTags: ['BIRAC', 'NIDHI-PRAYAS', 'SISFS'],
    grantNotes:
      'BIRAC BIG provides up to ₹50L (0% equity) even to individual doctors, researchers, or graduates prior to company formation.',
    digitalAndCraftBridgeNote:
      'Combines Bhashini 22-language rural ASHA worker voice interfaces (/learn?track=code) with ergonomic assistive wearables.',
    spotlightId: 'medtech-biotech-ayush',
  },

  'consumer-hardware-appliances': {
    sectorId: 'consumer-hardware-appliances',
    shortLabel: 'Consumer & IoT',
    accentTone: 'design',
    additionalRegionalHubs: ['Kolkata', 'Sri City', 'Coimbatore', 'Jaipur'],
    matchedRoadmapSlugs: [
      'product-design-foundations',
      'mechanical-cad-and-enclosures',
      'kicad-pcb-design',
      'full-stack-web',
    ],
    plantBlueprintSlugs: ['mobile-parts', 'pcb-plant', 'cycle-manufacturing'],
    complianceSlugs: ['bis-crs-smps-adapter', 'wpc-eta-lora-iot'],
    autopsyLinks: [
      {
        kind: 'teardown',
        slug: 'india-smart-grid-lorawan-energy-meter',
        takeaway: 'How consumer-grade enclosures pass surge, creepage, and BIS CRS thermal requirements.',
      },
      {
        kind: 'story',
        slug: 'kulkarni-patil-pune-ev-bldc-exports',
        takeaway: 'Scaling super-efficient BLDC motor assemblies from regional workshops to global OEMs.',
      },
      {
        kind: 'museum',
        slug: 'juicero-cold-press',
        takeaway: 'Avoid over-engineered machined parts when off-the-shelf stamping/molding wins.',
      },
      {
        kind: 'museum',
        slug: 'uncertified-rf-module-nhava-sheva-seizure',
        takeaway: 'Use pre-certified WPC/FCC/CE wireless modules to cut launch delays by 14 weeks.',
      },
    ],
    zeroCostPrototypingRoutes: [
      {
        label: 'Circuito & Breadboard Builder',
        route: '/manufacturing/circuito',
        description: 'Wire sensors, relays & displays interactively and export starter code.',
      },
      {
        label: 'Falstad Live Circuit Lab',
        route: '/manufacturing/falstad',
        description: 'Visualize AC-DC rectification, BLDC switching & audio filter waveforms.',
      },
      {
        label: 'Prototype Architect Wizard',
        route: '/prototype',
        description: 'Generate BOM estimates, enclosure methods & compliance checkpoints.',
      },
      {
        label: 'Hardware Launchpad Readiness',
        route: '/launchpad',
        description: 'Score DFM, certification & D2C supply readiness before manufacturing.',
      },
      {
        label: 'Youth 8–26 Product Sandbox',
        route: '/young-innovators',
        description: 'Turn school and college gadget ideas into safe working prototypes.',
      },
      {
        label: 'Free Grants & FabLab Access',
        route: '/resources',
        description: 'Find KSUM Super FabLabs, MSME Hackathon ₹15L grants & GitHub packs.',
      },
    ],
    vernacularCourses: [
      {
        title: 'Product Design, Ergonomics & Industrial IoT Systems',
        provider: 'NPTEL / SWAYAM',
        languages: 'English + 10 Indian Languages',
        url: 'https://nptel.ac.in/',
        note: 'IIT Guwahati & IIT Delhi design thinking, DFMA & embedded IoT modules.',
      },
      {
        title: 'Blender 3D Product Renders, Inkscape & Arduino',
        provider: 'IIT Bombay Spoken Tutorial',
        languages: '22 Scheduled Indian Languages',
        url: 'https://spoken-tutorial.org/',
        note: 'Create photorealistic D2C renders and interactive firmware in your mother tongue.',
      },
      {
        title: 'Smart Home Appliance & Consumer Electronics Repair/Assembly',
        provider: 'Skill India Digital',
        languages: '12+ Regional Indian Languages',
        url: 'https://www.skillindiadigital.gov.in/',
        note: 'BLDC fan controllers, inverter boards & consumer QA inspection training.',
      },
    ],
    pilotBridge: {
      batchRangeLabel: '50 – 500 Units via Vacuum Casting & Bridge Tooling',
      emsAndJobShops:
        'Use Noida, Pune & Sri City EMS vendors for SMT boards paired with silicone vacuum-casting or aluminum bridge molds before spending ₹12L on hardened steel dies.',
      sharedNationalLabs:
        'Prototype enclosures at FabLabs (KSUM Kochi, Vigyan Ashram Pabal, COEP Pune) and run pre-tests at ETDC / STQC Electronics Test & Development Centres.',
      executionWorkbenches: [
        { label: 'BIS CRS & WPC ETA Wizard', route: '/compliance', detail: 'Estimate compulsory IS 13252 / IS 616 safety & wireless fees.' },
        { label: 'Enclosure Soft-Tooling RFQ', route: '/manufacturing/rfq', detail: 'Compare 3D printing, vacuum casting & injection molding.' },
        { label: 'BOM Sourcing & Alternates', route: '/sourcing', detail: 'Replace obsolete ICs with pin-compatible LCSC/DigiKey parts.' },
        { label: 'PCBA Turnkey Pricing', route: '/assembly', detail: 'Calculate 100-unit pilot cost per appliance.' },
      ],
    },
    grantTags: ['NIDHI-PRAYAS', 'SISFS', 'MeitY TIDE 2.0', 'PLI'],
    grantNotes:
      'MeitY TIDE 2.0 & MSME Hackathon fund early IoT/consumer gadgets up to ₹15L; PLI White Goods supports scaling BLDC & AC components.',
    digitalAndCraftBridgeNote:
      'Blends vernacular voice AI companion apps (/learn?track=code) and GI bamboo/wood acoustic housings (/export) for differentiated global D2C brands.',
    spotlightId: 'consumer-hardware-appliances',
  },

  'technical-textiles-apparel': {
    sectorId: 'technical-textiles-apparel',
    shortLabel: 'Tech Textiles',
    accentTone: 'design',
    additionalRegionalHubs: ['Sualkuchi (Assam)', 'Guwahati', 'Varanasi', 'Kutch'],
    matchedRoadmapSlugs: [
      'embedded-systems-from-zero',
      'product-design-foundations',
      'mechanical-cad-and-enclosures',
    ],
    plantBlueprintSlugs: ['technical-textiles-mill'],
    complianceSlugs: ['wpc-eta-lora-iot', 'bis-crs-smps-adapter'],
    autopsyLinks: [
      {
        kind: 'story',
        slug: 'kaveri-loomworks-tiruppur-smart-knitting',
        takeaway: 'How Tiruppur mills cut elastane defects by 75% using optical sensors & OEKO-TEX lot logs.',
      },
      {
        kind: 'museum',
        slug: 'single-source-mcu-coimbatore-agri-po-halt',
        takeaway: 'Protect textile mill retrofit kits by designing dual-footprint optical/MCU boards.',
      },
    ],
    zeroCostPrototypingRoutes: [
      {
        label: 'Optical Sensor PCB Studio',
        route: '/manufacturing/pcb',
        description: 'Design yarn-break optical sensors & smart-loom tension monitors.',
      },
      {
        label: 'Mill Telemetry & Lot Logger',
        route: '/telemetry',
        description: 'Track GSM weight, dye-bath pH & defect logs for EU Digital Product Passports.',
      },
      {
        label: 'Sensor & Actuator Sourcing',
        route: '/sourcing',
        description: 'Price optical interrupters, strain gauges & industrial ESP32 nodes.',
      },
      {
        label: 'Loom Retrofit Bracket RFQ',
        route: '/manufacturing/rfq',
        description: 'Estimate CNC/sheet-metal sensor mounts for circular knitting & shuttleless looms.',
      },
      {
        label: 'Youth Loom & Wearable Makers',
        route: '/young-innovators',
        description: 'Experiment with conductive thread, smart fabrics & natural dye sensors.',
      },
      {
        label: 'NTTM, SITRA & PM Vishwakarma',
        route: '/resources',
        description: 'Access SITRA Coimbatore, MANTRA Surat & handloom cluster grants.',
      },
    ],
    vernacularCourses: [
      {
        title: 'Technical Textiles, Smart Fibers & Polymer Composites',
        provider: 'NPTEL / SWAYAM',
        languages: 'English + Tamil, Gujarati, Hindi, Marathi Subtitles',
        url: 'https://nptel.ac.in/',
        note: 'IIT Delhi & IIT Madras courses covering nonwovens, medical textiles & geotextiles.',
      },
      {
        title: 'Inkscape Pattern Design, LibreOffice Costing & Arduino',
        provider: 'IIT Bombay Spoken Tutorial',
        languages: '22 Scheduled Indian Languages',
        url: 'https://spoken-tutorial.org/',
        note: 'Empower Tiruppur, Surat & Sualkuchi weavers with digital CAD & costing tools.',
      },
      {
        title: 'Technical Textile Machine Operator & Apparel QA Checker',
        provider: 'Skill India Digital',
        languages: '12+ Regional Indian Languages',
        url: 'https://www.skillindiadigital.gov.in/',
        note: 'Hands-on testing for GSM, tensile strength, Martindale abrasion & OEKO-TEX.',
      },
    ],
    pilotBridge: {
      batchRangeLabel: '500 – 2,000 Meters / Smart Garment Pilot Lots',
      emsAndJobShops:
        'Partner with Tiruppur (Avinashi Road) knitting mills, Surat (Pandesara/Sachin) technical weavers, and Panipat nonwoven lines for 500-meter pilot runs.',
      sharedNationalLabs:
        'Run ASTM tensile, hydrostatic head & EN 13795 medical barrier tests at Centres of Excellence like SITRA (Coimbatore), MANTRA (Surat), BTRA (Mumbai) & IIHT Guwahati.',
      executionWorkbenches: [
        { label: 'Mill Sensor & Smart Apparel BOM', route: '/assembly', detail: 'Quote washable FPC / rigid-flex wearable sensor modules.' },
        { label: 'Export Textile & IoT Compliance', route: '/compliance', detail: 'Plan OEKO-TEX, REACH, BIS & wireless approvals.' },
        { label: 'Local Loom & Fab Directory', route: '/labs', detail: 'Locate textile testing CoEs & district CFCs.' },
        { label: 'Textile Export Corridors', route: '/export', detail: 'Check EU CBAM/DPP, RoDTEP rates & US/GCC tariffs.' },
      ],
    },
    grantTags: ['NTTM', 'PLI', 'PMEGP', 'SISFS'],
    grantNotes:
      'NTTM GREAT awards up to ₹50L specifically for technical textile startups & young innovators; PM MITRA & PLI Textiles back commercial mills.',
    digitalAndCraftBridgeNote:
      'Unites Sualkuchi/Varanasi GI handloom heritage (/export) and ONDC craft commerce (/learn?track=earn) with EU Digital Product Passport QR traceability.',
    spotlightId: 'technical-textiles-apparel',
  },

  'agro-food-coldchain': {
    sectorId: 'agro-food-coldchain',
    shortLabel: 'Agro & Cold-Chain',
    accentTone: 'earn',
    additionalRegionalHubs: ['Guwahati', 'Ludhiana', 'Patna', 'Pabal', 'Raipur'],
    matchedRoadmapSlugs: [
      'embedded-systems-from-zero',
      'mechanical-cad-and-enclosures',
      'systems-engineering-and-architecture',
    ],
    plantBlueprintSlugs: ['agro-food-coldchain-plant', 'solar-inverter-bess-plant'],
    complianceSlugs: ['wpc-eta-lora-iot', 'bis-crs-smps-adapter'],
    autopsyLinks: [
      {
        kind: 'story',
        slug: 'narmada-precision-rajkot-coimbatore-castings',
        takeaway: 'Engineering ruggedized agricultural pumps, rotors & field machinery in Rajkot & Coimbatore.',
      },
      {
        kind: 'teardown',
        slug: 'india-smart-grid-lorawan-energy-meter',
        takeaway: 'Designing surge-resilient rural IoT telemetry nodes for variable grid & solar power.',
      },
      {
        kind: 'museum',
        slug: 'single-source-mcu-coimbatore-agri-po-halt',
        takeaway: 'Keeping 500-unit FPO agri-sensor deliveries on schedule with second-source BOM design.',
      },
    ],
    zeroCostPrototypingRoutes: [
      {
        label: 'Solar MPPT & Cold-Room Energy Lab',
        route: '/solar-mppt',
        description: 'Size solar arrays & phase-change thermal batteries for rural off-grid cold rooms.',
      },
      {
        label: 'Thermal Heat-Load Calculator',
        route: '/thermal',
        description: 'Model PUF panel insulation & crop respiration heat load at 45°C ambient.',
      },
      {
        label: 'Cold-Chain EN 12830 Telemetry',
        route: '/telemetry',
        description: 'Verify continuous temperature/humidity logging for APEDA export containers.',
      },
      {
        label: 'Field & Lab Testbeds',
        route: '/testbeds',
        description: 'Connect with ICAR-CIPHET, Vigyan Ashram Pabal & MoFPI regional labs.',
      },
      {
        label: 'Rural Youth & ATL Projects',
        route: '/young-innovators',
        description: 'Start with soil-moisture pump controllers & solar crop-dryer sensors.',
      },
      {
        label: 'MoFPI & Regional Zone Grants',
        route: '/resources',
        description: 'Browse PMFME 35% subsidies, RKVY-RAFTAAR & Northeast horticulture grants.',
      },
    ],
    vernacularCourses: [
      {
        title: 'Food Process Engineering, Cold Storage & Solar Thermal',
        provider: 'NPTEL / SWAYAM',
        languages: 'English + Hindi, Marathi, Tamil, Telugu, Bengali Subtitles',
        url: 'https://nptel.ac.in/',
        note: 'IIT Kharagpur & IIT Roorkee lectures on dehydration, cold chain & shelf life.',
      },
      {
        title: 'Arduino Soil Sensors, FreeCAD Hoppers & QGIS Farm Mapping',
        provider: 'IIT Bombay Spoken Tutorial',
        languages: '22 Scheduled Indian Languages',
        url: 'https://spoken-tutorial.org/',
        note: 'Build optical spice sorters and farm telemetry tools in your local language.',
      },
      {
        title: 'Food Processing Technician & Cold-Storage Operator',
        provider: 'Skill India Digital',
        languages: '12+ Regional Indian Languages',
        url: 'https://www.skillindiadigital.gov.in/',
        note: 'HACCP hygiene, FSSAI batch traceability & solar refrigeration servicing.',
      },
    ],
    pilotBridge: {
      batchRangeLabel: '5 – 25 Solar Cold Skids / Sorting Lines with FPOs',
      emsAndJobShops:
        'Fabricate stainless-steel SS-304 hoppers, PUF insulated boxes & brazing assemblies in Nashik, Pune, Coimbatore, Ludhiana, or Guwahati sheet-metal shops.',
      sharedNationalLabs:
        'Test shelf life, nutrition retention & compressor COP at ICAR-CIPHET Ludhiana, Vigyan Ashram Pabal (rural Pune), and MoFPI food testing labs.',
      executionWorkbenches: [
        { label: 'SS-304 Hopper & Frame RFQ', route: '/manufacturing/rfq', detail: 'Estimate laser cutting, TIG welding & PUF panel cost.' },
        { label: 'Sensor & Logger PCBA Quote', route: '/assembly', detail: 'Price waterproof LoRaWAN & BLE cold-chain probes.' },
        { label: 'Agri-Tech Component Sourcing', route: '/sourcing', detail: 'Find IP68 glands, SHT35 sensors & MPPT MOSFETs.' },
        { label: 'APEDA & Export Margin Tool', route: '/export', detail: 'Compute GCC/EU reefer export duties & RoDTEP benefits.' },
      ],
    },
    grantTags: ['MoFPI', 'NIDHI-PRAYAS', 'PMEGP', 'SISFS'],
    grantNotes:
      'MoFPI PMFME gives 35% capital subsidy (up to ₹10L–₹3 Cr), while RKVY-RAFTAAR funds ₹25L early agri-hardware validation.',
    digitalAndCraftBridgeNote:
      'Pairs ONDC rural FPO farmer storefronts & Bhashini voice advisories (/learn?track=code) with GI spice/millet/bamboo packaging exports.',
    spotlightId: 'agro-food-coldchain',
  },

  'specialty-materials-chemicals': {
    sectorId: 'specialty-materials-chemicals',
    shortLabel: 'Materials & Bio',
    accentTone: 'learn',
    additionalRegionalHubs: ['Guwahati', 'Agartala', 'Dehradun', 'Mumbai', 'Kochi'],
    matchedRoadmapSlugs: [
      'systems-engineering-and-architecture',
      'meta-learning-for-engineers',
      'mechanical-cad-and-enclosures',
    ],
    plantBlueprintSlugs: ['carbon-fiber-hub', 'ev-battery-pack'],
    complianceSlugs: ['ais156-ev-battery-pack', 'bis-crs-smps-adapter'],
    autopsyLinks: [
      {
        kind: 'story',
        slug: 'ather-energy-first-smart-ev',
        takeaway: 'How phase-change potting & thermal interface compounds prevent thermal propagation.',
      },
      {
        kind: 'story',
        slug: 'kaveri-loomworks-tiruppur-smart-knitting',
        takeaway: 'Using OEKO-TEX/ZDHC non-toxic dye chemistry to unlock strict EU export buyers.',
      },
      {
        kind: 'museum',
        slug: 'uncertified-liion-pack-air-cargo-rejection',
        takeaway: 'Material flammability (UL 94V-0) & UN 38.3 electrolyte safety make or break export eligibility.',
      },
    ],
    zeroCostPrototypingRoutes: [
      {
        label: 'Thermal Conductivity & TIM Lab',
        route: '/thermal',
        description: 'Compare TIM gap-pads, potting epoxies & phase-change cooling behavior.',
      },
      {
        label: 'Battery Electrolyte & EIS Lab',
        route: '/battery-eis',
        description: 'Inspect solid-electrolyte impedance & degradation profiles.',
      },
      {
        label: 'Dielectric & Radome RF Lab',
        route: '/rf-calc',
        description: 'Evaluate PTFE, FR-4 & glass-fiber composite dielectric loss tangents.',
      },
      {
        label: 'Composite & Materials Physics',
        route: '/manufacturing/physics',
        description: 'Explore stress-strain behavior, impact absorption & structural tradeoffs.',
      },
      {
        label: 'Youth Bamboo & Bio-Materials',
        route: '/young-innovators',
        description: 'Build biodegradable packaging & engineered bamboo craft composites.',
      },
      {
        label: 'I-STEM & CSIR Lab Access',
        route: '/resources',
        description: 'Reserve SEM/TEM, DSC, FTIR & ZLD water testing at CSIR & IIT labs.',
      },
    ],
    vernacularCourses: [
      {
        title: 'Polymer Composites, Battery Materials & Green Chemical Engineering',
        provider: 'NPTEL / SWAYAM',
        languages: 'English + Regional Language Transcripts',
        url: 'https://nptel.ac.in/',
        note: 'ICT Mumbai, IIT Madras & IIT Guwahati courses on formulation & ZLD sustainability.',
      },
      {
        title: 'Avogadro, GChemPaint, LaTeX & Python Data Analysis',
        provider: 'IIT Bombay Spoken Tutorial',
        languages: '22 Scheduled Indian Languages',
        url: 'https://spoken-tutorial.org/',
        note: 'Visualize molecules, formulate batch spreadsheets & report lab data in local tongues.',
      },
      {
        title: 'Composite Technician, Water Treatment & Lab QA Analyst',
        provider: 'Skill India Digital',
        languages: '12+ Regional Indian Languages',
        url: 'https://www.skillindiadigital.gov.in/',
        note: 'Safety MSDS handling, composite layup & ZLD membrane monitoring.',
      },
    ],
    pilotBridge: {
      batchRangeLabel: '50 kg – 2 Ton Pilot Batches via Toll Formulators & Composite Cells',
      emsAndJobShops:
        'Contract toll-blending & reactor pilots in Vapi, Ankleshwar, Dahej, and Vadodara let you validate 100 kg specialty batches before CapEx; Northeast Bamboo Tech Park (Guwahati/Agartala) pilots engineered bio-composites.',
      sharedNationalLabs:
        'Book analytical characterization (XRD, TGA, ICP-OES, tensile) via I-STEM at CSIR-NCL Pune, CSIR-NEERI Nagpur, CIPET centres, and IIT Guwahati.',
      executionWorkbenches: [
        { label: 'Composite & Enclosure RFQ', route: '/manufacturing/rfq', detail: 'Estimate vacuum-bagged carbon/bamboo tooling batches.' },
        { label: 'Safety & Material Compliance', route: '/compliance', detail: 'Map UL 94V-0, RoHS, REACH & BIS chemical standards.' },
        { label: 'I-STEM & CSIR Testbeds', route: '/testbeds', detail: 'Locate NABL material flammability & membrane test labs.' },
        { label: 'Global Export & REACH Hub', route: '/export', detail: 'Check EU REACH SVHC, CBAM & HSN export classifications.' },
      ],
    },
    grantTags: ['BIRAC', 'NIDHI-PRAYAS', 'SISFS', 'PMEGP'],
    grantNotes:
      'Bio-polymers, black-mass recycling, and clean water membranes qualify for BIRAC BIG (₹50L) and DST Clean Tech grants.',
    digitalAndCraftBridgeNote:
      'Connects Northeast Bamboo & Craft Technology Parks (Guwahati/Agartala) with circular water purification and bio-resin manufacturing.',
    spotlightId: 'climate-water-circularity',
  },

  'rail-marine-heavy-infra': {
    sectorId: 'rail-marine-heavy-infra',
    shortLabel: 'Rail & Marine',
    accentTone: 'code',
    additionalRegionalHubs: ['Kochi', 'Kharagpur', 'Rourkela', 'Bhubaneswar'],
    matchedRoadmapSlugs: [
      'systems-engineering-and-architecture',
      'embedded-systems-from-zero',
      'rust-systems-programming',
      'robotics-and-ros2',
    ],
    plantBlueprintSlugs: ['precision-mechanical-parts', 'ev-battery-pack'],
    complianceSlugs: ['tec-mtcte-cellular-router', 'wpc-eta-lora-iot'],
    autopsyLinks: [
      {
        kind: 'story',
        slug: 'narmada-precision-rajkot-coimbatore-castings',
        takeaway: 'Precision heavy-machined & NDT-inspected components winning international export contracts.',
      },
      {
        kind: 'teardown',
        slug: 'india-smart-grid-lorawan-energy-meter',
        takeaway: 'Lessons in extreme surge immunity, DIN-rail reliability & conformal-coated outdoor nodes.',
      },
      {
        kind: 'museum',
        slug: 'uncertified-rf-module-nhava-sheva-seizure',
        takeaway: 'Avoiding customs holds by certifying marine/rail wireless telemetry up front.',
      },
    ],
    zeroCostPrototypingRoutes: [
      {
        label: 'Traction & Marine Propulsion FOC',
        route: '/motor-foc',
        description: 'Model high-torque traction & ROV thruster motor control algorithms.',
      },
      {
        label: 'CAN / Heavy Vehicle Telemetry Bus',
        route: '/can-bus',
        description: 'Simulate bogie health, axle-bearing temperature & marine NMEA/CAN frames.',
      },
      {
        label: 'EN 50155 Surge & EMC Lab',
        route: '/emc',
        description: 'Analyze high-voltage rail transient suppression & shielded harness routing.',
      },
      {
        label: 'Hardware Engineering Copilot',
        route: '/copilot',
        description: 'Draft FMEA tables, safety margins & RDSO/IRIS subsystem checklists.',
      },
      {
        label: 'Youth Marine ROV & Rail Track',
        route: '/young-innovators',
        description: 'Explore coastal buoyancy & wayside acoustic sensor student projects.',
      },
      {
        label: 'RDSO, NIOT & Eastern Zone Grants',
        route: '/resources',
        description: 'Access RDSO ₹1.5 Cr grants, Sagarmala & NIOT Chennai test tanks.',
      },
    ],
    vernacularCourses: [
      {
        title: 'Power System Protection, Marine Hydrodynamics & Welding Metallurgy',
        provider: 'NPTEL / SWAYAM',
        languages: 'English + Regional Transcripts',
        url: 'https://nptel.ac.in/',
        note: 'IIT Kharagpur, IIT Madras & IIT Roorkee lectures for rail & marine infrastructure.',
      },
      {
        title: 'FreeCAD Structural Assemblies, Scilab & Embedded C',
        provider: 'IIT Bombay Spoken Tutorial',
        languages: '22 Scheduled Indian Languages',
        url: 'https://spoken-tutorial.org/',
        note: 'Simulate structural brackets and wayside telemetry code in your native language.',
      },
      {
        title: 'NDT Ultrasonic Inspector, TIG Welder & Switchgear Technician',
        provider: 'Skill India Digital',
        languages: '12+ Regional Indian Languages',
        url: 'https://www.skillindiadigital.gov.in/',
        note: 'High-demand shop-floor roles in Jamshedpur, Coimbatore, Kochi & Vadodara.',
      },
    ],
    pilotBridge: {
      batchRangeLabel: '5 – 20 Ruggedized Field Subsystems for RDSO / Port Trials',
      emsAndJobShops:
        'Use Coimbatore, Jamshedpur & Vadodara heavy-fabrication workshops for CNC manifolds and IP67 anodized housings paired with industrial-grade EMS boards.',
      sharedNationalLabs:
        'Run coastal wave-tank trials at NIOT Chennai, shipyard validation at Cochin Shipyard Innovation Cell, and EMC/surge testing at ERTL/CPRI.',
      executionWorkbenches: [
        { label: 'IP67 Housing & Casting RFQ', route: '/manufacturing/rfq', detail: 'Price anodized CNC & sand-cast structural enclosures.' },
        { label: 'Industrial PCBA & Conformal Coat', route: '/assembly', detail: 'Quote EN 50155-ready heavy-duty circuit assemblies.' },
        { label: 'Harsh-Env Lab & Surge Testbeds', route: '/testbeds', detail: 'Find CPRI, ERTL & salt-spray vibration labs.' },
        { label: 'Global Rail & Grid Export Hub', route: '/export', detail: 'Map IRIS/TÜV requirements & Africa/GCC tender duties.' },
      ],
    },
    grantTags: ['RDSO', 'iDEX', 'NIDHI-PRAYAS', 'SISFS'],
    grantNotes:
      'Indian Railways RDSO Innovation Policy funds up to ₹1.5 Cr (50% cost-sharing) for rolling-stock & wayside safety electronics.',
    digitalAndCraftBridgeNote:
      'Connects coastal aquaculture/rail predictive AI (/learn?track=research) with ruggedized Indian mechanical foundry ecosystems.',
    spotlightId: 'rail-marine-heavy-infra',
  },
};

function resolveAutopsy(ref: SectorAutopsyRef): ResolvedAutopsyLink | null {
  if (ref.kind === 'story') {
    const story = FEATURED_BUILD_STORIES.find((s) => s.slug === ref.slug);
    if (!story) return null;
    return {
      ...ref,
      title: story.title,
      route: `/stories/${story.slug}`,
    };
  }
  if (ref.kind === 'teardown') {
    const teardown = TEARDOWNS_DATA.find((t) => t.slug === ref.slug);
    if (!teardown) return null;
    return {
      ...ref,
      title: teardown.title,
      route: `/teardowns/${teardown.slug}`,
    };
  }
  const exhibit = MUSEUM_EXHIBITS.find((m) => m.slug === ref.slug);
  if (!exhibit) return null;
  return {
    ...ref,
    title: exhibit.title,
    route: `/museum/${exhibit.slug}`,
  };
}

function buildEnrichedSector(meta: SectorPathwayMeta): EnrichedSectorPathway {
  const enrichment = SECTOR_PATHWAY_ENRICHMENTS[meta.id];
  const matchedRoadmaps = enrichment.matchedRoadmapSlugs
    .map((slug) => ALL_ROADMAPS.find((r) => r.slug === slug))
    .filter((r): r is RoadmapView => Boolean(r));

  const matchedPlants = enrichment.plantBlueprintSlugs
    .map((slug) => PLANT_BLUEPRINTS.find((p) => p.slug === slug))
    .filter((p): p is PlantBlueprint => Boolean(p));

  const matchedCompliances = enrichment.complianceSlugs
    .map((slug) => COMPLIANCE_ROADMAPS.find((c) => c.slug === slug))
    .filter((c): c is ComplianceRoadmapItem => Boolean(c));

  const resolvedAutopsies = enrichment.autopsyLinks
    .map(resolveAutopsy)
    .filter((a): a is ResolvedAutopsyLink => Boolean(a));

  const grantDetails = enrichment.grantTags.map((tag) => GRANT_CATALOG[tag]);

  const spotlightBridge = enrichment.spotlightId
    ? BROAD_SECTOR_SPOTLIGHTS.find((s) => s.id === enrichment.spotlightId)
    : undefined;

  const allClusterCities = Array.from(
    new Set([...meta.indiaClusterCities, ...enrichment.additionalRegionalHubs]),
  );

  return {
    ...meta,
    enrichment,
    allClusterCities,
    matchedRoadmaps,
    matchedPlants,
    matchedCompliances,
    resolvedAutopsies,
    grantDetails,
    spotlightBridge,
  };
}

export const ALL_ENRICHED_SECTORS: EnrichedSectorPathway[] = SECTOR_IDS.map((id) => {
  const meta = getSectorMeta(id) ?? SECTOR_PATHWAYS_CORE.find((s) => s.id === id)!;
  return buildEnrichedSector(meta);
});

/**
 * Cross-cutting software, AI, digital public infrastructure, and GI Craft spotlights
 * bridged from BROAD_SECTOR_SPOTLIGHTS so non-factory builders still see clear entry paths.
 */
export const CROSS_CUTTING_SECTOR_BRIDGES: PanIndiaSectorSpotlight[] =
  BROAD_SECTOR_SPOTLIGHTS.filter((spotlight) =>
    ['ai-dpi-vernacular-software', 'handicraft-gi-d2c-design', 'climate-water-circularity'].includes(
      spotlight.id,
    ),
  );

export const PAN_INDIA_ECOSYSTEM_SNAPSHOT = {
  fundingProgramCount: INDIA_FUNDING_PROGRAMS.length,
  prototypingAccessCount: FREE_PROTOTYPING_ACCESS.length,
  freeLibraryCount: FREE_RESOURCES_LIBRARY.length,
};

export function getEnrichedSector(slug: string): EnrichedSectorPathway | undefined {
  return ALL_ENRICHED_SECTORS.find((sector) => sector.id === slug);
}

/**
 * Search and rank all 10 enriched sectors across core metadata, regional hubs (e.g., Guwahati, Pune,
 * Surat, Tiruppur, Rajkot, Bengaluru, Coimbatore, Hyderabad), grant tags, and plant blueprints.
 */
export function searchEnrichedSectors(
  query: string,
  clusterOrTag?: string,
): EnrichedSectorPathway[] {
  const q = query.trim().toLowerCase();
  const filterToken = clusterOrTag?.trim().toLowerCase() ?? '';

  let pool = ALL_ENRICHED_SECTORS;

  if (filterToken && filterToken !== 'all') {
    const filterWords = filterToken.split(/[\s/,&-]+/).filter((w) => w.length >= 2);
    pool = pool.filter((sector) => {
      const searchableHubs = [
        ...sector.allClusterCities,
        ...sector.enrichment.grantTags,
        sector.enrichment.shortLabel,
      ]
        .join(' ')
        .toLowerCase();
      return (
        searchableHubs.includes(filterToken) ||
        filterWords.some((word) => searchableHubs.includes(word))
      );
    });
  }

  if (!q) {
    return pool;
  }

  const coreMatches = new Set(recommendSectorsForSkill(q).map((s) => s.id));
  const queryTokens = q.split(/\s+/).filter(Boolean);

  return pool
    .map((sector) => {
      const extraCorpus = [
        sector.name,
        sector.tagline,
        sector.enrichment.shortLabel,
        ...sector.allClusterCities,
        ...sector.enrichment.grantTags,
        ...sector.keyComplianceStandards,
        ...sector.matchedRoadmaps.map((r) => r.title),
        ...sector.matchedPlants.map((p) => p.title),
        sector.enrichment.digitalAndCraftBridgeNote,
        sector.globalExportDemand,
      ]
        .join(' ')
        .toLowerCase();

      let score = coreMatches.has(sector.id) ? 10 : 0;
      if (extraCorpus.includes(q)) score += 12;
      for (const token of queryTokens) {
        if (token.length < 2) continue;
        if (extraCorpus.includes(token)) score += 4;
      }

      return { sector, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.sector);
}

/**
 * Look up matched sectors and a primary interactive lab route for a given roadmap slug/track.
 */
export function getRoadmapNextSteps(roadmapSlug: string, track?: string): {
  primarySectorRoute: string;
  primarySectorLabel: string;
  primaryLabRoute: string;
  primaryLabLabel: string;
} {
  const matched = ALL_ENRICHED_SECTORS.filter((s) =>
    s.enrichment.matchedRoadmapSlugs.includes(roadmapSlug),
  );
  const firstSector = matched[0];
  const firstLab = firstSector?.enrichment.zeroCostPrototypingRoutes[0];

  if (firstSector && firstLab) {
    return {
      primarySectorRoute: `/sectors/${firstSector.id}`,
      primarySectorLabel: firstSector.enrichment.shortLabel,
      primaryLabRoute: firstLab.route,
      primaryLabLabel: 'Labs',
    };
  }

  if (track === 'code' || track === 'research') {
    return {
      primarySectorRoute: '/sectors/semiconductors-electronics',
      primarySectorLabel: 'Sectors',
      primaryLabRoute: '/manufacturing/hdl',
      primaryLabLabel: 'Labs',
    };
  }

  return {
    primarySectorRoute: '/sectors',
    primarySectorLabel: 'Sectors',
    primaryLabRoute: '/manufacturing',
    primaryLabLabel: 'Labs',
  };
}
