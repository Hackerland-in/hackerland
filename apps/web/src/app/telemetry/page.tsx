import type { Metadata } from 'next';
import { TELEMETRY_PROFILES } from '@/lib/data/telemetry-data';
import { TelemetryStudio } from '@/components/telemetry/telemetry-studio';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';

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
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="telemetry"
        title="Digital Twin & Hardware Telemetry Visualizer"
        subtitle="Real-time oscilloscope, 3D attitude indicator, 16S BMS cell balancer & WebSerial console"
        category="Live Telemetry Lab"
        badge="WebSerial · 200Hz"
        currentRoute="/telemetry"
        edgeToEdge
      >
        <TelemetryStudio initialProfiles={TELEMETRY_PROFILES} />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
