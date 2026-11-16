'use client';

import type { ThermalCalculationResult } from '@hackerland/core';

interface ThermalNetworkDiagramProps {
  result: ThermalCalculationResult;
  powerWatts: number;
  ambientTempC: number;
  maxJunctionTempC: number;
}

export function ThermalNetworkDiagram({
  result,
  powerWatts,
  ambientTempC,
  maxJunctionTempC,
}: ThermalNetworkDiagramProps) {
  const {
    thetaJc,
    thetaCs,
    thetaSa,
    thetaTotal,
    junctionTemperatureC,
    caseTemperatureC,
    heatsinkTemperatureC,
    thermalHeadroomC,
    isThermalRunawayRisk,
    maxSafeAmbientTemperatureC,
  } = result;

  const getTempColor = (t: number, maxT: number) => {
    const ratio = t / maxT;
    if (ratio >= 0.95) return 'text-rose-400 border-rose-500/50 bg-rose-950/40';
    if (ratio >= 0.8) return 'text-amber-400 border-amber-500/50 bg-amber-950/40';
    return 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40';
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider font-bold text-amber-400">
            1D Lumped-Parameter Thermal Resistance Network (R_θ)
          </span>
          <p className="text-xs text-stone-400 mt-0.5">
            Junction-to-Ambient Fourier Conduction &amp; Convection Chain
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-stone-400">Total R_θ:</span>
          <span className="text-amber-400 font-bold">{thetaTotal.toFixed(3)} °C/W</span>
        </div>
      </div>

      {/* SVG Circuit Ladder */}
      <div className="w-full bg-stone-950 rounded-lg p-3 border border-stone-800 flex items-center justify-center select-none">
        <svg viewBox="0 0 620 130" className="w-full max-w-[600px] text-xs font-mono">
          {/* Heat flux input arrow */}
          <line x1="20" y1="65" x2="60" y2="65" stroke="#f59e0b" strokeWidth="2.5" />
          <polygon points="60,65 52,60 52,70" fill="#f59e0b" />
          <text x="18" y="50" fill="#f59e0b" fontSize="10" fontWeight="bold">
            P_diss ({powerWatts}W)
          </text>

          {/* Node 1: Junction Tj */}
          <circle cx="85" cy="65" r="7" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2" />
          <text x="85" y="45" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">
            T_j
          </text>
          <text x="85" y="90" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">
            {junctionTemperatureC}°C
          </text>

          {/* Resistor 1: theta_jc */}
          <line x1="92" y1="65" x2="140" y2="65" stroke="#94a3b8" strokeWidth="2" />
          <rect x="140" y="55" width="45" height="20" rx="3" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
          <text x="162" y="69" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">
            θ_jc
          </text>
          <text x="162" y="45" textAnchor="middle" fill="#94a3b8" fontSize="9">
            {thetaJc.toFixed(2)}°C/W
          </text>
          <line x1="185" y1="65" x2="235" y2="65" stroke="#94a3b8" strokeWidth="2" />

          {/* Node 2: Case Tc */}
          <circle cx="235" cy="65" r="7" fill="#f97316" stroke="#9a3412" strokeWidth="2" />
          <text x="235" y="45" textAnchor="middle" fill="#f97316" fontSize="11" fontWeight="bold">
            T_case
          </text>
          <text x="235" y="90" textAnchor="middle" fill="#f97316" fontSize="10" fontWeight="bold">
            {caseTemperatureC}°C
          </text>

          {/* Resistor 2: theta_cs (TIM) */}
          <line x1="242" y1="65" x2="290" y2="65" stroke="#94a3b8" strokeWidth="2" />
          <rect x="290" y="55" width="45" height="20" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="312" y="69" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
            θ_cs (TIM)
          </text>
          <text x="312" y="45" textAnchor="middle" fill="#38bdf8" fontSize="9">
            {thetaCs.toFixed(3)}°C/W
          </text>
          <line x1="335" y1="65" x2="385" y2="65" stroke="#94a3b8" strokeWidth="2" />

          {/* Node 3: Heatsink Ts */}
          <circle cx="385" cy="65" r="7" fill="#eab308" stroke="#854d0e" strokeWidth="2" />
          <text x="385" y="45" textAnchor="middle" fill="#eab308" fontSize="11" fontWeight="bold">
            T_sink
          </text>
          <text x="385" y="90" textAnchor="middle" fill="#eab308" fontSize="10" fontWeight="bold">
            {heatsinkTemperatureC}°C
          </text>

          {/* Resistor 3: theta_sa (Heatsink to Ambient) */}
          <line x1="392" y1="65" x2="440" y2="65" stroke="#94a3b8" strokeWidth="2" />
          <rect x="440" y="55" width="45" height="20" rx="3" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
          <text x="462" y="69" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">
            θ_sa
          </text>
          <text x="462" y="45" textAnchor="middle" fill="#10b981" fontSize="9">
            {thetaSa.toFixed(3)}°C/W
          </text>
          <line x1="485" y1="65" x2="535" y2="65" stroke="#94a3b8" strokeWidth="2" />

          {/* Node 4: Ambient Ta */}
          <circle cx="535" cy="65" r="7" fill="#38bdf8" stroke="#0369a1" strokeWidth="2" />
          <text x="535" y="45" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
            T_amb
          </text>
          <text x="535" y="90" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
            {ambientTempC}°C
          </text>

          {/* Earth/Thermal ground symbol */}
          <line x1="535" y1="72" x2="535" y2="105" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="525" y1="105" x2="545" y2="105" stroke="#94a3b8" strokeWidth="2" />
          <line x1="528" y1="110" x2="542" y2="110" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="532" y1="115" x2="538" y2="115" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      </div>

      {/* Headroom and Safety Verdict */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className={`p-3 rounded-lg border ${getTempColor(junctionTemperatureC, maxJunctionTempC)}`}>
          <span className="text-[10px] uppercase tracking-wider block opacity-80">Junction Temp (T_j)</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-bold">{junctionTemperatureC}°C</span>
            <span className="text-[11px] opacity-75">/ {maxJunctionTempC}°C Max</span>
          </div>
          <span className="text-[10px] block mt-1">
            {isThermalRunawayRisk ? 'CRITICAL THERMAL RUNAWAY' : 'Within Safe SOA'}
          </span>
        </div>

        <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 text-stone-200">
          <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Thermal Headroom</span>
          <span className={`text-xl font-bold mt-0.5 block ${
            thermalHeadroomC > 20 ? 'text-emerald-400' : thermalHeadroomC > 5 ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {thermalHeadroomC > 0 ? `+${thermalHeadroomC}°C` : `${thermalHeadroomC}°C`}
          </span>
          <span className="text-[10px] text-stone-500 block mt-1">Margin before throttling</span>
        </div>

        <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 text-stone-200">
          <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Max Safe Ambient</span>
          <span className="text-xl font-bold text-stone-100 mt-0.5 block">
            {maxSafeAmbientTemperatureC}°C
          </span>
          <span className="text-[10px] text-stone-500 block mt-1">Before exceeding T_j,max</span>
        </div>
      </div>
    </div>
  );
}
