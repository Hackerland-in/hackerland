import type { FeedPost } from '../types';
import {
  PERSON_ARJUN,
  PERSON_KABIR,
  PERSON_LENA,
  PERSON_MEERA,
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
  body: 'Completed the 18 m/s low-Reynolds laminar flow foil evaluation in the IISc open-circuit wind tunnel. Boundary layer separation occurs 4% later than predicted by XFLR5. Full sensor datasets and raw high-speed pressure tap telemetry logs are mirrored at https://hackerland.in/telemetry/reports/2026/stratospheric-glider-flight-envelope-cfd-analysis-dataset-v2-full-raw-sensor-logs-bangalore-iisc-test-track-archive-release.json for anyone reproducing the lift curves.',
  tags: ['aerospace', 'wind-tunnel', 'open-hardware', 'telemetry'],
  createdAt: '2026-11-12T10:30:00Z',
  reactions: 42,
  comments: 8,
  progress: {
    current: 3,
    total: 5,
    label: 'Wind Tunnel Foil Test',
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

export const ALL_POSTS: FeedPost[] = [
  POST_UPDATE_AEROGLIDE,
  POST_QUESTION_I2C,
  POST_SHOWCASE_BRAILLE,
  POST_SQUAD_CALL_SAATHI,
];
