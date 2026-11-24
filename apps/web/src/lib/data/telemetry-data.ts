import type { TelemetryProfile } from '@hackerland/core';

// Helper to generate realistic timeseries data
function generateQuadcopterTelemetry() {
  const samples = [];
  const totalSteps = 60; // 60 seconds at 1Hz
  for (let i = 0; i <= totalSteps; i++) {
    const t = i;
    // Flight phases: 0-10s takeoff, 10-40s survey sweep, 40-50s gust disturbance, 50-60s RTL descent
    let alt = 0;
    let speed = 0;
    let roll = 0;
    let pitch = 0;
    let current = 8.5;
    const batteryV = 50.2 - (i / 60) * 2.8; // discharge from 50.2 to 47.4V

    if (t < 10) {
      alt = (t / 10) * 35;
      speed = (t / 10) * 8;
      pitch = 4.2;
      current = 42 + Math.sin(t) * 3;
    } else if (t < 40) {
      alt = 35 + Math.sin(t * 0.2) * 1.5;
      speed = 12 + Math.sin(t * 0.4) * 2;
      roll = Math.sin(t * 0.3) * 6;
      pitch = 8.5 + Math.cos(t * 0.2) * 2;
      current = 28 + Math.sin(t * 0.5) * 4;
    } else if (t < 50) {
      // Wind gust
      alt = 36 + Math.sin(t * 0.8) * 3.5;
      speed = 9.5;
      roll = Math.sin(t * 1.2) * 18.5; // sudden bank
      pitch = Math.cos(t * 1.1) * 14.0;
      current = 58 + Math.sin(t) * 8; // high corrective power
    } else {
      // Return to launch
      alt = Math.max(0, 35 - ((t - 50) / 10) * 35);
      speed = Math.max(0, 10 - ((t - 50) / 10) * 10);
      roll = Math.sin(t * 0.2) * 2;
      pitch = -2.5;
      current = 22 - ((t - 50) / 10) * 14;
    }

    const payload = Math.max(2.5, 16.0 - (t / 60) * 12.0); // spraying 16L down to 4L

    samples.push({
      timestampMs: t * 1000,
      values: {
        altitude_m: Number(alt.toFixed(1)),
        groundspeed_mps: Number(speed.toFixed(1)),
        battery_v: Number(batteryV.toFixed(2)),
        motor_current_a: Number(current.toFixed(1)),
        roll_deg: Number(roll.toFixed(1)),
        pitch_deg: Number(pitch.toFixed(1)),
        payload_liters: Number(payload.toFixed(1)),
        gps_sats: 22 + (i % 3),
      },
    });
  }
  return samples;
}

function generateAtherBmsTelemetry() {
  const samples = [];
  const totalSteps = 60;
  for (let i = 0; i <= totalSteps; i++) {
    const t = i;
    // EV drive cycle: 0-20s warp mode acceleration, 20-35s regen braking, 35-60s DC fast charging
    let packV = 57.6;
    let packCurrent = 0;
    let maxCellTemp = 32.0;
    let soc = 74.0;
    let cellDeltaMv = 18;
    let motorRpm = 0;
    let inverterTemp = 36.0;

    if (t < 20) {
      // Acceleration
      motorRpm = Math.min(6800, (t / 15) * 6800);
      packCurrent = 95 + Math.sin(t * 0.5) * 15; // 95-110A draw
      packV = 57.6 - (t / 20) * 3.2; // voltage sag
      maxCellTemp = 32.0 + (t / 20) * 4.5;
      soc = 74.0 - (t / 20) * 3.0;
      cellDeltaMv = 18 + t; // load spreads cells slightly
      inverterTemp = 36.0 + (t / 20) * 18.0;
    } else if (t < 35) {
      // Regen braking
      motorRpm = Math.max(0, 6800 - ((t - 20) / 15) * 6800);
      packCurrent = -45 - Math.sin(t * 0.4) * 10; // -45A regen into battery
      packV = 56.5 + ((t - 20) / 15) * 2.8;
      maxCellTemp = 36.5 + ((t - 20) / 15) * 1.5;
      soc = 71.0 + ((t - 20) / 15) * 1.2;
      cellDeltaMv = 38 - (t - 20);
      inverterTemp = 54.0 - ((t - 20) / 15) * 6.0;
    } else {
      // Plugged into 0.8C DC Fast Charger
      motorRpm = 0;
      packCurrent = -32.0; // constant charging current
      packV = 57.0 + ((t - 35) / 25) * 4.8;
      maxCellTemp = 38.0 + ((t - 35) / 25) * 5.2; // warming up to 43.2C
      soc = 72.2 + ((t - 35) / 25) * 18.0; // charging to 90.2%
      cellDeltaMv = 22 + Math.sin(t * 0.3) * 6;
      inverterTemp = 32.0;
    }

    samples.push({
      timestampMs: t * 1000,
      values: {
        pack_voltage_v: Number(packV.toFixed(2)),
        pack_current_a: Number(packCurrent.toFixed(1)),
        max_cell_temp_c: Number(maxCellTemp.toFixed(1)),
        soc_percent: Number(soc.toFixed(1)),
        cell_delta_mv: Number(cellDeltaMv.toFixed(0)),
        motor_rpm: Number(motorRpm.toFixed(0)),
        inverter_temp_c: Number(inverterTemp.toFixed(1)),
      },
    });
  }
  return samples;
}

function generateMindgroveAgriTelemetry() {
  const samples = [];
  const totalSteps = 48; // 24 hours at 30 min samples (represented in seconds)
  for (let i = 0; i <= totalSteps; i++) {
    const hour = (i * 0.5) % 24;
    // Diurnal sunlight and irrigation pulse
    const sunFactor = Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI));
    const ambientTemp = 22.0 + sunFactor * 18.5; // 22C night to 40.5C peak
    const solarPvMv = sunFactor * 5200;
    const supercapV = 2.4 + sunFactor * 1.1;

    // Irrigation drip triggered at hour 7
    let soilMoisture = 28.0;
    if (hour >= 7 && hour < 14) {
      soilMoisture = 28.0 + (hour - 7) * 6.5; // jumps to 73.5%
    } else if (hour >= 14) {
      soilMoisture = Math.max(32, 73.5 - (hour - 14) * 3.8); // drying back down
    }

    const rssi = -92 + Math.sin(i * 0.3) * 6; // -86 to -98 dBm
    const snr = 7.5 + Math.cos(i * 0.4) * 3.5;

    samples.push({
      timestampMs: i * 1800 * 1000, // 30 min intervals
      values: {
        soil_moisture_pct: Number(soilMoisture.toFixed(1)),
        ambient_temp_c: Number(ambientTemp.toFixed(1)),
        solar_pv_mv: Number(solarPvMv.toFixed(0)),
        supercap_v: Number(supercapV.toFixed(2)),
        lora_rssi_dbm: Number(rssi.toFixed(1)),
        lora_snr_db: Number(snr.toFixed(1)),
      },
    });
  }
  return samples;
}

function generateCubeSatTelemetry() {
  const samples = [];
  const totalSteps = 50; // 50 time steps over one 90-min low Earth orbit pass
  for (let i = 0; i <= totalSteps; i++) {
    // Eclipse until step 15, then sunrise
    const inSunlight = i >= 15 && i <= 45;
    const solarFlux = inSunlight ? 118000 + Math.sin(i * 0.2) * 3000 : 0;
    const solarBusCurrent = inSunlight ? 1850 + Math.sin(i * 0.1) * 200 : 15;
    const busVoltage = inSunlight ? 8.2 + Math.sin(i * 0.05) * 0.15 : 7.4 - (i / 15) * 0.3;
    const reactionWheelRpm = 2400 + Math.sin(i * 0.4) * 1200;
    const paTemp = inSunlight ? 18.0 + ((i - 15) / 30) * 22.0 : -4.0 + (i / 15) * 2.0;
    const magField = 42.5 + Math.sin(i * 0.3) * 12.0;

    samples.push({
      timestampMs: i * 100 * 1000,
      values: {
        solar_bus_current_ma: Number(solarBusCurrent.toFixed(0)),
        battery_voltage_v: Number(busVoltage.toFixed(2)),
        reaction_wheel_rpm: Number(reactionWheelRpm.toFixed(0)),
        sun_sensor_lux: Number(solarFlux.toFixed(0)),
        pa_rf_temp_c: Number(paTemp.toFixed(1)),
        mag_field_ut: Number(magField.toFixed(1)),
      },
    });
  }
  return samples;
}

export const TELEMETRY_PROFILES: TelemetryProfile[] = [
  {
    id: 'tel_garuda_drone',
    slug: 'garuda-kisan-drone',
    title: 'Garuda Kisan Agrisprayer 16L Quadcopter',
    subtitle: 'DGCA Type-Certified Hex/Quadcopter flight telemetry with RTK GNSS and autonomous spray sweep',
    deviceType: 'drone_uav',
    hardwareBoard: 'Cube Orange+ STM32H757 Dual-Core Avionics',
    firmwareStack: 'ArduPilot Copter 4.5.1 with MAVLink v2.0',
    sampleRateHz: 1,
    description:
      'Flight log from an automated 16-liter pesticide precision misting run over rice paddies in Mandya, Karnataka. Highlights motor current spikes during autonomous waypoint turnarounds and a 20 m/s sudden crosswind gust.',
    channels: [
      {
        id: 'altitude_m',
        name: 'Baro Altitude',
        unit: 'm',
        type: 'altitude',
        minNominal: 0,
        maxNominal: 45,
        criticalMax: 60,
        color: '#0ea5e9', // sky blue
      },
      {
        id: 'groundspeed_mps',
        name: 'Ground Speed',
        unit: 'm/s',
        type: 'custom',
        minNominal: 0,
        maxNominal: 16,
        criticalMax: 22,
        color: '#10b981', // emerald
      },
      {
        id: 'battery_v',
        name: '12S LiPo Voltage',
        unit: 'V',
        type: 'voltage',
        minNominal: 45.0,
        maxNominal: 50.4,
        criticalMin: 43.5,
        color: '#f59e0b', // amber
      },
      {
        id: 'motor_current_a',
        name: 'Total Motor Current',
        unit: 'A',
        type: 'current',
        minNominal: 10,
        maxNominal: 55,
        criticalMax: 70,
        color: '#ef4444', // red
      },
      {
        id: 'roll_deg',
        name: 'Roll Attitude',
        unit: '°',
        type: 'gyro',
        minNominal: -15,
        maxNominal: 15,
        criticalMin: -35,
        criticalMax: 35,
        color: '#8b5cf6', // purple
      },
      {
        id: 'pitch_deg',
        name: 'Pitch Attitude',
        unit: '°',
        type: 'gyro',
        minNominal: -15,
        maxNominal: 15,
        criticalMin: -30,
        criticalMax: 30,
        color: '#ec4899', // pink
      },
      {
        id: 'payload_liters',
        name: 'Tank Payload',
        unit: 'L',
        type: 'custom',
        minNominal: 1.0,
        maxNominal: 16.0,
        criticalMin: 0.5,
        color: '#06b6d4', // cyan
      },
    ],
    recordedSamples: generateQuadcopterTelemetry(),
  },
  {
    id: 'tel_ather_bms',
    slug: 'ather-450x-ais156',
    title: 'Ather 450X AIS-156 Smart EV Battery Pack',
    subtitle: '16S Li-ion 3.7 kWh traction pack thermal runaway & cell balancing telemetry stream',
    deviceType: 'ev_bms',
    hardwareBoard: 'NXP S32K Automotive MCU + TI BQ76952 AFE',
    firmwareStack: 'AUTOSAR Classic with CAN-FD 2.0B Telematics Gateway',
    sampleRateHz: 1,
    description:
      'Live CAN telemetry trace capturing a Warp Mode high-draw launch onto 100 Feet Road Bengaluru, regenerative descent braking, and high-rate DC fast charging with AIS-156 Phase 2 cell voltage delta monitoring.',
    channels: [
      {
        id: 'pack_voltage_v',
        name: 'Pack Bus Voltage',
        unit: 'V',
        type: 'voltage',
        minNominal: 52.0,
        maxNominal: 67.2,
        criticalMin: 48.0,
        criticalMax: 68.5,
        color: '#3b82f6',
      },
      {
        id: 'pack_current_a',
        name: 'Pack Current (+Draw / -Regen)',
        unit: 'A',
        type: 'current',
        minNominal: -60,
        maxNominal: 115,
        criticalMax: 135,
        color: '#f97316',
      },
      {
        id: 'max_cell_temp_c',
        name: 'Hottest Cell Temp',
        unit: '°C',
        type: 'temperature',
        minNominal: 20,
        maxNominal: 45,
        criticalMax: 60,
        color: '#ef4444',
      },
      {
        id: 'soc_percent',
        name: 'State of Charge (SoC)',
        unit: '%',
        type: 'percentage',
        minNominal: 15,
        maxNominal: 100,
        criticalMin: 10,
        color: '#10b981',
      },
      {
        id: 'cell_delta_mv',
        name: 'Max Cell Imbalance',
        unit: 'mV',
        type: 'voltage',
        minNominal: 0,
        maxNominal: 35,
        criticalMax: 50,
        color: '#eab308',
      },
      {
        id: 'motor_rpm',
        name: 'PMSM Motor Speed',
        unit: 'RPM',
        type: 'rpm',
        minNominal: 0,
        maxNominal: 7200,
        criticalMax: 8000,
        color: '#a855f7',
      },
      {
        id: 'inverter_temp_c',
        name: 'Inverter MOSFET Temp',
        unit: '°C',
        type: 'temperature',
        minNominal: 25,
        maxNominal: 65,
        criticalMax: 80,
        color: '#f43f5e',
      },
    ],
    recordedSamples: generateAtherBmsTelemetry(),
  },
  {
    id: 'tel_mindgrove_lora',
    slug: 'mindgrove-lora-agri',
    title: 'Mindgrove SecureIoT RISC-V LoRaWAN Sensor',
    subtitle: 'Indigenous Indian RISC-V SoC smart agricultural telemetry node in Anantapur',
    deviceType: 'iot_sensor',
    hardwareBoard: 'Mindgrove SecureIoT RV32IMAC 180nm SCL SoC',
    firmwareStack: 'Zephyr RTOS 3.6 with LoRaWAN 1.0.4 Class A',
    sampleRateHz: 0.0005, // 30 min intervals
    description:
      'Telemetry from a solar-powered agricultural sensor deployed in arid Andhra Pradesh. Demonstrates zero-battery supercapacitor energy harvesting, diurnal soil moisture evaporation, and long-range 865 MHz IN865 LoRa link margin.',
    channels: [
      {
        id: 'soil_moisture_pct',
        name: 'Volumetric Soil Moisture',
        unit: '%',
        type: 'percentage',
        minNominal: 25,
        maxNominal: 80,
        criticalMin: 18,
        color: '#0284c7',
      },
      {
        id: 'ambient_temp_c',
        name: 'Canopy Ambient Temp',
        unit: '°C',
        type: 'temperature',
        minNominal: 15,
        maxNominal: 42,
        criticalMax: 48,
        color: '#ea580c',
      },
      {
        id: 'solar_pv_mv',
        name: 'Solar Panel Output',
        unit: 'mV',
        type: 'voltage',
        minNominal: 0,
        maxNominal: 5500,
        color: '#eab308',
      },
      {
        id: 'supercap_v',
        name: 'Supercapacitor Storage',
        unit: 'V',
        type: 'voltage',
        minNominal: 2.3,
        maxNominal: 3.6,
        criticalMin: 2.2,
        color: '#16a34a',
      },
      {
        id: 'lora_rssi_dbm',
        name: 'LoRa RSSI Signal',
        unit: 'dBm',
        type: 'rssi',
        minNominal: -115,
        maxNominal: -50,
        criticalMin: -122,
        color: '#9333ea',
      },
      {
        id: 'lora_snr_db',
        name: 'LoRa Signal-to-Noise',
        unit: 'dB',
        type: 'custom',
        minNominal: -8,
        maxNominal: 12,
        criticalMin: -15,
        color: '#059669',
      },
    ],
    recordedSamples: generateMindgroveAgriTelemetry(),
  },
  {
    id: 'tel_cubesat_adcs',
    slug: 'isro-cubesat-epsc',
    title: 'Dhruva Space 3U CubeSat In-Orbit EPS & ADCS',
    subtitle: 'Low Earth Orbit (500 km SSO) solar bus power and reaction wheel detumbling pass',
    deviceType: 'cubesat_satellite',
    hardwareBoard: 'Microsemi Rad-Tolerant FPGA + CubeSpace ADCS',
    firmwareStack: 'FreeRTOS with CCSDS Space Packet Protocol',
    sampleRateHz: 0.1,
    description:
      'Real telemetry telemetry pass recorded during an eclipse-to-sunlight transition over Sriharikota ground station. Shows solar panel deployment current surge, magnetic torquer momentum dumping, and RF transmitter thermal ramp.',
    channels: [
      {
        id: 'solar_bus_current_ma',
        name: 'Solar Array Current',
        unit: 'mA',
        type: 'current',
        minNominal: 0,
        maxNominal: 2200,
        color: '#eab308',
      },
      {
        id: 'battery_voltage_v',
        name: '2S2P Space Li-ion Bus',
        unit: 'V',
        type: 'voltage',
        minNominal: 7.2,
        maxNominal: 8.35,
        criticalMin: 6.9,
        color: '#3b82f6',
      },
      {
        id: 'reaction_wheel_rpm',
        name: 'Y-Axis Reaction Wheel',
        unit: 'RPM',
        type: 'rpm',
        minNominal: -5000,
        maxNominal: 5000,
        criticalMax: 5800,
        color: '#8b5cf6',
      },
      {
        id: 'sun_sensor_lux',
        name: 'Fine Sun Sensor',
        unit: 'lux',
        type: 'custom',
        minNominal: 0,
        maxNominal: 130000,
        color: '#f97316',
      },
      {
        id: 'pa_rf_temp_c',
        name: 'S-Band PA Temp',
        unit: '°C',
        type: 'temperature',
        minNominal: -10,
        maxNominal: 45,
        criticalMax: 60,
        color: '#ef4444',
      },
      {
        id: 'mag_field_ut',
        name: 'Earth B-Field Norm',
        unit: 'µT',
        type: 'custom',
        minNominal: 25,
        maxNominal: 55,
        color: '#06b6d4',
      },
    ],
    recordedSamples: generateCubeSatTelemetry(),
  },
];
