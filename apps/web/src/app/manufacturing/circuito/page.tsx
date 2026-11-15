import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { CircuitoBuilder } from '@/components/manufacturing/circuito/circuito-builder';

export const metadata: Metadata = {
  title: 'Circuito.io Autonomous Breadboard & BOM Engine · Hackerland',
  description: 'Visual breadboard wiring canvas, automatic logic level shifter injection, and Indian distributor BOM.',
};

export default function CircuitoStudioPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 min-w-0">
      <StudioBreadcrumb
        title="Circuito.io Autonomous Circuit Builder"
        category="Rapid Prototyping"
        badge="Breadboard & Auto-BOM"
        activeId="circuito"
      />
      <CircuitoBuilder />
    </div>
  );
}
