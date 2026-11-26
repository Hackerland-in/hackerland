'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge, Card, cn } from '@hackerland/ui';
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
    <div className="space-y-6 min-w-0">
      <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent" variant="outline">
            Clarke / Park Transforms &amp; Space Vector PWM (SVPWM)
          </Badge>
          <span className="text-body-xs text-fg-subtle font-mono">
            ARAI AIS-041 &amp; PM-KUSUM Powertrain Benchmarks
          </span>
        </div>
        <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
          BLDC &amp; PMSM Field-Oriented Control (FOC) Simulator
        </h1>
        <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
          Simulate rotor-flux aligned FOC with Clarke (αβ) and Park (dq) coordinate transforms, Space Vector PWM hexagons, MTPA reluctance torque (Lq &gt; Ld), and PI current loops.
        </p>
      </header>

      <div className="flex border-b border-hairline gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={cn(
            'pb-2.5 px-3 font-semibold border-b-2 transition-colors',
            activeTab === 'presets'
              ? 'border-accent text-accent-fg'
              : 'border-transparent text-fg-muted hover:text-fg',
          )}
        >
          Curated Indian Powertrains ({initialProjects.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('workbench')}
          className={cn(
            'pb-2.5 px-3 font-semibold border-b-2 transition-colors',
            activeTab === 'workbench'
              ? 'border-accent text-accent-fg'
              : 'border-transparent text-fg-muted hover:text-fg',
          )}
        >
          Live Universal FOC Workbench
        </button>
      </div>

      {activeTab === 'presets' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by vehicle, motor model, Ather, Ola, pump, or test lab..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface-1 border border-line rounded-xl px-4 py-2 text-body-xs font-mono text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-2 text-fg-subtle hover:text-fg text-xs font-mono"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                aria-label="Filter by Motor Topology"
                value={selectedTopology}
                onChange={(e) => setSelectedTopology(e.target.value)}
                className="bg-surface-1 border border-line rounded-xl px-3 py-2 text-body-xs font-mono text-fg focus:outline-none focus:border-accent"
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
                className="bg-surface-1 border border-line rounded-xl px-3 py-2 text-body-xs font-mono text-fg focus:outline-none focus:border-accent"
              >
                <option value="all">All Sensors</option>
                <option value="absolute_magnetic_as5047">Magnetic Angle (AS5047)</option>
                <option value="sensorless_sliding_mode">Sensorless Sliding Mode</option>
                <option value="quadrature_encoder">Quadrature Encoder</option>
                <option value="hall_sensors_120deg">120° Hall Sensors</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((project) => (
              <Link key={project.id} href={`/motor-foc/${project.slug}`} className="group block min-w-0">
                <Card className="h-full bg-surface-1 border-hairline rounded-2xl p-5 hover:border-accent/50 transition-all flex flex-col justify-between [overflow-wrap:anywhere]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone="accent" variant="outline">
                        {(project.peakPowerWatts / 1000).toFixed(1)} kW
                      </Badge>
                      <span className="text-[10px] font-mono text-fg-subtle uppercase">
                        {project.motorParams.topology.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h3 className="font-display text-body-lg font-bold text-fg group-hover:text-accent-fg transition-colors line-clamp-2">
                      {project.title}
                    </h3>

                    <p className="text-body-xs text-fg-muted line-clamp-2 leading-relaxed">
                      {project.vehicleApplication}
                    </p>

                    <div className="bg-sunken rounded-xl p-3 border border-hairline font-mono text-[11px] space-y-1">
                      <div className="flex justify-between text-fg-muted">
                        <span>Rated Speed / Torque:</span>
                        <span className="text-fg">
                          {project.motorParams.ratedSpeedRpm} RPM / {project.motorParams.ratedTorqueNm} Nm
                        </span>
                      </div>
                      <div className="flex justify-between text-fg-muted">
                        <span>DC Bus / Current:</span>
                        <span className="text-accent-fg font-semibold">
                          {project.motorParams.dcBusVoltageV}V / {project.motorParams.maxInverterCurrentA}A
                        </span>
                      </div>
                      <div className="flex justify-between text-fg-muted">
                        <span>Sensor:</span>
                        <span className="text-fg">{project.feedbackSensor.replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-hairline mt-4 flex items-center justify-between text-body-xs font-mono">
                    <span className="text-fg-subtle truncate max-w-[180px]">
                      {project.indianContextFacility.split('-')[0]?.trim()}
                    </span>
                    <span className="text-accent-fg font-semibold group-hover:translate-x-0.5 transition-transform">
                      Inspect FOC Stack →
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <Card className="text-center py-12 bg-surface-1 border-hairline text-fg-subtle font-mono text-body-xs">
              No matching motor FOC projects found for query &quot;{search}&quot;.
            </Card>
          )}
        </div>
      )}

      {activeTab === 'workbench' && (
        <div className="space-y-4">
          <div className="bg-sunken border border-hairline rounded-xl p-4 text-body-xs text-fg-muted leading-relaxed font-mono">
            Defaulted to 6 kW Interior PMSM motor (4 pole pairs, 51.2V DC bus). Adjust target speed, load torque, and PWM switching frequency in real time.
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
