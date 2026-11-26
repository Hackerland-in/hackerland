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

export const ALL_PEOPLE: PersonRef[] = [
  PERSON_MEERA,
  PERSON_KABIR,
  PERSON_ZOYA,
  PERSON_ARJUN,
  PERSON_LENA,
  PERSON_KAVYA,
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

export const ALL_PROFILES: ProfileView[] = [
  PROFILE_MEERA,
  PROFILE_KAVYA,
  PROFILE_KABIR,
  PROFILE_ZOYA,
  PROFILE_ARJUN,
  PROFILE_LENA,
];


