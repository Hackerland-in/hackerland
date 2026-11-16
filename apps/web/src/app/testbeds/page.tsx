import type { Metadata } from 'next';
import { TESTBED_FACILITIES } from '@/lib/data/testbeds-data';
import { TestbedCatalog } from '@/components/testbeds/testbed-catalog';

export const metadata: Metadata = {
  title: 'Remote Hardware-in-the-Loop Testbeds & Lab Benches | Hackerland',
  description:
    'Democratizing multi-crore laboratory testbeds across India. Execute automated SCPI sweeps or reserve on-site testing chambers for RF spectrum, EV battery cyclers, and EMC anechoic chambers.',
  openGraph: {
    title: 'Remote Hardware-in-the-Loop Testbeds | Hackerland',
    description:
      'Shared Keysight 20 GHz analyzers, Chroma 1000A battery cyclers, and Rohde & Schwarz anechoic chambers with remote SCPI execution and student subsidies.',
    type: 'website',
  },
};

export default function TestbedsPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <TestbedCatalog initialTestbeds={TESTBED_FACILITIES} />
    </div>
  );
}
