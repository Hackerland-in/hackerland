'use client';

import Link from 'next/link';
import type { ThermalProfileProject } from '@hackerland/core';
import { ThermalCalculatorWorkbench } from './thermal-calculator-workbench';

interface ThermalDetailViewProps {
  project: ThermalProfileProject;
}

export function ThermalDetailView({ project }: ThermalDetailViewProps) {
  return (
    <div className="space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
          <Link href="/thermal" className="hover:text-amber-400 transition-colors">
            ← Thermal Profiler Catalog
          </Link>
          <span>/</span>
          <span className="text-stone-300 font-semibold">{project.slug}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                {project.powerDissipationWatts}W Dissipation
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-800 text-stone-300 font-mono capitalize">
                {project.coolingMethod.replace(/_/g, ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono capitalize">
                {project.heatsinkMaterial.replace(/_/g, ' ')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 tracking-tight">
              {project.title}
            </h1>
            <p className="text-sm text-stone-400 mt-1 max-w-3xl">
              Device: <span className="text-stone-200 font-mono font-bold">{project.deviceType}</span> · Operating Ambient: <span className="text-stone-200 font-mono font-bold">{project.operatingAmbientTemperatureC}°C</span>
            </p>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl p-3.5 text-right font-mono">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Standard &amp; Compliance</span>
            <span className="text-sm font-bold text-stone-200 block mt-0.5">{project.regulatoryStandard}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">NABL Thermal Chamber Validated</span>
          </div>
        </div>
      </div>

      {/* Indian Testing Facility Alert */}
      <div className="bg-stone-900/80 border border-amber-900/40 rounded-xl p-4 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block">
            NABL Accredited Indian Test Facility &amp; Environmental Verification
          </span>
          <p className="text-sm text-stone-300 font-mono mt-0.5">
            {project.indianTestFacility}
          </p>
          <p className="text-xs text-stone-400 mt-1 leading-relaxed">
            Standard: {project.regulatoryStandard} · {project.application}
          </p>
        </div>
      </div>

      {/* Design Rules & Engineering Notes */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3 font-mono">
        <span className="text-xs uppercase tracking-wider font-semibold text-stone-300 block border-b border-stone-800 pb-2">
          Thermal Interface &amp; Mechanical Packaging Directives
        </span>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-stone-300">
          {project.designNotes.map((note, idx) => (
            <li key={idx} className="flex items-start gap-2 bg-stone-950/60 p-2.5 rounded-lg border border-stone-800/60">
              <span className="text-amber-400 font-bold">✓</span>
              <span className="leading-relaxed">{note}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Embedded Live Interactive Workbench */}
      <div>
        <h2 className="text-lg font-bold text-stone-100 font-mono mb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          Live Interactive Thermal Model (Pre-Loaded for {project.title})
        </h2>
        <ThermalCalculatorWorkbench
          initialPowerWatts={project.powerDissipationWatts}
          initialAmbientC={project.operatingAmbientTemperatureC}
          initialMaxJunctionC={project.params.maxJunctionTemperatureC}
          initialThetaJc={project.params.junctionToCaseResistanceCPerW}
          initialTim={project.timMaterial}
          initialTimAreaCm2={project.params.timContactAreaCm2}
          initialMaterial={project.heatsinkMaterial}
          initialCooling={project.coolingMethod}
          initialWidthMm={project.params.heatsinkWidthMm}
          initialLengthMm={project.params.heatsinkLengthMm}
          initialBaseThicknessMm={project.params.baseThicknessMm}
          initialFinHeightMm={project.params.finHeightMm}
          initialFinThicknessMm={project.params.finThicknessMm}
          initialNumberOfFins={project.params.numberOfFins}
        />
      </div>
    </div>
  );
}
