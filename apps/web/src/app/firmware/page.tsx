import type { Metadata } from 'next';
import { FIRMWARE_REGISTRY } from '@/lib/data/firmware-data';
import { FirmwareCatalog } from '@/components/firmware/firmware-catalog';

export const metadata: Metadata = {
  title: 'Hardware Firmware Registry & WebSerial Flasher | Hackerland',
  description:
    'Verified, pre-compiled embedded binaries for drone flight controllers, EV BMS, indigenous RISC-V silicon, and edge TinyML. Flash directly from your browser over USB without local compiler toolchains.',
  openGraph: {
    title: 'Hardware Firmware Registry & WebSerial Flasher | Hackerland',
    description:
      'One-click browser WebSerial flashing for ESP32, STM32, RP2040, and RISC-V hardware. Pre-compiled ArduPilot, Zephyr RTOS, and MicroPython binaries.',
    type: 'website',
  },
};

export default function FirmwarePage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <FirmwareCatalog initialItems={FIRMWARE_REGISTRY} />
    </div>
  );
}
