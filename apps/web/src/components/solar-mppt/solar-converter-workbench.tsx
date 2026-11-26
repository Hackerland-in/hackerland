'use client';

import { useState, useMemo, useEffect } from 'react';
import type {
  SolarPvPanelSpecs,
  MpptAlgorithm,
  BatteryBankType,
} from '@hackerland/core';
import { simulateSolarMppt } from '@hackerland/core';
import { useLabShell } from '@/components/labs/full-screen-lab-shell';
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
  const labShell = useLabShell();

  const [irradiance, setIrradiance] = useState<number>(initialIrradiance);
  const [temperature, setTemperature] = useState<number>(initialTemperature);
  const [shadingRatio, setShadingRatio] = useState<number>(0);
  const [algorithm, setAlgorithm] = useState<MpptAlgorithm>(initialAlgorithm);
  const [batteryType, setBatteryType] = useState<BatteryBankType>(initialBattery);
  const [switchingFreqKhz, setSwitchingFreqKhz] = useState<number>(150);

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

  useEffect(() => {
    if (!labShell) return;
    labShell.registerSnapshotHandlers({
      getSnapshot: () => ({
        title: `Solar MPPT (${irradiance}W/m², ${temperature}°C)`,
        summary: `P_mpp ${simResult.pmppActualW}W @ ${simResult.vmppActualV}V, ${algorithm}, L=${simResult.converterInductanceMicroH}µH`,
        tags: ['solar-mppt', algorithm, batteryType],
        payload: {
          irradiance,
          temperature,
          shadingRatio,
          algorithm,
          batteryType,
          switchingFreqKhz,
        },
      }),
      onLoad: (ws) => {
        const p = ws.payload ?? {};
        if (typeof p.irradiance === 'number') setIrradiance(p.irradiance);
        if (typeof p.temperature === 'number') setTemperature(p.temperature);
        if (typeof p.shadingRatio === 'number') setShadingRatio(p.shadingRatio);
        if (typeof p.algorithm === 'string') setAlgorithm(p.algorithm as MpptAlgorithm);
        if (typeof p.batteryType === 'string') setBatteryType(p.batteryType as BatteryBankType);
        if (typeof p.switchingFreqKhz === 'number') setSwitchingFreqKhz(p.switchingFreqKhz);
      },
    });
  }, [
    labShell,
    irradiance,
    temperature,
    shadingRatio,
    algorithm,
    batteryType,
    switchingFreqKhz,
    simResult.pmppActualW,
    simResult.vmppActualV,
    simResult.converterInductanceMicroH,
  ]);

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
    <div className="flex flex-col gap-6 w-full text-fg">
      {/* Quick Presets Bar */}
      <div className="flex flex-wrap items-center gap-2 p-3.5 bg-surface-1 border border-hairline rounded-2xl shadow-xs">
        <span className="text-xs font-semibold text-fg-muted mr-2 flex items-center gap-1.5">
          <span className="text-accent-fg">⚡</span> Real-World Scenarios:
        </span>
        <button
          type="button"
          onClick={() => applyPreset('stc')}
          className="px-3 py-1.5 text-xs rounded-xl bg-sunken hover:bg-accent-soft hover:text-accent-fg hover:border-accent/30 text-fg border border-hairline transition cursor-pointer"
        >
          Standard STC (1000W/m², 25°C)
        </button>
        <button
          type="button"
          onClick={() => applyPreset('rajasthan')}
          className="px-3 py-1.5 text-xs rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition cursor-pointer"
        >
          Thar Desert Heat (65°C Heatwave)
        </button>
        <button
          type="button"
          onClick={() => applyPreset('ladakh')}
          className="px-3 py-1.5 text-xs rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition cursor-pointer"
        >
          Ladakh Border Post (-25°C Voc Spurt)
        </button>
        <button
          type="button"
          onClick={() => applyPreset('monsoon')}
          className="px-3 py-1.5 text-xs rounded-xl bg-surface-2 hover:bg-sunken text-fg-muted border border-hairline transition cursor-pointer"
        >
          Monsoon Overcast (250W/m²)
        </button>
        <button
          type="button"
          onClick={() => applyPreset('shading')}
          className="px-3 py-1.5 text-xs rounded-xl bg-accent-soft hover:bg-accent/15 text-accent-fg border border-accent/25 transition cursor-pointer"
        >
          Tree Shading (40% Partial Shade)
        </button>
      </div>

      {/* Main Grid: Controls vs Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-surface-1 border border-hairline rounded-2xl p-5 shadow-xs flex flex-col gap-5">
          <div className="border-b border-hairline pb-3">
            <h3 className="font-display text-base font-semibold text-fg flex items-center gap-2">
              <span className="text-accent-fg">⚙</span> PV &amp; MPPT Simulator Parameters
            </h3>
            <p className="text-xs text-fg-muted mt-0.5">
              Tune environmental operating conditions and converter parameters
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="irradiance-slider" className="font-medium text-fg-muted">
                Solar Irradiance (G)
              </label>
              <span className="font-mono text-amber-700 font-bold">{irradiance} W/m²</span>
            </div>
            <input
              id="irradiance-slider"
              type="range"
              min="100"
              max="1300"
              step="25"
              value={irradiance}
              onChange={(e) => setIrradiance(Number(e.target.value))}
              className="accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-fg-subtle font-mono">
              <span>100 W/m² (Dusk)</span>
              <span>1000 W/m² (STC)</span>
              <span>1300 W/m² (Himalayan Peak)</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="temp-slider" className="font-medium text-fg-muted">
                Cell Operating Temperature (T_cell)
              </label>
              <span
                className={`font-mono font-bold ${
                  temperature < 0
                    ? 'text-sky-700'
                    : temperature > 50
                      ? 'text-accent-fg'
                      : 'text-emerald-700'
                }`}
              >
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
              className="accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-fg-subtle font-mono">
              <span>-35°C (Ladakh Winter)</span>
              <span>25°C (STC)</span>
              <span>+75°C (Rajasthan Metal Roof)</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="shading-slider" className="font-medium text-fg-muted">
                Partial Shading Ratio
              </label>
              <span className="font-mono text-accent-fg font-bold">{Math.round(shadingRatio * 100)}%</span>
            </div>
            <input
              id="shading-slider"
              type="range"
              min="0"
              max="0.7"
              step="0.05"
              value={shadingRatio}
              onChange={(e) => setShadingRatio(Number(e.target.value))}
              className="accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-fg-subtle font-mono">
              <span>0% (Uniform Sun)</span>
              <span>35% (Canopy Shadow)</span>
              <span>70% (Severe Bypass)</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="algorithm-select" className="text-xs font-medium text-fg-muted">
              MPPT Tracking Algorithm
            </label>
            <select
              id="algorithm-select"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as MpptAlgorithm)}
              className="bg-sunken border border-line rounded-xl p-2.5 text-xs font-mono text-fg focus:outline-none focus:border-accent"
            >
              <option value="incremental_conductance">Incremental Conductance (INC) - Fast &amp; Zero Hunt</option>
              <option value="perturb_and_observe">Perturb and Observe (P&amp;O) - Standard Microcontroller</option>
              <option value="global_sweep_partial_shading">Global Sweep MPPT - Multi-Peak Shading Tracker</option>
              <option value="fractional_voc">Fractional Voc (0.80 x Voc) - Analog Low Cost</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="battery-select" className="text-xs font-medium text-fg-muted">
              Target Battery Bank Chemistry &amp; Voltage
            </label>
            <select
              id="battery-select"
              value={batteryType}
              onChange={(e) => setBatteryType(e.target.value as BatteryBankType)}
              className="bg-sunken border border-line rounded-xl p-2.5 text-xs font-mono text-fg focus:outline-none focus:border-accent"
            >
              <option value="lfp_48v">48V Lithium Iron Phosphate (16S LFP - Telecom &amp; Home ESS)</option>
              <option value="lfp_24v">24V Lithium Iron Phosphate (8S LFP - Industrial Backup)</option>
              <option value="lfp_12v">12V Lithium Iron Phosphate (4S LFP - Micro Balcony &amp; Kiosk)</option>
              <option value="lead_acid_48v">48V Tubular Flooded Lead-Acid (Deep Cycle Inverter)</option>
              <option value="lead_acid_12v">12V Automotive / Starter Lead-Acid</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="fsw-slider" className="font-medium text-fg-muted">
                Converter Switching Frequency (f_sw)
              </label>
              <span className="font-mono text-sky-700 font-bold">{switchingFreqKhz} kHz</span>
            </div>
            <input
              id="fsw-slider"
              type="range"
              min="50"
              max="300"
              step="10"
              value={switchingFreqKhz}
              onChange={(e) => setSwitchingFreqKhz(Number(e.target.value))}
              className="accent-accent cursor-pointer"
            />
          </div>

          <div className="bg-sunken rounded-xl p-3.5 border border-hairline flex flex-col gap-3">
            <h4 className="text-xs font-bold text-accent-fg uppercase tracking-wider font-mono">
              Synchronous Buck Converter Sizing
            </h4>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div>
                <span className="text-fg-subtle text-[11px] block">Duty Cycle (D):</span>
                <span className="font-mono font-bold text-fg">
                  {(simResult.converterDutyCycle * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-fg-subtle text-[11px] block">Charge Current (I_out):</span>
                <span className="font-mono font-bold text-sky-700">
                  {simResult.batteryCurrentA} A
                </span>
              </div>
              <div>
                <span className="text-fg-subtle text-[11px] block">Min Inductor (L):</span>
                <span className="font-mono font-bold text-emerald-700">
                  {simResult.converterInductanceMicroH} μH
                </span>
              </div>
              <div>
                <span className="text-fg-subtle text-[11px] block">Output Cap (C_out):</span>
                <span className="font-mono font-bold text-emerald-700">
                  {simResult.converterOutputCapacitanceMicroF} μF
                </span>
              </div>
            </div>

            <div className="mt-1 pt-2.5 border-t border-hairline text-xs flex items-center justify-between">
              <span className="text-fg-muted">Charging Stage:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase border ${
                  simResult.batteryChargingStage === 'bulk_cc'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : simResult.batteryChargingStage === 'absorption_cv'
                      ? 'bg-sky-50 text-sky-700 border-sky-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
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
