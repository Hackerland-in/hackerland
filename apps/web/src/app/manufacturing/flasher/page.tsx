import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Cpu, Usb } from 'lucide-react';
import { WebSerialFlasher } from '@/components/manufacturing/flasher/web-serial-flasher';

export const metadata: Metadata = {
  title: 'WebSerial Hardware Firmware Flasher & Serial Monitor | Hackerland',
  description:
    'Plug and flash ESP32, Raspberry Pi Pico, and Arduino microcontrollers directly from your web browser with zero local toolchains or driver installation.',
};

export default function FlasherPage() {
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/manufacturing"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Manufacturing Hub
          </Link>

          <Link
            href="/manufacturing/pcb"
            className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition"
          >
            <Cpu className="w-4 h-4" /> Open In-Browser PCB Studio
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Usb className="w-3.5 h-3.5" /> Zero-Install Browser Toolchain
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            WebSerial In-Browser Firmware Flasher & Monitor
          </h1>
          <p className="text-neutral-400 max-w-3xl text-sm sm:text-base leading-relaxed">
            Flash compiled binaries to ESP32, Raspberry Pi Pico (RP2040), and Arduino devices directly over USB using the native browser Web Serial API. Monitor live UART telemetry and send commands in real time without installing Arduino IDE or Python esptool.
          </p>
        </div>

        {/* Interactive WebSerial Flasher */}
        <WebSerialFlasher />
      </div>
    </div>
  );
}
