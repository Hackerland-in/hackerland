export type IndiaZoneId = 'north' | 'west' | 'south' | 'east' | 'northeast' | 'central';

export type BroadSectorCategory = 'manufacturing' | 'software_ai' | 'bio_agro_climate' | 'creative_craft_gi';

export interface PanIndiaSectorSpotlight {
  id: string;
  title: string;
  category: BroadSectorCategory;
  categoryLabel: string;
  tagline: string;
  indianHubs: string[];
  zones: IndiaZoneId[];
  zeroCostStarter: string;
  freePrototypingPath: string;
  fundingFit: string[];
  exportPotential: string;
  linkedRoute: string;
}

export interface IndiaRegionHub {
  zone: IndiaZoneId;
  zoneTitle: string;
  statesCovered: string;
  keyHubs: string;
  strengthSectors: string[];
  flagshipStateScheme: string;
  stateGrantAmount: string;
  freePrototypingLabs: string[];
  exportCorridorNote: string;
}

export interface IndiaFundingProgram {
  id: string;
  name: string;
  provider: string;
  type: 'free_grant' | 'subsidy_loan' | 'state_seed' | 'global_open_grant' | 'cloud_credits';
  typeLabel: string;
  amountRangeInr: string;
  equityTaken: string;
  whoCanApply: string;
  noCompanyNeeded: boolean;
  sectors: string[];
  zones: IndiaZoneId[] | ['all'];
  officialUrl: string;
  howToPrepare: string;
}

export interface FreePrototypingAccess {
  id: string;
  name: string;
  category: 'physical_lab_india' | 'software_cad_cloud' | 'fabrication_pilot';
  categoryLabel: string;
  cost: string;
  regions: string;
  toolsAvailable: string[];
  howYoungBuildersAccess: string;
  url: string;
  internalRoute?: string;
}

export interface FreeLearningAndToolResource {
  id: string;
  title: string;
  provider: string;
  category: 'vernacular_courses' | 'digital_public_infra' | 'standards_export' | 'open_templates';
  languages: string;
  cost: '100% Free';
  description: string;
  url: string;
  internalRoute?: string;
}

export const BROAD_SECTOR_SPOTLIGHTS: PanIndiaSectorSpotlight[] = [
  {
    id: 'semiconductors-electronics',
    title: 'Semiconductors, VLSI & Electronics PCB',
    category: 'manufacturing',
    categoryLabel: 'Manufacturing & Deep Tech',
    tagline: 'RTL/RISC-V chip design, 4-layer SMPS & embedded controllers, OSAT assembly',
    indianHubs: ['Bengaluru', 'Dholera', 'Sanand', 'Chennai', 'Noida', 'Hyderabad'],
    zones: ['south', 'west', 'north'],
    zeroCostStarter: 'OpenROAD SKY130 silicon sim & Wokwi ESP32/RISC-V simulator in browser',
    freePrototypingPath: 'Tiny Tapeout academic shuttle + LionCircuits/local ATL soldering bench',
    fundingFit: ['ISM DLI Scheme', 'MeitY TIDE 2.0', 'DST NIDHI-PRAYAS'],
    exportPotential: 'Industrial controllers, smart meters & fabless IP exported to US/EU ($4B+ global demand)',
    linkedRoute: '/sectors/semiconductors-electronics',
  },
  {
    id: 'ev-clean-energy',
    title: 'EV Powertrains, Batteries, Solar & Green H2',
    category: 'manufacturing',
    categoryLabel: 'Clean Energy & Mobility',
    tagline: 'LFP/Na-Ion battery packs, motor FOC controllers, solar microinverters & electrolyzers',
    indianHubs: ['Pune', 'Hosur', 'Chennai', 'Coimbatore', 'Vadodara', 'Rewa'],
    zones: ['west', 'south', 'central'],
    zeroCostStarter: 'Hackerland Motor FOC, CAN-FD Bus, Battery EIS & Solar MPPT web labs',
    freePrototypingPath: 'T-Works / ARAI Shared Dyno / I-STEM cell testing facilities',
    fundingFit: ['PLI ACC Battery', 'Startup India SISFS', 'CLCSS / PMEGP'],
    exportPotential: 'Tropical-tested 2W/3W controllers & off-grid solar BESS shipped to Africa, ASEAN & UAE',
    linkedRoute: '/sectors/ev-clean-energy',
  },
  {
    id: 'drones-defense-space',
    title: 'Drones, Aerospace, CubeSats & Defense Tech',
    category: 'manufacturing',
    categoryLabel: 'Aerospace & Defense',
    tagline: 'Agri-spraying UAVs, composite airframes, CubeSat RF & disaster rescue robotics',
    indianHubs: ['Hyderabad', 'Bengaluru', 'Nagpur', 'Kanpur', 'Thiruvananthapuram'],
    zones: ['south', 'west', 'north', 'central'],
    zeroCostStarter: '6-DOF Quadcopter physics lab + ArduPilot SITL + Rocket nozzle sim',
    freePrototypingPath: 'IN-SPACe payload testing + iDEX/IIT incubator flight cages',
    fundingFit: ['iDEX DISC (₹1.5 Cr)', 'IN-SPACe Seed Fund', 'DST NIDHI-PRAYAS'],
    exportPotential: 'Ruggedized surveying UAVs & payload subsystems via SCOMET cleared corridors',
    linkedRoute: '/sectors/drones-defense-space',
  },
  {
    id: 'ai-dpi-vernacular-software',
    title: 'Open AI, Voice Models & Digital Public Infrastructure',
    category: 'software_ai',
    categoryLabel: 'Software, AI & DPI',
    tagline: 'ONDC commerce plugins, Bhashini 22-language voice bots, edge tinyML & developer SaaS',
    indianHubs: ['Bengaluru', 'Hyderabad', 'Jaipur', 'Indore', 'Bhubaneswar', 'Kochi'],
    zones: ['south', 'north', 'east', 'central', 'west', 'northeast'],
    zeroCostStarter: 'Google Colab free GPU + Bhashini Open Speech APIs + ONDC Beckn sandbox',
    freePrototypingPath: 'GitHub Student Pack + Hugging Face Spaces + Cloud Credits',
    fundingFit: ['MeitY GENESIS / TIDE 2.0', 'State IT Seed Funds', 'NLnet / Mozilla Open Grants'],
    exportPotential: 'Global SaaS & multilingual voice infrastructure deployed across SE Asia, Africa & MENA',
    linkedRoute: '/learn?track=code',
  },
  {
    id: 'medtech-biotech-ayush',
    title: 'MedTech, Point-of-Care Diagnostics & BioTech',
    category: 'bio_agro_climate',
    categoryLabel: 'Health & Biotech',
    tagline: 'Affordable microfluidic diagnostics, assistive prosthetics, rural ECG & botanical formulations',
    indianHubs: ['Hyderabad', 'Visakhapatnam (AMTZ)', 'Bengaluru', 'Srinagar', 'Guwahati', 'Delhi NCR'],
    zones: ['south', 'north', 'northeast', 'east'],
    zeroCostStarter: 'Bio-sensor signal filtering + FreeCAD prosthetic modelling + Open Health specs',
    freePrototypingPath: 'BIRAC BioNEST incubators & AMTZ Kalam Convention MedTech shared labs',
    fundingFit: ['BIRAC BIG (₹50L)', 'ICMR MedTech', 'NIDHI-PRAYAS'],
    exportPotential: 'Frugal WHO/CE-IVDR & FDA-aligned diagnostics exporting across Global South & EU',
    linkedRoute: '/sectors/medtech-diagnostics',
  },
  {
    id: 'agro-food-coldchain',
    title: 'Agro-Processing, Solar Cold Chain & Rural Tech',
    category: 'bio_agro_climate',
    categoryLabel: 'AgriTech & Food Processing',
    tagline: 'Solar crop dryers, millet/spice sorting, IoT soil NPK probes & bamboo/horticulture value-add',
    indianHubs: ['Nashik', 'Coimbatore', 'Ludhiana', 'Guwahati', 'Patna', 'Raipur'],
    zones: ['west', 'south', 'north', 'northeast', 'east', 'central'],
    zeroCostStarter: 'FreeCAD hopper/blade CAD + Soil telemetry simulation + FSSAI online checklists',
    freePrototypingPath: 'ICAR KVKs, Vigyan Ashram (Pabal) & MoFPI regional food testing labs',
    fundingFit: ['MoFPI PMFME (35% subsidy)', 'NABARD RIDF', 'RKVY-RAFTAAR (₹25L)'],
    exportPotential: 'APEDA-certified dehydrated/processed foods & solar cold-storage skids to GCC/EU',
    linkedRoute: '/sectors/agro-food-coldchain',
  },
  {
    id: 'technical-textiles-apparel',
    title: 'Technical Textiles, Smart Apparel & Handloom Tech',
    category: 'manufacturing',
    categoryLabel: 'Textiles & Wearables',
    tagline: 'Automated warp/weft sensors, medical nonwovens, carbon-weave & sustainable natural dyes',
    indianHubs: ['Tiruppur', 'Surat', 'Bhilwara', 'Panipat', 'Sualkuchi (Assam)', 'Varanasi'],
    zones: ['south', 'west', 'north', 'northeast', 'east'],
    zeroCostStarter: 'ESP32 optical thread break detector firmware + textile costing calculator',
    freePrototypingPath: 'SITRA (Coimbatore), MANTRA (Surat) & IIHT Handloom Technology labs',
    fundingFit: ['NTTM National Technical Textiles Mission', 'PLI Textiles', 'PM MITRA Parks'],
    exportPotential: 'OEKO-TEX technical knitwear & sustainable handloom luxury exporting $35B+ globally',
    linkedRoute: '/sectors/technical-textiles-apparel',
  },
  {
    id: 'handicraft-gi-d2c-design',
    title: 'GI Crafts, Ceramic/Wood Toys, Bamboo & Creative Media',
    category: 'creative_craft_gi',
    categoryLabel: 'Craft, GI & Creative Economy',
    tagline: 'CNC+artisan bamboo furniture, Channapatna/Varanasi wooden toys, animation & industrial design',
    indianHubs: ['Channapatna', 'Moradabad', 'Jaipur', 'Kutch', 'Agartala (Tripura)', 'Jodhpur'],
    zones: ['south', 'north', 'west', 'northeast'],
    zeroCostStarter: 'Blender 3D product renders + laser-cut jig SVGs + BIS EN-71 toy safety checklists',
    freePrototypingPath: 'NID Craft Design Labs, Bamboo Technology Park (Guwahati) & District CFCs',
    fundingFit: ['PM Vishwakarma (₹3L + toolkit)', 'SFURTI Cluster Scheme', 'PMEGP'],
    exportPotential: 'Fair-trade certified furniture, toys, brass/terracotta craft & IP designs exported D2C worldwide',
    linkedRoute: '/export',
  },
  {
    id: 'robotics-cnc-precision',
    title: 'Precision CNC, Castings, Machine Tools & Robotics',
    category: 'manufacturing',
    categoryLabel: 'Precision Engineering',
    tagline: '5-axis medical/aero machining, warehouse AMRs, dies/molds & low-cost desktop CNC/3D printers',
    indianHubs: ['Rajkot', 'Coimbatore', 'Peenya (Bengaluru)', 'Ludhiana', 'Aurangabad', 'Jamshedpur'],
    zones: ['west', 'south', 'north', 'east'],
    zeroCostStarter: 'ROS2 Nav2 simulation + FreeCAD CAM G-code toolpaths + Tolerance calculator',
    freePrototypingPath: 'Central Tool Rooms (IGTR Ahmedabad, CTTC Bhubaneswar, CITD Hyderabad)',
    fundingFit: ['PMEGP Mfg (₹50L)', 'SIDBI Machinery Finance', 'SISFS'],
    exportPotential: 'ISO 9001 / IATF 16949 PPAP precision parts supplying US, German & Japanese OEMs',
    linkedRoute: '/sectors/robotics-cnc-automation',
  },
  {
    id: 'climate-water-circularity',
    title: 'Water Purification, E-Waste Recycling & Circular Climate',
    category: 'bio_agro_climate',
    categoryLabel: 'Climate & Circular Economy',
    tagline: 'Atmospheric water harvesters, ZLD membrane reactors, Li-ion black-mass recovery & bioplastics',
    indianHubs: ['Chennai', 'Mumbai', 'Kochi', 'Indore', 'Bhopal', 'Dehradun'],
    zones: ['south', 'west', 'central', 'north'],
    zeroCostStarter: 'Thermal condenser calculator + water quality telemetry scripts',
    freePrototypingPath: 'CSIR-NEERI, IIT waste-to-wealth labs & ATREE climate incubators',
    fundingFit: ['DST Clean Tech Mission', 'UNIDO / Global Climate Funds', 'EPR Recycling Credits'],
    exportPotential: 'Modular fluoride/arsenic filters & urban Li-ion recycling skids across Africa & Asia',
    linkedRoute: '/sectors/specialty-materials-chemicals',
  },
  {
    id: 'consumer-hardware-appliances',
    title: 'Consumer Hardware, Audio, IoT & BLDC Appliances',
    category: 'manufacturing',
    categoryLabel: 'Consumer Products',
    tagline: 'Super-efficient BLDC fans, smart security locks, open educational laptops & wearables',
    indianHubs: ['Noida', 'Sri City', 'Coimbatore', 'Pune', 'Kolkata'],
    zones: ['north', 'south', 'west', 'east'],
    zeroCostStarter: 'Interactive PCB Studio + RFQ Enclosure Estimator + BIS CRS guide',
    freePrototypingPath: 'FabLabs, Electronics Test & Development Centres (ETDC/STQC)',
    fundingFit: ['PLI White Goods', 'MeitY Hardware Startup', 'CGTMSE Collateral-Free'],
    exportPotential: 'UL/CE certified consumer gadgets & energy-star appliances scaling D2C globally',
    linkedRoute: '/sectors/consumer-hardware-appliances',
  },
  {
    id: 'rail-marine-heavy-infra',
    title: 'Rail Subsystems, Coastal Robotics & Modular Infra',
    category: 'manufacturing',
    categoryLabel: 'Infrastructure & Marine',
    tagline: 'Kavach telemetry, river/ocean ASV buoys, aquaculture automation & low-carbon precast tech',
    indianHubs: ['Kochi', 'Visakhapatnam', 'Kharagpur', 'Vadodara', 'Rourkela', 'Chennai'],
    zones: ['south', 'east', 'west'],
    zeroCostStarter: 'CAN/Modbus railway node simulator + buoyancy & wave telemetry sandbox',
    freePrototypingPath: 'NIOT Chennai, Cochin Shipyard Innovation Cell & IIT Kharagpur Makerspace',
    fundingFit: ['RDSO Railway Innovation Grant (₹1.5 Cr)', 'Sagarmala Innovation', 'ONGC Startup'],
    exportPotential: 'Harbor inspection ROVs, aquaculture sensors & rail wayside monitors exported globally',
    linkedRoute: '/sectors/rail-marine-heavy-infra',
  },
];

export const INDIA_REGION_HUBS: IndiaRegionHub[] = [
  {
    zone: 'north',
    zoneTitle: 'North India & Himalayan Belt',
    statesCovered: 'J&K, Ladakh, Himachal, Uttarakhand, Punjab, Haryana, Delhi NCR, UP, Rajasthan',
    keyHubs: 'Noida · Jaipur · Jodhpur · Ludhiana · Mohali · Kanpur · Srinagar · Leh',
    strengthSectors: [
      'Consumer Electronics EMS (Noida)',
      'Auto & Agri Machinery (Ludhiana / Manesar)',
      'Defense & Drones (Kanpur / Lucknow)',
      'Cold-Climate Solar, Saffron/AgTech & Wool Crafts (J&K / HP / Rajasthan)',
    ],
    flagshipStateScheme: 'Rajasthan iStart / UP StartInUP / JKEDI Seed & Sustenance Grant',
    stateGrantAmount: 'Up to ₹10L – ₹25L Seed + Sustenance Stipend',
    freePrototypingLabs: ['IIT Delhi FITT Maker Lab', 'IIT Kanpur SIIC Prototype Center', 'CSIR-IIIM Srinagar BioNEST'],
    exportCorridorNote: 'NCR Air Cargo & Dadri ICD Rail-Port dry link connecting to Europe, US & Middle East.',
  },
  {
    zone: 'west',
    zoneTitle: 'West India Manufacturing Powerhouse',
    statesCovered: 'Maharashtra, Gujarat, Goa, Daman & Diu',
    keyHubs: 'Pune · Surat · Rajkot · Sanand/Dholera · Ahmedabad · Nashik · Mumbai · Pabal',
    strengthSectors: [
      'EV Powertrains & Robotics (Pune / Chakan)',
      'Semiconductors & Technical Textiles / Diamonds (Dholera / Surat)',
      'Precision CNC, Castings & Agri-Pumps (Rajkot)',
      'Rural Appropriate Tech & Maker Incubation (Vigyan Ashram Pabal / Goa)',
    ],
    flagshipStateScheme: 'Gujarat SSIP 2.0 (Student Prototyping Grant!) & MSInS Maharashtra FinTech/Hardware Seed',
    stateGrantAmount: '₹2.5L SSIP Proof-of-Concept even for Individual Students',
    freePrototypingLabs: ['Vigyan Ashram FabLab (Pabal)', 'GUSEC & CIIE Ahmedabad', 'COEP Bhau Lab Pune', 'IGTR Tool Room'],
    exportCorridorNote: 'JNPT Nhava Sheva & Mundra Deep-Water Ports handle >65% of India containerized exports.',
  },
  {
    zone: 'south',
    zoneTitle: 'South India Deep-Tech & Factory Corridor',
    statesCovered: 'Karnataka, Tamil Nadu, Telangana, Andhra Pradesh, Kerala',
    keyHubs: 'Bengaluru · Chennai/Hosur · Coimbatore · Tiruppur · Hyderabad · Visakhapatnam · Kochi',
    strengthSectors: [
      'Fabless Silicon, Space, Biotech & AI (Bengaluru / Hyderabad)',
      'Automotive EVs, CNC & Technical Knitwear (Chennai / Coimbatore / Tiruppur)',
      'MedTech Manufacturing Zone (AMTZ Visakhapatnam)',
      'Marine Tech & Hardware FabLabs (Kochi Maker Village)',
    ],
    flagshipStateScheme: 'Karnataka ELEVATE (₹50L) · KSUM Idea Grant (₹12L Kerala) · TANSEED Tamil Nadu',
    stateGrantAmount: 'Up to ₹12L – ₹50L Non-Dilutive Grant',
    freePrototypingLabs: ['T-Works Hyderabad (Largest Prototyping Lab!)', 'KSUM Super FabLabs Kochi/Trivandrum', 'AMTZ MedTech'],
    exportCorridorNote: 'Chennai Port, Ennore, Cochin & Kempegowda BLR Air Cargo Freighter Corridor.',
  },
  {
    zone: 'east',
    zoneTitle: 'East India Industrial & Mineral Heartland',
    statesCovered: 'Odisha, West Bengal, Bihar, Jharkhand',
    keyHubs: 'Bhubaneswar · Kolkata · Kharagpur · Patna · Jamshedpur · Ranchi · Rourkela',
    strengthSectors: [
      'Heavy Alloys, EV Steel & Toolmaking (Jamshedpur / Rourkela)',
      'Aquaculture, Robotics & Rail Signalling (Kharagpur / Bhubaneswar)',
      'Frugal IoT, Handloom/Tussar Silk & Food Processing (Bihar / Bengal / Odisha)',
    ],
    flagshipStateScheme: 'Startup Odisha (₹20k/mo sustenance + ₹15L Need-Based) · Startup Bihar (₹10L Interest-Free)',
    stateGrantAmount: '₹10L – ₹15L + Monthly Founder Allowance',
    freePrototypingLabs: ['CTTC Central Tool Room Bhubaneswar', 'IIT Kharagpur AI/Robotics Tinkerers Lab', 'NIT Patna TBI'],
    exportCorridorNote: 'Paradip & Haldia Ports powering SE Asia (ASEAN) mineral, aquaculture & engineering exports.',
  },
  {
    zone: 'northeast',
    zoneTitle: 'North-East Bamboo, Bio-Resources & Border Hub',
    statesCovered: 'Assam, Meghalaya, Sikkim, Manipur, Tripura, Arunachal, Nagaland, Mizoram',
    keyHubs: 'Guwahati · Shillong · Gangtok · Imphal · Agartala · Dimapur',
    strengthSectors: [
      'Engineered Bamboo, Sustainable Housing & Composites (Tripura / Assam)',
      'Medicinal Spices, GI Orchids/Tea, Hydro & Food Tech (Sikkim / Meghalaya / Manipur)',
      'ERI / Muga Peace-Silk Technical Textiles & Cross-Border Software (Sualkuchi / Guwahati)',
    ],
    flagshipStateScheme: 'Assam StartUp MASI (₹50L Seed) + UNNATI North-East Industrial Incentive Scheme (2024)',
    stateGrantAmount: 'Up to 30–50% Capital Investment Subsidy under UNNATI!',
    freePrototypingLabs: ['IIT Guwahati TIC & FabLab', 'Guwahati Biotech Park', 'NECB Bamboo Technology Park'],
    exportCorridorNote: 'ASEAN BIMSTEC Land & Guwahati International Air Cargo Gateways to Singapore/Bangkok/Bhutan.',
  },
  {
    zone: 'central',
    zoneTitle: 'Central India Pharma, Agro & Logistics Spine',
    statesCovered: 'Madhya Pradesh, Chhattisgarh',
    keyHubs: 'Indore · Pithampur · Bhopal · Raipur · Bhilai · Gwalior',
    strengthSectors: [
      'Auto & EV Sub-assemblies & Pharma Formulations (Pithampur / Indore)',
      'Soy/Pulse Processing, Solar Pumps & Herbal Extracts (MP / Chhattisgarh)',
      'Industrial Automation & Drone Land Survey (Bhopal / Raipur)',
    ],
    flagshipStateScheme: 'MP Startup Policy Seed Assistance & Chhattisgarh Industrial Subsidy',
    stateGrantAmount: 'Up to ₹15L + 100% Patent & BIS Cost Reimbursement',
    freePrototypingLabs: ['IIT Indore CIPD Makerspace', '36INC Raipur', 'MANIT Bhopal TBI'],
    exportCorridorNote: 'Indore Pithampur Dry Port + Dedicated Freight Corridor access straight to Mumbai/Mundra.',
  },
];

export const INDIA_FUNDING_PROGRAMS: IndiaFundingProgram[] = [
  {
    id: 'dst-nidhi-prayas',
    name: 'DST NIDHI-PRAYAS Prototype Grant',
    provider: 'Dept. of Science & Technology + 40+ IIT/NIT PRAYAS Centres',
    type: 'free_grant',
    typeLabel: '0% Equity Grant',
    amountRangeInr: 'Up to ₹10 Lakhs',
    equityTaken: '0% (Pure Grant)',
    whoCanApply: 'Any individual Indian innovator aged 18+ (NO company registration needed initially)',
    noCompanyNeeded: true,
    sectors: ['All Hardware', 'Electronics', 'EV', 'Climate', 'AgriTech', 'MedTech'],
    zones: ['all'],
    officialUrl: 'https://www.nidhi-prayas.org/',
    howToPrepare: 'Bring a 1-page problem statement, preliminary CAD/circuit diagram, and ₹10L milestone budget to any PRAYAS incubator.',
  },
  {
    id: 'gujarat-ssip',
    name: 'SSIP Student Startup & Innovation Grant',
    provider: 'Government of Gujarat (Also replicated via state student cells)',
    type: 'state_seed',
    typeLabel: 'Student PoC Grant',
    amountRangeInr: '₹2.5 Lakhs per team',
    equityTaken: '0%',
    whoCanApply: 'School, ITI, Diploma & College students (team or solo)',
    noCompanyNeeded: true,
    sectors: ['All Sectors (Hardware, Software, Craft, Bio, Climate)'],
    zones: ['west'],
    officialUrl: 'https://www.ssipgujarat.in/',
    howToPrepare: 'Submit PoC prototype plan through your school/diploma college or nodal SSIP centre for ₹2.5L grant + patent filing.',
  },
  {
    id: 'startup-india-sisfs',
    name: 'Startup India Seed Fund Scheme (SISFS)',
    provider: 'DPIIT / Ministry of Commerce & Industry',
    type: 'free_grant',
    typeLabel: 'Grant + Convertible',
    amountRangeInr: '₹20L Grant + ₹50L Debt/Convertible',
    equityTaken: '0% on ₹20L Proof-of-Concept Grant',
    whoCanApply: 'DPIIT-recognized startup (<2 years old) via 200+ national incubators',
    noCompanyNeeded: false,
    sectors: ['All Sectors — Tech, Manufacturing, Social, EdTech, GreenTech'],
    zones: ['all'],
    officialUrl: 'https://seedfund.startupindia.gov.in/',
    howToPrepare: 'Validate working PoC on Hackerland, register on Startup India portal, and apply across 3 incubators simultaneously.',
  },
  {
    id: 'birac-big',
    name: 'BIRAC BIG (Biotechnology Ignition Grant)',
    provider: 'DBT / Government of India',
    type: 'free_grant',
    typeLabel: '0% Equity Grant',
    amountRangeInr: 'Up to ₹50 Lakhs (18 months)',
    equityTaken: '0%',
    whoCanApply: 'Individual researchers, PhDs, doctors, graduates, or young startups',
    noCompanyNeeded: true,
    sectors: ['MedTech', 'Diagnostics', 'Biotech', 'Agri-Bio', 'Water'],
    zones: ['all'],
    officialUrl: 'https://birac.nic.in/',
    howToPrepare: 'Include clear clinical unmet need, biological/sensor feasibility & IEC 60601 / CDSCO pathway.',
  },
  {
    id: 'idex-disc',
    name: 'iDEX DISC / ADITI (Defense & Dual-Use)',
    provider: 'Ministry of Defence (DIO)',
    type: 'free_grant',
    typeLabel: 'Grant + Co-Development',
    amountRangeInr: '₹1.5 Cr (up to ₹25 Cr ADITI)',
    equityTaken: '0%',
    whoCanApply: 'Startups, MSMEs & Individual Innovators solving defense challenges',
    noCompanyNeeded: true,
    sectors: ['Drones', 'Aerospace', 'Cybersecurity', 'Materials', 'RF/Optical', 'Marine'],
    zones: ['all'],
    officialUrl: 'https://idex.gov.in/',
    howToPrepare: 'Pick an active Problem Statement from Armed Forces / HAL / BEL on idex.gov.in.',
  },
  {
    id: 'pm-vishwakarma-pmegp',
    name: 'PM Vishwakarma & PMEGP Manufacturing Subsidy',
    provider: 'Ministry of MSME & KVIC',
    type: 'subsidy_loan',
    typeLabel: '15–35% Govt Subsidy',
    amountRangeInr: '₹3L Collateral-Free up to ₹50L Mfg',
    equityTaken: '0% (Subsidized Debt)',
    whoCanApply: 'Artisans, diploma machinists, workshop makers & rural micro-factories aged 18+',
    noCompanyNeeded: true,
    sectors: ['CNC/Tooling', 'Handloom/Craft', 'Agro-Processing', 'Wood/Bamboo', 'Electronics'],
    zones: ['all'],
    officialUrl: 'https://www.kviconline.gov.in/pmegpeportal/',
    howToPrepare: 'Prepare a 2-page Project Report (DPR) of machinery cost + working capital; rural category gets up to 35% subsidy.',
  },
  {
    id: 'meity-tide2',
    name: 'MeitY TIDE 2.0 (EiR & Grant)',
    provider: 'Ministry of Electronics & IT (48 Centres)',
    type: 'free_grant',
    typeLabel: '0% Equity Grant',
    amountRangeInr: '₹4L EiR to ₹7L Grant (+₹40L Scale)',
    equityTaken: '0%',
    whoCanApply: 'Students, solo hackers & early deep-tech teams',
    noCompanyNeeded: true,
    sectors: ['AI/ML', 'IoT', 'Blockchain/DPI', 'Robotics', 'Electronics', 'EdTech'],
    zones: ['all'],
    officialUrl: 'https://meitystartuphub.in/',
    howToPrepare: 'Apply under Entrepreneur-in-Residence (EiR) if you have only an idea + clickable prototype.',
  },
  {
    id: 'ksum-elevate-assam-odisha',
    name: 'State Idea Grants (KSUM / ELEVATE / Odisha / Assam UNNATI)',
    provider: 'Kerala KSUM · Karnataka · Startup Odisha · Assam StartUp',
    type: 'state_seed',
    typeLabel: 'State Non-Dilutive',
    amountRangeInr: '₹12L – ₹50L + ₹20k/mo Stipend',
    equityTaken: '0%',
    whoCanApply: 'Founders domiciled or incubating in respective state centers',
    noCompanyNeeded: false,
    sectors: ['All Sectors (Hardware, Software, Craft, Agro, Tourism Tech)'],
    zones: ['south', 'east', 'northeast'],
    officialUrl: 'https://startupmission.kerala.gov.in/',
    howToPrepare: 'Register on your state portal (KSUM, Mission Startup Karnataka, Startup Odisha, Assam Nest) — monthly stipends cover living expenses while prototyping!',
  },
  {
    id: 'msme-hackathon',
    name: 'MSME Innovative Idea Hackathon & Design Clinic',
    provider: 'Office of DC-MSME',
    type: 'free_grant',
    typeLabel: '0% Equity Grant',
    amountRangeInr: 'Up to ₹15 Lakhs per idea',
    equityTaken: '0%',
    whoCanApply: 'Students, MSMEs & individuals via Host Institutes (colleges/polytechnics)',
    noCompanyNeeded: true,
    sectors: ['Manufacturing', 'Green Tech', 'Handicrafts', 'Packaging', 'Robotics'],
    zones: ['all'],
    officialUrl: 'https://innovative.msme.gov.in/',
    howToPrepare: 'Submit through your nearby college TBI / MSME Host Institute during annual Hackathon call.',
  },
  {
    id: 'nlnet-global-open',
    name: 'Global Open-Source & Climate Grants (NLnet / Mozilla / Colab)',
    provider: 'NLnet Foundation · Mozilla Builders · Cloud Credits',
    type: 'global_open_grant',
    typeLabel: 'Global Micro-Grant',
    amountRangeInr: '€5,000 – €50,000 (₹4.5L – ₹45L)',
    equityTaken: '0% (Open Source Mandate)',
    whoCanApply: 'Anyone worldwide shipping open-source software, hardware, firmware or privacy tools',
    noCompanyNeeded: true,
    sectors: ['Open Hardware', 'RISC-V', 'Open AI', 'Digital Public Goods', 'Browser Tools'],
    zones: ['all'],
    officialUrl: 'https://nlnet.nl/propose/',
    howToPrepare: '1-page open technical proposal with public Git repo link & clear milestones. Zero company needed!',
  },
];

export const FREE_PROTOTYPING_ACCESS: FreePrototypingAccess[] = [
  {
    id: 'proto-atl',
    name: '10,000+ Atal Tinkering Labs (ATL)',
    category: 'physical_lab_india',
    categoryLabel: 'School & District Labs',
    cost: 'Free for Students',
    regions: 'Every District Across All 28 States & UTs',
    toolsAvailable: ['3D Printers', 'Arduino / Micro:bit', 'Soldering Stations', 'Sensor Kits', 'Oscilloscopes'],
    howYoungBuildersAccess: 'Ask any mentor at your school or nearest Govt/KV ATL lab during Community Day hours.',
    url: 'https://aim.gov.in/atl.php',
    internalRoute: '/clubs',
  },
  {
    id: 'proto-istem',
    name: 'I-STEM National Shared Scientific Lab Portal',
    category: 'physical_lab_india',
    categoryLabel: 'National Research Portal',
    cost: 'Free / Student Subsidized',
    regions: 'IITs, NITs, IISc, CSIR & Central Univ Labs Pan-India',
    toolsAvailable: ['SEM/TEM Microscopes', 'PCB Fabrication', 'Cleanrooms', 'CNC Centers', 'Anechoic EMI'],
    howYoungBuildersAccess: 'Create an account on istem.gov.in and reserve hourly equipment time near your city.',
    url: 'https://www.istem.gov.in/',
    internalRoute: '/testbeds',
  },
  {
    id: 'proto-tworks-fablab',
    name: 'T-Works, Kerala Super FabLab & Vigyan Ashram Pabal',
    category: 'physical_lab_india',
    categoryLabel: 'Mega Prototyping Centres',
    cost: '₹0 – ₹250/hr Material Only',
    regions: 'Hyderabad · Kochi/Trivandrum · Pabal (Rural Pune) · Guwahati',
    toolsAvailable: ['5-Axis CNC', 'Laser Cutters', 'Pick & Place SMT', 'Injection Molding', 'Waterjet'],
    howYoungBuildersAccess: 'Book orientation pass via lab website or find local Maker Hubs inside Hackerland Labs directory.',
    url: 'https://tworks.telangana.gov.in/',
    internalRoute: '/labs',
  },
  {
    id: 'proto-kicad-freecad',
    name: 'Open Hardware & CAD Stack (KiCad 8 · FreeCAD · Wokwi · Hackerland PCB)',
    category: 'software_cad_cloud',
    categoryLabel: 'Zero-Cost CAD / Sim',
    cost: '100% Free & Open Source',
    regions: 'Browser & Offline Desktop Pan-India',
    toolsAvailable: ['Multi-layer PCB Gerber', 'Parametric 3D STEP CAD', 'SPICE/Verilator', 'ESP32 Firmware Sim'],
    howYoungBuildersAccess: 'Launch Hackerland PCB Studio or SPICE directly in your browser without paying ₹1 Lakh/year CAD licenses.',
    url: 'https://www.kicad.org/',
    internalRoute: '/manufacturing/pcb',
  },
  {
    id: 'proto-ai-cloud',
    name: 'Open AI & Software Stack (Google Colab · Hugging Face · Penpot · GitHub)',
    category: 'software_cad_cloud',
    categoryLabel: 'Zero-Cost AI & App Dev',
    cost: '100% Free Tier',
    regions: 'Cloud / Browser Worldwide',
    toolsAvailable: ['Free T4 GPUs (Colab)', 'Open LLMs & Speech Models (Bhashini/HF)', 'Figma-class UI (Penpot)'],
    howYoungBuildersAccess: 'Verify student ID with GitHub Student Developer Pack for ₹8L+ worth of free cloud & domain credits.',
    url: 'https://education.github.com/pack',
  },
  {
    id: 'proto-small-batch-ems',
    name: 'Small-Batch Indian EMS & CNC Job Shops (5 to 100 Units)',
    category: 'fabrication_pilot',
    categoryLabel: 'Pilot Batch Bridging',
    cost: '₹5,000 – ₹1.5L Batch',
    regions: 'Bengaluru · Pune · Noida · Coimbatore · Rajkot',
    toolsAvailable: ['5-pc PCB Prototype (LionCircuits)', 'CNC Metal Turning (Karkhana.io)', 'Sheet Metal Bending'],
    howYoungBuildersAccess: 'Export Gerbers/STEP files and run Hackerland Instant RFQ Estimator before placing pilot orders.',
    url: '/manufacturing/rfq',
    internalRoute: '/manufacturing/rfq',
  },
];

export const FREE_RESOURCES_LIBRARY: FreeLearningAndToolResource[] = [
  {
    id: 'res-nptel',
    title: 'NPTEL / SWAYAM IIT & IISc Full Video Courses + Exam Certificates',
    provider: 'IIT Madras & Ministry of Education',
    category: 'vernacular_courses',
    languages: 'English + Subtitles in 10+ Indian Languages',
    cost: '100% Free',
    description: 'Zero-fee university courses in VLSI, Power Electronics, Robotics, Textile Processing, Food Engineering, AI & Manufacturing.',
    url: 'https://nptel.ac.in/',
    internalRoute: '/learn',
  },
  {
    id: 'res-spoken-tutorial',
    title: 'IIT Bombay Spoken Tutorial — 22 Indian Languages',
    provider: 'IIT Bombay (NMEICT Govt of India)',
    category: 'vernacular_courses',
    languages: 'Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, Odia, Malayalam, Kannada + more',
    cost: '100% Free',
    description: 'Hands-on step-by-step KiCad, Arduino, FreeCAD, Blender, Python & Linux video lessons in your mother tongue.',
    url: 'https://spoken-tutorial.org/',
    internalRoute: '/young-innovators',
  },
  {
    id: 'res-skill-india',
    title: 'Skill India Digital Hub (NSQF & ITI / Diploma Micro-Credentials)',
    provider: 'NSDC / MSDE Govt of India',
    category: 'vernacular_courses',
    languages: '12+ Regional Indian Languages',
    cost: '100% Free',
    description: 'Practical training for CNC operators, solar PV installers, EV technicians, SMT assemblers & handicraft exporters.',
    url: 'https://www.skillindiadigital.gov.in/',
    internalRoute: '/sectors',
  },
  {
    id: 'res-dpi-bhashini-ondc',
    title: 'India DPI Sandboxes: ONDC, Bhashini Voice AI & UPI Developer Docs',
    provider: 'MeitY / ONDC / NPCI Open Specifications',
    category: 'digital_public_infra',
    languages: 'English · 22 Scheduled Languages (Bhashini)',
    cost: '100% Free',
    description: 'Build voice commerce in regional languages, hyperlocal logistics plugins, and open fintech tools using IndiaStack APIs.',
    url: 'https://bhashini.gov.in/',
  },
  {
    id: 'res-niryat-dgft',
    title: 'DGFT NIRYAT Portal & Indian Trade Portal (HS Codes, Tariffs & FTA Lookup)',
    provider: 'Ministry of Commerce & Industry',
    category: 'standards_export',
    languages: 'English & Hindi',
    cost: '100% Free',
    description: 'Official free database of ITC-HS 8-digit codes, export RoDTEP rates, destination customs duties & FTA origin rules.',
    url: 'https://www.indiantradeportal.in/',
    internalRoute: '/export',
  },
  {
    id: 'res-bis-standards',
    title: 'BIS Care & Indian Standards e-Portal (Free Access to IS Specs)',
    provider: 'Bureau of Indian Standards',
    category: 'standards_export',
    languages: 'English & Hindi',
    cost: '100% Free',
    description: 'Free digital download of Indian Standards (IS) covering toys, safety electronics, food, textiles & EV batteries.',
    url: 'https://www.services.bis.gov.in/',
    internalRoute: '/compliance',
  },
  {
    id: 'res-open-templates',
    title: 'Startup India Legal Templates & Open Hardware Licenses',
    provider: 'Startup India / CERN-OHL / Hackerland Founders Hub',
    category: 'open_templates',
    languages: 'English',
    cost: '100% Free',
    description: 'Free NDA, Co-founder equity split, Commercial Invoice, Packing List, LUT filing & prior-art IP defense generators.',
    url: '/entrepreneurship',
    internalRoute: '/entrepreneurship',
  },
];
