import type { Metadata } from 'next';
import { SectionHeader, StatTile } from '@hackerland/ui';
import { GraduationCap, ShieldCheck, Cpu, Users } from 'lucide-react';
import { YoungInnovatorsHub } from '@/components/young-innovators/young-innovators-hub';

export const metadata: Metadata = {
  title: 'Young Innovators Track & Safety Sandbox · Hackerland',
  description:
    'Dedicated DPDP-compliant track for makers ages 8–17 with visual block-to-hardware simulators, supervised challenges, verified educator mentors, and Atal Tinkering Lab equipment sharing.',
};

export default function YoungInnovatorsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-w-0">
      {/* Header */}
      <SectionHeader
        as="h1"
        size="page"
        eyebrow="SUPERVISED JUNIOR INNOVATION TRACK"
        title="Young Innovators Track & Safety Sandbox"
        description="Empowering the next generation of builders ages 8 to 17 across India. Transition seamlessly from visual logic blocks to real embedded C and MicroPython, with certified school Atal Tinkering Lab (ATL) mentorship and strict DPDP Act child data protection."
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 min-w-0">
        <StatTile
          label="JUNIOR BUILDERS"
          value="1,240+"
          hint="Ages 8–17 across India"
          tone="accent"
          icon={<Users className="size-4" />}
        />
        <StatTile
          label="ATL PARTNER LABS"
          value="48 Nodes"
          hint="Equipped with Micro:bit & Pico"
          tone="make"
          icon={<Cpu className="size-4" />}
        />
        <StatTile
          label="DPDP GUARDIAN TOKENS"
          value="980+"
          hint="Verified parent / teacher co-signs"
          tone="learn"
          icon={<ShieldCheck className="size-4" />}
        />
        <StatTile
          label="PROJECTS SHIPPED"
          value="310+"
          hint="Working physical prototypes"
          tone="code"
          icon={<GraduationCap className="size-4" />}
        />
      </div>

      {/* Hub Component */}
      <YoungInnovatorsHub />
    </div>
  );
}
