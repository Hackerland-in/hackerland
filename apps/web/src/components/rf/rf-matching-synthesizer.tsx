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
    <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              RF Synthesizer
            </span>
            <span className="text-xs text-stone-500 font-mono">2-Element L-Network Matching</span>
          </div>
          <h2 className="text-xl font-bold text-stone-100 mt-1">
            Smith Chart &amp; Complex Impedance Conjugate Matcher
          </h2>
          <p className="text-sm text-stone-400 mt-1">
            Synthesize low-pass and high-pass matching networks to conjugate match arbitrary complex antenna loads ($R_L + jX_L$) to standard 50Ω systems.
          </p>
        </div>

        {/* Low-pass vs High-pass toggle */}
        <div className="flex items-center bg-stone-900 border border-stone-800 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setPreferLowPass(true)}
            className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors ${
              preferLowPass
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Low-Pass (Harmonic Suppress)
          </button>
          <button
            type="button"
            onClick={() => setPreferLowPass(false)}
            className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors ${
              !preferLowPass
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            High-Pass (DC Block)
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <span className="text-xs font-mono text-stone-500">Quick Loads:</span>
        {QUICK_LOAD_PRESETS.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => loadPreset(p)}
            className="text-xs font-mono bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 hover:border-stone-700 px-2.5 py-1 rounded-md transition-colors"
            title={p.desc}
          >
            {p.name} ({p.rl}{p.xl >= 0 ? `+j${p.xl}` : `-j${Math.abs(p.xl)}`}Ω @ {p.freqMHz}MHz)
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-stone-900/60 border border-stone-800/80 rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-stone-300">
              Impedance Parameters
            </h3>

            {/* Frequency */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-stone-400">Operating Frequency (f)</span>
                <span className="text-emerald-400 font-bold">{freqMHz} MHz</span>
              </div>
              <input
                type="range"
                min="100"
                max="6000"
                step="5"
                value={freqMHz}
                onChange={(e) => setFreqMHz(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-0.5">
                <span>100 MHz (VHF)</span>
                <span>2.4 GHz (Wi-Fi)</span>
                <span>6 GHz (UAV)</span>
              </div>
            </div>

            {/* Target System Z0 */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-stone-400">Target Line (Z₀)</span>
                <span className="text-stone-200 font-bold">{z0} Ω</span>
              </div>
              <input
                type="number"
                value={z0}
                onChange={(e) => setZ0(Math.max(10, Math.min(300, Number(e.target.value))))}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs font-mono text-stone-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Complex Load R_L and X_L */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-stone-400">Load Resistance (R_L)</span>
                  <span className="text-amber-400 font-bold">{rl} Ω</span>
                </div>
                <input
                  type="number"
                  value={rl}
                  onChange={(e) => setRl(Math.max(1, Math.min(1000, Number(e.target.value))))}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-stone-400">Load Reactance (X_L)</span>
                  <span className={xl >= 0 ? 'text-sky-400 font-bold' : 'text-pink-400 font-bold'}>
                    {xl >= 0 ? `+${xl}` : xl} Ω
                  </span>
                </div>
                <input
                  type="number"
                  value={xl}
                  onChange={(e) => setXl(Math.max(-500, Math.min(500, Number(e.target.value))))}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs font-mono text-stone-100 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Solution Circuit Diagram */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-emerald-400">
                Synthesized Matching Topology: {solution.topology.replace(/_/g, ' ')}
              </span>
              <span className="text-xs font-mono text-stone-500">
                Q = {solution.loadedQ}
              </span>
            </div>

            {/* SVG Schematic */}
            <div className="w-full bg-stone-950/80 rounded-lg p-3 border border-stone-800 flex items-center justify-center">
              <svg viewBox="0 0 460 140" className="w-full max-w-[420px] select-none text-xs font-mono">
                {/* Source Port */}
                <circle cx="30" cy="70" r="4" fill="#10b981" />
                <text x="15" y="55" fill="#10b981" fontSize="11" fontWeight="bold">50Ω IN</text>

                {/* Ground rail */}
                <line x1="20" y1="120" x2="440" y2="120" stroke="#334155" strokeWidth="2" />
                <path d="M 230,120 L 230,132 M 220,132 L 240,132 M 224,136 L 236,136 M 227,140 L 233,140" stroke="#475569" strokeWidth="1.5" />

                {/* Shunt-at-source vs Series-at-source */}
                {solution.topology === 'shunt_C_series_L' || solution.topology === 'shunt_L_series_C' ? (
                  <>
                    {/* Shunt Component at node 100 */}
                    <line x1="30" y1="70" x2="110" y2="70" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="110" y1="70" x2="110" y2="85" stroke="#94a3b8" strokeWidth="2" />
                    {/* Component box / symbol */}
                    <rect x="95" y="85" width="30" height="20" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                    <text x="110" y="99" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
                      {solution.shuntComponent.type === 'capacitor' ? 'C_sh' : 'L_sh'}
                    </text>
                    <text x="110" y="115" textAnchor="middle" fill="#94a3b8" fontSize="9">
                      {solution.shuntComponent.valueFormatted}
                    </text>
                    <line x1="110" y1="105" x2="110" y2="120" stroke="#94a3b8" strokeWidth="2" />

                    {/* Series Component */}
                    <line x1="110" y1="70" x2="220" y2="70" stroke="#94a3b8" strokeWidth="2" />
                    <rect x="220" y="60" width="40" height="20" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
                    <text x="240" y="74" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="bold">
                      {solution.seriesComponent.type === 'inductor' ? 'L_ser' : 'C_ser'}
                    </text>
                    <text x="240" y="50" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="bold">
                      {solution.seriesComponent.valueFormatted}
                    </text>
                    <line x1="260" y1="70" x2="380" y2="70" stroke="#94a3b8" strokeWidth="2" />
                  </>
                ) : (
                  <>
                    {/* Series Component First */}
                    <line x1="30" y1="70" x2="150" y2="70" stroke="#94a3b8" strokeWidth="2" />
                    <rect x="150" y="60" width="40" height="20" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
                    <text x="170" y="74" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="bold">
                      {solution.seriesComponent.type === 'inductor' ? 'L_ser' : 'C_ser'}
                    </text>
                    <text x="170" y="50" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="bold">
                      {solution.seriesComponent.valueFormatted}
                    </text>
                    <line x1="190" y1="70" x2="290" y2="70" stroke="#94a3b8" strokeWidth="2" />

                    {/* Shunt Component at node 290 */}
                    <line x1="290" y1="70" x2="290" y2="85" stroke="#94a3b8" strokeWidth="2" />
                    <rect x="275" y="85" width="30" height="20" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                    <text x="290" y="99" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
                      {solution.shuntComponent.type === 'capacitor' ? 'C_sh' : 'L_sh'}
                    </text>
                    <text x="290" y="115" textAnchor="middle" fill="#94a3b8" fontSize="9">
                      {solution.shuntComponent.valueFormatted}
                    </text>
                    <line x1="290" y1="105" x2="290" y2="120" stroke="#94a3b8" strokeWidth="2" />

                    <line x1="290" y1="70" x2="380" y2="70" stroke="#94a3b8" strokeWidth="2" />
                  </>
                )}

                {/* Load Terminal */}
                <circle cx="380" cy="70" r="4" fill="#f59e0b" />
                <text x="390" y="74" fill="#f59e0b" fontSize="11" fontWeight="bold">
                  Z_L ({rl}{xl >= 0 ? `+j${xl}` : `-j${Math.abs(xl)}`}Ω)
                </text>
              </svg>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-800 text-center font-mono">
              <div className="bg-stone-950 p-2 rounded-lg border border-stone-800/80">
                <span className="text-[10px] text-stone-500 uppercase">Return Loss</span>
                <p className="text-sm font-bold text-emerald-400">{solution.returnLossDb} dB</p>
              </div>
              <div className="bg-stone-950 p-2 rounded-lg border border-stone-800/80">
                <span className="text-[10px] text-stone-500 uppercase">Load VSWR</span>
                <p className="text-sm font-bold text-stone-200">{solution.vswr}:1</p>
              </div>
              <div className="bg-stone-950 p-2 rounded-lg border border-stone-800/80">
                <span className="text-[10px] text-stone-500 uppercase">|Gamma| (Refl)</span>
                <p className="text-sm font-bold text-stone-300">{solution.reflectionCoefficientMag}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Smith Chart Column */}
        <div className="lg:col-span-6">
          <SmithChartVisualizer
            points={solution.smithChartPoints}
            vswr={solution.vswr}
          />
        </div>
      </div>
    </div>
  );
}
