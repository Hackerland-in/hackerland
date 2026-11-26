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

  const totalRdcMOhm = (params.rBulkOhm + params.rSeiOhm + params.rCtOhm) * 1000;

  return (
    <div className="bg-surface-1 border border-hairline rounded-2xl p-5 space-y-5 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-hairline gap-2">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider font-bold text-accent-fg">
            Equivalent Circuit Model (ECM) Fitter
          </span>
          <p className="text-xs text-fg-muted mt-0.5">
            Modified Randles Topology with Solid Electrolyte Interphase (SEI) &amp; Warburg Diffusion
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-sunken px-3 py-1 rounded-xl border border-hairline font-mono text-xs">
            <span className="text-fg-subtle mr-1.5">R_DC Est:</span>
            <span className="text-success-fg font-bold">{totalRdcMOhm.toFixed(2)} mΩ</span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-mono bg-sunken hover:bg-surface-2 border border-hairline text-fg px-3 py-1 rounded-xl transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="w-full bg-sunken rounded-xl p-3 border border-hairline flex items-center justify-center select-none">
        <svg viewBox="0 0 520 140" className="w-full max-w-[500px] text-xs font-mono">
          <line x1="20" y1="70" x2="60" y2="70" stroke="#64748b" strokeWidth="2" />
          <circle cx="20" cy="70" r="4" fill="#059669" />
          <text x="12" y="55" fill="#059669" fontSize="10" fontWeight="bold">Cathode (+)</text>

          <rect x="60" y="60" width="36" height="20" rx="3" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.5" />
          <text x="78" y="74" textAnchor="middle" fill="#1d4ed8" fontSize="10" fontWeight="bold">R₀</text>
          <text x="78" y="50" textAnchor="middle" fill="#1d4ed8" fontSize="9">{(params.rBulkOhm * 1000).toFixed(1)}mΩ</text>
          <line x1="96" y1="70" x2="130" y2="70" stroke="#64748b" strokeWidth="2" />

          <line x1="130" y1="35" x2="130" y2="105" stroke="#64748b" strokeWidth="2" />
          <line x1="130" y1="35" x2="160" y2="35" stroke="#64748b" strokeWidth="2" />
          <rect x="160" y="25" width="44" height="20" rx="3" fill="#fffbeb" stroke="#d97706" strokeWidth="1.5" />
          <text x="182" y="39" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="bold">R_sei</text>
          <text x="182" y="16" textAnchor="middle" fill="#b45309" fontSize="9">{(params.rSeiOhm * 1000).toFixed(1)}mΩ</text>
          <line x1="204" y1="35" x2="235" y2="35" stroke="#64748b" strokeWidth="2" />

          <line x1="130" y1="105" x2="160" y2="105" stroke="#64748b" strokeWidth="2" />
          <rect x="160" y="95" width="44" height="20" rx="3" fill="#fffbeb" stroke="#d97706" strokeWidth="1.5" />
          <text x="182" y="109" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="bold">C_sei</text>
          <text x="182" y="130" textAnchor="middle" fill="#475569" fontSize="9">{params.cSeiFarad.toFixed(2)}F</text>
          <line x1="204" y1="105" x2="235" y2="105" stroke="#64748b" strokeWidth="2" />
          <line x1="235" y1="35" x2="235" y2="105" stroke="#64748b" strokeWidth="2" />

          <line x1="235" y1="70" x2="275" y2="70" stroke="#64748b" strokeWidth="2" />

          <line x1="275" y1="35" x2="275" y2="105" stroke="#64748b" strokeWidth="2" />
          <line x1="275" y1="35" x2="300" y2="35" stroke="#64748b" strokeWidth="2" />
          <rect x="300" y="25" width="40" height="20" rx="3" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="1.5" />
          <text x="320" y="39" textAnchor="middle" fill="#6d28d9" fontSize="10" fontWeight="bold">R_ct</text>
          <text x="320" y="16" textAnchor="middle" fill="#6d28d9" fontSize="9">{(params.rCtOhm * 1000).toFixed(1)}mΩ</text>
          <line x1="340" y1="35" x2="360" y2="35" stroke="#64748b" strokeWidth="2" />
          <rect x="360" y="25" width="40" height="20" rx="3" fill="#fdf2f8" stroke="#e11d74" strokeWidth="1.5" />
          <text x="380" y="39" textAnchor="middle" fill="#be185d" fontSize="10" fontWeight="bold">Z_w</text>
          <text x="380" y="16" textAnchor="middle" fill="#be185d" fontSize="9">σ={params.warburgSigma}</text>
          <line x1="400" y1="35" x2="430" y2="35" stroke="#64748b" strokeWidth="2" />

          <line x1="275" y1="105" x2="345" y2="105" stroke="#64748b" strokeWidth="2" />
          <rect x="345" y="95" width="44" height="20" rx="3" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="1.5" />
          <text x="367" y="109" textAnchor="middle" fill="#6d28d9" fontSize="10" fontWeight="bold">C_dl</text>
          <text x="367" y="130" textAnchor="middle" fill="#475569" fontSize="9">{params.cDlFarad.toFixed(2)}F</text>
          <line x1="389" y1="105" x2="430" y2="105" stroke="#64748b" strokeWidth="2" />
          <line x1="430" y1="35" x2="430" y2="105" stroke="#64748b" strokeWidth="2" />

          <line x1="430" y1="70" x2="490" y2="70" stroke="#64748b" strokeWidth="2" />
          <circle cx="490" cy="70" r="4" fill="#475569" />
          <text x="455" y="55" fill="#475569" fontSize="10" fontWeight="bold">Anode (-)</text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-sunken/70 p-3 rounded-xl border border-hairline space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-fg-muted">Bulk R₀ (Electrolyte)</span>
            <span className="text-info-fg font-bold">{(params.rBulkOhm * 1000).toFixed(2)} mΩ</span>
          </div>
          <input
            type="range"
            min="0.001"
            max="0.080"
            step="0.0005"
            value={params.rBulkOhm}
            onChange={(e) => updateParam('rBulkOhm', Number(e.target.value))}
            className="w-full accent-accent bg-surface-2 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="bg-sunken/70 p-3 rounded-xl border border-hairline space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-fg-muted">SEI Layer R_sei</span>
            <span className="text-warning-fg font-bold">{(params.rSeiOhm * 1000).toFixed(2)} mΩ</span>
          </div>
          <input
            type="range"
            min="0.0005"
            max="0.050"
            step="0.0005"
            value={params.rSeiOhm}
            onChange={(e) => updateParam('rSeiOhm', Number(e.target.value))}
            className="w-full accent-accent bg-surface-2 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="bg-sunken/70 p-3 rounded-xl border border-hairline space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-fg-muted">Charge-Transfer R_ct</span>
            <span className="text-accent-fg font-bold">{(params.rCtOhm * 1000).toFixed(2)} mΩ</span>
          </div>
          <input
            type="range"
            min="0.001"
            max="0.100"
            step="0.001"
            value={params.rCtOhm}
            onChange={(e) => updateParam('rCtOhm', Number(e.target.value))}
            className="w-full accent-accent bg-surface-2 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="bg-sunken/70 p-3 rounded-xl border border-hairline space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-fg-muted">SEI Capacitance C_sei</span>
            <span className="text-fg font-bold">{params.cSeiFarad.toFixed(3)} F</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="2.0"
            step="0.01"
            value={params.cSeiFarad}
            onChange={(e) => updateParam('cSeiFarad', Number(e.target.value))}
            className="w-full accent-accent bg-surface-2 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="bg-sunken/70 p-3 rounded-xl border border-hairline space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-fg-muted">Double Layer C_dl</span>
            <span className="text-fg font-bold">{params.cDlFarad.toFixed(2)} F</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="10.0"
            step="0.1"
            value={params.cDlFarad}
            onChange={(e) => updateParam('cDlFarad', Number(e.target.value))}
            className="w-full accent-accent bg-surface-2 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="bg-sunken/70 p-3 rounded-xl border border-hairline space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-fg-muted">Warburg Diffusion (σ_w)</span>
            <span className="text-accent-fg font-bold">{params.warburgSigma.toFixed(4)} Ω·s⁻⁰·⁵</span>
          </div>
          <input
            type="range"
            min="0.0005"
            max="0.050"
            step="0.0005"
            value={params.warburgSigma}
            onChange={(e) => updateParam('warburgSigma', Number(e.target.value))}
            className="w-full accent-accent bg-surface-2 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
