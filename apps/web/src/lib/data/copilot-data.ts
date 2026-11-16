import type { ComponentSourcingItem, BomAuditItem } from '@hackerland/core';

export const HARDWARE_COMPONENTS_CATALOG: ComponentSourcingItem[] = [
  {
    mpn: 'STM32F401CCU6',
    manufacturer: 'STMicroelectronics',
    category: 'Microcontrollers (ARM Cortex-M4)',
    description: 'ARM Cortex-M4 32-bit MCU, 256KB Flash, 64KB SRAM, 84MHz, USB OTG, 1.7V to 3.6V.',
    package: 'UFQFPN-48',
    lifecycleStatus: 'active',
    indianDistributors: [
      { name: 'Robu.in (Pune)', inStock: true, priceInr: 285, minOrderQty: 1 },
      { name: 'Element14 India', inStock: true, priceInr: 320, minOrderQty: 1 },
      { name: 'KitsnSpares (Delhi)', inStock: true, priceInr: 295, minOrderQty: 1 },
    ],
    globalDistributors: [
      { name: 'LCSC (Shenzhen)', inStock: true, priceUsd: 2.45 },
      { name: 'DigiKey', inStock: true, priceUsd: 3.82 },
    ],
    pinCompatibleAlternates: [
      { mpn: 'GD32F401CCU6', manufacturer: 'GigaDevice', priceInr: 195, notes: 'Pin-compatible drop-in, faster 120MHz core' },
      { mpn: 'STM32F411CEU6', manufacturer: 'STMicroelectronics', priceInr: 345, notes: 'Direct drop-in with 512KB Flash and 100MHz' },
    ],
  },
  {
    mpn: 'ESP32-WROOM-32E',
    manufacturer: 'Espressif Systems',
    category: 'Wireless MCU (Wi-Fi & BLE)',
    description: 'Dual-core Xtensa 32-bit LX6 MCU, 2.4GHz Wi-Fi 802.11b/g/n and Bluetooth 4.2 BR/EDR & BLE, 4MB SPI Flash.',
    package: 'SMD-38 Module',
    lifecycleStatus: 'active',
    indianDistributors: [
      { name: 'Robu.in (Pune)', inStock: true, priceInr: 290, minOrderQty: 1 },
      { name: 'KitsnSpares (Delhi)', inStock: true, priceInr: 310, minOrderQty: 1 },
      { name: 'Fab.to.Lab (Bengaluru)', inStock: true, priceInr: 325, minOrderQty: 1 },
    ],
    globalDistributors: [
      { name: 'LCSC (Shenzhen)', inStock: true, priceUsd: 2.85 },
      { name: 'Mouser', inStock: true, priceUsd: 3.9 },
    ],
    pinCompatibleAlternates: [
      { mpn: 'ESP32-WROOM-32D', manufacturer: 'Espressif Systems', priceInr: 275, notes: 'Legacy pin-compatible revision' },
      { mpn: 'ESP32-S3-WROOM-1', manufacturer: 'Espressif Systems', priceInr: 360, notes: 'Next-gen dual-core with USB OTG & Vector AI ops' },
    ],
  },
  {
    mpn: 'RP2040',
    manufacturer: 'Raspberry Pi',
    category: 'Microcontrollers (Dual Cortex-M0+)',
    description: 'Dual-core ARM Cortex-M0+ @ 133MHz, 264KB SRAM, Programmable I/O (PIO), 30 GPIO pins, QFN-56.',
    package: 'QFN-56 (7x7mm)',
    lifecycleStatus: 'active',
    indianDistributors: [
      { name: 'Robu.in (Pune)', inStock: true, priceInr: 95, minOrderQty: 1 },
      { name: 'Silverline Electronics (Bengaluru)', inStock: true, priceInr: 105, minOrderQty: 1 },
      { name: 'Element14 India', inStock: true, priceInr: 110, minOrderQty: 1 },
    ],
    globalDistributors: [
      { name: 'LCSC', inStock: true, priceUsd: 0.98 },
      { name: 'DigiKey', inStock: true, priceUsd: 1.0 },
    ],
    pinCompatibleAlternates: [
      { mpn: 'WCH CH32V203', manufacturer: 'WCH', priceInr: 65, notes: 'RISC-V alternate with USB high-speed' },
    ],
  },
  {
    mpn: 'LM7805CT',
    manufacturer: 'Texas Instruments',
    category: 'Linear Voltage Regulators',
    description: 'Linear Voltage Regulator 5V 1.5A Output with Internal Thermal Overload and Short-Circuit Protection.',
    package: 'TO-220',
    lifecycleStatus: 'active',
    indianDistributors: [
      { name: 'Robu.in (Pune)', inStock: true, priceInr: 24, minOrderQty: 1 },
      { name: 'KitsnSpares (Delhi)', inStock: true, priceInr: 28, minOrderQty: 1 },
    ],
    globalDistributors: [
      { name: 'LCSC', inStock: true, priceUsd: 0.28 },
      { name: 'Mouser', inStock: true, priceUsd: 0.72 },
    ],
    pinCompatibleAlternates: [
      { mpn: 'L7805CV', manufacturer: 'STMicroelectronics', priceInr: 22, notes: 'Direct pin-for-pin replacement' },
      { mpn: 'TPS54302DDCR', manufacturer: 'Texas Instruments', priceInr: 65, notes: 'High-efficiency 92% synchronous buck alternative' },
    ],
  },
  {
    mpn: 'INA219AIDR',
    manufacturer: 'Texas Instruments',
    category: 'Current & Power Monitors',
    description: 'High-Side Bi-Directional Current/Power Monitor with I2C Interface, 0V to 26V Common-Mode, 12-bit ADC.',
    package: 'SOIC-8',
    lifecycleStatus: 'active',
    indianDistributors: [
      { name: 'Robu.in (Pune)', inStock: true, priceInr: 145, minOrderQty: 1 },
      { name: 'Fab.to.Lab (Bengaluru)', inStock: true, priceInr: 160, minOrderQty: 1 },
    ],
    globalDistributors: [
      { name: 'LCSC', inStock: true, priceUsd: 1.45 },
      { name: 'DigiKey', inStock: true, priceUsd: 2.15 },
    ],
    pinCompatibleAlternates: [
      { mpn: 'INA226AIDR', manufacturer: 'Texas Instruments', priceInr: 195, notes: '16-bit resolution, 0 to 36V common mode' },
      { mpn: 'MAX4080SAUA', manufacturer: 'Analog Devices', priceInr: 135, notes: 'Analog voltage output version' },
    ],
  },
  {
    mpn: 'MPU-6050',
    manufacturer: 'TDK InvenSense',
    category: 'Inertial Measurement Units (IMU)',
    description: '6-Axis MotionTracking device that combines a 3-axis gyroscope and a 3-axis accelerometer with I2C/SPI.',
    package: 'QFN-24 (4x4mm)',
    lifecycleStatus: 'nrnd',
    indianDistributors: [
      { name: 'Robu.in (Pune)', inStock: true, priceInr: 180, minOrderQty: 1 },
      { name: 'KitsnSpares (Delhi)', inStock: false, priceInr: 210, minOrderQty: 1 },
    ],
    globalDistributors: [
      { name: 'LCSC', inStock: true, priceUsd: 1.85 },
      { name: 'DigiKey', inStock: false, priceUsd: 4.5 },
    ],
    pinCompatibleAlternates: [
      { mpn: 'ICM-42688-P', manufacturer: 'TDK InvenSense', priceInr: 220, notes: 'Ultra-low noise, 32kHz ODR recommended for new flight controllers' },
      { mpn: 'BMI270', manufacturer: 'Bosch Sensortec', priceInr: 195, notes: 'Bosch ultra-low power 6-axis IMU' },
    ],
  },
  {
    mpn: 'SX1262IMLTRT',
    manufacturer: 'Semtech',
    category: 'RF & Wireless (LoRa)',
    description: 'Sub-GHz Ultra Low Power Long-Range LoRa Transceiver, +22dBm output power, -148dBm sensitivity, 150-960MHz.',
    package: 'QFN-24 (4x4mm)',
    lifecycleStatus: 'active',
    indianDistributors: [
      { name: 'Element14 India', inStock: true, priceInr: 360, minOrderQty: 1 },
      { name: 'Robu.in (Pune)', inStock: true, priceInr: 390, minOrderQty: 1 },
    ],
    globalDistributors: [
      { name: 'LCSC', inStock: true, priceUsd: 3.2 },
      { name: 'Mouser', inStock: true, priceUsd: 4.8 },
    ],
    pinCompatibleAlternates: [
      { mpn: 'SX1276IMLTRT', manufacturer: 'Semtech', priceInr: 310, notes: 'Legacy LoRa chip, 50% higher RX current' },
    ],
  },
  {
    mpn: 'IRFZ44NPBF',
    manufacturer: 'Infineon Technologies',
    category: 'Power MOSFETs',
    description: '55V 49A N-Channel HEXFET Power MOSFET, 17.5 mOhm Rds(on), TO-220AB.',
    package: 'TO-220AB',
    lifecycleStatus: 'active',
    indianDistributors: [
      { name: 'Robu.in (Pune)', inStock: true, priceInr: 36, minOrderQty: 1 },
      { name: 'KitsnSpares (Delhi)', inStock: true, priceInr: 40, minOrderQty: 1 },
    ],
    globalDistributors: [
      { name: 'LCSC', inStock: true, priceUsd: 0.38 },
      { name: 'DigiKey', inStock: true, priceUsd: 1.15 },
    ],
    pinCompatibleAlternates: [
      { mpn: 'STP55NF06', manufacturer: 'STMicroelectronics', priceInr: 38, notes: 'Pin-for-pin drop-in replacement' },
      { mpn: 'FDP8880', manufacturer: 'ON Semiconductor', priceInr: 48, notes: 'Lower 10mOhm Rds(on) for reduced thermals' },
    ],
  },
];

export const SAMPLE_BOMS = [
  {
    id: 'bom_drone_fc',
    title: 'Autonomous Drone Flight Controller & Telemetry Unit',
    description: 'Quad-layer STM32F401, ICM-42688-P IMU, Barometer, and SX1262 LoRa telemetry.',
    csvContent: `Reference,MPN,Description,Package,Quantity
U1,STM32F401CCU6,ARM Cortex-M4 84MHz MCU,UFQFPN-48,1
U2,MPU-6050,6-Axis IMU (NRND status),QFN-24,1
U3,SX1262IMLTRT,Sub-GHz LoRa Transceiver,QFN-24,1
U4,LM7805CT,5V 1.5A Linear Regulator,TO-220,1
Q1,IRFZ44NPBF,55V 49A N-Channel MOSFET,TO-220AB,4
U5,UNKNOWN_IC_999,Experimental Custom IC,QFN-16,1`,
  },
  {
    id: 'bom_solar_soil',
    title: 'KisanSense LoRa Agritech Soil Telemetry Probe',
    description: 'RP2040 MCU, INA219 current sensor, ESP32 BLE gateway, and capacitive probe.',
    csvContent: `Reference,MPN,Description,Package,Quantity
U1,RP2040,Dual Cortex-M0+ MCU,QFN-56,1
U2,ESP32-WROOM-32E,Wi-Fi & BLE Dual-Core Module,SMD-38,1
U3,INA219AIDR,I2C Current & Power Monitor,SOIC-8,1
U4,LM7805CT,5V Linear Regulator,TO-220,1`,
  },
];

export const CO_PILOT_PROMPTS = [
  {
    id: 'prompt_ldo',
    question: 'How do I step down a 48V Indian EV battery pack to 3.3V without cooking an LDO?',
    answer:
      'Never step down 48V directly to 3.3V with a linear LDO like LM7805 or AMS1117! A 48V to 3.3V drop delivering just 200mA would dissipate (48V - 3.3V) * 0.2A = 8.94 Watts of pure heat, causing immediate thermal shutdown. Instead, use a two-stage topology: 1) High-voltage synchronous buck converter (e.g. LMR16006 or LM5164, rated for 65V/100V) stepping 48V down to 5.0V with >88% efficiency. 2) Clean low-noise LDO (e.g. TPS7A25 or AP2112K) stepping 5.0V to 3.3V for the MCU with zero switching ripple.',
  },
  {
    id: 'prompt_decoupling',
    question: 'What is the optimal decoupling capacitor layout for an STM32 or RP2040 MCU?',
    answer:
      'Place one 100nF (0.1µF) X7R 0402/0603 ceramic capacitor directly adjacent to EVERY VDD/VSS pin pair, keeping trace length under 2mm. Ensure the via to the ground plane is located closer to the capacitor pad than to the IC pin. For the bulk rail, add a single 4.7µF or 10µF ceramic capacitor near the voltage input. For high-speed QSPI Flash (80-133MHz), add a dedicated 22pF high-frequency damping cap to suppress ringing on the clock line.',
  },
  {
    id: 'prompt_motor_freewheeling',
    question: 'How do I prevent inductive kickback spikes from blowing up MOSFETs in a BLDC motor driver?',
    answer:
      'Inductive kickback $V = -L (di/dt)$ can easily spike above 100V during fast PWM switching. 1) Always use fast Schottky freewheeling diodes or rely on low-Rds(on) body diodes with active freewheeling synchronous rectification. 2) Place an RC snubber network (typically 4.7Ω to 10Ω in series with 1nF to 4.7nF ceramic cap) across each half-bridge switch node to ground. 3) Add low-ESR ceramic decoupling capacitors (1µF 100V X7R) directly across the DC bus rail right next to the drain pins of the high-side MOSFETs.',
  },
];
