'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Cpu,
  ExternalLink,
  Factory,
  FlaskConical,
  Globe2,
  GraduationCap,
  Hammer,
  IndianRupee,
  Layers,
  Lightbulb,
  MapPin,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Panel,
  cn,
} from '@hackerland/ui';
import type { EnrichedSectorPathway } from '@/lib/data/sectors-data';
import { TrackBadge } from '@/components/domain/track-badge';

const CORRIDOR_NAMES: Record<'us' | 'eu' | 'uae_gcc' | 'asean' | 'africa', string> = {
  us: 'United States',
  eu: 'European Union',
  uae_gcc: 'UAE & GCC',
  asean: 'ASEAN',
  africa: 'Africa',
};

const STAGE_INDEX_LABEL: Record<string, string> = {
  raw_input: 'Stage 01 · Raw Input',
  sub_assembly: 'Stage 02 · Sub-Assembly',
  integration_qa: 'Stage 03 · Integration & QA',
  certification: 'Stage 04 · Certification',
  export: 'Stage 05 · Export Dispatch',
};

const AUTOPSY_KIND_LABEL: Record<'story' | 'teardown' | 'museum', string> = {
  story: 'Build Story',
  teardown: 'Hardware Teardown',
  museum: 'Failure Museum Autopsy',
};

const RUNG_NAV = [
  { id: 'rung-0', label: 'Rung 0 · Industry 101 & Jargon' },
  { id: 'rung-1', label: 'Rung 1 · Free Sims & 22-Lang' },
  { id: 'rung-2', label: 'Rung 2 · ₹2k–₹15k Starter' },
  { id: 'rung-3', label: 'Rung 3 · Pilot & Squad' },
  { id: 'rung-4', label: 'Rung 4 · Factory & Export' },
] as const;

export interface SectorDetailPathwayProps {
  sector: EnrichedSectorPathway;
}

export function SectorDetailPathway({ sector }: SectorDetailPathwayProps) {
  const [jargonQuery, setJargonQuery] = useState('');
  const [selectedIdeaIdx, setSelectedIdeaIdx] = useState(0);

  const filteredJargon = useMemo(() => {
    const q = jargonQuery.trim().toLowerCase();
    if (!q) return sector.jargonDecoder;
    return sector.jargonDecoder.filter(
      (j) =>
        j.term.toLowerCase().includes(q) ||
        j.plainEnglish.toLowerCase().includes(q) ||
        j.whyItMattersInIndia.toLowerCase().includes(q),
    );
  }, [sector.jargonDecoder, jargonQuery]);

  const activeIdea = sector.starterProjectIdeas[selectedIdeaIdx] ?? sector.starterProjectIdeas[0];

  return (
    <div className="space-y-6 min-w-0">
      {/* Top Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface-1 p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <Button asChild variant="secondary" size="sm">
            <Link href="/sectors">
              <ArrowLeft className="size-4" aria-hidden="true" />
              <span>All 10 Sectors</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2 min-w-0">
            <Badge tone={sector.enrichment.accentTone} variant="outline">
              {sector.enrichment.shortLabel}
            </Badge>
            <span className="text-fg-subtle">/</span>
            <span className="font-display text-body-sm font-semibold text-fg truncate">
              5-Rung Pathway
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {sector.enrichment.grantTags.slice(0, 3).map((tag) => (
            <Badge key={tag} tone="earn" variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Hero Overview */}
      <header className="rounded-3xl border border-accent/25 bg-gradient-to-br from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-display font-bold text-on-solid">
            <Layers className="size-3.5" aria-hidden="true" />
            <span>Progressive 5-Rung Beginner-to-Export Ladder</span>
          </span>
          <Badge tone="neutral" variant="outline" className="bg-surface-1">
            ITI · Diploma · Student · Founder Friendly
          </Badge>
        </div>

        <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
          {sector.name}
        </h1>
        <p className="text-body-sm sm:text-body-md text-fg-muted max-w-3xl leading-relaxed">
          {sector.tagline}
        </p>

        {/* Indian Cluster Cities */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="inline-flex items-center gap-1 text-body-xs font-display font-semibold text-fg-subtle mr-1">
            <MapPin className="size-3.5 text-accent" aria-hidden="true" />
            <span>Hubs:</span>
          </span>
          {sector.allClusterCities.map((city) => (
            <span
              key={city}
              className="rounded-full border border-hairline bg-surface-1 px-2.5 py-0.5 text-[11px] font-medium text-fg"
            >
              {city}
            </span>
          ))}
        </div>

        {/* 4-Metric Cost & Export Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="rounded-2xl border border-accent/25 bg-surface-1 p-3.5">
            <div className="text-[10px] font-display font-semibold uppercase tracking-wider text-fg-subtle">
              Rung 2 · Starter Build
            </div>
            <div className="mt-1 font-mono text-body-md font-bold text-accent-fg">
              {sector.starterCostRangeInr.label}
            </div>
            <div className="mt-0.5 text-[11px] text-fg-muted">DIY / ATL bench prototype</div>
          </div>
          <div className="rounded-2xl border border-hairline bg-surface-1 p-3.5">
            <div className="text-[10px] font-display font-semibold uppercase tracking-wider text-fg-subtle">
              Rung 3 · Missing Middle Pilot
            </div>
            <div className="mt-1 font-mono text-body-md font-bold text-fg">
              {sector.pilotCostRangeInr.label}
            </div>
            <div className="mt-0.5 text-[11px] text-fg-muted">
              {sector.enrichment.pilotBridge.batchRangeLabel}
            </div>
          </div>
          <div className="rounded-2xl border border-hairline bg-surface-1 p-3.5">
            <div className="text-[10px] font-display font-semibold uppercase tracking-wider text-fg-subtle">
              Rung 4 · Factory CapEx
            </div>
            <div className="mt-1 font-mono text-body-md font-bold text-fg">
              {sector.plantCapexRangeInr.label}
            </div>
            <div className="mt-0.5 text-[11px] text-fg-muted">Dedicated Indian plant scale</div>
          </div>
          <div className="rounded-2xl border border-hairline bg-surface-1 p-3.5">
            <div className="text-[10px] font-display font-semibold uppercase tracking-wider text-fg-subtle">
              Export Corridors
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {sector.keyExportCorridors.map((corridor) => (
                <span
                  key={corridor}
                  className="rounded-md border border-accent/25 bg-accent-soft px-1.5 py-0.5 text-[10px] font-mono font-bold text-accent-fg"
                >
                  {CORRIDOR_NAMES[corridor]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Rung Jump Navigation */}
        <nav aria-label="Ladder rungs navigation" className="flex flex-wrap gap-2 pt-2 border-t border-hairline">
          {RUNG_NAV.map((rung) => (
            <a
              key={rung.id}
              href={`#${rung.id}`}
              className="inline-flex items-center rounded-full border border-hairline bg-surface-1 px-3 py-1.5 text-[12px] font-display font-semibold text-fg-muted hover:border-accent/40 hover:text-accent-fg transition-colors"
            >
              {rung.label}
            </a>
          ))}
        </nav>
      </header>

      {/* =====================================================================
          RUNG 0 — INDUSTRY 101 & JARGON DECODER
          ===================================================================== */}
      <Panel
        title="Rung 0 — Industry 101 & Jargon Decoder"
        titleId="rung-0"
        icon={<BookOpen className="size-4" aria-hidden="true" />}
        action={
          <Badge tone="accent" variant="outline">
            Zero Prior Jargon Required
          </Badge>
        }
      >
        <div className="space-y-6">
          <p className="text-body-sm text-fg-muted">
            Every industry hides behind acronyms. Understand how value and profit margins stack across the 5 real-world Indian manufacturing stages, decode critical terms in plain English, and inspect real factory stories and failure autopsies.
          </p>

          {/* 5-Stage Value Chain */}
          <div className="space-y-2.5">
            <h3 className="font-display text-body-md font-bold text-fg">
              5-Stage Value Chain in India
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {sector.valueChainSteps.map((step) => (
                <div
                  key={step.stage}
                  className="rounded-xl border border-hairline bg-sunken/70 p-3.5 flex flex-col justify-between gap-2"
                >
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent-fg">
                      {STAGE_INDEX_LABEL[step.stage] ?? step.stage}
                    </div>
                    <h4 className="font-display text-body-sm font-bold text-fg leading-snug">
                      {step.title}
                    </h4>
                    <p className="text-body-xs text-fg-muted leading-relaxed">
                      {step.indianReality}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-hairline flex items-center justify-between text-[11px]">
                    <span className="text-fg-subtle">Margin</span>
                    <span className="font-mono font-bold text-fg">{step.typicalMarginPercent}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plain-English Jargon Decoder */}
          <div className="space-y-3 rounded-2xl border border-hairline bg-sunken/50 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-body-md font-bold text-fg">
                  Plain-English Jargon Decoder
                </h3>
                <p className="text-body-xs text-fg-muted">
                  Built for complete beginners, students, and ITI / polytechnic diploma makers.
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search
                  className="size-3.5 text-fg-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  aria-label="Filter jargon terms"
                  placeholder="Filter terms..."
                  value={jargonQuery}
                  onChange={(e) => setJargonQuery(e.target.value)}
                  className="w-full rounded-xl border border-line bg-surface-1 pl-8 pr-3 py-1.5 text-body-xs text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredJargon.map((entry) => (
                <div
                  key={entry.term}
                  className="rounded-xl border border-hairline bg-surface-1 p-3.5 space-y-2"
                >
                  <div className="font-display text-body-sm font-bold text-accent-fg">
                    {entry.term}
                  </div>
                  <p className="text-body-xs text-fg leading-relaxed">{entry.plainEnglish}</p>
                  <div className="rounded-lg bg-accent-soft/60 px-2.5 py-1.5 text-[11px] text-fg-muted">
                    <span className="font-semibold text-fg">Why it matters in India: </span>
                    {entry.whyItMattersInIndia}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-World Autopsies: Stories, Teardowns & Museum */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <h3 className="font-display text-body-md font-bold text-fg">
                Case Studies, Hardware Teardowns &amp; Failure Autopsies
              </h3>
              <div className="space-y-2.5">
                {sector.resolvedAutopsies.map((item) => (
                  <Link
                    key={`${item.kind}-${item.slug}`}
                    href={item.route}
                    className="block rounded-xl border border-hairline bg-surface-1 p-3.5 hover:border-accent/40 transition-colors group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        tone={
                          item.kind === 'museum'
                            ? 'accent'
                            : item.kind === 'teardown'
                              ? 'make'
                              : 'code'
                        }
                        variant="outline"
                      >
                        {AUTOPSY_KIND_LABEL[item.kind]}
                      </Badge>
                      <ArrowRight
                        className="size-3.5 text-fg-subtle group-hover:text-accent-fg transition-colors"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-1.5 font-display text-body-sm font-bold text-fg group-hover:text-accent-fg transition-colors">
                      {item.title}
                    </div>
                    <p className="mt-1 text-body-xs text-fg-muted">{item.takeaway}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Career & ITI/Diploma Entry Roles */}
            <div className="space-y-2.5">
              <h3 className="font-display text-body-md font-bold text-fg flex items-center gap-1.5">
                <Briefcase className="size-4 text-accent" aria-hidden="true" />
                <span>Career Tracks (ITI · Polytechnic · B.Tech)</span>
              </h3>
              <div className="space-y-2.5">
                {sector.careerRoles.map((role) => (
                  <div
                    key={role.title}
                    className="rounded-xl border border-hairline bg-sunken/70 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="font-display text-body-sm font-semibold text-fg">
                        {role.title}
                      </div>
                      <div className="text-[11px] text-fg-muted">{role.entryTrack}</div>
                    </div>
                    <Badge tone="earn" variant="outline" className="font-mono shrink-0">
                      {role.indiaSalaryRangeInr}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* =====================================================================
          RUNG 1 — FREE RESOURCES & VIRTUAL SIMULATORS
          ===================================================================== */}
      <Panel
        title="Rung 1 — Free Resources & Virtual Simulators"
        titleId="rung-1"
        icon={<Cpu className="size-4" aria-hidden="true" />}
        action={
          <Button asChild variant="soft" size="sm">
            <Link href="/resources">
              <span>All Free Resources</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </Button>
        }
      >
        <div className="space-y-6">
          <p className="text-body-sm text-fg-muted">
            Learn fundamentals and simulate real circuits, physics, thermal margins, or RF links at ₹0 cost before spending a single rupee on parts.
          </p>

          {/* Browser Simulators & Workbenches */}
          <div className="space-y-2.5">
            <h3 className="font-display text-body-md font-bold text-fg">
              Interactive Simulators &amp; Hackerland Labs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sector.enrichment.zeroCostPrototypingRoutes.map((tool) => (
                <Link
                  key={`${tool.route}-${tool.label}`}
                  href={tool.route}
                  className="rounded-xl border border-hairline bg-sunken/70 p-3.5 hover:border-accent/40 hover:bg-surface-1 transition-all flex flex-col justify-between gap-2 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-body-sm font-bold text-fg group-hover:text-accent-fg transition-colors">
                        {tool.label}
                      </span>
                      <Badge tone="earn" variant="outline" className="text-[10px]">
                        ₹0
                      </Badge>
                    </div>
                    <p className="text-body-xs text-fg-muted">{tool.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-display font-semibold text-accent-fg">
                    <span>Launch Simulator</span>
                    <ArrowRight className="size-3" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* NPTEL & Spoken Tutorial 22 Languages */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-body-md font-bold text-fg flex items-center gap-1.5">
                <GraduationCap className="size-4 text-accent" aria-hidden="true" />
                <span>NPTEL &amp; IIT Bombay Spoken Tutorial (22 Indian Languages)</span>
              </h3>
              <Link
                href="/resources"
                className="text-body-xs font-display font-semibold text-accent-fg hover:underline"
              >
                Explore 22-Language Library →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sector.enrichment.vernacularCourses.map((course) => (
                <a
                  key={course.title}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-hairline bg-surface-1 p-3.5 hover:border-accent/40 transition-colors flex flex-col justify-between gap-2"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone="learn" variant="outline">
                        {course.provider}
                      </Badge>
                      <ExternalLink className="size-3.5 text-fg-subtle" aria-hidden="true" />
                    </div>
                    <div className="font-display text-body-sm font-bold text-fg">
                      {course.title}
                    </div>
                    <div className="text-[11px] font-medium text-accent-fg">
                      {course.languages}
                    </div>
                    <p className="text-body-xs text-fg-muted">{course.note}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Related Hackerland /learn Roadmaps */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-body-md font-bold text-fg">
                Matched Hackerland Skill Roadmaps (/learn)
              </h3>
              <Link
                href="/learn"
                className="text-body-xs font-display font-semibold text-accent-fg hover:underline"
              >
                Browse All Roadmaps →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sector.matchedRoadmaps.map((roadmap) => (
                <div
                  key={roadmap.slug}
                  className="rounded-xl border border-hairline bg-surface-1 p-3.5 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <TrackBadge track={roadmap.track} />
                      <span className="text-[11px] font-mono text-fg-subtle">
                        {roadmap.hours} hrs · {roadmap.level}
                      </span>
                    </div>
                    <h4 className="font-display text-body-sm font-bold text-fg">
                      {roadmap.title}
                    </h4>
                    <p className="text-body-xs text-fg-muted line-clamp-2">{roadmap.summary}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-hairline">
                    <span className="text-[11px] text-fg-subtle">
                      {roadmap.stages.length} stages · {roadmap.learners.toLocaleString()} learners
                    </span>
                    <Link
                      href={`/learn?track=${roadmap.track}`}
                      className="inline-flex items-center gap-1 text-body-xs font-display font-semibold text-accent-fg hover:underline"
                    >
                      <span>Open in /learn</span>
                      <ArrowRight className="size-3" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      {/* =====================================================================
          RUNG 2 — BUILD A ₹2K–₹15K STARTER PROJECT
          ===================================================================== */}
      <Panel
        title={`Rung 2 — Build a ${sector.starterCostRangeInr.label} Starter Project`}
        titleId="rung-2"
        icon={<Hammer className="size-4" aria-hidden="true" />}
        action={
          <Badge tone="make" variant="solid">
            Hands-On Bench Build
          </Badge>
        }
      >
        <div className="space-y-5">
          <p className="text-body-sm text-fg-muted">
            Pick a realistic weekend-to-3-week starter build priced under ₹15,000. You learn core skills, publish verifiable hardware proof-of-work, and create a stepping stone toward export-grade products.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sector.starterProjectIdeas.map((idea, idx) => {
              const isSelected = idx === selectedIdeaIdx;
              const newProjectHref = `/new?title=${encodeURIComponent(idea.title)}`;

              return (
                <Card
                  key={idea.title}
                  accent={isSelected ? 'accent' : 'make'}
                  className={cn(
                    'flex flex-col justify-between transition-all',
                    isSelected && 'border-accent/50 ring-1 ring-accent/20',
                  )}
                >
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedIdeaIdx(idx)}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-display font-semibold border cursor-pointer transition-colors',
                          isSelected
                            ? 'bg-accent text-on-solid border-accent'
                            : 'bg-sunken text-fg-muted border-hairline hover:border-accent/40',
                        )}
                      >
                        <CheckCircle2 className="size-3" aria-hidden="true" />
                        <span>{isSelected ? 'Selected Starter Kit' : 'Select Kit'}</span>
                      </button>

                      <Badge tone="earn" variant="outline" className="font-mono">
                        Est. ₹{idea.estimatedCostInr.toLocaleString('en-IN')}
                      </Badge>
                    </div>
                    <h3 className="mt-1 font-display text-body-md font-bold text-fg">
                      {idea.title}
                    </h3>
                  </CardHeader>

                  <CardBody className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {idea.skillsLearned.map((skill) => (
                        <Chip key={skill} tone="neutral" className="text-[11px] py-0.5 px-2.5">
                          {skill}
                        </Chip>
                      ))}
                    </div>

                    <div className="rounded-xl border border-hairline bg-sunken/70 p-2.5 text-body-xs text-fg-muted">
                      <span className="font-semibold text-fg">Export Hook: </span>
                      {idea.exportHook}
                    </div>
                  </CardBody>

                  <CardFooter className="flex-wrap gap-2">
                    <Button asChild variant="primary" size="sm">
                      <Link href={newProjectHref}>
                        <Rocket className="size-3.5" aria-hidden="true" />
                        <span>Launch Build (/new)</span>
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" size="sm">
                      <Link href="/ideas">
                        <Lightbulb className="size-3.5" aria-hidden="true" />
                        <span>IdeaLab</span>
                      </Link>
                    </Button>
                    <Button asChild variant="soft" size="sm">
                      <Link href="/problems">Problems</Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/young-innovators">Youth 8–26</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {activeIdea ? (
            <div className="rounded-xl border border-accent/25 bg-accent-soft/60 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-body-xs text-fg">
                <span className="font-display font-bold text-accent-fg">Ready to build: </span>
                <span>{activeIdea.title}</span>
              </div>
              <Link
                href={`/new?title=${encodeURIComponent(activeIdea.title)}`}
                className="inline-flex items-center gap-1 text-body-xs font-display font-bold text-accent-fg hover:underline shrink-0"
              >
                <span>Start Project with Pre-Filled Title</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          ) : null}
        </div>
      </Panel>

      {/* =====================================================================
          RUNG 3 — MISSING MIDDLE: PILOT BATCH & TEAM SQUAD
          ===================================================================== */}
      <Panel
        title="Rung 3 — Missing Middle: Pilot Batch & Team Squad"
        titleId="rung-3"
        icon={<Wrench className="size-4" aria-hidden="true" />}
        action={
          <Badge tone="neutral" variant="outline" className="font-mono">
            Pilot: {sector.pilotCostRangeInr.label}
          </Badge>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-hairline bg-sunken/70 p-4 space-y-2">
              <div className="text-[11px] font-display font-bold uppercase tracking-wider text-accent-fg">
                Indian EMS &amp; Job-Shop Batching ({sector.enrichment.pilotBridge.batchRangeLabel})
              </div>
              <p className="text-body-sm text-fg-muted leading-relaxed">
                {sector.enrichment.pilotBridge.emsAndJobShops}
              </p>
            </div>

            <div className="rounded-2xl border border-hairline bg-sunken/70 p-4 space-y-2">
              <div className="text-[11px] font-display font-bold uppercase tracking-wider text-accent-fg">
                Shared Labs: I-STEM · ATLs · Tool Rooms
              </div>
              <p className="text-body-sm text-fg-muted leading-relaxed">
                {sector.enrichment.pilotBridge.sharedNationalLabs}
              </p>
            </div>
          </div>

          {/* Execution Workbenches (/assembly, /sourcing, /manufacturing/rfq, /testbeds) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {sector.enrichment.pilotBridge.executionWorkbenches.map((wb) => (
              <Link
                key={wb.route}
                href={wb.route}
                className="rounded-xl border border-hairline bg-surface-1 p-3.5 hover:border-accent/40 transition-colors flex flex-col justify-between gap-2 group"
              >
                <div className="space-y-1">
                  <div className="font-display text-body-sm font-bold text-fg group-hover:text-accent-fg transition-colors">
                    {wb.label}
                  </div>
                  <p className="text-body-xs text-fg-muted">{wb.detail}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-accent-fg">
                  <span>{wb.route}</span>
                  <ArrowRight className="size-3" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>

          {/* Recommended Indian Grants */}
          <div className="space-y-3 rounded-2xl border border-hairline bg-surface-1 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-display text-body-md font-bold text-fg flex items-center gap-1.5">
                  <IndianRupee className="size-4 text-accent" aria-hidden="true" />
                  <span>Matched Indian Zero-Equity Grants</span>
                </h3>
                <p className="text-body-xs text-fg-muted">{sector.enrichment.grantNotes}</p>
              </div>
              <Button asChild variant="soft" size="sm">
                <Link href="/resources">Compare All Grants</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {sector.grantDetails.map((grant) => (
                <a
                  key={grant.tag}
                  href={grant.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-hairline bg-sunken/60 p-3 hover:border-accent/40 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-1">
                    <Badge tone="earn" variant="solid">
                      {grant.tag}
                    </Badge>
                    <ExternalLink className="size-3 text-fg-subtle" aria-hidden="true" />
                  </div>
                  <div className="font-display text-body-xs font-bold text-fg">
                    {grant.fullName}
                  </div>
                  <div className="font-mono text-body-xs font-bold text-accent-fg">
                    {grant.amountLabel}
                  </div>
                  <div className="text-[11px] text-fg-muted">{grant.equityNote}</div>
                </a>
              ))}
            </div>
          </div>

          {/* Squad Recruitment & 48H Sprints */}
          <div className="rounded-2xl border border-accent/25 bg-gradient-to-r from-surface-1 to-accent-soft p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-display text-body-md font-bold text-fg">
                <Users className="size-4 text-accent" aria-hidden="true" />
                <span>Recruit a Cross-Disciplinary Squad &amp; Ship a 48H Sprint</span>
              </div>
              <p className="text-body-xs text-fg-muted">
                Pair electronics, mechanical CAD, firmware, and compliance peers inside Hackerland Squad Rooms.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button asChild variant="primary" size="sm">
                <Link href="/squads">Recruit in /squads</Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link href="/sprints">Join /sprints</Link>
              </Button>
            </div>
          </div>
        </div>
      </Panel>

      {/* =====================================================================
          RUNG 4 — FACTORY SCALE & GLOBAL EXPORT
          ===================================================================== */}
      <Panel
        title="Rung 4 — Factory Scale & Global Export"
        titleId="rung-4"
        icon={<Factory className="size-4" aria-hidden="true" />}
        action={
          <Button asChild variant="primary" size="sm">
            <Link href="/export">
              <Globe2 className="size-3.5" aria-hidden="true" />
              <span>Open Global Export Hub</span>
            </Link>
          </Button>
        }
      >
        <div className="space-y-6">
          <div className="rounded-2xl border border-hairline bg-sunken/70 p-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-display text-body-sm font-bold text-fg">
                Global Demand &amp; Export Realization
              </span>
              <span className="font-mono text-body-xs font-bold text-accent-fg">
                Commercial CapEx: {sector.plantCapexRangeInr.label}
              </span>
            </div>
            <p className="text-body-sm text-fg-muted leading-relaxed">
              {sector.globalExportDemand}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
              <span className="text-body-xs text-fg-muted">
                {sector.enrichment.digitalAndCraftBridgeNote}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Plant Blueprints (/how-to-start/[plantSlug]) */}
            <div className="space-y-2.5">
              <h3 className="font-display text-body-md font-bold text-fg flex items-center gap-1.5">
                <Factory className="size-4 text-accent" aria-hidden="true" />
                <span>Factory Setup Blueprints (/how-to-start)</span>
              </h3>
              <div className="space-y-2.5">
                {sector.matchedPlants.map((plant) => (
                  <Link
                    key={plant.slug}
                    href={`/how-to-start/${plant.slug}`}
                    className="block rounded-xl border border-hairline bg-surface-1 p-3.5 hover:border-accent/40 transition-colors group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone="make" variant="outline">
                        {plant.category}
                      </Badge>
                      <span className="font-mono text-[11px] font-bold text-fg-subtle">
                        {plant.capitalRequirements.pilotCapEx}
                      </span>
                    </div>
                    <div className="mt-1.5 font-display text-body-sm font-bold text-fg group-hover:text-accent-fg transition-colors">
                      {plant.title}
                    </div>
                    <p className="mt-1 text-body-xs text-fg-muted line-clamp-2">{plant.tagline}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-display font-semibold text-accent-fg">
                      <span>Open Plant Machinery &amp; CapEx Guide</span>
                      <ArrowRight className="size-3" aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Statutory Compliance & Export Readiness (/compliance/[slug] + /export) */}
            <div className="space-y-3">
              <h3 className="font-display text-body-md font-bold text-fg flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-accent" aria-hidden="true" />
                <span>Compliance &amp; Export Certification (/compliance)</span>
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {sector.keyComplianceStandards.map((std) => (
                  <Chip key={std} tone="neutral" className="text-[11px] py-0.5 px-2.5">
                    {std}
                  </Chip>
                ))}
              </div>

              <div className="space-y-2.5">
                {sector.matchedCompliances.map((comp) => (
                  <Link
                    key={comp.slug}
                    href={`/compliance/${comp.slug}`}
                    className="block rounded-xl border border-hairline bg-surface-1 p-3.5 hover:border-accent/40 transition-colors group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone="accent" variant="outline">
                        {(comp.statutoryBodies[0] ?? 'BIS').replace(/_/g, ' ').toUpperCase()}
                      </Badge>
                      <span className="font-mono text-[11px] text-fg-subtle">
                        {comp.applicableStandards[0]?.code ?? comp.productCategory}
                      </span>
                    </div>
                    <div className="mt-1.5 font-display text-body-sm font-bold text-fg group-hover:text-accent-fg transition-colors">
                      {comp.title}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-fg-muted">
                      <span>
                        Est. {comp.estimatedTimelineWeeks.minWeeks}–{comp.estimatedTimelineWeeks.maxWeeks} weeks
                      </span>
                      <span className="font-semibold text-accent-fg group-hover:underline">
                        Open Checklist →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="rounded-xl border border-accent/25 bg-accent-soft/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-display text-body-sm font-bold text-fg">
                    Ready to Price FOB / CIF / DDP Exports?
                  </div>
                  <div className="text-body-xs text-fg-muted">
                    Compute HSN RoDTEP scrips, ILAC-MRA lab overlap &amp; SCOMET checks.
                  </div>
                </div>
                <Button asChild variant="primary" size="sm" className="shrink-0">
                  <Link href="/export">
                    <FlaskConical className="size-3.5" aria-hidden="true" />
                    <span>Open /export</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
