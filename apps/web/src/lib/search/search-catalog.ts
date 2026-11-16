export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  category:
    | 'projects'
    | 'simulators'
    | 'blueprints'
    | 'academy'
    | 'bounties'
    | 'labs'
    | 'roadmaps';
  categoryLabel: string;
  href: string;
  badge?: string;
  badgeTone?: 'accent' | 'make' | 'code' | 'earn' | 'neutral' | 'brand-pink';
  keywords?: string[];
}

export const STATIC_SEARCH_CATALOG: SearchResultItem[] = [
  // 1. Simulators & Virtual Studios
  {
    id: 'sim-physics-hub',
    title: 'Multibody Vehicle Physics Hub',
    description:
      '60 FPS Runge-Kutta 4th order real-time vehicle physics for cars, EV, drones, rockets, superbikes and bicycles.',
    category: 'simulators',
    categoryLabel: 'Simulator Suite',
    href: '/manufacturing/physics',
    badge: '60 FPS Physics',
    badgeTone: 'accent',
    keywords: ['physics', 'rk4', 'vehicle', 'mechanics', 'sim', 'aerodynamics'],
  },
  {
    id: 'sim-drone-physics',
    title: 'Autonomous Drone & Quadcopter 6-DoF Physics Simulator',
    description:
      'Quadcopter aerodynamics, motor thrust-to-weight, battery hover endurance, and PID controller tuning.',
    category: 'simulators',
    categoryLabel: 'Simulator',
    href: '/manufacturing/physics/drone',
    badge: 'Drone 6-DoF',
    badgeTone: 'accent',
    keywords: ['drone', 'quadcopter', 'uav', 'thrust', 'hover', 'motor', 'propeller'],
  },
  {
    id: 'sim-ev-powertrain',
    title: 'EV Powertrain & Battery Pack Dynamics Simulator',
    description:
      'Electric vehicle multi-body dynamics, battery cell discharge, regenerative braking, and ARAI range estimation.',
    category: 'simulators',
    categoryLabel: 'Simulator',
    href: '/manufacturing/physics/ev',
    badge: 'EV Dynamics',
    badgeTone: 'make',
    keywords: ['ev', 'electric vehicle', 'battery', 'bms', 'motor', 'torque', 'range', 'car'],
  },
  {
    id: 'sim-rocket-propulsion',
    title: 'Aerospace Rocket Launch & Supersonic Nozzle Engine',
    description:
      'De Laval supersonic convergent-divergent nozzle, chamber pressure, thrust curve, and orbital trajectory.',
    category: 'simulators',
    categoryLabel: 'Simulator',
    href: '/manufacturing/physics/rocket',
    badge: 'Rocketry',
    badgeTone: 'code',
    keywords: ['rocket', 'propulsion', 'nozzle', 'de laval', 'thrust', 'aerospace', 'space'],
  },
  {
    id: 'sim-car-dyno',
    title: 'Race Car Chassis & Dyno Mechanics Simulator',
    description:
      'Pacejka tire lateral friction curves, downforce aero, weight transfer, and gear ratio quarter-mile acceleration.',
    category: 'simulators',
    categoryLabel: 'Simulator',
    href: '/manufacturing/physics/car',
    badge: 'Automotive',
    badgeTone: 'make',
    keywords: ['car', 'automotive', 'race', 'dyno', 'tire', 'pacejka', 'gearbox', 'engine'],
  },
  {
    id: 'sim-motorbike-leaning',
    title: 'Superbike Leaning & Fork Suspension Dynamics',
    description:
      'Motorcycle roll-lean geometry, trail, inverted fork damping, and cornering balance.',
    category: 'simulators',
    categoryLabel: 'Simulator',
    href: '/manufacturing/physics/motorbike',
    badge: 'Motorbike',
    badgeTone: 'neutral',
    keywords: ['motorbike', 'bike', 'motorcycle', 'superbike', 'leaning', 'suspension'],
  },
  {
    id: 'sim-bicycle-dynamics',
    title: 'Bicycle & E-Bike Dynamics Engine',
    description:
      'Pedal cadence, human wattage, rolling resistance, hill gradient, and chain gear ratios.',
    category: 'simulators',
    categoryLabel: 'Simulator',
    href: '/manufacturing/physics/bicycle',
    badge: 'Micromobility',
    badgeTone: 'neutral',
    keywords: ['bicycle', 'ebike', 'pedal', 'cadence', 'cycling', 'gradient', 'watts'],
  },
  {
    id: 'studio-eda-silicon',
    title: 'Open-Source EDA Silicon Studio (KiCad & OpenROAD)',
    description:
      'Automated RTL-to-GDSII VLSI ASIC flow, standard cells, Magic DRC, and KLayout die viewer.',
    category: 'simulators',
    categoryLabel: 'EDA Studio',
    href: '/manufacturing/eda',
    badge: 'ASIC / GDSII',
    badgeTone: 'code',
    keywords: ['eda', 'kicad', 'openroad', 'gdsii', 'asic', 'vlsi', 'silicon', 'pcb'],
  },
  {
    id: 'studio-spice-solver',
    title: 'SPICE Hardware Nodal Solver & Oscilloscope',
    description:
      'True analog SPICE circuit engine with digital oscilloscope, DMM, component burnout, and AC/DC nodal simulation.',
    category: 'simulators',
    categoryLabel: 'SPICE Studio',
    href: '/manufacturing/spice',
    badge: 'Nodal SPICE',
    badgeTone: 'code',
    keywords: ['spice', 'analog', 'oscilloscope', 'circuit', 'volt', 'dmm', 'burnout'],
  },
  {
    id: 'studio-falstad-circuit',
    title: 'Falstad Interactive Electron Flow Circuit Engine',
    description:
      'Interactive visual schematic canvas with moving electron particles, RLC filters, logic gates, and netlist editor.',
    category: 'simulators',
    categoryLabel: 'Circuit Lab',
    href: '/manufacturing/falstad',
    badge: 'Moving Electrons',
    badgeTone: 'accent',
    keywords: ['falstad', 'circuitjs', 'electron', 'schematic', 'resistor', 'capacitor'],
  },
  {
    id: 'studio-verilog-hdl',
    title: 'Digital Logic HDL Studio & GTKWave Waveform',
    description:
      'Cycle-accurate Verilog synthesis, digital timing diagram waveform viewer, and IEEE 1364 VCD output.',
    category: 'simulators',
    categoryLabel: 'HDL Studio',
    href: '/manufacturing/hdl',
    badge: 'Verilog & VCD',
    badgeTone: 'code',
    keywords: ['hdl', 'verilog', 'gtkwave', 'waveform', 'fpga', 'register', 'timing'],
  },
  {
    id: 'studio-riscv-iss',
    title: 'RISC-V 32-bit Instruction Set Simulator (ISS)',
    description:
      'Cycle-accurate RV32I microarchitecture execution with 32 integer registers, 5-stage pipeline, and RAM inspector.',
    category: 'simulators',
    categoryLabel: 'RISC-V ISS',
    href: '/manufacturing/iss',
    badge: 'RV32I Pipeline',
    badgeTone: 'code',
    keywords: ['riscv', 'iss', 'pipeline', 'rv32i', 'assembly', 'registers', 'cpu'],
  },
  {
    id: 'studio-esp32-bench',
    title: 'ESP-Labs Hardware Firmware & Serial Bench',
    description:
      'Virtual ESP32-S3 microcontroller, SSD1306 OLED display, NeoPixel WS2812B, and live UART serial terminal.',
    category: 'simulators',
    categoryLabel: 'Firmware Bench',
    href: '/manufacturing/bench',
    badge: 'ESP32 / OLED',
    badgeTone: 'accent',
    keywords: ['esp32', 'firmware', 'oled', 'uart', 'serial', 'microcontroller', 'arduino'],
  },
  {
    id: 'studio-circuito-wiring',
    title: 'Circuito Breadboard Wiring Engine',
    description:
      'Autonomous breadboard wiring, voltage level shifter injection, and Indian component distributor BOM pricing in ₹.',
    category: 'simulators',
    categoryLabel: 'Prototyping',
    href: '/manufacturing/circuito',
    badge: 'Breadboard BOM',
    badgeTone: 'neutral',
    keywords: ['circuito', 'breadboard', 'wiring', 'bom', 'components', 'pricing'],
  },
  {
    id: 'studio-factory-tooling',
    title: 'Factory Tooling Suite (6 Industrial Calculators)',
    description:
      'Injection molding clamp tonnage, sheet metal bend K-factor, battery spot welding, BLDC motor winding, and cleanroom HVAC.',
    category: 'simulators',
    categoryLabel: 'Industrial Tooling',
    href: '/manufacturing/tools',
    badge: '6 Calculators',
    badgeTone: 'make',
    keywords: ['injection', 'molding', 'sheet metal', 'k factor', 'spot weld', 'bldc', 'cleanroom', 'heatsink'],
  },

  // 2. Factory Blueprints
  {
    id: 'bp-pcb-plant',
    title: 'Multilayer PCB Fabrication & SMT Assembly Plant',
    description:
      'Step-by-step factory blueprint with ₹2.4 Cr CapEx, wet chemical etching, pick-and-place lines, and SPECS subsidies.',
    category: 'blueprints',
    categoryLabel: 'Factory Blueprint',
    href: '/how-to-start/pcb-plant',
    badge: 'CapEx ₹2.4 Cr',
    badgeTone: 'earn',
    keywords: ['pcb plant', 'smt', 'factory', 'pick and place', 'specs', 'cleanroom', 'make in india'],
  },
  {
    id: 'bp-drone-aerospace',
    title: 'Precision Drone & Aerospace Airframe Facility',
    description:
      'Factory setup with ₹3.5 Cr CapEx, carbon fiber routing, DGCA Type Certification, and Drone PLI Scheme subsidies.',
    category: 'blueprints',
    categoryLabel: 'Factory Blueprint',
    href: '/how-to-start/drone-aerospace',
    badge: 'CapEx ₹3.5 Cr',
    badgeTone: 'earn',
    keywords: ['drone plant', 'airframe', 'dgca', 'pli', 'defence', 'aerospace', 'uav'],
  },
  {
    id: 'bp-ev-battery',
    title: 'Electric Vehicle (EV) Battery Gigafactory & Pack Assembly',
    description:
      'Automated cylindrical/prismatic cell pack line with ₹4.8 Cr CapEx, Dry Room, laser welding, and AIS-156 certification.',
    category: 'blueprints',
    categoryLabel: 'Factory Blueprint',
    href: '/how-to-start/ev-battery-pack',
    badge: 'CapEx ₹4.8 Cr',
    badgeTone: 'earn',
    keywords: ['ev battery', 'gigafactory', 'pack assembly', 'ais-156', 'dry room', 'pli acc'],
  },
  {
    id: 'bp-semiconductor-fab',
    title: 'Semiconductor Wafer Fab & ATMP/OSAT Packaging Plant',
    description:
      'Class 100 sub-micron cleanroom, thermo-compression wire bonding, flip-chip BGA, and India Semiconductor Mission (ISM) 50% subsidy.',
    category: 'blueprints',
    categoryLabel: 'Factory Blueprint',
    href: '/how-to-start/fab-manufacturing',
    badge: 'CapEx ₹12 Cr (Pilot)',
    badgeTone: 'earn',
    keywords: ['semiconductor', 'fab', 'atmp', 'osat', 'ism', 'cleanroom', 'silicon wafer'],
  },
  {
    id: 'bp-carbon-fiber',
    title: 'Carbon Fiber & Advanced Composites Manufacturing Hub',
    description:
      'Autoclave pressure vessel curing up to 200°C, cleanroom prepreg layup, and AS9100 aerospace qualification.',
    category: 'blueprints',
    categoryLabel: 'Factory Blueprint',
    href: '/how-to-start/carbon-fiber-hub',
    badge: 'CapEx ₹6.5 Cr',
    badgeTone: 'earn',
    keywords: ['carbon fiber', 'autoclave', 'composites', 'prepreg', 'as9100', 'aerospace'],
  },
  {
    id: 'bp-cycle-plant',
    title: 'Complete Bicycle & E-Bike Manufacturing Plant',
    description:
      'Precision tube welding jigs, electrostatic conveyorized powder coating line, robotic wheel building, and BIS certification.',
    category: 'blueprints',
    categoryLabel: 'Factory Blueprint',
    href: '/how-to-start/cycle-manufacturing',
    badge: 'CapEx ₹1.8 Cr',
    badgeTone: 'earn',
    keywords: ['bicycle plant', 'ebike', 'wheel building', 'welding', 'powder coating', 'bis'],
  },
  {
    id: 'bp-precision-parts',
    title: 'Precision Mechanical Parts Manufacturing (5-Axis CNC)',
    description:
      '5-Axis CNC machining centers, swiss turn lathes, wire-cut EDM, and CMM inspection with CLCSS subsidies.',
    category: 'blueprints',
    categoryLabel: 'Factory Blueprint',
    href: '/how-to-start/precision-mechanical-parts',
    badge: 'CapEx ₹2.9 Cr',
    badgeTone: 'earn',
    keywords: ['cnc', 'machining', '5-axis', 'mechanical parts', 'lathe', 'edm', 'iatf 16949'],
  },
  {
    id: 'bp-mobile-parts',
    title: 'Mobile Phone Parts & Module Assembly Plant',
    description:
      'High-speed 0201 SMT lines, camera module active optical alignment, and PLI Large Scale Electronics incentive.',
    category: 'blueprints',
    categoryLabel: 'Factory Blueprint',
    href: '/how-to-start/mobile-parts',
    badge: 'CapEx ₹5.2 Cr',
    badgeTone: 'earn',
    keywords: ['mobile plant', 'phone parts', 'smt', 'camera module', 'cleanroom', 'pli'],
  },

  // 3. Founder Academy & Entrepreneurship
  {
    id: 'academy-hub',
    title: 'Founder Academy & Startup Masterclasses',
    description:
      '100% free courses and curriculum from Stanford, Y Combinator, MIT Disciplined Entrepreneurship, and Startup India.',
    category: 'academy',
    categoryLabel: 'Academy',
    href: '/entrepreneurship',
    badge: '100% Free',
    badgeTone: 'code',
    keywords: ['founder', 'startup', 'entrepreneurship', 'courses', 'stanford', 'yc', 'mit'],
  },
  {
    id: 'academy-stanford',
    title: 'Stanford CS183: How to Start a Startup',
    description:
      'Full lecture series by Sam Altman, Peter Thiel, Dustin Moskovitz, and Reid Hoffman on PMF, growth, and operations.',
    category: 'academy',
    categoryLabel: 'Course',
    href: '/entrepreneurship',
    badge: 'Stanford',
    badgeTone: 'code',
    keywords: ['stanford', 'cs183', 'sam altman', 'peter thiel', 'startup', 'pmf'],
  },
  {
    id: 'academy-yc',
    title: 'Y Combinator Startup School',
    description:
      'Core YC curriculum on talking to users, MVP building, pricing, sales, and surviving hard startup phases.',
    category: 'academy',
    categoryLabel: 'Course',
    href: '/entrepreneurship',
    badge: 'Y Combinator',
    badgeTone: 'make',
    keywords: ['yc', 'y combinator', 'startup school', 'paul graham', 'mvp', 'users'],
  },
  {
    id: 'academy-mit',
    title: 'MIT Disciplined Entrepreneurship (24 Steps)',
    description:
      'Bill Aulet step-by-step rigorous process from market segmentation and beachhead market to unit economics.',
    category: 'academy',
    categoryLabel: 'Course',
    href: '/entrepreneurship',
    badge: 'MIT',
    badgeTone: 'code',
    keywords: ['mit', 'disciplined entrepreneurship', 'bill aulet', 'beachhead', 'tam'],
  },
  {
    id: 'academy-cap-table',
    title: 'Interactive Cap Table & Equity Dilution Calculator',
    description:
      'Model founder equity, SAFE notes, pre/post-money seed rounds, ESOP option pools, and investor ownership.',
    category: 'academy',
    categoryLabel: 'Interactive Tool',
    href: '/entrepreneurship#calculator',
    badge: 'Cap Table Tool',
    badgeTone: 'earn',
    keywords: ['cap table', 'equity', 'safe note', 'dilution', 'esop', 'seed round', 'valuation'],
  },
  {
    id: 'academy-unit-economics',
    title: 'Unit Economics & Burn Runway Calculator',
    description:
      'Calculate Customer Acquisition Cost (CAC), Lifetime Value (LTV), gross margins, monthly burn rate, and runway in months.',
    category: 'academy',
    categoryLabel: 'Interactive Tool',
    href: '/entrepreneurship#calculator',
    badge: 'Runway Tool',
    badgeTone: 'earn',
    keywords: ['unit economics', 'cac', 'ltv', 'burn rate', 'runway', 'gross margin'],
  },

  // 4. Hubs & Ecosystem
  {
    id: 'hub-manufacturing',
    title: 'Advanced Manufacturing Hub (8 Disciplines)',
    description:
      'Pillars, interactive simulators, CAD testbenches, and factory blueprints for PCB, Drones, EV, Engines, and Mobile.',
    category: 'simulators',
    categoryLabel: 'Hardware Hub',
    href: '/manufacturing',
    badge: '8 Domains',
    badgeTone: 'accent',
    keywords: ['manufacturing', 'hardware', 'pcb', 'drone', 'ev', 'engine', 'mobile'],
  },
  {
    id: 'hub-clubs',
    title: 'Innovation Clubs & ATL Hub (Pan-India Tinkering Mesh)',
    description:
      'School Atal Tinkering Labs (ATLs), collegiate robotics clubs, and community FabLabs with shared equipment booking and intra-club build challenges.',
    category: 'labs',
    categoryLabel: 'ATL & Clubs',
    href: '/clubs',
    badge: 'ATL Mesh',
    badgeTone: 'accent',
    keywords: ['clubs', 'atl', 'tinkering', 'robotics club', 'equipment', '3d printer', 'cnc', 'k12', 'school', 'mentor', 'challenge', 'fablab'],
  },
  {
    id: 'hub-labs',
    title: 'Makerspaces, FabLabs & ATL Nodes Across India',
    description:
      'Find and book physical lab benches, 3D printers, CNC mills, oscilloscopes, and HIL testbenches across India.',
    category: 'labs',
    categoryLabel: 'Physical Labs',
    href: '/labs',
    badge: 'India Map',
    badgeTone: 'make',
    keywords: ['labs', 'makerspace', 'fablab', 'atl', '3d printer', 'cnc', 'scope', 'bangalore', 'pune'],
  },
  {
    id: 'hub-earn',
    title: 'Earn Track: Open Bounties & Builder Grants',
    description:
      'Get paid for solving engineering bounties, building prototypes, and completing verified challenges in ₹ and $.',
    category: 'bounties',
    categoryLabel: 'Bounties',
    href: '/earn',
    badge: 'Paid Bounties',
    badgeTone: 'earn',
    keywords: ['earn', 'bounties', 'bounty', 'grants', 'rewards', 'stipend', 'paid'],
  },
  {
    id: 'hub-learn',
    title: 'Learn by Doing: Open-Source Engineering Roadmaps',
    description:
      'Curated skill progression roadmaps for Embedded Systems, Autonomous Robotics, Full-Stack, and AI Engineering.',
    category: 'roadmaps',
    categoryLabel: 'Roadmaps',
    href: '/learn',
    badge: 'Skill Roadmaps',
    badgeTone: 'code',
    keywords: ['learn', 'roadmaps', 'skills', 'embedded', 'robotics', 'software', 'courses'],
  },
  {
    id: 'hub-innovators',
    title: 'Public Innovators & Builders Directory',
    description:
      'Explore public profiles of open-source hardware engineers, deep-tech researchers, makers, and squad leads.',
    category: 'projects',
    categoryLabel: 'Community',
    href: '/u',
    badge: 'Profiles',
    badgeTone: 'brand-pink',
    keywords: ['innovators', 'profiles', 'public profile', 'builders', 'makers', 'community', 'directory', 'people', 'users'],
  },
];
