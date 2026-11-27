'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, Badge, Button } from '@hackerland/ui';
import {
  Factory,
  Wrench,
  Compass,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Globe,
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { PLANT_BLUEPRINTS, PLANT_CATEGORIES } from './how-to-start-data';
import { PlantBudgetEstimator } from './plant-budget-estimator';

const START_SMALLER_LADDER = [
  {
    step: '01 · Lab & Prototype',
    budget: '₹0 – ₹50k',
    title: 'Learn, Simulate & Build Lab Rig',
    description: 'Validate schematics, CAD & firmware at campus ATLs and physics simulators before tooling spend.',
    links: [
      { label: 'Learn Roadmaps', href: '/learn' },
      { label: 'Makerspaces & Labs', href: '/labs' },
      { label: 'Physics & EDA', href: '/manufacturing' },
    ],
  },
  {
    step: '02 · Missing Middle Pilot',
    budget: '₹5L – ₹35L',
    title: 'EMS & Job-Shop Pilot Batch',
    description: 'Run 25–1,000 pilot units via Indian contract EMS, CNC job-shops & shared NABL testbeds.',
    links: [
      { label: 'Component Sourcing', href: '/sourcing' },
      { label: 'PCBA & Assembly', href: '/assembly' },
      { label: 'NABL Testbeds', href: '/testbeds' },
    ],
  },
  {
    step: '03 · Full Plant & Compliance',
    budget: '₹2.4Cr – ₹150Cr+',
    title: 'Scale Sector Plant & Homologation',
    description: 'Unlock PLI / SPECS / MoFPI subsidies, cleanroom CapEx, and mandatory BIS / CDSCO / AIS / DGCA certs.',
    links: [
      { label: 'Sector Hubs', href: '/sectors' },
      { label: 'Compliance Matrix', href: '/compliance' },
    ],
  },
  {
    step: '04 · Global Export',
    budget: 'RoDTEP + PLI',
    title: 'Ship to Global Trade Corridors',
    description: 'Clear US FCC/FDA/UL, EU CE/IVDR, UAE CEPA & African tenders with RoDTEP duty remission.',
    links: [
      { label: 'Export Corridors', href: '/export' },
      { label: 'US', href: '/export/us' },
      { label: 'EU', href: '/export/eu' },
      { label: 'UAE-GCC', href: '/export/uae-gcc' },
      { label: 'ASEAN', href: '/export/asean' },
      { label: 'Africa', href: '/export/africa' },
    ],
  },
] as const;

export function HowToStartHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedSlug, setExpandedSlug] = useState<string | null>('medtech-diagnostics-plant');
  const [activeTab, setActiveTab] = useState<'blueprints' | 'calculator'>('blueprints');

  const categories = ['All', ...PLANT_CATEGORIES];

  const filteredBlueprints = PLANT_BLUEPRINTS.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      q === '' ||
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.rawMaterialsAndSupplyChain.indianIndustrialClusters.some((c) =>
        c.toLowerCase().includes(q)
      ) ||
      p.machineryList.some((m) => m.name.toLowerCase().includes(q)) ||
      (p.exportHsCodes?.some((hsn) => hsn.toLowerCase().includes(q)) ?? false) ||
      (p.pilotScaleOption?.indianBridgePartners.some((partner) =>
        partner.toLowerCase().includes(q)
      ) ?? false);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-surface-1 via-surface-1 to-accent-soft p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent" variant="solid" className="font-mono text-caption">
              Make In India Blueprints
            </Badge>
            <Badge tone="neutral" variant="outline" className="font-mono text-caption bg-surface-1">
              Missing Middle (₹5L–₹35L) · Full Plant · Export
            </Badge>
          </div>
          <h1 className="text-heading-lg sm:text-headline-md font-display font-bold text-fg tracking-tight">
            How to Start an Industrial Manufacturing Facility
          </h1>
          <p className="text-body-md text-fg-muted">
            End-to-end execution manuals for Indian builders &amp; exporters: start small via ₹5L–₹35L EMS pilot batches before scaling to full plants across semiconductors, MedTech IVD, solar inverters/BESS, technical textiles, agro cold-chain, composites, PCBs, CNC parts, EV packs, and drones.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-hairline">
          <div>
            <span className="text-[11px] font-mono text-fg-muted uppercase block">Detailed Blueprints</span>
            <span className="text-heading-sm font-mono font-bold text-fg">
              {PLANT_BLUEPRINTS.length} Industries
            </span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-fg-muted uppercase block">Missing Middle Pilot</span>
            <span className="text-heading-sm font-mono font-bold text-accent-fg">₹5L – ₹35L</span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-fg-muted uppercase block">Govt Subsidies Covered</span>
            <span className="text-heading-sm font-mono font-bold text-success-fg">Up to 50% CapEx</span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-fg-muted uppercase block">Export Corridors</span>
            <span className="text-heading-sm font-mono font-bold text-fg">US · EU · GCC · ASEAN · Africa</span>
          </div>
        </div>
      </div>

      {/* Start Smaller: Missing-Middle Ladder Banner */}
      <Card className="p-5 sm:p-6 bg-surface-1 border-accent/25 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-hairline">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-accent-fg">
              <Sparkles className="size-3.5" />
              <span>Eliminate the Zero-to-Factory Cliff</span>
            </div>
            <h2 className="text-body-md font-display font-bold text-fg">
              Start Smaller: Lab &rarr; EMS Pilot Batch (₹5L–₹35L) &rarr; Full Plant &rarr; Export
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/sectors"
              className="inline-flex items-center gap-1 rounded-lg border border-hairline bg-sunken px-3 py-1.5 text-caption font-mono font-semibold text-fg hover:border-accent/40 hover:text-accent-fg transition-colors"
            >
              <Layers className="size-3.5 text-accent-fg" />
              <span>Explore All Sectors</span>
            </Link>
            <Link
              href="/export"
              className="inline-flex items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-caption font-mono font-semibold text-on-solid hover:bg-accent-strong transition-colors"
            >
              <Globe className="size-3.5" />
              <span>Export Playbooks</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {START_SMALLER_LADDER.map((stage, idx) => (
            <div
              key={stage.step}
              className="relative p-4 rounded-xl bg-sunken border border-hairline flex flex-col justify-between gap-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                  <span className="font-bold text-accent-fg uppercase">{stage.step}</span>
                  <Badge tone={idx === 1 ? 'accent' : 'neutral'} variant="outline" className="text-[10px] font-mono bg-surface-1">
                    {stage.budget}
                  </Badge>
                </div>
                <h3 className="text-caption font-display font-bold text-fg">{stage.title}</h3>
                <p className="text-[11px] text-fg-muted leading-snug">{stage.description}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-hairline">
                {stage.links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center gap-1 rounded-md border border-hairline bg-surface-1 px-2 py-0.5 text-[11px] font-mono font-medium text-fg hover:border-accent/50 hover:text-accent-fg transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="size-2.5" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Main Mode Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-hairline pb-2 scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveTab('blueprints')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-body-sm font-display font-medium transition-colors ${
            activeTab === 'blueprints'
              ? 'bg-accent-soft border border-accent/40 text-accent-fg font-bold'
              : 'text-fg-muted hover:text-fg hover:bg-surface-1 border border-transparent'
          }`}
        >
          <Factory className="size-4" />
          <span>Industrial Blueprints ({PLANT_BLUEPRINTS.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-body-sm font-display font-medium transition-colors ${
            activeTab === 'calculator'
              ? 'bg-accent-soft border border-accent/40 text-accent-fg font-bold'
              : 'text-fg-muted hover:text-fg hover:bg-surface-1 border border-transparent'
          }`}
        >
          <TrendingUp className="size-4" />
          <span>Interactive Plant &amp; Pilot CapEx Calculator</span>
        </button>
      </div>

      {/* TAB 1: BLUEPRINTS */}
      {activeTab === 'blueprints' && (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-caption font-medium transition-colors border ${
                    selectedCategory === cat
                      ? 'border-accent bg-accent-soft text-accent-fg font-bold'
                      : 'border-hairline bg-surface-1 text-fg-muted hover:text-fg hover:border-line'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
              <input
                type="text"
                placeholder="Search MedTech, Surat, HSN, AMTZ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-1 border border-hairline text-caption text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Plant Blueprints List */}
          <div className="space-y-6">
            {filteredBlueprints.map((plant) => {
              const isExpanded = expandedSlug === plant.slug;

              return (
                <Card
                  key={plant.slug}
                  className="p-5 sm:p-6 bg-surface-1 border-hairline transition-all hover:border-line space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono text-accent-fg uppercase font-bold">
                          {plant.category}
                        </span>
                        <span className="text-fg-subtle">·</span>
                        {plant.pilotScaleOption && (
                          <Badge tone="accent" variant="solid" className="font-mono text-[10px]">
                            EMS Pilot: {plant.pilotScaleOption.budgetRangeInr}
                          </Badge>
                        )}
                        <Badge tone="neutral" variant="outline" className="font-mono text-[10px] bg-sunken">
                          Plant Pilot: {plant.capitalRequirements.pilotCapEx}
                        </Badge>
                        <Badge tone="neutral" variant="outline" className="font-mono text-[10px] bg-sunken">
                          Land: {plant.capitalRequirements.landSqFt}
                        </Badge>
                        {plant.capitalRequirements.cleanroomClass && (
                          <Badge tone="neutral" variant="outline" className="font-mono text-[10px] bg-sunken">
                            {plant.capitalRequirements.cleanroomClass}
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-heading-sm font-display font-bold text-fg">
                        {plant.title}
                      </h3>

                      <p className="text-body-sm font-medium text-accent-fg">
                        {plant.tagline}
                      </p>

                      <p className="text-body-sm text-fg-muted pt-1">
                        {plant.overview}
                      </p>

                      {/* Clusters in India */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono text-fg-muted">
                        <MapPin className="size-3.5 text-accent-fg shrink-0" />
                        <span className="font-bold text-fg">Key Industrial Hubs:</span>
                        <span>{plant.rawMaterialsAndSupplyChain.indianIndustrialClusters.join(' · ')}</span>
                      </div>

                      {/* Missing-Middle + Export Summary Strip */}
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        {plant.exportHsCodes?.[0] && (
                          <span className="inline-flex items-center rounded-md border border-hairline bg-sunken px-2 py-0.5 text-[10px] font-mono text-fg-muted">
                            HSN {plant.exportHsCodes[0]}
                          </span>
                        )}
                        {plant.exportCorridors?.map((corridor) => (
                          <Link
                            key={corridor.corridorSlug}
                            href={`/export/${corridor.corridorSlug}`}
                            className="inline-flex items-center gap-1 rounded-md border border-accent/25 bg-accent-soft px-2 py-0.5 text-[10px] font-mono font-semibold text-accent-fg hover:border-accent transition-colors"
                          >
                            <Globe className="size-2.5" />
                            <span>{corridor.marketLabel}</span>
                          </Link>
                        ))}
                        {plant.linkedComplianceSlug && (
                          <Link
                            href={`/compliance/${plant.linkedComplianceSlug}`}
                            className="inline-flex items-center gap-1 rounded-md border border-hairline bg-surface-1 px-2 py-0.5 text-[10px] font-mono font-semibold text-success-fg hover:border-accent/40 transition-colors"
                          >
                            <ShieldCheck className="size-2.5" />
                            <span>Compliance Guide</span>
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                      <Button
                        asChild
                        variant="primary"
                        size="sm"
                        className="gap-1.5 text-caption font-mono"
                      >
                        <Link href={`/how-to-start/${plant.slug}`}>
                          <span>Full Blueprint Page</span>
                          <ExternalLink className="size-3" />
                        </Link>
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-1.5 text-caption font-mono"
                        onClick={() =>
                          setExpandedSlug(isExpanded ? null : plant.slug)
                        }
                      >
                        <span>{isExpanded ? 'Collapse Blueprint' : 'Expand Machinery & Plan'}</span>
                        {isExpanded ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Blueprint Drawer */}
                  {isExpanded && (
                    <div className="pt-4 mt-2 border-t border-hairline space-y-6 animate-in fade-in duration-150">
                      {/* 0. Missing Middle Pilot Bridge */}
                      {plant.pilotScaleOption && (
                        <div className="p-4 rounded-xl bg-accent-soft border border-accent/25 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Sparkles className="size-4 text-accent-fg" />
                              <h4 className="text-caption font-mono uppercase font-bold text-fg">
                                Start Smaller: EMS / Job-Shop Pilot Bridge ({plant.pilotScaleOption.budgetRangeInr})
                              </h4>
                            </div>
                            <span className="text-[11px] font-mono font-semibold text-accent-fg">
                              {plant.pilotScaleOption.batchSize}
                            </span>
                          </div>
                          <p className="text-caption text-fg-muted">
                            {plant.pilotScaleOption.bridgeModel}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                            <div className="p-3 rounded-lg bg-surface-1 border border-hairline space-y-1">
                              <span className="font-mono font-bold uppercase text-fg block">
                                Indian Incubators &amp; Job-Shop Partners
                              </span>
                              <ul className="space-y-0.5 text-fg-muted list-disc list-inside">
                                {plant.pilotScaleOption.indianBridgePartners.map((partner) => (
                                  <li key={partner}>{partner}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="p-3 rounded-lg bg-surface-1 border border-hairline space-y-2 flex flex-col justify-between">
                              <div>
                                <span className="font-mono font-bold uppercase text-success-fg flex items-center gap-1">
                                  <CheckCircle2 className="size-3.5" />
                                  <span>Scale-Up Graduation Gate</span>
                                </span>
                                <p className="text-fg-muted mt-1">{plant.pilotScaleOption.graduationGate}</p>
                              </div>
                              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-hairline">
                                <Link href="/sourcing" className="text-[10px] font-mono font-semibold text-accent-fg hover:underline">
                                  Sourcing &rarr;
                                </Link>
                                {plant.linkedAssemblySlug && (
                                  <Link href={`/assembly/${plant.linkedAssemblySlug}`} className="text-[10px] font-mono font-semibold text-accent-fg hover:underline">
                                    PCBA Assembly &rarr;
                                  </Link>
                                )}
                                {plant.linkedTestbedSlug && (
                                  <Link href={`/testbeds/${plant.linkedTestbedSlug}`} className="text-[10px] font-mono font-semibold text-accent-fg hover:underline">
                                    NABL Testbed &rarr;
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 1. Core Machinery & Equipment Table */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-caption font-mono uppercase font-bold text-fg flex items-center gap-1.5">
                            <Wrench className="size-4 text-accent-fg" />
                            Critical Plant Machinery &amp; Tooling ({plant.machineryList.length} Capital Tools)
                          </h4>
                          <span className="text-[11px] font-mono text-fg-subtle">
                            Commercial CapEx: {plant.capitalRequirements.commercialCapEx}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {plant.machineryList.map((machine) => (
                            <div
                              key={machine.name}
                              className="p-3.5 rounded-lg bg-sunken border border-hairline space-y-1.5"
                            >
                              <div className="flex items-center justify-between gap-2 text-caption font-mono">
                                <span className="font-bold text-fg">{machine.name}</span>
                                <span className="text-accent-fg font-semibold shrink-0">{machine.estCostInr}</span>
                              </div>
                              <p className="text-[11px] text-fg-muted">
                                {machine.purpose}
                              </p>
                              <div className="text-[10px] font-mono text-fg-subtle pt-1 border-t border-hairline">
                                <span className="text-fg font-medium">OEM Suppliers:</span> {machine.recommendedBrands.join(', ')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 2. Step-by-Step Execution Roadmap */}
                      <div className="space-y-3">
                        <h4 className="text-caption font-mono uppercase font-bold text-fg flex items-center gap-1.5">
                          <Compass className="size-4 text-accent-fg" />
                          Step-by-Step 4-Phase Factory Execution Roadmap
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {plant.executionRoadmap.map((step) => (
                            <div
                              key={step.phase}
                              className="p-3.5 rounded-lg bg-sunken border border-hairline space-y-2 flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                                  <span className="text-accent-fg font-bold">{step.phase}</span>
                                  <span className="text-fg-subtle">{step.durationWeeks}</span>
                                </div>
                                <h5 className="text-caption font-bold text-fg mb-1.5">
                                  {step.title}
                                </h5>
                                <ul className="space-y-1 text-[11px] text-fg-muted list-disc list-inside">
                                  {step.tasks.map((t, idx) => (
                                    <li key={idx} className="leading-tight">
                                      {t}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="pt-2 border-t border-hairline text-[10px] font-mono text-success-fg">
                                <span className="text-fg-subtle block">Deliverable:</span>
                                {step.deliverable}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3. Target Export Markets, HSN Codes & Incentives */}
                      {plant.exportCorridors && plant.exportCorridors.length > 0 && (
                        <div className="space-y-3 pt-2 border-t border-hairline">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="text-caption font-mono uppercase font-bold text-fg flex items-center gap-1.5">
                              <Globe className="size-4 text-accent-fg" />
                              Target Export Markets, HSN Codes &amp; Incentives
                            </h4>
                            {plant.exportHsCodes && (
                              <span className="text-[11px] font-mono text-fg-muted">
                                HSN: {plant.exportHsCodes.join(' · ')}
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {plant.exportCorridors.map((corridor) => (
                              <Link
                                key={corridor.corridorSlug}
                                href={`/export/${corridor.corridorSlug}`}
                                className="p-3.5 rounded-xl bg-sunken border border-hairline hover:border-accent/40 transition-colors space-y-1.5 block"
                              >
                                <div className="flex items-center justify-between text-caption font-mono font-bold text-accent-fg">
                                  <span>{corridor.marketLabel}</span>
                                  <ArrowRight className="size-3.5" />
                                </div>
                                <p className="text-[11px] font-mono text-fg">
                                  Certs: {corridor.certifications.join(' · ')}
                                </p>
                                <p className="text-[11px] text-fg-muted">{corridor.incentiveNote}</p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 4. Government Subsidies & Unit Economics */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-hairline">
                        <div className="p-4 rounded-xl bg-sunken border border-hairline space-y-2">
                          <h5 className="text-caption font-mono uppercase font-bold text-fg flex items-center gap-1.5">
                            <ShieldCheck className="size-4 text-success-fg" />
                            Government Subsidies &amp; Capital Grants
                          </h5>
                          {plant.governmentSchemes.map((scheme) => (
                            <div key={scheme.schemeName} className="text-[11px] space-y-0.5">
                              <span className="font-bold text-fg block">{scheme.schemeName}</span>
                              <p className="text-fg-muted">{scheme.subsidyDetails}</p>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 rounded-xl bg-sunken border border-hairline space-y-2">
                          <h5 className="text-caption font-mono uppercase font-bold text-fg flex items-center gap-1.5">
                            <TrendingUp className="size-4 text-accent-fg" />
                            Unit Economics &amp; Breakeven Metrics
                          </h5>
                          <div className="grid grid-cols-2 gap-2 font-mono text-caption">
                            <div>
                              <span className="text-[10px] text-fg-muted block uppercase">Gross Margin</span>
                              <span className="font-bold text-success-fg">{plant.unitEconomics.typicalGrossMargin}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-fg-muted block uppercase">Net Profit Margin</span>
                              <span className="font-bold text-fg">{plant.unitEconomics.netMargin}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-fg-muted block uppercase">Payback Timeline</span>
                              <span className="font-bold text-accent-fg">{plant.unitEconomics.paybackPeriodYears}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-fg-muted block uppercase">Breakeven Volume</span>
                              <span className="font-bold text-fg">{plant.unitEconomics.breakEvenCapacityUtil}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <PlantBudgetEstimator />
        </div>
      )}
    </div>
  );
}
