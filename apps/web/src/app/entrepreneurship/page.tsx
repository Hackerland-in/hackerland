import type { Metadata } from 'next';
import { EntrepreneurshipHub } from '@/components/domain/entrepreneurship/entrepreneurship-hub';

export const metadata: Metadata = {
  title: 'Open-Source Entrepreneurship & Founder Academy | Hackerland',
  description:
    'Free university curricula, startup playlists, cap table dilution simulators, unit economics calculators, and open legal frameworks from Stanford, YC, and MIT.',
};

export default function EntrepreneurshipPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-w-0">
      <EntrepreneurshipHub />
    </div>
  );
}
