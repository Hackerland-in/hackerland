import type { PersonRef, ProfileView } from '../types';

export const PERSON_MEERA: PersonRef = {
  handle: 'meera-iyer',
  name: 'Dr. Meera Iyer',
  headline: 'Ex-ISRO Propulsion Scientist · Visiting Professor at IISc',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
  badges: [
    { label: 'Propulsion Lead', tone: 'make' },
    { label: 'Mentor', tone: 'neutral' },
  ],
};

export const PERSON_KABIR: PersonRef = {
  handle: 'kabir-shah',
  name: 'Kabir Shah',
  headline: 'Final Year Robotics Student · IIT Bombay',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  badges: [
    { label: 'Student', tone: 'code' },
    { label: 'Maker', tone: 'make' },
  ],
};

export const PERSON_ZOYA: PersonRef = {
  handle: 'zoya-khan',
  name: 'Zoya Khan',
  headline: 'Accessible Systems & Industrial Product Designer',
  avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&h=256&q=80',
  badges: [
    { label: 'Design Lead', tone: 'design' },
  ],
};

export const PERSON_ARJUN: PersonRef = {
  handle: 'arjun-menon',
  name: 'Arjun Menon',
  headline: 'Edge AI & Embedded Firmware Engineer',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
  badges: [
    { label: 'Firmware Dev', tone: 'code' },
  ],
};

export const PERSON_LENA: PersonRef = {
  handle: 'lena-fischer',
  name: 'Lena Fischer',
  headline: 'Additive Manufacturing Specialist · FabLab Berlin',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80',
  badges: [
    { label: 'Hardware Maker', tone: 'make' },
  ],
};

export const PERSON_KAVYA: PersonRef = {
  handle: 'kavya-subramaniam-ramakrishnan',
  name: 'Kavya Subramaniam Ramakrishnan-Venkataraghavan',
  headline: 'Computational Fluid Dynamics Researcher · IISc Bangalore',
  avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
  badges: [
    { label: 'Research Fellow', tone: 'research' },
  ],
};

export const PERSON_PRANAV: PersonRef = {
  handle: 'pranav-patel',
  name: 'Pranav Patel',
  headline: 'Precision CNC & IE4 Solar Agri-Pump Engineer · Rajkot',
  badges: [
    { label: 'Manufacturing Lead', tone: 'make' },
    { label: 'Export Builder', tone: 'earn' },
  ],
};

export const PERSON_ANANYA: PersonRef = {
  handle: 'ananya-barua',
  name: 'Ananya Barua',
  headline: 'Engineered Bamboo Composites & Brahmaputra Flood IoT · Guwahati',
  badges: [
    { label: 'North-East Maker', tone: 'make' },
    { label: 'Civil/Materials', tone: 'research' },
  ],
};

export const PERSON_KARTHIK: PersonRef = {
  handle: 'karthik-subramanian',
  name: 'Karthik Subramanian',
  headline: 'Textile Effluent Sensors & EU REACH Apparel Export Tech · Tiruppur',
  badges: [
    { label: 'Export Ready', tone: 'earn' },
    { label: 'Hardware Lead', tone: 'make' },
  ],
};

export const PERSON_FARHAN: PersonRef = {
  handle: 'farhan-wani',
  name: 'Farhan Wani',
  headline: 'Cold-Climate Solar Dryers & Kashmiri Saffron IoT · Srinagar',
  badges: [
    { label: 'Energy Builder', tone: 'make' },
    { label: 'Agritech', tone: 'code' },
  ],
};

export const PERSON_SUNITA: PersonRef = {
  handle: 'sunita-mohanty',
  name: 'Sunita Mohanty',
  headline: 'Marine Aquaculture Telemetry & ONDC Co-op Architect · Bhubaneswar',
  badges: [
    { label: 'Blue Economy', tone: 'make' },
    { label: 'ONDC / DPI', tone: 'code' },
  ],
};

export const PERSON_ROSHNI: PersonRef = {
  handle: 'roshni-verma',
  name: 'Roshni Verma',
  headline: 'Bhashini Indic Voice AI & Frugal Agri-MSME Software · Patna',
  badges: [
    { label: 'AI / DPI Builder', tone: 'code' },
    { label: 'Mentor', tone: 'neutral' },
  ],
};

export const ALL_PEOPLE: PersonRef[] = [
  PERSON_MEERA,
  PERSON_KABIR,
  PERSON_ZOYA,
  PERSON_ARJUN,
  PERSON_LENA,
  PERSON_KAVYA,
  PERSON_PRANAV,
  PERSON_ANANYA,
  PERSON_KARTHIK,
  PERSON_FARHAN,
  PERSON_SUNITA,
  PERSON_ROSHNI,
];

export const PROFILE_MEERA: ProfileView = {
  handle: 'meera-iyer',
  name: 'Dr. Meera Iyer',
  headline: 'Ex-ISRO Propulsion Scientist · Visiting Professor at IISc',
  bio: 'Spent 24 years designing propulsion feeds, cryogenic combustion stages, and satellite thermal envelopes. Now mentoring aerospace tinkerers and high-school rocketry clubs across India.',
  location: 'Bengaluru, India',
  avatarUrl: PERSON_MEERA.avatarUrl,
  tracks: ['make', 'research'],
  skills: [
    'Propulsion Systems',
    'Cryogenics',
    'Computational Fluid Dynamics',
    'AS9100 Quality Standard',
    'Telemetry Sensors',
  ],
  badges: PERSON_MEERA.badges,
  links: [
    { label: 'ResearchGate', url: 'https://researchgate.net' },
    { label: 'Google Scholar', url: 'https://scholar.google.com' },
    { label: 'GitHub', url: 'https://github.com' },
  ],
  reputation: 840,
  stats: {
    projects: 3,
    endorsements: 19,
    contributions: 142,
    earned: { amount: 150000, currency: 'INR' },
  },
  projects: [],
  mentorships: [
    {
      ...PERSON_KABIR,
      relation: 'mentee',
      project: 'AeroGlide UAV',
    },
    {
      ...PERSON_KAVYA,
      relation: 'mentee',
      project: 'AeroGlide UAV',
    },
  ],
  credentials: [
    { title: 'PhD in Aerospace Propulsion', issuer: 'Indian Institute of Science' },
    { title: 'Distinguished Scientist Award (2018)', issuer: 'ISRO' },
  ],
  endorsements: [
    {
      author: PERSON_KABIR,
      quote: 'Dr. Iyer reviewed our entire telemetry pipeline and caught a fatal sensor race condition before our first tethered flight test.',
    },
    {
      author: PERSON_ZOYA,
      quote: 'Exceptional rigor and patience in making deep-tech aerospace concepts accessible to young student makers.',
    },
  ],
  recentReputation: [
    {
      kind: 'bounty-completed',
      points: 50,
      label: 'Verified AS9100 telemetry spec for AeroGlide',
      at: '2026-11-10T14:30:00Z',
    },
    {
      kind: 'answer-accepted',
      points: 15,
      label: 'Accepted answer on pitot-tube calibration under humid conditions',
      at: '2026-11-08T10:15:00Z',
    },
    {
      kind: 'mentorship-session',
      points: 10,
      label: '1-on-1 flight envelope simulation review',
      at: '2026-11-05T09:00:00Z',
    },
  ],
};

export const PROFILE_KAVYA: ProfileView = {
  handle: PERSON_KAVYA.handle,
  name: PERSON_KAVYA.name,
  headline: PERSON_KAVYA.headline ?? 'Computational Fluid Dynamics Researcher · IISc Bangalore',
  bio: 'Researching fluid-structure interactions, transitional turbulence models, and high-altitude aerodynamic profiles for solar UAVs at IISc.',
  location: 'Bengaluru, India',
  avatarUrl: PERSON_KAVYA.avatarUrl,
  tracks: ['research', 'make'],
  skills: [
    'Computational Fluid Dynamics',
    'OpenFOAM',
    'Aerodynamic Modeling',
    'Mesh Generation',
    'Turbulence Simulation',
  ],
  badges: PERSON_KAVYA.badges,
  links: [
    { label: 'Google Scholar', url: 'https://scholar.google.com' },
    { label: 'GitHub', url: 'https://github.com' },
  ],
  reputation: 320,
  stats: {
    projects: 1,
    endorsements: 7,
    contributions: 48,
    earned: { amount: 45000, currency: 'INR' },
  },
  projects: [],
  mentorships: [
    {
      ...PERSON_MEERA,
      relation: 'mentor',
      project: 'AeroGlide UAV',
    },
  ],
  credentials: [
    { title: 'M.Tech in Aerospace Engineering', issuer: 'Indian Institute of Science' },
  ],
  endorsements: [
    {
      author: PERSON_MEERA,
      quote: 'Kavya developed an ultra-efficient mesh relaxation algorithm that sped up our high-altitude airfoil stall prediction by 3x.',
    },
  ],
  recentReputation: [
    {
      kind: 'bounty-completed',
      points: 50,
      label: 'Delivered NACA 6409 laminar bubble CFD analysis',
      at: '2026-11-11T12:00:00Z',
    },
    {
      kind: 'post-helpful',
      points: 2,
      label: 'Helpful answer on OpenFOAM snappyHexMesh refinement',
      at: '2026-11-07T16:20:00Z',
    },
  ],
};

export const PROFILE_KABIR: ProfileView = {
  handle: PERSON_KABIR.handle,
  name: PERSON_KABIR.name,
  headline: PERSON_KABIR.headline ?? 'Final Year Robotics Student · IIT Bombay',
  bio: 'Building low-cost autonomous rovers and ROS 2 navigation nodes. Passionate about robotics and embedded systems.',
  location: 'Mumbai, India',
  avatarUrl: PERSON_KABIR.avatarUrl,
  tracks: ['code', 'make'],
  skills: ['ROS 2', 'C++', 'Python', 'Kinematics', 'Gazebo', 'micro-ROS'],
  badges: PERSON_KABIR.badges,
  links: [
    { label: 'GitHub', url: 'https://github.com' },
    { label: 'Portfolio', url: 'https://hackerland.in' },
  ],
  reputation: 290,
  stats: {
    projects: 2,
    endorsements: 6,
    contributions: 38,
    earned: { amount: 35000, currency: 'INR' },
  },
  projects: [],
  mentorships: [],
  credentials: [{ title: 'B.Tech in Mechanical Engineering', issuer: 'IIT Bombay' }],
  endorsements: [],
  recentReputation: [
    {
      kind: 'role-filled',
      points: 15,
      label: 'Joined AeroGlide UAV as Avionics Lead',
      at: '2026-11-12T10:00:00Z',
    },
    {
      kind: 'bounty-completed',
      points: 50,
      label: 'Implemented ROS 2 Nav2 costmap filter',
      at: '2026-11-04T15:00:00Z',
    },
  ],
};

export const PROFILE_ZOYA: ProfileView = {
  handle: PERSON_ZOYA.handle,
  name: PERSON_ZOYA.name,
  headline: PERSON_ZOYA.headline ?? 'Accessible Systems & Industrial Product Designer',
  bio: 'Designing tactile user interfaces, 3D enclosures for rural agritech sensors, and assistive hardware.',
  location: 'New Delhi, India',
  avatarUrl: PERSON_ZOYA.avatarUrl,
  tracks: ['design', 'make'],
  skills: ['Fusion 360', 'Industrial Design', 'Ergonomics', 'Figma', 'Prototyping'],
  badges: PERSON_ZOYA.badges,
  links: [
    { label: 'Behance', url: 'https://behance.net' },
    { label: 'Design Log', url: 'https://hackerland.in' },
  ],
  reputation: 240,
  stats: {
    projects: 3,
    endorsements: 8,
    contributions: 42,
    earned: { amount: 60000, currency: 'INR' },
  },
  projects: [],
  mentorships: [],
  credentials: [{ title: 'M.Des Industrial Design', issuer: 'NID Ahmedabad' }],
  endorsements: [],
  recentReputation: [
    {
      kind: 'bounty-completed',
      points: 50,
      label: 'Designed snap-fit IP67 enclosure for KisanSense',
      at: '2026-11-09T14:00:00Z',
    },
  ],
};

export const PROFILE_ARJUN: ProfileView = {
  handle: PERSON_ARJUN.handle,
  name: PERSON_ARJUN.name,
  headline: PERSON_ARJUN.headline ?? 'Edge AI & Embedded Firmware Engineer',
  bio: 'Optimizing INT8 neural networks for ESP32-S3 and RP2040 microcontrollers. FreeRTOS & Rust enthusiast.',
  location: 'Kochi, India',
  avatarUrl: PERSON_ARJUN.avatarUrl,
  tracks: ['code', 'make'],
  skills: ['Embedded C', 'Rust', 'FreeRTOS', 'TensorFlow Lite', 'KiCad'],
  badges: PERSON_ARJUN.badges,
  links: [{ label: 'GitHub', url: 'https://github.com' }],
  reputation: 210,
  stats: {
    projects: 1,
    endorsements: 4,
    contributions: 30,
    earned: { amount: 25000, currency: 'INR' },
  },
  projects: [],
  mentorships: [],
  credentials: [{ title: 'B.Tech in Electronics', issuer: 'NIT Calicut' }],
  endorsements: [],
  recentReputation: [
    {
      kind: 'answer-accepted',
      points: 15,
      label: 'Solved DMA buffer overflow in I2S microphone driver',
      at: '2026-11-08T11:00:00Z',
    },
  ],
};

export const PROFILE_LENA: ProfileView = {
  handle: PERSON_LENA.handle,
  name: PERSON_LENA.name,
  headline: PERSON_LENA.headline ?? 'Additive Manufacturing Specialist · FabLab Berlin',
  bio: 'High-temperature FDM & SLA printing, parametric generative design, and open laboratory hardware.',
  location: 'Berlin, Germany',
  avatarUrl: PERSON_LENA.avatarUrl,
  tracks: ['make', 'learn'],
  skills: ['SLA Printing', 'Generative Design', 'OpenSCAD', 'CNC', 'Material Science'],
  badges: PERSON_LENA.badges,
  links: [{ label: 'FabLabs', url: 'https://fablabs.io' }],
  reputation: 195,
  stats: {
    projects: 2,
    endorsements: 5,
    contributions: 25,
    earned: { amount: 1200, currency: 'EUR' },
  },
  projects: [],
  mentorships: [],
  credentials: [{ title: 'Dipl.-Ing. Mechatronics', issuer: 'TU Berlin' }],
  endorsements: [],
  recentReputation: [
    {
      kind: 'post-helpful',
      points: 2,
      label: 'Guide on carbon-fiber nylon print annealing',
      at: '2026-11-06T18:00:00Z',
    },
  ],
};

export const PROFILE_PRANAV: ProfileView = {
  handle: PERSON_PRANAV.handle,
  name: PERSON_PRANAV.name,
  headline: PERSON_PRANAV.headline ?? 'Precision CNC & IE4 Solar Agri-Pump Engineer · Rajkot',
  bio: 'Second-generation pump foundry engineer in Shapar Veraval (Rajkot) turning legacy induction pumps into sensorless BLDC IE4 solar units built for Gujarat & East African off-grid farms.',
  location: 'Rajkot, Gujarat',
  tracks: ['make', 'earn'],
  skills: ['CNC Milling', 'BLDC Motor FOC', 'IGBT / SiC Drives', 'BIS IS 8034', 'Export Costing'],
  badges: PERSON_PRANAV.badges,
  links: [{ label: 'GitHub', url: 'https://github.com' }],
  reputation: 380,
  stats: {
    projects: 3,
    endorsements: 14,
    contributions: 68,
    earned: { amount: 185000, currency: 'INR' },
  },
  projects: [],
  mentorships: [],
  credentials: [{ title: 'B.E. Mechanical Engineering', issuer: 'L.D. College of Engineering, Ahmedabad' }],
  endorsements: [],
  recentReputation: [
    {
      kind: 'post-helpful',
      points: 20,
      label: 'Published IGTR CNC fixture drawings saving ₹1,800 per impeller',
      at: '2026-11-11T16:40:00Z',
    },
  ],
};

export const PROFILE_ANANYA: ProfileView = {
  handle: PERSON_ANANYA.handle,
  name: PERSON_ANANYA.name,
  headline: PERSON_ANANYA.headline ?? 'Engineered Bamboo Composites & Flood IoT · Guwahati',
  bio: 'Prototyping boron-treated laminated Assam bamboo beams for modular shelters and sub-GHz LoRa river-level telemetry nodes out of IIT Guwahati TIC & NECB.',
  location: 'Guwahati, Assam',
  tracks: ['make', 'research'],
  skills: ['Composite Layup', 'ASTM Structural Testing', 'LoRaWAN IN865', 'Solar Telemetry', 'UNNATI Schemes'],
  badges: PERSON_ANANYA.badges,
  links: [{ label: 'ResearchGate', url: 'https://researchgate.net' }],
  reputation: 315,
  stats: {
    projects: 2,
    endorsements: 11,
    contributions: 54,
    earned: { amount: 95000, currency: 'INR' },
  },
  projects: [],
  mentorships: [],
  credentials: [{ title: 'M.Tech Infrastructure Materials', issuer: 'IIT Guwahati' }],
  endorsements: [],
  recentReputation: [
    {
      kind: 'bounty-completed',
      points: 40,
      label: 'Validated IP68 enclosure seal for Brahmaputra silt depth probes',
      at: '2026-11-10T07:50:00Z',
    },
  ],
};

export const PROFILE_KARTHIK: ProfileView = {
  handle: PERSON_KARTHIK.handle,
  name: PERSON_KARTHIK.name,
  headline: 'Textile Effluent Sensors & EU REACH Apparel Tech · Tiruppur',
  bio: 'Helping 40+ Tiruppur MSME knitwear units automate dye-bath TDS/color monitoring, water recycling, and OEKO-TEX / EU DPP traceability compliance for European buyers.',
  location: 'Tiruppur, Tamil Nadu',
  tracks: ['make', 'earn'],
  skills: ['Optical Spectroscopy', 'OEKO-TEX Compliance', 'PLC Retrofits', 'EU REACH', 'PCB Layout'],
  badges: PERSON_KARTHIK.badges,
  links: [{ label: 'LinkedIn', url: 'https://linkedin.com' }],
  reputation: 410,
  stats: {
    projects: 3,
    endorsements: 16,
    contributions: 79,
    earned: { amount: 220000, currency: 'INR' },
  },
  projects: [],
  mentorships: [],
  credentials: [{ title: 'B.Tech Textile & Instrumentation', issuer: 'PSG College of Technology, Coimbatore' }],
  endorsements: [],
  recentReputation: [
    {
      kind: 'post-helpful',
      points: 25,
      label: 'Open-sourced inline optical turbidity & pH calibration table for dye houses',
      at: '2026-11-11T09:20:00Z',
    },
  ],
};

export const PROFILE_FARHAN: ProfileView = {
  handle: PERSON_FARHAN.handle,
  name: PERSON_FARHAN.name,
  headline: 'Cold-Climate Solar Dryers & Kashmiri Saffron IoT · Srinagar',
  bio: 'Building sub-zero LiFePO4 battery heating & phase-change solar dehydration chambers at CSIR-IIIM Srinagar BioNEST for high-altitude orchards in Kashmir and Ladakh.',
  location: 'Srinagar, Jammu & Kashmir',
  tracks: ['make', 'code'],
  skills: ['MPPT Firmware', 'Thermal Modeling', 'LiFePO4 Cold-Charge', 'Post-Harvest IoT', 'ESP32-C3'],
  badges: PERSON_FARHAN.badges,
  links: [{ label: 'GitHub', url: 'https://github.com' }],
  reputation: 295,
  stats: {
    projects: 2,
    endorsements: 9,
    contributions: 47,
    earned: { amount: 110000, currency: 'INR' },
  },
  projects: [],
  mentorships: [],
  credentials: [{ title: 'B.Tech Electrical Engineering', issuer: 'NIT Srinagar' }],
  endorsements: [],
  recentReputation: [
    {
      kind: 'post-helpful',
      points: 18,
      label: 'Benchmarked LiFePO4 self-heating film draw at -14°C in Leh',
      at: '2026-11-09T08:15:00Z',
    },
  ],
};

export const PROFILE_SUNITA: ProfileView = {
  handle: PERSON_SUNITA.handle,
  name: PERSON_SUNITA.name,
  headline: 'Marine Aquaculture Telemetry & ONDC Co-op Architect · Bhubaneswar',
  bio: 'Combinining CTTC Bhubaneswar CNC waterproof housings for Chilika shrimp pond DO/ammonia sensors with ONDC Beckn exporter catalogs for coastal FPOs.',
  location: 'Bhubaneswar, Odisha',
  tracks: ['code', 'make'],
  skills: ['ONDC / Beckn Protocol', 'STM32 Low-Power', 'Dissolved Oxygen Probes', 'TypeScript', 'Cold Chain'],
  badges: PERSON_SUNITA.badges,
  links: [{ label: 'GitHub', url: 'https://github.com' }],
  reputation: 340,
  stats: {
    projects: 2,
    endorsements: 12,
    contributions: 63,
    earned: { amount: 135000, currency: 'INR' },
  },
  projects: [],
  mentorships: [],
  credentials: [{ title: 'B.Tech Instrumentation & Electronics', issuer: 'CET Bhubaneswar' }],
  endorsements: [],
  recentReputation: [
    {
      kind: 'bounty-completed',
      points: 35,
      label: 'Shipped open Odia catalog adapter for FPO shrimp cold-lot auctions',
      at: '2026-11-07T11:30:00Z',
    },
  ],
};

export const PROFILE_ROSHNI: ProfileView = {
  handle: PERSON_ROSHNI.handle,
  name: PERSON_ROSHNI.name,
  headline: 'Bhashini Indic Voice AI & Frugal Agri-MSME Software · Patna',
  bio: 'Building zero-literacy voice workflows using Bhashini ULCA + FastAPI so rural makhana, silk, and brass units across Bihar & UP can issue GST/LUT e-invoices and ship internationally.',
  location: 'Patna, Bihar',
  tracks: ['code', 'learn'],
  skills: ['Bhashini ULCA', 'Indic ASR', 'ONDC Seller APIs', 'Next.js', 'Startup Bihar Advisory'],
  badges: PERSON_ROSHNI.badges,
  links: [{ label: 'GitHub', url: 'https://github.com' }],
  reputation: 365,
  stats: {
    projects: 3,
    endorsements: 15,
    contributions: 84,
    earned: { amount: 145000, currency: 'INR' },
  },
  projects: [],
  mentorships: [],
  credentials: [{ title: 'B.Tech Computer Science', issuer: 'NIT Patna' }],
  endorsements: [],
  recentReputation: [
    {
      kind: 'answer-accepted',
      points: 20,
      label: 'Shared streaming Bhojpuri ASR chunker with <420ms rural 4G latency',
      at: '2026-11-08T10:00:00Z',
    },
  ],
};

export const ALL_PROFILES: ProfileView[] = [
  PROFILE_MEERA,
  PROFILE_KAVYA,
  PROFILE_KABIR,
  PROFILE_ZOYA,
  PROFILE_ARJUN,
  PROFILE_LENA,
  PROFILE_PRANAV,
  PROFILE_ANANYA,
  PROFILE_KARTHIK,
  PROFILE_FARHAN,
  PROFILE_SUNITA,
  PROFILE_ROSHNI,
];


