'use client';

import Link from 'next/link';
import type { RfTransmissionLinePreset } from '@hackerland/core';
import { RfStackupCalculator } from './rf-stackup-calculator';
import { RfMatchingSynthesizer } from './rf-matching-synthesizer';

interface RfPresetDetailProps {
  preset: RfTransmissionLinePreset;
}

export function RfPresetDetail({ preset }: RfPresetDetailProps) {
  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
          <Link href="/rf-calc" className="hover:text-cyan-400 transition-colors">
            ← RF Synthesizer Catalog
          </Link>
          <span>/</span>
          <span className="text-stone-300 font-semibold">{preset.slug}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                {preset.frequencyGHz} GHz
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-800 text-stone-300 font-mono uppercase">
                {preset.lineType.replace(/_/g, ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                {preset.targetImpedance}Ω Target
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 tracking-tight">
              {preset.title}
            </h1>
            <p className="text-sm text-stone-400 mt-1 max-w-3xl">
              {preset.application}
            </p>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl p-3 text-right font-mono">
            <span className="text-[10px] text-stone-500 uppercase block">Calculated Insertion Loss</span>
            <span className="text-lg font-bold text-amber-400">{preset.calculatedLossDbPer100Mm} dB</span>
            <span className="text-[10px] text-stone-500 block">per 100mm trace</span>
          </div>
        </div>
      </div>

      {/* Indian Context & Verification Facility Alert */}
      <div className="bg-stone-900/80 border border-cyan-900/40 rounded-xl p-4 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block">
            NABL / Indian Defense &amp; Telecom Verification Facility
          </span>
          <p className="text-sm text-stone-300 font-mono mt-0.5">
            {preset.indianContextFacility}
          </p>
          <p className="text-xs text-stone-400 mt-1 leading-relaxed">
            {preset.schematicNotes}
          </p>
        </div>
      </div>

      {/* Layer Stackup Definition */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-300">
            Fabrication Stackup Definition
          </span>
          <span className="text-xs text-stone-400">
            Recommended W: <strong className="text-emerald-400">{preset.recommendedWidthMm} mm</strong>
            {preset.recommendedGapMm && <> | Gap G: <strong className="text-cyan-400">{preset.recommendedGapMm} mm</strong></>}
            {preset.recommendedSpacingMm && <> | Diff S: <strong className="text-purple-400">{preset.recommendedSpacingMm} mm</strong></>}
          </span>
        </div>
        <p className="text-xs text-stone-300 bg-stone-950 p-3 rounded-lg border border-stone-800/80">
          {preset.layerStackup}
        </p>

        {/* DRC Rules List */}
        <div className="pt-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 block mb-2">
            RF Design Rules &amp; DRC Constraints (KiCad / Altium)
          </span>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-stone-300">
            {preset.designRules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-stone-950/60 p-2.5 rounded-lg border border-stone-800/60">
                <span className="text-emerald-400 font-bold">✓</span>
                <span className="leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Live Pre-Loaded Transmission Line Waveguide Solver */}
      <div>
        <h2 className="text-lg font-bold text-stone-100 font-mono mb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          Interactive Waveguide Solver (Pre-Loaded for {preset.title})
        </h2>
        <RfStackupCalculator
          initialLineType={preset.lineType}
          initialSubstrate={preset.substrate}
          initialFreqGHz={preset.frequencyGHz}
          initialWidthMm={preset.recommendedWidthMm}
          initialGapMm={preset.recommendedGapMm ?? 0.35}
        />
      </div>

      {/* Live Conjugate Matching Synthesizer */}
      <div>
        <h2 className="text-lg font-bold text-stone-100 font-mono mb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          Smith Chart &amp; Conjugate Matching Synthesizer
        </h2>
        <RfMatchingSynthesizer />
      </div>
    </div>
  );
}
