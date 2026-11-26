'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge, Card, cn } from '@hackerland/ui';
import type { CanBusProject, CanProtocolStandard, TerminationTopology } from '@hackerland/core';
import { filterCanBusProjects } from '@hackerland/core';
import { CanBusWorkbench } from './can-bus-workbench';

interface CanCatalogProps {
  initialProjects: CanBusProject[];
}

export function CanCatalog({ initialProjects }: CanCatalogProps) {
  const [search, setSearch] = useState('');
  const [selectedStandard, setSelectedStandard] = useState<string>('all');
  const [selectedTermination, setSelectedTermination] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'presets' | 'workbench'>('presets');

  const filteredProjects = filterCanBusProjects(initialProjects, {
    standard: selectedStandard !== 'all' ? (selectedStandard as CanProtocolStandard) : undefined,
    termination:
      selectedTermination !== 'all' ? (selectedTermination as TerminationTopology) : undefined,
    search: search.trim() !== '' ? search.trim() : undefined,
  });

  return (
    <div className="space-y-6 min-w-0">
      <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent" variant="outline">
            ISO 11898-1/2 Bit Timing &amp; CAN-FD Synthesis
          </Badge>
          <span className="text-body-xs text-fg-subtle font-mono">
            ARAI AIS-004 &amp; AIS-156 Automotive Benchmarks
          </span>
        </div>
        <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
          Automotive CAN Bus &amp; ISO 11898 Network Protocol Simulator
        </h1>
        <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
          Simulate CAN 2.0B and CAN-FD bit timing segments (Sync_Seg, Prop_Seg, Phase_Seg1, Phase_Seg2), propagation delay, arbitration, and split termination waveforms.
        </p>
      </header>

      <div className="flex border-b border-hairline gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={cn(
            'pb-2.5 px-3 font-semibold border-b-2 transition-colors',
            activeTab === 'presets'
              ? 'border-accent text-accent-fg'
              : 'border-transparent text-fg-muted hover:text-fg',
          )}
        >
          Curated Indian Automotive Networks ({initialProjects.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('workbench')}
          className={cn(
            'pb-2.5 px-3 font-semibold border-b-2 transition-colors',
            activeTab === 'workbench'
              ? 'border-accent text-accent-fg'
              : 'border-transparent text-fg-muted hover:text-fg',
          )}
        >
          Live Universal CAN Workbench
        </button>
      </div>

      {activeTab === 'presets' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by vehicle, domain, cable, Ather, Nexon, or test lab..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface-1 border border-line rounded-xl px-4 py-2 text-body-xs font-mono text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-2 text-fg-subtle hover:text-fg text-xs font-mono"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                aria-label="Filter by Protocol Standard"
                value={selectedStandard}
                onChange={(e) => setSelectedStandard(e.target.value)}
                className="bg-surface-1 border border-line rounded-xl px-3 py-2 text-body-xs font-mono text-fg focus:outline-none focus:border-accent"
              >
                <option value="all">All CAN Standards</option>
                <option value="can_2_0b_standard">CAN 2.0B Standard (11-bit)</option>
                <option value="can_2_0b_extended">CAN 2.0B Extended (29-bit)</option>
                <option value="can_fd_iso">ISO CAN-FD</option>
              </select>

              <select
                aria-label="Filter by Termination"
                value={selectedTermination}
                onChange={(e) => setSelectedTermination(e.target.value)}
                className="bg-surface-1 border border-line rounded-xl px-3 py-2 text-body-xs font-mono text-fg focus:outline-none focus:border-accent"
              >
                <option value="all">All Terminations</option>
                <option value="split_termination_filtered">Split Filtered (2x 60Ω)</option>
                <option value="standard_120_ohm">Standard 120Ω</option>
                <option value="single_end_high_z_unterminated">Unterminated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((project) => (
              <Link key={project.id} href={`/can-bus/${project.slug}`} className="group block min-w-0">
                <Card className="h-full bg-surface-1 border-hairline rounded-2xl p-5 hover:border-accent/50 transition-all flex flex-col justify-between [overflow-wrap:anywhere]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone="accent" variant="outline">
                        {project.nominalBaudRateKbps} kbps
                      </Badge>
                      <span className="text-[10px] font-mono text-fg-subtle uppercase">
                        {project.protocolStandard.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h3 className="font-display text-body-lg font-bold text-fg group-hover:text-accent-fg transition-colors line-clamp-2">
                      {project.title}
                    </h3>

                    <p className="text-body-xs text-fg-muted line-clamp-2 leading-relaxed">
                      {project.automotiveDomain}
                    </p>

                    <div className="bg-sunken rounded-xl p-3 border border-hairline font-mono text-[11px] space-y-1">
                      <div className="flex justify-between text-fg-muted">
                        <span>Bus Length / Nodes:</span>
                        <span className="text-fg">
                          {project.busTopology.busLengthMeters}m / {project.busTopology.nodeCount} ECUs
                        </span>
                      </div>
                      <div className="flex justify-between text-fg-muted">
                        <span>Termination:</span>
                        <span className="text-success-fg">
                          {project.busTopology.terminationMethod.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between text-fg-muted">
                        <span>Isolation:</span>
                        <span className="text-accent-fg">
                          {project.busTopology.isolationType.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-hairline mt-4 flex items-center justify-between text-body-xs font-mono">
                    <span className="text-fg-subtle truncate max-w-[180px]">
                      {project.indianContextFacility.split('-')[0]?.trim()}
                    </span>
                    <span className="text-accent-fg font-semibold group-hover:translate-x-0.5 transition-transform">
                      Inspect Architecture →
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <Card className="text-center py-12 bg-surface-1 border-hairline text-fg-subtle font-mono text-body-xs">
              No matching CAN bus networks found for query &quot;{search}&quot;.
            </Card>
          )}
        </div>
      )}

      {activeTab === 'workbench' && (
        <div className="space-y-4">
          <div className="bg-sunken border border-hairline rounded-xl p-4 text-body-xs text-fg-muted leading-relaxed font-mono">
            Defaulted to 500 kbps standard CAN 2.0B (40 MHz clock, 15m harness, 8 nodes). Adjust sliders to simulate bit timing allocations and arbitration margins.
          </div>
          <CanBusWorkbench />
        </div>
      )}
    </div>
  );
}
