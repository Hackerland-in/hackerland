export interface MachineryItem {
  name: string;
  purpose: string;
  estCostInr: string;
  recommendedBrands: string[];
}

export interface PlantBlueprint {
  slug: string;
  title: string;
  category: 'Semiconductors' | 'Composites' | 'Electronics' | 'Mobility & Vehicles' | 'Precision Engineering' | 'Clean Energy';
  tagline: string;
  overview: string;
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
];
