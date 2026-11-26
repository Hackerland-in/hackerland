import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Cpu, Factory } from 'lucide-react';
import { Card } from '@hackerland/ui';
import { RFQCalculator } from '@/components/manufacturing/rfq/rfq-calculator';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'Instant PCB Fabrication & RFQ Quotation Engine | Hackerland',
  description:
    'Compare real-time PCB prototype and assembly manufacturing costs across domestic Indian fabricators (LionCircuits, PCB Power, Circuit99) and global suppliers with zero customs surprises.',
};

export default function RFQPage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <div className="space-y-6 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-1 px-4 py-3 text-body-xs">
            <Link
              href="/manufacturing"
              className="inline-flex items-center gap-1.5 text-fg-muted hover:text-accent-fg transition font-medium"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Manufacturing Hub</span>
            </Link>

            <Link
              href="/manufacturing/pcb"
              className="inline-flex items-center gap-1.5 text-accent-fg hover:underline font-semibold"
            >
              <Cpu className="size-3.5" />
              <span>Open In-Browser PCB Studio</span>
            </Link>
          </div>

          <Card className="rounded-2xl border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
              <Factory className="size-3.5" aria-hidden="true" />
              <span>India-First Hardware Supply Chain</span>
            </div>
            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
              Instant PCB Fabrication &amp; Quoting Engine
            </h1>
            <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
              Compare prototype lead times and landed costs across domestic Indian fabs and global suppliers with GST &amp; import duties itemized cleanly.
            </p>
          </Card>

          <RFQCalculator />
        </div>
      </SocialShell>
    </SocialCommunityProvider>
  );
}
