'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    termination: selectedTermination !== 'all' ? (selectedTermination as TerminationTopology) : undefined,
    search: search.trim() !== '' ? search.trim() : undefined,
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
            ISO 11898-1/2 Bit Timing &amp; CAN-FD Synthesis
          </span>
          <span className="text-xs text-slate-500 font-mono">
            ARAI AIS-004 &amp; AIS-156 Automotive Benchmarks
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Automotive CAN Bus &amp; ISO 11898 Network Protocol Simulator
        </h1>
        <p className="text-base text-slate-400 max-w-3xl leading-relaxed">
          Simulate Controller Area Network (CAN 2.0B &amp; CAN-FD) bit timing segments ($Sync\_Seg, Prop\_Seg, Phase\_Seg1, Phase\_Seg2$), sample point location, and round-trip cable propagation delay. Model non-destructive bitwise arbitration priority, bus load bandwidth saturation, split termination common-mode RF filtering, and differential physical layer oscilloscope traces across Indian EV two-wheelers, passenger cars, commercial 3-wheelers, and drones.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'presets'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Curated Indian Automotive Networks ({initialProjects.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('workbench')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'workbench'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Live Universal CAN Workbench
        </button>
      </div>

      {activeTab === 'presets' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by vehicle, domain, cable, Ather, Nexon, or test lab..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 text-xs font-mono"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <select
                aria-label="Filter by Protocol Standard"
                value={selectedStandard}
                onChange={(e) => setSelectedStandard(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-400 transition"
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
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-400 transition"
              >
                <option value="all">All Terminations</option>
                <option value="split_termination_filtered">Split Filtered (2x 60Ω)</option>
                <option value="standard_120_ohm">Standard 120Ω</option>
                <option value="single_end_high_z_unterminated">Unterminated</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/can-bus/${project.slug}`}
                className="group bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-amber-500/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {project.nominalBaudRateKbps} kbps
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {project.protocolStandard.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-2">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project.automotiveDomain}
                  </p>

                  <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/80 font-mono text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Bus Length / Nodes:</span>
                      <span>{project.busTopology.busLengthMeters}m / {project.busTopology.nodeCount} ECUs</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Termination:</span>
                      <span className="text-emerald-400">{project.busTopology.terminationMethod.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Isolation:</span>
                      <span className="text-sky-400">{project.busTopology.isolationType.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/60 mt-4 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 truncate max-w-[190px]">
                    {project.indianContextFacility.split('-')[0]?.trim()}
                  </span>
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform">
                    Inspect Architecture →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 font-mono text-xs">
              No matching CAN bus networks found for query &quot;{search}&quot;. Try resetting filters.
            </div>
          )}
        </div>
      )}

      {activeTab === 'workbench' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 leading-relaxed font-mono">
            Defaulted to 500 kbps standard CAN 2.0B (40 MHz clock, 15m harness, 8 nodes). Adjust sliders in real time to simulate bit timing quantum allocations and bus arbitration margins.
          </div>
          <CanBusWorkbench />
        </div>
      )}
    </div>
  );
}
