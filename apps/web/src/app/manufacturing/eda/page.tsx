import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { OpenEdaStudio } from '@/components/manufacturing/eda/open-eda-studio';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';
import { SocialCommunityProvider } from '@/components/social/social-context';

export const metadata: Metadata = {
  title: 'Open-Source EDA Silicon & ASIC Flow Studio · Hackerland',
  description: 'Automated RTL-to-GDSII physical design suite using Yosys, OpenROAD, Magic DRC, Netgen LVS, and KLayout for SkyWater SKY130.',
};

export default function EdaStudioPage() {
  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="eda"
        title="Open-Source EDA Silicon & ASIC Flow Studio"
        subtitle="Automated RTL-to-GDSII physical design suite using Yosys, OpenROAD, Magic DRC & KLayout"
        category="Semiconductor Physical Design"
        badge="Yosys / OpenROAD / Magic / KLayout"
        currentRoute="/manufacturing/eda"
        edgeToEdge
      >
        <StudioBreadcrumb
          title="Open-Source EDA Silicon & ASIC Flow Studio"
          category="Semiconductor Physical Design"
          badge="Yosys / OpenROAD / Magic / KLayout"
          activeId="eda"
        />
        <OpenEdaStudio />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
