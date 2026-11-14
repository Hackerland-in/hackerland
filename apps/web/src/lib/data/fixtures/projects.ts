import type { ProjectDetail, ProjectSummary } from '../types';
import {
  PERSON_ARJUN,
  PERSON_KABIR,
  PERSON_KAVYA,
  PERSON_LENA,
  PERSON_MEERA,
  PERSON_ZOYA,
  PROFILE_MEERA,
} from './people';

export const PROJECT_AEROGLIDE_DETAIL: ProjectDetail = {
  slug: 'aeroglide',
  title: 'AeroGlide UAV',
  summary:
    'Solar-electric stratospheric glider built from carbon-fiber spars and custom telemetry for high-altitude atmospheric sensing.',
  body: `AeroGlide is a lightweight, ultra-efficient autonomous glider intended for endurance monitoring of microclimate shifts, particulate plumes, and seasonal weather patterns.

Designed with an 8-meter carbon fiber wing chord and integrated solar skin, it communicates flight telemetry over dual redundant LoRa and satellite links back to a ground station dashboard.`,
  tracks: ['make', 'research'],
  stage: 'prototype',
  licence: 'CERN-OHL-P-2.0',
  squad: [
    PERSON_MEERA,
    PERSON_KABIR,
    PERSON_ARJUN,
    PERSON_LENA,
    PERSON_KAVYA,
    PERSON_ZOYA,
    {
      handle: 'rahul-verma',
      name: 'Rahul Verma',
      badges: [{ label: 'Avionics', tone: 'code' }],
    },
  ],
  squadSize: 7,
  openRoleCount: 3,
  funding: {
    goal: 250000,
    raised: 120000,
    currency: 'INR',
  },
  updatedAt: '2026-11-12T08:30:00Z',
  leads: [
    {
      ...PERSON_MEERA,
      role: 'Chief Scientific Advisor',
      bio: 'Advising on wing aero-elastic stability and propulsion testing protocols.',
      skills: ['Propulsion', 'Aerodynamics', 'AS9100 Standard'],
    },
    {
      ...PERSON_KABIR,
      role: 'Project Lead & Airframe Engineer',
      bio: 'Leading composite layups and onboard avionics packaging.',
      skills: ['Airframe CAD', 'Carbon Composite', 'STM32'],
    },
  ],
  openRoles: [
    {
      id: 'role-aeroglide-1',
      title: 'Flight Software & Telemetry Lead',
      track: 'code',
      skills: ['Rust', 'Embedded C', 'LoRaWAN', 'FreeRTOS'],
      description: 'Own the real-time flight control loop and state estimation filters.',
      compensation: {
        type: 'stipend',
        amount: 40000,
        currency: 'INR',
        period: 'month',
      },
    },
    {
      id: 'role-aeroglide-2',
      title: 'Aerodynamics CFD Fellow',
      track: 'research',
      skills: ['OpenFOAM', 'Ansys', 'Fluid Mechanics'],
      description: 'Run chord vortex simulations to optimize low-Reynolds gliding efficiency.',
      compensation: {
        type: 'revenue-share',
      },
    },
    {
      id: 'role-aeroglide-3',
      title: 'Field Test Safety Officer',
      track: 'make',
      skills: ['FAA/DGCA Regulations', 'UAV Pilot', 'Field Telemetry'],
      description: 'Manage safe tethered flight corridors and emergency cutoff systems.',
      compensation: {
        type: 'volunteer',
      },
    },
  ],
  resources: [
    {
      name: 'Toray T700 Carbon Fiber Prepreg (10m)',
      qty: 1,
      spec: '3K 200gsm plain weave',
      cost: 45000,
      currency: 'INR',
      status: 'funded',
    },
    {
      name: 'SunPower Maxeon Gen III Solar Cells',
      qty: 64,
      spec: '24.2% cell efficiency back-contact',
      cost: 52000,
      currency: 'INR',
      status: 'sourcing',
    },
    {
      name: 'Inconel 718 Fastener Kit',
      qty: 1,
      spec: 'Aerospace structural fasteners',
      cost: 23000,
      currency: 'INR',
      status: 'needs-funding',
    },
  ],
  updates: [],
  milestone: {
    current: 3,
    total: 5,
    label: 'Wind Tunnel Foil Test',
    next: 'Tethered Low-Altitude Tow Flight',
  },
};

export const PROJECT_SAATHI_DETAIL: ProjectDetail = {
  slug: 'saathi-voice',
  title: 'Saathi Voice AI',
  summary:
    'On-device open-source voice assistant supporting 14 Indic languages, running entirely on sub-$35 Raspberry Pi and RISC-V SBCs.',
  body: `Saathi brings low-latency, offline voice AI to rural health clinics and public kiosks across India without sending private patient recordings over the internet.`,
  tracks: ['code'],
  stage: 'beta',
  licence: 'Apache-2.0',
  squad: [PERSON_ARJUN, PERSON_KABIR],
  squadSize: 2,
  openRoleCount: 1,
  funding: {
    goal: 180000,
    raised: 180000,
    currency: 'INR',
  },
  updatedAt: '2026-11-11T12:00:00Z',
  leads: [
    {
      ...PERSON_ARJUN,
      role: 'Core ML Engineer',
      bio: 'Quantizing Whisper-small and Piper TTS models for NPU acceleration.',
      skills: ['PyTorch', 'ONNX', 'Quantization', 'Whisper'],
    },
  ],
  openRoles: [
    {
      id: 'role-saathi-1',
      title: 'Bhojpuri & Maithili Phonetics Contributor',
      track: 'code',
      skills: ['Linguistics', 'Audio Labeling', 'Phonology'],
      description: 'Audit vocabulary pronunciations for dialect accuracy.',
      compensation: {
        type: 'bounty',
        amount: 25000,
        currency: 'INR',
      },
    },
  ],
  resources: [
    {
      name: 'Orange Pi 5 Plus NPU Dev Boards',
      qty: 4,
      spec: 'RK3588 with 6 TOPS NPU',
      cost: 60000,
      currency: 'INR',
      status: 'funded',
    },
  ],
  updates: [],
  milestone: {
    current: 4,
    total: 4,
    label: '14 Language Benchmarks Complete',
    next: 'Field Trial in 25 Community Centers',
  },
};

export const PROJECT_OPEN_BRAILLE_DETAIL: ProjectDetail = {
  slug: 'open-braille',
  title: 'OpenBraille Slate',
  summary:
    'Refreshable 40-cell electromagnetic Braille display engineered for under $75 BOM to replace $3,000 commercial assistive readers.',
  body: `Tactile reading devices are priced out of reach for 99% of blind students in the developing world. OpenBraille uses micro-solenoid latches and recycled 3D printer filament to make literacy universally affordable.`,
  tracks: ['make', 'design'],
  stage: 'prototype',
  licence: 'GPL-3.0',
  squad: [PERSON_ZOYA, PERSON_LENA, PERSON_KABIR],
  squadSize: 3,
  openRoleCount: 2,
  funding: {
    goal: 150000,
    raised: 95000,
    currency: 'INR',
  },
  updatedAt: '2026-11-09T16:20:00Z',
  leads: [
    {
      ...PERSON_ZOYA,
      role: 'Ergonomics & Mechanical Lead',
      bio: 'Designing tactile dot spacing compliant with international Braille standards.',
      skills: ['SolidWorks', 'Rapid Prototyping', 'Accessibility Design'],
    },
  ],
  openRoles: [
    {
      id: 'role-braille-1',
      title: 'Tactile Latch Firmware Engineer',
      track: 'make',
      skills: ['ESP32', 'H-Bridge Drivers', 'Power Optimization'],
      description: 'Minimize pulse draw across 40 pin cells on battery operation.',
      compensation: {
        type: 'stipend',
        amount: 30000,
        currency: 'INR',
        period: 'month',
      },
    },
    {
      id: 'role-braille-2',
      title: 'Assistive UX Researcher',
      track: 'design',
      skills: ['User Testing', 'Accessibility Standards', 'WCAG'],
      description: 'Conduct feedback sessions with schools for the blind.',
      compensation: {
        type: 'volunteer',
      },
    },
  ],
  resources: [
    {
      name: 'SMD Micro Solenoids',
      qty: 320,
      spec: '5V miniature pull solenoid',
      cost: 40000,
      currency: 'INR',
      status: 'funded',
    },
  ],
  updates: [],
  milestone: {
    current: 2,
    total: 4,
    label: 'Cell Actuation Cycle Testing',
    next: 'Student Field Study',
  },
};

export const PROJECT_KISAN_SENSE_DETAIL: ProjectDetail = {
  slug: 'kisan-sense',
  title: 'KisanSense Soil Mesh',
  summary:
    'Solar-powered sub-soil moisture, NPK and salinity probe network with LoRa mesh telemetry and local crop irrigation advisories.',
  body: `KisanSense delivers high-density soil chemistry telemetry directly to farmers phones via SMS alerts without requiring costly cellular subscriptions for every probe.`,
  tracks: ['make', 'code'],
  stage: 'beta',
  licence: 'MIT',
  squad: [PERSON_ARJUN, PERSON_LENA],
  squadSize: 2,
  openRoleCount: 1,
  funding: {
    goal: 200000,
    raised: 160000,
    currency: 'INR',
  },
  updatedAt: '2026-11-07T10:00:00Z',
  leads: [
    {
      ...PERSON_ARJUN,
      role: 'Firmware & Network Architect',
      bio: 'Designing low-power mesh sleep cycles for 2-year field battery life.',
      skills: ['LoRaWAN', 'Meshtastic', 'Embedded C'],
    },
  ],
  openRoles: [
    {
      id: 'role-kisan-1',
      title: 'Agronomy Data Model Analyst',
      track: 'code',
      skills: ['Python', 'Agronomy', 'Time-series Analysis'],
      description: 'Tune soil moisture prediction equations against ground truth harvest data.',
      compensation: {
        type: 'bounty',
        amount: 35000,
        currency: 'INR',
      },
    },
  ],
  resources: [
    {
      name: 'Optical NPK Soil Sensors',
      qty: 20,
      spec: 'RS485 modbus industrial soil sensor',
      cost: 75000,
      currency: 'INR',
      status: 'funded',
    },
  ],
  updates: [],
  milestone: {
    current: 3,
    total: 4,
    label: 'LoRa Mesh Packet Retention 99.4%',
    next: 'Farm Deployment in 10 Villages',
  },
};

export const PROJECT_PIXEL_PATHSHALA_DETAIL: ProjectDetail = {
  slug: 'pixel-pathshala-open-illustration-kit-for-every-government-school-textbook-in-india',
  title:
    'Pixel Pathshala: Open Illustration Kit for Every Government School Textbook in India',
  summary:
    'A library of 4,000+ culturally authentic, open-access SVG diagrams and science illustrations licensed for free educational remixing across state board curricula.',
  body: `State textbooks frequently suffer from low-res photocopied diagrams and missing visual aids for complex scientific phenomena. Pixel Pathshala produces crisp, modular vector schematics covering physics, biology, mechanics and history adapted for vernacular printing.`,
  tracks: ['design'],
  stage: 'launched',
  licence: 'CC-BY-4.0',
  squad: [PERSON_ZOYA, PERSON_KAVYA, PERSON_MEERA],
  squadSize: 3,
  openRoleCount: 1,
  funding: {
    goal: 100000,
    raised: 100000,
    currency: 'INR',
  },
  updatedAt: '2026-11-05T14:15:00Z',
  leads: [
    {
      ...PERSON_ZOYA,
      role: 'Creative Director',
      bio: 'Leading illustration standards and vector consistency across curricula.',
      skills: ['Figma', 'Vector Illustration', 'Open Pedagogy'],
    },
  ],
  openRoles: [
    {
      id: 'role-pixel-1',
      title: 'Botany & Anatomy Vector Specialist',
      track: 'design',
      skills: ['SVG', 'Scientific Illustration', 'Inkscape'],
      description: 'Illustrate 120 standardized cellular biology diagrams for grade 10.',
      compensation: {
        type: 'stipend',
        amount: 25000,
        currency: 'INR',
        period: 'one-time',
      },
    },
  ],
  resources: [],
  updates: [],
  milestone: {
    current: 4,
    total: 4,
    label: '4,000 Asset Pack Published',
    next: 'State Curriculum Board Integration',
  },
};

export const ALL_PROJECTS: ProjectDetail[] = [
  PROJECT_AEROGLIDE_DETAIL,
  PROJECT_SAATHI_DETAIL,
  PROJECT_OPEN_BRAILLE_DETAIL,
  PROJECT_KISAN_SENSE_DETAIL,
  PROJECT_PIXEL_PATHSHALA_DETAIL,
];

export function toProjectSummary(detail: ProjectDetail): ProjectSummary {
  return {
    slug: detail.slug,
    title: detail.title,
    summary: detail.summary,
    tracks: detail.tracks,
    stage: detail.stage,
    licence: detail.licence,
    squad: detail.squad,
    squadSize: detail.squadSize,
    openRoleCount: detail.openRoleCount,
    funding: detail.funding,
    updatedAt: detail.updatedAt,
  };
}

export const ALL_PROJECT_SUMMARIES: ProjectSummary[] =
  ALL_PROJECTS.map(toProjectSummary);

PROFILE_MEERA.projects = [toProjectSummary(PROJECT_AEROGLIDE_DETAIL)];
