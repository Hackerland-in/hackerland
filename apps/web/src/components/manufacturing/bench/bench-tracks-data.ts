export interface BenchPin {
  pinNumber: number;
  label: string;
  gpio: string;
  type: 'power' | 'ground' | 'digital' | 'analog' | 'i2c' | 'spi' | 'uart';
  voltage: '3.3V' | '5V' | 'GND';
  connectedTo?: string;
  wireColor?: string;
  description: string;
}

export interface CodeLine {
  lineNumber: number;
  code: string;
  isExecutable: boolean;
  explanation: string;
  hardwareAction?: string;
}

export interface BenchTrack {
  id: string;
  title: string;
  pillarId: string;
  subtitle: string;
  targetMcu: string;
  clockSpeed: string;
  protocols: string[];
  firmwareCode: CodeLine[];
  pins: BenchPin[];
  quickCommands: string[];
  initialSerialLogs: string[];
  defaultPotVoltage: number; // 0.0 - 3.3
  defaultButtonState: boolean;
  defaultLedColor: string;
}

export const BENCH_TRACKS: BenchTrack[] = [
  {
    id: 'esp32-display',
    title: 'ESP32-S3 IoT Bench & I2C OLED Display',
    pillarId: 'pcb',
    subtitle: 'Dual-core Xtensa LX7 with SSD1306 128x64 OLED and WS2812B NeoPixel',
    targetMcu: 'ESP32-S3-WROOM-1 (8MB Flash / 512KB SRAM)',
    clockSpeed: '240 MHz',
    protocols: ['I2C (Fast Mode 400kHz)', 'GPIO Interrupts', '12-bit SAR ADC', 'One-Wire NeoPixel'],
    defaultPotVoltage: 1.65,
    defaultButtonState: false,
    defaultLedColor: '#10b981',
    quickCommands: ['HELP', 'STATUS', 'SCAN', 'ADC', 'LED #3b82f6', 'DISPLAY HACKERLAND', 'CLEAR'],
    initialSerialLogs: [
      '[BOOT] ESP32-S3 ROM Core 0 (v0.1) - Flash 8MB Quad-SPI',
      '[INIT] Setting system clock to 240MHz PLL',
      '[I2C] Initializing Wire bus on SDA: GPIO 21, SCL: GPIO 22 (400kHz)',
      '[SSD1306] Display found at address 0x3C - 128x64 buffer allocated',
      '[ADC] Initializing ADC1_CH0 on GPIO 1 (Attenuation: 11dB, 0-3.3V)',
      '[NEOPIXEL] GPIO 48 configured for single WS2812B GRB timing',
      '[SYSTEM] Ready for serial commands at 115200 baud',
    ],
    pins: [
      { pinNumber: 1, label: '3V3', gpio: 'POWER', type: 'power', voltage: '3.3V', connectedTo: 'OLED VCC & Pot Rail', wireColor: 'text-error', description: 'Regulated 3.3V power supply rail (up to 500mA)' },
      { pinNumber: 2, label: 'GND', gpio: 'GROUND', type: 'ground', voltage: 'GND', connectedTo: 'OLED GND & Pot Ground', wireColor: 'text-fg-subtle', description: 'Common system electrical reference ground' },
      { pinNumber: 3, label: 'GPIO 1', gpio: 'ADC1_CH0', type: 'analog', voltage: '3.3V', connectedTo: 'Potentiometer Wiper (Analog In)', wireColor: 'text-warning', description: '12-bit Analog-to-Digital Converter channel 0' },
      { pinNumber: 4, label: 'GPIO 0', gpio: 'BOOT_BTN', type: 'digital', voltage: '3.3V', connectedTo: 'Tactile Pushbutton 1 (Pull-up)', wireColor: 'text-accent', description: 'Boot strapping pin with internal 45kΩ pull-up' },
      { pinNumber: 5, label: 'GPIO 21', gpio: 'I2C_SDA', type: 'i2c', voltage: '3.3V', connectedTo: 'SSD1306 OLED SDA Pin', wireColor: 'text-accent', description: 'I2C Serial Data bus line with 4.7kΩ pull-up' },
      { pinNumber: 6, label: 'GPIO 22', gpio: 'I2C_SCL', type: 'i2c', voltage: '3.3V', connectedTo: 'SSD1306 OLED SCL Pin', wireColor: 'text-accent', description: 'I2C Serial Clock bus line operating at 400kHz' },
      { pinNumber: 7, label: 'GPIO 48', gpio: 'NEOPIXEL', type: 'digital', voltage: '3.3V', connectedTo: 'WS2812B RGB DIN Pin', wireColor: 'text-success', description: 'High-speed 800kHz single-wire NZR PWM data line' },
      { pinNumber: 8, label: 'GPIO 43', gpio: 'U0TXD', type: 'uart', voltage: '3.3V', connectedTo: 'CP2102 USB-to-UART Bridge', wireColor: 'text-fg', description: 'Primary hardware UART0 serial transmit line' },
    ],
    firmwareCode: [
      { lineNumber: 1, code: '#include <Arduino.h>', isExecutable: false, explanation: 'Core Arduino embedded framework header declaring basic HAL primitives.' },
      { lineNumber: 2, code: '#include <Wire.h>', isExecutable: false, explanation: 'Hardware I2C driver library providing master/slave bus primitives.' },
      { lineNumber: 3, code: '#include <Adafruit_SSD1306.h>', isExecutable: false, explanation: 'Monochrome 128x64 graphic OLED display driver.' },
      { lineNumber: 4, code: '#include <Adafruit_NeoPixel.h>', isExecutable: false, explanation: 'Timing-critical 800kHz bitbang driver for WS2812B smart LEDs.' },
      { lineNumber: 5, code: '', isExecutable: false, explanation: '' },
      { lineNumber: 6, code: '#define SCREEN_WIDTH 128', isExecutable: false, explanation: 'SSD1306 horizontal dot-matrix resolution.' },
      { lineNumber: 7, code: '#define SCREEN_HEIGHT 64', isExecutable: false, explanation: 'SSD1306 vertical page-addressed resolution.' },
      { lineNumber: 8, code: '#define PIN_POT 1 // ADC1_CH0', isExecutable: false, explanation: 'Analog input pin connected to 10k potentiometer wiper.' },
      { lineNumber: 9, code: '#define PIN_BTN 0 // Boot button', isExecutable: false, explanation: 'Active-low tactile pushbutton with internal pull-up resistor.' },
      { lineNumber: 10, code: '#define PIN_LED 48 // NeoPixel RGB', isExecutable: false, explanation: 'Addressable RGB LED data signal pin.' },
      { lineNumber: 11, code: '', isExecutable: false, explanation: '' },
      { lineNumber: 12, code: 'Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);', isExecutable: false, explanation: 'Instantiates OLED object on the default Wire I2C bus with no hardware reset pin.' },
      { lineNumber: 13, code: 'Adafruit_NeoPixel strip(1, PIN_LED, NEO_GRB + NEO_KHZ800);', isExecutable: false, explanation: 'Allocates single-pixel buffer using 800kHz GRB color packet order.' },
      { lineNumber: 14, code: '', isExecutable: false, explanation: '' },
      { lineNumber: 15, code: 'void setup() {', isExecutable: true, explanation: 'Microcontroller boot entry point executed once after power-on reset.', hardwareAction: 'Booting ESP32-S3 core' },
      { lineNumber: 16, code: '  Serial.begin(115200);', isExecutable: true, explanation: 'Configures UART0 baud rate generator for 115200 bps transmission.', hardwareAction: 'UART0 ready' },
      { lineNumber: 17, code: '  pinMode(PIN_BTN, INPUT_PULLUP);', isExecutable: true, explanation: 'Enables internal 45kΩ pull-up resistor to hold pin at 3.3V until pressed.', hardwareAction: 'GPIO 0 pull-up engaged' },
      { lineNumber: 18, code: '  Wire.begin(21, 22);', isExecutable: true, explanation: 'Assigns GPIO 21 as SDA and GPIO 22 as SCL for hardware I2C master.', hardwareAction: 'I2C bus active at 400kHz' },
      { lineNumber: 19, code: '  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);', isExecutable: true, explanation: 'Sends init sequence: activates internal charge pump to generate 7.5V OLED panel voltage.', hardwareAction: 'OLED charge pump on' },
      { lineNumber: 20, code: '  display.clearDisplay();', isExecutable: true, explanation: 'Wipes local 1KB graphic framebuffer in SRAM.', hardwareAction: 'Display RAM cleared' },
      { lineNumber: 21, code: '  strip.begin();', isExecutable: true, explanation: 'Configures GPIO 48 as high-speed output and initializes pixel stream.', hardwareAction: 'NeoPixel ready' },
      { lineNumber: 22, code: '  strip.setPixelColor(0, strip.Color(16, 185, 129));', isExecutable: true, explanation: 'Writes emerald RGB values into the memory buffer.', hardwareAction: 'RGB buffer set to emerald' },
      { lineNumber: 23, code: '  strip.show();', isExecutable: true, explanation: 'Transmits 24-bit NZR timing pulses to lock in LED color.', hardwareAction: 'NeoPixel glowing emerald' },
      { lineNumber: 24, code: '}', isExecutable: false, explanation: 'End of hardware initialization sequence.' },
      { lineNumber: 25, code: '', isExecutable: false, explanation: '' },
      { lineNumber: 26, code: 'void loop() {', isExecutable: true, explanation: 'Continuous execution loop running on FreeRTOS Arduino core task.', hardwareAction: 'Loop cycle start' },
      { lineNumber: 27, code: '  int rawAdc = analogRead(PIN_POT);', isExecutable: true, explanation: 'Performs SAR ADC conversion (12-bit: 0 to 4095 counts).', hardwareAction: 'Reading potentiometer voltage' },
      { lineNumber: 28, code: '  float voltage = (rawAdc / 4095.0) * 3.3;', isExecutable: true, explanation: 'Calculates physical voltage using calibrated 3.3V reference ratio.', hardwareAction: 'Converting counts to volts' },
      { lineNumber: 29, code: '  bool btnPressed = digitalRead(PIN_BTN) == LOW;', isExecutable: true, explanation: 'Samples active-low pushbutton state (GND when pressed).', hardwareAction: 'Sampling pushbutton 1' },
      { lineNumber: 30, code: '  display.clearDisplay();', isExecutable: true, explanation: 'Clears previous frame in SRAM.', hardwareAction: 'Wiping frame buffer' },
      { lineNumber: 31, code: '  display.setTextSize(1);', isExecutable: true, explanation: 'Sets 6x8 pixel bitmap font glyph generator.', hardwareAction: 'Font size 1 set' },
      { lineNumber: 32, code: '  display.setTextColor(SSD1306_WHITE);', isExecutable: true, explanation: 'Sets pixel draw mask to turn on OLED subpixels.', hardwareAction: 'Pixel mask monochrome white' },
      { lineNumber: 33, code: '  display.setCursor(0, 0);', isExecutable: true, explanation: 'Sets drawing pointer to top-left coordinate (0,0).', hardwareAction: 'Cursor at origin' },
      { lineNumber: 34, code: '  display.print("HACKERLAND ESP32-S3");', isExecutable: true, explanation: 'Rasterizes title string into display RAM.', hardwareAction: 'Rendering title glyphs' },
      { lineNumber: 35, code: '  display.setCursor(0, 16);', isExecutable: true, explanation: 'Advances cursor to line 2 (y=16).', hardwareAction: 'Cursor at y=16' },
      { lineNumber: 36, code: '  display.printf("ADC: %.2fV [%d]", voltage, rawAdc);', isExecutable: true, explanation: 'Formats live voltage telemetry string.', hardwareAction: 'Drawing voltage telemetry' },
      { lineNumber: 37, code: '  display.drawRect(0, 32, 128, 12, SSD1306_WHITE);', isExecutable: true, explanation: 'Draws border rectangle for analog gauge bar.', hardwareAction: 'Drawing gauge outline' },
      { lineNumber: 38, code: '  display.fillRect(2, 34, (int)(voltage / 3.3 * 124), 8, SSD1306_WHITE);', isExecutable: true, explanation: 'Fills gauge bar proportionally to measured potentiometer input.', hardwareAction: 'Drawing gauge bar fill' },
      { lineNumber: 39, code: '  display.display(); // Push SPI/I2C burst', isExecutable: true, explanation: 'Transmits full 1KB page buffer over I2C at 400kHz burst.', hardwareAction: 'Flushing frame to OLED panel' },
      { lineNumber: 40, code: '  delay(50); // 20 FPS refresh rate', isExecutable: true, explanation: 'Yields execution to FreeRTOS scheduler for 50ms.', hardwareAction: 'Yielding to FreeRTOS' },
      { lineNumber: 41, code: '}', isExecutable: false, explanation: 'End of loop cycle.' },
    ],
  },
  {
    id: 'drone-fc-avionics',
    title: 'Drone Flight Controller & 6-DOF IMU Bench',
    pillarId: 'drone',
    subtitle: 'STM32F405 ARM Cortex-M4 with SPI MPU6000 Gyroscope and 4-Axis DShot600 ESC',
    targetMcu: 'STM32F405RGT6 (168MHz / 192KB RAM / Hardware FPU)',
    clockSpeed: '168 MHz',
    protocols: ['SPI (High-speed 20MHz)', 'DShot600 Motor Protocol', 'I2C Barometer', 'SBUS Radio RX'],
    defaultPotVoltage: 0.0,
    defaultButtonState: false,
    defaultLedColor: '#ef4444',
    quickCommands: ['STATUS', 'ARM', 'DISARM', 'THROTTLE 25', 'PID P:4.2 I:0.05 D:28', 'CALIBRATE', 'CLEAR'],
    initialSerialLogs: [
      '[BOOT] Betaflight 4.5.0 / STM32F405 (Target: HACKERLAND_F405)',
      '[CLOCK] Core configured at 168MHz (AHB 168MHz, APB1 42MHz, APB2 84MHz)',
      '[SPI1] MPU6000 detected (WHO_AM_I: 0x68) at 20MHz clock',
      '[GYRO] Gyroscope calibration offset: Roll -0.12°/s, Pitch +0.08°/s, Yaw +0.02°/s',
      '[BARO] BMP280 detected on I2C2 - Pressure 1013.25 hPa (Elev: 24m)',
      '[DSHOT] Timer 1 & 8 DMA initialized for 4x DShot600 ESC outputs',
      '[SAFETY] Disarmed. Throttle stick must be 0% to arm.',
    ],
    pins: [
      { pinNumber: 1, label: 'PA5', gpio: 'SPI1_SCK', type: 'spi', voltage: '3.3V', connectedTo: 'MPU6000 SCK', wireColor: 'text-accent', description: '20MHz SPI Master Clock line' },
      { pinNumber: 2, label: 'PA6', gpio: 'SPI1_MISO', type: 'spi', voltage: '3.3V', connectedTo: 'MPU6000 SDO', wireColor: 'text-accent', description: 'SPI Master-In Slave-Out sensor data' },
      { pinNumber: 3, label: 'PA7', gpio: 'SPI1_MOSI', type: 'spi', voltage: '3.3V', connectedTo: 'MPU6000 SDI', wireColor: 'text-accent', description: 'SPI Master-Out Slave-In config line' },
      { pinNumber: 4, label: 'PC4', gpio: 'MPU_CS', type: 'digital', voltage: '3.3V', connectedTo: 'MPU6000 Chip Select', wireColor: 'text-warning', description: 'Active-low hardware chip select' },
      { pinNumber: 5, label: 'TIM1_CH1', gpio: 'ESC1_PWM', type: 'digital', voltage: '3.3V', connectedTo: 'Front-Right Motor ESC (M1)', wireColor: 'text-success', description: 'DShot600 packet output to ESC 1' },
      { pinNumber: 6, label: 'TIM1_CH2', gpio: 'ESC2_PWM', type: 'digital', voltage: '3.3V', connectedTo: 'Rear-Right Motor ESC (M2)', wireColor: 'text-success', description: 'DShot600 packet output to ESC 2' },
      { pinNumber: 7, label: 'TIM1_CH3', gpio: 'ESC3_PWM', type: 'digital', voltage: '3.3V', connectedTo: 'Rear-Left Motor ESC (M3)', wireColor: 'text-success', description: 'DShot600 packet output to ESC 3' },
      { pinNumber: 8, label: 'TIM1_CH4', gpio: 'ESC4_PWM', type: 'digital', voltage: '3.3V', connectedTo: 'Front-Left Motor ESC (M4)', wireColor: 'text-success', description: 'DShot600 packet output to ESC 4' },
    ],
    firmwareCode: [
      { lineNumber: 1, code: '#include <flight_controller.h>', isExecutable: false, explanation: 'Avionics HAL and hardware timer interface.' },
      { lineNumber: 2, code: '#include <mpu6000_spi.h>', isExecutable: false, explanation: 'Direct SPI driver for InvenSense MPU6000 6-DOF IMU.' },
      { lineNumber: 3, code: '#include <dshot_dma.h>', isExecutable: false, explanation: 'Direct Memory Access digital motor control driver.' },
      { lineNumber: 4, code: '', isExecutable: false, explanation: '' },
      { lineNumber: 5, code: 'PidController pidRoll(4.2f, 0.05f, 28.0f);', isExecutable: false, explanation: 'Instantiates Proportional-Integral-Derivative controller for Roll axis.' },
      { lineNumber: 6, code: 'PidController pidPitch(4.5f, 0.05f, 30.0f);', isExecutable: false, explanation: 'Instantiates PID controller for Pitch axis.' },
      { lineNumber: 7, code: '', isExecutable: false, explanation: '' },
      { lineNumber: 8, code: 'void flight_loop_8khz() {', isExecutable: true, explanation: 'Ultra-low latency flight loop triggered by IMU Data-Ready interrupt pin.', hardwareAction: '8kHz IMU interrupt' },
      { lineNumber: 9, code: '  ImuData imu = mpu6000_read_fast_burst();', isExecutable: true, explanation: 'DMA reads 14-byte sensor burst: 3-axis gyro + 3-axis accel.', hardwareAction: 'Reading gyro & accel registers' },
      { lineNumber: 10, code: '  float rollRate = biquad_filter(imu.gyroX);', isExecutable: true, explanation: 'Filters mechanical motor vibration noise through 2nd-order lowpass filter.', hardwareAction: 'Filtering gyro noise' },
      { lineNumber: 11, code: '  float pitchRate = biquad_filter(imu.gyroY);', isExecutable: true, explanation: 'Filters pitch axis angular velocity.', hardwareAction: 'Computing pitch rate' },
      { lineNumber: 12, code: '  if (!is_armed()) {', isExecutable: true, explanation: 'Verifies safety arming lock.', hardwareAction: 'Checking arming flag' },
      { lineNumber: 13, code: '    dshot_send_all(DSHOT_MOTOR_STOP);', isExecutable: true, explanation: 'Forces zero throttle command to all 4 motor controllers.', hardwareAction: 'Motors locked safe' },
      { lineNumber: 14, code: '    return;', isExecutable: false, explanation: 'Exits loop until arming switch is toggled.' },
      { lineNumber: 15, code: '  }', isExecutable: false, explanation: '' },
      { lineNumber: 16, code: '  float rollCorrection = pidRoll.compute(targetRoll, rollRate);', isExecutable: true, explanation: 'Calculates differential torque correction needed to level drone.', hardwareAction: 'Computing PID roll command' },
      { lineNumber: 17, code: '  dshot_mix_quad_x(throttle, rollCorrection, pitchCorrection);', isExecutable: true, explanation: 'Mixes throttle + angular corrections into 4 discrete motor speeds.', hardwareAction: 'Mixing Quad-X motor powers' },
      { lineNumber: 18, code: '  dshot_transmit_frame();', isExecutable: true, explanation: 'Sends 16-bit DShot packet with CRC checksum to all 4 ESCs.', hardwareAction: 'Broadcasting DShot600 frames' },
      { lineNumber: 19, code: '}', isExecutable: false, explanation: 'End of 8kHz flight loop cycle.' },
    ],
  },
  {
    id: 'ev-bms-canbus',
    title: 'EV Automotive CAN-Bus & BMS Battery Balancer',
    pillarId: 'car',
    subtitle: 'Automotive Grade MCU with ISO 11898 CAN-Bus transceiver and 4S LiFePO4 cell balancer',
    targetMcu: 'NXP S32K144 (AEC-Q100 Grade 1 Automotive Cortex-M4F)',
    clockSpeed: '80 MHz',
    protocols: ['CAN 2.0B (500 kbps)', 'SPI Isolated Transceiver', 'Differential ADC (Active Cell Balancing)'],
    defaultPotVoltage: 2.5,
    defaultButtonState: false,
    defaultLedColor: '#10b981',
    quickCommands: ['STATUS', 'CAN_DUMP', 'BMS_CELLS', 'BALANCE ON', 'BALANCE OFF', 'RELAY TRIP', 'CLEAR'],
    initialSerialLogs: [
      '[ECU] S32K144 Automotive Controller Online - ASIL-B Safety Boot OK',
      '[CAN0] FlexCAN module initialized at 500 kbps (Bit timing: Seg1=13, Seg2=2, SJW=1)',
      '[BMS] BQ76952 Isolated Battery Monitor initialized via SPI',
      '[CELLS] 4S Battery Pack Status: Cell1: 3.324V, Cell2: 3.321V, Cell3: 3.318V, Cell4: 3.323V',
      '[SAFETY] HV Pre-charge relay engaged. Main contactor CLOSED.',
      '[OBD2] Diagnostic services (ISO 14229 UDS) listening on CAN ID 0x7E0',
    ],
    pins: [
      { pinNumber: 1, label: 'PTE4', gpio: 'CAN0_TX', type: 'uart', voltage: '3.3V', connectedTo: 'TJA1050 CAN Transceiver TXD', wireColor: 'text-accent', description: '500kbps CAN transmit bitstream' },
      { pinNumber: 2, label: 'PTE5', gpio: 'CAN0_RX', type: 'uart', voltage: '3.3V', connectedTo: 'TJA1050 CAN Transceiver RXD', wireColor: 'text-accent', description: '500kbps CAN receive bitstream' },
      { pinNumber: 3, label: 'CAN_H', gpio: 'CAN_HIGH', type: 'i2c', voltage: '5V', connectedTo: 'Vehicle CAN Bus High line', wireColor: 'text-warning', description: 'Differential CAN-H line with 120Ω termination' },
      { pinNumber: 4, label: 'CAN_L', gpio: 'CAN_LOW', type: 'i2c', voltage: '5V', connectedTo: 'Vehicle CAN Bus Low line', wireColor: 'text-warning', description: 'Differential CAN-L line with 120Ω termination' },
      { pinNumber: 5, label: 'PTD0', gpio: 'BMS_MOS_1', type: 'digital', voltage: '3.3V', connectedTo: 'Cell 1 Balancing Shunt MOSFET', wireColor: 'text-success', description: 'Controls 100mA passive bleed resistor' },
      { pinNumber: 6, label: 'PTD1', gpio: 'BMS_MOS_2', type: 'digital', voltage: '3.3V', connectedTo: 'Cell 2 Balancing Shunt MOSFET', wireColor: 'text-success', description: 'Controls 100mA passive bleed resistor' },
      { pinNumber: 7, label: 'PTC8', gpio: 'HV_RELAY', type: 'digital', voltage: '3.3V', connectedTo: 'High-Voltage Contactor Coil Driver', wireColor: 'text-error', description: '400V HV isolation safety switch' },
      { pinNumber: 8, label: 'GND', gpio: 'GND', type: 'ground', voltage: 'GND', connectedTo: 'Chassis Earth Ground', wireColor: 'text-fg-subtle', description: 'Automotive chassis ground' },
    ],
    firmwareCode: [
      { lineNumber: 1, code: '#include <flexcan_driver.h>', isExecutable: false, explanation: 'NXP Automotive FlexCAN peripheral driver.' },
      { lineNumber: 2, code: '#include <bms_bq76952.h>', isExecutable: false, explanation: 'Texas Instruments automotive battery monitor IC driver.' },
      { lineNumber: 3, code: '', isExecutable: false, explanation: '' },
      { lineNumber: 4, code: 'void check_battery_pack_safety() {', isExecutable: true, explanation: 'Executes ASIL-B safety monitoring every 10ms.', hardwareAction: 'Executing safety checks' },
      { lineNumber: 5, code: '  BmsPack pack = bms_sample_voltages();', isExecutable: true, explanation: 'Reads synchronous 16-bit ADC samples for all connected cells.', hardwareAction: 'Sampling pack cell voltages' },
      { lineNumber: 6, code: '  if (pack.maxCellVoltage > 3.65f) {', isExecutable: true, explanation: 'Detects Over-Voltage Protection (OVP) threshold for LiFePO4 cells.', hardwareAction: 'Checking OVP threshold (3.65V)' },
      { lineNumber: 7, code: '    trigger_hv_shutdown(FAULT_OVERVOLTAGE);', isExecutable: true, explanation: 'De-energizes main contactor coil in under 5ms.', hardwareAction: 'Tripping HV safety contactor' },
      { lineNumber: 8, code: '  }', isExecutable: false, explanation: '' },
      { lineNumber: 9, code: '  if (pack.deltaVoltage > 0.015f) {', isExecutable: true, explanation: 'Detects cell imbalance greater than 15 millivolts.', hardwareAction: 'Evaluating cell balance delta' },
      { lineNumber: 10, code: '    bms_enable_cell_balancing(pack.highestCellIndex);', isExecutable: true, explanation: 'Engages bleed resistor MOSFET on the highest voltage cell.', hardwareAction: 'Activating cell bleed MOSFET' },
      { lineNumber: 11, code: '  }', isExecutable: false, explanation: '' },
      { lineNumber: 12, code: '  CanMessage msg;', isExecutable: true, explanation: 'Prepares standard CAN 2.0B broadcast frame.', hardwareAction: 'Formatting CAN frame' },
      { lineNumber: 13, code: '  msg.id = 0x1806E5F4; // BMS status standard PGN', isExecutable: true, explanation: 'SAE J1939 battery status identifier.', hardwareAction: 'Setting J1939 PGN identifier' },
      { lineNumber: 14, code: '  msg.payload[0] = (uint8_t)(pack.totalVoltage * 10);', isExecutable: true, explanation: 'Encodes total pack voltage in 0.1V increments.', hardwareAction: 'Encoding pack telemetry' },
      { lineNumber: 15, code: '  flexcan_transmit(CAN0, &msg);', isExecutable: true, explanation: 'Transmits frame across physical twisted-pair bus.', hardwareAction: 'Broadcasting CAN packet' },
      { lineNumber: 16, code: '}', isExecutable: false, explanation: 'End of safety cycle.' },
    ],
  },
  {
    id: 'cnc-stepper-gcode',
    title: 'Precision CNC Stepper & G-Code Motion Bench',
    pillarId: 'hardware',
    subtitle: 'RP2040 Dual-Core Motion Controller with TMC2209 SilentStepStick & Optical Endstops',
    targetMcu: 'Raspberry Pi RP2040 (Dual-Core Cortex-M0+ / 133MHz / PIO State Machines)',
    clockSpeed: '133 MHz',
    protocols: ['UART TMC2209 Register Control', 'PIO Hardware Step Generation', 'Optical Endstops'],
    defaultPotVoltage: 1.0,
    defaultButtonState: false,
    defaultLedColor: '#3b82f6',
    quickCommands: ['$$', '?', 'G0 X10 Y20', 'G0 X0 Y0', 'M3 S12000', 'M5', '$H', 'CLEAR'],
    initialSerialLogs: [
      '[GRBL-PIO] RP2040 32-bit CNC Controller v1.4 [HACKERLAND_CNC]',
      '[PIO0] Programmable I/O State Machine 0 loaded with sub-nanosecond step pulse generator',
      '[TMC2209] X-Axis Driver initialized via UART address 0 (StealthChop2 enabled, 16 microsteps)',
      '[TMC2209] Y-Axis Driver initialized via UART address 1 (StealthChop2 enabled, 16 microsteps)',
      '[SPINDLE] 0-10V Optocoupled PWM spindle controller calibrated (Max: 24,000 RPM)',
      '[HOMING] Endstop limit switches armed (Active Low, Debounce: 5ms)',
      '[STATUS] Grbl ready. Type $$ for configuration or send G-Code commands.',
    ],
    pins: [
      { pinNumber: 1, label: 'GP2', gpio: 'X_STEP', type: 'digital', voltage: '3.3V', connectedTo: 'TMC2209 X-Step Pin', wireColor: 'text-accent', description: 'Hardware step pulse generator pin' },
      { pinNumber: 2, label: 'GP3', gpio: 'X_DIR', type: 'digital', voltage: '3.3V', connectedTo: 'TMC2209 X-Direction Pin', wireColor: 'text-accent', description: 'Direction signal (HIGH: Positive, LOW: Negative)' },
      { pinNumber: 3, label: 'GP4', gpio: 'Y_STEP', type: 'digital', voltage: '3.3V', connectedTo: 'TMC2209 Y-Step Pin', wireColor: 'text-success', description: 'Y-Axis hardware step pulse pin' },
      { pinNumber: 4, label: 'GP5', gpio: 'Y_DIR', type: 'digital', voltage: '3.3V', connectedTo: 'TMC2209 Y-Direction Pin', wireColor: 'text-success', description: 'Y-Axis direction signal' },
      { pinNumber: 5, label: 'GP14', gpio: 'SPINDLE_PWM', type: 'digital', voltage: '3.3V', connectedTo: 'Spindle MOSFET Gate Driver', wireColor: 'text-warning', description: '10kHz PWM speed regulator' },
      { pinNumber: 6, label: 'GP16', gpio: 'LIMIT_X', type: 'digital', voltage: '3.3V', connectedTo: 'X-Axis Optical Limit Switch', wireColor: 'text-error', description: 'Optical homing endstop sensor' },
      { pinNumber: 7, label: 'GND', gpio: 'GND', type: 'ground', voltage: 'GND', connectedTo: 'Driver Ground Common', wireColor: 'text-fg-subtle', description: 'Signal reference ground' },
      { pinNumber: 8, label: '3V3', gpio: 'VCC', type: 'power', voltage: '3.3V', connectedTo: 'Driver Logic VCC', wireColor: 'text-error', description: '3.3V logic supply' },
    ],
    firmwareCode: [
      { lineNumber: 1, code: '#include "pico/stdlib.h"', isExecutable: false, explanation: 'Raspberry Pi Pico official C/C++ SDK core.' },
      { lineNumber: 2, code: '#include "hardware/pio.h"', isExecutable: false, explanation: 'Direct access to RP2040 Programmable I/O engines.' },
      { lineNumber: 3, code: '#include "tmc2209_uart.h"', isExecutable: false, explanation: 'Trinamic smart motor driver register control library.' },
      { lineNumber: 4, code: '', isExecutable: false, explanation: '' },
      { lineNumber: 5, code: 'void execute_gcode_linear_move(float targetX, float targetY) {', isExecutable: true, explanation: 'Calculates acceleration profile and sends steps to PIO engine.', hardwareAction: 'Calculating Bresenham line trajectory' },
      { lineNumber: 6, code: '  float deltaX = targetX - currentPos.x;', isExecutable: true, explanation: 'Computes X displacement in millimeters.', hardwareAction: 'Computing delta X' },
      { lineNumber: 7, code: '  float deltaY = targetY - currentPos.y;', isExecutable: true, explanation: 'Computes Y displacement in millimeters.', hardwareAction: 'Computing delta Y' },
      { lineNumber: 8, code: '  gpio_put(PIN_X_DIR, deltaX >= 0 ? 1 : 0);', isExecutable: true, explanation: 'Sets physical direction pin for X stepper driver.', hardwareAction: 'Setting X-direction pin' },
      { lineNumber: 9, code: '  gpio_put(PIN_Y_DIR, deltaY >= 0 ? 1 : 0);', isExecutable: true, explanation: 'Sets physical direction pin for Y stepper driver.', hardwareAction: 'Setting Y-direction pin' },
      { lineNumber: 10, code: '  uint32_t xSteps = (uint32_t)(fabs(deltaX) * STEPS_PER_MM_X);', isExecutable: true, explanation: 'Translates mm into discrete microstep pulses (16 microsteps = 80 step/mm).', hardwareAction: 'Calculating microsteps' },
      { lineNumber: 11, code: '  pio_sm_put_blocking(pio0, sm_x, xSteps);', isExecutable: true, explanation: 'Pushes step count into PIO FIFO queue for cycle-accurate hardware pulsing.', hardwareAction: 'Pushing steps to PIO FIFO' },
      { lineNumber: 12, code: '  currentPos.x = targetX; currentPos.y = targetY;', isExecutable: true, explanation: 'Updates machine coordinate registers.', hardwareAction: 'Position updated' },
      { lineNumber: 13, code: '  printf("ok MPos:%.3f,%.3f,%.3f\\n", currentPos.x, currentPos.y, currentPos.z);', isExecutable: true, explanation: 'Sends GRBL standard position acknowledge packet.', hardwareAction: 'Broadcasting GRBL ok' },
      { lineNumber: 14, code: '}', isExecutable: false, explanation: 'End of linear motion handler.' },
    ],
  },
];
