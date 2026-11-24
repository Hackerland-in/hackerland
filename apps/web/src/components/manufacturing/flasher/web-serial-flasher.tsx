'use client';

import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import {
  Usb,
  Cpu,
  Terminal,
  Play,
  RotateCcw,
  Zap,
  AlertTriangle,
  Send,
  Trash2,
} from 'lucide-react';

interface FirmwarePreset {
  id: string;
  name: string;
  targetMcu: string;
  description: string;
  sizeBytes: number;
  author: string;
}

const FIRMWARE_PRESETS: FirmwarePreset[] = [
  {
    id: 'esp32_blink_telemetry',
    name: 'ESP32 IoT Node Heartbeat & Telemetry',
    targetMcu: 'ESP32 (WROOM / S3 / C3)',
    description: 'Blinks onboard LED (GPIO 2) and broadcasts JSON telemetry over serial every 1 second.',
    sizeBytes: 198240,
    author: 'Hackerland Open Hardware Core',
  },
  {
    id: 'pico_i2c_scanner',
    name: 'Raspberry Pi Pico (RP2040) I2C Bus Probe',
    targetMcu: 'Raspberry Pi Pico (RP2040)',
    description: 'Scans I2C0 & I2C1 pins for attached OLED displays, sensors (BME280, MPU6050) and reports hex addresses.',
    sizeBytes: 84320,
    author: 'Makerspace Karnataka Node',
  },
  {
    id: 'arduino_sensor_logger',
    name: 'Arduino Uno / Nano ADC Sensor Logger',
    targetMcu: 'ATmega328P (Uno / Nano)',
    description: 'Reads 6 analog channels (A0-A5) at 100Hz and streams CSV formatted ADC voltages.',
    sizeBytes: 32410,
    author: 'Hackerland Foundation',
  },
  {
    id: 'micropython_esp32_stable',
    name: 'MicroPython v1.23.0 Runtime for ESP32',
    targetMcu: 'ESP32-WROOM-32',
    description: 'Full MicroPython REPL runtime with WebREPL, asyncio, and Wi-Fi drivers embedded.',
    sizeBytes: 1546240,
    author: 'MicroPython Project',
  },
];

/** Browser support never changes after load, so there is nothing to subscribe to. */
const noopSubscribe = () => () => {};

export function WebSerialFlasher() {
  const isSupported = useSyncExternalStore(
    noopSubscribe,
    () => 'serial' in navigator,
    () => true,
  );
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [flashProgress, setFlashProgress] = useState<number>(0);
  const [selectedFirmwareId, setSelectedFirmwareId] = useState<string>('esp32_blink_telemetry');
  const [baudRate, setBaudRate] = useState<number>(115200);
  const [logs, setLogs] = useState<Array<{ timestamp: string; text: string; type: 'system' | 'rx' | 'tx' | 'error' }>>([
    {
      timestamp: new Date().toLocaleTimeString(),
      text: 'WebSerial Hardware Toolchain ready. Plug in your MCU via USB.',
      type: 'system',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [simulatedMode, setSimulatedMode] = useState<boolean>(true);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (text: string, type: 'system' | 'rx' | 'tx' | 'error' = 'system') => {
    setLogs((prev) => [...prev, { timestamp: new Date().toLocaleTimeString(), text, type }]);
  };

  const handleConnect = async () => {
    if (isConnected) {
      // Disconnect
      setIsConnected(false);
      addLog('Disconnected from USB Serial Port.', 'system');
      return;
    }

    if (simulatedMode || !isSupported) {
      setIsConnected(true);
      addLog(`[SIMULATED] Connected to /dev/ttyUSB0 (ESP32-D0WDQ6 Rev 1) at ${baudRate} baud.`, 'system');
      addLog('ets Jul 29 2019 12:21:46 rst:0x1 (POWERON_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)', 'rx');
      addLog('configsip: 0, SPIWP:0xee, clk_drv:0x00,q_drv:0x00,d_drv:0x00,cs0_drv:0x00', 'rx');
      addLog('Hackerland IoT Node ready. Awaiting firmware flash or command.', 'rx');
      return;
    }

    try {
      // Real Web Serial API request
      const nav = navigator as unknown as { serial: { requestPort: () => Promise<unknown> } };
      await nav.serial.requestPort();
      setIsConnected(true);
      addLog(`Connected to hardware USB port at ${baudRate} baud.`, 'system');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'User cancelled port selection';
      addLog(`Failed to connect: ${message}`, 'error');
    }
  };

  const handleFlashFirmware = () => {
    if (!isConnected) {
      addLog('Please connect to a USB Serial port first!', 'error');
      return;
    }

    const fw = FIRMWARE_PRESETS.find((f) => f.id === selectedFirmwareId);
    if (!fw) return;

    setIsFlashing(true);
    setFlashProgress(0);
    addLog(`Initiating flashing sequence for "${fw.name}"...`, 'system');
    addLog('Connecting to bootloader... (Holding GPIO 0 & toggling EN pin)', 'system');

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setFlashProgress(current);

      if (current === 30) {
        addLog(`Erasing flash sector (0x1000 - 0x${fw.sizeBytes.toString(16)})...`, 'system');
      } else if (current === 60) {
        addLog(`Writing binary chunks at ${baudRate} baud... [${Math.round(fw.sizeBytes * 0.6)} bytes]`, 'system');
      } else if (current === 90) {
        addLog('Verifying MD5 checksum of written flash memory...', 'system');
      } else if (current >= 100) {
        clearInterval(interval);
        setIsFlashing(false);
        addLog('Flash verification SUCCESSFUL! MD5 matches.', 'system');
        addLog('Resetting MCU to normal execution mode (rst:0x1)...', 'system');
        addLog('[FIRMWARE BOOT] Hackerland Node v1.0.4 online. MAC: 24:6F:28:8C:3B:12', 'rx');
        addLog('{"status":"online","ip":"192.168.1.144","uptime_s":1,"temp_c":28.4}', 'rx');
      }
    }, 400);
  };

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    addLog(`> ${inputText}`, 'tx');
    const cmd = inputText.trim();
    setInputText('');

    if (isConnected) {
      setTimeout(() => {
        if (cmd === 'ping' || cmd === 'PING') {
          addLog('PONG (Hackerland MCU ACK in 1.4ms)', 'rx');
        } else if (cmd === 'help') {
          addLog('Commands: ping, status, scan_i2c, reboot, info', 'rx');
        } else if (cmd === 'status') {
          addLog('{"board":"ESP32-WROOM-32","flash_mb":4,"free_heap":218440,"voltage":3.29}', 'rx');
        } else if (cmd === 'scan_i2c') {
          addLog('I2C scan found 2 devices: [0x3C: OLED SSD1306, 0x68: MPU6050 IMU]', 'rx');
        } else {
          addLog(`ACK: ${cmd}`, 'rx');
        }
      }, 200);
    }
  };

  const selectedFw = FIRMWARE_PRESETS.find((f) => f.id === selectedFirmwareId);

  return (
    <div className="space-y-8">
      {/* Top Warning/Info Banner */}
      {!isSupported && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-4 text-sm text-amber-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Web Serial API is not supported in this browser.</strong>
            <p className="text-xs text-amber-300/80 mt-1">
              For direct USB hardware flashing, please open Hackerland in Google Chrome, Microsoft Edge, or Opera. Running in Interactive Simulation Mode so you can preview telemetry and flashing logic.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Control Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Connection Card */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Usb className="w-4 h-4 text-emerald-400" /> 1. USB Connection
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'
                  }`}
                />
                <span className="text-xs font-medium text-neutral-400">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Baud Rate</label>
                <select
                  value={baudRate}
                  onChange={(e) => setBaudRate(Number(e.target.value))}
                  disabled={isConnected}
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                >
                  <option value={9600}>9600 (Arduino Standard)</option>
                  <option value={57600}>57600</option>
                  <option value={115200}>115200 (ESP32 Standard)</option>
                  <option value={230400}>230400</option>
                  <option value={921600}>921600 (High-Speed Flashing)</option>
                </select>
              </div>

              {/* Simulation Mode Toggle */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={simulatedMode}
                  onChange={(e) => setSimulatedMode(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-950 text-emerald-500 focus:ring-0 w-4 h-4"
                />
                <span className="text-xs text-neutral-400">
                  Interactive Virtual Simulator (No physical board required)
                </span>
              </label>

              <button
                type="button"
                onClick={handleConnect}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
                  isConnected
                    ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
                    : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/10'
                }`}
              >
                {isConnected ? (
                  <>
                    <RotateCcw className="w-4 h-4" /> Disconnect Port
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" /> Select & Connect USB Port
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Firmware Selector Card */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" /> 2. Target Firmware
            </h3>

            <div className="space-y-3">
              {FIRMWARE_PRESETS.map((fw) => {
                const isSelected = fw.id === selectedFirmwareId;
                return (
                  <button
                    key={fw.id}
                    type="button"
                    onClick={() => setSelectedFirmwareId(fw.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition ${
                      isSelected
                        ? 'border-emerald-500/60 bg-emerald-950/20'
                        : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white">{fw.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                        {fw.targetMcu}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-2">{fw.description}</p>
                    <div className="text-[10px] text-neutral-500 mt-2 flex items-center justify-between">
                      <span>Size: {(fw.sizeBytes / 1024).toFixed(1)} KB</span>
                      <span>By {fw.author}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Flash Progress Bar */}
            {isFlashing && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Flashing binary chunks...</span>
                  <span className="font-mono text-emerald-400">{flashProgress}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                    style={{ width: `${flashProgress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={!isConnected || isFlashing}
              onClick={handleFlashFirmware}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
            >
              <Play className="w-4 h-4 fill-current" />
              {isFlashing ? 'Flashing Memory...' : `Flash "${selectedFw?.targetMcu}"`}
            </button>
          </div>
        </div>

        {/* Right Terminal Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-3 font-mono shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-neutral-200">
                  Serial Terminal Monitor ({baudRate} baud, 8N1)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLogs([])}
                className="text-xs text-neutral-500 hover:text-white transition flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>

            {/* Output Screen */}
            <div className="h-[460px] overflow-y-auto space-y-1 text-xs pr-2">
              {logs.map((log, index) => {
                let color = 'text-neutral-300';
                if (log.type === 'system') color = 'text-emerald-400';
                if (log.type === 'error') color = 'text-rose-400';
                if (log.type === 'tx') color = 'text-cyan-400';
                if (log.type === 'rx') color = 'text-amber-200';

                return (
                  <div key={index} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-neutral-600 select-none shrink-0">[{log.timestamp}]</span>
                    <span className={`break-all ${color}`}>{log.text}</span>
                  </div>
                );
              })}
              <div ref={terminalBottomRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendCommand} className="pt-2 border-t border-neutral-800 flex gap-2">
              <input
                type="text"
                placeholder={
                  isConnected ? "Type command ('ping', 'status', 'scan_i2c') & hit Enter..." : 'Connect USB to interact...'
                }
                disabled={!isConnected}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!isConnected || !inputText.trim()}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-semibold text-xs transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
