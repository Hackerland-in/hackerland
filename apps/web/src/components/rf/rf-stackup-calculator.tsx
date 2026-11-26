'use client';

import { useEffect, useState } from 'react';
import {
  type TransmissionLineType,
  type RfSubstrateMaterial,
  RF_SUBSTRATES_DATABASE,
  calculateRfTransmissionLine,
  synthesizeTraceWidth,
} from '@hackerland/core';
import { Button } from '@hackerland/ui';
import { useLabShell } from '@/components/labs/full-screen-lab-shell';

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
  const labShell = useLabShell();
  const [lineType, setLineType] = useState<TransmissionLineType>(initialLineType);
  const [substrateKey, setSubstrateKey] = useState<RfSubstrateMaterial>(initialSubstrate);
  const [freqGHz, setFreqGHz] = useState<number>(initialFreqGHz);
  const [widthMm, setWidthMm] = useState<number>(initialWidthMm);
  const [heightMm, setHeightMm] = useState<number>(initialHeightMm);
  const [copperOz, setCopperOz] = useState<number>(1);
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

  useEffect(() => {
    labShell?.registerSnapshotHandlers({
      getSnapshot: () => ({
        title: `RF ${lineType.toUpperCase()} (${result.characteristicImpedanceZ0}Ω @ ${freqGHz}GHz)`,
        summary: `${currentSubstrate.name} · W=${widthMm}mm, H=${heightMm}mm`,
        tags: ['rf', lineType, substrateKey],
        payload: { lineType, substrateKey, freqGHz, widthMm, heightMm, copperOz, gapMm, diffSpacingMm },
      }),
      onLoad: (ws) => {
        const p = ws.payload;
        if (typeof p.lineType === 'string') setLineType(p.lineType as TransmissionLineType);
        if (typeof p.substrateKey === 'string') setSubstrateKey(p.substrateKey as RfSubstrateMaterial);
        if (typeof p.freqGHz === 'number') setFreqGHz(p.freqGHz);
        if (typeof p.widthMm === 'number') setWidthMm(p.widthMm);
        if (typeof p.heightMm === 'number') setHeightMm(p.heightMm);
        if (typeof p.copperOz === 'number') setCopperOz(p.copperOz);
        if (typeof p.gapMm === 'number') setGapMm(p.gapMm);
        if (typeof p.diffSpacingMm === 'number') setDiffSpacingMm(p.diffSpacingMm);
      },
    });
  }, [labShell, lineType, substrateKey, freqGHz, widthMm, heightMm, copperOz, gapMm, diffSpacingMm, currentSubstrate.name, result.characteristicImpedanceZ0]);

  const handleSynthesizeTarget = (targetOhms: number) => {
    const solvedWidth = synthesizeTraceWidth(
      lineType,
      targetOhms,
      heightMm,
      currentSubstrate.dielectricConstantEr,
      copperThicknessUm,
      lineType === 'gcpw' ? gapMm : undefined,
    );
    setWidthMm(solvedWidth);
  };

  const lossPer100Mm = Math.round(result.totalLossDbPerMm * 100 * 100) / 100;

  return (
    <div className="bg-surface-1 border border-hairline rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-hairline gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent-fg border border-accent/25 font-mono">
              Electromagnetic Waveguide Solver
            </span>
            <span className="text-xs text-fg-subtle font-mono">Hammerstad &amp; Jensen Closed-Form</span>
          </div>
          <h2 className="font-display text-xl font-bold text-fg mt-1">
            Transmission Line Impedance &amp; High-Frequency Loss Synthesizer
          </h2>
          <p className="text-sm text-fg-muted mt-1">
            Synthesize controlled-impedance RF traces with conductor skin depth, copper foil surface roughness attenuation, and dielectric dissipation.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          variant="primary"
          onClick={() => handleSynthesizeTarget(lineType === 'differential_microstrip' ? 100 : 50)}
        >
          Auto-Solve {lineType === 'differential_microstrip' ? '100Ω Differential' : '50Ω Single-Ended'}
        </Button>
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
            className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-full transition-all border ${
              lineType === tab.id
                ? 'bg-accent text-on-solid border-accent font-semibold shadow-xs'
                : 'bg-sunken text-fg-muted hover:text-fg border-hairline'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-sunken/70 border border-hairline rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="rf-substrate-select" className="text-xs font-mono uppercase tracking-wider font-bold text-fg">
                Dielectric Substrate
              </label>
              <span className="text-xs font-mono font-semibold text-success-fg">
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
                if (sub) setHeightMm(sub.standardThicknessMm);
              }}
              className="w-full bg-surface-1 border border-line rounded-xl px-3 py-2 text-xs font-mono text-fg focus:outline-none focus:border-accent"
            >
              {Object.values(RF_SUBSTRATES_DATABASE).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (ε_r={s.dielectricConstantEr})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-fg-muted leading-relaxed">
              {currentSubstrate.description}
            </p>
          </div>

          <div className="bg-sunken/70 border border-hairline rounded-2xl p-4 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-fg">
              Geometry &amp; Environment
            </h3>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-fg-muted">Trace Width (W)</span>
                <span className="text-info-fg font-bold">{widthMm.toFixed(3)} mm</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.01"
                value={widthMm}
                onChange={(e) => setWidthMm(Number(e.target.value))}
                className="w-full accent-accent bg-surface-2 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-fg-subtle font-mono mt-0.5">
                <span>0.10 mm (4 mil HDI)</span>
                <span>2.5 mm</span>
                <span>5.0 mm</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-fg-muted">Dielectric Height (H)</span>
                <span className="text-fg font-bold">{heightMm.toFixed(3)} mm</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="2.4"
                step="0.01"
                value={heightMm}
                onChange={(e) => setHeightMm(Number(e.target.value))}
                className="w-full accent-accent bg-surface-2 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-fg-subtle font-mono mt-0.5">
                <span>0.05 mm (Flex)</span>
                <span>0.508 mm (Rogers)</span>
                <span>1.6 mm (FR-4)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-fg-muted">Operating Frequency (f)</span>
                <span className="text-accent-fg font-bold">{freqGHz.toFixed(2)} GHz</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="30.0"
                step="0.1"
                value={freqGHz}
                onChange={(e) => setFreqGHz(Number(e.target.value))}
                className="w-full accent-accent bg-surface-2 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-fg-subtle font-mono mt-0.5">
                <span>865 MHz (LoRa)</span>
                <span>5.8 GHz (UAV)</span>
                <span>24 GHz (Radar)</span>
              </div>
            </div>

            {lineType === 'gcpw' && (
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-fg-muted">Ground Coplanar Gap (G)</span>
                  <span className="text-success-fg font-bold">{gapMm.toFixed(2)} mm</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.05"
                  value={gapMm}
                  onChange={(e) => setGapMm(Number(e.target.value))}
                  className="w-full accent-accent bg-surface-2 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}

            {lineType === 'differential_microstrip' && (
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-fg-muted">Diff Pair Spacing (S)</span>
                  <span className="text-accent-fg font-bold">{diffSpacingMm.toFixed(2)} mm</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.02"
                  value={diffSpacingMm}
                  onChange={(e) => setDiffSpacingMm(Number(e.target.value))}
                  className="w-full accent-accent bg-surface-2 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-hairline">
              <span className="text-xs font-mono text-fg-muted">Copper Weight</span>
              <div className="flex gap-1.5">
                {[0.5, 1, 2].map((oz) => (
                  <button
                    key={oz}
                    type="button"
                    onClick={() => setCopperOz(oz)}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg border ${
                      copperOz === oz
                        ? 'bg-accent text-on-solid border-accent font-bold'
                        : 'bg-surface-1 border-hairline text-fg-muted hover:text-fg'
                    }`}
                  >
                    {oz} oz ({oz * 35}µm)
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="bg-sunken/70 border border-hairline rounded-xl p-3.5">
              <span className="text-[10px] text-fg-muted uppercase tracking-wider block">Characteristic Z₀</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span
                  className={`text-2xl font-bold ${
                    Math.abs(result.characteristicImpedanceZ0 - 50) <= 2 ? 'text-success-fg' : 'text-fg'
                  }`}
                >
                  {result.characteristicImpedanceZ0}
                </span>
                <span className="text-xs text-fg-subtle">Ω</span>
              </div>
              <span className="text-[10px] text-fg-subtle mt-1 block">
                {Math.abs(result.characteristicImpedanceZ0 - 50) <= 2 ? 'Matched (50Ω ±2Ω)' : 'Off-target'}
              </span>
            </div>

            {lineType === 'differential_microstrip' ? (
              <div className="bg-accent-soft/60 border border-accent/25 rounded-xl p-3.5">
                <span className="text-[10px] text-accent-fg uppercase tracking-wider block">Diff Z_diff</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-accent-fg">
                    {result.differentialImpedanceZdiff ?? '--'}
                  </span>
                  <span className="text-xs text-accent-fg">Ω</span>
                </div>
                <span className="text-[10px] text-fg-subtle mt-1 block">Target 100Ω PCIe/LVDS</span>
              </div>
            ) : (
              <div className="bg-sunken/70 border border-hairline rounded-xl p-3.5">
                <span className="text-[10px] text-fg-muted uppercase tracking-wider block">Effective ε_eff</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-info-fg">{result.effectiveDielectricConstantEeff}</span>
                </div>
                <span className="text-[10px] text-fg-subtle mt-1 block">Substrate Filling Factor</span>
              </div>
            )}

            <div className="bg-sunken/70 border border-hairline rounded-xl p-3.5">
              <span className="text-[10px] text-fg-muted uppercase tracking-wider block">Propagation Delay</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-fg">{result.propagationDelayPsPerMm}</span>
                <span className="text-xs text-fg-subtle">ps/mm</span>
              </div>
              <span className="text-[10px] text-fg-subtle mt-1 block">{result.phaseVelocityPercentC}% of c₀</span>
            </div>

            <div className="bg-sunken/70 border border-hairline rounded-xl p-3.5">
              <span className="text-[10px] text-fg-muted uppercase tracking-wider block">Loss @ 100mm</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-accent-fg">{lossPer100Mm}</span>
                <span className="text-xs text-fg-subtle">dB</span>
              </div>
              <span className="text-[10px] text-fg-subtle mt-1 block">Conductor + Dielectric</span>
            </div>
          </div>

          {/* Waveguide Cross-Section */}
          <div className="bg-surface-1 border border-hairline rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-fg">
                Waveguide Physical Cross-Section &amp; Field Distribution
              </span>
              <span className="text-xs font-mono font-semibold text-accent-fg">
                Skin Depth: {result.skinDepthUm} µm
              </span>
            </div>

            <div className="w-full bg-sunken rounded-xl p-3 border border-hairline flex items-center justify-center">
              <svg viewBox="0 0 500 200" className="w-full max-w-[480px] select-none text-xs font-mono">
                <rect x="0" y="0" width="500" height="200" fill="#fcf9fb" />
                <rect x="50" y="80" width="400" height="70" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.2" />
                <text x="250" y="120" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="bold">
                  Dielectric Substrate ({currentSubstrate.name.split(' ')[0]} - ε_r = {currentSubstrate.dielectricConstantEr})
                </text>

                <rect x="50" y="150" width="400" height="12" fill="#d97706" />
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
                <text x="250" y="184" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="bold">
                  Solid Reference Ground Plane (L2)
                </text>

                {lineType === 'gcpw' && (
                  <>
                    <rect x="50" y="68" width="130" height="12" fill="#d97706" />
                    <text x="110" y="60" textAnchor="middle" fill="#b45309" fontSize="9" fontWeight="bold">Top Ground</text>
                    <circle cx="90" cy="115" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
                    <line x1="90" y1="80" x2="90" y2="150" stroke="#d97706" strokeWidth="1.5" strokeDasharray="2 2" />
                    <rect x="320" y="68" width="130" height="12" fill="#d97706" />
                    <text x="390" y="60" textAnchor="middle" fill="#b45309" fontSize="9" fontWeight="bold">Top Ground</text>
                    <circle cx="410" cy="115" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
                    <line x1="410" y1="80" x2="410" y2="150" stroke="#d97706" strokeWidth="1.5" strokeDasharray="2 2" />
                    <line x1="180" y1="64" x2="210" y2="64" stroke="#059669" strokeWidth="1.2" />
                    <text x="195" y="58" textAnchor="middle" fill="#059669" fontSize="9" fontWeight="bold">G={gapMm}mm</text>
                  </>
                )}

                {lineType === 'stripline' && (
                  <>
                    <rect x="50" y="20" width="400" height="12" fill="#d97706" />
                    <text x="250" y="15" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="bold">
                      Upper Reference Ground Plane (L1)
                    </text>
                  </>
                )}

                {lineType === 'differential_microstrip' ? (
                  <>
                    <rect x="210" y="68" width="35" height="12" rx="1" fill="#e11d74" stroke="#9d174d" strokeWidth="1" />
                    <text x="227" y="60" textAnchor="middle" fill="#be185d" fontSize="9" fontWeight="bold">D+</text>
                    <rect x="255" y="68" width="35" height="12" rx="1" fill="#2563eb" stroke="#1e40af" strokeWidth="1" />
                    <text x="272" y="60" textAnchor="middle" fill="#1d4ed8" fontSize="9" fontWeight="bold">D-</text>
                    <line x1="245" y1="64" x2="255" y2="64" stroke="#64748b" strokeWidth="1" />
                  </>
                ) : (
                  <>
                    <rect x="215" y="68" width="70" height="12" rx="1" fill="#e11d74" stroke="#9d174d" strokeWidth="1" />
                    <text x="250" y="60" textAnchor="middle" fill="#be185d" fontSize="10" fontWeight="bold">
                      RF Trace (W={widthMm.toFixed(2)}mm)
                    </text>
                  </>
                )}

                <path d="M 230,80 Q 220,115 220,150" fill="none" stroke="#e11d74" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
                <path d="M 250,80 L 250,150" fill="none" stroke="#e11d74" strokeWidth="1" strokeDasharray="3 3" opacity="0.85" />
                <path d="M 270,80 Q 280,115 280,150" fill="none" stroke="#e11d74" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />

                <line x1="35" y1="80" x2="35" y2="150" stroke="#64748b" strokeWidth="1.5" />
                <polygon points="35,80 32,86 38,86" fill="#64748b" />
                <polygon points="35,150 32,144 38,144" fill="#64748b" />
                <text x="25" y="118" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="bold">H={heightMm}mm</text>
              </svg>
            </div>
          </div>

          <div className="bg-sunken/70 border border-hairline rounded-2xl p-4 font-mono text-xs">
            <span className="text-[10px] text-fg-muted uppercase tracking-wider font-semibold block mb-2">
              High-Frequency Attenuation Breakdown @ {freqGHz} GHz
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-surface-1 p-3 rounded-xl border border-hairline">
                <span className="text-fg-subtle text-[10px] block">Conductor Loss (α_c)</span>
                <span className="text-fg font-bold">{result.conductorLossDbPerMm} dB/mm</span>
                <span className="text-[10px] text-fg-subtle block mt-0.5">Roughness Rq={currentSubstrate.copperRoughnessUm}µm</span>
              </div>
              <div className="bg-surface-1 p-3 rounded-xl border border-hairline">
                <span className="text-fg-subtle text-[10px] block">Dielectric Loss (α_d)</span>
                <span className="text-fg font-bold">{result.dielectricLossDbPerMm} dB/mm</span>
                <span className="text-[10px] text-fg-subtle block mt-0.5">tanδ={currentSubstrate.lossTangent}</span>
              </div>
              <div className="bg-surface-1 p-3 rounded-xl border border-hairline">
                <span className="text-fg-subtle text-[10px] block">Electrical Length</span>
                <span className="text-fg font-bold">{result.electricalLengthMmPerDegree} mm/°</span>
                <span className="text-[10px] text-fg-subtle block mt-0.5">λ/4 = {(result.electricalLengthMmPerDegree * 90).toFixed(2)} mm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
