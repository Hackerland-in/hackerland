import type { FeedPost } from '../types';
import {
  PERSON_ANANYA,
  PERSON_ARJUN,
  PERSON_FARHAN,
  PERSON_KABIR,
  PERSON_KARTHIK,
  PERSON_LENA,
  PERSON_MEERA,
  PERSON_PRANAV,
  PERSON_ROSHNI,
  PERSON_SUNITA,
  PERSON_ZOYA,
} from './people';
import {
  PROJECT_AEROGLIDE_DETAIL,
  PROJECT_OPEN_BRAILLE_DETAIL,
  PROJECT_SAATHI_DETAIL,
} from './projects';

export const POST_UPDATE_AEROGLIDE: FeedPost = {
  id: 'post-aeroglide-update-1',
  kind: 'update',
  author: PERSON_MEERA,
  coAuthors: [PERSON_KABIR, PERSON_ARJUN],
  project: {
    slug: PROJECT_AEROGLIDE_DETAIL.slug,
    title: PROJECT_AEROGLIDE_DETAIL.title,
  },
  title: 'Wind Tunnel Foil Test #3 telemetry logs published',
  body: 'Ran three 18 m/s passes in the IISc low-speed open-circuit tunnel this morning — boundary layer separation crept ~4% further aft than XFLR5 predicted. Uploaded the 200Hz pitot and pressure-tap CSV to Telemetry Studio (hackerland.in/telemetry) so anyone cross-checking lift curves can replay the raw numbers.',
  tags: ['aerospace', 'wind-tunnel', 'open-hardware', 'telemetry'],
  createdAt: '2026-11-12T10:30:00Z',
  reactions: 42,
  comments: 8,
  progress: {
    current: 3,
    total: 5,
    label: 'Wind Tunnel Foil Test',
  },
  telemetry: {
    nodeId: 'AERO-TUNNEL-NODE-04',
    deviceType: 'IISc Wind Tunnel Pitot Array + ESP32-S3',
    status: 'streaming',
    lastPing: '2s ago',
    metrics: [
      { label: 'Airspeed', value: 18.2, unit: 'm/s', trend: 'stable' },
      { label: 'Dynamic Pressure', value: 201.4, unit: 'Pa', trend: 'up' },
      { label: 'Angle of Attack', value: '4.2°', unit: 'deg', trend: 'stable' },
      { label: 'Telemetry RSSI', value: -64, unit: 'dBm', trend: 'stable' },
    ],
  },
};

export const POST_QUESTION_I2C: FeedPost = {
  id: 'post-question-i2c-1',
  kind: 'question',
  author: PERSON_KABIR,
  project: {
    slug: PROJECT_AEROGLIDE_DETAIL.slug,
    title: PROJECT_AEROGLIDE_DETAIL.title,
  },
  title: 'Recovering from bus lockups on shared I2C bus with BNO085 and MS5611 at 400kHz?',
  body: 'When polling the BNO085 IMU and MS5611 altimeter over the same STM32 I2C1 peripheral at 400kHz, the bus occasionally hangs with SDA held low indefinitely after a clock stretch. What is the cleanest hardware/firmware recovery sequence without rebooting the whole flight controller?',
  tags: ['stm32', 'embedded-c', 'i2c', 'sensors'],
  createdAt: '2026-11-10T14:15:00Z',
  reactions: 19,
  comments: 5,
  code: {
    filename: 'i2c_bus_scan.c',
    language: 'c',
    source: `void i2c_check_sda_stuck(I2C_TypeDef *i2c) {
  if (HAL_GPIO_ReadPin(GPIOB, GPIO_PIN_9) == GPIO_PIN_RESET) {
    // SDA line is held low by peripheral
    i2c_manual_clock_toggle();
  }
}`,
  },
  acceptedAnswer: {
    author: PERSON_ARJUN,
    body: 'Generate 9 manual SCL clock pulses in GPIO bit-bang mode to clock out the stuck slave state machine, followed by a standard STOP condition. Here is the verified recovery routine we run on the KisanSense sensor nodes:',
    code: {
      filename: 'i2c_recovery.c',
      language: 'c',
      source: `void i2c_bus_recover(void) {
  GPIO_InitTypeDef GPIO_InitStruct = {0};
  GPIO_InitStruct.Pin = GPIO_PIN_8 | GPIO_PIN_9;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_OD;
  GPIO_InitStruct.Pull = GPIO_PULLUP;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_VERY_HIGH;
  HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);

  for (int i = 0; i < 9; i++) {
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_8, GPIO_PIN_RESET);
    delay_us(5);
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_8, GPIO_PIN_SET);
    delay_us(5);
  }
  // Generate STOP
  HAL_GPIO_WritePin(GPIOB, GPIO_PIN_9, GPIO_PIN_RESET);
  delay_us(5);
  HAL_GPIO_WritePin(GPIOB, GPIO_PIN_8, GPIO_PIN_SET);
  delay_us(5);
  HAL_GPIO_WritePin(GPIOB, GPIO_PIN_9, GPIO_PIN_SET);
}`,
    },
  },
};

export const POST_SHOWCASE_BRAILLE: FeedPost = {
  id: 'post-showcase-braille-1',
  kind: 'showcase',
  author: PERSON_ZOYA,
  coAuthors: [PERSON_LENA],
  project: {
    slug: PROJECT_OPEN_BRAILLE_DETAIL.slug,
    title: PROJECT_OPEN_BRAILLE_DETAIL.title,
  },
  title: 'OpenBraille Slate v2 functional prototype assembled with recycled PLA',
  body: 'We just assembled the first 40-cell tactile display prototype using custom 3D printed mechanical latches and miniature 5V solenoids. BOM cost came out to $68.40 per unit — well below our $75 target! Tactile pin retention was verified across 25,000 actuation cycles without mechanical fatigue.',
  tags: ['accessibility', '3d-printing', 'open-hardware', 'braille'],
  createdAt: '2026-11-09T18:00:00Z',
  reactions: 67,
  comments: 14,
  progress: {
    current: 2,
    total: 4,
    label: 'Cell Actuation Cycle Testing',
  },
};

export const POST_SQUAD_CALL_SAATHI: FeedPost = {
  id: 'post-squad-call-saathi-1',
  kind: 'squad-call',
  author: PERSON_ARJUN,
  project: {
    slug: PROJECT_SAATHI_DETAIL.slug,
    title: PROJECT_SAATHI_DETAIL.title,
  },
  title: 'Saathi Voice AI is recruiting Bhojpuri & Maithili phonetics contributors',
  body: 'We are expanding Saathi to rural community healthcare centers in Bihar and eastern UP. We need native dialect speakers and computational phoneticians to help audit acoustic tokens and phoneme transitions.',
  tags: ['speech-ai', 'indic-nlp', 'open-roles', 'bounty'],
  createdAt: '2026-11-08T09:00:00Z',
  reactions: 31,
  comments: 7,
  squadCall: {
    openRoles: PROJECT_SAATHI_DETAIL.openRoles,
    funding: PROJECT_SAATHI_DETAIL.funding,
  },
};

export const POST_UPDATE_RAJKOT_PUMP: FeedPost = {
  id: 'post-rajkot-pump-update-1',
  kind: 'update',
  author: PERSON_PRANAV,
  project: {
    slug: 'kisan-sense',
    title: 'KisanSense Borewell & Soil Edge',
  },
  title: 'Rajkot Shapar dyno run: IE4 sensorless BLDC retrofit hit 88.4% pump-shaft efficiency',
  body: 'Swapped our legacy 5HP cast-iron induction rotor for an NdFeB rotor machined on IGTR 5-axis fixtures and tested a custom STM32 FOC controller across 48V–320V solar strings. No electrolytic DC bus capacitor dried out after a 72-hour 55°C chamber soak — dry-run auto-shutdown tripped cleanly in 3.2 seconds.',
  tags: ['rajkot', 'bldc-foc', 'solar-pump', 'ie4-efficiency'],
  createdAt: '2026-11-11T16:40:00Z',
  reactions: 54,
  comments: 11,
  progress: {
    current: 4,
    total: 5,
    label: 'BIS IS 8034 Endurance Run',
  },
  telemetry: {
    nodeId: 'RAJKOT-DYNO-02',
    deviceType: '5HP BLDC Borewell Rig + IGTR Torque Meter',
    status: 'streaming',
    lastPing: '6s ago',
    metrics: [
      { label: 'Shaft Efficiency', value: 88.4, unit: '%', trend: 'up' },
      { label: 'MOSFET Case Temp', value: 61.8, unit: '°C', trend: 'stable' },
      { label: 'Dry-Run Trip', value: 3.2, unit: 's', trend: 'stable' },
      { label: 'Flow Rate @ 40m', value: 215, unit: 'L/min', trend: 'up' },
    ],
  },
};

export const POST_SHOWCASE_TIRUPPUR_DYE: FeedPost = {
  id: 'post-tiruppur-dye-showcase-1',
  kind: 'showcase',
  author: PERSON_KARTHIK,
  coAuthors: [PERSON_ZOYA],
  title: 'Open dye-house inline spectrometer cut RO membrane cleaning cycles in half for 6 Tiruppur MSMEs',
  body: 'German apparel buyers kept flagging residual azo dye swings and forcing full lot re-washes. Built an inline 4-wavelength LED colorimetry + pH probe in a borosilicate flow cell for ₹14,800 BOM cost (compared to ₹3.8L imported racks) logging ZDHC-ready CSV batches directly to buyers.',
  tags: ['tiruppur', 'technical-textiles', 'oeko-tex', 'export-qa'],
  createdAt: '2026-11-11T09:20:00Z',
  reactions: 73,
  comments: 16,
  progress: {
    current: 3,
    total: 4,
    label: 'EU REACH Pilot Validation',
  },
};

export const POST_QUESTION_GUWAHATI_BAMBOO: FeedPost = {
  id: 'post-question-guwahati-bamboo-1',
  kind: 'question',
  author: PERSON_ANANYA,
  title: 'Best zero-isocyanate moisture barrier when laminating Dendrocalamus hamiltonii bamboo floats for monsoon river buoys?',
  body: 'Our Brahmaputra flash-flood LoRa river nodes sit submerged for 3–5 days during surge peaks. Standard PU varnish delaminates once cyclic river silt abrades the grain. Has anyone tested CNSL (cashew nut shell liquid) bio-resin vs beeswax-rosin vacuum impregnation for water absorption < 6% after 14 days?',
  tags: ['guwahati', 'bamboo-composites', 'flood-iot', 'materials'],
  createdAt: '2026-11-10T07:50:00Z',
  reactions: 28,
  comments: 9,
  acceptedAnswer: {
    author: PERSON_PRANAV,
    body: 'Pre-heat the boron-treated strips at 105°C for 90 minutes, then pull -0.85 bar vacuum in a warm CNSL + cardanol epoxide bath before hot pressing at 135°C. At our Rajkot marine flange trials, water uptake stayed below 4.1% even after silt-slurry tumbling:',
    code: {
      filename: 'bamboo_cure_schedule.py',
      language: 'python',
      source: `def check_moisture_spec(dry_mass_g: float, soaked_14d_g: float) -> bool:
    uptake_pct = ((soaked_14d_g - dry_mass_g) / dry_mass_g) * 100.0
    print(f"Moisture uptake: {uptake_pct:.2f}% (target <= 6.0%)")
    return uptake_pct <= 6.0`,
    },
  },
};

export const POST_UPDATE_KASHMIR_SOLAR: FeedPost = {
  id: 'post-kashmir-solar-update-1',
  kind: 'update',
  author: PERSON_FARHAN,
  title: 'Leh -14°C overnight test: resistive pre-heat loop kept LFP pack above +4°C using 4.8% daily yield',
  body: 'Deploying cold-storage controllers in Ladakh means never charging LiFePO4 cells below 0°C. Added a thermostatically gated Kapton heater pad driven straight off the solar panel open-circuit excess before enabling MPPT buck charging. Posting the firmware state guard we verified at CSIR-IIIM Srinagar BioNEST.',
  tags: ['srinagar', 'ladakh', 'solar-mppt', 'cold-chain'],
  createdAt: '2026-11-09T08:15:00Z',
  reactions: 46,
  comments: 12,
  code: {
    filename: 'cold_lfp_guard.c',
    language: 'c',
    source: `bool allow_mppt_charge(float cell_temp_c, float pv_volts) {
  if (cell_temp_c < 2.0f) {
    enable_kapton_preheat(pv_volts > 16.5f);
    return false; // Hold charge MOSFET off until cell > +2C
  }
  enable_kapton_preheat(false);
  return true;
}`,
  },
};

export const POST_SQUAD_CALL_ODISHA_ONDC: FeedPost = {
  id: 'post-squad-call-odisha-ondc-1',
  kind: 'squad-call',
  author: PERSON_SUNITA,
  coAuthors: [PERSON_ROSHNI],
  title: 'Building Voice-to-ONDC & Export Packing-List Copilot for Bihar Makhana & Chilika FPOs — Join our Software/DPI Squad',
  body: 'We are combining Bhashini ULCA streaming ASR in Odia, Bhojpuri, Maithili, and Assamese with a Beckn v1.2 + DGFT 8-digit HSN matcher so rural food-processing units can list wholesale export lots without writing English spreadsheets. Looking for a TypeScript/Next.js frontend builder and an FSSAI/APEDA schema reviewer.',
  tags: ['bhubaneswar', 'patna', 'ondc-dpi', 'bhashini-ai'],
  createdAt: '2026-11-07T11:30:00Z',
  reactions: 62,
  comments: 19,
  squadCall: {
    openRoles: [
      {
        id: 'role-ondc-ts',
        title: 'ONDC Beckn Schema & Next.js Builder',
        track: 'code',
        skills: ['TypeScript', 'Beckn v1.2', 'Next.js'],
        description:
          'Wire voice JSON outputs to ONDC catalog & auto-generate commercial invoice PDFs (Founding co-builder equity + Startup Odisha grant split).',
        compensation: { type: 'equity' },
      },
      {
        id: 'role-export-hsn',
        title: 'APEDA / FSSAI Export Catalogue Specialist',
        track: 'earn',
        skills: ['ITC-HS Codes', 'FSSAI', 'B2B Exports'],
        description: 'Validate phytosanitary, lot weight & buyer packing requirements for spice/makhana co-ops.',
        compensation: { type: 'stipend', amount: 30000, currency: 'INR', period: 'month' },
      },
    ],
    funding: { goal: 500000, raised: 320000, currency: 'INR' },
  },
};

export const ALL_POSTS: FeedPost[] = [
  POST_UPDATE_AEROGLIDE,
  POST_UPDATE_RAJKOT_PUMP,
  POST_SHOWCASE_TIRUPPUR_DYE,
  POST_QUESTION_I2C,
  POST_QUESTION_GUWAHATI_BAMBOO,
  POST_SHOWCASE_BRAILLE,
  POST_UPDATE_KASHMIR_SOLAR,
  POST_SQUAD_CALL_SAATHI,
  POST_SQUAD_CALL_ODISHA_ONDC,
];
