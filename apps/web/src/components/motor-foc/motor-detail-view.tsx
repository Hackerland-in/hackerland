'use client';

import Link from 'next/link';
import type { MotorFocProject } from '@hackerland/core';
import { MotorFocWorkbench } from './motor-foc-workbench';

interface MotorDetailViewProps {
  project: MotorFocProject;
}

export function MotorDetailView({ project }: MotorDetailViewProps) {
  return (
    <div className="space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/motor-foc" className="hover:text-emerald-400 transition-colors">
            ← Motor FOC &amp; SVPWM Simulator Catalog
          </Link>
          <span>/</span>
          <span className="text-slate-300 font-semibold">{project.slug}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {(project.peakPowerWatts / 1000).toFixed(1)} kW Peak Power
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 font-mono capitalize">
                {project.motorParams.topology.replace(/_/g, ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
                {project.motorParams.polePairs} Pole Pairs
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                {project.feedbackSensor.replace(/_/g, ' ')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {project.title}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Application: <span className="text-slate-200">{project.vehicleApplication}</span>
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-right font-mono">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Standard &amp; Compliance</span>
            <span className="text-xs font-bold text-slate-200 block mt-0.5">{project.standardsCompliance}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">ARAI / ICAT Certified Protocol</span>
          </div>
        </div>
      </div>

      {/* Indian Testing Facility Alert */}
      <div className="bg-slate-900/80 border border-emerald-900/40 rounded-xl p-4 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block">
            NABL Accredited Indian Test Facility &amp; Dyno Bench
          </span>
          <p className="text-sm text-slate-300 font-mono mt-0.5">
            {project.indianContextFacility}
          </p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Inverter: <strong className="text-slate-300">{project.inverterSpecs.topology}</strong> ({project.inverterSpecs.switchTechnology.replace(/_/g, ' ')}, {project.inverterSpecs.deadTimeNanoseconds}ns dead-time) · Shunt Topology: <strong className="text-sky-300">{project.inverterSpecs.currentShuntTopology.replace(/_/g, ' ')}</strong>
          </p>
        </div>
      </div>

      {/* Design Rules & Engineering Directives */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 font-mono">
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-300 block border-b border-slate-800 pb-2">
          Engineering Directives &amp; Design Archaeology
        </span>
        <ul className="space-y-2 text-xs text-slate-300">
          {project.designDirectives.map((directive, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold shrink-0 mt-0.5">0{idx + 1}.</span>
              <span className="leading-relaxed">{directive}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Interactive Workbench with Motor Parameters Loaded */}
      <div className="space-y-4">
        <div className="border-b border-slate-800 pb-2">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="text-emerald-400">⚡</span>
            Interactive FOC Loop &amp; SVPWM Hexagon Simulator
          </h2>
          <p className="text-xs text-slate-400">
            Tune target RPM, load torque, and DC bus voltage to inspect real-time current vectors and switching states for this powertrain
          </p>
        </div>

        <MotorFocWorkbench
          initialMotor={project.motorParams}
          initialSpeedRpm={project.defaultOperatingSpeedRpm}
          initialTorqueNm={project.defaultLoadTorqueNm}
          initialPwmKhz={project.recommendedPwmKhz}
          initialDcBusV={project.motorParams.dcBusVoltageV}
          initialSensor={project.feedbackSensor}
        />
      </div>
    </div>
  );
}
