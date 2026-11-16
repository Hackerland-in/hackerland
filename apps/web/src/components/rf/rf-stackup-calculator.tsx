'use client';

import { useState } from 'react';
import {
  type TransmissionLineType,
  type RfSubstrateMaterial,
  RF_SUBSTRATES_DATABASE,
  calculateRfTransmissionLine,
  synthesizeTraceWidth,
} from '@hackerland/core';

interface RfStackupCalculatorProps {
  initialLineType?: TransmissionLineType;
  initialSubstrate?: RfSubstrateMaterial;
  initialFreqGHz?: number;
  initialWidthMm?: number;
  initialHeightMm?: number;
  initialGapMm?: number;
}

export function RfStackupCalculator({
  initialLineType = 'microstrip',
  initialSubstrate = 'rogers_ro4350b',
  initialFreqGHz = 2.45,
  initialWidthMm = 1.13,
  initialHeightMm = 0.508,
  initialGapMm = 0.35,
}: RfStackupCalculatorProps) {
  const [lineType, setLineType] = useState<TransmissionLineType>(initialLineType);
  const [substrateKey, setSubstrateKey] = useState<RfSubstrateMaterial>(initialSubstrate);
  const [freqGHz, setFreqGHz] = useState<number>(initialFreqGHz);
  const [widthMm, setWidthMm] = useState<number>(initialWidthMm);
  const [heightMm, setHeightMm] = useState<number>(initialHeightMm);
  const [copperOz, setCopperOz] = useState<number>(1); // 1oz = 35um
  const [gapMm, setGapMm] = useState<number>(initialGapMm);
  const [diffSpacingMm, setDiffSpacingMm] = useState<number>(0.25);

  const currentSubstrate = RF_SUBSTRATES_DATABASE[substrateKey] ?? RF_SUBSTRATES_DATABASE.fr4_standard;
  const copperThicknessUm = copperOz * 35;

  const result = calculateRfTransmissionLine({
    lineType,
    frequencyGHz: freqGHz,
    traceWidthMm: widthMm,
    substrateHeightMm: heightMm,
    copperThicknessUm,
    dielectricConstantEr: currentSubstrate.dielectricConstantEr,
    lossTangent: currentSubstrate.lossTangent,
    groundGapMm: lineType === 'gcpw' ? gapMm : undefined,
    differentialSpacingMm: lineType === 'differential_microstrip' ? diffSpacingMm : undefined,
    copperRoughnessUm: currentSubstrate.copperRoughnessUm,
  });

  const handleSynthesizeTarget = (targetOhms: number) => {
    const solvedWidth = synthesizeTraceWidth(
      lineType,
      targetOhms,
      heightMm,
      currentSubstrate.dielectricConstantEr,
      copperThicknessUm,
      lineType === 'gcpw' ? gapMm : undefined
    );
    setWidthMm(solvedWidth);
  };

  const lossPer100Mm = Math.round(result.totalLossDbPerMm * 100 * 100) / 100;

  return (
    <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header and Topology Selection */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              Electromagnetic Waveguide Solver
            </span>
            <span className="text-xs text-stone-500 font-mono">Hammerstad &amp; Jensen Closed-Form</span>
          </div>
          <h2 className="text-xl font-bold text-stone-100 mt-1">
            Transmission Line Impedance &amp; High-Frequency Loss Synthesizer
          </h2>
          <p className="text-sm text-stone-400 mt-1">
            Synthesize controlled-impedance RF traces with conductor skin depth, copper foil surface roughness attenuation, and dielectric dissipation.
          </p>
        </div>

        {/* Synthesize Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSynthesizeTarget(lineType === 'differential_microstrip' ? 100 : 50)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold tracking-wide transition-colors shadow-lg shadow-emerald-950 flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Auto-Solve {lineType === 'differential_microstrip' ? '100Ω Differential' : '50Ω Single-Ended'}
          </button>
        </div>
      </div>

      {/* Line Type Tabs */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: 'microstrip', label: 'Microstrip' },
            { id: 'embedded_microstrip', label: 'Embedded Microstrip' },
            { id: 'gcpw', label: 'GCPW (Coplanar with Ground)' },
            { id: 'stripline', label: 'Stripline' },
            { id: 'differential_microstrip', label: 'Differential Pair' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setLineType(tab.id)}
            className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition-all ${
              lineType === tab.id
                ? 'bg-stone-800 text-stone-100 border border-stone-700 shadow-sm'
                : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Substrate Selector */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="rf-substrate-select" className="text-xs font-mono uppercase tracking-wider font-semibold text-stone-300">
                Dielectric Substrate
              </label>
              <span className="text-xs font-mono text-emerald-400">
                ε_r = {currentSubstrate.dielectricConstantEr} | tanδ = {currentSubstrate.lossTangent}
              </span>
            </div>
            <select
              id="rf-substrate-select"
              aria-label="Dielectric Substrate"
              value={substrateKey}
              onChange={(e) => {
                const newKey = e.target.value as RfSubstrateMaterial;
                setSubstrateKey(newKey);
                const sub = RF_SUBSTRATES_DATABASE[newKey];
                if (sub) {
                  setHeightMm(sub.standardThicknessMm);
                }
              }}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs font-mono text-stone-100 focus:outline-none focus:border-cyan-500"
            >
              {Object.values(RF_SUBSTRATES_DATABASE).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (ε_r={s.dielectricConstantEr})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              {currentSubstrate.description}
            </p>
          </div>

          {/* Trace Geometry Controls */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-stone-300">
              Geometry &amp; Environment
            </h3>

            {/* Trace Width */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-stone-400">Trace Width (W)</span>
                <span className="text-cyan-400 font-bold">{widthMm.toFixed(3)} mm</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.01"
                value={widthMm}
                onChange={(e) => setWidthMm(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-0.5">
                <span>0.10 mm (4 mil HDI)</span>
                <span>2.5 mm</span>
                <span>5.0 mm</span>
              </div>
            </div>

            {/* Substrate Height */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-stone-400">Dielectric Height (H)</span>
                <span className="text-stone-200 font-bold">{heightMm.toFixed(3)} mm</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="2.4"
                step="0.01"
                value={heightMm}
                onChange={(e) => setHeightMm(Number(e.target.value))}
                className="w-full accent-stone-400 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-0.5">
                <span>0.05 mm (Flex)</span>
                <span>0.508 mm (Rogers)</span>
                <span>1.6 mm (FR-4)</span>
              </div>
            </div>

            {/* Frequency */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-stone-400">Operating Frequency (f)</span>
                <span className="text-amber-400 font-bold">{freqGHz.toFixed(2)} GHz</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="30.0"
                step="0.1"
                value={freqGHz}
                onChange={(e) => setFreqGHz(Number(e.target.value))}
                className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-0.5">
                <span>865 MHz (LoRa)</span>
                <span>5.8 GHz (UAV)</span>
                <span>24 GHz (Radar)</span>
              </div>
            </div>

            {/* Line-Type Specific Gap / Spacing */}
            {lineType === 'gcpw' && (
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-stone-400">Ground Coplanar Gap (G)</span>
                  <span className="text-emerald-400 font-bold">{gapMm.toFixed(2)} mm</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.05"
                  value={gapMm}
                  onChange={(e) => setGapMm(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}

            {lineType === 'differential_microstrip' && (
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-stone-400">Diff Pair Spacing (S)</span>
                  <span className="text-purple-400 font-bold">{diffSpacingMm.toFixed(2)} mm</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.02"
                  value={diffSpacingMm}
                  onChange={(e) => setDiffSpacingMm(Number(e.target.value))}
                  className="w-full accent-purple-500 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}

            {/* Copper Weight */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-800">
              <span className="text-xs font-mono text-stone-400">Copper Weight</span>
              <div className="flex gap-2">
                {[0.5, 1, 2].map((oz) => (
                  <button
                    key={oz}
                    type="button"
                    onClick={() => setCopperOz(oz)}
                    className={`px-2.5 py-1 text-xs font-mono rounded ${
                      copperOz === oz
                        ? 'bg-amber-600 text-white font-bold'
                        : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {oz} oz ({oz * 35}µm)
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Output & Diagram Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Primary Results Display */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-3.5">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Characteristic Z₀</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className={`text-2xl font-bold ${
                  Math.abs(result.characteristicImpedanceZ0 - 50) <= 2
                    ? 'text-emerald-400'
                    : 'text-stone-100'
                }`}>
                  {result.characteristicImpedanceZ0}
                </span>
                <span className="text-xs text-stone-400">Ω</span>
              </div>
              <span className="text-[10px] text-stone-500 mt-1 block">
                {Math.abs(result.characteristicImpedanceZ0 - 50) <= 2 ? 'Matched (50Ω ±2Ω)' : 'Off-target'}
              </span>
            </div>

            {lineType === 'differential_microstrip' ? (
              <div className="bg-stone-900 border border-purple-900/50 rounded-xl p-3.5">
                <span className="text-[10px] text-purple-400 uppercase tracking-wider block">Diff Z_diff</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-purple-300">
                    {result.differentialImpedanceZdiff ?? '--'}
                  </span>
                  <span className="text-xs text-purple-400">Ω</span>
                </div>
                <span className="text-[10px] text-stone-500 mt-1 block">Target 100Ω PCIe/LVDS</span>
              </div>
            ) : (
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-3.5">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Effective ε_eff</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-cyan-400">{result.effectiveDielectricConstantEeff}</span>
                </div>
                <span className="text-[10px] text-stone-500 mt-1 block">Substrate Filling Factor</span>
              </div>
            )}

            <div className="bg-stone-900 border border-stone-800 rounded-xl p-3.5">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Propagation Delay</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-stone-100">{result.propagationDelayPsPerMm}</span>
                <span className="text-xs text-stone-400">ps/mm</span>
              </div>
              <span className="text-[10px] text-stone-500 mt-1 block">{result.phaseVelocityPercentC}% of c₀</span>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-xl p-3.5">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Loss @ 100mm</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-amber-400">{lossPer100Mm}</span>
                <span className="text-xs text-stone-400">dB</span>
              </div>
              <span className="text-[10px] text-stone-500 mt-1 block">Conductor + Dielectric</span>
            </div>
          </div>

          {/* Interactive Cross-Section SVG Diagram */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-stone-300">
                Waveguide Physical Cross-Section &amp; Field Distribution
              </span>
              <span className="text-xs font-mono text-cyan-400">
                Skin Depth: {result.skinDepthUm} µm
              </span>
            </div>

            <div className="w-full bg-stone-950 rounded-lg p-3 border border-stone-800 flex items-center justify-center">
              <svg viewBox="0 0 500 200" className="w-full max-w-[480px] select-none text-xs font-mono">
                {/* Background Air / Environment */}
                <rect x="0" y="0" width="500" height="200" fill="#090d10" />

                {/* Substrate Dielectric Body */}
                <rect x="50" y="80" width="400" height="70" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <text x="250" y="120" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">
                  Dielectric Substrate ({currentSubstrate.name.split(' ')[0]} - ε_r = {currentSubstrate.dielectricConstantEr})
                </text>

                {/* Ground Plane (Bottom) */}
                <rect x="50" y="150" width="400" height="12" fill="#d97706" />
                {/* Ground hatching marks */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <line
                    key={i}
                    x1={60 + i * 19}
                    y1={162}
                    x2={50 + i * 19}
                    y2={172}
                    stroke="#b45309"
                    strokeWidth="1.5"
                  />
                ))}
                <text x="250" y="184" textAnchor="middle" fill="#d97706" fontSize="10" fontWeight="bold">
                  Solid Reference Ground Plane (L2)
                </text>

                {/* Top Ground Floods for GCPW */}
                {lineType === 'gcpw' && (
                  <>
                    {/* Left ground flood */}
                    <rect x="50" y="68" width="130" height="12" fill="#d97706" />
                    <text x="110" y="60" textAnchor="middle" fill="#d97706" fontSize="9">Top Ground</text>
                    {/* Stitching via */}
                    <circle cx="90" cy="115" r="5" fill="#f59e0b" stroke="#000" strokeWidth="1" />
                    <line x1="90" y1="80" x2="90" y2="150" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />

                    {/* Right ground flood */}
                    <rect x="320" y="68" width="130" height="12" fill="#d97706" />
                    <text x="390" y="60" textAnchor="middle" fill="#d97706" fontSize="9">Top Ground</text>
                    {/* Stitching via */}
                    <circle cx="410" cy="115" r="5" fill="#f59e0b" stroke="#000" strokeWidth="1" />
                    <line x1="410" y1="80" x2="410" y2="150" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />

                    {/* Coplanar Gap Annotations */}
                    <line x1="180" y1="64" x2="210" y2="64" stroke="#10b981" strokeWidth="1" />
                    <text x="195" y="58" textAnchor="middle" fill="#10b981" fontSize="9">G={gapMm}mm</text>
                  </>
                )}

                {/* Top Stripline Ground if stripline */}
                {lineType === 'stripline' && (
                  <>
                    <rect x="50" y="20" width="400" height="12" fill="#d97706" />
                    <text x="250" y="15" textAnchor="middle" fill="#d97706" fontSize="10" fontWeight="bold">
                      Upper Reference Ground Plane (L1)
                    </text>
                  </>
                )}

                {/* RF Signal Copper Trace */}
                {lineType === 'differential_microstrip' ? (
                  <>
                    {/* Differential Pair Trace 1 */}
                    <rect x="210" y="68" width="35" height="12" rx="1" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
                    <text x="227" y="60" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">D+</text>
                    {/* Differential Pair Trace 2 */}
                    <rect x="255" y="68" width="35" height="12" rx="1" fill="#a855f7" stroke="#7e22ce" strokeWidth="1" />
                    <text x="272" y="60" textAnchor="middle" fill="#a855f7" fontSize="9" fontWeight="bold">D-</text>
                    {/* Spacing S */}
                    <line x1="245" y1="64" x2="255" y2="64" stroke="#e2e8f0" strokeWidth="1" />
                  </>
                ) : (
                  <>
                    {/* Single ended trace */}
                    <rect x="215" y="68" width="70" height="12" rx="1" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
                    <text x="250" y="60" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
                      RF Trace (W={widthMm.toFixed(2)}mm)
                    </text>
                  </>
                )}

                {/* Electric field lines (curving from trace to ground plane) */}
                <path d="M 230,80 Q 220,115 220,150" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
                <path d="M 250,80 L 250,150" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
                <path d="M 270,80 Q 280,115 280,150" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

                {/* Dimension Arrows */}
                {/* Height H */}
                <line x1="35" y1="80" x2="35" y2="150" stroke="#94a3b8" strokeWidth="1.5" />
                <polygon points="35,80 32,86 38,86" fill="#94a3b8" />
                <polygon points="35,150 32,144 38,144" fill="#94a3b8" />
                <text x="25" y="118" textAnchor="middle" fill="#94a3b8" fontSize="10">H={heightMm}mm</text>
              </svg>
            </div>
          </div>

          {/* Loss Breakdown Table */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 font-mono text-xs">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold block mb-2">
              High-Frequency Attenuation Breakdown @ {freqGHz} GHz
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-800">
                <span className="text-stone-500 text-[10px] block">Conductor Loss (α_c)</span>
                <span className="text-stone-200 font-bold">{result.conductorLossDbPerMm} dB/mm</span>
                <span className="text-[10px] text-stone-500 block mt-0.5">Foil Roughness Rq={currentSubstrate.copperRoughnessUm}µm</span>
              </div>
              <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-800">
                <span className="text-stone-500 text-[10px] block">Dielectric Loss (α_d)</span>
                <span className="text-stone-200 font-bold">{result.dielectricLossDbPerMm} dB/mm</span>
                <span className="text-[10px] text-stone-500 block mt-0.5">tanδ={currentSubstrate.lossTangent}</span>
              </div>
              <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-800">
                <span className="text-stone-500 text-[10px] block">Electrical Length</span>
                <span className="text-stone-200 font-bold">{result.electricalLengthMmPerDegree} mm/°</span>
                <span className="text-[10px] text-stone-500 block mt-0.5">λ/4 = {(result.electricalLengthMmPerDegree * 90).toFixed(2)} mm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
