'use client';

import { useState } from 'react';
import { calculateLSectionMatch } from '@hackerland/core';
import { SmithChartVisualizer } from './smith-chart-visualizer';

interface QuickLoadPreset {
  name: string;
  freqMHz: number;
  rl: number;
  xl: number;
  desc: string;
}

const QUICK_LOAD_PRESETS: QuickLoadPreset[] = [
  {
    name: 'IN865 Dipole Detuned',
    freqMHz: 865,
    rl: 28,
    xl: -18,
    desc: 'LoRa 865 MHz antenna detuned by plastic enclosure proximity',
  },
  {
    name: 'ESP32-S3 RF Pin Complex PA',
    freqMHz: 2450,
    rl: 20,
    xl: 14,
    desc: 'ESP32-S3 internal PA output impedance requiring 50Ω conjugate match',
  },
  {
    name: 'NavIC L5 Patch Antenna',
    freqMHz: 1176,
    rl: 72,
    xl: 30,
    desc: 'Active ceramic patch antenna input before LNA filter stage',
  },
  {
    name: '5.8 GHz UAV Patch',
    freqMHz: 5800,
    rl: 35,
    xl: -25,
    desc: 'Drone cloverleaf circular polarization antenna feed',
  },
];

export function RfMatchingSynthesizer() {
  const [freqMHz, setFreqMHz] = useState<number>(865);
  const [z0, setZ0] = useState<number>(50);
  const [rl, setRl] = useState<number>(25);
  const [xl, setXl] = useState<number>(-15);
  const [preferLowPass, setPreferLowPass] = useState<boolean>(true);

  const solution = calculateLSectionMatch(freqMHz, z0, rl, xl, preferLowPass);

  const loadPreset = (preset: QuickLoadPreset) => {
    setFreqMHz(preset.freqMHz);
    setRl(preset.rl);
    setXl(preset.xl);
  };

  return (
    <div className="bg-surface-1 border border-hairline rounded-2xl p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 border-b border-hairline gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent-fg border border-accent/25 font-mono">
              RF Synthesizer
            </span>
            <span className="text-xs text-fg-subtle font-mono">2-Element L-Network Matching</span>
          </div>
          <h2 className="font-display text-xl font-bold text-fg mt-1">
            Smith Chart &amp; Complex Impedance Conjugate Matcher
          </h2>
          <p className="text-sm text-fg-muted mt-1">
            Synthesize low-pass and high-pass matching networks to conjugate match complex antenna loads ($R_L + jX_L$) to standard 50Ω systems.
          </p>
        </div>

        <div className="flex items-center bg-sunken border border-hairline p-1 rounded-full">
          <button
            type="button"
            onClick={() => setPreferLowPass(true)}
            className={`px-3 py-1.5 text-xs font-mono font-medium rounded-full transition-colors ${
              preferLowPass
                ? 'bg-accent text-on-solid shadow-xs'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            Low-Pass (Harmonic Suppress)
          </button>
          <button
            type="button"
            onClick={() => setPreferLowPass(false)}
            className={`px-3 py-1.5 text-xs font-mono font-medium rounded-full transition-colors ${
              !preferLowPass
                ? 'bg-accent text-on-solid shadow-xs'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            High-Pass (DC Block)
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <span className="text-xs font-mono font-semibold text-fg-muted">Quick Loads:</span>
        {QUICK_LOAD_PRESETS.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => loadPreset(p)}
            className="text-xs font-mono bg-sunken hover:bg-accent-soft text-fg border border-hairline hover:border-accent/40 px-2.5 py-1 rounded-full transition-colors"
            title={p.desc}
          >
            {p.name} ({p.rl}{p.xl >= 0 ? `+j${p.xl}` : `-j${Math.abs(p.xl)}`}Ω @ {p.freqMHz}MHz)
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-sunken/70 border border-hairline rounded-2xl p-4 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-fg">
              Impedance Parameters
            </h3>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-fg-muted">Operating Frequency (f)</span>
                <span className="text-accent-fg font-bold">{freqMHz} MHz</span>
              </div>
              <input
                type="range"
                min="100"
                max="6000"
                step="5"
                value={freqMHz}
                onChange={(e) => setFreqMHz(Number(e.target.value))}
                className="w-full accent-accent bg-surface-2 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-fg-subtle font-mono mt-0.5">
                <span>100 MHz (VHF)</span>
                <span>2.4 GHz (Wi-Fi)</span>
                <span>6 GHz (UAV)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-fg-muted">Target Line (Z₀)</span>
                <span className="text-fg font-bold">{z0} Ω</span>
              </div>
              <input
                type="number"
                value={z0}
                onChange={(e) => setZ0(Math.max(10, Math.min(300, Number(e.target.value))))}
                className="w-full bg-surface-1 border border-line rounded-xl px-3 py-1.5 text-xs font-mono text-fg focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-fg-muted">Load Resistance (R_L)</span>
                  <span className="text-accent-fg font-bold">{rl} Ω</span>
                </div>
                <input
                  type="number"
                  value={rl}
                  onChange={(e) => setRl(Math.max(1, Math.min(1000, Number(e.target.value))))}
                  className="w-full bg-surface-1 border border-line rounded-xl px-3 py-1.5 text-xs font-mono text-fg focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-fg-muted">Load Reactance (X_L)</span>
                  <span className={xl >= 0 ? 'text-info-fg font-bold' : 'text-accent-fg font-bold'}>
                    {xl >= 0 ? `+${xl}` : xl} Ω
                  </span>
                </div>
                <input
                  type="number"
                  value={xl}
                  onChange={(e) => setXl(Math.max(-500, Math.min(500, Number(e.target.value))))}
                  className="w-full bg-surface-1 border border-line rounded-xl px-3 py-1.5 text-xs font-mono text-fg focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          <div className="bg-surface-1 border border-hairline rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-accent-fg">
                Synthesized Matching Topology: {solution.topology.replace(/_/g, ' ')}
              </span>
              <span className="text-xs font-mono text-fg-subtle">Q = {solution.loadedQ}</span>
            </div>

            <div className="w-full bg-sunken rounded-xl p-3 border border-hairline flex items-center justify-center">
              <svg viewBox="0 0 460 140" className="w-full max-w-[420px] select-none text-xs font-mono">
                <circle cx="30" cy="70" r="4" fill="#059669" />
                <text x="15" y="55" fill="#059669" fontSize="11" fontWeight="bold">50Ω IN</text>

                <line x1="20" y1="120" x2="440" y2="120" stroke="#94a3b8" strokeWidth="2" />
                <path d="M 230,120 L 230,132 M 220,132 L 240,132 M 224,136 L 236,136 M 227,140 L 233,140" stroke="#64748b" strokeWidth="1.5" />

                {solution.topology === 'shunt_C_series_L' || solution.topology === 'shunt_L_series_C' ? (
                  <>
                    <line x1="30" y1="70" x2="110" y2="70" stroke="#475569" strokeWidth="2" />
                    <line x1="110" y1="70" x2="110" y2="85" stroke="#475569" strokeWidth="2" />
                    <rect x="95" y="85" width="30" height="20" rx="3" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.5" />
                    <text x="110" y="99" textAnchor="middle" fill="#1d4ed8" fontSize="10" fontWeight="bold">
                      {solution.shuntComponent.type === 'capacitor' ? 'C_sh' : 'L_sh'}
                    </text>
                    <text x="110" y="115" textAnchor="middle" fill="#475569" fontSize="9">
                      {solution.shuntComponent.valueFormatted}
                    </text>
                    <line x1="110" y1="105" x2="110" y2="120" stroke="#475569" strokeWidth="2" />

                    <line x1="110" y1="70" x2="220" y2="70" stroke="#475569" strokeWidth="2" />
                    <rect x="220" y="60" width="40" height="20" rx="3" fill="#fdf2f8" stroke="#e11d74" strokeWidth="1.5" />
                    <text x="240" y="74" textAnchor="middle" fill="#be185d" fontSize="10" fontWeight="bold">
                      {solution.seriesComponent.type === 'inductor' ? 'L_ser' : 'C_ser'}
                    </text>
                    <text x="240" y="50" textAnchor="middle" fill="#be185d" fontSize="10" fontWeight="bold">
                      {solution.seriesComponent.valueFormatted}
                    </text>
                    <line x1="260" y1="70" x2="380" y2="70" stroke="#475569" strokeWidth="2" />
                  </>
                ) : (
                  <>
                    <line x1="30" y1="70" x2="150" y2="70" stroke="#475569" strokeWidth="2" />
                    <rect x="150" y="60" width="40" height="20" rx="3" fill="#fdf2f8" stroke="#e11d74" strokeWidth="1.5" />
                    <text x="170" y="74" textAnchor="middle" fill="#be185d" fontSize="10" fontWeight="bold">
                      {solution.seriesComponent.type === 'inductor' ? 'L_ser' : 'C_ser'}
                    </text>
                    <text x="170" y="50" textAnchor="middle" fill="#be185d" fontSize="10" fontWeight="bold">
                      {solution.seriesComponent.valueFormatted}
                    </text>
                    <line x1="190" y1="70" x2="290" y2="70" stroke="#475569" strokeWidth="2" />

                    <line x1="290" y1="70" x2="290" y2="85" stroke="#475569" strokeWidth="2" />
                    <rect x="275" y="85" width="30" height="20" rx="3" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.5" />
                    <text x="290" y="99" textAnchor="middle" fill="#1d4ed8" fontSize="10" fontWeight="bold">
                      {solution.shuntComponent.type === 'capacitor' ? 'C_sh' : 'L_sh'}
                    </text>
                    <text x="290" y="115" textAnchor="middle" fill="#475569" fontSize="9">
                      {solution.shuntComponent.valueFormatted}
                    </text>
                    <line x1="290" y1="105" x2="290" y2="120" stroke="#475569" strokeWidth="2" />

                    <line x1="290" y1="70" x2="380" y2="70" stroke="#475569" strokeWidth="2" />
                  </>
                )}

                <circle cx="380" cy="70" r="4" fill="#e11d74" />
                <text x="390" y="74" fill="#be185d" fontSize="11" fontWeight="bold">
                  Z_L ({rl}{xl >= 0 ? `+j${xl}` : `-j${Math.abs(xl)}`}Ω)
                </text>
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-hairline text-center font-mono">
              <div className="bg-sunken p-2.5 rounded-xl border border-hairline">
                <span className="text-[10px] text-fg-subtle uppercase">Return Loss</span>
                <p className="text-sm font-bold text-success-fg">{solution.returnLossDb} dB</p>
              </div>
              <div className="bg-sunken p-2.5 rounded-xl border border-hairline">
                <span className="text-[10px] text-fg-subtle uppercase">Load VSWR</span>
                <p className="text-sm font-bold text-fg">{solution.vswr}:1</p>
              </div>
              <div className="bg-sunken p-2.5 rounded-xl border border-hairline">
                <span className="text-[10px] text-fg-subtle uppercase">|Gamma| (Refl)</span>
                <p className="text-sm font-bold text-fg-muted">{solution.reflectionCoefficientMag}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <SmithChartVisualizer points={solution.smithChartPoints} vswr={solution.vswr} />
        </div>
      </div>
    </div>
  );
}
