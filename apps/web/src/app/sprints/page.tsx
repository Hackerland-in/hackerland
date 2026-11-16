import type { Metadata } from 'next';
import { SPRINTS_CATALOG } from '@/lib/data/sprints-data';
import { SprintCatalog } from '@/components/sprints/sprint-catalog';

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
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-mono font-medium text-primary">
          <span>⚡ 48-HOUR TIME-BOXED RAPID PROTOTYPING</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Hardware Build Sprints & Bounties
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-3xl leading-relaxed">
          Prove your engineering mettle in high-stakes 48-hour sprints. Clear sequential review gates—Hour 12 CAD, Hour 24 KiCad Schematics, Hour 36 RTOS Bringup, Hour 48 Physical Video Demo—to unlock non-dilutive grant escrows, free prototype fabrication credits, and premier lab vouchers.
        </p>
      </div>

      <SprintCatalog initialSprints={SPRINTS_CATALOG} />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
