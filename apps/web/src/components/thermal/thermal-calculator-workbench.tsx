'use client';

import { useState } from 'react';
import {
  type CoolingMethod,
  type HeatsinkMaterial,
  type TimMaterial,
  TIM_DATABASE,
  calculateThermalDissipation,
} from '@hackerland/core';
import { ThermalNetworkDiagram } from './thermal-network-diagram';
import { HeatsinkFinVisualizer } from './heatsink-fin-visualizer';

interface ThermalCalculatorWorkbenchProps {
  initialPowerWatts?: number;
  initialAmbientC?: number;
  initialMaxJunctionC?: number;
  initialThetaJc?: number;
  initialTim?: TimMaterial;
  initialTimAreaCm2?: number;
  initialMaterial?: HeatsinkMaterial;
  initialCooling?: CoolingMethod;
  initialWidthMm?: number;
  initialLengthMm?: number;
  initialBaseThicknessMm?: number;
  initialFinHeightMm?: number;
  initialFinThicknessMm?: number;
  initialNumberOfFins?: number;
}

export function ThermalCalculatorWorkbench({
  initialPowerWatts = 35,
  initialAmbientC = 45,
  initialMaxJunctionC = 150,
  initialThetaJc = 0.5,
  initialTim = 'phase_change_ptm7950',
  initialTimAreaCm2 = 6.0,
  initialMaterial = 'aluminum_6063_t5',
  initialCooling = 'forced_convection_low_cfm',
  initialWidthMm = 100,
  initialLengthMm = 120,
  initialBaseThicknessMm = 8,
  initialFinHeightMm = 35,
  initialFinThicknessMm = 1.8,
  initialNumberOfFins = 18,
}: ThermalCalculatorWorkbenchProps) {
  const [powerWatts, setPowerWatts] = useState(initialPowerWatts);
  const [ambientC, setAmbientC] = useState(initialAmbientC);
  const [maxJunctionC, setMaxJunctionC] = useState(initialMaxJunctionC);
  const [thetaJc, setThetaJc] = useState(initialThetaJc);
  const [tim, setTim] = useState<TimMaterial>(initialTim);
  const [timAreaCm2, setTimAreaCm2] = useState(initialTimAreaCm2);
  const [material, setMaterial] = useState<HeatsinkMaterial>(initialMaterial);
  const [cooling, setCooling] = useState<CoolingMethod>(initialCooling);

  // Heatsink dimensions
  const [widthMm, setWidthMm] = useState(initialWidthMm);
  const [lengthMm, setLengthMm] = useState(initialLengthMm);
  const [baseThicknessMm] = useState(initialBaseThicknessMm);
  const [finHeightMm, setFinHeightMm] = useState(initialFinHeightMm);
  const [finThicknessMm] = useState(initialFinThicknessMm);
  const [numberOfFins, setNumberOfFins] = useState(initialNumberOfFins);

  const result = calculateThermalDissipation({
    powerDissipationWatts: powerWatts,
    ambientTemperatureC: ambientC,
    maxJunctionTemperatureC: maxJunctionC,
    junctionToCaseResistanceCPerW: thetaJc,
    timMaterial: tim,
    timContactAreaCm2: timAreaCm2,
    heatsinkMaterial: material,
    coolingMethod: cooling,
    heatsinkWidthMm: widthMm,
    heatsinkLengthMm: lengthMm,
    baseThicknessMm: baseThicknessMm,
    finHeightMm: finHeightMm,
    finThicknessMm: finThicknessMm,
    numberOfFins: numberOfFins,
  });

  const selectedTimInfo = TIM_DATABASE[tim];

  return (
    <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              Thermal Engineering Engine
            </span>
            <span className="text-xs text-stone-500 font-mono">Conduction, TIM &amp; Convective Boundary Layers</span>
          </div>
          <h2 className="text-xl font-bold text-stone-100 mt-1">
            Computational Heat Sink Sizer &amp; Thermal Resistance Profiler
          </h2>
          <p className="text-sm text-stone-400 mt-1">
            Model junction temperature rise (T_j), fin efficiency (η_fin), TIM thermal impedance, and convective dissipation across natural and forced airflow.
          </p>
        </div>

        {/* Cooling mode quick toggles */}
        <div className="flex items-center bg-stone-900 border border-stone-800 p-1 rounded-lg">
          {(
            [
              { id: 'natural_convection', label: 'Natural Air' },
              { id: 'forced_convection_low_cfm', label: 'Forced Low CFM' },
              { id: 'forced_convection_high_cfm', label: 'Forced High CFM' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setCooling(m.id)}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors ${
                cooling === m.id
                  ? 'bg-amber-600 text-white shadow-sm font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Thermal Load & Environment */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-stone-300">
              Thermal Source &amp; Ambient
            </h3>

            {/* Power Dissipation */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-stone-400">Power Dissipation (P_diss)</span>
                <span className="text-amber-400 font-bold">{powerWatts} W</span>
              </div>
              <input
                type="range"
                min="1"
                max="400"
                step="1"
                value={powerWatts}
                onChange={(e) => setPowerWatts(Number(e.target.value))}
                className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-0.5">
                <span>1 W (Micro)</span>
                <span>150 W (Power)</span>
                <span>400 W (SiC Traction)</span>
              </div>
            </div>

            {/* Ambient Temperature */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-stone-400">Ambient Temperature (T_amb)</span>
                <span className="text-stone-200 font-bold">{ambientC}°C</span>
              </div>
              <input
                type="range"
                min="15"
                max="70"
                step="1"
                value={ambientC}
                onChange={(e) => setAmbientC(Number(e.target.value))}
                className="w-full accent-stone-400 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-0.5">
                <span>25°C (Lab Std)</span>
                <span>45°C (Indian Summer)</span>
                <span>65°C (Engine Bay / Rooftop)</span>
              </div>
            </div>

            {/* Theta_jc and TjMax */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-stone-400 block mb-1">
                  θ_jc (Junction-to-Case)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.05"
                    min="0.05"
                    max="5.0"
                    value={thetaJc}
                    onChange={(e) => setThetaJc(Math.max(0.05, Number(e.target.value)))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-stone-500 font-mono">°C/W</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-stone-400 block mb-1">
                  T_j,max (Die Rating)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="5"
                    min="85"
                    max="225"
                    value={maxJunctionC}
                    onChange={(e) => setMaxJunctionC(Math.max(85, Number(e.target.value)))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-stone-500 font-mono">°C</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thermal Interface Material (TIM) */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="tim-select" className="text-xs font-mono uppercase tracking-wider font-semibold text-stone-300">
                Thermal Interface (TIM)
              </label>
              <span className="text-xs font-mono text-cyan-400">
                k = {selectedTimInfo.thermalConductivityWmk} W/m·K
              </span>
            </div>
            <select
              id="tim-select"
              aria-label="Thermal Interface Material"
              value={tim}
              onChange={(e) => setTim(e.target.value as TimMaterial)}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs font-mono text-stone-100 focus:outline-none focus:border-cyan-500"
            >
              {Object.values(TIM_DATABASE).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-stone-400">Contact Area:</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="100"
                  value={timAreaCm2}
                  onChange={(e) => setTimAreaCm2(Math.max(0.5, Number(e.target.value)))}
                  className="w-20 bg-stone-950 border border-stone-800 rounded px-2 py-1 text-xs font-mono text-stone-100"
                />
                <span className="text-stone-500">cm²</span>
              </div>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              {selectedTimInfo.description}
            </p>
          </div>

          {/* Heat Sink Geometry & Material */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-stone-300">
                Heat Sink Dimensions
              </span>
              <select
                aria-label="Heat Sink Material"
                value={material}
                onChange={(e) => setMaterial(e.target.value as HeatsinkMaterial)}
                className="bg-stone-950 border border-stone-800 rounded px-2 py-1 text-xs font-mono text-stone-300"
              >
                <option value="aluminum_6063_t5">Aluminum 6063-T5</option>
                <option value="aluminum_6061_t6">Aluminum 6061-T6</option>
                <option value="copper_c11000">Copper C11000</option>
              </select>
            </div>

            {/* Fin Height Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-stone-400">Fin Height (H_fin)</span>
                <span className="text-stone-200 font-bold">{finHeightMm} mm</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="1"
                value={finHeightMm}
                onChange={(e) => setFinHeightMm(Number(e.target.value))}
                className="w-full accent-stone-400 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Number of Fins Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-stone-400">Number of Fins</span>
                <span className="text-stone-200 font-bold">{numberOfFins} fins</span>
              </div>
              <input
                type="range"
                min="4"
                max="40"
                step="2"
                value={numberOfFins}
                onChange={(e) => setNumberOfFins(Number(e.target.value))}
                className="w-full accent-stone-400 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Width and Length inputs */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-stone-400 block mb-1">Width (W)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={widthMm}
                    onChange={(e) => setWidthMm(Math.max(20, Number(e.target.value)))}
                    className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1 text-stone-100"
                  />
                  <span className="text-stone-500">mm</span>
                </div>
              </div>
              <div>
                <span className="text-stone-400 block mb-1">Length (L)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={lengthMm}
                    onChange={(e) => setLengthMm(Math.max(20, Number(e.target.value)))}
                    className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1 text-stone-100"
                  />
                  <span className="text-stone-500">mm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output & Visualization Column */}
        <div className="lg:col-span-7 space-y-4">
          <ThermalNetworkDiagram
            result={result}
            powerWatts={powerWatts}
            ambientTempC={ambientC}
            maxJunctionTempC={maxJunctionC}
          />

          <HeatsinkFinVisualizer
            widthMm={widthMm}
            lengthMm={lengthMm}
            baseThicknessMm={baseThicknessMm}
            finHeightMm={finHeightMm}
            finThicknessMm={finThicknessMm}
            numberOfFins={numberOfFins}
            material={material}
            coolingMethod={cooling}
            finEfficiencyPercent={result.finEfficiencyPercent}
            totalSurfaceAreaCm2={result.totalSurfaceAreaCm2}
            heatTransferCoefficient={result.heatTransferCoefficientWPerM2K}
          />
        </div>
      </div>
    </div>
  );
}
