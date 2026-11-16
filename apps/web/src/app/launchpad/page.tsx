import type { Metadata } from 'next';
import { LaunchpadStudio } from '@/components/launchpad/launchpad-studio';

export const metadata: Metadata = {
  title: 'Hardware Launchpad & Indian Govt Grant Matcher | Hackerland',
  description:
    'Milestone-locked micro-crowdfunding and Indian government non-dilutive grant matcher (iDEX, BIRAC BIG, DST NIDHI-PRAYAS, Semiconductor DLI) for breakthrough hardware engineering.',
  openGraph: {
    title: 'Hardware Launchpad & Indian Govt Grant Matcher | Hackerland',
    description:
      'Back physical hardware with zero lump-sum risk. Funds are locked in smart escrow and released upon verified EVT, DVT, and PVT engineering milestones.',
    type: 'website',
  },
};

export default function LaunchpadPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <LaunchpadStudio />
    </div>
  );
}
