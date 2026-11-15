import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { HardwareBenchStudio } from '@/components/manufacturing/bench/hardware-bench-studio';

export const metadata: Metadata = {
  title: 'Cyber-Physical Hardware Bench Studio · Hackerland',
  description: 'Interactive ESP32-S3 microcontroller, OLED SSD1306, WS2812B NeoPixel, and UART Serial Monitor.',
};

export default function BenchStudioPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 min-w-0">
      <StudioBreadcrumb
        title="ESP-Labs Hardware Bench Studio"
        category="Cyber-Physical Systems"
        badge="ESP32-S3 / OLED / UART"
        activeId="bench"
      />
      <HardwareBenchStudio initialTrackId="pcb" />
    </div>
  );
}
