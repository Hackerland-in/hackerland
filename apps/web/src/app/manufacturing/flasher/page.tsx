import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Cpu, Usb } from 'lucide-react';
import { Card } from '@hackerland/ui';
import { WebSerialFlasher } from '@/components/manufacturing/flasher/web-serial-flasher';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'WebSerial Hardware Firmware Flasher & Serial Monitor | Hackerland',
  description:
    'Plug and flash ESP32, Raspberry Pi Pico, and Arduino microcontrollers directly from your web browser with zero local toolchains or driver installation.',
};

export default function FlasherPage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <div className="space-y-6 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-1 px-4 py-3 text-body-xs">
            <Link
              href="/manufacturing"
              className="inline-flex items-center gap-1.5 text-fg-muted hover:text-accent-fg transition font-medium"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Manufacturing Hub</span>
            </Link>

            <Link
              href="/manufacturing/pcb"
              className="inline-flex items-center gap-1.5 text-accent-fg hover:underline font-semibold"
            >
              <Cpu className="size-3.5" />
              <span>Open In-Browser PCB Studio</span>
            </Link>
          </div>

          <Card className="rounded-2xl border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
              <Usb className="size-3.5" aria-hidden="true" />
              <span>Zero-Install Browser Toolchain</span>
            </div>
            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
              WebSerial In-Browser Firmware Flasher &amp; Monitor
            </h1>
            <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
              Flash compiled binaries to ESP32, RP2040, and STM32 devices directly over USB via Web Serial API and monitor live UART telemetry.
            </p>
          </Card>

          <WebSerialFlasher />
        </div>
      </SocialShell>
    </SocialCommunityProvider>
  );
}
