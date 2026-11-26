'use client';

import { useState, useMemo, useEffect } from 'react';
import type { MotorParameters, FeedbackSensorType } from '@hackerland/core';
import { simulateMotorFoc } from '@hackerland/core';
import { useLabShell } from '@/components/labs/full-screen-lab-shell';
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
  const labShell = useLabShell();

  const [speedRpm, setSpeedRpm] = useState<number>(initialSpeedRpm);
  const [torqueNm, setTorqueNm] = useState<number>(initialTorqueNm);
  const [pwmKhz, setPwmKhz] = useState<number>(initialPwmKhz);
  const [dcBusV, setDcBusV] = useState<number>(initialDcBusV);
  const [enableFieldWeakening, setEnableFieldWeakening] = useState<boolean>(false);
  const [currentLoopBwHz, setCurrentLoopBwHz] = useState<number>(1200);

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

  useEffect(() => {
    if (!labShell) return;
    labShell.registerSnapshotHandlers({
      getSnapshot: () => ({
        title: `FOC Drive (${speedRpm} RPM / ${torqueNm} Nm)`,
        summary: `DcBus ${dcBusV}V, f_pwm ${pwmKhz}kHz, eff ${simResult.inverterEfficiencyPercent}%, m=${simResult.modulationIndex}`,
        tags: ['motor-foc', enableFieldWeakening ? 'field-weakening' : 'mtpa'],
        payload: {
          speedRpm,
          torqueNm,
          pwmKhz,
          dcBusV,
          enableFieldWeakening,
          currentLoopBwHz,
        },
      }),
      onLoad: (ws) => {
        const p = ws.payload ?? {};
        if (typeof p.speedRpm === 'number') setSpeedRpm(p.speedRpm);
        if (typeof p.torqueNm === 'number') setTorqueNm(p.torqueNm);
        if (typeof p.pwmKhz === 'number') setPwmKhz(p.pwmKhz);
        if (typeof p.dcBusV === 'number') setDcBusV(p.dcBusV);
        if (typeof p.enableFieldWeakening === 'boolean') setEnableFieldWeakening(p.enableFieldWeakening);
        if (typeof p.currentLoopBwHz === 'number') setCurrentLoopBwHz(p.currentLoopBwHz);
      },
    });
  }, [
    labShell,
    speedRpm,
    torqueNm,
    pwmKhz,
    dcBusV,
    enableFieldWeakening,
    currentLoopBwHz,
    simResult.inverterEfficiencyPercent,
    simResult.modulationIndex,
  ]);

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
    <div className="flex flex-col gap-6 w-full text-fg">
      {/* Quick Presets Bar */}
      <div className="flex flex-wrap items-center gap-2 p-3.5 bg-surface-1 border border-hairline rounded-2xl shadow-xs">
        <span className="text-xs font-semibold text-fg-muted mr-2 flex items-center gap-1.5">
          <span className="text-accent-fg">⚡</span> Operating Modes:
        </span>
        <button
          type="button"
          onClick={() => applyPreset('ather_city')}
          className="px-3 py-1.5 text-xs rounded-xl bg-sunken hover:bg-accent-soft hover:text-accent-fg hover:border-accent/30 text-fg border border-hairline transition cursor-pointer"
        >
          Ather 450X City (3500 RPM / 16 Nm)
        </button>
        <button
          type="button"
          onClick={() => applyPreset('ola_hyper')}
          className="px-3 py-1.5 text-xs rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition cursor-pointer"
        >
          Ola S1 Pro Hyper (5200 RPM / 24 Nm)
        </button>
        <button
          type="button"
          onClick={() => applyPreset('field_weakening')}
          className="px-3 py-1.5 text-xs rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition cursor-pointer"
        >
          Field Weakening Overdrive (7500 RPM)
        </button>
        <button
          type="button"
          onClick={() => applyPreset('euler_climb')}
          className="px-3 py-1.5 text-xs rounded-xl bg-accent-soft hover:bg-accent/15 text-accent-fg border border-accent/25 transition cursor-pointer"
        >
          Euler HiLoad 21% Climb (55 Nm Peak)
        </button>
        <button
          type="button"
          onClick={() => applyPreset('kusum_pump')}
          className="px-3 py-1.5 text-xs rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition cursor-pointer"
        >
          PM-KUSUM Agri Pump (310V Solar)
        </button>
      </div>

      {/* Main Grid: Controls vs Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-surface-1 border border-hairline rounded-2xl p-5 shadow-xs flex flex-col gap-5">
          <div className="border-b border-hairline pb-3">
            <h3 className="font-display text-base font-semibold text-fg flex items-center gap-2">
              <span className="text-accent-fg">⚙</span> FOC Control &amp; Inverter Parameters
            </h3>
            <p className="text-xs text-fg-muted mt-0.5">
              Live Park/Clarke transformations, MTPA reluctance angle and SVPWM modulation
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="speed-slider" className="font-medium text-fg-muted">
                Target Mechanical Speed
              </label>
              <span className="font-mono text-accent-fg font-bold">{speedRpm} RPM</span>
            </div>
            <input
              id="speed-slider"
              type="range"
              min="200"
              max={initialMotor.maxSpeedRpm}
              step="50"
              value={speedRpm}
              onChange={(e) => setSpeedRpm(Number(e.target.value))}
              className="accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-fg-subtle font-mono">
              <span>200 RPM</span>
              <span>Rated: {initialMotor.ratedSpeedRpm} RPM</span>
              <span>Max: {initialMotor.maxSpeedRpm} RPM</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="torque-slider" className="font-medium text-fg-muted">
                Load Torque (T_L)
              </label>
              <span className="font-mono text-amber-700 font-bold">{torqueNm} N·m</span>
            </div>
            <input
              id="torque-slider"
              type="range"
              min="0"
              max={initialMotor.peakTorqueNm}
              step="1"
              value={torqueNm}
              onChange={(e) => setTorqueNm(Number(e.target.value))}
              className="accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-fg-subtle font-mono">
              <span>0 N·m (No-Load)</span>
              <span>Rated: {initialMotor.ratedTorqueNm} N·m</span>
              <span>Peak: {initialMotor.peakTorqueNm} N·m</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="dc-bus-slider" className="font-medium text-fg-muted">
                DC Bus Voltage (V_dc)
              </label>
              <span className="font-mono text-sky-700 font-bold">{dcBusV} V</span>
            </div>
            <input
              id="dc-bus-slider"
              type="range"
              min="24"
              max="400"
              step="2"
              value={dcBusV}
              onChange={(e) => setDcBusV(Number(e.target.value))}
              className="accent-accent cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="pwm-slider" className="font-medium text-fg-muted">
                PWM Switching Frequency (f_pwm)
              </label>
              <span className="font-mono text-fg font-bold">{pwmKhz} kHz</span>
            </div>
            <input
              id="pwm-slider"
              type="range"
              min="10"
              max="40"
              step="2"
              value={pwmKhz}
              onChange={(e) => setPwmKhz(Number(e.target.value))}
              className="accent-accent cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-sunken rounded-xl border border-hairline">
            <div>
              <span className="text-xs font-semibold text-fg block">
                Flux / Field Weakening Overdrive
              </span>
              <span className="text-[11px] text-fg-muted">
                Injects negative I_d current to extend top speed past back-EMF limit
              </span>
            </div>
            <input
              type="checkbox"
              id="field-weakening-toggle"
              checked={enableFieldWeakening}
              onChange={(e) => setEnableFieldWeakening(e.target.checked)}
              className="w-4 h-4 accent-accent cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="bw-slider" className="font-medium text-fg-muted">
                PI Current Loop Bandwidth (f_bw)
              </label>
              <span className="font-mono text-violet-700 font-bold">{currentLoopBwHz} Hz</span>
            </div>
            <input
              id="bw-slider"
              type="range"
              min="400"
              max="2500"
              step="100"
              value={currentLoopBwHz}
              onChange={(e) => setCurrentLoopBwHz(Number(e.target.value))}
              className="accent-accent cursor-pointer"
            />
          </div>

          <div className="bg-sunken rounded-xl p-3.5 border border-hairline flex flex-col gap-3 font-mono text-xs">
            <h4 className="text-[11px] font-bold text-accent-fg uppercase tracking-wider">
              PI Controller Gains &amp; Electrical States
            </h4>
            <div className="grid grid-cols-2 gap-2.5 text-[11px]">
              <div>
                <span className="text-fg-subtle block">K_p (Proportional):</span>
                <span className="font-bold text-fg">{simResult.kpGain} V/A</span>
              </div>
              <div>
                <span className="text-fg-subtle block">K_i (Integral):</span>
                <span className="font-bold text-fg">{simResult.kiGain} V/(A·s)</span>
              </div>
              <div>
                <span className="text-fg-subtle block">Back-EMF (Peak):</span>
                <span className="font-bold text-amber-700">{simResult.backEmfPeakV} V</span>
              </div>
              <div>
                <span className="text-fg-subtle block">Modulation Index:</span>
                <span className={`font-bold ${simResult.modulationIndex > 1.0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {simResult.modulationIndex}
                </span>
              </div>
            </div>

            {simResult.reluctanceTorqueNm > 0 && (
              <div className="mt-1 pt-2 border-t border-hairline text-[11px] text-amber-700 flex justify-between items-center">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-surface-1 border border-hairline rounded-xl p-3 shadow-xs">
              <span className="text-fg-subtle text-[11px] block">Shaft Power</span>
              <span className="font-mono text-sm font-bold text-accent-fg">
                {(simResult.mechanicalPowerWatts / 1000).toFixed(2)} kW <span className="text-fg-subtle text-xs">({mechanicalHp} HP)</span>
              </span>
            </div>
            <div className="bg-surface-1 border border-hairline rounded-xl p-3 shadow-xs">
              <span className="text-fg-subtle text-[11px] block">Total Torque</span>
              <span className="font-mono text-sm font-bold text-amber-700">
                {simResult.totalTorqueNm} N·m
              </span>
            </div>
            <div className="bg-surface-1 border border-hairline rounded-xl p-3 shadow-xs">
              <span className="text-fg-subtle text-[11px] block">Phase RMS Current</span>
              <span className="font-mono text-sm font-bold text-sky-700">
                {simResult.phaseCurrentRmsA} A
              </span>
            </div>
            <div className="bg-surface-1 border border-hairline rounded-xl p-3 shadow-xs">
              <span className="text-fg-subtle text-[11px] block">Inverter Efficiency</span>
              <span className="font-mono text-sm font-bold text-emerald-700">
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
