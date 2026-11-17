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
    id: 'hub-copilot',
    title: 'AI Hardware Co-Pilot & Component Sourcing Assistant',
    description:
      'Engineering calculators for IPC-2152 trace sizing, SMPS buck filter sizing, thermal heatsink resistance, BOM risk scrubber, and domestic Indian distributor pricing.',
    category: 'simulators',
    categoryLabel: 'AI Workbench',
    href: '/copilot',
    badge: 'AI Co-Pilot',
    badgeTone: 'accent',
    keywords: ['copilot', 'calculator', 'trace width', 'ipc 2152', 'buck converter', 'smps', 'heatsink', 'thermal', 'sourcing', 'bom', 'robu', 'element14', 'mcu', 'mosfet'],
  },
  {
    id: 'hub-telemetry',
    title: 'Digital Twin & Hardware Telemetry Stream Visualizer',
    description:
      'Real-time digital twin oscilloscope, 3D attitude gyro, AIS-156 16S BMS cell balancing, and live WebSerial physical hardware UART debugging.',
    category: 'simulators',
    categoryLabel: 'Digital Twin',
    href: '/telemetry',
    badge: 'Digital Twin',
    badgeTone: 'code',
    keywords: ['telemetry', 'digital twin', 'oscilloscope', 'bms', 'ais 156', 'attitude', 'gyro', 'drone', 'uav', 'cubesat', 'serial', 'webserial', 'csv', 'stream', 'can bus'],
  },
  {
    id: 'hub-firmware',
    title: 'Hardware Firmware Registry & WebSerial Flasher',
    description:
      'Verified, pre-compiled embedded binaries for drone flight controllers, EV BMS, indigenous RISC-V silicon, and edge TinyML with one-click browser WebSerial flashing.',
    category: 'simulators',
    categoryLabel: 'Firmware Hub',
    href: '/firmware',
    badge: 'WebSerial Flasher',
    badgeTone: 'accent',
    keywords: ['firmware', 'registry', 'bin', 'hex', 'uf2', 'flasher', 'webserial', 'esptool', 'ardupilot', 'zephyr', 'micropython', 'esp32', 'rp2040', 'stm32', 'riscv'],
  },
  {
    id: 'hub-compliance',
    title: 'Indian Hardware Statutory Compliance & NABL Lab Wizard',
    description:
      'Calculate BIS CRS, WPC ETA, TEC MTCTE, DGCA Type Certification, and AIS-156 statutory testing fees in ₹, sample requirements, and lead times from authorized Indian NABL laboratories.',
    category: 'simulators',
    categoryLabel: 'Compliance Hub',
    href: '/compliance',
    badge: 'NABL Labs',
    badgeTone: 'code',
    keywords: ['compliance', 'regulatory', 'bis', 'crs', 'isi', 'wpc', 'eta', 'tec', 'mtcte', 'dgca', 'drone rules', 'ais 156', 'nabl', 'sameer', 'arai', 'icat', 'ertl', 'testing lab', 'certification'],
  },
  {
    id: 'hub-testbeds',
    title: 'Remote Hardware-in-the-Loop Testbeds & High-CapEx Lab Benches',
    description:
      'Shared Keysight 20 GHz spectrum analyzers, Chroma 1000A regenerative battery cyclers, and semi-anechoic chambers with remote SCPI execution and student subsidies.',
    category: 'labs',
    categoryLabel: 'HIL Testbeds',
    href: '/testbeds',
    badge: 'Remote SCPI',
    badgeTone: 'accent',
    keywords: ['testbed', 'hil', 'scpi', 'pyvisa', 'keysight', 'spectrum analyzer', 'chroma', 'battery cycler', 'anechoic chamber', 'shaker table', 'iit madras', 'arai', 'nal'],
  },
  {
    id: 'hub-sprints',
    title: '48-Hour Hardware Sprints & Rapid Build Hackathons',
    description:
      'Time-boxed 48H rapid builds with milestone checkpoints (Hour 12 CAD, Hour 24 Schematic, Hour 36 Firmware, Hour 48 Video Demo), cash escrow disbursements, and free prototype lab perks.',
    category: 'bounties',
    categoryLabel: '48H Sprints',
    href: '/sprints',
    badge: '48H Build',
    badgeTone: 'earn',
    keywords: ['sprint', 'hackathon', '48h', 'hardware hackathon', 'bounty', 'cad milestone', 'firmware', 'kicad', 'demo video', 'csir', 'nal', 'arai', 'iit madras', 't-works'],
  },
  {
    id: 'hub-sourcing',
    title: 'Component Sourcing & Drop-In Alternates Recommender',
    description:
      'Pin-to-pin drop-in replacement finder for supply-constrained ICs (STM32, TI BMS, Semtech LoRa) with domestic Indian stock (Robu, Evelta, Element14) and landed tariff calculators.',
    category: 'labs',
    categoryLabel: 'Sourcing & ICs',
    href: '/sourcing',
    badge: 'Drop-In ICs',
    badgeTone: 'accent',
    keywords: ['sourcing', 'components', 'ic alternates', 'stm32', 'gigadevice', 'robu', 'evelta', 'element14', 'lcsc', 'mouser', 'customs duty', 'hsn 8542', 'drop-in', 'pin compatible'],
  },
  {
    id: 'hub-assembly',
    title: 'PCBA Assembly Line & SMT Stencil Visualizer',
    description:
      'Interactive 2D Pick-and-Place (PnP) centroid visualizer, feeder tape loading planner, solder stencil thickness optimizer, and turnkey assembly cost modeling across Indian EMS plants.',
    category: 'labs',
    categoryLabel: 'PCBA SMT',
    href: '/assembly',
    badge: 'SMT Centroids',
    badgeTone: 'accent',
    keywords: ['assembly', 'pcba', 'pnp', 'centroid', 'pick and place', 'smt', 'feeder', 'stencil', 'kaynes', 'syrma', 'dixon', 'centum', 'xray', 'aoi', 'turnkey'],
  },
  {
    id: 'hub-emc',
    title: 'EMI / EMC Radiation Pre-Scan Analyzer & Near-Field Probe Visualizer',
    description:
      'Conducted and radiated emissions spectrum analyzer evaluating CISPR 25 Class 5, CISPR 32, and MIL-STD limits with near-field PCB probe radiation heatmap diagnostics.',
    category: 'labs',
    categoryLabel: 'EMC Pre-Scan',
    href: '/emc',
    badge: 'EMC Pre-Scan',
    badgeTone: 'accent',
    keywords: ['emc', 'emi', 'cispr 25', 'cispr 32', 'near field', 'probe', 'sameer', 'arai', 'spectrum', 'conducted emissions', 'radiated emissions', 'choke', 'filter'],
  },
  {
    id: 'hub-rf-calc',
    title: 'RF Impedance & Transmission Line Synthesizer',
    description:
      'Synthesize 50Ω microstrip, grounded coplanar waveguide (GCPW), and 100Ω differential pairs on Rogers RO4350B, RT/duroid, and Isola 370HR with skin depth, conductor roughness loss, and Smith Chart conjugate matching.',
    category: 'labs',
    categoryLabel: 'RF & Microwave',
    href: '/rf-calc',
    badge: 'RF Waveguides',
    badgeTone: 'accent',
    keywords: ['rf', 'impedance', 'microstrip', 'gcpw', 'coplanar', 'stripline', 'smith chart', 'matching network', 'rogers', 'ro4350b', 'skin depth', 'loss tangent', 'navic', 'lora', '50 ohm'],
  },
  {
    id: 'hub-battery-eis',
    title: 'Battery State-of-Health (SoH) & EIS Analyzer',
    description:
      'Electrochemical Impedance Spectroscopy (EIS) analyzer for EV battery cells. Nyquist semicircles, Bode frequency sweeps, Randles Equivalent Circuit Models, and AIS-156 Amendment 3 lithium plating diagnostics.',
    category: 'labs',
    categoryLabel: 'Battery EIS',
    href: '/battery-eis',
    badge: 'SoH EIS',
    badgeTone: 'accent',
    keywords: ['battery', 'eis', 'nyquist', 'bode', 'soh', 'state of health', 'randles', 'ecm', 'lfp', 'nmc', 'sodium ion', 'lithium plating', 'ais 156', 'arai', 'icat', 'sei layer'],
  },
  {
    id: 'hub-thermal',
    title: 'Thermal Management & Computational Heat Sink Profiler',
    description:
      '1D lumped-parameter thermal resistance network (θ_jc, θ_cs, θ_sa) and convective fin efficiency calculator for SiC traction inverters, GaN microinverters, and edge computing enclosures.',
    category: 'labs',
    categoryLabel: 'Thermal Engineering',
    href: '/thermal',
    badge: 'Thermal R_θ',
    badgeTone: 'accent',
    keywords: ['thermal', 'heatsink', 'fin efficiency', 'convection', 'sic', 'gan', 'ptm7950', 'sil pad', 'junction temperature', 'theta jc', 'theta sa', 'heat transfer', 'arai'],
  },
  {
    id: 'hub-solar-mppt',
    title: 'Solar PV & MPPT Battery Charge Controller Simulator',
    description:
      'Single-diode photovoltaic IV & PV curves, MPPT algorithm convergence (Incremental Conductance, P&O, Global Sweep) and synchronous buck converter component sizing under Indian climatic extremes.',
    category: 'labs',
    categoryLabel: 'Solar Engineering',
    href: '/solar-mppt',
    badge: 'Solar MPPT',
    badgeTone: 'accent',
    keywords: ['solar', 'pv', 'mppt', 'photovoltaic', 'iv curve', 'pv curve', 'incremental conductance', 'perturb and observe', 'buck converter', 'pm kusum', 'nise', 'canal top', 'bifacial', 'ladakh', 'rajasthan', 'lfp'],
  },
  {
    id: 'hub-motor-foc',
    title: 'BLDC & PMSM Field-Oriented Control (FOC) Simulator',
    description:
      'Rotor-flux aligned Field-Oriented Control with Clarke/Park transforms, Space Vector PWM (SVPWM) 8-state switching hexagons, MTPA reluctance torque, and high-speed field weakening.',
    category: 'labs',
    categoryLabel: 'Motor Control',
    href: '/motor-foc',
    badge: 'Motor FOC',
    badgeTone: 'accent',
    keywords: ['foc', 'bldc', 'pmsm', 'motor', 'svpwm', 'space vector', 'clarke', 'park', 'inverter', 'ather', 'ola', 'euler', 'pm kusum', 'reluctance torque', 'field weakening', 'arai', 'icat'],
  },
  {
    id: 'hub-launchpad',
    title: 'Hardware Launchpad & Indian Govt Grant Matcher',
    description:
      'Milestone-locked crowdfunding escrow and automated non-dilutive grant eligibility matcher (iDEX, BIRAC BIG, DST NIDHI-PRAYAS, Semiconductor DLI) with backer quorum governance.',
    category: 'bounties',
    categoryLabel: 'Launchpad',
    href: '/launchpad',
    badge: 'Escrow & Grants',
    badgeTone: 'earn',
    keywords: ['launchpad', 'crowdfunding', 'escrow', 'grant', 'idex', 'birac', 'nidhi prayas', 'tide', 'semiconductor dli', 'funding', 'milestone', 'dpiit', 'kickstarter', 'hardware fund'],
  },
  {
    id: 'hub-jobs',
    title: 'Hardware & Deep-Tech Jobs & Fellowships Board',
    description:
      'Proof-of-work hiring for aerospace, robotics, EV power electronics, BMS firmware, RISC-V silicon, and defense hardware engineering with lab bench specs and skill matching.',
    category: 'bounties',
    categoryLabel: 'Jobs & Fellowships',
    href: '/jobs',
    badge: 'Proof-of-Work',
    badgeTone: 'earn',
    keywords: ['jobs', 'careers', 'hiring', 'fellowship', 'residency', 'hardware engineer', 'bms', 'firmware', 'robotics', 'riscv', 'avionics', 'sic', 'inverter', 'ather', 'ideaforge'],
  },
  {
    id: 'hub-teardowns',
    title: 'Hardware Teardowns & Reverse Engineering Library',
    description:
      'Chip-level autopsies, interactive PCB pinout hotspot annotator, and component-level Bill of Materials for Ather 450 BMS, DJI drones, and smart meters.',
    category: 'simulators',
    categoryLabel: 'Teardowns',
    href: '/teardowns',
    badge: 'Autopsies',
    badgeTone: 'accent',
    keywords: ['teardown', 'reverse engineering', 'autopsy', 'ather', 'dji', 'meter', 'bms', 'pinout', 'bom', 'silicon', 'schematic'],
  },
  {
    id: 'hub-teardowns-submit',
    title: 'Submit Hardware Teardown Studio (+150 XP)',
    description:
      'Reverse engineer commercial devices, annotate IC pins, calculate gross margins, document subsystems, and publish open-source alternatives.',
    category: 'projects',
    categoryLabel: 'Autopsy Studio',
    href: '/teardowns/submit',
    badge: '+150 XP',
    badgeTone: 'brand-pink',
    keywords: ['submit teardown', 'reverse engineer', 'annotator', 'bom margin', 'markup', 'autopsy studio'],
  },
  {
    id: 'hub-young-innovators',
    title: 'Young Innovators Track & Safety Sandbox (Ages 8–17)',
    description:
      'Supervised K-12 maker track with visual block-to-hardware coding, age-tiered hardware challenges, and DPDP-compliant educator mentorship.',
    category: 'roadmaps',
    categoryLabel: 'Junior Track',
    href: '/young-innovators',
    badge: 'Ages 8-17',
    badgeTone: 'code',
    keywords: ['young innovators', 'kids', 'k12', 'school', 'stem', 'microbit', 'pico', 'blockly', 'dpdp', 'atl', 'teen', 'junior'],
  },
  {
    id: 'hub-ip-defense',
    title: 'Open Invention Network & IP Defense Ledger',
    description:
      'Cryptographic prior-art timestamping for open hardware schematics, Gerber archives, and CAD models to invalidate predatory patent claims under USPTO § 102 & India § 29.',
    category: 'projects',
    categoryLabel: 'IP Defense',
    href: '/network/ip',
    badge: 'Prior Art',
    badgeTone: 'accent',
    keywords: ['ip', 'patent', 'prior art', 'defense ledger', 'uspto', 'inpass', 'schematic', 'troll', 'non-aggression', 'cern-ohl', 'timestamp', 'sha256'],
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
