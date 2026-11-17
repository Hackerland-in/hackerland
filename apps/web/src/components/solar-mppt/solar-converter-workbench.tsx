'use client';

import { useState, useMemo } from 'react';
import type {
  SolarPvPanelSpecs,
  MpptAlgorithm,
  BatteryBankType,
} from '@hackerland/core';
import { simulateSolarMppt } from '@hackerland/core';
import { IvPvCurveVisualizer } from './iv-pv-curve-visualizer';
import { MpptTrackerSimulator } from './mppt-tracker-simulator';

interface SolarConverterWorkbenchProps {
  initialPanelSpecs: SolarPvPanelSpecs;
  initialAlgorithm?: MpptAlgorithm;
  initialBattery?: BatteryBankType;
  initialIrradiance?: number;
  initialTemperature?: number;
}

export function SolarConverterWorkbench({
  initialPanelSpecs,
  initialAlgorithm = 'incremental_conductance',
  initialBattery = 'lfp_48v',
  initialIrradiance = 1000,
  initialTemperature = 25,
}: SolarConverterWorkbenchProps) {
  const [irradiance, setIrradiance] = useState<number>(initialIrradiance);
  const [temperature, setTemperature] = useState<number>(initialTemperature);
  const [shadingRatio, setShadingRatio] = useState<number>(0);
  const [algorithm, setAlgorithm] = useState<MpptAlgorithm>(initialAlgorithm);
  const [batteryType, setBatteryType] = useState<BatteryBankType>(initialBattery);
  const [switchingFreqKhz, setSwitchingFreqKhz] = useState<number>(150);

  // Compute live simulation result
  const simResult = useMemo(() => {
    return simulateSolarMppt({
      irradianceWPerM2: irradiance,
      cellTemperatureC: temperature,
      panelSpecs: initialPanelSpecs,
      algorithm,
      partialShadingRatio: shadingRatio,
      targetBatteryType: batteryType,
      converterSwitchingFreqKhz: switchingFreqKhz,
    });
  }, [irradiance, temperature, initialPanelSpecs, algorithm, shadingRatio, batteryType, switchingFreqKhz]);

  const applyPreset = (preset: 'stc' | 'rajasthan' | 'monsoon' | 'ladakh' | 'shading') => {
    switch (preset) {
      case 'stc':
        setIrradiance(1000);
        setTemperature(25);
        setShadingRatio(0);
        break;
      case 'rajasthan':
        setIrradiance(1050);
        setTemperature(65);
        setShadingRatio(0);
        break;
      case 'monsoon':
        setIrradiance(250);
        setTemperature(28);
        setShadingRatio(0);
        break;
      case 'ladakh':
        setIrradiance(1150);
        setTemperature(-25);
        setShadingRatio(0);
        break;
      case 'shading':
        setIrradiance(900);
        setTemperature(40);
        setShadingRatio(0.4);
        break;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full text-slate-100">
      {/* Quick Presets Bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl">
        <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
          <span>⚡</span> Real-World Scenarios:
        </span>
        <button
          onClick={() => applyPreset('stc')}
          className="px-3 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          Standard STC (1000W/m², 25°C)
        </button>
        <button
          onClick={() => applyPreset('rajasthan')}
          className="px-3 py-1 text-xs rounded-lg bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 transition"
        >
          Thar Desert Heat (65°C Heatwave)
        </button>
        <button
          onClick={() => applyPreset('ladakh')}
          className="px-3 py-1 text-xs rounded-lg bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-800/60 transition"
        >
          Ladakh Border Post (-25°C Voc Spurt)
        </button>
        <button
          onClick={() => applyPreset('monsoon')}
          className="px-3 py-1 text-xs rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
        >
          Monsoon Overcast (250W/m²)
        </button>
        <button
          onClick={() => applyPreset('shading')}
          className="px-3 py-1 text-xs rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 transition"
        >
          Tree Shading (40% Partial Shade)
        </button>
      </div>

      {/* Main Grid: Controls vs Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <span className="text-amber-400">⚙</span> PV & MPPT Simulator Parameters
            </h3>
            <p className="text-xs text-slate-400">
              Tune environmental operating conditions and converter parameters
            </p>
          </div>

          {/* Irradiance Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="irradiance-slider" className="font-medium text-slate-300">
                Solar Irradiance (G)
              </label>
              <span className="font-mono text-amber-400 font-bold">{irradiance} W/m²</span>
            </div>
            <input
              id="irradiance-slider"
              type="range"
              min="100"
              max="1300"
              step="25"
              value={irradiance}
              onChange={(e) => setIrradiance(Number(e.target.value))}
              className="accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>100 W/m² (Dusk)</span>
              <span>1000 W/m² (STC)</span>
              <span>1300 W/m² (Himalayan Peak)</span>
            </div>
          </div>

          {/* Cell Temperature Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="temp-slider" className="font-medium text-slate-300">
                Cell Operating Temperature (T_cell)
              </label>
              <span className={`font-mono font-bold ${temperature < 0 ? 'text-sky-400' : temperature > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {temperature}°C
              </span>
            </div>
            <input
              id="temp-slider"
              type="range"
              min="-35"
              max="75"
              step="1"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-35°C (Ladakh Winter)</span>
              <span>25°C (STC)</span>
              <span>+75°C (Rajasthan Metal Roof)</span>
            </div>
          </div>

          {/* Partial Shading Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="shading-slider" className="font-medium text-slate-300">
                Partial Shading Ratio
              </label>
              <span className="font-mono text-rose-400 font-bold">{Math.round(shadingRatio * 100)}%</span>
            </div>
            <input
              id="shading-slider"
              type="range"
              min="0"
              max="0.7"
              step="0.05"
              value={shadingRatio}
              onChange={(e) => setShadingRatio(Number(e.target.value))}
              className="accent-rose-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (Uniform Sun)</span>
              <span>35% (Canopy Shadow)</span>
              <span>70% (Severe Bypass)</span>
            </div>
          </div>

          {/* MPPT Algorithm Selection */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="algorithm-select" className="text-xs font-medium text-slate-300">
              MPPT Tracking Algorithm
            </label>
            <select
              id="algorithm-select"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as MpptAlgorithm)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="incremental_conductance">Incremental Conductance (INC) - Fast & Zero Hunt</option>
              <option value="perturb_and_observe">Perturb and Observe (P&O) - Standard Microcontroller</option>
              <option value="global_sweep_partial_shading">Global Sweep MPPT - Multi-Peak Shading Tracker</option>
              <option value="fractional_voc">Fractional Voc (0.80 x Voc) - Analog Low Cost</option>
            </select>
          </div>

          {/* Battery Bank Type */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="battery-select" className="text-xs font-medium text-slate-300">
              Target Battery Bank Chemistry & Voltage
            </label>
            <select
              id="battery-select"
              value={batteryType}
              onChange={(e) => setBatteryType(e.target.value as BatteryBankType)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="lfp_48v">48V Lithium Iron Phosphate (16S LFP - Telecom & Home ESS)</option>
              <option value="lfp_24v">24V Lithium Iron Phosphate (8S LFP - Industrial Backup)</option>
              <option value="lfp_12v">12V Lithium Iron Phosphate (4S LFP - Micro Balcony & Kiosk)</option>
              <option value="lead_acid_48v">48V Tubular Flooded Lead-Acid (Deep Cycle Inverter)</option>
              <option value="lead_acid_12v">12V Automotive / Starter Lead-Acid</option>
            </select>
          </div>

          {/* Converter Switching Frequency */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="fsw-slider" className="font-medium text-slate-300">
                Converter Switching Frequency (f_sw)
              </label>
              <span className="font-mono text-sky-400 font-bold">{switchingFreqKhz} kHz</span>
            </div>
            <input
              id="fsw-slider"
              type="range"
              min="50"
              max="300"
              step="10"
              value={switchingFreqKhz}
              onChange={(e) => setSwitchingFreqKhz(Number(e.target.value))}
              className="accent-sky-400 cursor-pointer"
            />
          </div>

          {/* Passive Component Calculations */}
          <div className="bg-slate-950/80 rounded-lg p-3.5 border border-slate-800 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Synchronous Buck Converter Sizing
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Duty Cycle (D):</span>
                <span className="font-mono font-bold text-slate-100">
                  {(simResult.converterDutyCycle * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Charge Current (I_out):</span>
                <span className="font-mono font-bold text-sky-400">
                  {simResult.batteryCurrentA} A
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Min Inductor (L):</span>
                <span className="font-mono font-bold text-emerald-400">
                  {simResult.converterInductanceMicroH} μH
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Output Cap (C_out):</span>
                <span className="font-mono font-bold text-emerald-400">
                  {simResult.converterOutputCapacitanceMicroF} μF
                </span>
              </div>
            </div>

            <div className="mt-1 pt-2 border-t border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">Charging Stage:</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${
                simResult.batteryChargingStage === 'bulk_cc'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : simResult.batteryChargingStage === 'absorption_cv'
                  ? 'bg-sky-950 text-sky-300 border border-sky-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {simResult.batteryChargingStage.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Visualizers Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <IvPvCurveVisualizer
            ivCurve={simResult.ivCurve}
            pvCurve={simResult.pvCurve}
            vmppActualV={simResult.vmppActualV}
            imppActualA={simResult.imppActualA}
            pmppActualW={simResult.pmppActualW}
            vocActualV={simResult.vocActualV}
            iscActualA={simResult.iscActualA}
            fillFactor={simResult.fillFactor}
          />

          <MpptTrackerSimulator
            algorithm={algorithm}
            vmppActualV={simResult.vmppActualV}
            pmppActualW={simResult.pmppActualW}
            trackingEfficiencyPercent={simResult.trackingEfficiencyPercent}
            pvCurve={simResult.pvCurve}
          />
        </div>
      </div>
    </div>
  );
}
