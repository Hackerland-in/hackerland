import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { OpenEdaStudio } from '@/components/manufacturing/eda/open-eda-studio';

export const metadata: Metadata = {
  title: 'Open-Source EDA Silicon & ASIC Flow Studio · Hackerland',
  description: 'Automated RTL-to-GDSII physical design suite using Yosys, OpenROAD, Magic DRC, Netgen LVS, and KLayout for SkyWater SKY130.',
};

export default function EdaStudioPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 min-w-0">
      <StudioBreadcrumb
        title="Open-Source EDA Silicon & ASIC Flow Studio"
        category="Semiconductor Physical Design"
        badge="Yosys / OpenROAD / Magic / KLayout"
        activeId="eda"
      />
      <OpenEdaStudio />
    </div>
  );
}
