import type { Metadata } from 'next';
import { TeardownSubmitStudio } from '@/components/teardowns/teardown-submit-studio';

export const metadata: Metadata = {
  title: 'Submit Hardware Teardown & Reverse Engineering Autopsy | Hackerland',
  description:
    'Document chip-level schematics, interactive PCB pinout hotspots, subsystem trees, and true Bill of Materials costs of iconic hardware devices.',
  openGraph: {
    title: 'Submit Hardware Teardown | Hackerland',
    description: 'Chip-level hardware autopsies, interactive PCB pinout annotator, and BOM markup analyzer.',
    type: 'website',
  },
};

export default function TeardownSubmitPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <TeardownSubmitStudio />
    </div>
  );
}
