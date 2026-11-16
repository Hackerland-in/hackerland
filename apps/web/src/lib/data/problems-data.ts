import type { Problem } from '@hackerland/core';

export const UNSOLVED_PROBLEMS_CATALOG: Problem[] = [
  {
    id: 'prob_1',
    title: 'Affordable Non-Invasive Hemoglobin Screening for Rural Primary Health Centers',
    slug: 'affordable-non-invasive-hemoglobin-screening',
    description: 'Over 50% of rural women in India suffer from anemia. Existing invasive blood prick tests require trained phlebotomists, sterile lancets, and cold storage for chemical reagents. We need an optical multi-wavelength photoplethysmography (PPG) device costing under ₹3,000 ($35) that estimates hemoglobin levels via fingertip in under 15 seconds.',
    domain: 'healthcare',
    sourceType: 'government',
    sourceName: 'National Health Mission Challenge',
    impactTarget: '25,000 Primary Healthcare Centers & Anganwadi Workers',
    keyConstraints: [
      'Unit hardware cost must be under ₹3,000',
      'Battery life > 48 hours on a single USB-C charge',
      'Optical estimation accuracy within ±0.8 g/dL of lab venous draw',
    ],
    claimedProjectsCount: 3,
    status: 'unsolved',
    bountyRewardInr: 150000,
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-11-16T00:00:00.000Z',
  },
  {
    id: 'prob_2',
    title: 'Ultra-Low-Cost LoRa Soil Moisture & Salinity Sensor for Smallholder Farms',
    slug: 'low-cost-lora-soil-moisture-salinity-sensor',
    description: 'Existing commercial agricultural FDR/TDR soil moisture probes cost ₹8,000–₹25,000 each, making grid deployment impossible for 2-acre farmers. We need a capacitive PCB-trace probe with temperature and electrical conductivity (EC) sensing that communicates via sub-GHz LoRaWAN to a village gateway and costs under ₹500 ($6) per node in 100-unit batches.',
    domain: 'agriculture',
    sourceType: 'organization',
    sourceName: 'Indian Council of Agricultural Research (ICAR)',
    impactTarget: '10,000+ Smallholder Farmers in Vidarbha & Marathwada',
    keyConstraints: [
      'Corrosion-resistant conformal coating or FR4 solder mask surviving 3 seasons',
      'Operating life > 2 years on 2x AA lithium batteries',
      'Sub-GHz transmission range > 3 km line-of-sight',
    ],
    claimedProjectsCount: 5,
    status: 'investigating',
    bountyRewardInr: 200000,
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-11-16T00:00:00.000Z',
  },
  {
    id: 'prob_3',
    title: 'Decentralized Solar-Powered Atmospheric Water Generation for Arid Rajasthan',
    slug: 'solar-atmospheric-water-generation-arid',
    description: 'Groundwater in Western Rajasthan and Kutch is deeply saline and contaminated with fluoride. We need an energy-efficient metal-organic framework (MOF) or Peltier-assisted condensation system running directly on 200W solar panels that produces 10-15 liters of potable drinking water daily at 20-30% relative humidity.',
    domain: 'clean_water',
    sourceType: 'academic',
    sourceName: 'IIT Jodhpur Desalination Lab',
    impactTarget: 'Off-grid desert settlements & border outposts',
    keyConstraints: [
      'Operate effectively down to 25% relative humidity',
      'Zero consumable filter cartridges required for first 24 months',
      'Total system CapEx < ₹25,000',
    ],
    claimedProjectsCount: 2,
    status: 'unsolved',
    bountyRewardInr: 300000,
    createdAt: '2026-03-05T00:00:00.000Z',
    updatedAt: '2026-11-16T00:00:00.000Z',
  },
  {
    id: 'prob_4',
    title: 'Sub-$50 Open-Source CubeSat UHF/VHF Telemetry Transceiver',
    slug: 'sub-50-dollar-cubesat-telemetry-transceiver',
    description: 'College satellite programs spend over $5,000 purchasing proprietary CubeSat communications boards. We need an open-hardware 1U CubeSat transceiver board built around commercial off-the-shelf (COTS) silicon (e.g. CC1120 / SX1276) with AX.25 packet framing and 1W RF output power verified in thermal-vacuum testing.',
    domain: 'space_aerospace',
    sourceType: 'community',
    sourceName: 'Open Aerospace Collective',
    impactTarget: '50+ University Satellite Teams globally',
    keyConstraints: [
      'Total BOM cost < $50',
      'PC104 form factor compatible',
      'Radiation-mitigated watchdog circuit',
    ],
    claimedProjectsCount: 4,
    status: 'prototyping',
    bountyRewardInr: 250000,
    createdAt: '2026-04-12T00:00:00.000Z',
    updatedAt: '2026-11-16T00:00:00.000Z',
  },
];

export async function listProblems(domain?: string): Promise<Problem[]> {
  if (!domain || domain === 'all') return UNSOLVED_PROBLEMS_CATALOG;
  return UNSOLVED_PROBLEMS_CATALOG.filter((p) => p.domain === domain);
}

export async function getProblem(slug: string): Promise<Problem | null> {
  return UNSOLVED_PROBLEMS_CATALOG.find((p) => p.slug === slug) || null;
}
