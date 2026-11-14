import type { PersonRef, ProfileView } from '../types';

export const PERSON_MEERA: PersonRef = {
  handle: 'meera-iyer',
  name: 'Dr. Meera Iyer',
  headline: 'Ex-ISRO Propulsion Scientist · Visiting Professor at IISc',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
  badges: [
    { label: '40+ yrs aerospace', tone: 'make' },
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
  bio: 'Spent 42 years designing propulsion feeds, cryogenic combustion stages, and satellite thermal envelopes. Now mentoring the next generation of aerospace tinkerers and high-school rocketry clubs across India.',
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

