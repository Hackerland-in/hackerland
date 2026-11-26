import type { Metadata } from 'next';
import { RFQCalculator } from '@/components/manufacturing/rfq/rfq-calculator';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';

export const metadata: Metadata = {
  title: 'Instant PCB Fabrication & RFQ Quotation Engine | Hackerland',
  description:
    'Compare real-time PCB prototype and assembly manufacturing costs across domestic Indian fabricators (LionCircuits, PCB Power, Circuit99) and global suppliers with zero customs surprises.',
};

export default function RFQPage() {
  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="rfq"
        title="Instant PCB Fabrication & Quoting Engine"
        subtitle="Compare prototype lead times and landed INR costs across Indian & global fabs"
        category="Fabrication Sourcing"
        badge="GST & Customs Calculated"
        currentRoute="/manufacturing/rfq"
      >
        <RFQCalculator />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
