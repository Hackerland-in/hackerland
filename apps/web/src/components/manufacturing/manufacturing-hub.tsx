'use client';

import { useState } from 'react';
import { Badge } from '@hackerland/ui';
import {
  Cpu,
  Wrench,
  Navigation,
  Car,
  Bike,
  Flame,
  Smartphone,
  Sparkles,
  ExternalLink,
  Search,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { MANUFACTURING_PILLARS } from './manufacturing-data';
import { ManufacturingSimulator } from './simulators/manufacturing-simulators';
import {
  InjectionMoldingSimulator,
  SheetMetalBendSimulator,
  BatteryWeldingSimulator,
  BLDCMotorSimulator,
  ThermalHeatsinkSimulator,
  CleanroomSimulator,
} from './simulators/advanced-industrial-simulators';
import { InteractiveLab } from './interactive-lab';
import { ManufacturingLifecyclePipeline } from './lifecycle-pipeline';
import { HardwareBenchStudio } from './bench/hardware-bench-studio';

export function ManufacturingHub() {
  const [selectedPillarId, setSelectedPillarId] = useState<string>('pcb');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeIndustrialSim, setActiveIndustrialSim] = useState<
    'injection' | 'sheet_metal' | 'battery_weld' | 'bldc_winding' | 'thermal' | 'cleanroom'
  >('injection');

  const pillars = MANUFACTURING_PILLARS;
  const selectedPillar = pillars.find((p) => p.id === selectedPillarId) ?? pillars[0];

  const filteredPillars = searchQuery.trim()
    ? pillars.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.hotTopics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
          p.popularSearches.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : pillars;

  const renderIcon = (name: string, className = 'size-5') => {
    switch (name) {
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Wrench':
        return <Wrench className={className} />;
      case 'Navigation':
        return <Navigation className={className} />;
      case 'Car':
        return <Car className={className} />;
      case 'Bike':
        return <Bike className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Smartphone':
        return <Smartphone className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      default:
        return <Cpu className={className} />;
    }
  };

  return (
    <div className="space-y-10 min-w-0" data-testid="manufacturing-hub">
      {/* 8 Pillar Quick Navigator Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display text-body-sm font-semibold uppercase tracking-wider text-fg-subtle">
              Select Manufacturing Domain
            </span>
            <Badge tone="accent" variant="solid" className="text-caption">
              8 Pillars Active
            </Badge>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="size-4 text-fg-subtle absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search topics, CAD, BMS, 5G..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-hairline bg-surface-1 pl-9 pr-3 py-1.5 text-body-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {filteredPillars.map((p) => {
            const isSelected = p.id === selectedPillarId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPillarId(p.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all min-h-[96px] ${
                  isSelected
                    ? 'border-accent bg-accent/15 text-accent shadow-sm ring-1 ring-accent'
                    : 'border-hairline bg-surface-1 text-fg-muted hover:text-fg hover:bg-surface-2 hover:border-hairline-strong'
                }`}
                data-testid={`pillar-btn-${p.id}`}
              >
                <div className={`p-2 rounded-full mb-1.5 ${isSelected ? 'bg-accent/20 text-accent' : 'bg-surface-2 text-fg-subtle'}`}>
                  {renderIcon(p.iconName, 'size-4')}
                </div>
                <span className="font-display text-caption font-semibold line-clamp-1">
                  {p.title.split('(')[0]?.trim()}
                </span>
                <span className="text-[10px] text-fg-subtle mt-0.5">{p.estTimeToPrototype}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Pillar Detailed View */}
      {selectedPillar && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Header Banner */}
          <div className="rounded-xl border border-hairline bg-surface-1 p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-accent/20 text-accent border border-accent/30">
                  {renderIcon(selectedPillar.iconName, 'size-6')}
                </div>
                <div>
                  <h2 className="font-display text-headline-md font-bold text-fg">
                    {selectedPillar.title}
                  </h2>
                  <p className="text-body-sm text-fg-muted mt-0.5">{selectedPillar.subtitle}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="code" variant="solid">
                  {selectedPillar.difficulty}
                </Badge>
                <Badge tone="make" variant="outline">
                  Prototype: {selectedPillar.estTimeToPrototype}
                </Badge>
              </div>
            </div>

            <p className="text-body-md text-fg max-w-3xl leading-relaxed">
              {selectedPillar.tagline}
            </p>

            {/* Quick Specs Badges */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-hairline/60">
              <span className="text-caption font-semibold text-fg-subtle uppercase tracking-wider mr-2 self-center">
                Governing Standards:
              </span>
              {selectedPillar.certifications.map((cert) => (
                <Badge key={cert} tone="neutral" variant="outline" className="text-caption font-mono">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>

          {/* CYBER-PHYSICAL HARDWARE BENCH STUDIO (Modeled on ESP-Labs Companion Architecture) */}
          <div className="space-y-3">
            <HardwareBenchStudio initialTrackId={selectedPillar.id} />
          </div>

          {/* SIMULATOR ENGINE (Requirement: Simulation engine for each field) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-display text-caption font-semibold uppercase tracking-wider text-accent">
                  Interactive Simulation Engine
                </span>
                <h3 className="font-display text-headline-sm font-semibold text-fg">
                  Real-time Physics, Sizing & Feasibility Calculator
                </h3>
              </div>
            </div>
            <ManufacturingSimulator pillarId={selectedPillar.id} />
          </div>

          {/* INTERACTIVE LAB CHALLENGE (Requirement: Interactive labs for each) */}
          <div className="space-y-3">
            <InteractiveLab pillar={selectedPillar} />
          </div>

          {/* 4-Stage Learning-to-Building Roadmap */}
          <div className="rounded-lg border border-hairline bg-surface-1 p-6 space-y-4">
            <div>
              <span className="font-display text-caption font-semibold uppercase tracking-wider text-fg-subtle">
                Curriculum & Milestones
              </span>
              <h3 className="font-display text-headline-sm font-semibold text-fg">
                Learning to Building: 4-Stage Execution Roadmap
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {selectedPillar.learningRoadmap.map((stage, idx) => (
                <div key={idx} className="rounded-lg border border-hairline bg-surface-2 p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <span className="font-mono text-caption text-accent font-semibold block">
                      Milestone 0{idx + 1}
                    </span>
                    <h4 className="font-display text-body-sm font-semibold text-fg">{stage.stage}</h4>
                    <p className="text-body-xs text-fg-muted">{stage.description}</p>
                  </div>
                  <div className="border-t border-hairline/60 pt-2 text-[11px] text-fg-subtle">
                    <span className="font-semibold text-fg">Deliverable: </span>
                    <span>{stage.keyDeliverable}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research & Future Tech Knowledge (Requirement 9: Hot topics & popular searches) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hot Topics & Future Frontiers */}
            <div className="rounded-lg border border-hairline bg-surface-1 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-accent" />
                <h4 className="font-display text-body-md font-semibold text-fg">
                  Hot Topics & Future Frontiers
                </h4>
              </div>
              <ul className="space-y-2">
                {selectedPillar.hotTopics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2 text-body-sm text-fg-muted">
                    <span className="text-accent font-bold mt-0.5">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Searches & Engineering Queries */}
            <div className="rounded-lg border border-hairline bg-surface-1 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Search className="size-4 text-fg-subtle" />
                <h4 className="font-display text-body-md font-semibold text-fg">
                  What Makers & Engineers Frequently Search For
                </h4>
              </div>
              <ul className="space-y-2">
                {selectedPillar.popularSearches.map((query, i) => (
                  <li key={i} className="flex items-center justify-between rounded border border-hairline bg-surface-2 px-3 py-2 text-body-xs text-fg">
                    <span className="truncate mr-2 font-mono">{query}</span>
                    <ChevronRight className="size-3.5 text-fg-subtle shrink-0" />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Indian Domestic Suppliers & Fabrication Hubs */}
          <div className="rounded-lg border border-hairline bg-surface-1 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-display text-body-md font-semibold text-fg">
                Verified Domestic Indian Sourcing & Fabrication Partners
              </h4>
              <Badge tone="neutral" variant="outline">
                Domestic Ecosystem
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {selectedPillar.indianSuppliers.map((sup) => (
                <a
                  key={sup.name}
                  href={sup.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-hairline bg-surface-2 p-3 hover:border-accent transition-colors group flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1 text-body-sm font-semibold text-fg group-hover:text-accent">
                      <span>{sup.name}</span>
                      <ExternalLink className="size-3 text-fg-subtle group-hover:text-accent" />
                    </div>
                    <p className="text-caption text-fg-muted">{sup.specialty}</p>
                  </div>
                  <span className="text-[10px] text-accent font-medium mt-2 block">
                    View Catalog →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Additional Specialized Workshop & Factory Simulation Engines */}
      <div className="space-y-4 rounded-xl border border-hairline bg-surface-1 p-6" data-testid="advanced-industrial-sim-suite">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Wrench className="size-4 text-accent" />
              <span className="font-display text-caption font-semibold uppercase tracking-wider text-accent">
                Advanced Factory & Workshop Tooling Engines
              </span>
            </div>
            <h3 className="font-display text-headline-sm font-semibold text-fg">
              Specialized Industrial Tooling Calculators
            </h3>
            <p className="text-body-sm text-fg-muted mt-0.5">
              Precision calculators for injection molds, sheet metal bending, battery spot welding, motor windings, and cleanroom HVAC.
            </p>
          </div>
          <Badge tone="make" variant="solid" className="shrink-0 self-start sm:self-auto">
            6 Specialized Simulators
          </Badge>
        </div>

        {/* Simulator Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {[
            { id: 'injection', label: 'Injection Molding Clamp & Cycle' },
            { id: 'sheet_metal', label: 'Sheet Metal Bend K-Factor' },
            { id: 'battery_weld', label: 'Battery Spot Weld & Nickel Strip' },
            { id: 'bldc_winding', label: 'BLDC Stator Motor Winding' },
            { id: 'thermal', label: 'Power Heatsink & Dissipation' },
            { id: 'cleanroom', label: 'Cleanroom Particle & HVAC' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setActiveIndustrialSim(
                  tab.id as 'injection' | 'sheet_metal' | 'battery_weld' | 'bldc_winding' | 'thermal' | 'cleanroom'
                )
              }
              className={`px-3.5 py-1.5 rounded-lg text-body-xs font-medium whitespace-nowrap transition-all border ${
                activeIndustrialSim === tab.id
                  ? 'border-accent bg-accent/15 text-accent font-semibold shadow-sm'
                  : 'border-hairline bg-surface-2 text-fg-muted hover:text-fg hover:border-hairline-strong'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Render Selected Industrial Simulator */}
        <div className="pt-2">
          {activeIndustrialSim === 'injection' && <InjectionMoldingSimulator />}
          {activeIndustrialSim === 'sheet_metal' && <SheetMetalBendSimulator />}
          {activeIndustrialSim === 'battery_weld' && <BatteryWeldingSimulator />}
          {activeIndustrialSim === 'bldc_winding' && <BLDCMotorSimulator />}
          {activeIndustrialSim === 'thermal' && <ThermalHeatsinkSimulator />}
          {activeIndustrialSim === 'cleanroom' && <CleanroomSimulator />}
        </div>
      </div>

      {/* Global 7-Stage Lifecycle Pipeline */}
      <ManufacturingLifecyclePipeline />
    </div>
  );
}
