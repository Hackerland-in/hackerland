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
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
            Microwave &amp; High-Speed Signal Integrity
          </span>
          <span className="text-xs text-stone-500 font-mono">
            Hammerstad &amp; Jensen Conformal RF Engine
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
          RF Impedance &amp; Transmission Line Synthesizer
        </h1>
        <p className="text-base text-stone-400 max-w-3xl leading-relaxed">
          Synthesize 50Ω single-ended, coplanar waveguide (GCPW), and 100Ω differential transmission lines across high-performance laminates (Rogers RO4350B, RT/duroid, Isola 370HR, Polyimide Flex) with skin depth, conductor roughness attenuation, and Smith Chart conjugate matching.
        </p>
      </div>

      {/* Navigation Mode Tabs */}
      <div className="flex border-b border-stone-800 gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'presets'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          Curated Indian RF Stacks ({presets.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('custom_solver')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'custom_solver'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          Live Waveguide Synthesizer
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('smith_matcher')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'smith_matcher'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          Smith Chart &amp; Matching Network
        </button>
      </div>

      {activeTab === 'presets' && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search presets by standard, facility (SAMEER, ISRO, ARAI) or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs font-mono text-stone-200 placeholder-stone-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                aria-label="Filter by line type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-300 focus:outline-none focus:border-cyan-500"
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
                className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Substrates</option>
                <option value="rogers_ro4350b">Rogers RO4350B</option>
                <option value="rogers_rt5880">Rogers RT5880</option>
                <option value="fr4_isola_370hr">Isola 370HR High-Tg</option>
                <option value="fr4_standard">FR-4 Standard</option>
              </select>
            </div>
          </div>

          {/* Preset Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPresets.map((preset) => (
              <Link
                key={preset.id}
                href={`/rf-calc/${preset.slug}`}
                className="group bg-stone-900/70 hover:bg-stone-900 border border-stone-800 hover:border-cyan-800/80 rounded-2xl p-5 transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                      {preset.frequencyGHz} GHz
                    </span>
                    <span className="text-[11px] font-mono text-amber-400 font-bold">
                      {preset.targetImpedance}Ω Target
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-100 group-hover:text-cyan-300 transition-colors">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {preset.application}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-800/80 space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between text-stone-400">
                    <span>Topology:</span>
                    <span className="text-stone-200 capitalize">{preset.lineType.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Width (W):</span>
                    <span className="text-emerald-400 font-bold">{preset.recommendedWidthMm} mm</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Loss @ 100mm:</span>
                    <span className="text-amber-400 font-bold">{preset.calculatedLossDbPer100Mm} dB</span>
                  </div>
                  <div className="text-[10px] text-stone-500 truncate pt-1 border-t border-stone-800/50">
                    📍 {preset.indianContextFacility}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPresets.length === 0 && (
            <div className="text-center py-12 bg-stone-900/40 rounded-2xl border border-stone-800 font-mono text-stone-400 text-xs">
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
