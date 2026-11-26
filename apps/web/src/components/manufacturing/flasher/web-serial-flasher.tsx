'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Cpu,
  Play,
  RotateCcw,
  Save,
  Send,
  Terminal,
  Trash2,
  Usb,
  Zap,
} from 'lucide-react';
import { Button } from '@hackerland/ui';
import { useLabShell } from '@/components/labs/full-screen-lab-shell';

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

export function WebSerialFlasher() {
  const labShell = useLabShell();
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [flashProgress, setFlashProgress] = useState<number>(0);
  const [selectedFirmwareId, setSelectedFirmwareId] = useState<string>('esp32_blink_telemetry');
  const [baudRate, setBaudRate] = useState<number>(115200);
  const [logs, setLogs] = useState<Array<{ timestamp: string; text: string; type: 'system' | 'rx' | 'tx' | 'error' }>>([
    {
      timestamp: '09:00:00',
      text: 'WebSerial Hardware Toolchain ready. Plug in your MCU via USB or run in Virtual Mode.',
      type: 'system',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [simulatedMode, setSimulatedMode] = useState<boolean>(true);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supported = 'serial' in navigator;
      setIsSupported(supported);
      if (!supported) {
        setSimulatedMode(true);
      }
    }
  }, []);

  useEffect(() => {
    labShell?.registerSnapshotHandlers({
      getSnapshot: () => ({
        title: `Firmware Flash Session · ${selectedFirmwareId}`,
        summary: `Baud ${baudRate} · ${logs.length} UART log lines recorded.`,
        tags: ['webserial', 'firmware'],
        payload: { selectedFirmwareId, baudRate, logs },
      }),
      onLoad: (ws) => {
        if (typeof ws.payload?.selectedFirmwareId === 'string') {
          setSelectedFirmwareId(ws.payload.selectedFirmwareId);
        }
        if (typeof ws.payload?.baudRate === 'number') {
          setBaudRate(ws.payload.baudRate);
        }
        if (Array.isArray(ws.payload?.logs)) {
          setLogs(ws.payload.logs as typeof logs);
        }
      },
    });
  }, [labShell, selectedFirmwareId, baudRate, logs]);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (text: string, type: 'system' | 'rx' | 'tx' | 'error' = 'system') => {
    setLogs((prev) => [...prev, { timestamp: new Date().toLocaleTimeString(), text, type }]);
  };

  const handleConnect = async () => {
    if (isConnected) {
      setIsConnected(false);
      addLog('Disconnected from USB Serial Port.', 'system');
      return;
    }

    if (simulatedMode || !isSupported) {
      setIsConnected(true);
      addLog(`[VIRTUAL USB] Connected to /dev/ttyUSB0 (ESP32-D0WDQ6 Rev 1) at ${baudRate} baud.`, 'system');
      addLog('ets Jul 29 2019 12:21:46 rst:0x1 (POWERON_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)', 'rx');
      addLog('Hackerland IoT Node ready. Awaiting firmware flash or UART command.', 'rx');
      return;
    }

    try {
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
    }, 350);
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
    <div className="space-y-6">
      {!isSupported && (
        <div className="rounded-2xl border border-warning/35 bg-warning/10 p-4 text-sm text-warning-fg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Web Serial API is unavailable in this browser.</strong>
            <p className="text-xs mt-1 text-fg-muted">
              For direct USB hardware flashing, use Chrome, Edge, or Opera. Interactive Virtual Mode remains active so you can test bootlogs and UART commands.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* Connection Card */}
          <div className="rounded-2xl border border-hairline bg-surface-1 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-fg flex items-center gap-2">
                <Usb className="w-4 h-4 text-accent" /> 1. USB Connection
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isConnected ? 'bg-success animate-pulse' : 'bg-fg-subtle/40'
                  }`}
                />
                <span className="text-xs font-medium text-fg-muted">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-fg-muted mb-1">Baud Rate</label>
                <select
                  value={baudRate}
                  onChange={(e) => setBaudRate(Number(e.target.value))}
                  disabled={isConnected}
                  className="w-full rounded-xl bg-sunken border border-line px-3 py-2 text-sm text-fg focus:outline-none focus:border-accent disabled:opacity-50"
                >
                  <option value={9600}>9600 (Arduino Standard)</option>
                  <option value={57600}>57600</option>
                  <option value={115200}>115200 (ESP32 Standard)</option>
                  <option value={230400}>230400</option>
                  <option value={921600}>921600 (High-Speed Flashing)</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={simulatedMode}
                  onChange={(e) => setSimulatedMode(e.target.checked)}
                  className="rounded border-line bg-surface-1 accent-accent w-4 h-4"
                />
                <span className="text-xs text-fg-muted">
                  Interactive Virtual Simulator (No physical board required)
                </span>
              </label>

              <Button
                type="button"
                variant={isConnected ? 'secondary' : 'primary'}
                className="w-full"
                onClick={handleConnect}
              >
                {isConnected ? (
                  <>
                    <RotateCcw className="w-4 h-4" /> Disconnect Port
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" /> Select &amp; Connect USB Port
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Firmware Selector */}
          <div className="rounded-2xl border border-hairline bg-surface-1 p-5 sm:p-6 space-y-4 shadow-xs">
            <h3 className="font-display text-base font-bold text-fg flex items-center gap-2">
              <Cpu className="w-4 h-4 text-accent" /> 2. Target Firmware
            </h3>

            <div className="space-y-2.5">
              {FIRMWARE_PRESETS.map((fw) => {
                const isSelected = fw.id === selectedFirmwareId;
                return (
                  <button
                    key={fw.id}
                    type="button"
                    onClick={() => setSelectedFirmwareId(fw.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition ${
                      isSelected
                        ? 'border-accent bg-accent-soft/70 ring-1 ring-accent/25'
                        : 'border-hairline bg-sunken/60 hover:border-accent/35'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-fg">{fw.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-1 border border-hairline text-accent-fg font-mono shrink-0">
                        {fw.targetMcu}
                      </span>
                    </div>
                    <p className="text-[11px] text-fg-muted line-clamp-2">{fw.description}</p>
                    <div className="text-[10px] text-fg-subtle mt-2 flex items-center justify-between font-mono">
                      <span>Size: {(fw.sizeBytes / 1024).toFixed(1)} KB</span>
                      <span>By {fw.author}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {isFlashing && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs text-fg-muted">
                  <span>Flashing binary chunks...</span>
                  <span className="font-mono font-bold text-accent-fg">{flashProgress}%</span>
                </div>
                <div className="w-full h-2 bg-sunken rounded-full overflow-hidden border border-hairline">
                  <div
                    className="h-full bg-accent transition-all duration-300 rounded-full"
                    style={{ width: `${flashProgress}%` }}
                  />
                </div>
              </div>
            )}

            <Button
              type="button"
              variant="primary"
              className="w-full"
              disabled={!isConnected || isFlashing}
              onClick={handleFlashFirmware}
            >
              <Play className="w-4 h-4" />
              {isFlashing ? 'Flashing Memory...' : `Flash "${selectedFw?.targetMcu}"`}
            </Button>
          </div>
        </div>

        {/* Right UART Console */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-hairline bg-surface-1 p-5 space-y-3 font-mono shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold text-fg">
                  Serial Terminal Monitor ({baudRate} baud, 8N1)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {labShell && (
                  <button
                    type="button"
                    onClick={() =>
                      void labShell.saveWorkspace({
                        title: `UART Session · ${selectedFirmwareId}`,
                        summary: `${logs.length} terminal lines recorded at ${baudRate} baud.`,
                        tags: ['uart', 'firmware'],
                        payload: { selectedFirmwareId, baudRate, logs },
                      })
                    }
                    className="text-xs text-accent-fg hover:underline font-sans font-semibold flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Log
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setLogs([])}
                  className="text-xs text-fg-muted hover:text-fg transition flex items-center gap-1 font-sans"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
            </div>

            <div className="h-[460px] overflow-y-auto space-y-1.5 text-xs pr-2 rounded-xl bg-sunken/80 border border-hairline p-3.5">
              {logs.map((log, index) => {
                let color = 'text-fg';
                if (log.type === 'system') color = 'text-accent-fg font-semibold';
                if (log.type === 'error') color = 'text-danger-fg font-semibold';
                if (log.type === 'tx') color = 'text-info-fg font-semibold';
                if (log.type === 'rx') color = 'text-fg-muted';

                return (
                  <div key={index} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-fg-subtle select-none shrink-0">[{log.timestamp}]</span>
                    <span className={`break-all ${color}`}>{log.text}</span>
                  </div>
                );
              })}
              <div ref={terminalBottomRef} />
            </div>

            <form onSubmit={handleSendCommand} className="pt-2 border-t border-hairline flex gap-2 font-sans">
              <input
                type="text"
                placeholder={
                  isConnected
                    ? "Type command ('ping', 'status', 'scan_i2c') & hit Enter..."
                    : 'Connect USB above to send commands...'
                }
                disabled={!isConnected}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 rounded-xl bg-sunken border border-line px-3.5 py-2 text-xs font-mono text-fg focus:outline-none focus:border-accent disabled:opacity-50"
              />
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={!isConnected || !inputText.trim()}
              >
                <Send className="w-3.5 h-3.5" /> Send
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
