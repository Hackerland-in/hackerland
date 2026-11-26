import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { HardwareBenchStudio } from '@/components/manufacturing/bench/hardware-bench-studio';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';
import { SocialCommunityProvider } from '@/components/social/social-context';

export const metadata: Metadata = {
  title: 'Cyber-Physical Hardware Bench Studio · Hackerland',
  description: 'Interactive ESP32-S3 microcontroller, OLED SSD1306, WS2812B NeoPixel, and UART Serial Monitor.',
};

export default function BenchStudioPage() {
  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="firmware"
        title="ESP-Labs Hardware Bench Studio"
        subtitle="Interactive ESP32-S3 microcontroller, OLED SSD1306, WS2812B NeoPixel & UART Serial Monitor"
        category="Cyber-Physical Systems"
        badge="ESP32-S3 / OLED / UART"
        currentRoute="/manufacturing/bench"
        edgeToEdge
      >
        <StudioBreadcrumb
          title="ESP-Labs Hardware Bench Studio"
          category="Cyber-Physical Systems"
          badge="ESP32-S3 / OLED / UART"
          activeId="bench"
        />
        <HardwareBenchStudio initialTrackId="pcb" />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
