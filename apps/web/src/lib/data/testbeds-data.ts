import type { TestbedFacility } from '@hackerland/core';

export const TESTBED_FACILITIES: TestbedFacility[] = [
  {
    id: 'tb_keysight_rf_mxa',
    slug: 'keysight-n9020b-rf-spectrum',
    name: 'Keysight N9020B MXA 20 GHz Signal & Spectrum Analyzer',
    model: 'N9020B-520',
    manufacturer: 'Keysight Technologies',
    category: 'rf_spectrum_analyzer',
    hostLab: {
      name: 'IIT Madras 5G Telecom Testbed',
      city: 'Chennai',
      state: 'Tamil Nadu',
      institution: 'IIT Madras Research Park',
      nablAccredited: true,
    },
    accessType: 'remote_scpi',
    specifications: {
      'Frequency Range': '10 Hz to 20.0 GHz',
      'Analysis Bandwidth': '160 MHz Real-Time',
      'Displayed Avg Noise Level (DANL)': '-172 dBm (with preamp)',
      'Phase Noise @ 1 GHz (10 kHz offset)': '-114 dBc/Hz',
      'Interfaces': 'Gigabit LAN (SCPI-RAW port 5025), USB-TMC, GPIB',
      'Demodulation': '5G NR, Wi-Fi 6E/7, Bluetooth 5.3, LoRa chirp',
    },
    hourlyRateInr: 1200,
    studentSubsidyRateInr: 450,
    safetyInductionRequired: false,
    activeQueueLength: 2,
    scriptRunner: {
      scriptType: 'pyvisa_scpi',
      sampleScript: `*IDN?
*RST
:SENS:FREQ:CENT 2.450GHz
:SENS:FREQ:SPAN 100MHz
:SENS:BAND:RES 100kHz
:INIT:CONT ON
:CALC:MARK1:MAX
:CALC:MARK1:X?
:CALC:MARK1:Y?`,
      supportedInterfaces: ['lan_scpi', 'gpib'],
    },
    description:
      'High-performance microwave signal analyzer optimized for characterising RF transmitters, power amplifier harmonics, phase noise, and adjacent channel leakage ratios (ACLR). Supports remote unattended script execution over secure TCP/IP SCPI socket.',
    rulesAndGuidelines: [
      'Maximum RF input power must NEVER exceed +30 dBm (1 Watt) without external 20 dB inline attenuator.',
      'DC block capacitor mandatory on input port when testing active DC-biased bias-tee circuits.',
      'Remote PyVISA sessions auto-terminate after 60 minutes of inactivity.',
    ],
  },
  {
    id: 'tb_chroma_battery_cycler',
    slug: 'chroma-17020-ev-battery-cycler',
    name: 'Chroma 17020 Regenerative Battery Pack Cycler (1000A / 100V)',
    model: '17020-100-1000',
    manufacturer: 'Chroma ATE',
    category: 'battery_cycler',
    hostLab: {
      name: 'ARAI EV Center of Excellence',
      city: 'Pune',
      state: 'Maharashtra',
      institution: 'Automotive Research Association of India',
      nablAccredited: true,
    },
    accessType: 'hybrid',
    specifications: {
      'Voltage Range': '0 to 100 V DC',
      'Current Range': '±1000 A (Bi-directional charge & discharge)',
      'Power Rating': '60 kW Regenerative',
      'Grid Regeneration Efficiency': '> 90% power fed back to grid',
      'Channels': '4 parallelable channels (up to 4000A)',
      'Data Logging Rate': '10 ms per voltage/current sample',
    },
    hourlyRateInr: 2800,
    studentSubsidyRateInr: 1200,
    safetyInductionRequired: true,
    activeQueueLength: 4,
    scriptRunner: {
      scriptType: 'json_profile',
      sampleScript: `*IDN?
:CONF:BAT:VOLT:MAX 67.2
:CONF:BAT:VOLT:MIN 48.0
:CONF:BAT:CURR:LIM 500
:CONF:BAT:TEMP:CUTOFF 55.0
:PROG:STEP1:CC_DISCHARGE CURR=250,TIME=1800
:OUTP ON
:MEAS:VOLT?
:MEAS:CURR?`,
      supportedInterfaces: ['lan_scpi', 'serial'],
    },
    description:
      'Industrial-grade regenerative battery pack testing system designed for AIS-156 and AIS-038 automotive certification. Simulates real-world dynamic drive cycles (WLTC / IDC urban driving), regenerative braking current dumps, and high-rate DC fast charging.',
    rulesAndGuidelines: [
      'Physical battery mounting requires certified high-current Anderson SB350 or Amphenol connectors.',
      'BMS emergency contactor cutoff signal must be wired to the Chroma dry-contact emergency stop interlock.',
      'Operator must be physically present during first high-C thermal qualification cycle.',
    ],
  },
  {
    id: 'tb_rs_emc_chamber',
    slug: 'rs-emc-semi-anechoic-chamber',
    name: 'Rohde & Schwarz 3m Semi-Anechoic EMI/EMC Chamber',
    model: 'SAC-3 Plus with R&S ESR26 Receiver',
    manufacturer: 'Rohde & Schwarz / Albatross Projects',
    category: 'emc_anechoic_chamber',
    hostLab: {
      name: 'SAMEER Centre for Electromagnetics',
      city: 'Chennai',
      state: 'Tamil Nadu',
      institution: 'Ministry of Electronics & Information Technology',
      nablAccredited: true,
    },
    accessType: 'physical_onsite',
    specifications: {
      'Frequency Range': '9 kHz to 26.5 GHz',
      'Test Distance': '3.0 meters (expandable to 5m)',
      'Turntable Diameter': '2.0 meters (360° continuous rotation)',
      'Max Turntable Payload': '1500 kg',
      'Antenna Mast Height': '1.0 m to 4.0 m automated vertical/horizontal sweep',
      'Shielding Effectiveness': '> 100 dB (10 kHz to 40 GHz)',
    },
    hourlyRateInr: 3500,
    studentSubsidyRateInr: 1500,
    safetyInductionRequired: true,
    activeQueueLength: 6,
    scriptRunner: {
      scriptType: 'pyvisa_scpi',
      sampleScript: `*IDN?
*RST
:SENS:SCAN:STAR 30MHz
:SENS:SCAN:STOP 1000MHz
:SENS:DET:REC QPEAK
:ROUT:TURNTABLE:ANGLE 180
:ROUT:MAST:HEIGHT 2.0
:MEAS:MAX:PEAK?`,
      supportedInterfaces: ['lan_scpi', 'gpib'],
    },
    description:
      'NABL-accredited full-compliance 3-meter semi-anechoic chamber lined with ferrite tiles and hybrid pyramidal absorbers. Performs automated radiated emission scans per CISPR 32 Class B and conducted immunity tests per IEC 61000-4-3.',
    rulesAndGuidelines: [
      'DUT must be powered through the chamber filtered line impedance stabilization network (LISN).',
      'No loose metallic tools or reflective ladders permitted inside the quiet zone during measurement.',
    ],
  },
  {
    id: 'tb_imv_vibration_shaker',
    slug: 'imv-electrodynamic-shaker-table',
    name: 'IMV Corporation 50 kN 3-Axis Electrodynamic Vibration Shaker',
    model: 'K-series K050/EM52H',
    manufacturer: 'IMV Corporation',
    category: 'vibration_shaker',
    hostLab: {
      name: 'CSIR-NAL Aerospace Structural Test Facilities',
      city: 'Bengaluru',
      state: 'Karnataka',
      institution: 'National Aerospace Laboratories',
      nablAccredited: true,
    },
    accessType: 'physical_onsite',
    specifications: {
      'Sine Dynamic Force': '50 kN (5100 kgf)',
      'Random Dynamic Force': '50 kN rms',
      'Mechanical Shock Force': '100 kN peak',
      'Frequency Range': '5 Hz to 3000 Hz',
      'Max Continuous Acceleration': '1000 m/s² (102 G)',
      'Max Displacement (p-p)': '51 mm (2.0 inches)',
      'Max Test Payload': '600 kg',
    },
    hourlyRateInr: 4200,
    studentSubsidyRateInr: 1800,
    safetyInductionRequired: true,
    activeQueueLength: 3,
    scriptRunner: {
      scriptType: 'json_profile',
      sampleScript: `*IDN?
:CONF:AXIS VERTICAL
:CONF:PROFILE MIL-STD-810H_514.8
:CONF:PSD:BAND 10,2000,0.04
:ARM:SHAKER
:START:SWEEP DURATION_SEC=3600
:MEAS:ACCEL:RMS?`,
      supportedInterfaces: ['lan_scpi'],
    },
    description:
      'Heavy-duty electrodynamic shaker facility for MIL-STD-810H aerospace airframe testing, satellite launch vibration qualification, and automotive AIS-156 battery pack mechanical shock testing.',
    rulesAndGuidelines: [
      'Custom fixture adapter plates must be CNC-machined from 6061-T6 aluminum with verified resonance > 2 kHz.',
      'All loose wires and components on the device-under-test must be potted or secured with Kapton tape.',
    ],
  },
  {
    id: 'tb_thermotron_thermal_chamber',
    slug: 'thermotron-thermal-shock-chamber',
    name: 'Thermotron Fast-Ramp Climatic Environmental Chamber',
    model: 'SE-1000-15-15',
    manufacturer: 'Thermotron Industries',
    category: 'thermal_chamber',
    hostLab: {
      name: 'T-Hub Hardware CoE / T-Works Prototyping Center',
      city: 'Hyderabad',
      state: 'Telangana',
      institution: 'Government of Telangana & T-Hub',
      nablAccredited: false,
    },
    accessType: 'remote_scpi',
    specifications: {
      'Temperature Range': '-70°C to +180°C',
      'Heating Ramp Rate': '15.0°C / minute',
      'Cooling Ramp Rate': '15.0°C / minute',
      'Relative Humidity Range': '10% to 95% RH',
      'Chamber Internal Volume': '1000 Liters (35.3 cu ft)',
      'Cable Port Diameter': '100 mm access port for live wiring harness',
    },
    hourlyRateInr: 1500,
    studentSubsidyRateInr: 650,
    safetyInductionRequired: false,
    activeQueueLength: 1,
    scriptRunner: {
      scriptType: 'pyvisa_scpi',
      sampleScript: `*IDN?
:SOUR:TEMP:SET -40.0
:SOUR:RAMP:RATE 15.0
:SOUR:HUM:SET 85.0
:OUTP ON
:WAIT:TEMP:STABLE TOLERANCE=0.5,TIMEOUT_MIN=30
:MEAS:TEMP?
:MEAS:HUM?`,
      supportedInterfaces: ['lan_scpi', 'serial'],
    },
    description:
      'Rapid thermal cycling chamber designed for accelerated stress testing (HALT/HASS), automotive temperature qualification (-40°C to +85°C), and humidity soak degradation tests for outdoor industrial IoT nodes.',
    rulesAndGuidelines: [
      'Explosive or flammable volatile solvents strictly prohibited inside the chamber.',
      'Live electrical wiring harnesses fed through the side port must be silicone plugged to prevent moisture condensation.',
    ],
  },
  {
    id: 'tb_tektronix_logic_analyzer',
    slug: 'tektronix-136ch-logic-analyzer',
    name: 'Tektronix TLA7016 136-Channel Mixed-Signal Logic Analyzer',
    model: 'TLA7016 with TLA7BB4 Modules',
    manufacturer: 'Tektronix',
    category: 'logic_analyzer',
    hostLab: {
      name: 'IISc DESE Microelectronics Lab',
      city: 'Bengaluru',
      state: 'Karnataka',
      institution: 'Indian Institute of Science (IISc)',
      nablAccredited: true,
    },
    accessType: 'remote_scpi',
    specifications: {
      'Channel Count': '136 digital channels + 4 analog MSO',
      'State Acquisition Speed': '1.4 GHz synchronous clocking',
      'Timing Resolution': '20 ps (50 GHz MagniVu deep capture)',
      'Memory Depth': '128 MB per channel',
      'Protocol Decoders': 'PCIe Gen3, DDR4, AXI4 bus, SPI, I2C, CAN-FD, MIPI D-PHY',
      'Remote Interface': 'VNC Desktop + SCPI Waveform Export',
    },
    hourlyRateInr: 900,
    studentSubsidyRateInr: 350,
    safetyInductionRequired: false,
    activeQueueLength: 0,
    scriptRunner: {
      scriptType: 'pyvisa_scpi',
      sampleScript: `*IDN?
:CONF:TRIG:BUS AXI4_ADDR,EQUALS,0x80000000
:CONF:SAMP:RATE 1.4GHz
:ARM
:ACQ:MEM:TRANS:VCD?`,
      supportedInterfaces: ['lan_scpi'],
    },
    description:
      'Premier silicon verification and FPGA high-speed digital timing debug platform. Ideal for debugging RISC-V memory bus contention, DDR4 timing skews, and high-speed serial bus protocol violations.',
    rulesAndGuidelines: [
      'Logic probe flying leads must not exceed 5.0V peak input voltage.',
      'Active Mictor 38-pin impedance matched connectors recommended for signal integrity above 200 MHz.',
    ],
  },
];
