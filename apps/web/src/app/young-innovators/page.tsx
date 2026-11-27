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
        <YoungInnovatorsHub
          statsSlot={
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
          }
        />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
