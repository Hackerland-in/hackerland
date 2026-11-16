import { z } from 'zod';

export const hardwareLicenseEnum = z.enum([
  'CERN-OHL-P-2.0',
  'CERN-OHL-W-2.0',
  'CERN-OHL-S-2.0',
  'TAPR-OHL-1.0',
  'Apache-2.0',
  'MIT',
  'GPL-3.0',
  'CC-BY-SA-4.0',
]);
export type HardwareLicense = z.infer<typeof hardwareLicenseEnum>;

export const inventionCategoryEnum = z.enum([
  'avionics_aerospace',
  'clean_mobility_bms',
  'biomedical_diagnostics',
  'robotics_actuation',
  'climatetech_agri',
  'open_silicon_asic',
]);
export type InventionCategory = z.infer<typeof inventionCategoryEnum>;

export const priorArtJurisdictionEnum = z.enum([
  'indian_patent_office',
  'uspto',
  'wipo_pct',
  'epo',
]);
export type PriorArtJurisdiction = z.infer<typeof priorArtJurisdictionEnum>;

export const openArtifactItemSchema = z.object({
  id: z.string(),
  artifactType: z.enum(['schematic_pdf', 'gerber_zip', 'step_cad', 'firmware_c', 'bill_of_materials']),
  fileName: z.string(),
  fileSizeBytes: z.number().int().positive(),
  sha256Hash: z.string().length(64),
  downloadUrl: z.string().optional(),
});
export type OpenArtifactItem = z.infer<typeof openArtifactItemSchema>;

export const priorArtCitationSchema = z.object({
  title: z.string(),
  patentOrPaperId: z.string(),
  jurisdiction: priorArtJurisdictionEnum,
  distinctionSummary: z.string(),
});
export type PriorArtCitation = z.infer<typeof priorArtCitationSchema>;

export const timestampProofSchema = z.object({
  sha256Hash: z.string().length(64),
  merkleRoot: z.string(),
  gitCommitHash: z.string().min(7),
  blockHeight: z.number().int().nonnegative(),
  rfc3161TimestampToken: z.string(),
  publicNotaryService: z.string(),
});
export type TimestampProof = z.infer<typeof timestampProofSchema>;

export const defensivePublicationSchema = z.object({
  id: z.string().min(5),
  title: z.string().min(5),
  inventor: z.object({
    name: z.string().min(2),
    handle: z.string(),
    organization: z.string().optional(),
    verifiedKycOrEmail: z.boolean(),
  }),
  category: inventionCategoryEnum,
  hardwareLicense: hardwareLicenseEnum,
  firstPublicDisclosureDate: z.string(),
  timestampProof: timestampProofSchema,
  ipcClasses: z.array(z.string().min(3)),
  abstractSummary: z.string().min(20),
  novelMechanisms: z.array(z.string().min(5)),
  priorArtCitations: z.array(priorArtCitationSchema),
  openArtifacts: z.array(openArtifactItemSchema),
  nonAggressionPledgeSigned: z.boolean(),
});
export type DefensivePublication = z.infer<typeof defensivePublicationSchema>;

export const submitInventionDefenseSchema = z.object({
  title: z.string().min(5),
  inventorName: z.string().min(2),
  inventorHandle: z.string().min(3),
  organization: z.string().optional(),
  category: inventionCategoryEnum,
  hardwareLicense: hardwareLicenseEnum,
  ipcClasses: z.array(z.string()).min(1),
  abstractSummary: z.string().min(30),
  novelMechanisms: z.array(z.string().min(5)).min(1),
  primaryArtifactSha256: z.string().length(64),
  agreeToNonAggressionPledge: z.boolean().refine((v) => v === true, {
    message: 'You must sign the Open Hardware Non-Aggression Pledge',
  }),
});
export type SubmitInventionDefenseInput = z.infer<typeof submitInventionDefenseSchema>;

/**
 * Verifies that a given file hash matches the cryptographic proof stored on the ledger.
 */
export function verifyInventionIntegrity(
  publication: DefensivePublication,
  candidateSha256: string
): boolean {
  if (publication.timestampProof.sha256Hash.toLowerCase() === candidateSha256.toLowerCase()) {
    return true;
  }
  return publication.openArtifacts.some(
    (art) => art.sha256Hash.toLowerCase() === candidateSha256.toLowerCase()
  );
}

/**
 * Formats a formal Prior Art Affidavit compliant with USPTO 35 U.S.C. § 102
 * and Indian Patents Act 1970 Sections 29/30.
 */
export function generatePriorArtAffidavitText(pub: DefensivePublication): string {
  return [
    '================================================================================',
    '       CERTIFICATE OF DEFENSIVE PUBLICATION & PRIOR ART DISCLOSURE',
    '       HACKERLAND OPEN INVENTION NETWORK · IP DEFENSE LEDGER',
    '================================================================================',
    '',
    `DISCLOSURE IDENTIFIER:  ${pub.id}`,
    `INVENTION TITLE:       ${pub.title}`,
    `FIRST PUBLIC DATE:     ${pub.firstPublicDisclosureDate}`,
    `PRIMARY INVENTOR:      ${pub.inventor.name} (@${pub.inventor.handle})`,
    pub.inventor.organization ? `INSTITUTION:           ${pub.inventor.organization}` : '',
    `OPEN HARDWARE LICENSE: ${pub.hardwareLicense}`,
    `IPC/CPC CLASSES:       ${pub.ipcClasses.join(', ')}`,
    '',
    '--------------------------------------------------------------------------------',
    'CRYPTOGRAPHIC PROOF OF PRIOR ART (RFC 3161 & DISTRIBUTED MERKLE ROOT)',
    '--------------------------------------------------------------------------------',
    `SHA-256 DIGEST:        ${pub.timestampProof.sha256Hash}`,
    `MERKLE ROOT:           ${pub.timestampProof.merkleRoot}`,
    `GIT REPOSITORY COMMIT: ${pub.timestampProof.gitCommitHash}`,
    `BLOCK HEIGHT:          #${pub.timestampProof.blockHeight}`,
    `TIMESTAMP NOTARY:      ${pub.timestampProof.publicNotaryService}`,
    '',
    '--------------------------------------------------------------------------------',
    'ABSTRACT OF DISCLOSURE',
    '--------------------------------------------------------------------------------',
    pub.abstractSummary,
    '',
    '--------------------------------------------------------------------------------',
    'NOVEL TECHNICAL CLAIMS & HARDWARE MECHANISMS',
    '--------------------------------------------------------------------------------',
    ...pub.novelMechanisms.map((m, idx) => `${idx + 1}. ${m}`),
    '',
    '--------------------------------------------------------------------------------',
    'LEGAL STATUTORY COMPLIANCE DECLARATION',
    '--------------------------------------------------------------------------------',
    'This defensive disclosure constitutes prior art under:',
    '1. United States Code Title 35 § 102(a)(1) (Publicly disclosed before the effective filing date).',
    '2. The Patents Act, 1970 (India) § 29 & § 30 (Anticipation by previous public publication).',
    '3. European Patent Convention (EPC) Article 54(2) (State of the art made available to the public).',
    '',
    'Any subsequent patent application claiming the aforementioned mechanisms lacks novelty',
    'and inventive step. The inventor has irrevocably bound this work to the open-source',
    'commons and signed the Hackerland Mutual Non-Aggression Patent Cross-License.',
    '================================================================================',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Filter ledger entries by category, license, and search text.
 */
export function filterDefensiveLedger(
  ledger: DefensivePublication[],
  filters: {
    category?: InventionCategory | 'all';
    license?: HardwareLicense | 'all';
    search?: string;
  }
): DefensivePublication[] {
  return ledger.filter((item) => {
    if (filters.category && filters.category !== 'all' && item.category !== filters.category) {
      return false;
    }
    if (filters.license && filters.license !== 'all' && item.hardwareLicense !== filters.license) {
      return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchAbstract = item.abstractSummary.toLowerCase().includes(q);
      const matchInventor = item.inventor.name.toLowerCase().includes(q) || item.inventor.handle.toLowerCase().includes(q);
      const matchIpc = item.ipcClasses.some((c) => c.toLowerCase().includes(q));
      const matchHash = item.timestampProof.sha256Hash.toLowerCase().includes(q);
      if (!matchTitle && !matchAbstract && !matchInventor && !matchIpc && !matchHash) {
        return false;
      }
    }
    return true;
  });
}
