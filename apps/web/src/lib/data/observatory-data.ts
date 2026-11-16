import type { ObservatoryItem } from '@hackerland/core';

export const OBSERVATORY_ITEMS: ObservatoryItem[] = [
  {
    id: 'obs_1',
    title: 'Selective Laser Sintering (SLS) Core Powder Bed Patents Expired',
    slug: 'sls-powder-bed-patent-expiry',
    category: 'patent_expiry',
    quadrant: 'Hardware & Silicon',
    ring: 'Adopt',
    summary:
      'Key foundational patents covering powder recoating and continuous laser sintering have entered the public domain. Just as the expiration of FDM patents sparked the RepRap 3D printing revolution in 2009, this opens the door to $800 desktop SLS nylon printing.',
    maturityLevel: 'Commercial Grade (Public Domain)',
    impactScore: 96,
    source: {
      name: 'USPTO Patent Database (US5597589A)',
      url: 'https://patents.google.com/patent/US5597589A/en',
      publishedDate: '2024-06-15',
    },
    makerAction:
      'Design an open-source heated chamber powder bed recoater using 450nm 10W blue laser diodes to sinter PA12 nylon powder without expensive CO2 optics.',
    commercialPotential:
      'Replace $40,000 industrial EOS / 3D Systems printers with sub-$1,500 desktop manufacturing nodes for functional mechanical prototypes.',
    tags: ['3D Printing', 'SLS', 'Public Domain', 'Additive Manufacturing', 'Nylon PA12'],
  },
  {
    id: 'obs_2',
    title: 'High-Rate Sodium-Ion Prussian White Cathode Chemistry',
    slug: 'sodium-ion-prussian-white-battery',
    category: 'research_breakthrough',
    quadrant: 'Energy & Propulsion',
    ring: 'Trial',
    summary:
      'Breakthrough peer-reviewed synthesis of Prussian White cathodes achieves 160 Wh/kg specific energy and 3,000 cycles at 80% capacity retention without requiring lithium, cobalt, or nickel. Raw materials are 70% cheaper than LFP.',
    maturityLevel: 'Pilot Factory Ready',
    impactScore: 92,
    source: {
      name: 'Nature Energy & IIT Madras Energy Lab',
      url: 'https://nature.com/articles/s41560-025-01640-x',
      publishedDate: '2025-10-18',
    },
    makerAction:
      'Prototype domestic home battery storage packs and solar streetlights using cylindrical 32140 Na-ion cells with custom Hackerland BMS firmware.',
    commercialPotential:
      'Ideal for stationary grid storage and low-speed two-wheelers in high ambient temperatures (operates safely up to 55°C without thermal runaway).',
    tags: ['Battery Tech', 'Sodium-Ion', 'Clean Energy', 'Grid Storage', 'Critical Minerals'],
  },
  {
    id: 'obs_3',
    title: 'Tiny Tapeout Open Silicon: 130nm Custom ASIC Fabrication for $300',
    slug: 'tiny-tapeout-open-silicon-asic',
    category: 'open_hardware',
    quadrant: 'Hardware & Silicon',
    ring: 'Adopt',
    summary:
      'The barrier to manufacturing custom microchips has collapsed. Tiny Tapeout bundles hundreds of digital and analog designs onto a single SkyWater 130nm multi-project wafer (MPW) shuttle, delivering packaged silicon chips mounted on breakout carrier boards directly to creators.',
    maturityLevel: 'Production Shuttles Running',
    impactScore: 98,
    source: {
      name: 'Tiny Tapeout & Efabless OpenLane',
      url: 'https://tinytapeout.com/',
      publishedDate: '2026-01-20',
    },
    makerAction:
      'Lay out a custom hardware neural network accelerator, DSP filter, or cryptographic co-processor using Verilog and submit via the Hackerland HDL toolchain.',
    commercialPotential:
      'Move beyond microcontrollers: build proprietary hardware IP blocks for edge AI, secure enclaves, and specialized sensor front-ends.',
    tags: ['Silicon', 'ASIC', 'Semiconductor', 'RISC-V', 'SkyWater 130nm'],
  },
  {
    id: 'obs_4',
    title: 'Axial-Flux PCB Stator Motors: Ironless Pancake Actuators',
    slug: 'axial-flux-pcb-stator-motors',
    category: 'open_hardware',
    quadrant: 'Robotics & Automation',
    ring: 'Trial',
    summary:
      'Replacing heavy copper wire coil windings with multi-layer FR4 PCB traces. Paired with dual rotor neodymium Halbach magnet arrays, these motors deliver 94% efficiency, zero cogging torque, and ultra-high torque density at 1/3 the thickness of conventional motors.',
    maturityLevel: 'High-Volume Prototyping',
    impactScore: 89,
    source: {
      name: 'IEEE Transactions on Industrial Electronics',
      url: 'https://ieeexplore.ieee.org/',
      publishedDate: '2025-08-11',
    },
    makerAction:
      'Use the Hackerland PCB Studio to generate a 6-layer spiral coil stator board and 3D print an axial-flux drone gimbal or robotic joint actuator.',
    commercialPotential:
      'Revolutionizes direct-drive robotic actuators, drone propulsion, and ultra-slim ceiling fans with fully automated PCB surface mount assembly.',
    tags: ['Motors', 'Robotics', 'Axial Flux', 'PCB Stator', 'Actuators'],
  },
  {
    id: 'obs_5',
    title: 'iDEX Challenge: Autonomous Counter-UAS RF Interceptor (₹1.5 Cr Grant)',
    slug: 'idex-counter-uas-grant',
    category: 'grant_fund',
    quadrant: 'Robotics & Automation',
    ring: 'Assess',
    summary:
      'India’s Defence Innovation Organisation (DIO) announced an open innovation challenge for software-defined RF jamming and computer vision kinetic interceptor drones to counter low-altitude swarm incursions.',
    maturityLevel: 'Open Challenge & Non-Dilutive Grant',
    impactScore: 91,
    source: {
      name: 'iDEX Ministry of Defence India',
      url: 'https://idex.gov.in/challenges',
      publishedDate: '2026-02-01',
    },
    makerAction:
      'Form a cross-disciplinary squad on Hackerland combining computer vision researchers, SDR radio engineers, and drone pilots to claim this problem.',
    commercialPotential:
      'Direct path to commercial defense procurement and ₹1.5 Crore milestone-based research grant funding.',
    tags: ['iDEX', 'Grant', 'Drones', 'RF Jamming', 'DeepTech', 'National Security'],
  },
  {
    id: 'obs_6',
    title: 'Slot-Die Coated Perovskite-on-Silicon Tandem Solar Cells (33.8% Efficiency)',
    slug: 'perovskite-silicon-tandem-solar-efficiency',
    category: 'research_breakthrough',
    quadrant: 'Energy & Propulsion',
    ring: 'Assess',
    summary:
      'Researchers demonstrated commercial-scale slot-die coating of self-healing perovskite layers on top of standard commercial silicon wafers, smashing through the theoretical single-junction Shockley-Queisser limit (29.4%) to achieve 33.8% verified power conversion.',
    maturityLevel: 'Lab Proof-of-Concept to Pilot',
    impactScore: 95,
    source: {
      name: 'Science & NREL Solar Cell Efficiency Tables',
      url: 'https://www.nrel.gov/pv/cell-efficiency.html',
      publishedDate: '2025-11-04',
    },
    makerAction:
      'Design low-cost automated roll-to-roll liquid deposition coating heads and test solar micro-inverter MPPT algorithms optimized for high-voltage tandem curves.',
    commercialPotential:
      'Generates 30% more kilowatt-hours from the exact same rooftop square footage, cutting the payback period of solar installations by 3.5 years.',
    tags: ['Solar', 'Perovskite', 'CleanTech', 'Photovoltaics', 'Energy'],
  },
];

export function listObservatoryItems(): ObservatoryItem[] {
  return OBSERVATORY_ITEMS;
}

export function getObservatoryItemById(id: string): ObservatoryItem | undefined {
  return OBSERVATORY_ITEMS.find((item) => item.id === id || item.slug === id);
}
