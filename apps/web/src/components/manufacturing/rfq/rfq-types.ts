export interface RFQConfig {
  boardName: string;
  widthMm: number;
  heightMm: number;
  layers: 1 | 2 | 4 | 6;
  quantity: number;
  thicknessMm: number;
  solderMask: 'green' | 'black' | 'red' | 'blue' | 'purple' | 'white';
  silkscreen: 'white' | 'black';
  surfaceFinish: 'hasl' | 'lead_free_hasl' | 'enig';
  copperWeight: '1oz' | '2oz';
  pcbAssembly: boolean;
  componentsCount: number;
}

export interface VendorQuote {
  vendorId: string;
  name: string;
  country: 'India' | 'Global';
  location: string;
  badge: string;
  turnaroundDays: string;
  pcbCostInr: number;
  pcbCostUsd: number;
  shippingInr: number;
  shippingUsd: number;
  customsTaxInr: number;
  customsTaxUsd: number;
  totalInr: number;
  totalUsd: number;
  pros: string[];
  instantUrl: string;
}

export const USD_TO_INR = 86.5;

export function calculateVendorQuotes(config: RFQConfig): VendorQuote[] {
  const areaSqCm = (config.widthMm * config.heightMm) / 100;
  const baseArea = Math.max(10, areaSqCm);

  // Multiplier for layer count
  const layerMultipliers: Record<number, number> = {
    1: 0.9,
    2: 1.0,
    4: 2.1,
    6: 3.6,
  };
  const layerMult = layerMultipliers[config.layers] ?? 1.0;

  // Surface finish adder
  const finishAdderUsd = config.surfaceFinish === 'enig' ? 12 : config.surfaceFinish === 'lead_free_hasl' ? 3 : 0;

  // Copper weight adder
  const copperMult = config.copperWeight === '2oz' ? 1.35 : 1.0;

  // Assembly adder
  const assemblyAdderUsd = config.pcbAssembly ? 25 + config.componentsCount * 0.08 * config.quantity : 0;

  // 1. LionCircuits (India - Bengaluru)
  const lionPcbUsd = (8 + (baseArea * 0.06 * layerMult * config.quantity * 0.15) + finishAdderUsd) * copperMult + assemblyAdderUsd * 0.85;
  const lionPcbInr = Math.round(lionPcbUsd * USD_TO_INR);
  const lionShippingInr = 250; // Domestic Bluedart
  const lionTotalInr = Math.round(lionPcbInr * 1.18 + lionShippingInr); // 18% GST

  // 2. PCB Power (India - Gujarat)
  const pcbPowerUsd = (9 + (baseArea * 0.065 * layerMult * config.quantity * 0.16) + finishAdderUsd) * copperMult + assemblyAdderUsd * 0.9;
  const pcbPowerInr = Math.round(pcbPowerUsd * USD_TO_INR);
  const pcbPowerShippingInr = 300;
  const pcbPowerTotalInr = Math.round(pcbPowerInr * 1.18 + pcbPowerShippingInr);

  // 3. Circuit99 (India - Hyderabad)
  const circuit99Usd = (7.5 + (baseArea * 0.058 * layerMult * config.quantity * 0.14) + finishAdderUsd) * copperMult + assemblyAdderUsd * 0.8;
  const circuit99Inr = Math.round(circuit99Usd * USD_TO_INR);
  const circuit99ShippingInr = 200;
  const circuit99TotalInr = Math.round(circuit99Inr * 1.18 + circuit99ShippingInr);

  // 4. JLCPCB (Global - China)
  const jlcPcbUsd = Math.max(2, (2 + (baseArea * 0.02 * layerMult * config.quantity * 0.1) + finishAdderUsd * 0.7) * copperMult + assemblyAdderUsd * 0.6);
  const jlcShippingUsd = 18; // DHL / FedEx to India
  const jlcCustomsUsd = Math.round((jlcPcbUsd + jlcShippingUsd) * 0.42); // India Basic Customs Duty (BCD) + IGST (~42%)
  const jlcTotalUsd = jlcPcbUsd + jlcShippingUsd + jlcCustomsUsd;

  // 5. PCBWay (Global - China)
  const pcbwayPcbUsd = Math.max(5, (5 + (baseArea * 0.03 * layerMult * config.quantity * 0.12) + finishAdderUsd) * copperMult + assemblyAdderUsd * 0.75);
  const pcbwayShippingUsd = 22;
  const pcbwayCustomsUsd = Math.round((pcbwayPcbUsd + pcbwayShippingUsd) * 0.42);
  const pcbwayTotalUsd = pcbwayPcbUsd + pcbwayShippingUsd + pcbwayCustomsUsd;

  return [
    {
      vendorId: 'lioncircuits',
      name: 'LionCircuits',
      country: 'India',
      location: 'Bengaluru, Karnataka',
      badge: 'Recommended for India',
      turnaroundDays: '3 - 5 Days',
      pcbCostInr: lionPcbInr,
      pcbCostUsd: Number((lionPcbInr / USD_TO_INR).toFixed(2)),
      shippingInr: lionShippingInr,
      shippingUsd: Number((lionShippingInr / USD_TO_INR).toFixed(2)),
      customsTaxInr: Math.round(lionPcbInr * 0.18),
      customsTaxUsd: Number(((lionPcbInr * 0.18) / USD_TO_INR).toFixed(2)),
      totalInr: lionTotalInr,
      totalUsd: Number((lionTotalInr / USD_TO_INR).toFixed(2)),
      pros: ['Zero Customs clearance delay', 'Official GST invoice for startups', 'Rapid domestic air express'],
      instantUrl: 'https://www.lioncircuits.com/',
    },
    {
      vendorId: 'pcbpower',
      name: 'PCB Power Market',
      country: 'India',
      location: 'Gandhinagar, Gujarat',
      badge: 'IPC Class 2/3 Certified',
      turnaroundDays: '4 - 6 Days',
      pcbCostInr: pcbPowerInr,
      pcbCostUsd: Number((pcbPowerInr / USD_TO_INR).toFixed(2)),
      shippingInr: pcbPowerShippingInr,
      shippingUsd: Number((pcbPowerShippingInr / USD_TO_INR).toFixed(2)),
      customsTaxInr: Math.round(pcbPowerInr * 0.18),
      customsTaxUsd: Number(((pcbPowerInr * 0.18) / USD_TO_INR).toFixed(2)),
      totalInr: pcbPowerTotalInr,
      totalUsd: Number((pcbPowerTotalInr / USD_TO_INR).toFixed(2)),
      pros: ['Defence & Automotive grade validation', 'SMD assembly in cleanrooms', 'Online DFM analysis'],
      instantUrl: 'https://www.pcbpower.com/',
    },
    {
      vendorId: 'circuit99',
      name: 'Circuit99',
      country: 'India',
      location: 'Hyderabad, Telangana',
      badge: 'Budget Prototyping',
      turnaroundDays: '4 - 7 Days',
      pcbCostInr: circuit99Inr,
      pcbCostUsd: Number((circuit99Inr / USD_TO_INR).toFixed(2)),
      shippingInr: circuit99ShippingInr,
      shippingUsd: Number((circuit99ShippingInr / USD_TO_INR).toFixed(2)),
      customsTaxInr: Math.round(circuit99Inr * 0.18),
      customsTaxUsd: Number(((circuit99Inr * 0.18) / USD_TO_INR).toFixed(2)),
      totalInr: circuit99TotalInr,
      totalUsd: Number((circuit99TotalInr / USD_TO_INR).toFixed(2)),
      pros: ['Lowest domestic setup fee', 'Veroboard-to-PCB conversion support', 'Cash on Delivery option'],
      instantUrl: 'https://www.circuit99.com/',
    },
    {
      vendorId: 'jlcpcb',
      name: 'JLCPCB',
      country: 'Global',
      location: 'Shenzhen, China',
      badge: 'High Volume Baseline',
      turnaroundDays: '7 - 12 Days',
      pcbCostInr: Math.round(jlcPcbUsd * USD_TO_INR),
      pcbCostUsd: Number(jlcPcbUsd.toFixed(2)),
      shippingInr: Math.round(jlcShippingUsd * USD_TO_INR),
      shippingUsd: jlcShippingUsd,
      customsTaxInr: Math.round(jlcCustomsUsd * USD_TO_INR),
      customsTaxUsd: jlcCustomsUsd,
      totalInr: Math.round(jlcTotalUsd * USD_TO_INR),
      totalUsd: Number(jlcTotalUsd.toFixed(2)),
      pros: ['Extremely low unit cost on high volume', 'Massive parts library for SMT', '5 boards for $2 entry promo'],
      instantUrl: 'https://jlcpcb.com/quote',
    },
    {
      vendorId: 'pcbway',
      name: 'PCBWay',
      country: 'Global',
      location: 'Hangzhou, China',
      badge: 'Advanced Multi-layer & Flex',
      turnaroundDays: '8 - 14 Days',
      pcbCostInr: Math.round(pcbwayPcbUsd * USD_TO_INR),
      pcbCostUsd: Number(pcbwayPcbUsd.toFixed(2)),
      shippingInr: Math.round(pcbwayShippingUsd * USD_TO_INR),
      shippingUsd: pcbwayShippingUsd,
      customsTaxInr: Math.round(pcbwayCustomsUsd * USD_TO_INR),
      customsTaxUsd: pcbwayCustomsUsd,
      totalInr: Math.round(pcbwayTotalUsd * USD_TO_INR),
      totalUsd: Number(pcbwayTotalUsd.toFixed(2)),
      pros: ['Rigid-flex and Rogers high-frequency RF substrate', 'CNC aluminum enclosure matching', 'Active open-hardware community sponsorship'],
      instantUrl: 'https://www.pcbway.com/orderonline.aspx',
    },
  ];
}
