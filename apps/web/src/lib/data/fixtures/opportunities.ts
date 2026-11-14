import type { OpportunityView } from '../types';

export const OPP_BOUNTY_KISAN: OpportunityView = {
  id: 'opp-bounty-kisan-1',
  projectSlug: 'kisan-sense',
  kind: 'bounty',
  title: 'Tune soil moisture prediction model against ground truth harvest data',
  summary:
    'Calibrate the sub-soil moisture attenuation equations for deep black cotton soils using ground probe datasets collected across 10 trial farms.',
  sponsor: {
    name: 'KisanSense Mesh',
    url: 'https://hackerland.in',
  },
  reward: {
    amount: 35000,
    currency: 'INR',
  },
  tracks: ['code', 'research'],
  deadline: '2026-12-01',
  status: 'open',
};

export const OPP_PAID_ROLE_AEROGLIDE: OpportunityView = {
  id: 'opp-paid-aeroglide-1',
  projectSlug: 'aeroglide',
  kind: 'paid-role',
  title: 'Flight Software & Telemetry Lead',
  summary:
    'Lead the real-time flight control loop and dual-redundant LoRa/satellite communication firmware on high-altitude glider avionics.',
  sponsor: {
    name: 'AeroGlide UAV',
    url: 'https://hackerland.in',
  },
  reward: {
    amount: 40000,
    currency: 'INR',
  },
  tracks: ['code', 'make'],
  deadline: '2026-12-15',
  status: 'open',
};

export const OPP_GRANT_ASSISTIVE: OpportunityView = {
  id: 'opp-grant-open-hardware-1',
  kind: 'grant',
  title: 'Open Hardware Assistive Technology Seed Grant',
  summary:
    'Micro-grants for grassroots maker groups prototyping assistive mechanical and sensory devices with open-source CAD and electronics.',
  sponsor: {
    name: 'Maker Foundation',
    url: 'https://makerfoundation.org',
  },
  reward: {
    amount: 150000,
    currency: 'INR',
  },
  tracks: ['make', 'design'],
  deadline: '2026-12-31',
  status: 'open',
  externalUrl: 'https://makerfoundation.org/grants',
};

export const OPP_HACKATHON_INDIC: OpportunityView = {
  id: 'opp-hackathon-indic-ai-1',
  kind: 'hackathon',
  title: 'Indic Edge AI Sprint: Offline Speech & Vision on Microcontrollers',
  summary:
    'A 48-hour global distributed build sprint optimizing speech and edge-vision neural nets on sub-$10 microcontrollers and RISC-V development kits.',
  sponsor: {
    name: 'Open AI Collective',
    url: 'https://openaicollective.org',
  },
  reward: {
    amount: 200000,
    currency: 'INR',
  },
  tracks: ['code', 'earn'],
  deadline: '2027-01-20',
  status: 'open',
  externalUrl: 'https://openaicollective.org/sprint-2027',
};

export const OPP_BOUNTY_SAATHI: OpportunityView = {
  id: 'opp-bounty-saathi-1',
  projectSlug: 'saathi-voice',
  kind: 'bounty',
  title: 'Bhojpuri & Maithili Phonetics Contributor',
  summary:
    'Audit phonetic pronunciations and acoustic tokens for Bhojpuri and Maithili dialect accuracy in Saathi voice models.',
  sponsor: {
    name: 'Saathi Voice AI',
    url: 'https://hackerland.in',
  },
  reward: {
    amount: 25000,
    currency: 'INR',
  },
  tracks: ['code'],
  status: 'open',
};

export const ALL_OPPORTUNITIES: OpportunityView[] = [
  OPP_BOUNTY_KISAN,
  OPP_PAID_ROLE_AEROGLIDE,
  OPP_GRANT_ASSISTIVE,
  OPP_HACKATHON_INDIC,
  OPP_BOUNTY_SAATHI,
];
