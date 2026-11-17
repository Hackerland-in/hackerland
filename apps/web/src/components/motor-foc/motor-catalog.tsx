'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { MotorFocProject, MotorTopology, FeedbackSensorType } from '@hackerland/core';
import { filterMotorFocProjects } from '@hackerland/core';
import { MotorFocWorkbench } from './motor-foc-workbench';

interface MotorCatalogProps {
  initialProjects: MotorFocProject[];
}

export function MotorCatalog({ initialProjects }: MotorCatalogProps) {
  const [search, setSearch] = useState('');
  const [selectedTopology, setSelectedTopology] = useState<string>('all');
  const [selectedSensor, setSelectedSensor] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'presets' | 'workbench'>('presets');

  const filteredProjects = filterMotorFocProjects(initialProjects, {
    topology: selectedTopology !== 'all' ? (selectedTopology as MotorTopology) : undefined,
    sensorType: selectedSensor !== 'all' ? (selectedSensor as FeedbackSensorType) : undefined,
    search: search.trim() !== '' ? search.trim() : undefined,
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            Clarke / Park Transforms &amp; Space Vector PWM (SVPWM)
          </span>
          <span className="text-xs text-slate-500 font-mono">
            ARAI AIS-041 &amp; PM-KUSUM Powertrain Benchmarks
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          BLDC &amp; PMSM Field-Oriented Control (FOC) Simulator
        </h1>
        <p className="text-base text-slate-400 max-w-3xl leading-relaxed">
          Simulate rotor-flux aligned Field-Oriented Control (FOC) with Clarke ($\alpha\beta$) and Park ($dq$) coordinate transformations. Model Space Vector PWM 8-state switching hexagons, MTPA reluctance torque saliency ($L_q &gt; L_d$), field-weakening high-speed overdrive, and PI current loop bandwidth synthesis across electric two-wheelers, heavy 3-wheelers, solar agricultural pumps, and drone ESCs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'presets'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Curated Indian Powertrains ({initialProjects.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('workbench')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'workbench'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Live Universal FOC Workbench
        </button>
      </div>

      {activeTab === 'presets' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by vehicle, motor model, Ather, Ola, pump, or test lab..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 text-xs font-mono"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <select
                aria-label="Filter by Motor Topology"
                value={selectedTopology}
                onChange={(e) => setSelectedTopology(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-400 transition"
              >
                <option value="all">All Topologies</option>
                <option value="interior_pmsm">Interior PMSM (IPM)</option>
                <option value="surface_pmsm">Surface PMSM (SPMSM)</option>
                <option value="bldc_outrunner">BLDC Outrunner</option>
                <option value="bldc_inrunner">BLDC Inrunner</option>
              </select>

              <select
                aria-label="Filter by Feedback Sensor"
                value={selectedSensor}
                onChange={(e) => setSelectedSensor(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-400 transition"
              >
                <option value="all">All Sensors</option>
                <option value="absolute_magnetic_as5047">Magnetic Angle (AS5047)</option>
                <option value="sensorless_sliding_mode">Sensorless Sliding Mode</option>
                <option value="quadrature_encoder">Quadrature Encoder</option>
                <option value="hall_sensors_120deg">120° Hall Sensors</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/motor-foc/${project.slug}`}
                className="group bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {(project.peakPowerWatts / 1000).toFixed(1)} kW
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {project.motorParams.topology.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project.vehicleApplication}
                  </p>

                  <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/80 font-mono text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Rated Speed / Torque:</span>
                      <span>{project.motorParams.ratedSpeedRpm} RPM / {project.motorParams.ratedTorqueNm} Nm</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">DC Bus / Current:</span>
                      <span className="text-sky-400">{project.motorParams.dcBusVoltageV}V / {project.motorParams.maxInverterCurrentA}A</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Sensor:</span>
                      <span className="text-amber-400">{project.feedbackSensor.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/60 mt-4 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 truncate max-w-[190px]">
                    {project.indianContextFacility.split('-')[0]?.trim()}
                  </span>
                  <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">
                    Inspect FOC Stack →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 font-mono text-xs">
              No matching motor FOC projects found for query &quot;{search}&quot;. Try resetting filters.
            </div>
          )}
        </div>
      )}

      {activeTab === 'workbench' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 leading-relaxed font-mono">
            Defaulted to 6 kW Interior PMSM motor (4 pole pairs, 51.2V DC bus). Adjust target speed, load torque, and PWM switching frequency to inspect real-time Clarke/Park transformations and Space Vector PWM sectors.
          </div>
          <MotorFocWorkbench
            initialMotor={{
              motorModel: 'Ather 450X 6kW IPM Traction Motor',
              topology: 'interior_pmsm',
              polePairs: 4,
              statorResistanceOhm: 0.038,
              dAxisInductanceMilliH: 0.22,
              qAxisInductanceMilliH: 0.36,
              permanentMagnetFluxWb: 0.032,
              ratedSpeedRpm: 4500,
              maxSpeedRpm: 8000,
              ratedTorqueNm: 26,
              peakTorqueNm: 40,
              dcBusVoltageV: 51.2,
              maxInverterCurrentA: 160,
            }}
          />
        </div>
      )}
    </div>
  );
}
