import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { IssSimulator } from '@/components/manufacturing/iss/iss-simulator';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';
import { SocialCommunityProvider } from '@/components/social/social-context';

export const metadata: Metadata = {
  title: 'RISC-V Instruction Set Simulator (ISS) Studio · Hackerland',
  description: 'Cycle-accurate RV32I microarchitecture execution, 32 architectural registers, 5-stage pipeline, and RAM hex dump.',
};

export default function IssStudioPage() {
  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="eda"
        title="RISC-V Instruction Set Simulator (ISS) Studio"
        subtitle="RV32I 5-stage instruction pipeline, register file inspector & live memory dump"
        category="Microarchitecture Sim"
        badge="RV32I · Spike · QEMU"
        currentRoute="/manufacturing/iss"
        edgeToEdge
      >
        <IssSimulator />
        <StudioBreadcrumb
          title="RISC-V Instruction Set Simulator (ISS) Studio"
          category="Microarchitecture & Architecture Simulators"
          badge="RV32I / gem5 / QEMU / Spike"
          activeId="iss"
        />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
