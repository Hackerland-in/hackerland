import type { Metadata } from 'next';
import { COMPLIANCE_ROADMAPS } from '@/lib/data/compliance-data';
import { ComplianceWizard } from '@/components/compliance/compliance-wizard';

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
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <ComplianceWizard initialRoadmaps={COMPLIANCE_ROADMAPS} />
    </div>
  );
}
