'use client';

import Link from 'next/link';
import type { CanBusProject } from '@hackerland/core';
import { CanBusWorkbench } from './can-bus-workbench';

interface CanDetailViewProps {
  project: CanBusProject;
}

export function CanDetailView({ project }: CanDetailViewProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-hairline bg-surface-1 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-fg-subtle">
          <Link href="/can-bus" className="hover:text-accent-fg transition-colors">
            ← CAN Bus &amp; ISO 11898 Network Catalog
          </Link>
          <span>/</span>
          <span className="text-fg font-semibold">{project.slug}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-soft text-accent-fg border border-accent/25 font-mono uppercase">
                {project.protocolStandard.replace(/_/g, ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 font-mono">
                {project.nominalBaudRateKbps} kbps Nominal
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sunken text-fg-muted border border-hairline font-mono">
                {project.busTopology.nodeCount} ECU Nodes · {project.busTopology.busLengthMeters}m
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-fg tracking-tight">
              {project.title}
            </h1>
            <p className="text-sm text-fg-muted max-w-3xl">
              Domain: <span className="text-fg font-medium">{project.automotiveDomain}</span> · Cable:{' '}
              <span className="font-mono text-xs text-fg">{project.busTopology.cableType}</span>
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
              ARAI / ISO 11898-2 Validated
            </span>
          </div>
        </div>
      </div>

      {/* Indian Testing Facility Card */}
      <div className="bg-surface-1 border border-accent/25 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
        <div className="p-2.5 rounded-xl bg-accent-soft border border-accent/20 text-accent-fg shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-fg font-bold block">
            NABL Accredited Indian Automotive &amp; EMI Test Lab
          </span>
          <p className="text-sm text-fg font-mono font-medium">
            {project.indianContextFacility}
          </p>
          <p className="text-xs text-fg-muted leading-relaxed">
            Termination: <strong className="text-fg">{project.busTopology.terminationMethod.replace(/_/g, ' ')}</strong> · Isolation:{' '}
            <strong className="text-sky-700">{project.busTopology.isolationType.replace(/_/g, ' ')}</strong>
          </p>
        </div>
      </div>

      {/* Engineering Directives */}
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

      {/* Interactive Workbench */}
      <div className="space-y-4">
        <div className="border-b border-hairline pb-2.5">
          <h2 className="font-display text-lg font-bold text-fg flex items-center gap-2">
            <span className="text-accent-fg">⚡</span>
            Interactive Bit Timing &amp; Load Simulator
          </h2>
          <p className="text-xs text-fg-muted mt-0.5">
            Tune baud rate, CAN controller oscillator clock, bus length, and termination topology to verify deterministic arbitration
          </p>
        </div>

        <CanBusWorkbench
          initialStandard={project.protocolStandard}
          initialBaudRateKbps={project.nominalBaudRateKbps}
          initialBusLengthM={project.busTopology.busLengthMeters}
          initialNodes={project.busTopology.nodeCount}
          initialTermination={project.busTopology.terminationMethod}
        />
      </div>
    </div>
  );
}
