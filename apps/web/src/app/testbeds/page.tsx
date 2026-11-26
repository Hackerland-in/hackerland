import type { Metadata } from 'next';
import { TESTBED_FACILITIES } from '@/lib/data/testbeds-data';
import { TestbedCatalog } from '@/components/testbeds/testbed-catalog';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

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
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <TestbedCatalog initialTestbeds={TESTBED_FACILITIES} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
