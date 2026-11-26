import type { Metadata } from 'next';
import { Zap } from 'lucide-react';
import { SPRINTS_CATALOG } from '@/lib/data/sprints-data';
import { SprintCatalog } from '@/components/sprints/sprint-catalog';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';
import { OpportunitiesTabs } from '@/components/social/opportunities-tabs';

export const metadata: Metadata = {
  title: 'Hardware Sprints & 48-Hour Rapid Build Hackathons | Hackerland',
  description:
    'Time-boxed 48-hour hardware sprints with milestones for mechanical CAD, PCB schematics, RTOS firmware bringup, and physical demo videos. Backed by non-dilutive government and industry grants across India.',
  keywords: [
    'hardware hackathon',
    '48 hour build sprint',
    'deep-tech hackathon india',
    'drone hackathon CSIR NAL',
    'EV BMS sprint ARAI',
    'RISC-V silicon hackathon IIT Madras',
    'open hardware bounties',
  ],
  openGraph: {
    title: 'Hardware Sprints & 48-Hour Rapid Build Hackathons | Hackerland',
    description:
      'Compete in 48-hour time-boxed hardware build sprints with cash escrow disbursements, CAD/PCB review gates, and NABL lab perks.',
    url: 'https://www.hackerland.in/sprints',
    siteName: 'Hackerland',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function SprintsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hackerland Hardware Build Sprints',
    description: '48-hour time-boxed rapid hardware build sprints and hackathons.',
    itemListElement: SPRINTS_CATALOG.map((sprint, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Event',
        name: sprint.title,
        description: sprint.tagline,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        eventStatus:
          sprint.currentStatus === 'active'
            ? 'https://schema.org/EventScheduled'
            : sprint.currentStatus === 'completed'
            ? 'https://schema.org/EventMovedOnline'
            : 'https://schema.org/EventPostponed',
        url: `https://www.hackerland.in/sprints/${sprint.slug}`,
      },
    })),
  };

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <OpportunitiesTabs />

        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <span className="size-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
            <Zap className="size-3.5" aria-hidden="true" />
            <span>48-Hour Time-Boxed Rapid Prototyping</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
            Hardware Build Sprints &amp; Bounties
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
            Clear sequential engineering gates — Hour 12 CAD, Hour 24 KiCad Schematics, Hour 36 RTOS Bringup, and Hour 48 Physical Video Demo — to unlock non-dilutive grant escrows and NABL lab vouchers.
          </p>
        </header>

        <SprintCatalog initialSprints={SPRINTS_CATALOG} />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
