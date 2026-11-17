'use client';

import { useState, useMemo } from 'react';
import type { MotorParameters, FeedbackSensorType } from '@hackerland/core';
import { simulateMotorFoc } from '@hackerland/core';
import { SvpwmHexagonVisualizer } from './svpwm-hexagon-visualizer';
import { FocWaveformVisualizer } from './foc-waveform-visualizer';

interface MotorFocWorkbenchProps {
  initialMotor: MotorParameters;
  initialSpeedRpm?: number;
  initialTorqueNm?: number;
  initialPwmKhz?: number;
  initialDcBusV?: number;
  initialSensor?: FeedbackSensorType;
}

export function MotorFocWorkbench({
  initialMotor,
  initialSpeedRpm = 3200,
  initialTorqueNm = 14,
  initialPwmKhz = 20,
  initialDcBusV = 51.2,
  initialSensor = 'absolute_magnetic_as5047',
}: MotorFocWorkbenchProps) {
  const [speedRpm, setSpeedRpm] = useState<number>(initialSpeedRpm);
  const [torqueNm, setTorqueNm] = useState<number>(initialTorqueNm);
  const [pwmKhz, setPwmKhz] = useState<number>(initialPwmKhz);
  const [dcBusV, setDcBusV] = useState<number>(initialDcBusV);
  const [enableFieldWeakening, setEnableFieldWeakening] = useState<boolean>(false);
  const [currentLoopBwHz, setCurrentLoopBwHz] = useState<number>(1200);

  // Compute FOC simulation result
  const simResult = useMemo(() => {
    return simulateMotorFoc({
      targetSpeedRpm: speedRpm,
      loadTorqueNm: torqueNm,
      motor: initialMotor,
      pwmFrequencyKhz: pwmKhz,
      dcBusVoltageV: dcBusV,
      enableFieldWeakening,
      feedbackSensor: initialSensor,
      currentLoopBandwidthHz: currentLoopBwHz,
    });
  }, [speedRpm, torqueNm, initialMotor, pwmKhz, dcBusV, enableFieldWeakening, initialSensor, currentLoopBwHz]);

  const applyPreset = (preset: 'ather_city' | 'ola_hyper' | 'field_weakening' | 'kusum_pump' | 'euler_climb') => {
    switch (preset) {
      case 'ather_city':
        setSpeedRpm(3500);
        setTorqueNm(16);
        setDcBusV(51.2);
        setPwmKhz(20);
        setEnableFieldWeakening(false);
        break;
      case 'ola_hyper':
        setSpeedRpm(5200);
        setTorqueNm(24);
        setDcBusV(57.6);
        setPwmKhz(24);
        setEnableFieldWeakening(false);
        break;
      case 'field_weakening':
        setSpeedRpm(7500);
        setTorqueNm(9);
        setDcBusV(51.2);
        setPwmKhz(20);
        setEnableFieldWeakening(true);
        break;
      case 'kusum_pump':
        setSpeedRpm(2900);
        setTorqueNm(7);
        setDcBusV(310);
        setPwmKhz(16);
        setEnableFieldWeakening(false);
        break;
      case 'euler_climb':
        setSpeedRpm(2200);
        setTorqueNm(55);
        setDcBusV(72);
        setPwmKhz(16);
        setEnableFieldWeakening(false);
        break;
    }
  };

  const mechanicalHp = Math.round((simResult.mechanicalPowerWatts / 745.7) * 10) / 10;

  return (
    <div className="flex flex-col gap-6 w-full text-slate-100">
      {/* Quick Presets Bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl">
        <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
          <span>⚡</span> Operating Modes:
        </span>
        <button
          onClick={() => applyPreset('ather_city')}
          className="px-3 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          Ather 450X City (3500 RPM / 16 Nm)
        </button>
        <button
          onClick={() => applyPreset('ola_hyper')}
          className="px-3 py-1 text-xs rounded-lg bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 transition"
        >
          Ola S1 Pro Hyper (5200 RPM / 24 Nm)
        </button>
        <button
          onClick={() => applyPreset('field_weakening')}
          className="px-3 py-1 text-xs rounded-lg bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-800/60 transition"
        >
          Field Weakening Overdrive (7500 RPM)
        </button>
        <button
          onClick={() => applyPreset('euler_climb')}
          className="px-3 py-1 text-xs rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 transition"
        >
          Euler HiLoad 21% Climb (55 Nm Peak)
        </button>
        <button
          onClick={() => applyPreset('kusum_pump')}
          className="px-3 py-1 text-xs rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 transition"
        >
          PM-KUSUM Agri Pump (310V Solar)
        </button>
      </div>

      {/* Main Grid: Controls vs Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <span className="text-emerald-400">⚙</span> FOC Control &amp; Inverter Parameters
            </h3>
            <p className="text-xs text-slate-400">
              Live Park/Clarke transformations, MTPA reluctance angle and SVPWM modulation
            </p>
          </div>

          {/* Speed Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="speed-slider" className="font-medium text-slate-300">
                Target Mechanical Speed
              </label>
              <span className="font-mono text-emerald-400 font-bold">{speedRpm} RPM</span>
            </div>
            <input
              id="speed-slider"
              type="range"
              min="200"
              max={initialMotor.maxSpeedRpm}
              step="50"
              value={speedRpm}
              onChange={(e) => setSpeedRpm(Number(e.target.value))}
              className="accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>200 RPM</span>
              <span>Rated: {initialMotor.ratedSpeedRpm} RPM</span>
              <span>Max: {initialMotor.maxSpeedRpm} RPM</span>
            </div>
          </div>

          {/* Torque Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="torque-slider" className="font-medium text-slate-300">
                Load Torque (T_L)
              </label>
              <span className="font-mono text-amber-400 font-bold">{torqueNm} N·m</span>
            </div>
            <input
              id="torque-slider"
              type="range"
              min="0"
              max={initialMotor.peakTorqueNm}
              step="1"
              value={torqueNm}
              onChange={(e) => setTorqueNm(Number(e.target.value))}
              className="accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 N·m (No-Load)</span>
              <span>Rated: {initialMotor.ratedTorqueNm} N·m</span>
              <span>Peak: {initialMotor.peakTorqueNm} N·m</span>
            </div>
          </div>

          {/* DC Bus Voltage Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="dc-bus-slider" className="font-medium text-slate-300">
                DC Bus Voltage (V_dc)
              </label>
              <span className="font-mono text-sky-400 font-bold">{dcBusV} V</span>
            </div>
            <input
              id="dc-bus-slider"
              type="range"
              min="24"
              max="400"
              step="2"
              value={dcBusV}
              onChange={(e) => setDcBusV(Number(e.target.value))}
              className="accent-sky-400 cursor-pointer"
            />
          </div>

          {/* PWM Switching Frequency Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="pwm-slider" className="font-medium text-slate-300">
                PWM Switching Frequency (f_pwm)
              </label>
              <span className="font-mono text-slate-200 font-bold">{pwmKhz} kHz</span>
            </div>
            <input
              id="pwm-slider"
              type="range"
              min="10"
              max="40"
              step="2"
              value={pwmKhz}
              onChange={(e) => setPwmKhz(Number(e.target.value))}
              className="accent-slate-400 cursor-pointer"
            />
          </div>

          {/* Field Weakening Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">
                Flux / Field Weakening Overdrive
              </span>
              <span className="text-[11px] text-slate-400">
                Injects negative I_d current to extend top speed past back-EMF limit
              </span>
            </div>
            <input
              type="checkbox"
              id="field-weakening-toggle"
              checked={enableFieldWeakening}
              onChange={(e) => setEnableFieldWeakening(e.target.checked)}
              className="w-4 h-4 accent-sky-400 cursor-pointer"
            />
          </div>

          {/* Current Loop Bandwidth */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="bw-slider" className="font-medium text-slate-300">
                PI Current Loop Bandwidth (f_bw)
              </label>
              <span className="font-mono text-violet-400 font-bold">{currentLoopBwHz} Hz</span>
            </div>
            <input
              id="bw-slider"
              type="range"
              min="400"
              max="2500"
              step="100"
              value={currentLoopBwHz}
              onChange={(e) => setCurrentLoopBwHz(Number(e.target.value))}
              className="accent-violet-400 cursor-pointer"
            />
          </div>

          {/* Computed Controller & Electrical Gains */}
          <div className="bg-slate-950/80 rounded-lg p-3.5 border border-slate-800 flex flex-col gap-3 font-mono text-xs">
            <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              PI Controller Gains &amp; Electrical States
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block">K_p (Proportional):</span>
                <span className="font-bold text-slate-100">{simResult.kpGain} V/A</span>
              </div>
              <div>
                <span className="text-slate-400 block">K_i (Integral):</span>
                <span className="font-bold text-slate-100">{simResult.kiGain} V/(A·s)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Back-EMF (Peak):</span>
                <span className="font-bold text-amber-300">{simResult.backEmfPeakV} V</span>
              </div>
              <div>
                <span className="text-slate-400 block">Modulation Index:</span>
                <span className={`font-bold ${simResult.modulationIndex > 1.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {simResult.modulationIndex}
                </span>
              </div>
            </div>

            {simResult.reluctanceTorqueNm > 0 && (
              <div className="mt-1 pt-2 border-t border-slate-800 text-[11px] text-amber-300 flex justify-between items-center">
                <span>Reluctance Torque Boost:</span>
                <span className="font-bold">
                  +{simResult.reluctanceTorqueNm} N·m ({Math.round((simResult.reluctanceTorqueNm / simResult.totalTorqueNm) * 100)}%)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Visualizers Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Key Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5">
              <span className="text-slate-400 text-[11px] block">Shaft Power</span>
              <span className="font-mono text-sm font-bold text-emerald-400">
                {(simResult.mechanicalPowerWatts / 1000).toFixed(2)} kW <span className="text-slate-400 text-xs">({mechanicalHp} HP)</span>
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5">
              <span className="text-slate-400 text-[11px] block">Total Torque</span>
              <span className="font-mono text-sm font-bold text-amber-300">
                {simResult.totalTorqueNm} N·m
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5">
              <span className="text-slate-400 text-[11px] block">Phase RMS Current</span>
              <span className="font-mono text-sm font-bold text-sky-400">
                {simResult.phaseCurrentRmsA} A
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5">
              <span className="text-slate-400 text-[11px] block">Inverter Efficiency</span>
              <span className="font-mono text-sm font-bold text-emerald-300">
                {simResult.inverterEfficiencyPercent}%
              </span>
            </div>
          </div>

          <SvpwmHexagonVisualizer
            currentSector={simResult.currentSector}
            modulationIndex={simResult.modulationIndex}
            dwellTimeT1Us={simResult.dwellTimeT1Us}
            dwellTimeT2Us={simResult.dwellTimeT2Us}
            dwellTimeT0Us={simResult.dwellTimeT0Us}
            dcBusVoltageV={dcBusV}
          />

          <FocWaveformVisualizer
            waveforms={simResult.waveforms}
            idCurrentA={simResult.idCurrentA}
            iqCurrentA={simResult.iqCurrentA}
            phaseCurrentRmsA={simResult.phaseCurrentRmsA}
          />
        </div>
      </div>
    </div>
  );
}
