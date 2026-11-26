import type { Metadata } from 'next';
import { COMPLIANCE_ROADMAPS } from '@/lib/data/compliance-data';
import { ComplianceWizard } from '@/components/compliance/compliance-wizard';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'Indian Hardware Statutory Compliance & NABL Lab Wizard | Hackerland',
  description:
    'Calculate BIS CRS, WPC ETA, TEC MTCTE, DGCA Type Certification, and AIS-156 statutory testing fees in ₹, sample requirements, and lead times from authorized Indian NABL laboratories.',
  openGraph: {
    title: 'Indian Hardware Statutory Compliance & NABL Lab Wizard | Hackerland',
    description:
      'Demystifying BIS, WPC, TEC, DGCA, and AIS-156 hardware certifications for Indian hardware startups. Pre-compliance checklists, laboratory testing fee benchmarks, and statutory roadmaps.',
    type: 'website',
  },
};

export default function CompliancePage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <ComplianceWizard initialRoadmaps={COMPLIANCE_ROADMAPS} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
