import type { Metadata } from 'next';
import { TELEMETRY_PROFILES } from '@/lib/data/telemetry-data';
import { TelemetryStudio } from '@/components/telemetry/telemetry-studio';

export const metadata: Metadata = {
  title: 'Digital Twin & Hardware Telemetry Stream Visualizer | Hackerland',
  description:
    'Real-time digital twin oscilloscope and telemetry visualizer for drone flight dynamics, AIS-156 EV BMS battery packs, RISC-V LoRaWAN sensors, and CubeSat space passes with WebSerial connectivity.',
  openGraph: {
    title: 'Digital Twin & Hardware Telemetry Visualizer | Hackerland',
    description:
      'Browser-based hardware oscilloscope, 3D attitude gyro, AIS-156 16S battery pack balancer, and live WebSerial physical hardware debugging.',
    type: 'website',
  },
};

export default function TelemetryPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <TelemetryStudio initialProfiles={TELEMETRY_PROFILES} />
    </div>
  );
}
