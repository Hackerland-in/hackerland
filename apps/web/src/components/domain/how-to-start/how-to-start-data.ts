export type PlantCategory =
  | 'Semiconductors'
  | 'Composites'
  | 'Electronics'
  | 'Mobility & Vehicles'
  | 'Precision Engineering'
  | 'Clean Energy'
  | 'MedTech & Diagnostics'
  | 'Technical Textiles'
  | 'Agro-Processing & Cold Chain';

export const PLANT_CATEGORIES: readonly PlantCategory[] = [
  'Semiconductors',
  'Electronics',
  'Clean Energy',
  'MedTech & Diagnostics',
  'Technical Textiles',
  'Agro-Processing & Cold Chain',
  'Composites',
  'Mobility & Vehicles',
  'Precision Engineering',
] as const;

export type ExportCorridorSlug = 'us' | 'eu' | 'uae-gcc' | 'asean' | 'africa';

export interface PilotScaleOption {
  /** Missing-Middle entry CapEx/NRE (typically ₹5L – ₹40L) before committing to ₹5Cr+ plant CapEx */
  budgetRangeInr: string;
  /** Numeric midpoint in ₹ Lakhs for unified budget estimation */
  midpointLakhs: number;
  /** Initial pilot batch size achievable without owning full plant machinery */
  batchSize: string;
  /** How Indian founders execute small lots via EMS houses, job-shops, and incubators */
  bridgeModel: string;
  /** Real Indian clusters, incubators, and contract manufacturing hubs */
  indianBridgePartners: string[];
  /** Concrete technical & commercial milestone before unlocking full plant CapEx */
  graduationGate: string;
}

export interface ExportCorridorTarget {
  corridorSlug: ExportCorridorSlug;
  marketLabel: string;
  certifications: string[];
  incentiveNote: string;
}

export interface LinkedLabReference {
  name: string;
  city: string;
  href: string;
}

export interface MachineryItem {
  name: string;
  purpose: string;
  estCostInr: string;
  recommendedBrands: string[];
}

export interface PlantBlueprint {
  slug: string;
  title: string;
  category: PlantCategory;
  tagline: string;
  overview: string;
  estimatorBaseCapExCrores?: number;
  pilotScaleOption?: PilotScaleOption;
  linkedComplianceSlug?: string;
  linkedAssemblySlug?: string;
  linkedTestbedSlug?: string;
  linkedLabs?: LinkedLabReference[];
  exportHsCodes?: string[];
  exportCorridors?: ExportCorridorTarget[];
  marketDemand: {
    tamGlobal: string;
    tamIndia: string;
    cagr: string;
    importDependencyPercent: number;
    growthDrivers: string[];
  };
  capitalRequirements: {
    pilotCapEx: string;
    commercialCapEx: string;
    landSqFt: string;
    powerGridKva: string;
    cleanroomClass?: string;
    waterLpd?: string;
    workingCapitalMonths: number;
  };
  machineryList: MachineryItem[];
  executionRoadmap: {
    phase: string;
    title: string;
    durationWeeks: string;
    tasks: string[];
    deliverable: string;
  }[];
  rawMaterialsAndSupplyChain: {
    materials: string[];
    primarySources: string[];
    indianIndustrialClusters: string[];
  };
  certificationsAndCompliance: {
    mandatory: string[];
    pollutionCategory: 'Red' | 'Orange' | 'Green' | 'White';
    clearancesRequired: string[];
  };
  governmentSchemes: {
    schemeName: string;
    subsidyDetails: string;
    eligibleBody: string;
  }[];
  unitEconomics: {
    typicalGrossMargin: string;
    netMargin: string;
    paybackPeriodYears: string;
    breakEvenCapacityUtil: string;
  };
}

export const PLANT_BLUEPRINTS: PlantBlueprint[] = [
  {
    slug: 'fab-manufacturing',
    title: 'Semiconductor Wafer Fab & ATMP/OSAT Packaging Plant',
    category: 'Semiconductors',
    tagline: 'Start a semiconductor assembly, testing, marking, and advanced packaging (ATMP) or compound silicon foundry.',
    overview:
      'Semiconductor manufacturing spans compound semiconductor wafer foundries (GaN/SiC power devices) and Outsourced Semiconductor Assembly and Test (OSAT) packaging. An entry-level ATMP line bonds, encapsulates, and tests IC silicon dies with cleanrooms operating at ISO Class 1 to Class 5.',
    estimatorBaseCapExCrores: 120.0,
    pilotScaleOption: {
      budgetRangeInr: '₹8 Lakhs – ₹35 Lakhs',
      midpointLakhs: 22,
      batchSize: '25 – 250 IC Die / Packaged Prototypes (MPW Shuttle + Pilot OSAT Lot)',
      bridgeModel:
        'Execute Multi-Project Wafer (MPW) tape-outs via Chips-to-Startup (C2S) & SCL Mohali 180nm shuttles, paired with contract QFN/BGA die wire-bonding and ATE bench characterization at Indian OSAT pilot houses before committing ₹85Cr+ fab CapEx.',
      indianBridgePartners: [
        'SCL Mohali (180nm MPW Shuttle)',
        'CeNSE — IISc Bengaluru (NanoFab Cleanroom)',
        'IIT Bombay / IIT Madras Nanoelectronics Labs',
        'Tessolve Semiconductor Test Labs (Bengaluru)',
      ],
      graduationGate:
        'First-silicon functional bring-up, JEDEC HTOL/ESD screening pass, and ≥10,000-unit anchor OEM demand commitment.',
    },
    linkedComplianceSlug: 'bis-crs-smps-adapter',
    linkedAssemblySlug: 'edge-tpu-carrier-pcba',
    linkedTestbedSlug: 'tektronix-136ch-logic-analyzer',
    linkedLabs: [
      { name: 'Center for Innovation (CFI) — IIT Madras', city: 'Chennai', href: '/labs' },
      { name: 'T-Hub Hardware Prototyping Node', city: 'Hyderabad', href: '/labs' },
    ],
    exportHsCodes: [
      '8541.10 / 8541.29 (GaN/SiC Power Semiconductor Devices)',
      '8542.31 / 8542.39 (Packaged Monolithic ICs & Controllers)',
    ],
    exportCorridors: [
      {
        corridorSlug: 'us',
        marketLabel: 'United States (Fabless OSAT)',
        certifications: ['JEDEC JESD47', 'AEC-Q100 Automotive', 'RoHS 3 / REACH'],
        incentiveNote: 'RoDTEP export remission + ISM 50% CapEx parity for US-allied trusted silicon.',
      },
      {
        corridorSlug: 'eu',
        marketLabel: 'European Union (Industrial & Auto)',
        certifications: ['AEC-Q100 / Q101', 'REACH SVHC', 'ISO 26262 Supply Traceability'],
        incentiveNote: 'Zero-duty electronics component access + EU Chips Act supply diversification.',
      },
      {
        corridorSlug: 'asean',
        marketLabel: 'ASEAN / Singapore Hubs',
        certifications: ['ISO 9001', 'ANSI/ESD S20.20', 'JEDEC MSL-3'],
        incentiveNote: 'India-ASEAN FTA preferential tariff routing for packaged ICs.',
      },
    ],
    marketDemand: {
      tamGlobal: '$680 Billion',
      tamIndia: '$64 Billion by 2026',
      cagr: '18.5%',
      importDependencyPercent: 92,
      growthDrivers: [
        'India Semiconductor Mission (ISM) with 50% central fiscal capital support',
        'Surging domestic demand for automotive electronics, EV powertrains, and smartphones',
        'National push for trusted domestic silicon supply chains in defence and aerospace',
      ],
    },
    capitalRequirements: {
      pilotCapEx: '₹85 Cr – ₹150 Cr (OSAT / ATMP Line)',
      commercialCapEx: '₹500 Cr – ₹3,500 Cr (Compound Fab / Advanced OSAT)',
      landSqFt: '25,000 – 120,000 sq. ft.',
      powerGridKva: '2,500 – 10,000 kVA (Dual HT redundancy, zero fluctuation)',
      cleanroomClass: 'ISO 4 / Class 10 & ISO 5 / Class 100',
      waterLpd: '500,000 Litres Ultra-Pure Water (UPW, 18.2 MΩ·cm resistivity)',
      workingCapitalMonths: 6,
    },
    machineryList: [
      {
        name: 'High-Precision Automated Wafer Dicing Saw',
        purpose: 'Diamond wheel blade singulation of 200mm / 300mm silicon wafers into individual dies with sub-micron kerf accuracy.',
        estCostInr: '₹3.5 Cr – ₹6 Cr',
        recommendedBrands: ['DISCO Corporation (Japan)', 'Accretech (Tokyo Seimitsu)'],
      },
      {
        name: 'High-Speed Automatic Die Bonder',
        purpose: 'Epoxy / eutectic pickup and placement of silicon dies onto lead frames or BGA substrates with ±5µm accuracy.',
        estCostInr: '₹5 Cr – ₹9 Cr',
        recommendedBrands: ['Besi (Netherlands)', 'ASM Pacific Technology (ASMPT)', 'Kulicke & Soffa'],
      },
      {
        name: 'Thermo-Sonic Ball Wire Bonder',
        purpose: 'High-speed ultrasonic gold and copper wire bonding (15µm wire) between die pads and leadframe terminals.',
        estCostInr: '₹4 Cr – ₹7.5 Cr',
        recommendedBrands: ['Kulicke & Soffa (K&S)', 'ASM Pacific', 'Shinkawa'],
      },
      {
        name: 'Vacuum Epoxy Transfer Molding Machine',
        purpose: 'Encapsulates leadframes with thermoset epoxy molding compound (EMC) without void entrapment.',
        estCostInr: '₹3 Cr – ₹5.5 Cr',
        recommendedBrands: ['Towa Corporation (Japan)', 'Fico (Besi)', 'Apic Yamada'],
      },
      {
        name: 'Automated Test Equipment (ATE) & Handler',
        purpose: 'Parametric electrical testing, high/low temperature binning, and laser marking of completed IC packages.',
        estCostInr: '₹6 Cr – ₹12 Cr',
        recommendedBrands: ['Advantest (Japan)', 'Teradyne (USA)', 'Cohu'],
      },
    ],
    executionRoadmap: [
      {
        phase: 'Phase 1',
        title: 'Feasibility, State Selection & ISM Application',
        durationWeeks: 'Weeks 1–8',
        tasks: [
          'Submit application under India Semiconductor Mission (ISM) for 50% central capital subsidy',
          'Select state with semiconductor policy incentives (Gujarat Dholera/Sanand, Tamil Nadu, Karnataka, UP Yamuna Expressway)',
          'Secure 25+ years uninterrupted power purchase agreement (PPA) with zero millisecond grid dips',
        ],
        deliverable: 'ISM In-Principle approval and sanctioned industrial SEZ land allocation.',
      },
      {
        phase: 'Phase 2',
        title: 'Cleanroom Civil Engineering & Ultra-Pure Utilities',
        durationWeeks: 'Weeks 9–28',
        tasks: [
          'Erect vibration-isolated waffle slab concrete foundation to absorb external micro-vibrations',
          'Install HVAC air handling units (AHU) with ULPA filters achieving ISO 4/5 particle count (<10 particles/cu. ft.)',
          'Deploy multi-stage Ultra-Pure Water (UPW) reverse osmosis and deionization plant (18.2 MΩ-cm)',
          'Install specialty bulk gas distribution (High-purity Nitrogen 99.9999%, Argon, Silane, Compressed Dry Air)',
        ],
        deliverable: 'Certified ISO 4/5 Cleanroom envelope with validated particle and humidity telemetry.',
      },
      {
        phase: 'Phase 3',
        title: 'Machinery Import, Tool Hookup & Cleanroom Installation',
        durationWeeks: 'Weeks 29–42',
        tasks: [
          'Receive wafer saw, die bonders, wire bonders, and transfer molds under zero-customs duty EPCG scheme',
          'Connect stainless steel electropolished 316L gas and vacuum lines directly to tools',
          'Conduct cleanroom protocol training for operators (bunny suits, air showers, electrostatic discharge ESD floors)',
        ],
        deliverable: 'Full tool hookup completed with dry cycle qualifications.',
      },
      {
        phase: 'Phase 4',
        title: 'Trial Silicon Run, Reliability Testing & Commercial Qual',
        durationWeeks: 'Weeks 43–56',
        tasks: [
          'Run first lot of dummy wafer dicing and wire bonding yields',
          'Perform thermal cycling (-40°C to +125°C), High Temperature Operating Life (HTOL), and JEDEC moisture sensitivity (MSL)',
          'Acquire ISO 9001 and IATF 16949 automotive certification for global tier-1 customer audits',
        ],
        deliverable: 'Commercial production sign-off with >99.4% packaging yield.',
      },
    ],
    rawMaterialsAndSupplyChain: {
      materials: [
        'Fabricated Silicon / GaN Wafers (from TSMC, UMC, GlobalFoundries, or STMicro)',
        'Copper / Gold Bonding Wire (15µm to 25µm diameter)',
        'Etched / Stamped Copper Leadframes & BGA Substrates',
        'Epoxy Molding Compound (EMC pellet resin)',
        'Die Attach Adhesive (Silver conductive epoxy paste)',
      ],
      primarySources: ['Tanaka Precious Metals (Japan)', 'Sumitomo Bakelite', 'Mitsui High-tec', 'Heraeus'],
      indianIndustrialClusters: ['Dholera SIR / Sanand (Gujarat)', 'Sriperumbudur / Oragadam (Tamil Nadu)', 'Noida / Greater Noida (UP)', 'Doddaballapur / Whitefield (Karnataka)'],
    },
    certificationsAndCompliance: {
      mandatory: ['ISO 9001 (Quality)', 'IATF 16949 (Automotive Semiconductor)', 'ISO 14001 (Environment)', 'ANSI/ESD S20.20 (Electrostatic Control)', 'JEDEC Standards'],
      pollutionCategory: 'Red',
      clearancesRequired: ['State Pollution Control Board Consent to Establish (CTE) & Operate (CTO)', 'Hazardous Chemical Storage PESO License', 'Fire Safety NOC', 'Zero Liquid Discharge (ZLD) Compliance'],
    },
    governmentSchemes: [
      {
        schemeName: 'India Semiconductor Mission (ISM)',
        subsidyDetails: '50% fiscal capital support on pari-passu basis on eligible plant & machinery capex.',
        eligibleBody: 'Ministry of Electronics and Information Technology (MeitY)',
      },
      {
        schemeName: 'State Semiconductor Policy Top-Up (e.g. Gujarat / Tamil Nadu)',
        subsidyDetails: 'Additional 20%–25% state capex subsidy, subsidized land up to 75%, and 10-year electricity duty exemption.',
        eligibleBody: 'State Industrial Development Corporations',
      },
    ],
    unitEconomics: {
      typicalGrossMargin: '38% – 52%',
      netMargin: '18% – 26%',
      paybackPeriodYears: '3.5 – 5.0 Years',
      breakEvenCapacityUtil: '58% Capacity Utilization',
    },
  },
  {
    slug: 'carbon-fiber-hub',
    title: 'Carbon Fiber & Advanced Composites Manufacturing Hub',
    category: 'Composites',
    tagline: 'Engineer high-performance carbon fiber prepreg, autoclave aerospace components, and lightweight automotive parts.',
    overview:
      'Carbon fiber composites replace metal across aerospace, racing bicycles, wind turbine blades, and automotive body shells. Setting up a composite hub involves prepreg layup, automated vacuum bagging, high-pressure autoclave curing, and 5-axis CNC composite trimming.',
    estimatorBaseCapExCrores: 28.0,
    pilotScaleOption: {
      budgetRangeInr: '₹6 Lakhs – ₹28 Lakhs',
      midpointLakhs: 17,
      batchSize: '10 – 100 Structural Parts (Out-of-Autoclave Infusion & CNC Master Molds)',
      bridgeModel:
        'Machine Al-6061/tooling-board molds at local CNC shops, validate Out-of-Autoclave (OOA) vacuum resin infusion, and rent shared autoclave & ultrasonic NDT scan slots at NAL Bengaluru or Pune composite job-shops.',
      indianBridgePartners: [
        'CSIR-NAL Composites Centre (Bengaluru)',
        'ARCI Advanced Composites Lab (Hyderabad)',
        'Pune / Chakan Composite Layup Job-Shops',
        'Coimbatore Precision 5-Axis Mold Makers',
      ],
      graduationGate:
        'Ultrasonic C-Scan (<1.5% void content), ASTM D3039 tensile coupon pass, and recurring UAV/EV OEM orders > ₹1.5 Cr/yr.',
    },
    linkedComplianceSlug: 'dgca-drone-type-certification',
    linkedAssemblySlug: 'drone-autopilot-v4-pcba',
    linkedTestbedSlug: 'imv-electrodynamic-shaker-table',
    linkedLabs: [
      { name: 'Pune Maker FabLab Node', city: 'Pune', href: '/labs' },
      { name: 'Coimbatore Hardware Prototyping Center', city: 'Coimbatore', href: '/labs' },
    ],
    exportHsCodes: [
      '6815.11 (Carbon Fibers & Structural Composite Laminates)',
      '8807.30 (Aerospace & UAV Composite Airframe Parts)',
    ],
    exportCorridors: [
      {
        corridorSlug: 'us',
        marketLabel: 'United States (Aero & Sports)',
        certifications: ['AS9100 Rev D', 'ASTM D3039 / D7136', 'NADCAP NDT'],
        incentiveNote: 'RoDTEP structural export rebate + US defence/drone supply-chain offset contracts.',
      },
      {
        corridorSlug: 'eu',
        marketLabel: 'European Union (EV & Mobility)',
        certifications: ['EN 9100', 'REACH Epoxy Compliance', 'ISO 4210 (Carbon Frames)'],
        incentiveNote: 'High-margin lightweight EV tub, racing frame & wind blade component exports.',
      },
      {
        corridorSlug: 'uae-gcc',
        marketLabel: 'UAE & GCC (Energy & UAV)',
        certifications: ['ISO 9001', 'ISO 11119-3 (Type-IV CNG/H2 Cylinders)'],
        incentiveNote: 'India-UAE CEPA 0% tariff advantage for hydrogen pressure vessels and UAV shells.',
      },
    ],
    marketDemand: {
      tamGlobal: '$32 Billion',
      tamIndia: '$2.8 Billion by 2028',
      cagr: '12.4%',
      importDependencyPercent: 84,
      growthDrivers: [
        'Defence airframe manufacturing (LCA Tejas, UAVs, missile canisters)',
        'High-end sports bicycles, racing car tubs, and drone arms requiring ultra-high strength-to-weight ratios',
        'Pressure vessels for Type-IV Compressed Hydrogen and CNG storage',
      ],
    },
    capitalRequirements: {
      pilotCapEx: '₹4.5 Cr – ₹8.5 Cr (Vacuum Resin Infusion & Heated Press)',
      commercialCapEx: '₹22 Cr – ₹60 Cr (Aerospace Autoclave & 5-Axis CNC Waterjet)',
      landSqFt: '15,000 – 45,000 sq. ft.',
      powerGridKva: '750 – 2,500 kVA',
      cleanroomClass: 'ISO 8 / Class 100,000 (Prepreg Layup Room, temp 20°C, <50% RH)',
      workingCapitalMonths: 4,
    },
    machineryList: [
      {
        name: 'Industrial Composite Autoclave System (2.5m x 6m)',
        purpose: 'Applies up to 10 Bar pressure and 250°C curing cycle to consolidate carbon prepreg laminates with zero voids.',
        estCostInr: '₹6.5 Cr – ₹12 Cr',
        recommendedBrands: ['Scholz Maschinenbau (Germany)', 'ASC Process Systems', 'Marathon Autoclaves'],
      },
      {
        name: 'CNC 5-Axis Composite Waterjet & Routing Machine',
        purpose: 'High-speed trimming and drilling of cured carbon fiber panels without delamination or toxic airborne dust.',
        estCostInr: '₹2.8 Cr – ₹5 Cr',
        recommendedBrands: ['CMS Advanced Materials (Italy)', 'Flow Waterjet', 'Belotti'],
      },
      {
        name: 'Automated Prepreg Ply Ultrasonic Cutting Table',
        purpose: 'Rapid precision nesting and ultrasonic blade cutting of carbon fiber prepreg rolls without fraying tow edges.',
        estCostInr: '₹1.5 Cr – ₹2.8 Cr',
        recommendedBrands: ['Gerber Technology / Lectra', 'Zünd (Switzerland)', 'Eastman'],
      },
      {
        name: 'Climate-Controlled Prepreg Freezer (-18°C Cold Storage)',
        purpose: 'Preserves epoxy resin pre-impregnated fiber rolls from premature ambient polymerization.',
        estCostInr: '₹45 Lakhs – ₹80 Lakhs',
        recommendedBrands: ['Blue Star Industrial', 'Thermo Fisher Cold Chain', 'Carrier'],
      },
      {
        name: 'Ultrasonic C-Scan NDT Flaw Detector',
        purpose: 'Non-destructive phased array inspection to verify internal resin consolidation and spot internal delaminations.',
        estCostInr: '₹1.2 Cr – ₹2.5 Cr',
        recommendedBrands: ['Olympus / Evident', 'General Electric NDT', 'Zetec'],
      },
    ],
    executionRoadmap: [
      {
        phase: 'Phase 1',
        title: 'Tooling Design, Sourcing & Layup Cleanroom Setup',
        durationWeeks: 'Weeks 1–10',
        tasks: [
          'Design Invar / Aluminum 7075 molds matched to component thermal expansion coefficient (CTE)',
          'Construct temperature and humidity controlled ISO 8 cleanroom for manual and automated prepreg layup',
          'Establish prepreg supply contracts with Toray, Hexcel, or domestic carbon fiber yarn manufacturers',
        ],
        deliverable: 'Layup cleanroom and CNC master tooling ready for layup.',
      },
      {
        phase: 'Phase 2',
        title: 'Autoclave Installation & Pressure Vessel Certification',
        durationWeeks: 'Weeks 11–24',
        tasks: [
          'Install high-pressure autoclave with dedicated nitrogen inert gas pressurization tank farm',
          'Acquire Chief Inspector of Boilers & Pressure Vessels statutory safety clearance',
          'Calibrate multi-zone thermocouple feedback for precise exothermic cure profile monitoring',
        ],
        deliverable: 'Commissioned autoclave with stamped pressure vessel safety certification.',
      },
      {
        phase: 'Phase 3',
        title: 'Prototype Layup, Debulking & Void Optimization',
        durationWeeks: 'Weeks 25–36',
        tasks: [
          'Lay up quasi-isotropic laminates ([0°/90°/±45°]) with laser projection ply alignment',
          'Perform vacuum debulking cycles at -0.95 bar to remove trapped air between plies',
          'Run ultrasonic C-Scan non-destructive inspection to verify <1% void content target',
        ],
        deliverable: 'First article inspection report (FAIR) meeting aerospace specification.',
      },
      {
        phase: 'Phase 4',
        title: 'Aerospace & Automotive Qualification (AS9100)',
        durationWeeks: 'Weeks 37–48',
        tasks: [
          'Obtain AS9100 Rev D aerospace quality management system accreditation',
          'Sign tier-1 offtake agreements with drone manufacturers, cycling brands, and EV airframe makers',
        ],
        deliverable: 'Commercial serial production of structural carbon fiber parts.',
      },
    ],
    rawMaterialsAndSupplyChain: {
      materials: [
        'Toray T700 / T800 Carbon Fiber Tow and Woven Fabrics (3K, 12K, 24K)',
        'Epoxy Prepreg Rolls (Thermoset epoxy resin matrix)',
        'Vacuum Bagging Consumables (Release film, breather fabric, sealant tape)',
        'High-Density Rohacell / Honeycomb Core Materials',
      ],
      primarySources: ['Toray Industries (Japan)', 'Hexcel (USA)', 'Teijin Carbon', 'Reliance Composites (India)'],
      indianIndustrialClusters: ['Bangalore Aerospace SEZ (Karnataka)', 'Hyderabad Adibatla Aerospace Corridor', 'Pune Auto Cluster', 'Ahmedabad Sanand'],
    },
    certificationsAndCompliance: {
      mandatory: ['AS9100 Rev D (Aerospace & Defense)', 'ISO 9001 (Quality)', 'ISO 14001 (Environmental)'],
      pollutionCategory: 'Orange',
      clearancesRequired: ['Boilers & Pressure Vessels Inspectorate Approval', 'State Pollution Control Board CTE/CTO', 'Explosion-Proof Extraction Certification (for carbon dust)'],
    },
    governmentSchemes: [
      {
        schemeName: 'National Technical Textiles Mission (NTTM)',
        subsidyDetails: 'Capital grants up to ₹15 Cr for indigenous manufacturing of advanced carbon composites.',
        eligibleBody: 'Ministry of Textiles, Govt. of India',
      },
      {
        schemeName: 'Defence Testing Infrastructure Scheme (DTIS)',
        subsidyDetails: '75% government funding for shared composite non-destructive testing (NDT) labs.',
        eligibleBody: 'Department of Defence Production (DDP)',
      },
    ],
    unitEconomics: {
      typicalGrossMargin: '42% – 60%',
      netMargin: '20% – 32%',
      paybackPeriodYears: '2.8 – 4.2 Years',
      breakEvenCapacityUtil: '45% Capacity Utilization',
    },
  },
  {
    slug: 'pcb-plant',
    title: 'Multilayer PCB Fabrication & SMT Assembly Plant',
    category: 'Electronics',
    tagline: 'Fabricate 2 to 16-layer high-speed impedance-controlled circuit boards and automated SMT component assembly.',
    overview:
      'A PCB manufacturing plant converts raw copper-clad laminates (FR4/Rogers) into precision multilayer boards with microvias, ENIG gold plating, and provides high-speed surface-mount technology (SMT) component placement.',
    estimatorBaseCapExCrores: 35.0,
    pilotScaleOption: {
      budgetRangeInr: '₹5 Lakhs – ₹18 Lakhs',
      midpointLakhs: 11,
      batchSize: '50 – 1,000 Assemblies (Contract Bare-Board Fab + Shared Pick-and-Place EMS)',
      bridgeModel:
        'Fabricate 4–8 layer impedance-controlled bare boards via Indian quick-turn fabs (PCB Power, Lion Circuits) and run contract SMT assembly with 3D SPI/AOI inspection at Peenya, Noida, or T-Hub partner lines before investing in wet-etch lines.',
      indianBridgePartners: [
        'PCB Power (Gandhinagar, Gujarat)',
        'Lion Circuits (Bengaluru)',
        'T-Hub Hardware Prototyping Node (Hyderabad)',
        'Electronic City / Noida Phase-II EMS Job-Work Lines',
      ],
      graduationGate:
        'IPC-A-610 Class 2/3 yield >99.2% across 5+ BOM revisions and ≥₹2.5 Cr annualized recurring PCBA demand.',
    },
    linkedComplianceSlug: 'bis-crs-smps-adapter',
    linkedAssemblySlug: 'edge-tpu-carrier-pcba',
    linkedTestbedSlug: 'rs-emc-semi-anechoic-chamber',
    linkedLabs: [
      { name: 'Center for Innovation (CFI) — IIT Madras', city: 'Chennai', href: '/labs' },
      { name: 'T-Hub Hardware Prototyping Node', city: 'Hyderabad', href: '/labs' },
    ],
    exportHsCodes: [
      '8534.00 (Multilayer Rigid & Flex Printed Circuit Boards)',
      '8537.10 / 8543.70 (Populated Industrial & IoT PCBA Modules)',
    ],
    exportCorridors: [
      {
        corridorSlug: 'us',
        marketLabel: 'United States (Industrial EMS)',
        certifications: ['UL 94V-0 / UL 796', 'IPC-6012 Class 3', 'FCC Part 15 (PCBA)'],
        incentiveNote: 'China+1 duty arbitrage + SPECS/PLI electronics component value-add.',
      },
      {
        corridorSlug: 'eu',
        marketLabel: 'European Union (Auto & Smart Grid)',
        certifications: ['RoHS 3 / REACH', 'IATF 16949', 'CE EMC Directive'],
        incentiveNote: 'RoDTEP remission on populated industrial controller & meter PCBAs.',
      },
      {
        corridorSlug: 'asean',
        marketLabel: 'ASEAN Electronics Supply Chain',
        certifications: ['IPC-A-610 Class 2 & 3', 'ISO 14001'],
        incentiveNote: 'Fast regional air-freight feeder supply into Vietnam/Malaysia EMS.',
      },
    ],
    marketDemand: {
      tamGlobal: '$82 Billion',
      tamIndia: '$12 Billion by 2027',
      cagr: '19.2%',
      importDependencyPercent: 78,
      growthDrivers: [
        'Production Linked Incentive (PLI) for Large Scale Electronics & Telecom Networking hardware',
        'National electronics manufacturing mission reducing reliance on overseas fast-turn prototypes',
        'Rapid growth of Indian smart meters, IoT devices, automotive ECUs, and defence electronics',
      ],
    },
    capitalRequirements: {
      pilotCapEx: '₹8 Cr – ₹16 Cr (2-6 Layer Fast-Turn Prototype Line + 1 SMT Line)',
      commercialCapEx: '₹40 Cr – ₹120 Cr (16-Layer HDI Fab with Dual Yamaha/Fuji SMT lines)',
      landSqFt: '20,000 – 60,000 sq. ft.',
      powerGridKva: '1,200 – 3,500 kVA',
      waterLpd: '80,000 Litres (Demineralized rinse water with full ETP recycling)',
      workingCapitalMonths: 3,
    },
    machineryList: [
      {
        name: 'Direct Imaging (LDI) Laser Photolithography',
        purpose: 'Exposes circuit patterns directly onto dry-film photoresist down to 2mil (50µm) trace and space width without film phototools.',
        estCostInr: '₹3.5 Cr – ₹6.5 Cr',
        recommendedBrands: ['Orbotech / KLA (Israel)', 'Schmoll Maschinen (Germany)', 'Altix'],
      },
      {
        name: 'Multi-Spindle CNC PCB Mechanical Drilling & Routing',
        purpose: 'Drills microvias down to 0.15mm diameter at 200,000 RPM spindle speeds.',
        estCostInr: '₹2.2 Cr – ₹4 Cr',
        recommendedBrands: ['Posalux (Switzerland)', 'Schmoll Maschinen', 'Tongtai'],
      },
      {
        name: 'Horizontal Chemical Etching & Copper Plating Line',
        purpose: 'Acid cupric chloride conveyorized etching and vertical continuous plating (VCP) for blind and buried vias.',
        estCostInr: '₹4.5 Cr – ₹8 Cr',
        recommendedBrands: ['Schmid Group (Germany)', 'Atotech / MKS', 'PAL (Process Automation)'],
      },
      {
        name: 'High-Speed Modular SMT Pick-and-Place Machine',
        purpose: 'Places 0201 passives, 0.3mm BGA chips at speeds exceeding 60,000 components per hour (CPH).',
        estCostInr: '₹3 Cr – ₹6 Cr',
        recommendedBrands: ['Yamaha Motor Robotics', 'Fuji Corporation', 'Hanwha Precision Machinery'],
      },
      {
        name: '10-Zone Nitrogen Reflow Oven & 3D AOI/AXI Inspection',
        purpose: 'Lead-free convective thermal reflow and automated optical/X-ray solder joint verification under IPC-A-610 Class 3.',
        estCostInr: '₹2.5 Cr – ₹4.5 Cr',
        recommendedBrands: ['Koh Young 3D AOI (Korea)', 'Heller Industries Reflow', 'Nordson Dage X-Ray'],
      },
    ],
    executionRoadmap: [
      {
        phase: 'Phase 1',
        title: 'Civil Design & Effluent Treatment Plant (ETP) Setup',
        durationWeeks: 'Weeks 1–12',
        tasks: [
          'Design acid-resistant epoxy floor coatings and chemical drainage trenches',
          'Erect zero liquid discharge (ZLD) effluent treatment plant with copper metal recovery sludge presses',
          'Secure Consent to Establish (CTE) from State Pollution Control Board',
        ],
        deliverable: 'Approved industrial factory site with operational ZLD effluent plant.',
      },
      {
        phase: 'Phase 2',
        title: 'Wet Chemical Processing & Drill Room Commissioning',
        durationWeeks: 'Weeks 13–26',
        tasks: [
          'Install cleanroom direct imaging photolithography room (<Class 10,000 / ISO 7 yellow room)',
          'Install CNC drilling machines and balance air spindle chillers',
          'Formulate chemistry baths: electroless copper, pattern electroplating, and microetching',
        ],
        deliverable: 'Inner layer and outer layer chemical lines calibrated with thickness titrations.',
      },
      {
        phase: 'Phase 3',
        title: 'SMT Line Integration & Solder Mask LPI Application',
        durationWeeks: 'Weeks 27–38',
        tasks: [
          'Install curtain coater / spray solder mask unit and UV curing exposure',
          'Deploy surface finish lines: Electroless Nickel Immersion Gold (ENIG) and Lead-Free HASL',
          'Install automated solder paste stencil printer, dual-gantry pick and place, and reflow oven',
        ],
        deliverable: 'Integrated bare board fabrication and PCB assembly (PCBA) line live.',
      },
      {
        phase: 'Phase 4',
        title: 'IPC-A-610 Class 3 & UL 94V-0 Safety Certification',
        durationWeeks: 'Weeks 39–48',
        tasks: [
          'Underwriters Laboratories (UL) 94V-0 flammability certification audits',
          'IPC-6012 qualification for high reliability rigid multilayers',
          'Onboard commercial aerospace, IoT, and automotive tier-1 production batches',
        ],
        deliverable: 'Commercial serial fab running 100+ panels per shift.',
      },
    ],
    rawMaterialsAndSupplyChain: {
      materials: [
        'FR-4 Copper Clad Laminates & Prepreg (Shengyi, Nan Ya, Isola)',
        'High-Frequency PTFE Substrates (Rogers RO4350B, Taconic)',
        'Copper Anode Balls (99.99% pure phosphorus deoxidized)',
        'Liquid Photoimageable (LPI) Solder Mask & Solder Paste SAC305',
        'Chemical Reagents (Cupric chloride, sulfuric acid, palladium catalyst)',
      ],
      primarySources: ['Shengyi Technology', 'Rogers Corporation', 'Alpha Assembly Solutions / MacDermid'],
      indianIndustrialClusters: ['Sriperumbudur / Chennai', 'Bangalore Electronic City / Peenya', 'Pune Pimpri-Chinchwad', 'Noida / Greater Noida'],
    },
    certificationsAndCompliance: {
      mandatory: ['IPC-A-610 Class 2 & 3', 'UL 94V-0 Flammability', 'ISO 9001', 'RoHS 3 Compliance', 'BIS Electronics'],
      pollutionCategory: 'Red',
      clearancesRequired: ['SPCB Consent to Operate with ZLD Online Monitoring', 'Hazardous Waste Authorization (Form 2)', 'Groundwater Extraction NOC'],
    },
    governmentSchemes: [
      {
        schemeName: 'Scheme for Promotion of Manufacturing of Electronic Components and Semiconductors (SPECS)',
        subsidyDetails: '25% financial incentive on capital expenditure for plant and machinery.',
        eligibleBody: 'Ministry of Electronics and Information Technology (MeitY)',
      },
      {
        schemeName: 'Production Linked Incentive (PLI) for IT Hardware & Telecom',
        subsidyDetails: '4% to 6% incremental production cash incentive over 4-5 years.',
        eligibleBody: 'MeitY / DoT',
      },
    ],
    unitEconomics: {
      typicalGrossMargin: '35% – 48%',
      netMargin: '16% – 24%',
      paybackPeriodYears: '3.0 – 4.5 Years',
      breakEvenCapacityUtil: '52% Capacity Utilization',
    },
  },
  {
    slug: 'cycle-manufacturing',
    title: 'Complete Bicycle & E-Bike Manufacturing Plant',
    category: 'Mobility & Vehicles',
    tagline: 'Build an automated bicycle assembly line: automated tube hydroforming, robotic TIG welding, electrostatic painting, and wheel building.',
    overview:
      'Setting up a complete bicycle and electric bicycle (e-bike) assembly facility covers frame tube mitering/hydroforming, robotic welding fixtures, automated multi-stage electrostatic powder coating, robotic wheel truing, and final assembly lines compliant with BIS IS 10613.',
    estimatorBaseCapExCrores: 16.0,
    pilotScaleOption: {
      budgetRangeInr: '₹7 Lakhs – ₹30 Lakhs',
      midpointLakhs: 18,
      batchSize: '50 – 300 Complete Bicycles / E-Bikes (Ludhiana Job-Work + CKD Assembly)',
      bridgeModel:
        'Contract tube mitering and TIG welding to specialized MSME frame job-shops in Ludhiana or Pune, outsource 5-stage electrostatic powder coating, and operate a 2,500 sq. ft. wheel-truing and final assembly bay.',
      indianBridgePartners: [
        'Ludhiana Cycle Cluster MSME Welding Job-Shops',
        'R&D Centre for Bicycle & Sewing Machine (Ludhiana)',
        'Statfield Outsourced Powder Coating Booths (Pune/Ludhiana)',
        'Coimbatore Precision Hub & Drivetrain Suppliers',
      ],
      graduationGate:
        'BIS IS 10613 / ISO 4210 frame fatigue pass + steady 400+ units/month sell-through or European OEM private-label contract.',
    },
    linkedComplianceSlug: 'ais156-ev-battery-pack',
    linkedAssemblySlug: 'ais156-bms-master-pcba',
    linkedTestbedSlug: 'imv-electrodynamic-shaker-table',
    linkedLabs: [
      { name: 'Pune Maker FabLab Node', city: 'Pune', href: '/labs' },
      { name: 'Coimbatore Hardware Prototyping Center', city: 'Coimbatore', href: '/labs' },
    ],
    exportHsCodes: [
      '8712.00 (Complete Road, Gravel & Commuter Bicycles)',
      '8711.60 (Electric Pedal-Assist E-Bikes <=250W)',
    ],
    exportCorridors: [
      {
        corridorSlug: 'eu',
        marketLabel: 'European Union (GSP / E-Bikes)',
        certifications: ['EN 15194 (EPAC E-Bikes)', 'ISO 4210', 'CE Machinery Directive'],
        incentiveNote: 'RoDTEP rebate + strong EU anti-dumping advantage over non-Indian frames.',
      },
      {
        corridorSlug: 'us',
        marketLabel: 'United States (DTC & Gravel)',
        certifications: ['CPSC 16 CFR 1512', 'UL 2849 (E-Bike Electrical System)'],
        incentiveNote: 'High-margin alloy & e-commuter private-label exports.',
      },
      {
        corridorSlug: 'africa',
        marketLabel: 'East & West Africa (Utility & Cargo)',
        certifications: ['BIS IS 10613 / SONCAP / KEBS PVoC'],
        incentiveNote: 'Volume cargo & commuter cycle exports backed by EXIM Bank buyer credit.',
      },
    ],
    marketDemand: {
      tamGlobal: '$65 Billion',
      tamIndia: '₹14,000 Cr ($1.7B) by 2027',
      cagr: '11.8% (E-bikes at 28%)',
      importDependencyPercent: 42,
      growthDrivers: [
        'Massive European export demand for Indian bicycles under GSP & free trade agreements',
        'Surge in urban fitness, gravel/road cycling, and electric commuter pedal-assist mobility',
        'Production Linked Incentive (PLI) for automotive and bicycle components',
      ],
    },
    capitalRequirements: {
      pilotCapEx: '₹2.8 Cr – ₹6.5 Cr (Assembly, Painting & Wheel Truing Unit)',
      commercialCapEx: '₹18 Cr – ₹45 Cr (Full Hydroforming, Robotic Welding & Powder Coating)',
      landSqFt: '25,000 – 75,000 sq. ft.',
      powerGridKva: '450 – 1,200 kVA',
      workingCapitalMonths: 3,
    },
    machineryList: [
      {
        name: 'Robotic TIG / MIG Aluminum & Steel Frame Welding Cell',
        purpose: 'Automated 6-axis robotic welding of bicycle frame headtube, bottom bracket, and rear dropouts with repeatable penetration.',
        estCostInr: '₹1.8 Cr – ₹3.5 Cr',
        recommendedBrands: ['Yaskawa Motoman', 'ABB Robotics', 'Panasonic Welding'],
      },
      {
        name: 'Tube Hydroforming & CNC Mandrel Bending Machine',
        purpose: 'Internal hydraulic fluid pressure forming of lightweight alloy tubes into aerodynamic, tapered profiles.',
        estCostInr: '₹1.2 Cr – ₹2.5 Cr',
        recommendedBrands: ['BLM Group (Italy)', 'SOCO Machinery (Taiwan)', 'Schuler'],
      },
      {
        name: 'Conveyorized Multi-Stage Electrostatic Powder Coating Line',
        purpose: 'Automated pre-treatment degreasing, zinc phosphating, electrostatic powder spraying, and 200°C curing oven.',
        estCostInr: '₹1.5 Cr – ₹3.2 Cr',
        recommendedBrands: ['Gema Switzerland', 'Nordson Corporation', 'Statfield Equipment (India)'],
      },
      {
        name: 'Robotic Wheel Lacing, Tensioning & Truing Machine',
        purpose: 'Automated insertion of 32/36 spokes, precision nipple tightening, and laser radial/lateral truing to ±0.2mm runout.',
        estCostInr: '₹95 Lakhs – ₹1.8 Cr',
        recommendedBrands: ['Holland Mechanics (Netherlands)', 'Tsugami', 'Mach1'],
      },
      {
        name: 'Frame Fatigue & Fork Impact Dynamic Testing Rig',
        purpose: 'Simulates 100,000 pedal force cycles and horizontal drop tests compliant with ISO 4210 and BIS IS 10613.',
        estCostInr: '₹40 Lakhs – ₹75 Lakhs',
        recommendedBrands: ['SGS Testing Systems', 'Instron Dynamic Rigs', 'AIMIL India'],
      },
    ],
    executionRoadmap: [
      {
        phase: 'Phase 1',
        title: 'Factory Layout & Welding / Jigs Tooling',
        durationWeeks: 'Weeks 1–8',
        tasks: [
          'Design U-shaped assembly line balancing frame fabrication, paint shop, wheel sub-assembly, and final packaging',
          'Fabricate precision frame geometry alignment jigs for Road, Gravel, MTB, and Commuter geometries',
          'Contract domestic tube mills for 6061-T6 aluminum extrusion and 4130 chromoly steel tubing',
        ],
        deliverable: 'Factory floor ready with certified welding jigs.',
      },
      {
        phase: 'Phase 2',
        title: 'Paint Shop & Electrostatic Conveyor Installation',
        durationWeeks: 'Weeks 9–20',
        tasks: [
          'Install overhead conveyor system with automated 5-stage chemical wash tank pre-treatment',
          'Commission electrostatic powder coating booth with cyclone paint powder recovery',
          'Calibrate curing oven temperature logs for durable, scratch-resistant automotive finish',
        ],
        deliverable: 'Certified painting line achieving 500-hour salt spray corrosion resistance.',
      },
      {
        phase: 'Phase 3',
        title: 'Robotic Wheel Building & Assembly Line Setup',
        durationWeeks: 'Weeks 21–30',
        tasks: [
          'Install Holland Mechanics automated rim lacing and electronic spoke tension meters',
          'Establish assembly stations: bottom bracket press-fit, headset bearings, derailleurs, disc brakes, and cabling',
          'Integrate e-bike sub-line: battery dock installation, mid-drive / hub motor torque calibration, and wire harness loom',
        ],
        deliverable: 'Pilot production of 50 complete bicycles per shift.',
      },
      {
        phase: 'Phase 4',
        title: 'BIS Certification & Dealer Distribution Network',
        durationWeeks: 'Weeks 31–40',
        tasks: [
          'Pass Bureau of Indian Standards (BIS IS 10613 / ISO 4210) safety and braking tests',
          'Sign OEM contract manufacturing or launch direct-to-consumer / regional retail distributor shipments',
        ],
        deliverable: 'Commercial shipping with 2,500+ bicycles/month capacity.',
      },
    ],
    rawMaterialsAndSupplyChain: {
      materials: [
        'Aluminum 6061 / 7005 Seamless Drawn Tubing',
        'Drivetrain Groupsets (Derailleurs, Shifters, Cassettes - Shimano, Microshift, L-Twoo)',
        'Double-Wall Aluminum Alloy Rims & Stainless Steel Spokes',
        'Hydraulic Disc Calipers & Rotors (160mm)',
        'E-Bike Hub Motors, Lithium Battery Packs, and Torque Sensors',
      ],
      primarySources: ['Hindalco / Jindal Aluminum', 'Shimano Singapore', 'KMC Chains', 'Bafang Electric'],
      indianIndustrialClusters: ['Ludhiana Industrial Hub (Punjab)', 'Chennai Auto Corridor (Tamil Nadu)', 'Ahmedabad (Gujarat)', 'Pune (Maharashtra)'],
    },
    certificationsAndCompliance: {
      mandatory: ['BIS IS 10613 (Safety requirements for Bicycles)', 'ISO 4210 (Global Bicycle Safety)', 'AIS-004 (for Electric Pedal-Assist)'],
      pollutionCategory: 'Orange',
      clearancesRequired: ['SPCB Paint Booth Emissions CTE/CTO', 'Factory License under Factories Act 1948', 'Fire Safety NOC'],
    },
    governmentSchemes: [
      {
        schemeName: 'Emergency Credit Line & CGTMSE Scheme',
        subsidyDetails: 'Collateral-free credit loans up to ₹5 Cr for MSME manufacturing units.',
        eligibleBody: 'Ministry of MSME, Govt. of India',
      },
      {
        schemeName: 'Remission of Duties and Taxes on Exported Products (RoDTEP)',
        subsidyDetails: 'Tax rebate on all export consignments of complete bicycles to EU/US.',
        eligibleBody: 'Directorate General of Foreign Trade (DGFT)',
      },
    ],
    unitEconomics: {
      typicalGrossMargin: '28% – 42% (Up to 50% for Premium E-Bikes)',
      netMargin: '12% – 19%',
      paybackPeriodYears: '2.5 – 3.8 Years',
      breakEvenCapacityUtil: '40% Capacity Utilization',
    },
  },
  {
    slug: 'precision-mechanical-parts',
    title: 'Precision Mechanical Parts Manufacturing (Bicycle & Machine Components)',
    category: 'Precision Engineering',
    tagline: 'CNC Swiss-lathes, cold forging, gear hobbing, and anodizing lines for bike hubs, bottom brackets, sprockets, and derailleurs.',
    overview:
      'Precision manufacturing supplies critical small metal components: bicycle wheel hubs, bottom bracket axles, CNC derailleur cages, chainring sprockets, pedal spindles, and disc brake calipers using Swiss-type CNC turn-mill centers and cold forging.',
    estimatorBaseCapExCrores: 12.0,
    pilotScaleOption: {
      budgetRangeInr: '₹5 Lakhs – ₹25 Lakhs',
      midpointLakhs: 14,
      batchSize: '200 – 5,000 Precision CNC Components (Job-Shop Spindle Time + Batch Anodizing)',
      bridgeModel:
        'Book CNC Swiss-lathe and 5-axis VMC spindle hours across Coimbatore CODISSIA, Rajkot, or Peenya precision job-shops, paired with shared NABL CMM inspection and Type-III anodizing baths before purchasing multi-crore bar-fed cells.',
      indianBridgePartners: [
        'Coimbatore CODISSIA CNC Precision Cluster',
        'Peenya Industrial Estate Turn-Mill Shops (Bengaluru)',
        'Rajkot Machine Tools & Cold Forging Cluster',
        'Pune Pimpri-Chinchwad Anodizing & Heat-Treat Houses',
      ],
      graduationGate:
        'PPAP Level 3 sign-off with Cpk ≥ 1.67 and ≥3,000 spindle-hours/year contracted OEM backlog.',
    },
    linkedComplianceSlug: 'ais156-ev-battery-pack',
    linkedAssemblySlug: 'drone-autopilot-v4-pcba',
    linkedTestbedSlug: 'thermotron-thermal-shock-chamber',
    linkedLabs: [
      { name: 'Coimbatore Hardware Prototyping Center', city: 'Coimbatore', href: '/labs' },
      { name: 'Pune Maker FabLab Node', city: 'Pune', href: '/labs' },
    ],
    exportHsCodes: [
      '8714.93 / 8714.99 (CNC Bicycle Hubs, Bottom Brackets & Sprockets)',
      '8483.40 (Precision Gears, Actuator Shafts & Robotics Components)',
    ],
    exportCorridors: [
      {
        corridorSlug: 'eu',
        marketLabel: 'European Union (Precision & Cycling)',
        certifications: ['IATF 16949', 'ISO 9001', 'MIL-A-8625 Type III / REACH'],
        incentiveNote: 'PLI Auto Components + RoDTEP export incentives on precision machined parts.',
      },
      {
        corridorSlug: 'us',
        marketLabel: 'United States (Aero, Medical & EV)',
        certifications: ['AS9100 / ISO 13485 (Sub-tier)', 'PPAP Level 3', 'RoHS 3'],
        incentiveNote: 'High-margin CNC billet aluminum and Ti-6Al-4V precision exports.',
      },
      {
        corridorSlug: 'uae-gcc',
        marketLabel: 'UAE & GCC (Industrial & Energy)',
        certifications: ['ISO 9001', 'API / ASTM Material Traceability'],
        incentiveNote: 'India-UAE CEPA duty-free access for precision valves, shafts, and couplers.',
      },
    ],
    marketDemand: {
      tamGlobal: '$110 Billion',
      tamIndia: '₹18,500 Cr ($2.2B)',
      cagr: '9.5%',
      importDependencyPercent: 65,
      growthDrivers: [
        'Huge supply vacuum for precision CNC bicycle hubs and sealed cartridge bottom brackets in India',
        'Global supply chain diversification shifting component procurement away from single-country reliance',
        'Growth in aerospace drone actuators, surgical robotics, and automotive precision turned components',
      ],
    },
    capitalRequirements: {
      pilotCapEx: '₹2.2 Cr – ₹4.8 Cr (4 CNC Turn-Mill Centers + Metrology)',
      commercialCapEx: '₹12 Cr – ₹30 Cr (Full Swiss CNC Battery, Cold Forging & Anodizing)',
      landSqFt: '8,000 – 25,000 sq. ft.',
      powerGridKva: '250 – 850 kVA',
      workingCapitalMonths: 3,
    },
    machineryList: [
      {
        name: 'CNC Swiss-Type Automatic Lathe (7-Axis Sliding Headstock)',
        purpose: 'Continuous unattended turning and milling of small shafts, axles, and spoke nipples with ±2µm tolerance.',
        estCostInr: '₹85 Lakhs – ₹1.8 Cr',
        recommendedBrands: ['Citizen-Cincom (Japan)', 'Star Micronics', 'Tsugami'],
      },
      {
        name: '5-Axis Simultaneous CNC Machining Center',
        purpose: 'Sculpting complex lightweight aluminum bicycle hubs, hollow crank arms, and derailleur bodies in a single clamping.',
        estCostInr: '₹1.4 Cr – ₹2.8 Cr',
        recommendedBrands: ['DMG MORI (Germany/Japan)', 'Mazak Corporation', 'Haas Automation'],
      },
      {
        name: 'High-Precision Gear & Sprocket Hobbing Machine',
        purpose: 'Precision cutting of narrow-wide chainring tooth profiles and cassette cogs with tooth relief ramps.',
        estCostInr: '₹60 Lakhs – ₹1.2 Cr',
        recommendedBrands: ['Gleason Corporation', 'Liebherr Gear', 'Mitsubishi Heavy Industries'],
      },
      {
        name: 'Automated Sulfuric Acid Anodizing & Coloring Plant',
        purpose: 'Type II and Type III hardcoat anodizing for scratch-proof corrosion resistance in black, gold, and custom hues.',
        estCostInr: '₹40 Lakhs – ₹90 Lakhs',
        recommendedBrands: ['Titan Metal Fabricators', 'Galvano India', 'Technic Inc.'],
      },
      {
        name: 'Coordinate Measuring Machine (CMM) & Optical Comparator',
        purpose: 'Sub-micron 3D volumetric inspection of bearing bore roundness and thread pitch diameters.',
        estCostInr: '₹35 Lakhs – ₹70 Lakhs',
        recommendedBrands: ['Mitutoyo (Japan)', 'Zeiss Metrology', 'Hexagon Manufacturing'],
      },
    ],
    executionRoadmap: [
      {
        phase: 'Phase 1',
        title: 'Machine Tool Selection & Precision Foundation',
        durationWeeks: 'Weeks 1–8',
        tasks: [
          'Pour 400mm thick reinforced concrete foundation with vibration damping trench for Swiss CNC lathes',
          'Procure high-purity aerospace aluminum bar stock (Al 7075-T651, Al 6061-T6) and Ti-6Al-4V titanium bars',
          'Deploy master CAM programming software (Mastercam, Siemens NX, Fusion CAM)',
        ],
        deliverable: 'Civil workshop commissioned with power stabilizer and compressed air lines.',
      },
      {
        phase: 'Phase 2',
        title: 'Machinery Tooling Hookup & High-Pressure Coolant System',
        durationWeeks: 'Weeks 9–18',
        tasks: [
          'Install 70-bar high-pressure through-spindle coolant systems for micro-chip breaking in deep drilling',
          'Equip machines with Sandvik Coromant / Kyocera carbide micro-grain cutting inserts',
          'Set up chip shredder and centrifugal coolant oil reclamation centrifuges for zero waste',
        ],
        deliverable: 'CNC machines achieving steady-state CPK > 1.67 capability.',
      },
      {
        phase: 'Phase 3',
        title: 'Anodizing & Heat Treatment Surface Line Integration',
        durationWeeks: 'Weeks 19–28',
        tasks: [
          'Install deionized water chemical rinse tanks and sulfuric acid electrolytic bath',
          'Calibrate vacuum furnace for quench hardening of bearing steel races (58–62 HRC)',
          'Verify MIL-A-8625 Type III Hardcoat anodizing layer thickness (minimum 25–50µm)',
        ],
        deliverable: 'Complete in-house finishing line with zero vendor dependency.',
      },
      {
        phase: 'Phase 4',
        title: 'ISO 9001 / IATF 16949 Metrology & OEM Supply Audits',
        durationWeeks: 'Weeks 29–38',
        tasks: [
          'Commission Mitutoyo CMM in climate-controlled quality room (20°C ± 1°C)',
          'Supply first production samples (PPAP Level 3) to bicycle assemblers, drone makers, and EV Tier-1s',
        ],
        deliverable: 'Serial supply contracts running 24/7 with bar-feeder automation.',
      },
    ],
    rawMaterialsAndSupplyChain: {
      materials: [
        'Aluminum 7075-T6 & 6061-T6 Solid Round Bars',
        'CrMo 4140 Alloy Steel & 52100 Bearing Steel Bars',
        'Ti-6Al-4V Grade 5 Titanium Billets',
        'Carbide Cutting Inserts, Solid Carbide End Mills & Taps',
        'Hard Anodizing Chemicals & Organic Dyes',
      ],
      primarySources: ['Hindalco Industries', 'Bharat Forge', 'Sandvik Coromant', 'Kennametal'],
      indianIndustrialClusters: ['Coimbatore Precision Hub (Tamil Nadu)', 'Rajkot Engineering Cluster (Gujarat)', 'Pune / Aurangabad (Maharashtra)', 'Ludhiana (Punjab)'],
    },
    certificationsAndCompliance: {
      mandatory: ['ISO 9001 (Quality Management)', 'IATF 16949 (Automotive Component Supply)', 'RoHS Compliance'],
      pollutionCategory: 'Orange',
      clearancesRequired: ['SPCB CTO for Anodizing Effluent', 'Air Pollution NOC for oil mist collectors', 'Factories Act Registration'],
    },
    governmentSchemes: [
      {
        schemeName: 'Credit Linked Capital Subsidy Scheme (CLCSS)',
        subsidyDetails: '15% upfront capital subsidy for technology upgradation to CNC machinery.',
        eligibleBody: 'Ministry of MSME',
      },
      {
        schemeName: 'PLI Scheme for Auto Components',
        subsidyDetails: '8% to 13% cash incentives on incremental sales of advanced precision parts.',
        eligibleBody: 'Ministry of Heavy Industries',
      },
    ],
    unitEconomics: {
      typicalGrossMargin: '45% – 62%',
      netMargin: '22% – 34%',
      paybackPeriodYears: '2.2 – 3.5 Years',
      breakEvenCapacityUtil: '42% Capacity Utilization',
    },
  },
  {
    slug: 'mobile-parts',
    title: 'Mobile Phone Parts & Module Assembly Plant',
    category: 'Electronics',
    tagline: 'Manufacture precision smartphone mechanical housings, camera modules, acoustic speakers, and flexible FPC assemblies.',
    overview:
      'Mobile parts manufacturing encompasses precision sub-assemblies: CNC-machined metal camera rings, ultra-thin polymer injection back covers, voice coil motor (VCM) camera modules, dynamic receiver speakers, and flexible printed circuit (FPC) soldering.',
    estimatorBaseCapExCrores: 45.0,
    pilotScaleOption: {
      budgetRangeInr: '₹10 Lakhs – ₹35 Lakhs',
      midpointLakhs: 23,
      batchSize: '500 – 5,000 Acoustic/FPC/Housing Sub-Assemblies (Soft Tooling + Shared Cleanroom)',
      bridgeModel:
        'Use P20/Al-7075 soft injection molds, contract FPC hot-bar bonding, and shared ISO-6 cleanroom + acoustic chamber testing in Noida Sector-63 or Sriperumbudur EMS incubators prior to dedicated active-alignment CapEx.',
      indianBridgePartners: [
        'Electropreneur Park / Noida Sector-63 EMS Cluster',
        'Sriperumbudur / Oragadam Electronics Manufacturing Hub',
        'IIT Madras CFI Cleanroom Prototyping Partners',
        'Tirupati EMC Shared Reliability & Drop-Test Labs',
      ],
      graduationGate:
        'IP68 air-decay & 1,000-drop validation passed with Tier-1 ODM vendor code approval.',
    },
    linkedComplianceSlug: 'tec-mtcte-cellular-router',
    linkedAssemblySlug: 'iot-wearable-sensor-pcba',
    linkedTestbedSlug: 'rs-emc-semi-anechoic-chamber',
    linkedLabs: [
      { name: 'Center for Innovation (CFI) — IIT Madras', city: 'Chennai', href: '/labs' },
      { name: 'T-Hub Hardware Prototyping Node', city: 'Hyderabad', href: '/labs' },
    ],
    exportHsCodes: [
      '8517.79 (Precision Smartphone Housings, FPC & Acoustic Parts)',
      '8525.89 (Compact VCM Camera Sensor Modules)',
    ],
    exportCorridors: [
      {
        corridorSlug: 'us',
        marketLabel: 'United States (ODM & Wearables)',
        certifications: ['IEC 62368-1', 'FCC Part 15', 'RoHS 3 & REACH'],
        incentiveNote: 'PLI Mobile & SPECS 25% CapEx boost for global smartphone & wearable supply chains.',
      },
      {
        corridorSlug: 'uae-gcc',
        marketLabel: 'UAE & GCC (Distribution Hubs)',
        certifications: ['G-Mark', 'RoHS', 'ISO 9001'],
        incentiveNote: 'Zero-duty CEPA re-export corridor into MENA repair & OEM sub-assembly hubs.',
      },
      {
        corridorSlug: 'asean',
        marketLabel: 'ASEAN (Vietnam / Indonesia EMS)',
        certifications: ['IEC 62368-1', 'IP68 Reliability Sign-off'],
        incentiveNote: 'Regional component trade under India-ASEAN electronics tariff schedules.',
      },
    ],
    marketDemand: {
      tamGlobal: '$180 Billion',
      tamIndia: '$32 Billion by 2027',
      cagr: '16.4%',
      importDependencyPercent: 62,
      growthDrivers: [
        'India is the 2nd largest mobile phone manufacturer globally (over 300 million units produced annually)',
        'Government phased manufacturing program (PMP) mandating localized sub-assembly production',
        'Production Linked Incentive (PLI) for Mobile Phones driving Foxconn, Pegatron, and Tata Electronics expansion',
      ],
    },
    capitalRequirements: {
      pilotCapEx: '₹12 Cr – ₹25 Cr (Acoustic & FPC Cable Assembly Line)',
      commercialCapEx: '₹60 Cr – ₹180 Cr (Full Camera Module Cleanroom & CNC Enclosure Line)',
      landSqFt: '25,000 – 80,000 sq. ft.',
      powerGridKva: '1,500 – 4,000 kVA',
      cleanroomClass: 'ISO 6 / Class 1,000 (Camera Sensor & Lens Assembly) & ISO 7',
      workingCapitalMonths: 4,
    },
    machineryList: [
      {
        name: 'Active Alignment (AA) Camera Module Assembly System',
        purpose: 'Sub-micron 6-axis optical alignment of multi-element lens barrels to CMOS image sensors with real-time MTF optimization.',
        estCostInr: '₹4.5 Cr – ₹8.5 Cr',
        recommendedBrands: ['TRIOPTICS (Germany)', 'Kasalis', 'ASM Pacific'],
      },
      {
        name: 'High-Precision All-Electric Injection Molding Machine (50T–150T)',
        purpose: 'Ultra-thin wall (0.4mm) molding of polycarbonate/PMMA smartphone backplates and internal frame skeletons.',
        estCostInr: '₹1.8 Cr – ₹3.5 Cr',
        recommendedBrands: ['Fanuc Roboshot (Japan)', 'Sumitomo Demag', 'Nissei'],
      },
      {
        name: 'Automated FPC Hot-Bar Thermode Soldering Machine',
        purpose: 'Pulse-heated thermode bonding of flexible printed cables to display controllers and battery BMS terminals.',
        estCostInr: '₹65 Lakhs – ₹1.2 Cr',
        recommendedBrands: ['Miyachi / Amada Weld Tech', 'Nordson Dage', 'Sunx'],
      },
      {
        name: 'Automated Optical Profilometer & Acoustic Sound Chamber',
        purpose: 'Anechoic chamber testing for speaker decibel response and laser 3D step-height verification of phone housing tolerances.',
        estCostInr: '₹80 Lakhs – ₹1.6 Cr',
        recommendedBrands: ['Bruel & Kjaer (Denmark)', 'Audio Precision', 'Keyence'],
      },
      {
        name: 'Automated UV Adhesive Dispensing & Curing Robot',
        purpose: 'Dispenses structural moisture-barrier glue along phone perimeter bezels achieving IP68 waterproof ratings.',
        estCostInr: '₹55 Lakhs – ₹1.1 Cr',
        recommendedBrands: ['Nordson ASYMTEK', 'Musashi Engineering (Japan)', 'Scheugenpflug'],
      },
    ],
    executionRoadmap: [
      {
        phase: 'Phase 1',
        title: 'Customer Audit Specification & ISO Cleanroom Setup',
        durationWeeks: 'Weeks 1–12',
        tasks: [
          'Sign Non-Disclosure Agreements (NDA) and vendor qualification guidelines with smartphone OEMs',
          'Construct modular ISO 6 cleanroom with laminar air flow hoods for camera and optical lens bonding',
          'Install ESD flooring, ionization blowers, and airlocks to prevent static discharge on sensitive CMOS dies',
        ],
        deliverable: 'Cleanroom facility certified under ISO 14644 standards.',
      },
      {
        phase: 'Phase 2',
        title: 'High-Precision Tooling & Active Alignment Setup',
        durationWeeks: 'Weeks 13–24',
        tasks: [
          'Install Trioptics 6-axis active alignment robotic stations for optical lens-to-sensor mounting',
          'Deploy precision thermal curing ovens for optical grade UV and thermal adhesives',
          'Calibrate machine vision alignment cameras with test chart targets',
        ],
        deliverable: 'Active alignment line achieving >98.5% optical modulation transfer function (MTF) yield.',
      },
      {
        phase: 'Phase 3',
        title: 'Trial Batch Runs & Environmental Stress Testing',
        durationWeeks: 'Weeks 25–34',
        tasks: [
          'Conduct tumble drop tests (1000 drops from 1m onto steel floor)',
          'Run thermal shock chambers (-40°C to +85°C) and salt mist corrosion cycles',
          'Validate IP68 air-decay pressure differential water-resistance testers',
        ],
        deliverable: 'Full OEM PPAP qualification and reliability test sign-off.',
      },
      {
        phase: 'Phase 4',
        title: 'Mass Production Ramp & SMT Integration',
        durationWeeks: 'Weeks 35–44',
        tasks: [
          'Scale output to 100,000 sub-modules per month per line',
          'Connect shop-floor Manufacturing Execution System (MES) to client ERP for real-time barcode serialization',
        ],
        deliverable: 'Commercial serial production supplying leading smartphone OEMs.',
      },
    ],
    rawMaterialsAndSupplyChain: {
      materials: [
        'CMOS Image Sensor Wafers (Sony, Samsung ISOCELL, OmniVision)',
        'Precision Molded Optical Glass/Plastic Lenses (Largan, Sunny Optical)',
        'Polyimide Flexible Printed Circuits (FPC cables)',
        'Neodymium N52 Magnets & Voice Coil Enamelled Wires',
        'Structural UV Polyurethane Adhesives (Henkel Loctite, 3M)',
      ],
      primarySources: ['Sony Semiconductor', 'Sunny Optical', 'Henkel Adhesive Technologies', '3M Electronics'],
      indianIndustrialClusters: ['Noida / Yamuna Expressway (UP)', 'Sriperumbudur / Chennai (Tamil Nadu)', 'Hosur (Tamil Nadu)', 'Tirupati EMC (Andhra Pradesh)'],
    },
    certificationsAndCompliance: {
      mandatory: ['ISO 9001', 'ISO 14001', 'IEC 62368-1 (Audio/Video & IT Equipment Safety)', 'RoHS & REACH'],
      pollutionCategory: 'Orange',
      clearancesRequired: ['Cleanroom HVAC Environmental Consent', 'SPCB Emission Approval for Curing Ovens', 'Fire & Explosive Safety NOC'],
    },
    governmentSchemes: [
      {
        schemeName: 'Production Linked Incentive (PLI) for Mobile Manufacturing',
        subsidyDetails: '4% to 6% incentive on incremental sales of specified electronic components and assemblies.',
        eligibleBody: 'MeitY',
      },
      {
        schemeName: 'SPECS (Electronic Component Scheme)',
        subsidyDetails: '25% capital subsidy on specialized cleanroom machinery and test gear.',
        eligibleBody: 'MeitY / State Electronics Missions',
      },
    ],
    unitEconomics: {
      typicalGrossMargin: '26% – 38%',
      netMargin: '12% – 18%',
      paybackPeriodYears: '2.5 – 3.8 Years',
      breakEvenCapacityUtil: '60% Capacity Utilization',
    },
  },
  {
    slug: 'ev-battery-pack',
    title: 'Electric Vehicle (EV) Battery Gigafactory & Pack Assembly',
    category: 'Clean Energy',
    tagline: 'Automated cylindrical/prismatic cell sorting, ultrasonic laser wire bonding, and battery management system (BMS) integration.',
    overview:
      'Setting up an automotive EV battery pack manufacturing plant involves automated OCV cell sorting, ultrasonic wire bonding of 21700 or prismatic cells, automated thermal gap filler dispensing, high-voltage busbar laser welding, and AIS-156 Amendment III testing.',
    estimatorBaseCapExCrores: 38.0,
    pilotScaleOption: {
      budgetRangeInr: '₹8 Lakhs – ₹32 Lakhs',
      midpointLakhs: 20,
      batchSize: '15 – 150 Certified EV Battery Packs (Contract Spot/Laser Weld + Shared Cycler)',
      bridgeModel:
        'Assemble OCV-binned 21700/LFP packs using contract laser busbar welding job-shops in Pune or Hosur, flash open-source/Zephyr smart BMS firmware, and validate thermal propagation on shared Chroma cyclers before owning dry-room automation.',
      indianBridgePartners: [
        'Chakan / Bhosari EV Pack Pilot Job-Shops (Pune)',
        'Hosur / Krishnagiri 2W/3W Battery Assembly Partners',
        'ARAI Pune / ICAT Manesar AIS-156 Pre-Compliance Labs',
        'IIT Madras / T-Hub Energy Storage Testbeds',
      ],
      graduationGate:
        'AIS-156 Amendment III nail-penetration / thermal runaway + UN 38.3 certification and ≥10 MWh/yr OEM LoI.',
    },
    linkedComplianceSlug: 'ais156-ev-battery-pack',
    linkedAssemblySlug: 'ais156-bms-master-pcba',
    linkedTestbedSlug: 'chroma-17020-ev-battery-cycler',
    linkedLabs: [
      { name: 'Pune Maker FabLab Node', city: 'Pune', href: '/labs' },
      { name: 'Center for Innovation (CFI) — IIT Madras', city: 'Chennai', href: '/labs' },
    ],
    exportHsCodes: [
      '8507.60 (Lithium-Ion Traction & Swappable Battery Packs)',
      '8537.10 (Smart BMS & High-Voltage Battery Junction Boxes)',
    ],
    exportCorridors: [
      {
        corridorSlug: 'eu',
        marketLabel: 'European Union (EU Battery Passport)',
        certifications: ['UN 38.3', 'ECE R100 / R136', 'EU Battery Regulation 2023/1542'],
        incentiveNote: 'RoDTEP + ACC PLI localization feeding European 2W/3W & light commercial fleets.',
      },
      {
        corridorSlug: 'us',
        marketLabel: 'United States (Micro-Mobility & ESS)',
        certifications: ['UL 2271 / UL 2580', 'UN 38.3', 'UL 9540A'],
        incentiveNote: 'High-demand non-FEOC LFP pack & BMS assemblies for US utility/fleet OEMs.',
      },
      {
        corridorSlug: 'africa',
        marketLabel: 'East Africa (Kenya/Rwanda E-Boda Swapping)',
        certifications: ['UN 38.3', 'AIS-156 / IEC 62619'],
        incentiveNote: 'Fast-growing swappable 48V/72V LFP battery pack exports for African e-mobility.',
      },
    ],
    marketDemand: {
      tamGlobal: '$130 Billion',
      tamIndia: '$15 Billion by 2030',
      cagr: '25.5%',
      importDependencyPercent: 75,
      growthDrivers: [
        'Mandatory electrification targets for 2-wheelers, 3-wheelers, passenger cars, and commercial buses',
        'FAME II / PM E-DRIVE subsidies driving local value addition requirements',
        'Stringent AIS-156 thermal runaway safety norms requiring precision automated manufacturing',
      ],
    },
    capitalRequirements: {
      pilotCapEx: '₹6 Cr – ₹14 Cr (2-Wheeler / 3-Wheeler Pack Line, 50 MWh/year)',
      commercialCapEx: '₹45 Cr – ₹150 Cr (Automated Automotive Giga-Line, 500 MWh – 1 GWh/year)',
      landSqFt: '20,000 – 65,000 sq. ft.',
      powerGridKva: '800 – 2,500 kVA',
      cleanroomClass: 'Dry Room (<1% RH, Dew Point -40°C for cell handling)',
      workingCapitalMonths: 3,
    },
    machineryList: [
      {
        name: 'High-Speed Automated Cell Sorting & OCV/IR Tester',
        purpose: 'Measures open-circuit voltage (OCV) down to 0.1mV and internal AC resistance (IR) to group cells into matched capacity bins.',
        estCostInr: '₹85 Lakhs – ₹1.6 Cr',
        recommendedBrands: ['Hioki (Japan)', 'Chroma ATE', 'Wintech'],
      },
      {
        name: 'Ultrasonic Aluminum Wire / Ribbon Wedge Bonder',
        purpose: 'Ultrasonic bonding of individual cylindrical cell terminals (fuse wire) preventing thermal propagation on short circuits.',
        estCostInr: '₹1.8 Cr – ₹3.5 Cr',
        recommendedBrands: ['Hesse Mechatronics (Germany)', 'Kulicke & Soffa', 'F&K Delvotec'],
      },
      {
        name: 'Fiber Laser Busbar Welding Robotic Cell',
        purpose: 'Spatter-free high-speed laser welding of copper and aluminum high-voltage busbars with real-time weld depth monitoring.',
        estCostInr: '₹2.2 Cr – ₹4.2 Cr',
        recommendedBrands: ['IPG Photonics', 'TRUMPF (Germany)', 'Coherent'],
      },
      {
        name: 'Automated 2-Part Thermal Conductive Gap Filler Dispenser',
        purpose: 'Dispenses high-thermal conductivity potting silicone/polyurethane between cells and cooling plates without air bubbles.',
        estCostInr: '₹90 Lakhs – ₹1.8 Cr',
        recommendedBrands: ['Scheugenpflug (Atlas Copco)', 'Nordson SEALANT', 'DOPAG'],
      },
      {
        name: 'End-of-Line (EOL) Regenerative Battery Pack Cycler',
        purpose: 'High-power charge/discharge cycling, insulation resistance, BMS communication verification, and thermal profiling.',
        estCostInr: '₹1.5 Cr – ₹3.0 Cr',
        recommendedBrands: ['Chroma ATE', 'Bitrode', 'Arbin Instruments'],
      },
    ],
    executionRoadmap: [
      {
        phase: 'Phase 1',
        title: 'Fire-Safe Civil Design & Dry Room Construction',
        durationWeeks: 'Weeks 1–10',
        tasks: [
          'Construct factory with 2-hour fire-rated explosion-proof walls and automated aerosol/deluge fire suppression',
          'Deploy industrial desiccant dehumidifier unit creating dry room with -40°C dew point',
          'Design dedicated outdoor hazardous battery quarantine bunker with thermal imaging cameras',
        ],
        deliverable: 'Certified dry room envelope and fire safety infrastructure.',
      },
      {
        phase: 'Phase 2',
        title: 'Automated Assembly Line & Laser Welding Integration',
        durationWeeks: 'Weeks 11–22',
        tasks: [
          'Install conveyorized cell sorting and automated cell matrix insertion into flame-retardant plastic holders',
          'Commission IPG fiber laser welder with galvanometer scanning head for copper busbars',
          'Calibrate weld pull-testing and micro-ohm resistance meters (<20 micro-ohms per joint)',
        ],
        deliverable: 'Automated cell-to-module assembly line functional.',
      },
      {
        phase: 'Phase 3',
        title: 'BMS Flashing & AIS-156 Compliance Safety Testing',
        durationWeeks: 'Weeks 23–32',
        tasks: [
          'Flash custom Battery Management System (BMS) firmware with CAN bus telemetry and active cell balancing',
          'Conduct mandatory AIS-156 Amendment III thermal runaway propagation tests (nail penetration / overcharge without fire)',
          'Complete IP67 water immersion immersion tank testing',
        ],
        deliverable: 'ARAI / ICAT homologation certification report.',
      },
      {
        phase: 'Phase 4',
        title: 'Serial Automotive Production & Telematics Cloud Sync',
        durationWeeks: 'Weeks 33–42',
        tasks: [
          'Initiate commercial pack supply to electric 2W, 3W, and commercial vehicle OEMs',
          'Connect battery packs to cloud IoT backend for real-time State-of-Health (SOH) tracking and warranty management',
        ],
        deliverable: 'Commercial shipping with 500+ packs per day throughput.',
      },
    ],
    rawMaterialsAndSupplyChain: {
      materials: [
        'Lithium-Ion Cylindrical (21700 / 18650) or Prismatic Cells (NMC, LFP)',
        'Copper High-Voltage Busbars (Nickel plated)',
        'Flame Retardant Injection Molded Cell Holders (UL 94V-0 Polycarbonate)',
        'Smart Battery Management System (BMS) with CAN 2.0B / CAN-FD',
        'Thermally Conductive Structural Adhesive (2.5 W/m-K)',
      ],
      primarySources: ['LG Energy Solution', 'CATL', 'Gotion High-tech', 'EVE Energy', 'Henkel Loctite'],
      indianIndustrialClusters: ['Pune / Chakan (Maharashtra)', 'Hosur / Krishnagiri (Tamil Nadu)', 'Sanand (Gujarat)', 'Manesar / Gurgaon (Haryana)'],
    },
    certificationsAndCompliance: {
      mandatory: ['AIS-156 (Amendment III for Electric 2W/3W)', 'AIS-038 (Rev 2 for Electric 4W)', 'UN 38.3 (Transport Safety)', 'ISO 9001'],
      pollutionCategory: 'Orange',
      clearancesRequired: ['Petroleum & Explosives Safety Organization (PESO) NOC', 'SPCB Hazardous Waste Handling License', 'Fire Safety NOC'],
    },
    governmentSchemes: [
      {
        schemeName: 'National Programme on Advanced Chemistry Cell (ACC) Battery Storage (PLI)',
        subsidyDetails: 'Direct cash subsidy linked to cell energy density and domestic value addition percentage.',
        eligibleBody: 'Ministry of Heavy Industries',
      },
      {
        schemeName: 'PM E-DRIVE Scheme',
        subsidyDetails: 'Subsidies and demand incentives for vehicles utilizing domestic certified battery packs.',
        eligibleBody: 'Heavy Industries / NITI Aayog',
      },
    ],
    unitEconomics: {
      typicalGrossMargin: '22% – 34%',
      netMargin: '10% – 16%',
      paybackPeriodYears: '2.8 – 4.0 Years',
      breakEvenCapacityUtil: '50% Capacity Utilization',
    },
  },
  {
    slug: 'drone-aerospace',
    title: 'Precision Drone & Aerospace Airframe Facility',
    category: 'Mobility & Vehicles',
    tagline: 'Manufacture carbon airframes, brushless motor stators, electronic speed controllers (ESC), and type-certified UAVs.',
    overview:
      'Starting a precision drone manufacturing facility involves carbon composite plate CNC routing, automated BLDC motor winding, SMT assembly of flight controllers and ESCs, and final indoor test bench calibration under DGCA Type Certification.',
    estimatorBaseCapExCrores: 14.0,
    pilotScaleOption: {
      budgetRangeInr: '₹6 Lakhs – ₹26 Lakhs',
      midpointLakhs: 16,
      batchSize: '5 – 40 UAV Airframes & Flight Kits (Carbon CNC Routing + Local ESC SMT)',
      bridgeModel:
        'Route 3K carbon fiber frames via Bengaluru/Pune CNC job-shops, populate ArduPilot/H7 flight controllers and 4-in-1 ESCs at local SMT lines, and log 50-hour thrust & endurance trials at NIT/IIT flight cages before building an indoor arena.',
      indianBridgePartners: [
        'NIT Trichy Autonomous Robotics Bench',
        'Bengaluru Peenya Carbon CNC & Motor Winding Shops',
        'CoE Drone Labs (IIT Madras / T-Hub Hyderabad)',
        'ADRDE / DGCA Authorized UAV Testing Ranges',
      ],
      graduationGate:
        'DGCA Type Certificate (Form D-1) issuance + first GeM or agri/survey fleet order of 25+ UAVs.',
    },
    linkedComplianceSlug: 'dgca-drone-type-certification',
    linkedAssemblySlug: 'drone-autopilot-v4-pcba',
    linkedTestbedSlug: 'imv-electrodynamic-shaker-table',
    linkedLabs: [
      { name: 'NIT Trichy Autonomous Robotics Bench', city: 'Tiruchirappalli', href: '/labs' },
      { name: 'T-Hub Hardware Prototyping Node', city: 'Hyderabad', href: '/labs' },
    ],
    exportHsCodes: [
      '8806.22 / 8806.29 (Unmanned Aircraft / Mapping & Agri UAVs)',
      '8501.31 (Propulsion BLDC Motors & Flight Avionics)',
    ],
    exportCorridors: [
      {
        corridorSlug: 'uae-gcc',
        marketLabel: 'UAE & GCC (Inspection & Logistics)',
        certifications: ['GCAA Drone Approval', 'IP54 Desert Dust Seal', 'ISO 9001'],
        incentiveNote: 'India-UAE CEPA 0% tariff + oilfield, solar-farm, and port inspection UAV demand.',
      },
      {
        corridorSlug: 'africa',
        marketLabel: 'Africa (Agri-Spraying & Mining Survey)',
        certifications: ['DGCA Type Cert Equivalence', 'UN 38.3 (UAV Smart Packs)'],
        incentiveNote: 'PLI Drone cost edge enabling ruggedized 10L–30L agri-drone exports.',
      },
      {
        corridorSlug: 'asean',
        marketLabel: 'ASEAN (Plantation & Maritime Survey)',
        certifications: ['CE / FCC Telemetry Compliance', 'ISO 9001'],
        incentiveNote: 'Strong demand across Indonesia, Malaysia, and Vietnam oil-palm & coastal mapping.',
      },
    ],
    marketDemand: {
      tamGlobal: '$45 Billion',
      tamIndia: '₹12,000 Cr ($1.5B) by 2028',
      cagr: '22.8%',
      importDependencyPercent: 55,
      growthDrivers: [
        'Strict government ban on imported foreign drones creating complete domestic procurement monopoly',
        'Massive agricultural spraying adoption under the Namo Drone Didi scheme',
        'Defence, border surveillance, and critical logistics delivery corridors',
      ],
    },
    capitalRequirements: {
      pilotCapEx: '₹3.2 Cr – ₹7.5 Cr (CNC Router, SMT ESC Line & Flight Cage)',
      commercialCapEx: '₹15 Cr – ₹40 Cr (Full Autoclave, Motor Winding & Radar Testing)',
      landSqFt: '12,000 – 35,000 sq. ft.',
      powerGridKva: '350 – 900 kVA',
      workingCapitalMonths: 4,
    },
    machineryList: [
      {
        name: 'High-Speed CNC Carbon Fiber Plate Router with Vacuum Table',
        purpose: 'Precision nesting and high-speed routing of 3K carbon fiber arms and plates with dust extraction.',
        estCostInr: '₹45 Lakhs – ₹90 Lakhs',
        recommendedBrands: ['AXYZ Tailored Router', 'Biesse Group', 'MultiCam'],
      },
      {
        name: 'Automated 12-Slot BLDC Motor Stator Winding Machine',
        purpose: 'Precision multi-strand copper wire winding on brushless motor stators with tight slot fill factor.',
        estCostInr: '₹60 Lakhs – ₹1.2 Cr',
        recommendedBrands: ['Nidec Corporation', 'Odawara Engineering', 'Tanac'],
      },
      {
        name: 'Dynamic Propeller & Motor Thrust Test Bench',
        purpose: 'Measures RPM, vibration spectrum, torque, electrical power (Watts), and dynamic thrust (grams) under varying throttle.',
        estCostInr: '₹25 Lakhs – ₹55 Lakhs',
        recommendedBrands: ['Tyto Robotics (Series 1780)', 'RCbenchmark', 'Mechatronic Labs'],
      },
      {
        name: 'Indoor Flight Test Arena with Netting & Motion Capture',
        purpose: 'Safe GPS-denied autonomous flight testing, optical flow calibration, and fail-safe return-to-launch (RTL) validation.',
        estCostInr: '₹30 Lakhs – ₹75 Lakhs',
        recommendedBrands: ['OptiTrack Motion Capture', 'Vicon Systems', 'Custom Cage Engineering'],
      },
    ],
    executionRoadmap: [
      {
        phase: 'Phase 1',
        title: 'DGCA Design Approval & Manufacturing Licensing',
        durationWeeks: 'Weeks 1–10',
        tasks: [
          'Register facility on DGCA Digital Sky portal as an authorized drone manufacturer',
          'Submit airworthiness design documentation for DGCA Type Certification (Form D-1)',
          'Establish indoor flight testing cage compliant with safety regulations',
        ],
        deliverable: 'DGCA Provisional Manufacturer License.',
      },
      {
        phase: 'Phase 2',
        title: 'CNC Airframe Routing & Motor Assembly Setup',
        durationWeeks: 'Weeks 11–20',
        tasks: [
          'Install high-vacuum CNC router for trimming carbon fiber plates with zero delamination',
          'Set up automated stator winding line and dynamically balance rotor bells to <0.02g-mm vibration',
          'Deploy SMT line for autonomous flight controller boards with redundant IMUs (triple gyro/accelerometer)',
        ],
        deliverable: 'Sub-assembly production line operational.',
      },
      {
        phase: 'Phase 3',
        title: 'Type Certification Flight Testing & Weather Trials',
        durationWeeks: 'Weeks 21–32',
        tasks: [
          'Conduct continuous 50-hour endurance flight test under DGCA authorized testing agency (TUMT/ADRDE)',
          'Perform high wind resistance (12 m/s), rain tolerance (IP54), and extreme temperature (-10°C to +50°C) trials',
        ],
        deliverable: 'Official DGCA Type Certificate issued.',
      },
      {
        phase: 'Phase 4',
        title: 'GeM Portal Onboarding & Defence / Agri Supply',
        durationWeeks: 'Weeks 33–42',
        tasks: [
          'List certified drone models on Government e-Marketplace (GeM) for public sector procurement',
          'Establish regional pilot training and spare parts support hubs',
        ],
        deliverable: 'Commercial shipments to state governments, agriculture cooperatives, and defence agencies.',
      },
    ],
    rawMaterialsAndSupplyChain: {
      materials: [
        'Solid Carbon Fiber Plates (1.5mm to 4.0mm thickness, 3K twill)',
        'High-Grade Enameled Copper Wire & Neodymium Curved Magnets',
        'Silicon MEMS Inertial Measurement Units (Bosch Sensortec, TDK InvenSense)',
        'Carbon Nylon / Polycarbonate Foldable Propellers',
        'Long-Range RF Telemetry Transceivers (868MHz / 2.4GHz)',
      ],
      primarySources: ['Toray Carbon', 'Bosch Sensortec', 'T-Motor', 'Analog Devices'],
      indianIndustrialClusters: ['Bangalore Drone Ecosystem (Karnataka)', 'Hyderabad Aero City', 'Pune Industrial Hub', 'Noida Electronics Zone'],
    },
    certificationsAndCompliance: {
      mandatory: ['DGCA Type Certification', 'Digital Sky Registration & UIN', 'WPC ETA (Wireless Planning & Coordination) License', 'ISO 9001'],
      pollutionCategory: 'Green',
      clearancesRequired: ['Local Police Clearance for Drone Testing', 'WPC Frequency Spectrum Approval', 'Factory License'],
    },
    governmentSchemes: [
      {
        schemeName: 'PLI Scheme for Drones & Drone Components',
        subsidyDetails: '20% flat cash incentive on domestic value addition over 3 financial years.',
        eligibleBody: 'Ministry of Civil Aviation (MoCA)',
      },
      {
        schemeName: 'Agricultural Drone Subsidy (Sub-Mission on Agricultural Mechanization)',
        subsidyDetails: 'Up to 50% subsidy (up to ₹5 Lakhs) for farmer producer organizations purchasing certified agri drones.',
        eligibleBody: 'Ministry of Agriculture',
      },
    ],
    unitEconomics: {
      typicalGrossMargin: '48% – 65%',
      netMargin: '24% – 36%',
      paybackPeriodYears: '2.0 – 3.2 Years',
      breakEvenCapacityUtil: '38% Capacity Utilization',
    },
  },
  {
    slug: 'medtech-diagnostics-plant',
    title: 'ISO 13485 Point-of-Care IVD & Wearable Medical Device Assembly',
    category: 'MedTech & Diagnostics',
    tagline: 'Build an ISO 13485 cleanroom facility for point-of-care microfluidic diagnostics, clinical wearables, and CDSCO / FDA export devices.',
    overview:
      'Point-of-care In-Vitro Diagnostics (IVD) and wearable medical monitoring assembly combines ISO Class 7 cleanroom SMT electronics, precision microfluidic reagent dispensing, ultrasonic polymer cartridge welding, and medical-grade QMS validation aligned with CDSCO Class B/C, EU CE IVDR, and US FDA 510(k).',
    estimatorBaseCapExCrores: 22.0,
    pilotScaleOption: {
      budgetRangeInr: '₹12 Lakhs – ₹35 Lakhs',
      midpointLakhs: 24,
      batchSize: '500 – 5,000 IVD Cartridges / Wearable Monitor Units (AMTZ / BIRAC Shared Cleanroom)',
      bridgeModel:
        'Incubate inside AMTZ Visakhapatnam or BIRAC BioNEST cleanrooms using shared micro-dispensing, contract ISO-13485 SMT PCBA, and NABL biocompatibility/IEC 60601 testing before financing your own cleanroom.',
      indianBridgePartners: [
        'AMTZ — Andhra Pradesh MedTech Zone (Visakhapatnam)',
        'BIRAC BioNEST / C-CAMP MedTech Cleanrooms (Bengaluru)',
        'IKP Knowledge Park (Hyderabad)',
        'HTIC — IIT Madras Healthcare Technology Innovation Centre',
      ],
      graduationGate:
        'CDSCO Test License (Form MD-13) + clinical concordance ≥95% across 300+ samples and CE IVDR / FDA 510(k) technical dossier lock.',
    },
    linkedComplianceSlug: 'cdsco-med-class-b-vital-monitor',
    linkedAssemblySlug: 'iot-wearable-sensor-pcba',
    linkedTestbedSlug: 'rs-emc-semi-anechoic-chamber',
    linkedLabs: [
      { name: 'Center for Innovation (CFI) — IIT Madras', city: 'Chennai', href: '/labs' },
      { name: 'T-Hub Hardware Prototyping Node', city: 'Hyderabad', href: '/labs' },
    ],
    exportHsCodes: [
      '9018.19 / 9018.90 (Point-of-Care Diagnostic & Vital Monitoring Devices)',
      '3822.19 (Microfluidic IVD Test Cartridges & Biosensor Strips)',
    ],
    exportCorridors: [
      {
        corridorSlug: 'us',
        marketLabel: 'United States (FDA 510(k) / CLIA-Waived)',
        certifications: ['US FDA 510(k)', 'ISO 13485:2016', 'IEC 60601-1 Ed 3.2'],
        incentiveNote: 'High-margin US clinic & home-diagnostics supply with 3x domestic ASP realization.',
      },
      {
        corridorSlug: 'eu',
        marketLabel: 'European Union (CE IVDR / MDR)',
        certifications: ['EU IVDR (2017/746)', 'ISO 14971 Risk Management', 'RoHS & REACH'],
        incentiveNote: 'RoDTEP medical device rebate + EU hospital group procurement access.',
      },
      {
        corridorSlug: 'africa',
        marketLabel: 'Africa & Global Health Tenders (WHO PQ)',
        certifications: ['WHO Prequalification (PQ)', 'CDSCO MD-15', 'ISO 13485'],
        incentiveNote: 'PEPFAR, Global Fund, and Ministries of Health tropical disease IVD tenders.',
      },
    ],
    marketDemand: {
      tamGlobal: '$98 Billion',
      tamIndia: '$16 Billion by 2028',
      cagr: '17.6%',
      importDependencyPercent: 72,
      growthDrivers: [
        'PLI Scheme for Medical Devices & dedicated MedTech Parks lowering cleanroom overhead by 35%',
        'Ayushman Bharat Digital Mission & Tier-2/3 decentralized point-of-care diagnostics expansion',
        'Global shift toward affordable WHO-PQ point-of-care PCR, HbA1c, and continuous ECG wearables',
      ],
    },
    capitalRequirements: {
      pilotCapEx: '₹3.8 Cr – ₹7.5 Cr (ISO Class 7 Cleanroom SMT, Microfluidics & QC Lab)',
      commercialCapEx: '₹18 Cr – ₹48 Cr (Automated Cartridge Dispensing, Cleanroom Molding & Packaging)',
      landSqFt: '12,000 – 38,000 sq. ft.',
      powerGridKva: '450 – 1,400 kVA (Dual backup + UPS for lyophilized reagents)',
      cleanroomClass: 'ISO 7 / Class 10,000 (Assembly) & ISO 6 Laminar Hoods (Reagent Fill)',
      waterLpd: '25,000 Litres Purified Water (USP / WFI grade for reagent prep)',
      workingCapitalMonths: 5,
    },
    machineryList: [
      {
        name: 'Precision Microfluidic Reagent Dispenser & BioJet Plotter',
        purpose: 'Non-contact nanolitre spotting of antibodies, enzymes, and primers onto nitrocellulose or COP microfluidic chips.',
        estCostInr: '₹1.2 Cr – ₹2.4 Cr',
        recommendedBrands: ['BioDot (USA)', 'Biodot / Scienion', 'Nordson EFD'],
      },
      {
        name: 'Ultrasonic & Laser Microfluidic Cartridge Welder',
        purpose: 'Hermetic sealing of cyclic olefin polymer (COC/COP) diagnostic cassettes without thermal degradation of reagents.',
        estCostInr: '₹65 Lakhs – ₹1.4 Cr',
        recommendedBrands: ['Branson Ultrasonics (Emerson)', 'LPKF Laser', 'Herrmann Ultraschall'],
      },
      {
        name: 'Cleanroom Medical-Grade SMT & Selective Conformal Line',
        purpose: 'Lead-free medical PCBA placement (AFE ECG/PPG analog front-ends, BLE SoCs) with automated optical inspection.',
        estCostInr: '₹2.2 Cr – ₹4.2 Cr',
        recommendedBrands: ['Yamaha Motor Robotics', 'ASMPT', 'Koh Young 3D AOI'],
      },
      {
        name: 'Automated Foil Pouch Sealer, Desiccant Inserter & Lyophilizer',
        purpose: 'Moisture-barrier blister/foil packaging (<2% RH) preserving enzyme stability for 18–24 months at ambient tropical storage.',
        estCostInr: '₹85 Lakhs – ₹1.8 Cr',
        recommendedBrands: ['IMA Group', 'Optima Packaging', 'SP Scientific'],
      },
      {
        name: 'IEC 60601 Electrical Safety & Clinical Fluorescence Analyzer Rig',
        purpose: '100% end-of-line patient leakage current (<10µA CF-type), optical CV%, and thermal cycling verification.',
        estCostInr: '₹55 Lakhs – ₹1.1 Cr',
        recommendedBrands: ['Fluke Biomedical', 'Seaward Rigel', 'Molecular Devices'],
      },
    ],
    executionRoadmap: [
      {
        phase: 'Phase 1',
        title: 'ISO 13485 QMS Architecture & CDSCO MD-13 Test License',
        durationWeeks: 'Weeks 1–10',
        tasks: [
          'Establish ISO 13485:2016 Quality Management System and ISO 14971 risk management dossier',
          'Obtain CDSCO Form MD-13 Test License and register facility at State Licensing Authority / CDSCO Sugam portal',
          'Select cleanroom turnkey contractor for modular PUF panels, HEPA H14 filtration, and epoxy antistatic floors',
        ],
        deliverable: 'Validated ISO 7 cleanroom civil envelope and MD-13 test batch permit.',
      },
      {
        phase: 'Phase 2',
        title: 'Microfluidics, Cleanroom SMT & Installation Qualification (IQ/OQ)',
        durationWeeks: 'Weeks 11–24',
        tasks: [
          'Install reagent nanolitre plotter, ultrasonic welders, and medical-grade SMT line inside ISO 7 airlock zone',
          'Execute Installation Qualification (IQ) and Operational Qualification (OQ) with calibrated particle counters',
          'Lock medical-grade polymer (COC/PMMA) and sensor BOM traceability under 21 CFR Part 820 / DHR logs',
        ],
        deliverable: 'IQ/OQ certified pilot production line producing engineering validation lots.',
      },
      {
        phase: 'Phase 3',
        title: 'Biocompatibility, IEC 60601 & Clinical Concordance Trials',
        durationWeeks: 'Weeks 25–38',
        tasks: [
          'Complete ISO 10993 cytotoxicity/sensitization and IEC 60601-1-2 medical EMC immunity testing at NABL labs',
          'Run 3 consecutive Process Qualification (PQ) lots and clinical concordance validation at ICMR/teaching hospitals',
          'Compile Summary Technical Documentation (STED) for CDSCO MD-15 & EU Notified Body submission',
        ],
        deliverable: 'CDSCO MD-15 Manufacturing License and NABL safety test reports.',
      },
      {
        phase: 'Phase 4',
        title: 'Commercial Hospital Supply & US/EU/WHO Export Launch',
        durationWeeks: 'Weeks 39–52',
        tasks: [
          'Clear CE IVDR / US FDA 510(k) regulatory audit and UDI barcode serialization',
          'Onboard hospital chains, GeM medical procurement, and global IVD distributors across US, EU, and Africa',
        ],
        deliverable: 'Commercial ISO 13485 production at 50,000+ cartridges or 5,000+ devices/month.',
      },
    ],
    rawMaterialsAndSupplyChain: {
      materials: [
        'Medical-Grade Cyclic Olefin Copolymer (COC / COP) & Polycarbonate Pellets',
        'Nitrocellulose Membranes, Gold Nanoparticles & Lyophilized Enzymes/Antibodies',
        'Ultra-Low Noise Biosensor AFEs & BLE 5.3 SoCs (TI, Analog Devices, Nordic)',
        'Medical Grade Silicone / Hypoallergenic Hydrogel Adhesives (3M, Dow)',
        'Aluminum-Foil Moisture Barrier Pouches & Molecular Sieve Desiccants',
      ],
      primarySources: ['TOPAS Advanced Polymers', 'Cytiva / Sartorius', 'Texas Instruments', '3M Medical Specialties'],
      indianIndustrialClusters: [
        'AMTZ Visakhapatnam (Andhra Pradesh)',
        'Bengaluru BioCluster / Electronic City (Karnataka)',
        'Oragadam / Chennai MedTech Corridor (Tamil Nadu)',
        'Hyderabad Medical Devices Park (Telangana)',
      ],
    },
    certificationsAndCompliance: {
      mandatory: [
        'CDSCO Medical Devices Rules 2017 (Class B / C MD-15)',
        'ISO 13485:2016 (Medical Device QMS)',
        'IEC 60601-1 / IEC 61010 (Medical Electrical Safety & EMC)',
        'CE IVDR (EU) & US FDA 510(k) Export Standards',
        'ISO 10993 Biocompatibility',
      ],
      pollutionCategory: 'Green',
      clearancesRequired: [
        'CDSCO Sugam Manufacturing & Test License',
        'Bio-Medical Waste Management Authorization (SPCB)',
        'Factories Act & Cleanroom Fire NOC',
      ],
    },
    governmentSchemes: [
      {
        schemeName: 'PLI Scheme for Promoting Domestic Manufacturing of Medical Devices',
        subsidyDetails: '5% cash incentive on incremental net sales over 5 years across diagnostics & imaging equipment.',
        eligibleBody: 'Department of Pharmaceuticals (DoP), Govt. of India',
      },
      {
        schemeName: 'Promotion of Medical Devices Parks & BIRAC BIPP/SBIRI',
        subsidyDetails: 'Up to ₹100 Cr common testing infrastructure grants at AMTZ/state parks + 50% early-stage BIRAC R&D validation.',
        eligibleBody: 'DBT-BIRAC / Department of Pharmaceuticals',
      },
    ],
    unitEconomics: {
      typicalGrossMargin: '52% – 68%',
      netMargin: '22% – 34%',
      paybackPeriodYears: '2.4 – 3.6 Years',
      breakEvenCapacityUtil: '42% Capacity Utilization',
    },
  },
  {
    slug: 'solar-inverter-bess-plant',
    title: 'Solar PV Microinverter & Commercial BESS Assembly Line',
    category: 'Clean Energy',
    tagline: 'Manufacture GaN/SiC solar microinverters, string inverters, and grid-interactive commercial battery energy storage racks for India & export.',
    overview:
      'A solar power electronics and BESS assembly facility manufactures high-efficiency GaN/SiC microinverters, hybrid string inverters, and modular 5kWh–250kWh LFP energy storage cabinets featuring conformal-coated HV PCBAs, IP67 thermal potting, and automated grid-tie anti-islanding test benches.',
    estimatorBaseCapExCrores: 26.0,
    pilotScaleOption: {
      budgetRangeInr: '₹8 Lakhs – ₹28 Lakhs',
      midpointLakhs: 18,
      batchSize: '25 – 250 Microinverters / 5–15kWh BESS Racks (Contract HV SMT + NISE/CPRI Pre-Scan)',
      bridgeModel:
        'Assemble GaN/SiC power boards at Bengaluru or Pune EMS lines with selective silicone conformal coating, machine IP67 cast-aluminum housings via job-shops, and pass IEEE 1547 / IEC 62109 grid-tie validation at CPRI/NISE before plant CapEx.',
      indianBridgePartners: [
        'Bommasandra / Peenya Power Electronics EMS Lines (Bengaluru)',
        'NISE — National Institute of Solar Energy (Gurugram)',
        'CPRI — Central Power Research Institute (Bengaluru/Bhopal)',
        'Chakan Sheet-Metal Enclosure & Thermal Extrusion Job-Shops (Pune)',
      ],
      graduationGate:
        'BIS IS 16221 / IEC 62109 safety pass + UL 1741 / CE grid-export compliance and ≥5 MW/quarter EPC order book.',
    },
    linkedComplianceSlug: 'bis-crs-smps-adapter',
    linkedAssemblySlug: 'gan-microinverter-power-pcba',
    linkedTestbedSlug: 'chroma-17020-ev-battery-cycler',
    linkedLabs: [
      { name: 'Pune Maker FabLab Node', city: 'Pune', href: '/labs' },
      { name: 'Center for Innovation (CFI) — IIT Madras', city: 'Chennai', href: '/labs' },
    ],
    exportHsCodes: [
      '8504.40 (Solar Microinverters, Hybrid & Grid-Tie Inverters)',
      '8507.60 / 8507.80 (Commercial & C&I Lithium BESS Cabinets)',
    ],
    exportCorridors: [
      {
        corridorSlug: 'us',
        marketLabel: 'United States (Residential & C&I Solar)',
        certifications: ['UL 1741 SA/SB', 'IEEE 1547-2018', 'FCC Part 15 Class B', 'UL 9540'],
        incentiveNote: 'IRA domestic/allied inverter diversification driving massive US rooftop microinverter demand.',
      },
      {
        corridorSlug: 'eu',
        marketLabel: 'European Union (Balcony & Hybrid BESS)',
        certifications: ['CE LVD/EMC', 'VDE-AR-N 4105', 'IEC 62109-1/-2', 'EN 50549'],
        incentiveNote: 'RoDTEP power electronics rebate + zero tariff pressure vs competing non-FTA suppliers.',
      },
      {
        corridorSlug: 'africa',
        marketLabel: 'Sub-Saharan Africa (Solar Mini-Grids)',
        certifications: ['IEC 62109', 'SONCAP / PVoC', 'UN 38.3'],
        incentiveNote: 'ISA (International Solar Alliance) & EXIM-backed rural clinic/telecom solar storage tenders.',
      },
    ],
    marketDemand: {
      tamGlobal: '$46 Billion',
      tamIndia: '$6.2 Billion by 2029',
      cagr: '21.4%',
      importDependencyPercent: 68,
      growthDrivers: [
        'PM Surya Ghar Muft Bijli Yojana driving 10+ million rooftop solar inverter installations across India',
        'Central Electricity Authority mandate pairing renewable plants with 4-hour Commercial & Utility BESS',
        'Global shift to GaN/SiC high-frequency microinverters (>97.5% CEC efficiency) and US/EU non-FEOC sourcing',
      ],
    },
    capitalRequirements: {
      pilotCapEx: '₹4.5 Cr – ₹9.0 Cr (HV PCBA Assembly, Selective Conformal Coat & Burn-In Rig)',
      commercialCapEx: '₹24 Cr – ₹65 Cr (Dual SMT + Automated Vacuum Potting & Commercial BESS Bay)',
      landSqFt: '18,000 – 55,000 sq. ft.',
      powerGridKva: '600 – 2,000 kVA (Bi-directional regenerative grid tie-back)',
      cleanroomClass: 'ISO 8 / Controlled ESD & Humidity Zone (Conformal Coat & HV Isolation)',
      workingCapitalMonths: 4,
    },
    machineryList: [
      {
        name: 'High-Speed Heavy-Copper SMT & Vacuum Reflow Line',
        purpose: 'Places SiC MOSFETs, GaN FETs, and planar magnetics onto 3oz–4oz heavy-copper PCBs with void-free solder joints.',
        estCostInr: '₹3.2 Cr – ₹6.0 Cr',
        recommendedBrands: ['Fuji Corporation', 'Heller Vacuum Reflow', 'Koh Young 3D SPI/AOI'],
      },
      {
        name: 'Automated Selective Silicone Conformal Coating & UV Cure Cell',
        purpose: 'Protects high-voltage (600V–1500V DC) creepage/clearance nodes against monsoon humidity and salt mist.',
        estCostInr: '₹75 Lakhs – ₹1.5 Cr',
        recommendedBrands: ['Nordson ASYMTEK', 'PVA Coating', 'SCS'],
      },
      {
        name: 'Automated Two-Part Vacuum Thermal Epoxy Potting Station',
        purpose: 'Encapsulates outdoor rooftop microinverters inside finned aluminum enclosures achieving IP67 and 25-year thermal life.',
        estCostInr: '₹85 Lakhs – ₹1.7 Cr',
        recommendedBrands: ['DOPAG', 'Scheugenpflug', 'Bdtronic'],
      },
      {
        name: 'Programmable AC Grid Simulator & PV Array Emulator HIL Rack',
        purpose: 'Tests MPPT dynamic tracking (>99.5%), zero-voltage ride-through (LVRT), and <2s anti-islanding trip response.',
        estCostInr: '₹1.4 Cr – ₹2.8 Cr',
        recommendedBrands: ['Chroma ATE', 'Keysight Technologies', 'Regatron'],
      },
      {
        name: 'Automated High-Pot (4kV) Safety & 48-Hour Burn-In Chamber',
        purpose: 'Runs full-load thermal soak at 55°C ambient while regenerating AC power back to factory busbars.',
        estCostInr: '₹95 Lakhs – ₹2.0 Cr',
        recommendedBrands: ['Chroma ATE', 'Itech Electronics', 'Thermotron'],
      },
    ],
    executionRoadmap: [
      {
        phase: 'Phase 1',
        title: 'Power Architecture, Magnetics Tooling & BIS Registration',
        durationWeeks: 'Weeks 1–10',
        tasks: [
          'Lock GaN/SiC flyback or dual-active-bridge inverter topology with planar transformer suppliers',
          'Apply for BIS CRS IS 16221 / IEC 62109 testing slots at CPRI or ERDA Vadodara',
          'Set up ESD-safe heavy-copper SMT and high-voltage isolation assembly floor',
        ],
        deliverable: 'Die-cast IP67 enclosure tooling and pre-compliance inverter prototypes.',
      },
      {
        phase: 'Phase 2',
        title: 'HV SMT, Conformal Coating & Vacuum Potting Commissioning',
        durationWeeks: 'Weeks 11–22',
        tasks: [
          'Install vacuum reflow oven minimizing solder voids beneath thermal pads (<5%)',
          'Commission selective conformal coater and vacuum potting cell for IP67 outdoor durability',
          'Establish modular BESS cabinet assembly track with busbar torque verification and BMS CAN flashing',
        ],
        deliverable: 'Automated microinverter and BESS rack sub-assembly line commissioned.',
      },
      {
        phase: 'Phase 3',
        title: 'Grid-Tie Anti-Islanding & UL 1741 / CE Qualification',
        durationWeeks: 'Weeks 23–34',
        tasks: [
          'Execute regenerative burn-in, 4kV Hipot, and EMC conducted/radiated emissions tests',
          'Complete BIS IS 16221, UL 1741 SA/SB (US), and VDE-AR-N 4105 (EU) grid-code certifications',
        ],
        deliverable: 'Dual domestic (BIS/MNRE) and export (UL/CE) certification dossiers cleared.',
      },
      {
        phase: 'Phase 4',
        title: 'MNRE Empanelment & Global Solar Distributor Ramp',
        durationWeeks: 'Weeks 35–44',
        tasks: [
          'Register on PM Surya Ghar / MNRE vendor portals and C&I solar EPC procurement lists',
          'Ship initial container lots to US, EU, and African solar mini-grid integrators',
        ],
        deliverable: 'Commercial capacity of 20,000+ microinverters and 15 MWh BESS racks/month.',
      },
    ],
    rawMaterialsAndSupplyChain: {
      materials: [
        '650V / 1200V GaN & SiC Power MOSFETs (Infineon, Navitas, Wolfspeed, ST)',
        'High-Frequency Ferrite Cores & Planar Copper Windings',
        '3oz/4oz Heavy-Copper FR4 PCB Laminates & Thermal Epoxy Potting Resin',
        'ADC12 Die-Cast Finned Aluminum Heat-Sink Enclosures',
        'Prismatic LFP Cells (280Ah/314Ah) & HV DC Contactors for BESS Racks',
      ],
      primarySources: ['Infineon Technologies', 'Texas Instruments', 'TDK Magnetics', 'Henkel Bergquist'],
      indianIndustrialClusters: [
        'Bengaluru Bommasandra / Peenya Power Electronics Hub',
        'Pune Chakan / Bhosari Renewable & Auto Hub',
        'Noida / Manesar Solar Inverter Cluster',
        'Sanand / Mundra Solar Manufacturing Park (Gujarat)',
      ],
    },
    certificationsAndCompliance: {
      mandatory: [
        'BIS IS 16221 / IEC 62109-1 & -2 (PV Inverter Safety)',
        'MNRE / CEA Grid Connectivity & Anti-Islanding Compliance',
        'UL 1741 SA / IEEE 1547 (US Export) & CE / VDE-AR-N 4105 (EU Export)',
        'UN 38.3 & IEC 62619 (Commercial BESS Safety)',
      ],
      pollutionCategory: 'Orange',
      clearancesRequired: [
        'SPCB Consent for Epoxy Potting & Solvent Fume Scrubbing',
        'CEA High-Voltage Test Bay Safety Inspection',
        'PESO / Fire NOC for BESS Cell Quarantine Zone',
      ],
    },
    governmentSchemes: [
      {
        schemeName: 'PLI Scheme for High-Efficiency Solar PV & Grid-Scale Battery Storage',
        subsidyDetails: 'Production-linked incentives and domestic content preference for MNRE-compliant solar & storage systems.',
        eligibleBody: 'Ministry of New and Renewable Energy (MNRE)',
      },
      {
        schemeName: 'SPECS & RoDTEP Export Remission',
        subsidyDetails: '25% CapEx subsidy on power electronics SMT/test capital + RoDTEP tax refunds on inverter exports.',
        eligibleBody: 'MeitY / DGFT',
      },
    ],
    unitEconomics: {
      typicalGrossMargin: '32% – 44%',
      netMargin: '15% – 23%',
      paybackPeriodYears: '2.6 – 3.8 Years',
      breakEvenCapacityUtil: '46% Capacity Utilization',
    },
  },
  {
    slug: 'technical-textiles-mill',
    title: 'Smart Woven & Medical Nonwoven Technical Textiles Facility',
    category: 'Technical Textiles',
    tagline: 'Produce medical SSMMS barrier nonwovens, aramid/basalt industrial weaves, and smart conductive textiles in Surat & Tiruppur clusters.',
    overview:
      'Technical textiles power high-value MedTech (surgical gowns, N95 meltblown filters), MobilTech (airbag & tire cord fabrics), BuildTech (geotextiles), and smart wearable fabrics using high-speed rapier/air-jet looms, SSMMS spunbond-meltblown lines, and plasma hydrophobic finishing.',
    estimatorBaseCapExCrores: 30.0,
    pilotScaleOption: {
      budgetRangeInr: '₹6 Lakhs – ₹24 Lakhs',
      midpointLakhs: 15,
      batchSize: '1,000 – 10,000 Metres / 500–2,000 kg Technical Fabric Trial Lots (SITRA / MANTRA CoE)',
      bridgeModel:
        'Rent pilot rapier loom weaving and meltblown beam hours at SITRA Coimbatore or MANTRA Surat Centres of Excellence, run ultrasonic converting at Tiruppur job-shops, and certify OEKO-TEX / hydrostatic barrier specs before ordering multi-crore continuous lines.',
      indianBridgePartners: [
        'SITRA — South India Textile Research Association (Coimbatore)',
        'MANTRA — Man-Made Textiles Research Association (Surat)',
        'Tiruppur Medical Apparel & Technical Knit Job-Shops',
        'BTRA Technical Textiles Centre of Excellence (Mumbai)',
      ],
      graduationGate:
        'OEKO-TEX Standard 100 + EN 13795 / ASTM barrier certification passed and ≥₹3 Cr export buyer LC commitment.',
    },
    linkedComplianceSlug: 'cdsco-med-class-b-vital-monitor',
    linkedAssemblySlug: 'iot-wearable-sensor-pcba',
    linkedTestbedSlug: 'thermotron-thermal-shock-chamber',
    linkedLabs: [
      { name: 'Coimbatore Hardware Prototyping Center', city: 'Coimbatore', href: '/labs' },
      { name: 'Atal Tinkering Lab Vellore #042', city: 'Vellore', href: '/labs' },
    ],
    exportHsCodes: [
      '5603.11 / 5603.14 (Medical Meltblown & Spunbond Nonwovens)',
      '5911.90 / 6307.90 (Technical Industrial Weaves, Geotextiles & Surgical Barriers)',
    ],
    exportCorridors: [
      {
        corridorSlug: 'eu',
        marketLabel: 'European Union (MedTech & Protective)',
        certifications: ['OEKO-TEX Standard 100', 'EN 13795 / EN 14683', 'REACH Compliance'],
        incentiveNote: 'RoSCTL/RoDTEP remission + high demand for sustainable medical & agro-technical textiles.',
      },
      {
        corridorSlug: 'us',
        marketLabel: 'United States (Hospital & Filtration)',
        certifications: ['AAMI PB70 Level 3/4', 'ASTM F2100', 'FDA 510(k) Class II Surgical'],
        incentiveNote: 'US hospital GPO diversification creating 25–35% gross margin opportunities.',
      },
      {
        corridorSlug: 'uae-gcc',
        marketLabel: 'UAE & GCC (BuildTech & Geotextiles)',
        certifications: ['ISO 9001', 'ASTM D4533 / D4632 (Geotextiles)'],
        incentiveNote: 'India-UAE CEPA 0% duty advantage for infrastructure geotextiles & desert shade meshes.',
      },
    ],
    marketDemand: {
      tamGlobal: '$235 Billion',
      tamIndia: '$42 Billion by 2028',
      cagr: '13.2%',
      importDependencyPercent: 48,
      growthDrivers: [
        'PLI Scheme for Textiles (MMF Apparel, MMF Fabrics & Technical Textiles) with ₹10,683 Cr outlay',
        'National Technical Textiles Mission (NTTM) subsidizing indigenous medical, defense, and agro-textiles',
        'Surat & Tiruppur clusters upgrading from commodity apparel into high-margin medical nonwovens & smart fabrics',
      ],
    },
    capitalRequirements: {
      pilotCapEx: '₹5.5 Cr – ₹11.0 Cr (Pilot Rapier Technical Loom / Meltblown Line & QC Lab)',
      commercialCapEx: '₹28 Cr – ₹85 Cr (3.2m SSMMS Medical Nonwoven Line + Air-Jet Smart Weaving)',
      landSqFt: '30,000 – 95,000 sq. ft.',
      powerGridKva: '1,000 – 3,200 kVA',
      cleanroomClass: 'ISO 8 Controlled Hygiene Zone (for Medical/Surgical Nonwoven Converting)',
      waterLpd: '40,000 Litres (Closed-loop ZLD finishing & plasma pre-treatment)',
      workingCapitalMonths: 4,
    },
    machineryList: [
      {
        name: '3.2m SSMMS Spunbond-Meltblown Nonwoven Extrusion Line',
        purpose: 'Produces 5-layer SMS/SSMMS medical barrier fabrics (10–80 GSM) with sub-micron meltblown filtration web.',
        estCostInr: '₹12 Cr – ₹28 Cr',
        recommendedBrands: ['Reifenhäuser Reicofil (Germany)', 'Oerlikon Neumag', 'Jwell Machinery'],
      },
      {
        name: 'High-Speed Electronic Rapier / Air-Jet Technical Loom',
        purpose: 'Precision weaving of high-tenacity aramid, glass, polyester, and silver-coated conductive yarns without yarn break.',
        estCostInr: '₹2.8 Cr – ₹5.5 Cr',
        recommendedBrands: ['Picanol (Belgium)', 'Dornier (Germany)', 'Toyota Industries'],
      },
      {
        name: 'Atmospheric Plasma Surface Treatment & Antimicrobial Coating Line',
        purpose: 'Applies fluorocarbon-free hydrophobic, flame-retardant (FR), or antimicrobial coatings with minimal water discharge.',
        estCostInr: '₹2.2 Cr – ₹4.5 Cr',
        recommendedBrands: ['Brückner Textile Technologies (Germany)', 'Monforts', 'Ahlbrandt'],
      },
      {
        name: 'Automated Ultrasonic Surgical Gown & Filter Converting Line',
        purpose: 'Automated slitting, ultrasonic seam welding (zero needle-hole penetration), and EO-sterile pouching.',
        estCostInr: '₹1.1 Cr – ₹2.4 Cr',
        recommendedBrands: ['Herrmann Ultraschall', 'Telsonic', 'Zünd Cutting'],
      },
      {
        name: 'Textile Hydrostatic Head, BFE & Tensile Testing Lab',
        purpose: 'Tests bacterial filtration efficiency (BFE >99%), hydrostatic blood penetration (AAMI Level 4), and ASTM tear strength.',
        estCostInr: '₹55 Lakhs – ₹1.2 Cr',
        recommendedBrands: ['James Heal (UK)', 'SDL Atlas', 'SITRA Instrumentation'],
      },
    ],
    executionRoadmap: [
      {
        phase: 'Phase 1',
        title: 'Textile Park Selection, NTTM/PLI Filing & ZLD Civil Works',
        durationWeeks: 'Weeks 1–10',
        tasks: [
          'Secure plug-and-play industrial shed inside PM MITRA Textile Park or Surat/Tiruppur technical zone',
          'File application under PLI Textiles (Part 1/Part 2) and NTTM indigenous machinery/R&D grants',
          'Construct dust-free hygienic slab and closed-loop ZLD effluent recycling utility',
        ],
        deliverable: 'Approved textile park allotment and PLI/NTTM eligibility sign-off.',
      },
      {
        phase: 'Phase 2',
        title: 'Extrusion / Weaving & Coating Line Commissioning',
        durationWeeks: 'Weeks 11–26',
        tasks: [
          'Erect SSMMS nonwoven extrusion tower or battery of Picanol/Dornier technical rapier looms',
          'Install electrostatic electret charging unit for high-efficiency N95/HEPA filtration media',
          'Commission plasma hydrophobic & flame-retardant stenter coating range',
        ],
        deliverable: 'Continuous web uniformity within ±2% GSM tolerance.',
      },
      {
        phase: 'Phase 3',
        title: 'OEKO-TEX, EN 13795 & ASTM Technical Certification',
        durationWeeks: 'Weeks 27–36',
        tasks: [
          'Run SITRA / Hohenstein lab validations for OEKO-TEX Standard 100 and REACH SVHC compliance',
          'Certify EN 13795 / AAMI PB70 Level 3–4 liquid barrier performance for hospital buyers',
        ],
        deliverable: 'Certified technical datasheet portfolio ready for EU/US hospital & industrial audits.',
      },
      {
        phase: 'Phase 4',
        title: 'Export Buyer Audits & Automated Converting Scale-Up',
        durationWeeks: 'Weeks 37–46',
        tasks: [
          'Pass buyer SMETA/ISO 13485 facility audits and onboard global healthcare/automotive distributors',
          'Claim RoSCTL / RoDTEP duty remissions across US, EU, and UAE export shipments',
        ],
        deliverable: 'Full 3-shift commercial operation exporting 400+ tonnes/month.',
      },
    ],
    rawMaterialsAndSupplyChain: {
      materials: [
        'High-MFI Polypropylene Homopolymer Meltblown Resins (1500 MFI)',
        'High-Tenacity Polyester, Nylon 6,6 & Para-Aramid Filament Yarns',
        'Silver-Plated Conductive Yarns & Piezoresistive Smart Sensor Threads',
        'PFAS-Free Hydrophobic Fluoropolymer Alternatives & Silver-Ion Antimicrobials',
        'Medical Sterilization Tyvek / Blister Films',
      ],
      primarySources: ['Reliance Industries (Surat)', 'Indorama Ventures', 'Teijin Aramid', 'BASF Textile Chemicals'],
      indianIndustrialClusters: [
        'Surat Technical Textiles & MMF Cluster (Gujarat)',
        'Tiruppur Knitwear & Medical Apparel Hub (Tamil Nadu)',
        'Coimbatore SITRA Technical Textile Cluster (Tamil Nadu)',
        'Bhiwandi / Tarapur Industrial Weaving Hub (Maharashtra)',
      ],
    },
    certificationsAndCompliance: {
      mandatory: [
        'OEKO-TEX Standard 100 (Class I & II)',
        'EN 13795 / AAMI PB70 (Medical Barrier Textiles)',
        'ISO 9001 & ISO 13485 (Medical Grade Converting)',
        'BIS IS 16546 / IS 17423 (Technical Nonwovens)',
        'REACH & Zero Liquid Discharge (ZLD) Compliance',
      ],
      pollutionCategory: 'Orange',
      clearancesRequired: [
        'SPCB ZLD Consent for Coating/Dyeing',
        'CDSCO Class I/II Surgical Gown Registration (for Medical Lines)',
        'Factories Act & Boiler/Thermal Oil Heater Safety NOC',
      ],
    },
    governmentSchemes: [
      {
        schemeName: 'PLI Scheme for Textiles (MMF & Technical Textiles)',
        subsidyDetails: 'Up to 15% turnover-linked production incentive over 5 years on notified technical textile HSN codes.',
        eligibleBody: 'Ministry of Textiles, Govt. of India',
      },
      {
        schemeName: 'National Technical Textiles Mission (NTTM) & PM MITRA Parks',
        subsidyDetails: 'R&D grants, testing standardization support, and plug-and-play common steam/ZLD parks.',
        eligibleBody: 'Ministry of Textiles',
      },
    ],
    unitEconomics: {
      typicalGrossMargin: '30% – 46%',
      netMargin: '14% – 22%',
      paybackPeriodYears: '2.8 – 4.2 Years',
      breakEvenCapacityUtil: '50% Capacity Utilization',
    },
  },
  {
    slug: 'agro-food-coldchain-plant',
    title: 'Solar Cold-Chain & Value-Added Agro-Processing Equipment Plant',
    category: 'Agro-Processing & Cold Chain',
    tagline: 'Build off-grid solar cold rooms, phase-change thermal chillers, and vacuum freeze/heat-pump agro-dryers for Indian FPOs & global agri exports.',
    overview:
      'India loses over 15–20% of perishable horticulture produce post-harvest. This facility manufactures modular off-grid solar cold-storage rooms (5–20 MT), solar-DC BLDC refrigeration skids with Phase-Change Material (PCM) thermal batteries, and closed-loop heat-pump/vacuum agro-dehydrators compliant with NCCD, FSSAI, and APEDA export packhouse norms.',
    estimatorBaseCapExCrores: 15.0,
    pilotScaleOption: {
      budgetRangeInr: '₹5 Lakhs – ₹22 Lakhs',
      midpointLakhs: 14,
      batchSize: '5 – 25 Solar Cold-Room Skids / Agro-Dehydrator Units (Sheet-Metal Job-Work + PCM Skid)',
      bridgeModel:
        'Laser-cut SS-304 cabinets at Coimbatore or Nashik sheet-metal job-shops, source modular cam-lock PUF panels and solar-DC compressors, and run 72-hour crop pull-down & shelf-life trials at ICAR-CIPHET or NIFTEM before building a panel laminating line.',
      indianBridgePartners: [
        'Coimbatore SIDCO Agri-Machinery & Pump Cluster',
        'Nashik Agro-Export & Grape Packhouse Hub (Maharashtra)',
        'ICAR-CIPHET (Ludhiana) & NIFTEM (Kundli) Food Tech Pilots',
        'Rajkot Solar Compressor & Agricultural Fabrication Cluster',
      ],
      graduationGate:
        'NCCD thermal pull-down & 36-hour autonomy validation + PMFME / State Horticulture subsidy empanelment for ≥30 FPO units.',
    },
    linkedComplianceSlug: 'wpc-eta-lora-iot',
    linkedAssemblySlug: 'in865-lora-energy-meter-pcba',
    linkedTestbedSlug: 'thermotron-thermal-shock-chamber',
    linkedLabs: [
      { name: 'Coimbatore Hardware Prototyping Center', city: 'Coimbatore', href: '/labs' },
      { name: 'Pune Maker FabLab Node', city: 'Pune', href: '/labs' },
    ],
    exportHsCodes: [
      '8418.69 (Solar Off-Grid Cold Rooms & Blast Chillers)',
      '8419.31 (Solar Heat-Pump & Vacuum Agro-Food Dehydrators)',
    ],
    exportCorridors: [
      {
        corridorSlug: 'africa',
        marketLabel: 'East & West Africa (Off-Grid Farm Cold Rooms)',
        certifications: ['ISO 9001', 'IEC 60335-2-89', 'SONCAP / KEBS PVoC'],
        incentiveNote: 'Massive off-grid dairy, mango, tomato & fish preservation demand funded by World Bank / AfDB.',
      },
      {
        corridorSlug: 'uae-gcc',
        marketLabel: 'UAE & GCC (Food Security & Date/Spice Dehydration)',
        certifications: ['ESMA / G-Mark', 'FSSAI / HACCP Food-Contact SS-304'],
        incentiveNote: 'India-UAE CEPA 0% duty corridor serving UAE/Saudi food-park cold-chain infrastructure.',
      },
      {
        corridorSlug: 'asean',
        marketLabel: 'ASEAN (Tropical Fruit & Seafood Cold Chain)',
        certifications: ['CE Machinery Directive', 'ASEAN MRA Electrical Safety'],
        incentiveNote: 'Modular 5–10 MT solar reefers and spice/coffee heat-pump dryers across Vietnam & Indonesia.',
      },
    ],
    marketDemand: {
      tamGlobal: '$38 Billion',
      tamIndia: '₹24,000 Cr ($2.9B) by 2029',
      cagr: '18.9%',
      importDependencyPercent: 44,
      growthDrivers: [
        'PM Kisan Sampada Yojana (PMKSY) & PMFME granting 35%–50% capital subsidies to FPOs for farm-gate cold storage',
        'APEDA fresh horticulture & spice export boom demanding residue-free solar dehydration & pre-cooling packhouses',
        'Zero-diesel solar + PCM thermal storage replacing expensive grid/DG cold rooms across rural India & Africa',
      ],
    },
    capitalRequirements: {
      pilotCapEx: '₹2.4 Cr – ₹5.2 Cr (PUF Panel Press, SS-304 Food-Grade Fab & Solar Refrigeration Bay)',
      commercialCapEx: '₹14 Cr – ₹36 Cr (Continuous PUF Laminator, Fiber Laser/Press Brake & IoT Skid Line)',
      landSqFt: '15,000 – 48,000 sq. ft.',
      powerGridKva: '300 – 950 kVA (Plus 100kWp rooftop solar test yard)',
      workingCapitalMonths: 3,
    },
    machineryList: [
      {
        name: 'CNC Fiber Laser Cutter (4kW) & CNC Hydraulic Press Brake',
        purpose: 'Precision cutting and hygienic radius bending of food-grade SS-304 chambers, trays, and galvanized panel skins.',
        estCostInr: '₹1.1 Cr – ₹2.2 Cr',
        recommendedBrands: ['Bystronic (Switzerland)', 'TRUMPF', 'SLTL Sahajanand Laser (India)'],
      },
      {
        name: 'High-Pressure PUF Insulated Cold-Room Panel Laminating Press',
        purpose: 'Injects cyclopentane/HFO polyurethane foam (42 kg/m³ density) between cam-lock PPGI/SS skins for 80–150mm panels.',
        estCostInr: '₹1.4 Cr – ₹3.0 Cr',
        recommendedBrands: ['Cannon Afros (Italy)', 'Hennecke (Germany)', 'KraussMaffei'],
      },
      {
        name: 'Vacuum Brazing, Nitrogen Purge & Helium Leak-Detection Skid Bench',
        purpose: 'Assembles copper evaporator/condenser coils and solar-DC BLDC compressors with zero refrigerant micro-leaks.',
        estCostInr: '₹45 Lakhs – ₹95 Lakhs',
        recommendedBrands: ['Inficon Leak Detectors', 'Pfeiffer Vacuum', 'CPS Products'],
      },
      {
        name: 'Phase-Change Material (PCM) Thermal Bank Filling & Sealing Rig',
        purpose: 'Produces eutectic PCM thermal storage plates delivering 30–36 hours of sub-5°C cooling without batteries or grid power.',
        estCostInr: '₹35 Lakhs – ₹75 Lakhs',
        recommendedBrands: ['Pluss Advanced Technologies (India)', 'Axiom Thermal', 'Custom Vacuum Sealer'],
      },
      {
        name: 'Psychrometric Pull-Down Calorimeter & IoT Telemetry Calibration Yard',
        purpose: 'Validates 45°C ambient pull-down speed, relative humidity stability (85–95% RH), and LoRaWAN/4G temperature logging.',
        estCostInr: '₹40 Lakhs – ₹85 Lakhs',
        recommendedBrands: ['Blue Star Industrial Rigs', 'Testo Instruments', 'Sensitech Calibration'],
      },
    ],
    executionRoadmap: [
      {
        phase: 'Phase 1',
        title: 'Crop Thermal Modeling, NCCD Alignment & Fabrication Setup',
        durationWeeks: 'Weeks 1–8',
        tasks: [
          'Standardize 5 MT, 10 MT, and 20 MT solar cold-room SKUs aligned with NCCD technical standards',
          'Commission CNC fiber laser, TIG hygienic welding bay, and sheet-metal powder coating',
          'Qualify eutectic PCM thermal storage packs (-2°C to +8°C phase points) and MPPT solar charge controllers',
        ],
        deliverable: 'Fabrication workshop operational with prototype refrigeration skids.',
      },
      {
        phase: 'Phase 2',
        title: 'PUF Panel Press & Refrigeration Brazing Line Integration',
        durationWeeks: 'Weeks 9–20',
        tasks: [
          'Install high-pressure cyclopentane PUF foaming press with cam-lock perimeter jigs',
          'Set up automated vacuum evacuation (<250 microns) and digital refrigerant charging stations (R290/R404A)',
          'Integrate LoRaWAN / NB-IoT remote temperature, door-open, and compressor predictive diagnostics PCBA',
        ],
        deliverable: 'Integrated panel and refrigeration skid assembly line producing 15 units/month.',
      },
      {
        phase: 'Phase 3',
        title: 'ICAR-CIPHET Thermal Testing & MoFPI / PMFME Empanelment',
        durationWeeks: 'Weeks 21–30',
        tasks: [
          'Complete 72-hour extreme ambient (45°C) thermal holdover and humidity tests at ICAR-CIPHET or NABL labs',
          'Certify food-contact SS-304 compliance (FSSAI / HACCP) for solar heat-pump & freeze dryers',
          'Acquire state horticulture & PMFME / PMKSY machinery vendor empanelment',
        ],
        deliverable: 'Certified Indian FPO subsidy-eligible product catalog.',
      },
      {
        phase: 'Phase 4',
        title: 'FPO Network Rollout & Africa / GCC Solar Exports',
        durationWeeks: 'Weeks 31–40',
        tasks: [
          'Deploy turnkey container-sized cold rooms to Nashik, Himachal, and Coimbatore FPO clusters',
          'Ship flat-pack PUF + solar skid kits to East Africa, UAE, and ASEAN agri-export cooperatives',
        ],
        deliverable: 'Commercial serial production at 50+ cold rooms and agro-dryers/month.',
      },
    ],
    rawMaterialsAndSupplyChain: {
      materials: [
        'Food-Grade SS-304 Sheets & Pre-Painted Galvanized Iron (PPGI) Coils',
        'Polyol / Isocyanate PUF Foam Chemicals (Zero-ODP Cyclopentane Blowing)',
        'Solar-DC Brushless Compressors (48V/72V DC) & Copper Finned Coils',
        'Eutectic Phase-Change Material (PCM) Plates & Polypropylene Cases',
        '4G/LoRaWAN Cold-Chain IoT Telematics & Solar MPPT Controllers',
      ],
      primarySources: ['Jindal Stainless', 'Danfoss / Secop Compressors', 'Covestro / BASF Polyurethanes', 'Pluss Advanced Tech'],
      indianIndustrialClusters: [
        'Coimbatore Agro-Machinery & Pump Cluster (Tamil Nadu)',
        'Nashik Agro-Export & Cold-Chain Corridor (Maharashtra)',
        'Pune / Satara Food Processing Machinery Hub (Maharashtra)',
        'Rajkot Engineering & Solar Pump Cluster (Gujarat)',
      ],
    },
    certificationsAndCompliance: {
      mandatory: [
        'FSSAI Food-Contact SS-304 & HACCP Hygiene Compliance',
        'NCCD (National Centre for Cold-chain Development) Technical Standards',
        'APEDA Packhouse & Export Cold-Chain QA',
        'BIS IS 16590 / ASHRAE Thermal Insulation Compliance',
        'CE Machinery Directive & RoHS (Export Models)',
      ],
      pollutionCategory: 'Green',
      clearancesRequired: [
        'SPCB Non-ODS Cyclopentane Foam Storage Clearance',
        'Factory License & Fire NOC',
        'PESO Approval for Hydrocarbon Refrigerant (R290) Charging Zone',
      ],
    },
    governmentSchemes: [
      {
        schemeName: 'PM Kisan Sampada Yojana (PMKSY) & PLI Food Processing',
        subsidyDetails: '35%–50% capital grants for integrated cold-chain, pre-cooling, and agro-processing units.',
        eligibleBody: 'Ministry of Food Processing Industries (MoFPI)',
      },
      {
        schemeName: 'PM Formalisation of Micro Food Processing Enterprises (PMFME)',
        subsidyDetails: '35% credit-linked capital subsidy up to ₹10 Lakhs per micro unit and ₹3 Cr for FPO common infrastructure.',
        eligibleBody: 'MoFPI / State Nodal Agencies',
      },
    ],
    unitEconomics: {
      typicalGrossMargin: '30% – 42%',
      netMargin: '14% – 21%',
      paybackPeriodYears: '2.0 – 3.2 Years',
      breakEvenCapacityUtil: '40% Capacity Utilization',
    },
  },
];
