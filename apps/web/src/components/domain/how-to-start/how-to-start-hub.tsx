'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, Badge, Button } from '@hackerland/ui';
import {
  Factory,
  Cpu,
  Layers,
  Wrench,
  Bike,
  Smartphone,
  BatteryCharging,
  Compass,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MapPin,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { PLANT_BLUEPRINTS, type PlantBlueprint } from './how-to-start-data';
import { PlantBudgetEstimator } from './plant-budget-estimator';

export function HowToStartHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedSlug, setExpandedSlug] = useState<string | null>('cycle-manufacturing');
  const [activeTab, setActiveTab] = useState<'blueprints' | 'calculator'>('blueprints');

  const categories = [
    'All',
    'Semiconductors',
    'Composites',
    'Electronics',
    'Mobility & Vehicles',
    'Precision Engineering',
    'Clean Energy',
  ];

  const filteredBlueprints = PLANT_BLUEPRINTS.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.rawMaterialsAndSupplyChain.indianIndustrialClusters.some((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      p.machineryList.some((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-hairline bg-gradient-to-br from-surface-1 via-surface-1 to-surface-2 p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent" variant="solid" className="font-mono text-caption">
              Make In India Blueprints
            </Badge>
            <Badge tone="neutral" variant="outline" className="font-mono text-caption">
              CapEx · Cleanroom · Machinery · Subsidies
            </Badge>
          </div>
          <h1 className="text-heading-lg sm:text-headline-md font-display font-bold text-fg tracking-tight">
            How to Start an Industrial Manufacturing Facility
          </h1>
          <p className="text-body-md text-fg-muted">
            End-to-end execution manuals for technical founders: semiconductor fabs, carbon fiber composite hubs, multilayer PCB design plants, bicycle assembly lines, precision CNC turned parts, and mobile components.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-hairline/80">
          <div>
            <span className="text-[11px] font-mono text-fg-muted uppercase block">Detailed Blueprints</span>
            <span className="text-heading-sm font-mono font-bold text-fg">8 Industries</span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-fg-muted uppercase block">Govt Subsidies Covered</span>
            <span className="text-heading-sm font-mono font-bold text-emerald-400">Up to 50% CapEx</span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-fg-muted uppercase block">Cleanroom Classes</span>
            <span className="text-heading-sm font-mono font-bold text-accent">ISO 1 to ISO 8</span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-fg-muted uppercase block">Machinery Brands</span>
            <span className="text-heading-sm font-mono font-bold text-fg">Global & Domestic</span>
          </div>
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-hairline pb-2 scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveTab('blueprints')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-body-sm font-display font-medium transition-colors ${
            activeTab === 'blueprints'
              ? 'bg-accent/10 border border-accent text-accent font-bold'
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
              ? 'bg-accent/10 border border-accent text-accent font-bold'
              : 'text-fg-muted hover:text-fg hover:bg-surface-1 border border-transparent'
          }`}
        >
          <TrendingUp className="size-4" />
          <span>Interactive Plant CapEx Calculator</span>
        </button>
      </div>

      {/* TAB 1: BLUEPRINTS */}
      {activeTab === 'blueprints' && (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-caption font-medium transition-colors border ${
                    selectedCategory === cat
                      ? 'border-accent bg-accent/10 text-accent font-bold'
                      : 'border-hairline bg-surface-1 text-fg-muted hover:text-fg'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
              <input
                type="text"
                placeholder="Search plants, machines, Ludhiana, Fab..."
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
                  className="p-5 sm:p-6 bg-surface-1 border-hairline transition-all hover:border-hairline-strong space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono text-accent uppercase font-bold">
                          {plant.category}
                        </span>
                        <span className="text-fg-subtle">·</span>
                        <Badge tone="accent" variant="solid" className="font-mono text-[10px]">
                          Pilot: {plant.capitalRequirements.pilotCapEx}
                        </Badge>
                        <Badge tone="neutral" variant="outline" className="font-mono text-[10px]">
                          Land: {plant.capitalRequirements.landSqFt}
                        </Badge>
                        {plant.capitalRequirements.cleanroomClass && (
                          <Badge tone="neutral" variant="outline" className="font-mono text-[10px]">
                            {plant.capitalRequirements.cleanroomClass}
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-heading-sm font-display font-bold text-fg">
                        {plant.title}
                      </h3>

                      <p className="text-body-sm font-medium text-accent/90">
                        {plant.tagline}
                      </p>

                      <p className="text-body-sm text-fg-muted pt-1">
                        {plant.overview}
                      </p>

                      {/* Clusters in India */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono text-fg-muted">
                        <MapPin className="size-3.5 text-accent shrink-0" />
                        <span className="font-bold text-fg">Key Industrial Hubs:</span>
                        <span>{plant.rawMaterialsAndSupplyChain.indianIndustrialClusters.join(' · ')}</span>
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
                      {/* 1. Core Machinery & Equipment Table */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-caption font-mono uppercase font-bold text-fg flex items-center gap-1.5">
                            <Wrench className="size-4 text-accent" />
                            Critical Plant Machinery & Tooling ({plant.machineryList.length} Capital Tools)
                          </h4>
                          <span className="text-[11px] font-mono text-fg-subtle">
                            Commercial CapEx: {plant.capitalRequirements.commercialCapEx}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {plant.machineryList.map((machine) => (
                            <div
                              key={machine.name}
                              className="p-3.5 rounded-lg bg-surface-2 border border-hairline space-y-1.5"
                            >
                              <div className="flex items-center justify-between text-caption font-mono">
                                <span className="font-bold text-fg">{machine.name}</span>
                                <span className="text-accent font-semibold">{machine.estCostInr}</span>
                              </div>
                              <p className="text-[11px] text-fg-muted">
                                {machine.purpose}
                              </p>
                              <div className="text-[10px] font-mono text-fg-subtle pt-1 border-t border-hairline/60">
                                <span className="text-fg font-medium">OEM Suppliers:</span> {machine.recommendedBrands.join(', ')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 2. Step-by-Step Execution Roadmap */}
                      <div className="space-y-3">
                        <h4 className="text-caption font-mono uppercase font-bold text-fg flex items-center gap-1.5">
                          <Compass className="size-4 text-accent" />
                          Step-by-Step 4-Phase Factory Execution Roadmap
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {plant.executionRoadmap.map((step) => (
                            <div
                              key={step.phase}
                              className="p-3.5 rounded-lg bg-surface-2 border border-hairline space-y-2 flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                                  <span className="text-accent font-bold">{step.phase}</span>
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
                              <div className="pt-2 border-t border-hairline/60 text-[10px] font-mono text-emerald-400">
                                <span className="text-fg-subtle block">Deliverable:</span>
                                {step.deliverable}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3. Government Subsidies & Compliance */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-hairline/60">
                        <div className="p-4 rounded-xl bg-surface-2 border border-hairline space-y-2">
                          <h5 className="text-caption font-mono uppercase font-bold text-fg flex items-center gap-1.5">
                            <ShieldCheck className="size-4 text-emerald-400" />
                            Government Subsidies & Capital Grants
                          </h5>
                          {plant.governmentSchemes.map((scheme) => (
                            <div key={scheme.schemeName} className="text-[11px] space-y-0.5">
                              <span className="font-bold text-fg block">{scheme.schemeName}</span>
                              <p className="text-fg-muted">{scheme.subsidyDetails}</p>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 rounded-xl bg-surface-2 border border-hairline space-y-2">
                          <h5 className="text-caption font-mono uppercase font-bold text-fg flex items-center gap-1.5">
                            <TrendingUp className="size-4 text-accent" />
                            Unit Economics & Breakeven Metrics
                          </h5>
                          <div className="grid grid-cols-2 gap-2 font-mono text-caption">
                            <div>
                              <span className="text-[10px] text-fg-muted block uppercase">Gross Margin</span>
                              <span className="font-bold text-emerald-400">{plant.unitEconomics.typicalGrossMargin}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-fg-muted block uppercase">Net Profit Margin</span>
                              <span className="font-bold text-fg">{plant.unitEconomics.netMargin}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-fg-muted block uppercase">Payback Timeline</span>
                              <span className="font-bold text-accent">{plant.unitEconomics.paybackPeriodYears}</span>
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
