import type { LabNodeView } from '../types';

export const LAB_ATL_VELLORE: LabNodeView = {
  id: 'lab-atl-vellore-042',
  slug: 'atl-vellore-042',
  name: 'Atal Tinkering Lab Vellore #042',
  type: 'atl',
  institution: 'Government Higher Secondary School, Vellore',
  location: {
    city: 'Vellore',
    state: 'Tamil Nadu',
    pincode: '632001',
  },
  tools: [
    '3D Printers',
    'Oscilloscopes',
    'SMT Soldering',
    'Laser Cutters',
    'WebSerial HIL Rig',
  ],
  equipmentList: [
    { name: 'Ender 3 V3 Pro 3D Printer', model: 'Creality', count: 4, status: 'available' },
    { name: 'Digital Storage Oscilloscope 50MHz', model: 'Rigol DS1054Z', count: 2, status: 'available' },
    { name: 'Temperature Controlled Soldering Station', model: 'Hakko FX-888D', count: 6, status: 'available' },
    { name: 'CO2 Laser Engraver 40W', model: 'K40 Pro', count: 1, status: 'in-use' },
    { name: 'Wokwi/WebSerial Automated Test Rig', model: 'Hackerland BaaS v1', count: 1, status: 'available' },
  ],
  isVerified: true,
  contact: {
    name: 'S. Ranganathan',
    role: 'ATL In-Charge & Physics Faculty',
    email: 'atl.vellore042@hackerland.in',
  },
  benchServiceUrl: 'https://hackerland.in/api/labs/atl-vellore-042/telemetry',
};

export const LAB_IITM_CFI: LabNodeView = {
  id: 'lab-iitm-cfi',
  slug: 'iit-madras-cfi',
  name: 'Center for Innovation (CFI) — IIT Madras',
  type: 'college',
  institution: 'Indian Institute of Technology Madras',
  location: {
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600036',
  },
  tools: [
    '3D Printers',
    'CNC Milling',
    'Oscilloscopes',
    'SMT Soldering',
    'Laser Cutters',
    'WebSerial HIL Rig',
  ],
  equipmentList: [
    { name: 'Industrial SLA 3D Printer', model: 'Formlabs Form 3+', count: 2, status: 'available' },
    { name: '5-Axis Desktop CNC Mill', model: 'Pocket NC V2-50', count: 1, status: 'available' },
    { name: 'Mixed Signal Oscilloscope 200MHz', model: 'Keysight InfiniiVision', count: 4, status: 'available' },
    { name: 'Automated SMT Pick & Place', model: 'Neoden 4', count: 1, status: 'available' },
    { name: 'Dual-Channel Source Measure Unit', model: 'Keithley 2602B', count: 2, status: 'available' },
  ],
  isVerified: true,
  contact: {
    name: 'Dr. Anand T.',
    role: 'Faculty Advisor, CFI',
    email: 'cfi@iitm.ac.in',
  },
  benchServiceUrl: 'https://hackerland.in/api/labs/iit-madras-cfi/telemetry',
};

export const LAB_PUNE_FABLAB: LabNodeView = {
  id: 'lab-pune-maker',
  slug: 'pune-maker-fablab',
  name: 'Pune Maker FabLab Node',
  type: 'fablab',
  institution: 'Vigyan Ashram FabLab Network',
  location: {
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411004',
  },
  tools: [
    '3D Printers',
    'Laser Cutters',
    'CNC Milling',
    'SMT Soldering',
    'WebSerial HIL Rig',
  ],
  equipmentList: [
    { name: 'Large Format FDM 3D Printer', model: 'Voron 2.4 Custom', count: 3, status: 'available' },
    { name: 'Precision Fiber Laser Cutter', model: 'Raycus 30W', count: 1, status: 'available' },
    { name: 'PCB Milling Machine', model: 'Bantam Tools Desktop PCB', count: 2, status: 'available' },
    { name: 'Hot Air Rework Station', model: 'Quick 861DW', count: 4, status: 'available' },
  ],
  isVerified: true,
  contact: {
    name: 'Radhika Deshmukh',
    role: 'FabLab Director',
    email: 'radhika@punemaker.org',
  },
};

export const LAB_NITT_ROBOTICS: LabNodeView = {
  id: 'lab-nitt-robotics',
  slug: 'nit-trichy-robotics',
  name: 'NIT Trichy Autonomous Robotics Bench',
  type: 'college',
  institution: 'National Institute of Technology Tiruchirappalli',
  location: {
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    pincode: '620015',
  },
  tools: [
    '3D Printers',
    'Oscilloscopes',
    'SMT Soldering',
    'WebSerial HIL Rig',
  ],
  equipmentList: [
    { name: 'Prusa i3 MK4 Dual Extruder', model: 'Prusa Research', count: 4, status: 'available' },
    { name: 'Logic Analyzer 16-Channel 500MHz', model: 'Saleae Logic Pro 16', count: 3, status: 'available' },
    { name: 'ROS 2 Micro-ROS Hardware Rig', model: 'STM32 / ESP32-S3', count: 8, status: 'available' },
  ],
  isVerified: true,
  contact: {
    name: 'Prof. K. Sundar',
    role: 'Robotics Lab In-Charge',
    email: 'robotics@nitt.edu',
  },
};

export const LAB_COIMBATORE_MAKERS: LabNodeView = {
  id: 'lab-coimbatore-maker',
  slug: 'coimbatore-maker-space',
  name: 'Coimbatore Hardware Prototyping Center',
  type: 'fablab',
  institution: 'PSG College of Technology Innovation Hub',
  location: {
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    pincode: '641004',
  },
  tools: [
    '3D Printers',
    'CNC Milling',
    'SMT Soldering',
    'Laser Cutters',
  ],
  equipmentList: [
    { name: 'Bambu Lab X1-Carbon Combo', model: 'Bambu Lab', count: 3, status: 'available' },
    { name: 'CNC Router 3-Axis', model: 'Genmitsu PROVerXL', count: 2, status: 'available' },
    { name: 'Thermal Imaging Camera', model: 'FLIR E4 WiFi', count: 1, status: 'available' },
  ],
  isVerified: true,
  contact: {
    name: 'K. Balakrishnan',
    role: 'Lab Manager',
    email: 'bala@coimbatoreprotolab.in',
  },
};

export const LAB_THUB_HYDERABAD: LabNodeView = {
  id: 'lab-thub-hardware',
  slug: 'thub-hardware-incubator',
  name: 'T-Hub Hardware Prototyping Node',
  type: 'incubator',
  institution: 'T-Hub Foundation Hyderabad',
  location: {
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
  },
  tools: [
    '3D Printers',
    'CNC Milling',
    'Oscilloscopes',
    'SMT Soldering',
    'Laser Cutters',
    'WebSerial HIL Rig',
  ],
  equipmentList: [
    { name: 'Industrial SLS 3D Printer', model: 'Sinterit Lisa Pro', count: 1, status: 'available' },
    { name: 'EMI/EMC Pre-Compliance Test Bench', model: 'Rohde & Schwarz', count: 1, status: 'available' },
    { name: 'High-Precision Pick & Place', model: 'SMT-PnP 2026', count: 1, status: 'available' },
  ],
  isVerified: true,
  contact: {
    name: 'Suresh Varma',
    role: 'VP DeepTech Infrastructure',
    email: 'deeptech@t-hub.co',
  },
};

export const ALL_LAB_NODES: LabNodeView[] = [
  LAB_ATL_VELLORE,
  LAB_IITM_CFI,
  LAB_PUNE_FABLAB,
  LAB_NITT_ROBOTICS,
  LAB_COIMBATORE_MAKERS,
  LAB_THUB_HYDERABAD,
];
