export interface ManufacturingPillar {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  tagline: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'DeepTech';
  estTimeToPrototype: string;
  keyTools: string[];
  indianSuppliers: { name: string; url: string; specialty: string }[];
  certifications: string[];
  hotTopics: string[];
  popularSearches: string[];
  learningRoadmap: {
    stage: string;
    description: string;
    keyDeliverable: string;
  }[];
  labChallenge: {
    title: string;
    goal: string;
    prerequisites: string[];
    steps: { number: number; task: string; verification: string }[];
  };
}

export const MANUFACTURING_PILLARS: ManufacturingPillar[] = [
  {
    id: 'pcb',
    title: 'Printed Circuit Boards (PCB)',
    subtitle: 'From Multilayer Stackup to Pick-and-Place Reflow & ATMP Packaging',
    iconName: 'Cpu',
    tagline: 'Design, fabricate, and assemble 2 to 16-layer high-speed impedance-controlled boards.',
    difficulty: 'Intermediate',
    estTimeToPrototype: '3–5 Days',
    keyTools: ['KiCad 8', 'JLCPCB DFM Tools', 'Soldering Hot Air Station', 'USB Logic Analyzer', 'Reflow Oven'],
    indianSuppliers: [
      { name: 'LionCircuits (Bangalore)', url: 'https://lioncircuits.com', specialty: 'Fast-turn Indian PCB fab & SMT' },
      { name: 'Robu.in (Pune)', url: 'https://robu.in', specialty: 'Passive components, passives, dev boards' },
      { name: 'Evelta (Mumbai)', url: 'https://evelta.com', specialty: 'SMD reels, ICs, connectors, stencils' },
      { name: 'Mouser India', url: 'https://mouser.in', specialty: 'Automotive & aerospace grade silicon' },
    ],
    certifications: ['IPC-A-610 Class 3', 'RoHS 3 Compliance', 'UL 94V-0 Flammability', 'BIS CRS (Electronics)'],
    hotTopics: [
      'Controlled 50Ω single-ended & 100Ω differential trace routing',
      'Blind and buried microvias in HDI (High Density Interconnect)',
      'India Semiconductor Mission (ISM) ATMP packaging and silicon test nodes',
      'Thermal vias and copper pour heatsinking for high-power GaN FETs',
    ],
    popularSearches: [
      'How to calculate microstrip impedance in KiCad',
      'FR4 vs Rogers substrate high frequency loss tangent',
      'SMD stencil thickness for 0402 components',
      'Pick and place CPL centroid file format',
      'India domestic PCB fabrication turnaround time',
    ],
    learningRoadmap: [
      {
        stage: '1. Schematic & Netlist Design',
        description: 'Component selection, decoupling capacitor placement, and pinout definition.',
        keyDeliverable: 'ERC error-free electrical schematic with verified footprints.',
      },
      {
        stage: '2. High-Speed PCB Layout',
        description: 'Impedance-matched trace routing, 4-layer stackup (SIG-GND-PWR-SIG), and return paths.',
        keyDeliverable: 'Passes DRC rules (4mil trace/space, 0.2mm drill).',
      },
      {
        stage: '3. Stencil & Pick-and-Place Assembly',
        description: 'Solder paste deposition, pneumatic component placement, and thermal reflow curve.',
        keyDeliverable: 'Assembled PCB with zero solder bridges under microscope.',
      },
      {
        stage: '4. In-Circuit Test (ICT) & Bringup',
        description: 'Current limiting bench power supply check, 3.3V rail verification, and JTAG flashing.',
        keyDeliverable: 'Blinking LED firmware and UART telemetry output.',
      },
    ],
    labChallenge: {
      title: 'Lab 1: 50Ω Microstrip Impedance & Thermal Relief Calibration',
      goal: 'Calculate the required trace width for high-speed SPI / RF traces and tune copper ground fill isolation.',
      prerequisites: ['KiCad 8 installed', 'Understanding of dielectric constant (Er)'],
      steps: [
        { number: 1, task: 'Set dielectric constant to Er = 4.5 for standard FR-4 substrate.', verification: 'Substrate baseline verified.' },
        { number: 2, task: 'Adjust dielectric thickness (H) to 0.2mm and target 50Ω characteristic impedance.', verification: 'Calculated trace width W ≈ 0.38mm.' },
        { number: 3, task: 'Add thermal reliefs with 4 spokes on ground vias to prevent cold solder joints.', verification: 'DRC clearance confirmed at 6mil.' },
      ],
    },
  },
  {
    id: 'hardware',
    title: 'Hardware & Enclosures',
    subtitle: 'CNC Machining, Sheet Metal, Injection Molding & 3D Print Tooling',
    iconName: 'Wrench',
    tagline: 'Engineer rugged aerospace enclosures, IP68 waterproof housings, and production tooling.',
    difficulty: 'Intermediate',
    estTimeToPrototype: '2–4 Days',
    keyTools: ['FreeCAD', 'Autodesk Fusion', 'Bambu Lab X1-Carbon 3D Printer', 'CNC 3-Axis Mill', 'Dial Calipers'],
    indianSuppliers: [
      { name: 'Karkhana.io', url: 'https://karkhana.io', specialty: 'On-demand CNC milling, sheet metal, injection molding' },
      { name: 'Robu.in 3D Services', url: 'https://robu.in', specialty: 'Industrial SLS Nylon & Resin printing' },
      { name: 'Makify India', url: 'https://makify.in', specialty: 'Custom laser cutting and acrylic bending' },
    ],
    certifications: ['ISO 9001:2015', 'IP67 / IP68 Ingress Protection', 'MIL-STD-810H Shock & Vibe', 'RoHS'],
    hotTopics: [
      'Topology optimization for aerospace weight reduction',
      'Draft angles (1.5°–3°) and parting line design for injection molds',
      'Anodizing Type II vs Type III hardcoat for AL6061-T6',
      'FDM vs SLS Nylon (PA12) anisotropic tensile strength',
    ],
    popularSearches: [
      'Sheet metal K-factor and bend deduction formula',
      'IP68 O-ring groove depth and squeeze ratio calculation',
      'CNC feeds and speeds for aluminum 6061 in metric',
      'Heat-set brass threaded insert pull-out strength',
    ],
    learningRoadmap: [
      {
        stage: '1. Industrial CAD Modeling',
        description: 'Parametric solid modeling, clearance fits for electronics, and wall thickness uniformity.',
        keyDeliverable: 'STEP file ready for CAM machining.',
      },
      {
        stage: '2. Rapid Prototyping (FDM/SLS)',
        description: 'Verify ergonomics, snap-fits, and cable routing paths in physical form.',
        keyDeliverable: 'Functional 3D printed mechanical proof-of-concept.',
      },
      {
        stage: '3. DFM & Tooling Prep',
        description: 'Add draft angles, eliminate undercuts, and specify machining tolerances (ISO 2768-m).',
        keyDeliverable: 'Production drawings with GD&T annotations.',
      },
      {
        stage: '4. Finishing & Environmental Sealing',
        description: 'Bead blasting, hard anodizing, and silicone gasket compression testing.',
        keyDeliverable: 'IP67 validated enclosure under 1m water column test.',
      },
    ],
    labChallenge: {
      title: 'Lab 2: CNC Feed/Speed & O-Ring Compression Calculator',
      goal: 'Optimize spindle speed and feed rate for AL6061 milling and verify 25% elastomer gasket squeeze.',
      prerequisites: ['Basic trigonometry', 'Calipers measurement'],
      steps: [
        { number: 1, task: 'Input cutting speed Vc = 150 m/min for 6mm carbide end mill.', verification: 'Computed RPM ≈ 7,957 RPM.' },
        { number: 2, task: 'Set chip load fz = 0.04 mm/tooth with 2 flutes.', verification: 'Feed rate F ≈ 636 mm/min.' },
        { number: 3, task: 'Calculate O-ring gland depth for 2.0mm cross-section nitrile cord.', verification: 'Gland depth set to 1.5mm (25% squeeze).' },
      ],
    },
  },
  {
    id: 'drone',
    title: 'Autonomous Drone Systems',
    subtitle: 'Airframe Composites, BLDC Propulsion, PX4 Flight Avionics & DGCA Type Cert',
    iconName: 'Navigation',
    tagline: 'Fabricate carbon fiber quadcopters, VTOL gliders, and agricultural spray drones.',
    difficulty: 'Advanced',
    estTimeToPrototype: '1–2 Weeks',
    keyTools: ['QGroundControl', 'PX4 / ArduPilot', 'Carbon Fiber Vacuum Bagging Kit', 'Motor Thrust Stand', 'Blackbox Log Viewer'],
    indianSuppliers: [
      { name: 'Robu.in Drone Store', url: 'https://robu.in', specialty: 'T-Motor BLDC motors, ESCs, carbon fiber arms' },
      { name: 'Kavitsu Robotronix (Satara)', url: 'https://kavitsu.com', specialty: 'Custom high-torque drone gearboxes' },
      { name: 'Fabriverse Composites', url: 'https://fabriverse.in', specialty: 'Toray 3K carbon fiber sheets and tubes' },
    ],
    certifications: ['DGCA India Type Certification', 'NPNT (No Permission No Takeoff) Firmware', 'WPC ETA (2.4GHz/5.8GHz)', 'ISO 21384'],
    hotTopics: [
      'BVLOS (Beyond Visual Line of Sight) 4G/5G companion telemetry',
      'Custom VTOL tilt-rotor aerodynamic transition optimization',
      'Dual-GNSS RTK centimetre-level agricultural positioning',
      'Field-Oriented Control (FOC) ESC efficiency gains under heavy wind loads',
    ],
    popularSearches: [
      'Thrust to weight ratio calculation for quadcopter',
      'How to get DGCA Type Certification in India',
      'PX4 PID tuning using rate step response blackbox logs',
      'Propeller diameter and pitch selection for heavy lift',
    ],
    learningRoadmap: [
      {
        stage: '1. Aerodynamic Sizing & Propulsion',
        description: 'Match AUW (All-Up Weight) to motor Kv, prop diameter, and battery voltage.',
        keyDeliverable: 'Bench-tested 2:1 thrust-to-weight ratio profile.',
      },
      {
        stage: '2. Composite Airframe Layup',
        description: 'CNC cut 3K carbon plates, epoxy vacuum infusion, and vibration-damped motor mounts.',
        keyDeliverable: 'Rigid airframe weighing under 450g with arm rigidity.',
      },
      {
        stage: '3. Avionics & Telemetry Wiring',
        description: 'Integrate flight controller, redundant IMUs, opto-isolated ESCs, and GPS compass mast.',
        keyDeliverable: 'Low-noise power distribution with under 0.1G vibration RMS.',
      },
      {
        stage: '4. Flight Tuning & Failsafe Validation',
        description: 'Auto-tune rate PIDs, set geofence breach RTL, and run 30-minute endurance flight.',
        keyDeliverable: 'Stable hover with sub-5cm positional hold.',
      },
    ],
    labChallenge: {
      title: 'Lab 3: Quadcopter Thrust-to-Weight & Battery Endurance Simulator',
      goal: 'Balance payload weight, battery capacity, and motor thrust for a 25-minute survey mission.',
      prerequisites: ['Basic physics (F = ma)', 'Ohm’s law & Wh calculation'],
      steps: [
        { number: 1, task: 'Set Frame AUW to 1,600g with 4x 800g peak thrust motors.', verification: 'Thrust-to-weight ratio = 2.0:1 (optimal).' },
        { number: 2, task: 'Select 4S 5,000mAh LiPo battery (14.8V * 5Ah = 74Wh).', verification: 'Available energy = 74 Wh.' },
        { number: 3, task: 'Calculate average hover power (180W).', verification: 'Simulated endurance = 24.6 minutes.' },
      ],
    },
  },
  {
    id: 'car',
    title: 'Electric Vehicles & Automotive',
    subtitle: 'High-Voltage Battery Packs, BMS, Motor Inverters, CAN Bus & AIS-156 Standards',
    iconName: 'Car',
    tagline: 'Engineer electric cars, FSAE race prototypes, battery thermal cooling, and motor controllers.',
    difficulty: 'DeepTech',
    estTimeToPrototype: '3–6 Weeks',
    keyTools: ['CANalyzer / SavvyCAN', 'Spot Welder (Pneumatic)', 'Thermal Imaging Camera', 'SolidWorks CAD', 'Dyno Test Bench'],
    indianSuppliers: [
      { name: 'Cellforce / Exicom India', url: 'https://exicom.in', specialty: 'Automotive prismatic & cylindrical cells' },
      { name: 'Kalyani Powertrain', url: 'https://kalyani.com', specialty: 'Electric axles, PMSM drive motors' },
      { name: 'Shiva Analyticals', url: 'https://shivaanalyticals.com', specialty: 'AIS-156 battery nail-penetration testing' },
    ],
    certifications: ['ARAI AIS-156 Phase 2 (EV Batteries)', 'AIS-038 Rev 2 (Electrical Safety)', 'ISO 26262 ASIL-D', 'UN 38.3 Transport'],
    hotTopics: [
      'Immersion liquid cooling vs serpentine cold plates for 400V packs',
      'CAN bus 2.0B / CAN-FD message arbitration and spoofing defense',
      'LFP (Lithium Iron Phosphate) vs NMC thermal runaway containment',
      'Regenerative braking blended pedal feel and brake-by-wire failover',
    ],
    popularSearches: [
      'How to build 72V EV battery pack with BMS in India',
      'ARAI AIS 156 thermal runaway test guidelines',
      'CAN bus sniffing with ESP32 and SN65HVD230',
      'PMSM motor field oriented control inverter design',
    ],
    learningRoadmap: [
      {
        stage: '1. Chassis Spaceframe & Suspension',
        description: 'Tubular spaceframe FEA stress analysis, double wishbone geometry, and roll center calculation.',
        keyDeliverable: 'Torsional rigidity exceeding 1,200 Nm/degree.',
      },
      {
        stage: '2. High-Voltage Battery Pack Design',
        description: 'Nickel strip spot welding, cell level fusing, temperature thermistor matrix, and BMS.',
        keyDeliverable: '72V 100Ah pack with passive cell balancing under 5mV delta.',
      },
      {
        stage: '3. Powertrain & Inverter Calibration',
        description: 'FOC inverter parameter tuning, resolver angle calibration, and torque demand mapping.',
        keyDeliverable: 'Smooth 0–60 km/h acceleration curve without cogging torque.',
      },
      {
        stage: '4. CAN Bus Telemetry & Instrument Cluster',
        description: 'Broadcast vehicle speed, state of charge (SoC), and fault codes over CAN-FD network.',
        keyDeliverable: 'Real-time dashboard displaying cell min/max temps.',
      },
    ],
    labChallenge: {
      title: 'Lab 4: EV Battery Pack Range & C-Rate Thermal Runaway Simulator',
      goal: 'Configure series/parallel cell arrangement and compute WLTP range vs peak temperature rise.',
      prerequisites: ['Knowledge of 21700 cell specs (3.6V nominal, 4.8Ah)'],
      steps: [
        { number: 1, task: 'Configure 20S 10P pack (72V nominal, 48Ah capacity = 3.45 kWh).', verification: 'Pack total capacity = 3,456 Wh.' },
        { number: 2, task: 'Simulate city consumption of 35 Wh/km.', verification: 'Estimated realistic range = 98.7 km.' },
        { number: 3, task: 'Apply 3C rapid discharge pulse for 30 seconds.', verification: 'Monitored cell temperature rise within safe limit (< 48°C).' },
      ],
    },
  },
  {
    id: 'bike',
    title: 'Electric Two-Wheelers & Smart Bikes',
    subtitle: 'Chassis Jig Welding, Hub vs Mid-Drive Powertrains & Regenerative Dyno',
    iconName: 'Bike',
    tagline: 'Build next-generation electric scooters, high-torque cargo e-bikes, and smart mobility IoT.',
    difficulty: 'Intermediate',
    estTimeToPrototype: '1–3 Weeks',
    keyTools: ['TIG Welding Torch', 'Tube Notcher', 'Torque Wrench', 'Battery Load Bank', 'Oscilloscope'],
    indianSuppliers: [
      { name: 'Lucid Powertrain (Chennai)', url: 'https://lucidpowertrain.com', specialty: 'Mid-drive e-bike motors & torque sensors' },
      { name: 'Ampere / Greaves Electric', url: 'https://ampere.greaveselectricmobility.com', specialty: 'BLDC hub motors & controllers' },
      { name: 'Sona Comstar', url: 'https://sonacomstar.com', specialty: 'Electric bike gear reducers & differentials' },
    ],
    certifications: ['ARAI CMVVR Rule 126 Exemption (< 250W, < 25 km/h)', 'AIS-004 Electromagnetic Compatibility', 'IP67 Ingress'],
    hotTopics: [
      'Bilateral torque sensing pedals for natural motor assist feeling',
      'Removable battery dock thermal locking mechanisms against street theft',
      'Indian road pothole durability: Finite element fatigue analysis on fork crowns',
      'Bluetooth BLE and 4G IoT telematics with geofencing & remote immobilizer',
    ],
    popularSearches: [
      'BLDC hub motor vs mid-drive climbing steep hills',
      '48V lithium battery pack sizing for 60km range',
      'ARAI rules for electric cycle 250W exemption',
      'DIY electric motorcycle conversion kit India',
    ],
    learningRoadmap: [
      {
        stage: '1. Frame Geometry & Ergonomics',
        description: 'Head tube angle (71°), chainstay length, and battery down-tube packaging in CAD.',
        keyDeliverable: 'Frame jig fixture blueprints.',
      },
      {
        stage: '2. TIG Welding & Heat Treatment',
        description: 'Miter chromoly or aluminum tubes, Argon purge welding, and alignment check.',
        keyDeliverable: 'Welded frame with less than 1.5mm wheel track deviation.',
      },
      {
        stage: '3. Motor Drive & Sine Wave Controller',
        description: 'Integrate 48V FOC sine-wave controller, Hall sensor timing, and e-brake cutoff switches.',
        keyDeliverable: 'Whisper-quiet acceleration from standstill.',
      },
      {
        stage: '4. Road Testing & Gradient Benchmark',
        description: 'Test hill climbing on 12-degree slope, emergency braking distance, and range validation.',
        keyDeliverable: 'Certified 55km range per full charge cycle.',
      },
    ],
    labChallenge: {
      title: 'Lab 5: E-Bike Hill Climb Gradient & Torque Dyno Simulator',
      goal: 'Calculate required motor torque to climb a 15% Indian flyover incline with 90kg rider.',
      prerequisites: ['Newtonian mechanics ($F_{gravity} = m \cdot g \cdot \sin(\theta)$)'],
      steps: [
        { number: 1, task: 'Set total vehicle mass to 110 kg (90kg rider + 20kg bike).', verification: 'Total weight = 1,079 N.' },
        { number: 2, task: 'Set gradient to 12% incline (6.84 degrees).', verification: 'Gravity climbing force = 128.5 N.' },
        { number: 3, task: 'Calculate wheel torque on 26-inch wheel (R = 0.33m).', verification: 'Required motor torque = 42.4 Nm.' },
      ],
    },
  },
  {
    id: 'engine',
    title: 'Engines & Advanced Propulsion',
    subtitle: 'Combustion Cylinders, 3D Printed Inconel Micro-Turbines & Cryogenic Rocket Nozzles',
    iconName: 'Flame',
    tagline: 'Manufacture micro gas-turbines, UAV heavy-fuel engines, and regenerative liquid rocket thrust chambers.',
    difficulty: 'DeepTech',
    estTimeToPrototype: '4–8 Weeks',
    keyTools: ['Precision CNC Lathe', 'Surface Grinder', 'Optical Pyrometer', 'High-Pressure Hydrostatic Rig', 'CFD OpenFOAM'],
    indianSuppliers: [
      { name: 'Mishra Dhatu Nigam (MIDHANI)', url: 'https://midhani-india.in', specialty: 'Superalloys: Inconel 718, Titanium Ti-6Al-4V' },
      { name: 'L&T Aerospace (Coimbatore)', url: 'https://larsentoubro.com', specialty: 'Precision rocket motor casings and injector heads' },
      { name: 'Godrej Aerospace (Mumbai)', url: 'https://godrej.com', specialty: 'Liquid propulsion engine regenerative cooling tubes' },
    ],
    certifications: ['AS9100D Aerospace Quality', 'PESO (Petroleum and Explosives Safety Organisation)', 'ISO 14001'],
    hotTopics: [
      'Additive manufacturing (DMLS) of monolithic rocket engines with cooling channels',
      'Ceramic matrix composites (CMC) for turbine blade thermal barrier coatings',
      'Variable-area cavitating venturis for propellant flow metering',
      'Pintle injector combustion stability and acoustic damping',
    ],
    popularSearches: [
      'How to calculate rocket nozzle expansion ratio De Laval',
      'Inconel 718 3D printing parameters and heat treatment',
      'Gas turbine Brayton cycle thermal efficiency formula',
      'Regenerative cooling channel pressure drop rocket engine',
    ],
    learningRoadmap: [
      {
        stage: '1. Thermodynamic Cycle Calculation',
        description: 'CEA chemical equilibrium analysis, chamber pressure (Pc), and specific impulse (Isp) goals.',
        keyDeliverable: 'Theoretical Isp and thrust curve specifications.',
      },
      {
        stage: '2. CFD & Conjugate Heat Transfer (CHT)',
        description: 'Model supersonic boundary layers and coolant jacket heat flux (Bartz equation).',
        keyDeliverable: 'Wall temperature profile staying below superalloy melting point.',
      },
      {
        stage: '3. Precision DMLS Printing & Honing',
        description: 'Direct Metal Laser Sintering in Inconel 718, EDM wire cutting, and injector orifice EDM drilling.',
        keyDeliverable: 'Hot-fire ready monolithic thruster assembly.',
      },
      {
        stage: '4. Hydrostatic Proof & Hot-Fire Test',
        description: 'Proof pressure test to 1.5x operating pressure, followed by instrumented ignition on test stand.',
        keyDeliverable: 'Calibrated load cell thrust trace and chamber pressure stability.',
      },
    ],
    labChallenge: {
      title: 'Lab 6: De Laval Supersonic Nozzle & Thermodynamic Cycle Simulator',
      goal: 'Calculate throat diameter and expansion ratio for a 5 kN LOX/Ethanol rocket thruster.',
      prerequisites: ['Compressible gas dynamics', 'Isentropic expansion equations'],
      steps: [
        { number: 1, task: 'Set chamber pressure Pc = 25 bar and ambient pressure Pa = 1 bar.', verification: 'Pressure ratio Pc/Pa = 25.' },
        { number: 2, task: 'Compute optimal nozzle expansion ratio (Ae / At).', verification: 'Optimal expansion ratio = 4.82.' },
        { number: 3, task: 'Verify exit Mach number exceeds supersonic threshold.', verification: 'Mach number = 2.64.' },
      ],
    },
  },
  {
    id: 'mobile',
    title: 'Mobile Devices & Wearable Hardware',
    subtitle: 'SoC Packaging, Flexible AMOLED Lamination, RF Antennas & Cleanroom SMT',
    iconName: 'Smartphone',
    tagline: 'Manufacture smartphones, cellular smartwatches, and ultra-compact wearable IoT nodes.',
    difficulty: 'DeepTech',
    estTimeToPrototype: '2–4 Weeks',
    keyTools: ['Cleanroom Class 1000 Hood', 'Hot Bar ACF Bonding Machine', 'Vector Network Analyzer (VNA)', 'X-Ray BGA Inspection'],
    indianSuppliers: [
      { name: 'Dixon Technologies (Noida)', url: 'https://dixoninfo.com', specialty: 'SMT mobile board manufacturing, box build' },
      { name: 'Tata Electronics (Hosur)', url: 'https://tataelectronics.com', specialty: 'Precision CNC smartphone enclosures and casing' },
      { name: 'Optiemus Infracom', url: 'https://optiemus.com', specialty: 'Telecom electronics and smart wearables assembly' },
    ],
    certifications: ['BIS CRS R-Number', 'WPC ETA (India Telecommunications)', 'SAR (Specific Absorption Rate < 1.6 W/kg)', 'CE / FCC Part 15'],
    hotTopics: [
      'Sub-6GHz and 5G mmWave antenna-in-package (AiP) routing',
      '01005 passives placement on 10-layer Any-Layer HDI microvia boards',
      'Ultrasonic welding of titanium wearable frames with water ingress barriers',
      'Thermal vapor chambers sub-0.4mm thickness for SoC heat dissipation',
    ],
    popularSearches: [
      'How smartphones are assembled in Indian cleanroom factories',
      'ACF conductive film bonding for flexible display cables',
      'SAR radiation testing requirements for BIS in India',
      'Any-layer HDI PCB stackup manufacturer tolerances',
    ],
    learningRoadmap: [
      {
        stage: '1. Ultra-Dense HDI Schematic & Layout',
        description: 'Micro-BGA 0.35mm pitch fanout, differential MIPI display lines, and impedance matched antenna feedlines.',
        keyDeliverable: '10-layer HDI Gerber with blind/buried microvias.',
      },
      {
        stage: '2. High-Precision SMT & X-Ray Inspection',
        description: 'Zero-voiding solder paste, 01005 component pick-and-place, and 3D X-ray BGA void analysis.',
        keyDeliverable: 'Zero short-circuits under 400-pin processor BGA.',
      },
      {
        stage: '3. Display & Sensor Optical Bonding',
        description: 'LOCA / OCA optical clear adhesive lamination under vacuum to eliminate air bubbles.',
        keyDeliverable: 'Crystal clear sunlight-readable AMOLED assembly.',
      },
      {
        stage: '4. RF Chamber & SAR Calibration',
        description: 'Measure Total Radiated Power (TRP) and Total Isotropic Sensitivity (TIS) in anechoic chamber.',
        keyDeliverable: 'SAR rating compliant with Indian DoT standard (< 1.6 W/kg).',
      },
    ],
    labChallenge: {
      title: 'Lab 7: 5G RF Link Budget & SoC Thermal Throttling Simulator',
      goal: 'Model RF path loss over 500m distance and simulate vapor chamber thermal equilibrium.',
      prerequisites: ['Friis transmission equation', 'Fourier heat conduction'],
      steps: [
        { number: 1, task: 'Set transmit power to +23 dBm at 3.5 GHz (5G band n78).', verification: 'Transmitter output verified.' },
        { number: 2, task: 'Calculate free space path loss (FSPL) at 500m distance.', verification: 'Path loss = 97.3 dB.' },
        { number: 3, task: 'Verify receiver sensitivity threshold (-105 dBm).', verification: 'Link margin = +14.2 dB (strong connection).' },
      ],
    },
  },
  {
    id: 'future-tech',
    title: 'Future Tech & Frontiers',
    subtitle: 'Solid-State Sodium Batteries, Neuromorphic TPUs, Silicon Photonics & Humanoid Actuators',
    iconName: 'Sparkles',
    tagline: 'Build next-decade hardware: sodium energy storage, photonic circuits, and humanoid robotics.',
    difficulty: 'DeepTech',
    estTimeToPrototype: '4–12 Weeks',
    keyTools: ['Argon Glovebox (< 0.1ppm O2/H2O)', 'Optical Spectrum Analyzer', 'Laser Vibrometer', 'Semiconductor Parameter Analyzer'],
    indianSuppliers: [
      { name: 'ARCI (Hyderabad)', url: 'https://arci.res.in', specialty: 'Advanced materials, solid-state battery electrolytes' },
      { name: 'SCL (Semiconductor Complex Chandigarh)', url: 'https://scl.gov.in', specialty: '180nm CMOS silicon foundry and MEMS fab' },
      { name: 'CeNSE (IISc Bangalore)', url: 'https://cense.iisc.ac.in', specialty: 'Nanofabrication, silicon photonics, cleanroom access' },
    ],
    certifications: ['AEC-Q100 (Automotive Silicon)', 'ISO 14644-1 Cleanroom Class 100', 'NASA TRL 6+ Space Qualified'],
    hotTopics: [
      'Sodium-ion batteries utilizing abundant domestic Indian salt and iron phosphate',
      'Silicon photonics wave-guides transmitting 800 Gbps optical data at sub-1pJ/bit',
      'Quasi-direct drive (QDD) planetary vs cycloidal gearboxes for humanoid bipedal robots',
      'Radiation-hardened GaN power converters for Deep Space and LEO satellites',
    ],
    popularSearches: [
      'Sodium-ion vs lithium-ion battery manufacturing cost per kWh',
      'How to build cycloidal drive actuator for robotics with 3D printer',
      'Silicon photonics transceiver packaging wirebond vs flip chip',
      'Memristor crossbar array fabrication for AI edge compute',
    ],
    learningRoadmap: [
      {
        stage: '1. Materials Synthesis & Nano-Characterization',
        description: 'Sol-gel synthesis, XRD crystal diffraction, and SEM electron microscopy verification.',
        keyDeliverable: 'Pure phase electrolyte powders with zero micro-cracks.',
      },
      {
        stage: '2. Cleanroom Photolithography & Etch',
        description: 'Spin coating, UV mask alignment, and deep reactive-ion etching (DRIE) for waveguides.',
        keyDeliverable: 'Low-loss optical waveguides with under 0.2 dB/cm loss.',
      },
      {
        stage: '3. Prototype Packaging in Inert Atmosphere',
        description: 'Assemble cells or photonic dies inside Argon glovebox with sub-0.1ppm moisture.',
        keyDeliverable: 'Hermetically sealed prototype with zero dendrite formation.',
      },
      {
        stage: '4. Accelerated Lifetime & Cycle Stress',
        description: '1,000 charge/discharge cycles at 1C, thermal cycling from -20°C to +85°C.',
        keyDeliverable: 'Over 85% capacity retention across 1,000 cycles.',
      },
    ],
    labChallenge: {
      title: 'Lab 8: Solid-State Sodium Battery vs Lithium Density Simulator',
      goal: 'Compare volumetric and gravimetric energy density of sodium vs NMC cells for Indian grid storage.',
      prerequisites: ['Electrochemistry basics', 'Specific capacity calculations'],
      steps: [
        { number: 1, task: 'Set Sodium-ion cell gravimetric density to 160 Wh/kg.', verification: 'Sodium baseline established.' },
        { number: 2, task: 'Compare raw material bill: Sodium ($40/kWh) vs Lithium ($110/kWh).', verification: 'Raw material savings = 63.6%.' },
        { number: 3, task: 'Simulate 10kWh home solar storage pack weight and volume.', verification: 'Pack weight = 62.5 kg with zero fire risk.' },
      ],
    },
  },
];

export const MANUFACTURING_LIFECYCLE_STAGES = [
  {
    step: 1,
    title: 'CAD / EDA & Architecture',
    summary: 'Design 3D solids in FreeCAD/SolidWorks and schematics/stackups in KiCad.',
    standards: 'IPC-2221, ISO 1101 GD&T',
    typicalTools: 'KiCad 8, FreeCAD, Fusion 360, OpenSCAD',
  },
  {
    step: 2,
    title: 'Rapid Prototyping & ATL Lab Nodes',
    summary: 'Validate form, fit, and preliminary electrical behavior using local Atal Tinkering Labs.',
    standards: 'ISO 2768-m, IPC-A-600',
    typicalTools: 'Bambu Lab X1, SLA Resin, Milling Machines, Oscilloscopes',
  },
  {
    step: 3,
    title: 'DFM & Sourcing Optimization',
    summary: 'Scrutinize minimum trace clearance, drill aspect ratios, mold draft angles, and BOM costs.',
    standards: 'BOM Lifecycle Analysis, JLCPCB / PCBWay DFM rules',
    typicalTools: 'Hackerland Open-BOM Engine, Octopart, Robu.in API',
  },
  {
    step: 4,
    title: 'Pilot SMT & Precision Tooling',
    summary: 'Fabricate laser-cut stencils, pick-and-place setup, reflow profiles, and CNC jigs.',
    standards: 'IPC J-STD-001, RoHS 3',
    typicalTools: 'Desktop PnP, Reflow Oven, TIG Welder, Torque Dyno',
  },
  {
    step: 5,
    title: 'HIL Telemetry & Quality Control',
    summary: 'Subject assembled nodes to Hardware-in-the-Loop testbenches, thermal chambers, and vibration.',
    standards: 'MIL-STD-810H, IEC 60068 Environmental Testing',
    typicalTools: 'WebSerial Telemetry, Logic Analyzers, Thermal Imagers',
  },
  {
    step: 6,
    title: 'Statutory Testing & Certifications',
    summary: 'Obtain statutory compliance for consumer, aerospace, automotive, and medical deployment.',
    standards: 'BIS CRS, WPC ETA, DGCA Type Cert, ARAI AIS-156',
    typicalTools: 'Certified Anechoic Chamber, Blast Containment Bunkers',
  },
  {
    step: 7,
    title: 'Packaging, Scale & Market Entry',
    summary: 'Automate box build, ESD packaging, GeM portal listing, and Indian distributor rollout.',
    standards: 'GeM (Government e-Marketplace), ISO 9001, CE, FCC',
    typicalTools: 'Robotic Screwdriving, Barcode Traceability, EDI Integrations',
  },
];
