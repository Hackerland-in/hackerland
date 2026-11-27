'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Compass,
  Cpu,
  Factory,
  Globe2,
  GraduationCap,
  Lightbulb,
  Rocket,
  Sparkles,
  Users,
} from 'lucide-react';
import { Badge, Button, cn } from '@hackerland/ui';
import { useVenture, type VentureStageNumber } from './venture-context';

interface LifecycleStep {
  step: VentureStageNumber;
  label: string;
  shortTitle: string;
  tagline: string;
  href: string;
  ctaLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  icon: typeof Lightbulb;
}

const LIFECYCLE_STEPS: LifecycleStep[] = [
  {
    step: 1,
    label: '01 · Ideate',
    shortTitle: 'Spot Real Problems & Shape Ideas',
    tagline:
      'Pick an urgent Indian industrial, rural, or hardware problem statement — or frame your own 1-page build brief.',
    href: '/ideas',
    ctaLabel: 'Open IdeaLab',
    secondaryHref: '/problems',
    secondaryLabel: 'Browse Problem Bank',
    icon: Lightbulb,
  },
  {
    step: 2,
    label: '02 · Learn',
    shortTitle: 'Master Any Sector From Scratch',
    tagline:
      'Follow beginner-to-engineer pathways across 10 core sectors: electronics, EV, drones, MedTech, textiles, agro & CNC.',
    href: '/sectors',
    ctaLabel: 'Explore 10 Sectors',
    secondaryHref: '/young-innovators',
    secondaryLabel: 'Students & Youth (8–26)',
    icon: GraduationCap,
  },
  {
    step: 3,
    label: '03 · Team Up',
    shortTitle: 'Build Your Squad & Win Sprints',
    tagline:
      'Recruit embedded, mechanical, and design peers in Squad Rooms, compete in 48H Sprints, or claim open bounties.',
    href: '/squads',
    ctaLabel: 'Join Squad Rooms',
    secondaryHref: '/sprints',
    secondaryLabel: '48H Build Sprints',
    icon: Users,
  },
  {
    step: 4,
    label: '04 · Manufacture',
    shortTitle: 'Simulate, Source & Run Pilot Batches',
    tagline:
      'Design schematics & PCBs in full-screen labs, price BOMs & Fab quotes, test on HIL benches, and bridge ₹5L pilots to plants.',
    href: '/manufacturing',
    ctaLabel: 'Open Fab Labs',
    secondaryHref: '/how-to-start',
    secondaryLabel: 'Pilot-to-Plant Guides',
    icon: Factory,
  },
  {
    step: 5,
    label: '05 · Export',
    shortTitle: 'Certify & Export to the World',
    tagline:
      'Bridge BIS/NABL to CE, FCC & UL, calculate HSN + Incoterms (FOB/CIF/DDP) margins with RoDTEP/PLI & pass OEM PPAP audits.',
    href: '/export',
    ctaLabel: 'Global Export Hub',
    secondaryHref: '/compliance',
    secondaryLabel: 'Compliance & Launchpad',
    icon: Globe2,
  },
];

const YOUTH_PERSONAS = [
  {
    title: 'Student / Diploma Builder',
    detail: 'Zero hardware experience? Start with visual kits, ₹1k bench projects & sector 101s.',
    href: '/sectors',
  },
  {
    title: 'Hardware / Factory Founder',
    detail: 'Calculate BOM landed cost, get Indian PCB/CNC fab quotes & prep CE/FCC exports.',
    href: '/how-to-start',
  },
  {
    title: 'Young Tinkerers (Ages 8–26)',
    detail: 'Safe guided hardware challenges, ATL clubs & college sprint squads across India.',
    href: '/young-innovators',
  },
];

const FEATURED_CLUSTERS = [
  { label: 'Semiconductors & PCB', cluster: 'Bengaluru · Ahmedabad', href: '/sectors/semiconductors-electronics' },
  { label: 'EV, Battery & Solar', cluster: 'Pune · Chennai · Hosur', href: '/sectors/ev-clean-energy' },
  { label: 'Drones, Defense & Space', cluster: 'Hyderabad · Bengaluru', href: '/sectors/drones-defense-space' },
  { label: 'Technical Textiles', cluster: 'Tiruppur · Surat', href: '/sectors/technical-textiles-apparel' },
  { label: 'MedTech & Diagnostics', cluster: 'Visakhapatnam · NCR', href: '/sectors/medtech-diagnostics' },
  { label: 'Precision CNC & Robotics', cluster: 'Rajkot · Coimbatore', href: '/sectors/robotics-cnc-automation' },
];

export function IndiaJourneyHero() {
  const { activeVenture } = useVenture();
  const [selectedStep, setSelectedStep] = useState<VentureStageNumber>(
    activeVenture?.currentStage ?? 1,
  );

  const currentStage =
    LIFECYCLE_STEPS.find((s) => s.step === selectedStep) ?? LIFECYCLE_STEPS[0]!;
  const StageIcon = currentStage.icon;

  return (
    <section
      aria-label="India Building and Export Launchpad"
      className="rounded-3xl border border-accent/25 bg-gradient-to-br from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-7 shadow-xs space-y-6"
    >
      {/* Top North Star Copy + Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="space-y-2.5 min-w-0 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-display font-bold text-on-solid shadow-xs">
              <Sparkles className="size-3.5" aria-hidden="true" />
              <span>India&apos;s Global Building &amp; Manufacturing Network</span>
            </span>
            <Badge tone="neutral" variant="outline" className="font-mono text-[10px]">
              Ideate → Learn → Squad → Manufacture → Export
            </Badge>
          </div>

          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight break-words">
            Build from India. Manufacture for the world.
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted leading-relaxed">
            Whether you&apos;re an 18-year-old diploma maker in Pune, a loom technologist in Tiruppur, or a deep-tech startup shipping internationally — follow the complete path from first spark and free skill labs to pilot factories and global OEM exports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button asChild size="md" variant="primary" className="shadow-glow-accent">
            <Link href="/sectors">
              <Compass className="size-4" aria-hidden="true" />
              <span>Explore All 10 Sectors</span>
            </Link>
          </Button>
          <Button asChild size="md" variant="secondary">
            <Link href="/resources">
              <Sparkles className="size-4 text-accent-fg" aria-hidden="true" />
              <span>Funding &amp; Free Labs</span>
            </Link>
          </Button>
          <Button asChild size="md" variant="soft">
            <Link href="/export">
              <Globe2 className="size-4" aria-hidden="true" />
              <span>Export Hub</span>
            </Link>
          </Button>
          <Button asChild size="md" variant="secondary">
            <Link href="/new">
              <Rocket className="size-4 text-accent-fg" aria-hidden="true" />
              <span>Start Build</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Interactive 5-Stage Lifecycle Explorer */}
      <div className="rounded-2xl border border-hairline bg-surface-1/95 p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-accent-fg">
            Your Complete Idea-to-Export Roadmap
          </span>
          {activeVenture && (
            <span className="text-[11px] font-mono text-fg-muted truncate max-w-sm">
              Active thread: <strong className="text-fg">{activeVenture.title}</strong>
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {LIFECYCLE_STEPS.map((st) => {
            const Icon = st.icon;
            const active = selectedStep === st.step;
            return (
              <button
                key={st.step}
                type="button"
                onClick={() => setSelectedStep(st.step)}
                className={cn(
                  'rounded-xl border p-2.5 text-left transition-all cursor-pointer flex flex-col gap-1',
                  active
                    ? 'border-accent bg-accent-soft text-accent-fg shadow-xs'
                    : 'border-hairline bg-sunken/70 text-fg-muted hover:border-accent/35 hover:text-fg',
                )}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wide">
                    {st.label}
                  </span>
                  <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                </div>
                <span className="text-[12px] font-display font-semibold line-clamp-1 text-fg">
                  {st.shortTitle}
                </span>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-hairline bg-sunken/70 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="size-9 rounded-xl bg-accent text-on-solid flex items-center justify-center shrink-0">
              <StageIcon className="size-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-body-md font-bold text-fg">
                {currentStage.label} — {currentStage.shortTitle}
              </h2>
              <p className="text-body-xs text-fg-muted leading-snug mt-0.5">
                {currentStage.tagline}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button asChild size="sm" variant="primary">
              <Link href={currentStage.href}>
                <span>{currentStage.ctaLabel}</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <Link href={currentStage.secondaryHref}>{currentStage.secondaryLabel}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Youth Persona Entry Ramps + Industrial Cluster Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {YOUTH_PERSONAS.map((p) => (
          <Link
            key={p.title}
            href={p.href}
            className="rounded-xl border border-hairline bg-surface-1 p-3 hover:border-accent/40 hover:bg-surface-1 transition-all group flex items-start justify-between gap-2"
          >
            <div className="min-w-0">
              <div className="font-display text-body-sm font-bold text-fg group-hover:text-accent-fg flex items-center gap-1.5">
                <Cpu className="size-3.5 text-accent shrink-0" aria-hidden="true" />
                <span className="truncate">{p.title}</span>
              </div>
              <p className="text-[12px] text-fg-muted mt-0.5 leading-snug">{p.detail}</p>
            </div>
            <ArrowRight className="size-3.5 text-fg-subtle group-hover:text-accent-fg shrink-0 mt-1" />
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-mono font-semibold text-fg-subtle mr-1">
          Industrial Clusters:
        </span>
        {FEATURED_CLUSTERS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-1 px-2.5 py-1 text-[11px] font-medium text-fg-muted hover:border-accent/40 hover:text-accent-fg transition-colors"
          >
            <span className="font-semibold text-fg">{c.label}</span>
            <span className="text-fg-subtle">· {c.cluster}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
