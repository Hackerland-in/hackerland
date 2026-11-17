'use client';

import Link from 'next/link';
import type { SolarMpptProject } from '@hackerland/core';
import { SolarConverterWorkbench } from './solar-converter-workbench';

interface SolarDetailViewProps {
  project: SolarMpptProject;
}

export function SolarDetailView({ project }: SolarDetailViewProps) {
  return (
    <div className="space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/solar-mppt" className="hover:text-amber-400 transition-colors">
            ← Solar PV &amp; MPPT Simulator Catalog
          </Link>
          <span>/</span>
          <span className="text-slate-300 font-semibold">{project.slug}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                {project.systemCapacityWatts}W PV Rating
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 font-mono capitalize">
                {project.panelSpecs.technology.replace(/_/g, ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
                {project.targetBattery.toUpperCase().replace(/_/g, ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {project.mpptAlgorithm.toUpperCase().replace(/_/g, ' ')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {project.title}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Application: <span className="text-slate-200">{project.application}</span>
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-right font-mono">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Standard &amp; Compliance</span>
            <span className="text-xs font-bold text-slate-200 block mt-0.5">{project.standardsCompliance}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">NABL / MNRE Validated</span>
          </div>
        </div>
      </div>

      {/* Indian Testing Facility Alert */}
      <div className="bg-slate-900/80 border border-amber-900/40 rounded-xl p-4 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block">
            NABL Accredited Indian Test Facility &amp; Environmental Verification
          </span>
          <p className="text-sm text-slate-300 font-mono mt-0.5">
            {project.indianContextFacility}
          </p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Deployment Environment: <strong className="text-slate-300">{project.operatingConditions.ambientEnvironment}</strong> · Design STC Irradiance: <strong className="text-amber-300">{project.operatingConditions.designIrradianceWPerM2} W/m²</strong> · Ambient Temp: <strong className="text-amber-300">{project.operatingConditions.designTemperatureC}°C</strong>
          </p>
        </div>
      </div>

      {/* Design Rules & Engineering Notes */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 font-mono">
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-300 block border-b border-slate-800 pb-2">
          Engineering Directives &amp; Design Archaeology
        </span>
        <ul className="space-y-2 text-xs text-slate-300">
          {project.designDirectives.map((directive, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="text-amber-400 font-bold shrink-0 mt-0.5">0{idx + 1}.</span>
              <span className="leading-relaxed">{directive}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Interactive Workbench with Preset Loaded */}
      <div className="space-y-4">
        <div className="border-b border-slate-800 pb-2">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="text-amber-400">⚡</span>
            Interactive Simulation &amp; Converter Sizing
          </h2>
          <p className="text-xs text-slate-400">
            Dynamically adjust irradiance and temperature to simulate real-world diurnal curves for this hardware stack
          </p>
        </div>

        <SolarConverterWorkbench
          initialPanelSpecs={project.panelSpecs}
          initialAlgorithm={project.mpptAlgorithm}
          initialBattery={project.targetBattery}
          initialIrradiance={project.operatingConditions.designIrradianceWPerM2}
          initialTemperature={project.operatingConditions.designTemperatureC}
        />
      </div>
    </div>
  );
}
