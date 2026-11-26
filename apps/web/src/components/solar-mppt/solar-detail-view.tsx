'use client';

import Link from 'next/link';
import type { SolarMpptProject } from '@hackerland/core';
import { SolarConverterWorkbench } from './solar-converter-workbench';

interface SolarDetailViewProps {
  project: SolarMpptProject;
}

export function SolarDetailView({ project }: SolarDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-fg-subtle">
          <Link href="/solar-mppt" className="hover:text-accent-fg transition-colors">
            ← Solar PV &amp; MPPT Simulator Catalog
          </Link>
          <span>/</span>
          <span className="text-fg font-semibold">{project.slug}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-soft text-accent-fg border border-accent/25 font-mono">
                {project.systemCapacityWatts}W PV Rating
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sunken text-fg-muted border border-hairline font-mono capitalize">
                {project.panelSpecs.technology.replace(/_/g, ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 font-mono">
                {project.targetBattery.toUpperCase().replace(/_/g, ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                {project.mpptAlgorithm.toUpperCase().replace(/_/g, ' ')}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-fg tracking-tight">
              {project.title}
            </h1>
            <p className="text-sm text-fg-muted max-w-3xl">
              Application: <span className="text-fg font-medium">{project.application}</span>
            </p>
          </div>

          <div className="bg-sunken border border-hairline rounded-xl p-3.5 text-left md:text-right font-mono shrink-0">
            <span className="text-[10px] text-fg-subtle uppercase tracking-wider block">
              Standard &amp; Compliance
            </span>
            <span className="text-xs font-bold text-fg block mt-0.5">
              {project.standardsCompliance}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
              NABL / MNRE Validated
            </span>
          </div>
        </div>
      </div>

      {/* Indian Testing Facility Alert */}
      <div className="bg-surface-1 border border-accent/25 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
        <div className="p-2.5 rounded-xl bg-accent-soft border border-accent/20 text-accent-fg shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-fg font-bold block">
            NABL Accredited Indian Test Facility &amp; Environmental Verification
          </span>
          <p className="text-sm text-fg font-mono font-medium">
            {project.indianContextFacility}
          </p>
          <p className="text-xs text-fg-muted leading-relaxed">
            Deployment Environment: <strong className="text-fg">{project.operatingConditions.ambientEnvironment}</strong> · Design STC Irradiance: <strong className="text-amber-700">{project.operatingConditions.designIrradianceWPerM2} W/m²</strong> · Ambient Temp: <strong className="text-amber-700">{project.operatingConditions.designTemperatureC}°C</strong>
          </p>
        </div>
      </div>

      {/* Design Rules & Engineering Notes */}
      <div className="bg-surface-1 border border-hairline rounded-2xl p-5 space-y-3 font-mono shadow-xs">
        <span className="text-xs uppercase tracking-wider font-semibold text-fg block border-b border-hairline pb-2.5">
          Engineering Directives &amp; Design Archaeology
        </span>
        <ul className="space-y-2.5 text-xs text-fg-muted">
          {project.designDirectives.map((directive, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="text-accent-fg font-bold shrink-0 mt-0.5">0{idx + 1}.</span>
              <span className="leading-relaxed text-fg">{directive}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Interactive Workbench with Preset Loaded */}
      <div className="space-y-4">
        <div className="border-b border-hairline pb-2.5">
          <h2 className="font-display text-lg font-bold text-fg flex items-center gap-2">
            <span className="text-accent-fg">⚡</span>
            Interactive Simulation &amp; Converter Sizing
          </h2>
          <p className="text-xs text-fg-muted mt-0.5">
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
