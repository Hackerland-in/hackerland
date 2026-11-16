import type { FirmwareRegistryItem } from '@hackerland/core';

export const FIRMWARE_REGISTRY: FirmwareRegistryItem[] = [
  {
    id: 'fw_ardupilot_copter',
    slug: 'ardupilot-copter-h7',
    title: 'ArduPilot Copter 4.5.2 (STM32H7 Dual-Core)',
    tagline: 'DGCA Type-Certification compliant autonomous flight control for hexacopters & agricultural sprayers',
    description:
      'Production flight-proven ArduPilot Copter build compiled specifically for STM32H757/H743 avionics. Features RTK u-blox F9P heading support, dual-redundant CAN-FD bus, bidirectional DShot ESC telemetry, and fail-safe automated Return-to-Launch on lost RC link.',
    targetArch: 'stm32',
    supportedBoards: [
      'Cube Orange+ (STM32H757)',
      'Holybro Kakute H7 v2',
      'Pixhawk 6C Avionics',
      'Matek H743-SLIM',
    ],
    category: 'drone_uav',
    openSourceLicense: 'GPL-3.0',
    sourceRepoUrl: 'https://github.com/ArduPilot/ardupilot',
    author: {
      name: 'ArduPilot Open Source Community',
      org: 'Dronecode / ArduPilot Foundation',
      verifiedBadge: true,
      github: 'https://github.com/ArduPilot',
    },
    flashBaudRate: 921600,
    partitions: [
      {
        name: 'bootloader',
        type: 'boot',
        subType: 'dfu',
        offsetHex: '0x08000000',
        sizeBytes: 131072, // 128 KB
        color: '#3b82f6',
      },
      {
        name: 'firmware_main',
        type: 'app',
        subType: 'copter_rtos',
        offsetHex: '0x08020000',
        sizeBytes: 1900544, // ~1.85 MB
        color: '#10b981',
      },
      {
        name: 'param_storage',
        type: 'data',
        subType: 'eeprom_emulation',
        offsetHex: '0x081F0000',
        sizeBytes: 65536, // 64 KB
        color: '#f59e0b',
      },
    ],
    releases: [
      {
        version: 'v4.5.2',
        channel: 'stable',
        releaseDate: '2026-10-18',
        binaryUrl: 'https://firmware.ardupilot.org/Copter/stable/CubeOrangePlus/arduCopter.bin',
        binaryFormat: 'bin',
        fileSizeBytes: 1900544,
        sha256: '9a4f78e1b34c11874289cfeb3d25890fa2bcae412588c2b54972e2cfc804ab51',
        ed25519Signature: 'ed25519:6c98114...a47b19e2',
        changelog: [
          'Added dual-redundant u-blox F9P RTK moving-baseline yaw support',
          'Optimized STM32H7 cache invalidation for bidirectional DShot telemetry',
          'Fixed terrain following altitude step during high-speed spray passes',
          'DGCA compliance fail-safe geofencing logging enhancements',
        ],
      },
      {
        version: 'v4.6.0-beta1',
        channel: 'beta',
        releaseDate: '2026-11-04',
        binaryUrl: 'https://firmware.ardupilot.org/Copter/beta/CubeOrangePlus/arduCopter.bin',
        binaryFormat: 'bin',
        fileSizeBytes: 1945600,
        sha256: '88de91238914abce00392f4421b569084218ca901289cfabde4201823901bce2',
        ed25519Signature: 'ed25519:90214aa...56b01ef4',
        changelog: [
          'Experimental optical flow hover precision under GPS-denied tree canopies',
          'Thermal runaway battery current limiting integration with CAN BMS',
        ],
      },
    ],
    defaultReleaseVersion: 'v4.5.2',
    instructionsMarkdown: `### Flashing Instructions for STM32H7 Drone Avionics

1. Connect your **Cube Orange+** or **Holybro Kakute H7** to your computer via USB-C.
2. Ensure the board enters DFU bootloader mode:
   - For Cube Orange+, hold the safety switch / boot pad while plugging in USB.
3. Click the **One-Click WebSerial Flash** button above, select the STMicroelectronics DFU device, and monitor the flash progress bar.
4. Alternatively, use standard command line tools:
   \`\`\`bash
   dfu-util -a 0 -s 0x08000000:leave -D arduCopter.bin
   \`\`\`
`,
  },
  {
    id: 'fw_zephyr_bms',
    slug: 'zephyr-ais156-bms',
    title: 'Zephyr RTOS AIS-156 EV Smart BMS Firmware',
    tagline: 'ISO 26262 ASIL-B 16S battery pack controller with active cell balancing & CAN-FD telematics',
    description:
      'Automotive-grade firmware built on Zephyr RTOS 3.6 for electric two-wheelers and commercial 3-wheelers complying with Indian AIS-156 Phase 2 standards. Monitors 16 series cells via TI BQ76952 AFE, detects thermal runaway precursors ($\Delta V > 40\\text{ mV}$), and streams live telematics over CAN 2.0B / CAN-FD.',
    targetArch: 'esp32s3',
    supportedBoards: [
      'ESP32-S3-WROOM-1 (16MB Flash)',
      'Hackerland AIS-156 BMS DevBoard',
      'Waveshare ESP32-S3-CAN',
    ],
    category: 'ev_bms',
    openSourceLicense: 'Apache-2.0',
    sourceRepoUrl: 'https://github.com/zephyrproject-rtos/zephyr',
    author: {
      name: 'OpenEV India Foundation',
      org: 'Consortium of Electric Mobility Makers',
      verifiedBadge: true,
      github: 'https://github.com/openev-india',
    },
    flashBaudRate: 921600,
    partitions: [
      {
        name: 'bootloader',
        type: 'boot',
        subType: 'esp_boot',
        offsetHex: '0x1000',
        sizeBytes: 32768, // 32 KB
        color: '#3b82f6',
      },
      {
        name: 'partition_table',
        type: 'data',
        subType: 'pt',
        offsetHex: '0x8000',
        sizeBytes: 4096, // 4 KB
        color: '#6366f1',
      },
      {
        name: 'otadata',
        type: 'data',
        subType: 'ota',
        offsetHex: '0xd000',
        sizeBytes: 8192, // 8 KB
        color: '#8b5cf6',
      },
      {
        name: 'app0_active',
        type: 'app',
        subType: 'ota_0',
        offsetHex: '0x10000',
        sizeBytes: 1835008, // 1.75 MB
        color: '#10b981',
      },
      {
        name: 'app1_standby',
        type: 'app',
        subType: 'ota_1',
        offsetHex: '0x1D0000',
        sizeBytes: 1835008, // 1.75 MB
        color: '#14b8a6',
      },
      {
        name: 'nvs_calibration',
        type: 'data',
        subType: 'nvs',
        offsetHex: '0x390000',
        sizeBytes: 24576, // 24 KB
        color: '#f59e0b',
      },
      {
        name: 'littlefs_blackbox',
        type: 'data',
        subType: 'littlefs',
        offsetHex: '0x396000',
        sizeBytes: 434176, // ~424 KB
        color: '#ec4899',
      },
    ],
    releases: [
      {
        version: 'v3.6.1-ais156',
        channel: 'stable',
        releaseDate: '2026-11-02',
        binaryUrl: 'https://cdn.hackerland.in/firmware/zephyr-ais156-bms-v3.6.1.bin',
        binaryFormat: 'bin',
        fileSizeBytes: 1835008,
        sha256: '4b7910248ba9cf8214aeb489901456209efca1b5894101ceea09124801be9145',
        ed25519Signature: 'ed25519:124801...bb8904fe',
        changelog: [
          'AIS-156 Phase 2 thermal runaway 5-minute pre-warning audio buzzer trigger',
          'Implemented active passive hybrid cell balancing with 150mA shunt dissipation',
          'CAN-FD telematics packet broadcast at 50Hz for Ather/Ola cluster displays',
          'Dual OTA partition fallback if signature verification fails on boot',
        ],
      },
    ],
    defaultReleaseVersion: 'v3.6.1-ais156',
    instructionsMarkdown: `### Flashing Instructions for ESP32-S3 Smart BMS

1. Connect the ESP32-S3 BMS controller to USB.
2. Put the board into ROM download mode by holding **BOOT** (GPIO0) and pressing **RESET**.
3. Use the **One-Click WebSerial Flash** button to program all partition tables and binaries at 921600 baud.
4. CLI command fallback:
   \`\`\`bash
   esptool.py --chip esp32s3 -p /dev/ttyUSB0 -b 921600 --before default_reset --after hard_reset write_flash \\
     0x1000 bootloader.bin \\
     0x8000 partition_table.bin \\
     0x10000 zephyr_bms.bin
   \`\`\`
`,
  },
  {
    id: 'fw_meshtastic_in865',
    slug: 'meshtastic-in865-mesh',
    title: 'Meshtastic LoRa Off-Grid Mesh (India IN865 Band)',
    tagline: 'Civil defense, disaster management & tactical off-grid communication for the 865-867 MHz band',
    description:
      'WPC de-licensed India IN865 band firmware for decentralised LoRa packet radio networks. Connects smartphone apps over BLE, forwards GPS telemetry coordinates, and routes encrypted text messages peer-to-peer across 15+ km mountain valleys with zero internet or cellular connectivity.',
    targetArch: 'esp32s3',
    supportedBoards: [
      'Heltec WiFi LoRa 32 (V3)',
      'LilyGO T-Beam Supreme S3',
      'LilyGO T-Echo SX1262',
      'SenseCAP Indicator LoRa',
    ],
    category: 'lorawan_iot',
    openSourceLicense: 'GPL-3.0',
    sourceRepoUrl: 'https://github.com/meshtastic/firmware',
    author: {
      name: 'Meshtastic Open Source Team',
      org: 'Meshtastic Project',
      verifiedBadge: true,
      github: 'https://github.com/meshtastic',
    },
    flashBaudRate: 921600,
    partitions: [
      {
        name: 'bootloader',
        type: 'boot',
        subType: 'esp_boot',
        offsetHex: '0x0',
        sizeBytes: 32768,
        color: '#3b82f6',
      },
      {
        name: 'partitions',
        type: 'data',
        subType: 'pt',
        offsetHex: '0x8000',
        sizeBytes: 4096,
        color: '#6366f1',
      },
      {
        name: 'app0',
        type: 'app',
        subType: 'factory',
        offsetHex: '0x10000',
        sizeBytes: 2621440, // 2.5 MB
        color: '#10b981',
      },
      {
        name: 'littlefs',
        type: 'data',
        subType: 'storage',
        offsetHex: '0x290000',
        sizeBytes: 1507328, // ~1.43 MB
        color: '#ec4899',
      },
    ],
    releases: [
      {
        version: 'v2.3.14-in865',
        channel: 'stable',
        releaseDate: '2026-10-25',
        binaryUrl: 'https://github.com/meshtastic/firmware/releases/download/v2.3.14/firmware-esp32s3-in865.bin',
        binaryFormat: 'bin',
        fileSizeBytes: 2621440,
        sha256: '55de190248abef89021481bca0914562098caeb15801ce9048124801be91459a',
        ed25519Signature: 'ed25519:88301...ae045',
        changelog: [
          'Pre-configured India IN865 frequency slot (865.0625 to 867.0000 MHz)',
          'Transmit power locked to statutory +20 dBm EIRP per WPC notification',
          'Enhanced BLE throughput for real-time map offline caching on Android/iOS',
          'Added automatic power saving deep-sleep for solar-backed hilltop repeaters',
        ],
      },
    ],
    defaultReleaseVersion: 'v2.3.14-in865',
    instructionsMarkdown: `### Flashing Instructions for India IN865 Meshtastic

1. Connect your Heltec or LilyGO LoRa radio over USB-C.
2. Click **One-Click WebSerial Flash** and select the CP2102 or CH340 serial port.
3. Once flashing completes, pair your phone over Bluetooth to configure your tactical callsign.
`,
  },
  {
    id: 'fw_mindgrove_secureiot',
    slug: 'mindgrove-secureiot-rv32',
    title: 'Mindgrove SecureIoT RISC-V Hardware Bootloader',
    tagline: 'Bare-metal silicon bootloader & hardware security module drivers for indigenous Indian RISC-V SoC',
    description:
      'Official bootloader and cryptographic peripheral drivers for the Mindgrove SecureIoT RV32IMAC SoC fabricated at SCL 180nm. Supports secure boot with SHA-256 hardware acceleration, AES-256-GCM bus encryption, and dual SPI flash memory mapping.',
    targetArch: 'riscv_rv32',
    supportedBoards: [
      'Mindgrove SecureIoT Evaluation Board',
      'IIT Madras Shakti C-Class Testbed',
      'SCL 180nm Silicon Prototype Shuttle',
    ],
    category: 'rtos',
    openSourceLicense: 'BSD-3-Clause',
    sourceRepoUrl: 'https://github.com/mindgrove-technologies/secureiot-bsp',
    author: {
      name: 'Mindgrove Silicon Engineering',
      org: 'Mindgrove Technologies & IIT Madras',
      verifiedBadge: true,
      github: 'https://github.com/mindgrove-technologies',
    },
    flashBaudRate: 115200,
    partitions: [
      {
        name: 'mask_rom_vector',
        type: 'boot',
        subType: 'trap_vectors',
        offsetHex: '0x00000000',
        sizeBytes: 16384, // 16 KB
        color: '#3b82f6',
      },
      {
        name: 'sram_l2_code',
        type: 'app',
        subType: 'text_rodata',
        offsetHex: '0x20000000',
        sizeBytes: 262144, // 256 KB
        color: '#10b981',
      },
      {
        name: 'qspi_flash_root',
        type: 'data',
        subType: 'firmware_blob',
        offsetHex: '0x80000000',
        sizeBytes: 2097152, // 2 MB
        color: '#f59e0b',
      },
    ],
    releases: [
      {
        version: 'v1.1.0-scl180',
        channel: 'stable',
        releaseDate: '2026-11-10',
        binaryUrl: 'https://cdn.hackerland.in/firmware/mindgrove-secureiot-v1.1.0.bin',
        binaryFormat: 'bin',
        fileSizeBytes: 2097152,
        sha256: '99bc4510248abef89021481bca0914562098caeb15801ce9048124801be91456',
        ed25519Signature: 'ed25519:77104...ee902',
        changelog: [
          'Hardware SHA-256 accelerator register mapping validation',
          'Added JTAG openocd GDB bridge script for OpenOn-Chip debugger',
          'Static timing closure verified at 100 MHz on SCL 180nm CMOS wafer',
        ],
      },
    ],
    defaultReleaseVersion: 'v1.1.0-scl180',
    instructionsMarkdown: `### Flashing Instructions for Mindgrove SecureIoT RISC-V

1. Connect the FTDI USB-UART cable to UART0 (TX: Pin 14, RX: Pin 15, GND).
2. Set Jumper J4 to **SPI_BOOT_PROG**.
3. Use the **One-Click WebSerial Flash** button at 115200 baud to burn the QSPI flash memory.
`,
  },
  {
    id: 'fw_micropython_rp2040',
    slug: 'micropython-rp2040-v122',
    title: 'MicroPython v1.22 Dual-Core PIO Runtime (RP2040)',
    tagline: 'Python for embedded microcontrollers with Programmable I/O (PIO) assembly state machines',
    description:
      'Official MicroPython v1.22 firmware for Raspberry Pi RP2040 microcontrollers. Features native dual-core FreeRTOS threading, 8 state-machine PIO hardware engines (for bit-banging DVI video, WS2812B LED strips, and Manchester decoding), and instant REPL prompt over USB.',
    targetArch: 'rp2040',
    supportedBoards: [
      'Raspberry Pi Pico',
      'Raspberry Pi Pico W',
      'Maker Pi RP2040',
      'Adafruit Feather RP2040',
    ],
    category: 'micropython',
    openSourceLicense: 'MIT',
    sourceRepoUrl: 'https://github.com/micropython/micropython',
    author: {
      name: 'MicroPython Core Developers',
      org: 'George Robotics',
      verifiedBadge: true,
      github: 'https://github.com/micropython',
    },
    flashBaudRate: 115200,
    partitions: [
      {
        name: 'stage2_bootloader',
        type: 'boot',
        subType: 'qspi_xip',
        offsetHex: '0x10000000',
        sizeBytes: 256, // 256 B
        color: '#3b82f6',
      },
      {
        name: 'micropython_core',
        type: 'app',
        subType: 'interpreter',
        offsetHex: '0x10000100',
        sizeBytes: 1048320, // ~1024 KB
        color: '#10b981',
      },
      {
        name: 'littlefs_vfs',
        type: 'data',
        subType: 'vfs',
        offsetHex: '0x10100000',
        sizeBytes: 1048576, // 1 MB
        color: '#ec4899',
      },
    ],
    releases: [
      {
        version: 'v1.22.2',
        channel: 'stable',
        releaseDate: '2026-09-30',
        binaryUrl: 'https://micropython.org/resources/firmware/RPI_PICO-20240930-v1.22.2.uf2',
        binaryFormat: 'uf2',
        fileSizeBytes: 1048576,
        sha256: '77ae190248abef89021481bca0914562098caeb15801ce9048124801be914522',
        ed25519Signature: 'ed25519:33401...ff891',
        changelog: [
          'Added native async io hardware sleep routines',
          'PIO DMA FIFO buffer underrun protection',
          'VFS LittleFS read-ahead buffer speedup for file writes',
        ],
      },
    ],
    defaultReleaseVersion: 'v1.22.2',
    instructionsMarkdown: `### Flashing Instructions for Raspberry Pi Pico (RP2040)

1. Hold the white **BOOTSEL** button on your Pico while plugging it into your computer via USB.
2. A mass storage USB drive named **RPI-RP2** will mount automatically.
3. Click **One-Click UF2 Copy** to save directly to the mounted drive, or drag-and-drop the downloaded \`.uf2\` file.
4. The Pico will reboot immediately into the Python interactive REPL.
`,
  },
  {
    id: 'fw_tinyml_audio_nrf52',
    slug: 'edge-impulse-tinyml-audio',
    title: 'Edge Impulse TinyML Audio Anomaly Detector',
    tagline: 'Ultra low-power machine learning acoustic classifier for industrial motor bearing failures',
    description:
      'Pre-compiled TensorFlow Lite for Microcontrollers (TFLM) binary for nRF52840 microcontrollers. Continuously samples MEMS microphone at 16 kHz, computes Mel-frequency cepstral coefficients (MFCCs), and classifies industrial ball bearing vibration anomalies with 94.2% accuracy while drawing under 4.2 mA.',
    targetArch: 'nrf52',
    supportedBoards: [
      'Arduino Nano 33 BLE Sense',
      'Seeed XIAO BLE nRF52840',
      'Nordic nRF52840-DK',
    ],
    category: 'audio_dsp',
    openSourceLicense: 'Apache-2.0',
    sourceRepoUrl: 'https://github.com/edgeimpulse/example-standalone-inferencing',
    author: {
      name: 'Hackerland Edge AI Squad',
      org: 'Edge Impulse & Hackerland Research',
      verifiedBadge: true,
      github: 'https://github.com/edgeimpulse',
    },
    flashBaudRate: 115200,
    partitions: [
      {
        name: 'softdevice_s140',
        type: 'boot',
        subType: 'nordic_ble',
        offsetHex: '0x00000000',
        sizeBytes: 159744, // ~156 KB
        color: '#3b82f6',
      },
      {
        name: 'tflm_model_weights',
        type: 'data',
        subType: 'quantized_int8',
        offsetHex: '0x00027000',
        sizeBytes: 389120, // ~380 KB
        color: '#f59e0b',
      },
      {
        name: 'inferencing_core',
        type: 'app',
        subType: 'cmsis_dsp',
        offsetHex: '0x00086000',
        sizeBytes: 491520, // ~480 KB
        color: '#10b981',
      },
    ],
    releases: [
      {
        version: 'v2.1.0-tflm',
        channel: 'stable',
        releaseDate: '2026-10-12',
        binaryUrl: 'https://cdn.hackerland.in/firmware/tinyml-audio-nrf52-v2.1.0.hex',
        binaryFormat: 'hex',
        fileSizeBytes: 1040384,
        sha256: '33ca190248abef89021481bca0914562098caeb15801ce9048124801be914511',
        ed25519Signature: 'ed25519:44102...ab781',
        changelog: [
          'Quantized int8 model reduction from 1.4 MB to 380 KB',
          'ARM CMSIS-DSP 16-bit FFT acceleration',
          'BLE notification alert when acoustic anomaly anomaly score > 0.85',
        ],
      },
    ],
    defaultReleaseVersion: 'v2.1.0-tflm',
    instructionsMarkdown: `### Flashing Instructions for Arduino Nano 33 BLE Sense

1. Double-tap the **RESET** button on the Nano 33 BLE so the onboard orange LED pulses in bootloader mode.
2. Click **One-Click WebSerial Flash** or use \`bossac\`:
   \`\`\`bash
   bossac -i -d --port=/dev/ttyACM0 -U -e -w -v -b tinyml-audio-nrf52.bin -R
   \`\`\`
`,
  },
];
