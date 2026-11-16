import type { PrototypeArchitecturePlan } from '@hackerland/core';

export const PROTOTYPE_PRESETS: PrototypeArchitecturePlan[] = [
  {
    id: 'proto_solar_lora_probe',
    ideaTitle: 'Solar-Powered LoRa Mesh Soil Moisture & Climate Probe',
    slug: 'solar-lora-soil-probe',
    domain: 'AgTech & IoT',
    targetFormFactor: 'Waterproof Cylindrical Stake (25mm dia x 180mm length)',
    summary:
      'Ultra-low-power agricultural sensor node that measures volumetric water content, soil temperature, and ambient humidity. Wakes every 15 minutes, broadcasts over long-range LoRa 865MHz to local farmer gateway, and sleeps at sub-15µA current.',
    systemBlocks: [
      {
        name: 'Solar Energy Harvester & Battery Management',
        category: 'Power',
        icChoice: 'Texas Instruments BQ25570 / TP4056 + ME6211 3.3V LDO',
        function: 'Harvests solar energy from 0.5W panel, charges 18650 LiFePO4 cell, outputs clean 3.3V',
      },
      {
        name: 'Core Application & Sleep Controller',
        category: 'Compute',
        icChoice: 'Espressif ESP32-C3 (RISC-V Single-Core 160MHz)',
        function: 'Deep sleep timer, ADC calibration, protocol formatting, CRC checksums',
      },
      {
        name: 'Volumetric Soil Moisture Sensor',
        category: 'Sensing',
        icChoice: 'High-Frequency 1MHz 555-Timer Capacitive Probe',
        function: 'Immune to soil salinity and corrosion unlike resistive copper prongs',
      },
      {
        name: 'Ambient Temperature & Humidity Sensor',
        category: 'Sensing',
        icChoice: 'Bosch Sensortec BME280',
        function: 'I2C digital relative humidity, temperature, and atmospheric pressure sensing',
      },
      {
        name: 'Long-Range Sub-GHz Wireless Transceiver',
        category: 'Connectivity',
        icChoice: 'Semtech SX1262 (India Band 865–867 MHz)',
        function: 'LoRa chirp spread spectrum radio capable of 5km line-of-sight transmission',
      },
    ],
    pinoutMapping: [
      { pin: 'GPIO 4', label: 'I2C_SDA', protocol: 'I2C', connectedTo: 'BME280 Pin 3 (SDA)' },
      { pin: 'GPIO 5', label: 'I2C_SCL', protocol: 'I2C', connectedTo: 'BME280 Pin 4 (SCL)' },
      { pin: 'GPIO 0', label: 'SOIL_ANALOG', protocol: 'ADC', connectedTo: 'Capacitive Probe Analog Out' },
      { pin: 'GPIO 6', label: 'SPI_SCK', protocol: 'SPI', connectedTo: 'SX1262 SCK' },
      { pin: 'GPIO 7', label: 'SPI_MISO', protocol: 'SPI', connectedTo: 'SX1262 MISO' },
      { pin: 'GPIO 8', label: 'SPI_MOSI', protocol: 'SPI', connectedTo: 'SX1262 MOSI' },
      { pin: 'GPIO 10', label: 'LORA_NSS', protocol: 'GPIO', connectedTo: 'SX1262 Chip Select' },
      { pin: 'GPIO 3', label: 'LORA_DIO1', protocol: 'GPIO', connectedTo: 'SX1262 Interrupt' },
    ],
    bom: [
      { component: 'MCU Core', partNumber: 'ESP32-C3-WROOM-02', footprint: 'Module SMD', estCostUsd: 1.85, estCostInr: 160, distributor: 'Robu.in / LCSC' },
      { component: 'LoRa Transceiver', partNumber: 'SX1262 Module 868MHz', footprint: 'SMD Castellation', estCostUsd: 3.40, estCostInr: 295, distributor: 'LCSC / DigiKey' },
      { component: 'Climate Sensor', partNumber: 'BME280', footprint: 'LGA-8', estCostUsd: 2.20, estCostInr: 190, distributor: 'Mouser / Robu.in' },
      { component: 'Solar MPPT Charger', partNumber: 'BQ25570RGRR', footprint: 'VQFN-20', estCostUsd: 2.80, estCostInr: 242, distributor: 'Texas Instruments' },
      { component: 'LiFePO4 Cell', partNumber: '18650 1500mAh 3.2V', footprint: 'Cylindrical Holder', estCostUsd: 2.50, estCostInr: 215, distributor: 'Domestic Indian Battery' },
      { component: 'Mini Solar Panel', partNumber: '5V 100mA Monocrystalline', footprint: 'Epoxy 55x55mm', estCostUsd: 1.50, estCostInr: 130, distributor: 'Generic Domestic' },
      { component: 'PCB Fabrication (2-Layer)', partNumber: 'FR4 1.6mm HASL', footprint: 'Custom 25x100mm', estCostUsd: 1.20, estCostInr: 105, distributor: 'LionCircuits' },
      { component: 'Passives & Enclosure', partNumber: 'Resistors/Caps/O-Ring Stake', footprint: '0805 & IP68 Tube', estCostUsd: 3.00, estCostInr: 260, distributor: 'Local Hardware' },
    ],
    requiredSkills: [
      { role: 'Embedded Firmware Engineer', skills: ['ESP-IDF', 'FreeRTOS Deep Sleep', 'LoRaWAN MAC'], estimatedHours: 24 },
      { role: 'Hardware & PCB Designer', skills: ['KiCad Schematic / PCB Studio', 'RF 50-Ohm Trace Matching', 'Low-Noise Grounding'], estimatedHours: 18 },
      { role: 'Mechanical & Field Test Specialist', skills: ['IP68 Seal Design', 'Soil Calibration', '3D Print Mold'], estimatedHours: 12 },
    ],
    milestones: [
      { phase: 'Phase 1: Breadboard & LoRa Link Verification', durationWeeks: 1.5, deliverables: ['BME280 sensor read over I2C', 'Transmit packet to gateway at 1km'] },
      { phase: 'Phase 2: Custom PCB Layout & DRC Checks', durationWeeks: 2, deliverables: ['2-layer board layout in PCB Studio', 'Gerber export & LionCircuits RFQ'] },
      { phase: 'Phase 3: Deep Sleep & Solar Harvester Characterization', durationWeeks: 1.5, deliverables: ['Verify <15µA quiescent current', 'Full charge cycle under monsoon light'] },
      { phase: 'Phase 4: Field Pilot (5 Probes on Indian Farm)', durationWeeks: 3, deliverables: ['Continuous 30-day telemetry logging on Hackerland dashboard'] },
    ],
    estimatedTotalProtoCost: { usd: 18.45, inr: 1597 },
  },
  {
    id: 'proto_electric_skateboard_esc',
    ideaTitle: 'Dual-Motor Field-Oriented Control (FOC) Electric Skateboard Inverter',
    slug: 'foc-skateboard-inverter',
    domain: 'EV & Mobility',
    targetFormFactor: 'Slim Aluminum Enclosed Module (80mm x 55mm x 18mm)',
    summary:
      'High-performance 12S (50.4V) dual motor speed controller driving brushless outrunner motors. Employs Field-Oriented Control (FOC) for silent, smooth startup torque, regenerative braking, and 2.4GHz remote throttle integration.',
    systemBlocks: [
      {
        name: 'High-Voltage Power Stage & Gate Drivers',
        category: 'Power',
        icChoice: 'TI DRV8301 3-Phase Gate Driver + 60V 100A MOSFETs (Nexperia / Infineon)',
        function: 'Switches 50A continuous phase currents with hardware over-current protection',
      },
      {
        name: 'Dual Vector Control MCU',
        category: 'Compute',
        icChoice: 'STM32F405RGT6 (ARM Cortex-M4 168MHz with FPU)',
        function: 'Executes Clarke/Park vector transforms, Space Vector PWM (SVPWM) at 20 kHz',
      },
      {
        name: 'In-line Phase Current Shunt Sensing',
        category: 'Sensing',
        icChoice: 'TI INA240 High-Bandwidth Bidirectional Current Amplifiers',
        function: 'Measures high-side phase current with 80dB common-mode rejection against switching spikes',
      },
      {
        name: 'Wireless Ergonomic Throttle Receiver',
        category: 'Connectivity',
        icChoice: 'Nordic nRF24L01+ 2.4GHz RF Transceiver',
        function: 'Sub-5ms low latency wireless communication with handheld trigger remote',
      },
    ],
    pinoutMapping: [
      { pin: 'PA8', label: 'PWM_UH', protocol: 'PWM', connectedTo: 'DRV8301 INHA' },
      { pin: 'PB13', label: 'PWM_UL', protocol: 'PWM', connectedTo: 'DRV8301 INLA' },
      { pin: 'PA9', label: 'PWM_VH', protocol: 'PWM', connectedTo: 'DRV8301 INHB' },
      { pin: 'PB14', label: 'PWM_VL', protocol: 'PWM', connectedTo: 'DRV8301 INLB' },
      { pin: 'PA10', label: 'PWM_WH', protocol: 'PWM', connectedTo: 'DRV8301 INHC' },
      { pin: 'PB15', label: 'PWM_WL', protocol: 'PWM', connectedTo: 'DRV8301 INLC' },
      { pin: 'PC0', label: 'CURRENT_PHASE_A', protocol: 'ADC', connectedTo: 'INA240 Out A' },
      { pin: 'PC1', label: 'CURRENT_PHASE_B', protocol: 'ADC', connectedTo: 'INA240 Out B' },
      { pin: 'PA4', label: 'SPI_NSS', protocol: 'SPI', connectedTo: 'nRF24L01+ CSN' },
    ],
    bom: [
      { component: 'Vector DSP MCU', partNumber: 'STM32F405RGT6', footprint: 'LQFP-64', estCostUsd: 5.50, estCostInr: 475, distributor: 'ST / Mouser' },
      { component: '3-Phase Gate Driver', partNumber: 'DRV8301DCA', footprint: 'HTSSOP-56', estCostUsd: 4.80, estCostInr: 415, distributor: 'Texas Instruments' },
      { component: 'Power MOSFETs (x6)', partNumber: 'TPH1R405PL (60V 100A)', footprint: 'SOP-Advance', estCostUsd: 9.60, estCostInr: 830, distributor: 'Toshiba / LCSC' },
      { component: 'Current Shunt Amps', partNumber: 'INA240A2PWR', footprint: 'TSSOP-8', estCostUsd: 3.20, estCostInr: 275, distributor: 'Texas Instruments' },
      { component: 'Electrolytic Buffer Caps', partNumber: 'Rubycon 63V 680µF Low-ESR', footprint: 'Radial 12.5mm', estCostUsd: 3.50, estCostInr: 300, distributor: 'DigiKey' },
      { component: 'Copper Heavy PCB', partNumber: '4-Layer 2oz Copper FR4', footprint: '80x55mm', estCostUsd: 6.50, estCostInr: 560, distributor: 'PCB Power' },
      { component: 'Enclosure & Thermal Pad', partNumber: 'Extruded Aluminum + 6W/mK Pad', footprint: 'Custom Enclosure', estCostUsd: 8.00, estCostInr: 690, distributor: 'Local CNC/Extrusion' },
      { component: 'Passives & Connectors', partNumber: 'XT60 / 4mm Gold Bullet / Passives', footprint: '0603 / 0805 / Connectors', estCostUsd: 6.90, estCostInr: 595, distributor: 'Generic' },
    ],
    requiredSkills: [
      { role: 'Power Electronics Designer', skills: ['4-Layer High-Current PCB Layout', 'MOSFET Gate Ringing Suppression', 'Thermal Spreading'], estimatedHours: 35 },
      { role: 'FOC Motor Control Specialist', skills: ['C / VESC Open Source Firmware', 'PID Tuning', 'Flux Observer Tuning'], estimatedHours: 28 },
      { role: 'Dynamometer / Test Bench Lead', skills: ['Torque Bench Testing', 'Regen Brake Benchmarking', 'Telemetry Logging'], estimatedHours: 15 },
    ],
    milestones: [
      { phase: 'Phase 1: Gate Driver & Half-Bridge Pulse Test', durationWeeks: 2, deliverables: ['Clean switching waveforms without overshoot', 'Dead-time verification on scope'] },
      { phase: 'Phase 2: Open-Loop Commutation & Current Calibration', durationWeeks: 2, deliverables: ['Spin BLDC motor in sensorless mode', 'Calibrate ADC offsets'] },
      { phase: 'Phase 3: Closed-Loop FOC Speed & Torque Tuning', durationWeeks: 2.5, deliverables: ['Instant zero-speed launch torque without cogging', 'Regenerative braking safety stop'] },
      { phase: 'Phase 4: High-Thermal Road Load Dyno Run', durationWeeks: 2, deliverables: ['15-minute continuous 40A hill-climb test under 75°C temperature ceiling'] },
    ],
    estimatedTotalProtoCost: { usd: 48.00, inr: 4140 },
  },
  {
    id: 'proto_pulse_oximeter_holter',
    ideaTitle: 'Low-Cost Wearable Continuous Pulse Oximeter & PPG Arrhythmia Monitor',
    slug: 'wearable-ppg-holter-monitor',
    domain: 'Healthcare & MedTech',
    targetFormFactor: 'Wrist Strap or Finger Clip (32mm x 28mm x 8mm)',
    summary:
      'Continuous photoplethysmography (PPG) wearable tracking SpO2 oxygen saturation, heart rate variability (HRV), and pulse transit time. Runs on a tiny LiPo coin cell with BLE smartphone sync.',
    systemBlocks: [
      {
        name: 'Optical Biosensing Analog Front End',
        category: 'Sensing',
        icChoice: 'Analog Devices MAX30102 Optical Sensor',
        function: 'Dual red & infrared LEDs paired with high-sensitivity photodetector for capillary pulse absorption',
      },
      {
        name: 'Ultra-Low-Power Compute & BLE',
        category: 'Compute',
        icChoice: 'Raspberry Pi RP2040 / Nordic nRF52840',
        function: 'Digital bandpass filtering, peak detection algorithm, BLE GATT peripheral service',
      },
      {
        name: 'Micro OLED Display',
        category: 'Actuation',
        icChoice: '0.96-inch 128x64 I2C SSD1306 Display',
        function: 'Real-time plethysmogram waveform visualization and battery status indicator',
      },
      {
        name: 'Li-Ion Battery Charger & Fuel Gauge',
        category: 'Power',
        icChoice: 'Microchip MCP73831 + MAX17048 I2C Fuel Gauge',
        function: 'Safe 50mA charging for 150mAh rechargeable LiPo pouch cell with 1% battery resolution',
      },
    ],
    pinoutMapping: [
      { pin: 'GPIO 2', label: 'I2C_SDA', protocol: 'I2C', connectedTo: 'MAX30102 & SSD1306 SDA' },
      { pin: 'GPIO 3', label: 'I2C_SCL', protocol: 'I2C', connectedTo: 'MAX30102 & SSD1306 SCL' },
      { pin: 'GPIO 4', label: 'MAX_INT', protocol: 'GPIO', connectedTo: 'MAX30102 FIFO Interrupt' },
      { pin: 'GPIO 5', label: 'BUTTON_MODE', protocol: 'GPIO', connectedTo: 'Tactile Push Button' },
    ],
    bom: [
      { component: 'PPG Biosensor', partNumber: 'MAX30102EFD+', footprint: 'OESIP-14', estCostUsd: 2.90, estCostInr: 250, distributor: 'Analog Devices / Robu' },
      { component: 'Dual Cortex-M0+ MCU', partNumber: 'RP2040', footprint: 'QFN-56', estCostUsd: 1.00, estCostInr: 86, distributor: 'Raspberry Pi' },
      { component: 'OLED Display Module', partNumber: '0.96" SSD1306 128x64', footprint: '4-pin Header', estCostUsd: 1.80, estCostInr: 155, distributor: 'Generic' },
      { component: 'Linear Charger IC', partNumber: 'MCP73831T-2ACI/OT', footprint: 'SOT-23-5', estCostUsd: 0.65, estCostInr: 56, distributor: 'Microchip' },
      { component: '150mAh LiPo Battery', partNumber: '3.7V 402025 Pouch Cell', footprint: 'JST-PH 2.0', estCostUsd: 1.90, estCostInr: 165, distributor: 'Domestic Indian Vendor' },
      { component: 'Circular PCB (2-Layer)', partNumber: 'FR4 1.0mm ENIG Gold', footprint: 'Round 30mm', estCostUsd: 1.80, estCostInr: 155, distributor: 'LionCircuits' },
      { component: 'Silicone Band & Case', partNumber: 'Biocompatible Resin 3D Print', footprint: 'SLA Resin Case', estCostUsd: 2.75, estCostInr: 238, distributor: 'Local 3D Print' },
    ],
    requiredSkills: [
      { role: 'Biomedical Signal Processing Lead', skills: ['DSP Filtering (FIR/IIR)', 'SpO2 R-Curve Calibration', 'Motion Artifact Cancellation'], estimatedHours: 30 },
      { role: 'Firmware & Low-Power Engineer', skills: ['C / TinyGo', 'I2C FIFO Management', 'BLE Notification Profile'], estimatedHours: 20 },
      { role: 'Medical Compliance & Ergonomics', skills: ['IEC 60601-1 Basic Safety Concepts', 'Skin Biocompatibility', 'CAD Ergonomics'], estimatedHours: 12 },
    ],
    milestones: [
      { phase: 'Phase 1: Raw Red/IR Photodiode Sampling', durationWeeks: 1, deliverables: ['Clean arterial pulse wave on oscilloscope'] },
      { phase: 'Phase 2: SpO2 Algorithm & Calibration Against Reference', durationWeeks: 2, deliverables: ['Validate against hospital pulse oximeter within ±2% SpO2'] },
      { phase: 'Phase 3: Miniature Circular PCB Fabrication', durationWeeks: 2, deliverables: ['Order 30mm round board via PCB Studio & RFQ engine'] },
      { phase: 'Phase 4: 24-Hour Battery Run-Time Validation', durationWeeks: 1.5, deliverables: ['Continuous sleep-and-sample operation exceeding 24 hours'] },
    ],
    estimatedTotalProtoCost: { usd: 12.80, inr: 1105 },
  },
];

export function listPrototypePresets(): PrototypeArchitecturePlan[] {
  return PROTOTYPE_PRESETS;
}

export function synthesizePrototypePlan(userPrompt: string): PrototypeArchitecturePlan {
  const q = userPrompt.toLowerCase();

  // If matches skateboard or motor
  if (q.includes('motor') || q.includes('skateboard') || q.includes('foc') || q.includes('inverter') || q.includes('esc') || q.includes('ev')) {
    return PROTOTYPE_PRESETS[1]!;
  }

  // If matches health or pulse or medical or bio
  if (q.includes('health') || q.includes('pulse') || q.includes('heart') || q.includes('medical') || q.includes('spo2') || q.includes('blood')) {
    return PROTOTYPE_PRESETS[2]!;
  }

  // Default to solar / IoT farm probe with dynamic title customization
  const base = PROTOTYPE_PRESETS[0]!;
  if (!q.trim()) return base;

  return {
    ...base,
    id: `proto_${Date.now()}`,
    ideaTitle: userPrompt.charAt(0).toUpperCase() + userPrompt.slice(1),
    slug: userPrompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 35),
    summary: `Custom hardware prototype architecture synthesized for: "${userPrompt}". Combines energy-efficient compute, low-noise analog sensor front-ends, and robust wireless interconnects.`,
  };
}
