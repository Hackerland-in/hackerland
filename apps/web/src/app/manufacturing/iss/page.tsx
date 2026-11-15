import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { IssSimulator } from '@/components/manufacturing/iss/iss-simulator';

export const metadata: Metadata = {
  title: 'RISC-V Instruction Set Simulator (ISS) Studio · Hackerland',
  description: 'Cycle-accurate RV32I microarchitecture execution, 32 architectural registers, 5-stage pipeline, and RAM hex dump.',
};

export default function IssStudioPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 min-w-0">
      <StudioBreadcrumb
        title="RISC-V Instruction Set Simulator (ISS) Studio"
        category="Microarchitecture & Architecture Simulators"
        badge="RV32I / gem5 / QEMU / Spike"
        activeId="iss"
      />
      <IssSimulator />
    </div>
  );
}
