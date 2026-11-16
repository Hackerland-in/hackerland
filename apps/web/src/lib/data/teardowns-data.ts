export interface TeardownBOMItem {
  component: string;
  partNumber: string;
  manufacturer: string;
  function: string;
  package: string;
  estCost: string;
  openAlternative: string;
}

export interface TeardownSubsystem {
  name: string;
  description: string;
  chips: string[];
}

export interface TeardownArticle {
  slug: string;
  title: string;
  category: 'EV & Automotive' | 'Drones & Robotics' | 'Smart Grid & IoT';
  deviceType: string;
  manufacturer: string;
  retailPrice: string;
  estimatedBomCost: string;
  summary: string;
  highlightSpecs: string[];
  subsystems: TeardownSubsystem[];
  bomBreakdown: TeardownBOMItem[];
  engineeringLessons: string[];
}

export const TEARDOWNS_DATA: TeardownArticle[] = [
  {
    slug: 'ather-450-smart-bms-and-telematics',
    title: 'Ather 450 Smart EV Battery Management System & Dashboard',
    category: 'EV & Automotive',
    deviceType: 'Electric Two-Wheeler Power Electronics',
    manufacturer: 'Ather Energy (India)',
    retailPrice: '₹1,45,000 (~$1,700)',
    estimatedBomCost: '₹34,500 (~$400 for electronics & BMS)',
    summary:
      'A deep architectural autopsy of India’s benchmark electric scooter battery pack and digital touchscreen dashboard. Dissects automotive-grade CAN isolation, cell-balancing under 45°C ambient Indian summers, and Quectel 4G telematics.',
    highlightSpecs: [
      '3.7 kWh 21700 NCM Lithium-Ion Battery Pack',
      'Automotive CAN 2.0B dual-redundant bus',
      'Android-based 7-inch IP65 touchscreen dashboard with Snapdragon 212',
      'Sub-100mA sleep quiescent current consumption',
    ],
    subsystems: [
      {
        name: 'Battery Management System (BMS)',
        description: 'Multi-layer FR4 board conformal coated for IP67 water submersion. Monitors 14 series cells with active temperature and current sensing.',
        chips: ['Texas Instruments BQ76952 Analog Front End', 'STMicroelectronics STM32F405 168MHz MCU', 'Isolated CAN Transceiver ISO1050'],
      },
      {
        name: 'Telematics & Navigation Dashboard',
        description: 'Android board running custom Ather OS on Snapdragon 212 with embedded e-SIM for OTA software updates.',
        chips: ['Qualcomm Snapdragon 212 APQ8009', 'Quectel EC20 4G LTE Cat 4 Modem', 'u-blox NEO-M8N GNSS GPS Engine'],
      },
      {
        name: 'Motor Controller (Inverter)',
        description: 'Field Oriented Control (FOC) 3-phase inverter driving 6.2 kW PMSM permanent magnet motor.',
        chips: ['Infineon OptiMOS 100V Power MOSFETs', 'TI DRV8301 3-phase pre-driver', 'Current Shunt Amplifiers INA240'],
      },
    ],
    bomBreakdown: [
      {
        component: 'BMS Analog Front End (AFE)',
        partNumber: 'BQ76952',
        manufacturer: 'Texas Instruments',
        function: 'Monitors up to 16 individual cell voltages with 1mV resolution',
        package: '48-pin TQFP',
        estCost: '$4.20 (₹360)',
        openAlternative: 'OpenBMS with LTC6804 / BQ76940',
      },
      {
        component: 'BMS Main Safety MCU',
        partNumber: 'STM32F405RGT6',
        manufacturer: 'STMicroelectronics',
        function: 'State-of-Charge (SoC) & State-of-Health (SoH) Coulomb counting',
        package: '64-pin LQFP',
        estCost: '$5.50 (₹475)',
        openAlternative: 'RP2040 Dual ARM Cortex-M0+ or ESP32-S3',
      },
      {
        component: 'Isolated CAN Transceiver',
        partNumber: 'ISO1050DUB',
        manufacturer: 'Texas Instruments',
        function: '5000V galvanic isolation between high-voltage traction pack and 12V low-voltage chassis',
        package: '8-pin SOIC',
        estCost: '$1.85 (₹160)',
        openAlternative: 'MCP2551 + Optocoupler 6N137',
      },
      {
        component: 'High-Current Solid State Disconnect',
        partNumber: 'IPB014N08N5 (6x in parallel)',
        manufacturer: 'Infineon Technologies',
        function: 'Handles 150A continuous discharge and sub-millisecond short-circuit cut-off',
        package: 'TO-263 (D2PAK)',
        estCost: '$8.40 (₹725 for bank)',
        openAlternative: 'Nexperia PSMN1R0-40YLD',
      },
      {
        component: '4G LTE Cellular Modem',
        partNumber: 'EC200U-CN',
        manufacturer: 'Quectel Wireless',
        function: 'Streams ride telemetry, GPS coordinates, and vehicle health to cloud AWS MQTT broker',
        package: 'LCC 144-pin',
        estCost: '$9.20 (₹795)',
        openAlternative: 'SIM7600G-H breakout module',
      },
    ],
    engineeringLessons: [
      'Thermal mass is your friend: Ather cast the BMS enclosure directly against the aluminum battery case with silicone gap pads, conducting heat away from cell-balancing resistors.',
      'Galvanic isolation prevents fire: Never tie traction pack ground (0V at -58V) to vehicle frame ground. The ISO1050 prevents transient spikes from blowing the 12V lighting cluster.',
      'Software-defined scooters win: The Quectel LTE modem enables over-the-air firmware upgrades for the BMS algorithm, improving battery longevity 2 years post-purchase.',
    ],
  },
  {
    slug: 'dji-mavic-mini-drone-flight-controller',
    title: 'DJI Mavic Mini Drone Flight Controller & 3-Axis Brushless Gimbal',
    category: 'Drones & Robotics',
    deviceType: 'Sub-249g Consumer Quadcopter',
    manufacturer: 'DJI Innovations',
    retailPrice: '$399 (~₹34,500)',
    estimatedBomCost: '$95 (~₹8,200)',
    summary:
      'How DJI fit a 2.7K stabilized camera, 4 brushless ESC motor drivers, GPS receiver, downward optical flow sensor, and 30-minute flight endurance under the strict 249g FAA/DGCA regulatory threshold.',
    highlightSpecs: [
      'Weight: 242 grams with flight battery',
      'Downward Visual Positioning System (Monocular Camera + Ultrasound/Infrared ToF)',
      '3-Axis Mechanical Gimbal with micro-brushless motors',
      'Dual-band 2.4GHz / 5.8GHz Enhanced Wi-Fi video transmission',
    ],
    subsystems: [
      {
        name: 'Main Flight Computing & Vision Board',
        description: 'Ultra-dense 10-layer HDI PCB with blind and buried microvias, cooled via intake airflow from propeller wash.',
        chips: ['Ambarella H22 Quad-Core Vision SoC', 'STMicroelectronics STM32F303 Navigation MCU', 'InvenSense ICM-20689 6-Axis Low-Noise IMU'],
      },
      {
        name: 'Electronic Speed Controllers (4-in-1 ESC)',
        description: 'Compact 4-channel brushless motor drivers capable of 8A burst per arm using custom DJI sinusoidal FOC gate drivers.',
        chips: ['Active Semi PAC5223 Motor Controller', 'Fairchild Dual N-Channel 30V MOSFETs'],
      },
      {
        name: '3-Axis Micro Gimbal Controller',
        description: 'Magnetic rotary encoders on pitch, roll, and yaw axes updating at 1,000 Hz for millimeter stabilization.',
        chips: ['AMS AS5048A 14-Bit Magnetic Encoders', 'Texas Instruments DRV8833 Dual H-Bridge Drivers'],
      },
    ],
    bomBreakdown: [
      {
        component: 'Vision & 2.7K Video Encoding SoC',
        partNumber: 'Ambarella H22A',
        manufacturer: 'Ambarella Inc.',
        function: 'H.264 video compression, optical flow visual odometry, and live video downlink',
        package: '409-ball BGA',
        estCost: '$16.50 (₹1,425)',
        openAlternative: 'Raspberry Pi Zero 2W or Rockchip RV1126',
      },
      {
        component: 'Flight Navigation & Autopilot MCU',
        partNumber: 'STM32F303CCT6',
        manufacturer: 'STMicroelectronics',
        function: 'PID attitude control loop running at 400Hz, sensor fusion with Kalman filter',
        package: '48-pin LQFP',
        estCost: '$3.80 (₹328)',
        openAlternative: 'Betaflight F4 / F7 flight controller',
      },
      {
        component: 'Precision 6-Axis IMU (Gyro + Accelerometer)',
        partNumber: 'ICM-20689',
        manufacturer: 'TDK InvenSense',
        function: 'Measures angular velocity and linear acceleration with vibration dampening gel mount',
        package: '16-pin LGA (3x3mm)',
        estCost: '$1.45 (₹125)',
        openAlternative: 'MPU-6050 or Bosch BMI270',
      },
      {
        component: '14-Bit Magnetic Rotary Angle Sensors (x3)',
        partNumber: 'AS5048A',
        manufacturer: 'ams-OSRAM',
        function: 'Absolute angle measurement on gimbal axes to cancel drone tilt in real-time',
        package: '14-pin TSSOP',
        estCost: '$4.20 (₹360 for set)',
        openAlternative: 'AS5600 I2C magnetic encoder',
      },
    ],
    engineeringLessons: [
      'Gram-saving is structural design: Rather than using discrete wiring harnesses, DJI routed motor ESC phase wires and RF antenna cables directly on flex-PCB ribbons molded into the arm hinges.',
      'Mechanical vibration isolation is mandatory: The IMU is mounted on a tiny suspended silicone sub-board; without this, motor resonance saturates the gyro and crashes the quadcopter.',
    ],
  },
  {
    slug: 'india-smart-grid-lorawan-energy-meter',
    title: 'India Smart Grid LoRaWAN Energy Meter (IS 16444 Standard)',
    category: 'Smart Grid & IoT',
    deviceType: 'Automated Metering Infrastructure (AMI)',
    manufacturer: 'Schneider / Secure Meters (India)',
    retailPrice: '₹3,200 (~$37)',
    estimatedBomCost: '₹1,150 (~$13.30)',
    summary:
      'An engineering teardown of the tamper-resistant smart electric meters rolling out to 250 million Indian homes under the RDSS national modernization scheme. Features sub-GHz LoRaWAN telemetry, magnetic anti-tamper sensing, and Class 1.0 metering accuracy.',
    highlightSpecs: [
      'Conforms to Indian Standard IS 16444 (Part 1) and IS 15959 DLMS/COSEM',
      'Semtech SX1262 LoRa transceiver operating on 865-867 MHz India band',
      '10-Year maintenance-free lifetime with 3.6V Lithium Thionyl Chloride (Li-SOCl2) backup battery',
      'Dual optical & magnetic Hall-effect anti-tamper triggers',
    ],
    subsystems: [
      {
        name: 'Metrology (Power Measurement) Unit',
        description: 'Manganin shunt current sensor and metal film resistor voltage divider feeding high-precision 24-bit delta-sigma ADCs.',
        chips: ['Analog Devices ADE7953 Polyphase/Single-Phase Energy Metering IC'],
      },
      {
        name: 'Application Core & DLMS Protocol Stack',
        description: 'Runs DLMS/COSEM object identification system (OBIS) and AES-128 cryptographic billing encryption.',
        chips: ['Microchip SAM L21 Ultra-Low-Power 32-bit ARM Cortex-M0+ (35 µA/MHz)'],
      },
      {
        name: 'Wireless AMI Communication',
        description: 'Transmits hourly kilowatt-hour telemetry to neighborhood data concentrator units (DCU) up to 8 km line-of-sight.',
        chips: ['Semtech SX1262 Sub-GHz LoRa Transceiver (+22 dBm PA)', 'Skyworks SKY65377 RF Front-End Module'],
      },
    ],
    bomBreakdown: [
      {
        component: 'High-Accuracy Energy Measurement IC',
        partNumber: 'ADE7953ACPZ',
        manufacturer: 'Analog Devices',
        function: 'Computes active, reactive, apparent energy, RMS voltage and current with 0.1% accuracy',
        package: '28-lead LFCSP',
        estCost: '$2.10 (₹181)',
        openAlternative: 'Microchip MCP3911 or Cirrus Logic CS5463',
      },
      {
        component: 'Ultra-Low-Power Host Microcontroller',
        partNumber: 'ATSAML21E18B',
        manufacturer: 'Microchip Technology',
        function: 'Executes DLMS/COSEM protocol, logs hourly load profiles, manages tamper interrupts',
        package: '32-pin QFN',
        estCost: '$1.75 (₹151)',
        openAlternative: 'STM32L0 series or ESP32-C3',
      },
      {
        component: 'Sub-GHz LoRa Transceiver',
        partNumber: 'SX1262IMLTRT',
        manufacturer: 'Semtech',
        function: 'Long-range chirp spread spectrum radio on India 865–867 MHz unlicensed band',
        package: '24-pin QFN (4x4mm)',
        estCost: '$2.30 (₹198)',
        openAlternative: 'Ai-Thinker Ra-01SH module',
      },
      {
        component: 'Magnetic Tamper Hall-Effect Sensor',
        partNumber: 'DRV5032FA',
        manufacturer: 'Texas Instruments',
        function: 'Detects illegal external neodymium magnets placed near meter to saturate current transformer',
        package: 'SOT-23',
        estCost: '$0.28 (₹24)',
        openAlternative: 'A3144 Hall Switch',
      },
    ],
    engineeringLessons: [
      'Current shunts beat transformers in India: Current Transformers (CTs) can be blinded by powerful external magnets. Using a 200 µΩ electron-beam welded Manganin shunt makes the meter immune to magnetic tampering.',
      'Power supply resilience against line transients: The Indian grid suffers extreme surges (up to 440V AC when neutral wire is lost). The meter uses a capacitive dropper power supply paired with a 680V Metal Oxide Varistor (MOV) to survive phase faults without burning.',
    ],
  },
];
