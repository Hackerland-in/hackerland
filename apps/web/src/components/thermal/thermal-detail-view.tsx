'use client';

import Link from 'next/link';
import type { ThermalProfileProject } from '@hackerland/core';
import { ThermalCalculatorWorkbench } from './thermal-calculator-workbench';

interface ThermalDetailViewProps {
  project: ThermalProfileProject;
}

export function ThermalDetailView({ project }: ThermalDetailViewProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-hairline bg-surface-1 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-fg-subtle">
          <Link href="/thermal" className="hover:text-accent-fg transition-colors">
            ← Thermal Profiler Catalog
          </Link>
          <span>/</span>
          <span className="text-fg font-semibold">{project.slug}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-soft text-accent-fg border border-accent/25 font-mono">
                {project.powerDissipationWatts}W Dissipation
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sunken text-fg-muted border border-hairline font-mono capitalize">
                {project.coolingMethod.replace(/_/g, ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 font-mono capitalize">
                {project.heatsinkMaterial.replace(/_/g, ' ')}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-fg tracking-tight">
              {project.title}
            </h1>
            <p className="text-sm text-fg-muted max-w-3xl">
              Device: <span className="text-fg font-mono font-bold">{project.deviceType}</span> · Operating Ambient:{' '}
              <span className="text-fg font-mono font-bold">{project.operatingAmbientTemperatureC}°C</span>
            </p>
          </div>

          <div className="bg-sunken border border-hairline rounded-xl p-3.5 text-left md:text-right font-mono shrink-0">
            <span className="text-[10px] text-fg-subtle uppercase tracking-wider block">
              Standard &amp; Compliance
            </span>
            <span className="text-sm font-bold text-fg block mt-0.5">
              {project.regulatoryStandard}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
              NABL Thermal Chamber Validated
            </span>
          </div>
        </div>
      </div>

      {/* Indian Testing Facility Alert */}
      <div className="bg-surface-1 border border-accent/25 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
        <div className="p-2.5 rounded-xl bg-accent-soft border border-accent/20 text-accent-fg shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-fg font-bold block">
            NABL Accredited Indian Test Facility &amp; Environmental Verification
          </span>
          <p className="text-sm text-fg font-mono font-medium">
            {project.indianTestFacility}
          </p>
          <p className="text-xs text-fg-muted leading-relaxed">
            Standard: {project.regulatoryStandard} · {project.application}
          </p>
        </div>
      </div>

      {/* Design Rules & Engineering Notes */}
      <div className="bg-surface-1 border border-hairline rounded-2xl p-5 space-y-3 font-mono shadow-xs">
        <span className="text-xs uppercase tracking-wider font-semibold text-fg block border-b border-hairline pb-2.5">
          Thermal Interface &amp; Mechanical Packaging Directives
        </span>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-fg">
          {project.designNotes.map((note, idx) => (
            <li key={idx} className="flex items-start gap-2 bg-sunken p-3 rounded-xl border border-hairline">
              <span className="text-accent-fg font-bold">✓</span>
              <span className="leading-relaxed">{note}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Embedded Live Interactive Workbench */}
      <div className="space-y-3">
        <h2 className="font-display text-lg font-bold text-fg flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent" />
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
