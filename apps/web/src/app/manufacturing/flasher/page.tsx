import type { Metadata } from 'next';
import { WebSerialFlasher } from '@/components/manufacturing/flasher/web-serial-flasher';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';

export const metadata: Metadata = {
  title: 'WebSerial Hardware Firmware Flasher & Serial Monitor | Hackerland',
  description:
    'Plug and flash ESP32, Raspberry Pi Pico, and Arduino microcontrollers directly from your web browser with zero local toolchains or driver installation.',
};

export default function FlasherPage() {
  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="firmware"
        title="WebSerial In-Browser Firmware Flasher & Monitor"
        subtitle="Flash compiled binaries to ESP32, RP2040 & STM32 targets over USB WebSerial"
        category="Firmware Toolchain"
        badge="Zero-Install USB Flasher"
        currentRoute="/manufacturing/flasher"
      >
        <WebSerialFlasher />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
