'use client';

import { useState } from 'react';
import type { RandlesEcmParameters } from '@hackerland/core';

interface RandlesCircuitFitterProps {
  initialParams: RandlesEcmParameters;
  onParamsChange?: (updated: RandlesEcmParameters) => void;
}

export function RandlesCircuitFitter({
  initialParams,
  onParamsChange,
}: RandlesCircuitFitterProps) {
  const [params, setParams] = useState<RandlesEcmParameters>(initialParams);

  const updateParam = (key: keyof RandlesEcmParameters, value: number) => {
    const updated = { ...params, [key]: value };
    setParams(updated);
    onParamsChange?.(updated);
  };

  const handleReset = () => {
    setParams(initialParams);
    onParamsChange?.(initialParams);
  };

  // Total low frequency DC internal resistance: R_dc ≈ R0 + R_sei + R_ct
  const totalRdcMOhm = (params.rBulkOhm + params.rSeiOhm + params.rCtOhm) * 1000;

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-stone-800 gap-2">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider font-bold text-cyan-400">
            Equivalent Circuit Model (ECM) Fitter
          </span>
          <p className="text-xs text-stone-400 mt-0.5">
            Modified Randles Topology with Solid Electrolyte Interphase (SEI) &amp; Warburg Diffusion
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-stone-950 px-3 py-1 rounded-lg border border-stone-800 font-mono text-xs">
            <span className="text-stone-500 mr-1.5">R_DC Est:</span>
            <span className="text-emerald-400 font-bold">{totalRdcMOhm.toFixed(2)} mΩ</span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-mono bg-stone-800 hover:bg-stone-700 text-stone-300 px-2.5 py-1 rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* SVG Schematic Diagram of Modified Randles Circuit */}
      <div className="w-full bg-stone-950 rounded-lg p-3 border border-stone-800 flex items-center justify-center select-none">
        <svg viewBox="0 0 520 140" className="w-full max-w-[500px] text-xs font-mono">
          {/* Main bus line */}
          <line x1="20" y1="70" x2="60" y2="70" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="20" cy="70" r="4" fill="#10b981" />
          <text x="12" y="55" fill="#10b981" fontSize="10" fontWeight="bold">Cathode (+)</text>

          {/* R0 Component (Bulk Electrolyte) */}
          <rect x="60" y="60" width="36" height="20" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="78" y="74" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">R₀</text>
          <text x="78" y="50" textAnchor="middle" fill="#38bdf8" fontSize="9">{(params.rBulkOhm * 1000).toFixed(1)}mΩ</text>
          <line x1="96" y1="70" x2="130" y2="70" stroke="#94a3b8" strokeWidth="2" />

          {/* First Parallel Loop: SEI (R_sei || C_sei) */}
          <line x1="130" y1="35" x2="130" y2="105" stroke="#94a3b8" strokeWidth="2" />
          {/* Top branch: R_sei */}
          <line x1="130" y1="35" x2="160" y2="35" stroke="#94a3b8" strokeWidth="2" />
          <rect x="160" y="25" width="44" height="20" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="182" y="39" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="bold">R_sei</text>
          <text x="182" y="16" textAnchor="middle" fill="#f59e0b" fontSize="9">{(params.rSeiOhm * 1000).toFixed(1)}mΩ</text>
          <line x1="204" y1="35" x2="235" y2="35" stroke="#94a3b8" strokeWidth="2" />

          {/* Bottom branch: C_sei */}
          <line x1="130" y1="105" x2="160" y2="105" stroke="#94a3b8" strokeWidth="2" />
          <rect x="160" y="95" width="44" height="20" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="182" y="109" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="bold">C_sei</text>
          <text x="182" y="130" textAnchor="middle" fill="#94a3b8" fontSize="9">{params.cSeiFarad.toFixed(2)}F</text>
          <line x1="204" y1="105" x2="235" y2="105" stroke="#94a3b8" strokeWidth="2" />
          <line x1="235" y1="35" x2="235" y2="105" stroke="#94a3b8" strokeWidth="2" />

          {/* Connection to Second Loop */}
          <line x1="235" y1="70" x2="275" y2="70" stroke="#94a3b8" strokeWidth="2" />

          {/* Second Parallel Loop: Charge-transfer & Warburg ( (R_ct + Zw) || C_dl ) */}
          <line x1="275" y1="35" x2="275" y2="105" stroke="#94a3b8" strokeWidth="2" />
          {/* Top branch: R_ct + Zw */}
          <line x1="275" y1="35" x2="300" y2="35" stroke="#94a3b8" strokeWidth="2" />
          <rect x="300" y="25" width="40" height="20" rx="3" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
          <text x="320" y="39" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="bold">R_ct</text>
          <text x="320" y="16" textAnchor="middle" fill="#a855f7" fontSize="9">{(params.rCtOhm * 1000).toFixed(1)}mΩ</text>
          <line x1="340" y1="35" x2="360" y2="35" stroke="#94a3b8" strokeWidth="2" />
          {/* Warburg Zw */}
          <rect x="360" y="25" width="40" height="20" rx="3" fill="#1e293b" stroke="#ec4899" strokeWidth="1.5" />
          <text x="380" y="39" textAnchor="middle" fill="#ec4899" fontSize="10" fontWeight="bold">Z_w</text>
          <text x="380" y="16" textAnchor="middle" fill="#ec4899" fontSize="9">σ={params.warburgSigma}</text>
          <line x1="400" y1="35" x2="430" y2="35" stroke="#94a3b8" strokeWidth="2" />

          {/* Bottom branch: C_dl */}
          <line x1="275" y1="105" x2="345" y2="105" stroke="#94a3b8" strokeWidth="2" />
          <rect x="345" y="95" width="44" height="20" rx="3" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
          <text x="367" y="109" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="bold">C_dl</text>
          <text x="367" y="130" textAnchor="middle" fill="#94a3b8" fontSize="9">{params.cDlFarad.toFixed(2)}F</text>
          <line x1="389" y1="105" x2="430" y2="105" stroke="#94a3b8" strokeWidth="2" />
          <line x1="430" y1="35" x2="430" y2="105" stroke="#94a3b8" strokeWidth="2" />

          {/* Terminal Out */}
          <line x1="430" y1="70" x2="490" y2="70" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="490" cy="70" r="4" fill="#64748b" />
          <text x="455" y="55" fill="#94a3b8" fontSize="10" fontWeight="bold">Anode (-)</text>
        </svg>
      </div>

      {/* Parameter Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Bulk R0 */}
        <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-stone-400">Bulk R₀ (Electrolyte)</span>
            <span className="text-cyan-400 font-bold">{(params.rBulkOhm * 1000).toFixed(2)} mΩ</span>
          </div>
          <input
            type="range"
            min="0.001"
            max="0.080"
            step="0.0005"
            value={params.rBulkOhm}
            onChange={(e) => updateParam('rBulkOhm', Number(e.target.value))}
            className="w-full accent-cyan-500 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* SEI Resistance R_sei */}
        <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-stone-400">SEI Layer R_sei</span>
            <span className="text-amber-400 font-bold">{(params.rSeiOhm * 1000).toFixed(2)} mΩ</span>
          </div>
          <input
            type="range"
            min="0.0005"
            max="0.050"
            step="0.0005"
            value={params.rSeiOhm}
            onChange={(e) => updateParam('rSeiOhm', Number(e.target.value))}
            className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Charge Transfer R_ct */}
        <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-stone-400">Charge-Transfer R_ct</span>
            <span className="text-purple-400 font-bold">{(params.rCtOhm * 1000).toFixed(2)} mΩ</span>
          </div>
          <input
            type="range"
            min="0.001"
            max="0.100"
            step="0.001"
            value={params.rCtOhm}
            onChange={(e) => updateParam('rCtOhm', Number(e.target.value))}
            className="w-full accent-purple-500 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* SEI Capacitance C_sei */}
        <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-stone-400">SEI Capacitance C_sei</span>
            <span className="text-stone-200 font-bold">{params.cSeiFarad.toFixed(3)} F</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="2.0"
            step="0.01"
            value={params.cSeiFarad}
            onChange={(e) => updateParam('cSeiFarad', Number(e.target.value))}
            className="w-full accent-stone-400 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Double Layer Capacitance C_dl */}
        <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-stone-400">Double Layer C_dl</span>
            <span className="text-stone-200 font-bold">{params.cDlFarad.toFixed(2)} F</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="10.0"
            step="0.1"
            value={params.cDlFarad}
            onChange={(e) => updateParam('cDlFarad', Number(e.target.value))}
            className="w-full accent-stone-400 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Warburg Coefficient */}
        <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-stone-400">Warburg Diffusion (σ_w)</span>
            <span className="text-pink-400 font-bold">{params.warburgSigma.toFixed(4)} Ω·s⁻⁰·⁵</span>
          </div>
          <input
            type="range"
            min="0.0005"
            max="0.050"
            step="0.0005"
            value={params.warburgSigma}
            onChange={(e) => updateParam('warburgSigma', Number(e.target.value))}
            className="w-full accent-pink-500 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
