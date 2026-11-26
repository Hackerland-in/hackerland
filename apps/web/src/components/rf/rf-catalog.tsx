'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { RfTransmissionLinePreset } from '@hackerland/core';
import { RfStackupCalculator } from './rf-stackup-calculator';
import { RfMatchingSynthesizer } from './rf-matching-synthesizer';

interface RfCatalogProps {
  presets: RfTransmissionLinePreset[];
}

export function RfCatalog({ presets }: RfCatalogProps) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSubstrate, setSelectedSubstrate] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'presets' | 'custom_solver' | 'smith_matcher'>('presets');

  const filteredPresets = presets.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.application.toLowerCase().includes(search.toLowerCase()) ||
      p.indianContextFacility.toLowerCase().includes(search.toLowerCase());

    const matchesType = selectedType === 'all' || p.lineType === selectedType;
    const matchesSubstrate = selectedSubstrate === 'all' || p.substrate === selectedSubstrate;

    return matchesSearch && matchesType && matchesSubstrate;
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent-fg border border-accent/25 font-mono">
            Microwave &amp; High-Speed Signal Integrity
          </span>
          <span className="text-xs text-fg-subtle font-mono">
            Hammerstad &amp; Jensen Conformal RF Engine
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
          RF Impedance &amp; Transmission Line Synthesizer
        </h1>
        <p className="text-sm sm:text-base text-fg-muted max-w-3xl leading-relaxed">
          Synthesize 50Ω single-ended, coplanar waveguide (GCPW), and 100Ω differential transmission lines across Rogers RO4350B, RT/duroid, Isola 370HR, and FR-4 with skin depth, copper roughness attenuation, and Smith Chart conjugate matching.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex flex-wrap border-b border-hairline gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`pb-3 px-3.5 font-semibold border-b-2 transition-colors ${
            activeTab === 'presets'
              ? 'border-accent text-accent-fg'
              : 'border-transparent text-fg-muted hover:text-fg'
          }`}
        >
          Curated Indian RF Stacks ({presets.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('custom_solver')}
          className={`pb-3 px-3.5 font-semibold border-b-2 transition-colors ${
            activeTab === 'custom_solver'
              ? 'border-accent text-accent-fg'
              : 'border-transparent text-fg-muted hover:text-fg'
          }`}
        >
          Live Waveguide Synthesizer
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('smith_matcher')}
          className={`pb-3 px-3.5 font-semibold border-b-2 transition-colors ${
            activeTab === 'smith_matcher'
              ? 'border-accent text-accent-fg'
              : 'border-transparent text-fg-muted hover:text-fg'
          }`}
        >
          Smith Chart &amp; Matching Network
        </button>
      </div>

      {activeTab === 'presets' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search presets by standard, facility (SAMEER, ISRO, ARAI) or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface-1 border border-line rounded-xl px-4 py-2.5 text-xs font-mono text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                aria-label="Filter by line type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-surface-1 border border-line rounded-xl px-3 py-2 text-xs font-mono text-fg focus:outline-none focus:border-accent"
              >
                <option value="all">All Topologies</option>
                <option value="microstrip">Microstrip</option>
                <option value="gcpw">GCPW (Coplanar)</option>
                <option value="differential_microstrip">Differential Pair</option>
              </select>

              <select
                aria-label="Filter by substrate material"
                value={selectedSubstrate}
                onChange={(e) => setSelectedSubstrate(e.target.value)}
                className="bg-surface-1 border border-line rounded-xl px-3 py-2 text-xs font-mono text-fg focus:outline-none focus:border-accent"
              >
                <option value="all">All Substrates</option>
                <option value="rogers_ro4350b">Rogers RO4350B</option>
                <option value="rogers_rt5880">Rogers RT5880</option>
                <option value="fr4_isola_370hr">Isola 370HR High-Tg</option>
                <option value="fr4_standard">FR-4 Standard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPresets.map((preset) => (
              <Link
                key={preset.id}
                href={`/rf-calc/${preset.slug}`}
                className="group bg-surface-1 hover:bg-surface-2/60 border border-hairline hover:border-accent/45 rounded-2xl p-5 transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent/10 text-accent-fg border border-accent/25 font-mono">
                      {preset.frequencyGHz} GHz
                    </span>
                    <span className="text-[11px] font-mono text-info-fg font-bold">
                      {preset.targetImpedance}Ω Target
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-fg group-hover:text-accent-fg transition-colors">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-fg-muted mt-1.5 line-clamp-2 leading-relaxed">
                    {preset.application}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-hairline space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between text-fg-muted">
                    <span>Topology:</span>
                    <span className="text-fg font-semibold capitalize">{preset.lineType.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between text-fg-muted">
                    <span>Width (W):</span>
                    <span className="text-success-fg font-bold">{preset.recommendedWidthMm} mm</span>
                  </div>
                  <div className="flex justify-between text-fg-muted">
                    <span>Loss @ 100mm:</span>
                    <span className="text-accent-fg font-bold">{preset.calculatedLossDbPer100Mm} dB</span>
                  </div>
                  <div className="text-[10px] text-fg-subtle truncate pt-1 border-t border-hairline">
                    📍 {preset.indianContextFacility}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPresets.length === 0 && (
            <div className="text-center py-12 bg-surface-1 rounded-2xl border border-hairline font-mono text-fg-muted text-xs">
              No matching RF presets found for current filter criteria.
            </div>
          )}
        </div>
      )}

      {activeTab === 'custom_solver' && (
        <div className="space-y-4">
          <RfStackupCalculator />
        </div>
      )}

      {activeTab === 'smith_matcher' && (
        <div className="space-y-4">
          <RfMatchingSynthesizer />
        </div>
      )}
    </div>
  );
}
