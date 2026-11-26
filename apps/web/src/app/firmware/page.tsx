import type { Metadata } from 'next';
import { FIRMWARE_REGISTRY } from '@/lib/data/firmware-data';
import { FirmwareCatalog } from '@/components/firmware/firmware-catalog';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

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
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <FirmwareCatalog initialItems={FIRMWARE_REGISTRY} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
