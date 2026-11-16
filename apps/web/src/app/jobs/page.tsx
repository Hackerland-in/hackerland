import type { Metadata } from 'next';
import { JobsStudio } from '@/components/jobs/jobs-studio';

export const metadata: Metadata = {
  title: 'Hardware & Deep-Tech Jobs, Fellowships & Residencies | Hackerland',
  description:
    'Proof-of-work hiring for aerospace, robotics, EV power electronics, BMS firmware, RISC-V silicon, and defense hardware engineering across India.',
  openGraph: {
    title: 'Hardware Deep-Tech Jobs & Fellowships | Hackerland',
    description:
      'Get hired based on verified schematics, firmware repositories, oscilloscope traces, and physical prototypes built.',
    type: 'website',
  },
};

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <JobsStudio />
    </div>
  );
}
