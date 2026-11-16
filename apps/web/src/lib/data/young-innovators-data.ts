import type { JuniorChallenge, JuniorShowcaseProject } from '@hackerland/core';

export interface VisualBlockItem {
  id: string;
  type: 'sensor_read' | 'condition' | 'actuator_output' | 'delay';
  label: string;
  color: string;
  codeSnippetPython: string;
  codeSnippetCpp: string;
}

export interface VisualBlockPreset {
  id: string;
  title: string;
  description: string;
  targetBoard: string;
  blocks: VisualBlockItem[];
  generatedPython: string;
  generatedCpp: string;
  simulatedOutput: string;
}

export const VISUAL_BLOCK_PRESETS: VisualBlockPreset[] = [
  {
    id: 'preset_soil_water',
    title: 'Smart Plant Hydrator (MicroPython & C++)',
    description: 'Reads capacitive soil moisture sensor and engages a 5V water pump relay when dryness exceeds threshold.',
    targetBoard: 'Raspberry Pi Pico (RP2040) / BBC Micro:bit',
    blocks: [
      {
        id: 'b1',
        type: 'sensor_read',
        label: 'READ Analog Pin 26 (Soil Moisture)',
        color: 'from-blue-600 to-cyan-600',
        codeSnippetPython: 'moisture_raw = adc_pin.read_u16()',
        codeSnippetCpp: 'int moisture_raw = analogRead(A0);',
      },
      {
        id: 'b2',
        type: 'condition',
        label: 'IF moisture_raw < 20000 (Soil Dry)',
        color: 'from-amber-600 to-orange-600',
        codeSnippetPython: 'if moisture_raw < 20000:',
        codeSnippetCpp: 'if (moisture_raw < 350) {',
      },
      {
        id: 'b3',
        type: 'actuator_output',
        label: 'TURN ON Relay Pin 15 (Water Pump)',
        color: 'from-emerald-600 to-green-600',
        codeSnippetPython: '    relay_pin.value(1)\n    print("[STATUS] Pump Active - Watering Soil...")',
        codeSnippetCpp: '    digitalWrite(RELAY_PIN, HIGH);\n    Serial.println("[STATUS] Pump Active");',
      },
      {
        id: 'b4',
        type: 'delay',
        label: 'WAIT 4 Seconds & STOP Pump',
        color: 'from-purple-600 to-indigo-600',
        codeSnippetPython: '    time.sleep(4)\n    relay_pin.value(0)',
        codeSnippetCpp: '    delay(4000);\n    digitalWrite(RELAY_PIN, LOW);\n}',
      },
    ],
    generatedPython: `# MicroPython for Raspberry Pi Pico
from machine import Pin, ADC
import time

adc_pin = ADC(Pin(26))
relay_pin = Pin(15, Pin.OUT)

print("[INIT] Young Innovators Plant Hydration System Ready")
while True:
    moisture_raw = adc_pin.read_u16()
    print("Soil Moisture Level:", moisture_raw)
    if moisture_raw < 20000:
        relay_pin.value(1)
        print("[STATUS] Pump Active - Watering Soil...")
        time.sleep(4)
        relay_pin.value(0)
    time.sleep(10)`,
    generatedCpp: `// Arduino / C++ Embedded
#define MOISTURE_PIN A0
#define RELAY_PIN 15

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  Serial.println("[INIT] Plant Hydrator Active");
}

void loop() {
  int moisture = analogRead(MOISTURE_PIN);
  if (moisture < 350) {
    digitalWrite(RELAY_PIN, HIGH);
    Serial.println("[STATUS] Pump Active");
    delay(4000);
    digitalWrite(RELAY_PIN, LOW);
  }
  delay(10000);
}`,
    simulatedOutput: '[21:18:00] Initializing ADC 26 on RP2040...\n[21:18:01] Sensor reading: 14,200 (PARCHED)\n[21:18:02] Relay Pin 15 -> HIGH (5V DC Solenoid Active)\n[21:18:06] Soil moisture increased to 38,400. Relay Pin 15 -> LOW (Closed).',
  },
  {
    id: 'preset_ultrasonic_alarm',
    title: 'School Bag Distance & Intruder Radar',
    description: 'Measures proximity using HC-SR04 ultrasonic echo pulses and triggers a piezo buzzer warning if an object approaches closer than 30 cm.',
    targetBoard: 'Arduino Uno / RP2040',
    blocks: [
      {
        id: 'b_us1',
        type: 'sensor_read',
        label: 'TRIGGER HC-SR04 10µs Sound Pulse',
        color: 'from-blue-600 to-cyan-600',
        codeSnippetPython: 'dist_cm = measure_distance_cm()',
        codeSnippetCpp: 'long distance = sonar.ping_cm();',
      },
      {
        id: 'b_us2',
        type: 'condition',
        label: 'IF distance < 30 cm (Proximity Alert)',
        color: 'from-amber-600 to-orange-600',
        codeSnippetPython: 'if dist_cm < 30:',
        codeSnippetCpp: 'if (distance > 0 && distance < 30) {',
      },
      {
        id: 'b_us3',
        type: 'actuator_output',
        label: 'TONE Piezo Buzzer Pin 12 @ 2400Hz',
        color: 'from-emerald-600 to-green-600',
        codeSnippetPython: '    buzzer.duty_u16(32768)\n    buzzer.freq(2400)',
        codeSnippetCpp: '    tone(BUZZER_PIN, 2400, 200);',
      },
      {
        id: 'b_us4',
        type: 'delay',
        label: 'SLEEP 200ms',
        color: 'from-purple-600 to-indigo-600',
        codeSnippetPython: '    time.sleep(0.2)\n    buzzer.duty_u16(0)',
        codeSnippetCpp: '    delay(200);\n}',
      },
    ],
    generatedPython: `# MicroPython Ultrasonic Proximity Radar
from machine import Pin, PWM
import time

trig = Pin(2, Pin.OUT)
echo = Pin(3, Pin.IN)
buzzer = PWM(Pin(12))

while True:
    trig.low()
    time.sleep_us(2)
    trig.high()
    time.sleep_us(10)
    trig.low()
    # Calculate pulse duration...
    dist_cm = 24.5 # simulated
    if dist_cm < 30:
        buzzer.freq(2400)
        buzzer.duty_u16(32768)
        time.sleep(0.2)
        buzzer.duty_u16(0)
    time.sleep(0.1)`,
    generatedCpp: `// Arduino C++ Proximity Alert
#include <NewPing.h>
NewPing sonar(2, 3, 200);

void setup() {
  pinMode(12, OUTPUT);
}

void loop() {
  int distance = sonar.ping_cm();
  if (distance > 0 && distance < 30) {
    tone(12, 2400, 200);
  }
  delay(100);
}`,
    simulatedOutput: '[21:18:10] Ultrasonic radar ping active.\n[21:18:11] Target detected at 24.5 cm (< 30 cm limit)\n[21:18:12] Piezo buzzer chirp 2.4kHz pulse triggered.\n[21:18:13] Target retreated to 65 cm. Standby mode.',
  },
];

export const JUNIOR_CHALLENGES: JuniorChallenge[] = [
  {
    id: 'chal_soil_buddy',
    title: 'Smart Plant Hydration Alert Buddy',
    ageBracket: 'junior_8_11',
    difficulty: 'starter',
    hardwareKit: ['BBC Micro:bit v2', 'Soil Moisture Nails', 'Submersible 5V Pump', 'Alligator Clips'],
    learningOutcomes: [
      'Understanding soil moisture resistivity',
      'Visual if-else logic blocks',
      'Safe low-voltage (5V) power wiring',
    ],
    prizeOrBadge: 'Eco-Maker Junior Badge + Seed Kit',
    safetySupervisionRequired: true,
    summary:
      'Build a cheerful plant pot monitor that displays a sad face LED on the micro:bit when soil is parched and plays a melody when watered.',
    estimatedTimeHours: 3.5,
  },
  {
    id: 'chal_safe_bus_tag',
    title: 'School Bus Safe Arrival RFID Beacon',
    ageBracket: 'intermediate_12_14',
    difficulty: 'builder',
    hardwareKit: ['Raspberry Pi Pico', 'RC522 RFID Reader', '13.56MHz Keyfob', 'I2C 16x2 LCD'],
    learningOutcomes: [
      'SPI protocol bus communication',
      'Unique ID RFID token validation',
      'MicroPython structured programming',
    ],
    prizeOrBadge: 'Smart Mobility Badge + Pico W Board',
    safetySupervisionRequired: true,
    summary:
      'Create an automated tap-in badge scanner for school buses that displays the student name on an LCD screen and logs attendance timestamps.',
    estimatedTimeHours: 6.0,
  },
  {
    id: 'chal_delhi_clean_air_rover',
    title: 'Mission Clean Air Mini-Rover',
    ageBracket: 'intermediate_12_14',
    difficulty: 'builder',
    hardwareKit: ['ESP32 NodeMCU', 'PMS5003 Dust Sensor', '2WD Robot Chassis', 'L298N Motor Driver'],
    learningOutcomes: [
      'Laser scattering particulate measurement (PM2.5 / PM10)',
      'PWM motor speed control',
      'Local Wi-Fi web telemetry dashboard',
    ],
    prizeOrBadge: 'Clean Air Pioneer Badge + Air Quality Sensor',
    safetySupervisionRequired: true,
    summary:
      'Assemble a 2-wheeled rover that autonomously patrols a school corridor or courtyard, mapping PM2.5 air pollution hot-spots.',
    estimatedTimeHours: 8.5,
  },
  {
    id: 'chal_cansat_junior',
    title: 'Miniature CanSat Atmospheric Telemetry Probe',
    ageBracket: 'senior_15_17',
    difficulty: 'innovator',
    hardwareKit: ['RP2040 Zero MCU', 'BMP280 Barometer', 'SX1262 LoRa Radio', '3D Printed Soda-Can Chassis'],
    learningOutcomes: [
      'Barometric altitude calculation & lapse rate',
      'Sub-GHz LoRa radio packet modulation',
      'Parachute descent terminal velocity aerodynamics',
    ],
    prizeOrBadge: 'Junior Aerospace Fellow + ISRO Launchpad Visit',
    safetySupervisionRequired: true,
    summary:
      'Design, integrate, and launch a soda-can sized atmospheric satellite dropped from a drone to transmit real-time pressure, altitude, and temperature telemetry.',
    estimatedTimeHours: 14.0,
  },
  {
    id: 'chal_prosthetic_hand',
    title: '3D Printed Tendon-Actuated Bionic Hand',
    ageBracket: 'senior_15_17',
    difficulty: 'innovator',
    hardwareKit: ['SG90 Micro Servos (5x)', 'Flex Sensors', 'Arduino Nano', 'PETG 3D Printed Phalanges'],
    learningOutcomes: [
      'Biomechanical kinematics & cable tendon tensioning',
      'Analog flex glove resistive mapping',
      'Micro-servo multi-channel coordination',
    ],
    prizeOrBadge: 'Assistive Tech Hero + ₹25,000 Component Grant',
    safetySupervisionRequired: true,
    summary:
      'Construct a lightweight mechanical prosthetic hand capable of gripping cups and picking up pens, controlled by wearable finger flex sensors.',
    estimatedTimeHours: 16.0,
  },
];

export const JUNIOR_SHOWCASE_PROJECTS: JuniorShowcaseProject[] = [
  {
    id: 'proj_aditya_water',
    slug: 'aditya-auto-cattle-trough',
    title: 'Automated Solar Cattle Water Dispenser',
    builderName: 'Aditya Sharma',
    builderAge: 12,
    city: 'Jaipur',
    schoolOrAtl: 'Govt Model Sr Sec School ATL Lab',
    ageBracket: 'intermediate_12_14',
    summary:
      'Created an ultrasonic water level regulator powered by a 10W solar panel and 18650 cell that keeps cattle troughs full in rural Rajasthan without overflowing.',
    materialsUsed: ['Raspberry Pi Pico', 'HC-SR04 Ultrasonic Sensor', '12V DC Solenoid Valve', '10W Solar Panel'],
    mentorName: 'Er. Rajesh Gurjar (AIM ATL Mentor)',
    verifiedGuardianCoSigned: true,
    unlockedBadge: 'Rural Impact Tinkerer',
    demoVideoOrDocUrl: 'https://hackerland.in/proof/aditya-trough.mp4',
  },
  {
    id: 'proj_meera_flood',
    slug: 'meera-flood-siren',
    title: 'Low-Cost Backwaters Flood Warning Siren',
    builderName: 'Meera Nair',
    builderAge: 14,
    city: 'Kochi',
    schoolOrAtl: 'Kendriya Vidyalaya No. 1 Kalamassery',
    ageBracket: 'intermediate_12_14',
    summary:
      'Engineered an immersion float switch beacon attached to bridge piers that sounds a high-decibel siren and flashes strobe LEDs when floodwaters rise above safety marks.',
    materialsUsed: ['ESP32', 'Magnetic Reed Float Switch', '100dB Piezo Siren', 'Rechargeable 3.7V Li-ion'],
    mentorName: 'Dr. Ramesh Nair (Maker Village)',
    verifiedGuardianCoSigned: true,
    unlockedBadge: 'Disaster Relief Maker',
    demoVideoOrDocUrl: 'https://hackerland.in/proof/meera-flood.mp4',
  },
  {
    id: 'proj_kabir_solar',
    slug: 'kabir-lifepo4-lantern',
    title: 'Sub-₹500 Solar Micro-Lantern with LiFePO4 Battery',
    builderName: 'Kabir Mehta',
    builderAge: 16,
    city: 'Pune',
    schoolOrAtl: 'COEP Junior Tinkering Garages',
    ageBracket: 'senior_15_17',
    summary:
      'Designed a custom 2-layer KiCad PCB using a safe 3.2V LiFePO4 18650 cell (eliminating fire risks) with USB-C charging and 18 hours of bright LED study light for rural students.',
    materialsUsed: ['Custom PCB', 'LiFePO4 18650 Cell', 'TP5000 Charge Controller', 'Samsung 2835 LEDs'],
    mentorName: 'Prof. Jayant Kulkarni',
    verifiedGuardianCoSigned: true,
    unlockedBadge: 'Clean Energy Architect',
    demoVideoOrDocUrl: 'https://hackerland.in/proof/kabir-lantern.mp4',
  },
  {
    id: 'proj_ananya_bin',
    slug: 'ananya-smart-waste-bin',
    title: 'Talking Touchless Smart Waste Bin',
    builderName: 'Ananya Sengupta',
    builderAge: 11,
    city: 'Kolkata',
    schoolOrAtl: 'South Point High School ATL',
    ageBracket: 'junior_8_11',
    summary:
      'Used a Micro:bit and servo motor to automatically lift bin lids when hands are detected, while playing friendly audio prompts reminding peers to segregate wet and dry waste.',
    materialsUsed: ['BBC Micro:bit v2', 'HC-SR04', 'TowerPro SG90 Servo', 'DFPlayer Mini MP3'],
    mentorName: 'Sunita Sen (ATL Lead)',
    verifiedGuardianCoSigned: true,
    unlockedBadge: 'Eco-Kid Pioneer',
    demoVideoOrDocUrl: 'https://hackerland.in/proof/ananya-bin.mp4',
  },
];
