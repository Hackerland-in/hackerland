import type { Metadata } from 'next';
import { StatTile } from '@hackerland/ui';
import { GraduationCap, ShieldCheck, Cpu, Users } from 'lucide-react';
import { YoungInnovatorsHub } from '@/components/young-innovators/young-innovators-hub';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'Young Innovators Track & Safety Sandbox · Hackerland',
  description:
    'Dedicated DPDP-compliant track for makers ages 8–17 with visual block-to-hardware simulators, supervised challenges, verified educator mentors, and Atal Tinkering Lab equipment sharing.',
};

export default function YoungInnovatorsPage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <GraduationCap className="size-3.5" aria-hidden="true" />
            <span>Supervised Junior Innovation Track</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
            Young Innovators Track &amp; Safety Sandbox
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-xl">
            Empowering builders ages 8 to 17 across India to move from visual blocks to MicroPython and Arduino C++, backed by DPDP Act guardian consent and ATL mentors.
          </p>
        </header>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 min-w-0">
          <StatTile
            label="JUNIOR BUILDERS"
            value="1,240+"
            hint="Ages 8–17 across India"
            tone="accent"
            icon={<Users className="size-4" aria-hidden="true" />}
          />
          <StatTile
            label="ATL PARTNER LABS"
            value="48 Nodes"
            hint="Micro:bit & Pico kits"
            tone="make"
            icon={<Cpu className="size-4" aria-hidden="true" />}
          />
          <StatTile
            label="DPDP GUARDIAN TOKENS"
            value="980+"
            hint="Verified co-signs"
            tone="earn"
            icon={<ShieldCheck className="size-4" aria-hidden="true" />}
          />
          <StatTile
            label="PROJECTS SHIPPED"
            value="310+"
            hint="Working physical builds"
            tone="code"
            icon={<GraduationCap className="size-4" aria-hidden="true" />}
          />
        </div>

        <YoungInnovatorsHub />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
