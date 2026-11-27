'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Compass,
  Cpu,
  Factory,
  Globe2,
  GraduationCap,
  IndianRupee,
  Layers,
  MapPin,
  Search,
  Sparkles,
  Wrench,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  EmptyState,
  FilterChip,
  StatTile,
} from '@hackerland/ui';
import {
  ALL_ENRICHED_SECTORS,
  CROSS_CUTTING_SECTOR_BRIDGES,
  PAN_INDIA_ECOSYSTEM_SNAPSHOT,
  searchEnrichedSectors,
  type EnrichedSectorPathway,
} from '@/lib/data/sectors-data';

const CORRIDOR_LABELS: Record<'us' | 'eu' | 'uae_gcc' | 'asean' | 'africa', string> = {
  us: 'USA',
  eu: 'EU',
  uae_gcc: 'UAE / GCC',
  asean: 'ASEAN',
  africa: 'Africa',
};

const QUICK_CLUSTER_CHIPS: { label: string; value: string }[] = [
  { label: 'All Sectors (10)', value: 'all' },
  { label: 'Bengaluru', value: 'Bengaluru' },
  { label: 'Pune', value: 'Pune' },
  { label: 'Hyderabad', value: 'Hyderabad' },
  { label: 'Coimbatore', value: 'Coimbatore' },
  { label: 'Tiruppur', value: 'Tiruppur' },
  { label: 'Surat', value: 'Surat' },
  { label: 'Rajkot', value: 'Rajkot' },
  { label: 'Guwahati', value: 'Guwahati' },
  { label: 'Noida', value: 'Noida' },
];

function SectorCard({ sector }: { sector: EnrichedSectorPathway }) {
  const firstPlant = sector.matchedPlants[0];
  const firstLab = sector.enrichment.zeroCostPrototypingRoutes[0];

  return (
    <Card
      accent={sector.enrichment.accentTone}
      interactive
      className="flex flex-col justify-between"
      data-testid={`sector-card-${sector.id}`}
    >
      <div>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge tone={sector.enrichment.accentTone} variant="outline">
              {sector.enrichment.shortLabel}
            </Badge>
            <div className="flex flex-wrap items-center gap-1.5">
              {sector.enrichment.grantTags.slice(0, 2).map((tag) => (
                <Badge key={tag} tone="earn" variant="outline" className="text-[11px]">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <h2 className="mt-1 font-display text-headline-sm font-bold text-fg [overflow-wrap:anywhere]">
            <Link
              href={`/sectors/${sector.id}`}
              className="hover:text-accent-fg transition-colors focus:outline-none focus:underline"
            >
              {sector.name}
            </Link>
          </h2>
        </CardHeader>

        <CardBody className="space-y-4">
          <p className="text-body-sm text-fg-muted leading-relaxed">{sector.tagline}</p>

          {/* Indian Clusters */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-display font-semibold uppercase tracking-wider text-fg-subtle">
              <MapPin className="size-3.5 text-accent" aria-hidden="true" />
              <span>Indian Clusters</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sector.allClusterCities.slice(0, 6).map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center rounded-full border border-hairline bg-sunken px-2.5 py-0.5 text-[11px] font-medium text-fg-muted"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>

          {/* 3-Tier Capital Ladder */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="rounded-xl border border-hairline bg-sunken/80 p-2.5">
              <div className="text-[10px] font-display font-semibold uppercase tracking-wider text-fg-subtle">
                Starter Cost
              </div>
              <div className="mt-0.5 font-mono text-body-xs font-bold text-accent-fg">
                {sector.starterCostRangeInr.label}
              </div>
            </div>
            <div className="rounded-xl border border-hairline bg-sunken/80 p-2.5">
              <div className="text-[10px] font-display font-semibold uppercase tracking-wider text-fg-subtle">
                Pilot Batch
              </div>
              <div className="mt-0.5 font-mono text-body-xs font-bold text-fg">
                {sector.pilotCostRangeInr.label}
              </div>
            </div>
            <div className="rounded-xl border border-hairline bg-sunken/80 p-2.5">
              <div className="text-[10px] font-display font-semibold uppercase tracking-wider text-fg-subtle">
                Plant CapEx
              </div>
              <div className="mt-0.5 font-mono text-body-xs font-bold text-fg">
                {sector.plantCapexRangeInr.label}
              </div>
            </div>
          </div>

          {/* Global Export Markets */}
          <div className="rounded-xl border border-hairline bg-surface-2/50 p-3 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-display font-semibold uppercase tracking-wider text-fg-subtle">
                <Globe2 className="size-3.5 text-accent" aria-hidden="true" />
                <span>Global Export Markets</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {sector.keyExportCorridors.map((corridor) => (
                  <span
                    key={corridor}
                    className="rounded-md border border-accent/25 bg-accent-soft px-1.5 py-0.5 text-[10px] font-mono font-semibold text-accent-fg"
                  >
                    {CORRIDOR_LABELS[corridor]}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-body-xs text-fg-muted line-clamp-2">{sector.globalExportDemand}</p>
          </div>
        </CardBody>
      </div>

      <CardFooter className="justify-between">
        <Button asChild variant="primary" size="sm">
          <Link href={`/sectors/${sector.id}`}>
            <span>Open 5-Rung Pathway</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </Button>

        <div className="flex flex-wrap items-center gap-2 text-[11px] font-display font-semibold">
          {firstLab ? (
            <Link href={firstLab.route} className="text-fg-muted hover:text-accent-fg transition-colors">
              Free Lab
            </Link>
          ) : null}
          {firstLab && firstPlant ? <span className="text-fg-subtle">·</span> : null}
          {firstPlant ? (
            <Link
              href={`/how-to-start/${firstPlant.slug}`}
              className="text-fg-muted hover:text-accent-fg transition-colors"
            >
              Plant Guide
            </Link>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
}

export function SectorPathwaysHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');

  const filteredSectors = useMemo(
    () => searchEnrichedSectors(searchQuery, selectedCluster),
    [searchQuery, selectedCluster],
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCluster('all');
  };

  return (
    <div className="space-y-6 min-w-0">
      {/* Hero Banner */}
      <header className="rounded-3xl border border-accent/25 bg-gradient-to-br from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-display font-bold text-on-solid">
            <Compass className="size-3.5" aria-hidden="true" />
            <span>10 Industrial Pathways · Beginner to Export</span>
          </span>
          <Badge tone="earn" variant="outline" className="bg-surface-1">
            ₹2k Starter → Pilot Batch → Global OEM
          </Badge>
        </div>

        <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
          India Sector Pathways Hub
        </h1>
        <p className="text-body-sm sm:text-body-md text-fg-muted max-w-3xl leading-relaxed">
          Start with zero prior hardware background. Every pathway decodes real factory jargon, links ₹0 simulators and 22-language courses, guides your first ₹2k–₹15k bench build, bridges 10–100 unit Indian EMS pilots, and connects straight to plant CapEx and export compliance.
        </p>

        {/* Stats Snapshot */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <StatTile
            label="CORE SECTORS"
            value={`${ALL_ENRICHED_SECTORS.length} Pathways`}
            hint="5-rung progressive ladders"
            tone="accent"
            icon={<Layers className="size-4" aria-hidden="true" />}
          />
          <StatTile
            label="STARTER ENTRY"
            value="₹2k – ₹15k"
            hint="Weekend prototype budgets"
            tone="make"
            icon={<Wrench className="size-4" aria-hidden="true" />}
          />
          <StatTile
            label="ZERO-EQUITY GRANTS"
            value={`${PAN_INDIA_ECOSYSTEM_SNAPSHOT.fundingProgramCount}+ Schemes`}
            hint="NIDHI-PRAYAS, SISFS, BIRAC"
            tone="earn"
            icon={<IndianRupee className="size-4" aria-hidden="true" />}
          />
          <StatTile
            label="FREE LABS & COURSES"
            value="22 Languages"
            hint="Browser sims + ATL / I-STEM"
            tone="code"
            icon={<GraduationCap className="size-4" aria-hidden="true" />}
          />
        </div>
      </header>

      {/* Prominent Bridge Cards: /resources & /export */}
      <section aria-label="Ecosystem resource and export bridges" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-accent/25 bg-surface-1 p-5 shadow-xs flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent" variant="solid">
                Pan-India Grants &amp; Labs
              </Badge>
              <Badge tone="earn" variant="outline">
                0% Equity + 22 Languages
              </Badge>
            </div>
            <h2 className="font-display text-headline-sm font-bold text-fg">
              Funding &amp; Free Resources — incl. Software/AI, Crafts &amp; Every Indian Zone
            </h2>
            <p className="text-body-sm text-fg-muted">
              Explore DST NIDHI-PRAYAS, SISFS, BIRAC, PM Vishwakarma, 10,000+ Atal Tinkering Labs, I-STEM, NPTEL, and IIT Bombay Spoken Tutorial across all 6 Indian regions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="primary" size="sm">
              <Link href="/resources">
                <span>Open Funding &amp; Free Resources</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link href="/young-innovators">Youth 8–26 Track</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-hairline bg-surface-1 p-5 shadow-xs flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="make" variant="outline">
                Export Corridors
              </Badge>
              <Badge tone="neutral" variant="outline">
                HSN · RoDTEP · Incoterms
              </Badge>
            </div>
            <h2 className="font-display text-headline-sm font-bold text-fg">
              Global Export Hub &amp; Compliance Readiness
            </h2>
            <p className="text-body-sm text-fg-muted">
              Map BIS/NABL ILAC-MRA reports to CE, FCC &amp; UL, compute FOB/CIF/DDP landed export margins with RoDTEP incentives, and screen SCOMET dual-use triggers.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="secondary" size="sm">
              <Link href="/export">
                <span>Open Global Export Hub</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="soft" size="sm">
              <Link href="/how-to-start">Factory Blueprints</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Search & Cluster Filter Controls */}
      <section
        aria-label="Filter sectors by domain or Indian cluster"
        className="rounded-2xl border border-hairline bg-surface-1 p-4 sm:p-5 shadow-xs space-y-3.5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search
              className="size-4 text-fg-subtle absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              aria-label="Search sectors, skills, cities, or standards"
              placeholder="Search keyword (BMS, PCB, drone, textile, MedTech), standard (BIS, AIS-156), or city (Pune, Surat, Guwahati)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-line bg-sunken pl-10 pr-4 py-2.5 text-body-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent focus:bg-surface-1 transition-colors"
            />
          </div>
          <div className="text-body-xs font-mono text-fg-subtle shrink-0">
            Showing {filteredSectors.length} of {ALL_ENRICHED_SECTORS.length} sectors
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Indian city clusters">
          {QUICK_CLUSTER_CHIPS.map((chip) => (
            <FilterChip
              key={chip.value}
              selected={selectedCluster === chip.value}
              tone="accent"
              onClick={() => setSelectedCluster(chip.value)}
            >
              {chip.label}
            </FilterChip>
          ))}
        </div>
      </section>

      {/* 10 Sectors Grid */}
      {filteredSectors.length === 0 ? (
        <EmptyState
          title="No sectors match that filter"
          description="Try another Indian industrial hub (Pune, Surat, Tiruppur, Rajkot, Bengaluru, Coimbatore, Hyderabad, Guwahati) or clear your search query."
          action={
            <Button variant="secondary" onClick={resetFilters}>
              Show all 10 sectors
            </Button>
          }
        />
      ) : (
        <section aria-label="Core manufacturing and deep-tech sectors" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSectors.map((sector) => (
            <SectorCard key={sector.id} sector={sector} />
          ))}
        </section>
      )}

      {/* Cross-Cutting Digital/AI, GI Craft & Climate Bridges */}
      <section aria-label="Cross-cutting Digital, AI, Craft, and Climate bridges" className="space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-display font-semibold uppercase tracking-wider text-accent-fg">
              <Sparkles className="size-3.5" aria-hidden="true" />
              <span>Cross-Cutting Indian Innovation Bridges</span>
            </div>
            <h2 className="font-display text-headline-sm font-bold text-fg">
              Digital AI / DPI, GI Crafts &amp; Circular Climate Tracks
            </h2>
          </div>
          <Button asChild variant="soft" size="sm">
            <Link href="/resources">Explore All Sectors &amp; Regions</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CROSS_CUTTING_SECTOR_BRIDGES.map((bridge) => (
            <Card key={bridge.id} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <Badge tone="accent" variant="outline">
                    {bridge.categoryLabel}
                  </Badge>
                  <Cpu className="size-4 text-accent" aria-hidden="true" />
                </div>
                <h3 className="font-display text-body-md font-bold text-fg mt-1">
                  {bridge.title}
                </h3>
              </CardHeader>
              <CardBody className="space-y-3">
                <p className="text-body-xs text-fg-muted leading-relaxed">{bridge.tagline}</p>
                <div className="rounded-xl border border-hairline bg-sunken/70 p-2.5 space-y-1">
                  <div className="text-[10px] font-display font-semibold uppercase tracking-wider text-fg-subtle">
                    Zero-Cost Entry
                  </div>
                  <div className="text-body-xs text-fg">{bridge.zeroCostStarter}</div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {bridge.indianHubs.slice(0, 4).map((hub) => (
                    <span
                      key={hub}
                      className="rounded-full border border-hairline bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-fg-muted"
                    >
                      {hub}
                    </span>
                  ))}
                </div>
              </CardBody>
              <CardFooter className="justify-between">
                <Link
                  href={bridge.linkedRoute}
                  className="inline-flex items-center gap-1 text-body-xs font-display font-semibold text-accent-fg hover:underline"
                >
                  <span>Open Bridge Pathway</span>
                  <ArrowRight className="size-3" aria-hidden="true" />
                </Link>
                <span className="text-[10px] font-mono text-fg-subtle">
                  {bridge.fundingFit[0]}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
