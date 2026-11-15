'use client';

import { useState } from 'react';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import {
  InjectionMoldingSimulator,
  SheetMetalBendSimulator,
  BatteryWeldingSimulator,
  BLDCMotorSimulator,
  ThermalHeatsinkSimulator,
  CleanroomSimulator,
} from '@/components/manufacturing/simulators/advanced-industrial-simulators';

export default function IndustrialToolsStudioPage() {
  const [activeTab, setActiveTab] = useState<
    'injection' | 'sheet_metal' | 'battery_weld' | 'bldc_winding' | 'thermal' | 'cleanroom'
  >('injection');

  const tools = [
    { id: 'injection', label: 'Injection Molding Clamp & Cycle' },
    { id: 'sheet_metal', label: 'Sheet Metal Bend K-Factor' },
    { id: 'battery_weld', label: 'Battery Spot Weld & Nickel Strip' },
    { id: 'bldc_winding', label: 'BLDC Stator Motor Winding' },
    { id: 'thermal', label: 'Power Heatsink & Dissipation' },
    { id: 'cleanroom', label: 'Cleanroom Particle & HVAC' },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 min-w-0">
      <StudioBreadcrumb
        title="Industrial Workshop & Factory Tooling Engines"
        category="Tooling & Production Engineering"
        badge="6 Industrial Calculators"
        activeId="tools"
      />

      <div className="space-y-4 rounded-xl border border-hairline bg-surface-1 p-6">
        {/* Tool selector pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {tools.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3.5 py-1.5 rounded-lg text-body-xs font-medium whitespace-nowrap transition-all border ${
                activeTab === tab.id
                  ? 'border-accent bg-accent/15 text-accent font-semibold shadow-sm'
                  : 'border-hairline bg-surface-2 text-fg-muted hover:text-fg hover:border-hairline-strong'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Selected Industrial Calculator */}
        <div className="pt-2">
          {activeTab === 'injection' && <InjectionMoldingSimulator />}
          {activeTab === 'sheet_metal' && <SheetMetalBendSimulator />}
          {activeTab === 'battery_weld' && <BatteryWeldingSimulator />}
          {activeTab === 'bldc_winding' && <BLDCMotorSimulator />}
          {activeTab === 'thermal' && <ThermalHeatsinkSimulator />}
          {activeTab === 'cleanroom' && <CleanroomSimulator />}
        </div>
      </div>
    </div>
  );
}
