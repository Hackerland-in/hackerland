'use client';

import { useState } from 'react';
import type { DefensivePublication, InventionCategory, HardwareLicense } from '@hackerland/core';
import { X, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { Button, Input, Textarea } from '@hackerland/ui';

interface SubmitDefenseModalProps {
  onClose: () => void;
  onAdded: (pub: DefensivePublication) => void;
}

export function SubmitDefenseModal({ onClose, onAdded }: SubmitDefenseModalProps) {
  const [title, setTitle] = useState('');
  const [inventorName, setInventorName] = useState('');
  const [inventorHandle, setInventorHandle] = useState('');
  const [organization, setOrganization] = useState('');
  const [category, setCategory] = useState<InventionCategory>('clean_mobility_bms');
  const [license, setLicense] = useState<HardwareLicense>('CERN-OHL-P-2.0');
  const [ipcInput, setIpcInput] = useState('H01M 10/44, G01R 31/36');
  const [abstractSummary, setAbstractSummary] = useState('');
  const [novelMechanisms, setNovelMechanisms] = useState('');
  const [sha256Hash, setSha256Hash] = useState('');
  const [agreePledge, setAgreePledge] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [createdPub, setCreatedPub] = useState<DefensivePublication | null>(null);

  const isValid =
    title.trim().length >= 5 &&
    inventorName.trim().length >= 2 &&
    inventorHandle.trim().length >= 3 &&
    abstractSummary.trim().length >= 20 &&
    novelMechanisms.trim().length >= 5 &&
    sha256Hash.trim().length === 64 &&
    agreePledge;

  const handleGenerateSampleHash = () => {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    setSha256Hash(hash);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const newId = `ip-led-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const ipcClasses = ipcInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const mechanisms = novelMechanisms
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const newPublication: DefensivePublication = {
      id: newId,
      title,
      inventor: {
        name: inventorName,
        handle: inventorHandle.replace('@', ''),
        organization: organization.trim() || undefined,
        verifiedKycOrEmail: true,
      },
      category,
      hardwareLicense: license,
      firstPublicDisclosureDate: new Date().toISOString(),
      timestampProof: {
        sha256Hash,
        merkleRoot: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        gitCommitHash: 'a1b2c3d4e5f6',
        blockHeight: 899450 + Math.floor(Math.random() * 100),
        rfc3161TimestampToken: 'MIIB/AYJKoZIhvcNAQcCoIIB7TCCAekCAQMxDzANBglghkgBZQMEAgEFADCH',
        publicNotaryService: 'Hackerland IP Defense Notary & Bitcoin OP_RETURN Anchor',
      },
      ipcClasses: ipcClasses.length > 0 ? ipcClasses : ['G06F 1/00'],
      abstractSummary,
      novelMechanisms: mechanisms.length > 0 ? mechanisms : [novelMechanisms],
      priorArtCitations: [],
      openArtifacts: [
        {
          id: `art_${newId}_primary`,
          artifactType: 'schematic_pdf',
          fileName: `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-open-hardware.pdf`,
          fileSizeBytes: 2048500,
          sha256Hash,
          downloadUrl: `https://cdn.hackerland.in/ip/${newId}-primary.pdf`,
        },
      ],
      nonAggressionPledgeSigned: true,
    };

    setCreatedPub(newPublication);
    setIsSuccess(true);
    onAdded(newPublication);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-defense-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-fg/40 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-hairline bg-surface-1 shadow-overlay p-6 sm:p-7 my-8 text-fg space-y-5">
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-fg-subtle hover:text-fg transition-colors p-1 rounded-full hover:bg-surface-2"
        >
          <X className="size-5" />
        </button>

        {isSuccess && createdPub ? (
          <div className="space-y-5 text-center py-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-success/10 border border-success/30 text-success-fg">
              <CheckCircle2 className="size-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-accent-soft text-accent-fg border border-accent/25 mb-2">
                PRIOR ART RECORD LOGGED
              </div>
              <h2 className="font-display text-headline-md font-bold text-fg">
                Invention Defensively Published
              </h2>
              <p className="text-body-sm text-fg-muted mt-1 max-w-md mx-auto">
                Your technical disclosure is now anchored to the IP Defense Ledger.
              </p>
            </div>

            <div className="rounded-xl border border-hairline bg-sunken p-4 text-left space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-hairline pb-2">
                <span className="text-fg-subtle">DISCLOSURE ID:</span>
                <span className="text-accent-fg font-bold">{createdPub.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fg-subtle">BLOCK HEIGHT:</span>
                <span className="text-fg font-semibold">#{createdPub.timestampProof.blockHeight}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fg-subtle">LICENSE:</span>
                <span className="text-fg">{createdPub.hardwareLicense}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fg-subtle">SHA-256:</span>
                <span className="text-accent-fg truncate max-w-[220px]">
                  {createdPub.timestampProof.sha256Hash}
                </span>
              </div>
            </div>

            <Button type="button" variant="primary" size="sm" onClick={onClose}>
              Done &amp; Return to Ledger
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-accent-fg font-semibold mb-1">
                <ShieldCheck className="size-3.5" />
                <span>DEFENSIVE PUBLICATION STUDIO</span>
              </div>
              <h2 id="submit-defense-title" className="font-display text-headline-sm font-bold text-fg">
                Defensively Publish Open Hardware
              </h2>
              <p className="text-body-xs text-fg-muted mt-1">
                Establish statutory prior art under USPTO 35 U.S.C. § 102 and Indian Patents Act § 29.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-fg-muted mb-1">Invention Title *</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Non-Contact Inductive Current Sensor for High-Voltage EV Inverter"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-fg-muted mb-1">Inventor Name *</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Rohan Sen"
                    value={inventorName}
                    onChange={(e) => setInventorName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-fg-muted mb-1">Handle *</label>
                  <Input
                    type="text"
                    required
                    placeholder="rohan_maker"
                    value={inventorHandle}
                    onChange={(e) => setInventorHandle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-fg-muted mb-1">Institution</label>
                  <Input
                    type="text"
                    placeholder="e.g. COEP Robotics"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-fg-muted mb-1">Domain</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as InventionCategory)}
                    className="h-11 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs text-fg focus:border-accent focus:outline-none"
                  >
                    <option value="clean_mobility_bms">Clean Mobility &amp; EV BMS</option>
                    <option value="avionics_aerospace">Avionics &amp; Aerospace</option>
                    <option value="biomedical_diagnostics">Biomedical Diagnostics</option>
                    <option value="robotics_actuation">Robotics &amp; Actuation</option>
                    <option value="climatetech_agri">Agritech &amp; Climatetech</option>
                    <option value="open_silicon_asic">Open Silicon &amp; ASIC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-fg-muted mb-1">Hardware License</label>
                  <select
                    value={license}
                    onChange={(e) => setLicense(e.target.value as HardwareLicense)}
                    className="h-11 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs text-fg focus:border-accent focus:outline-none"
                  >
                    <option value="CERN-OHL-P-2.0">CERN-OHL-P-2.0 (Permissive)</option>
                    <option value="CERN-OHL-W-2.0">CERN-OHL-W-2.0 (Weakly Reciprocal)</option>
                    <option value="CERN-OHL-S-2.0">CERN-OHL-S-2.0 (Strongly Reciprocal)</option>
                    <option value="TAPR-OHL-1.0">TAPR-OHL-1.0</option>
                    <option value="Apache-2.0">Apache-2.0</option>
                    <option value="MIT">MIT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-fg-muted mb-1">
                  IPC Classifications (comma-separated)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. H01M 10/44, G01R 31/36"
                  value={ipcInput}
                  onChange={(e) => setIpcInput(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-fg-muted mb-1">Abstract Summary *</label>
                <Textarea
                  rows={2}
                  required
                  placeholder="Describe the circuit, mechanical mechanism, or firmware architecture..."
                  value={abstractSummary}
                  onChange={(e) => setAbstractSummary(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-fg-muted mb-1">
                  Novel Technical Claims (one per line) *
                </label>
                <Textarea
                  rows={2}
                  required
                  placeholder="1. Interleaved planar transformer trace layout eliminating stray inductance..."
                  value={novelMechanisms}
                  onChange={(e) => setNovelMechanisms(e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono text-fg-muted">Primary Artifact SHA-256 Digest *</label>
                  <button
                    type="button"
                    onClick={handleGenerateSampleHash}
                    className="text-[11px] font-mono text-accent-fg hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="size-3" />
                    <span>Auto-Compute Test Hash</span>
                  </button>
                </div>
                <Input
                  type="text"
                  required
                  placeholder="64-character hexadecimal SHA-256 hash..."
                  value={sha256Hash}
                  onChange={(e) => setSha256Hash(e.target.value.trim().toLowerCase())}
                  className="font-mono text-xs"
                />
              </div>

              <div className="p-3.5 rounded-xl border border-accent/25 bg-accent-soft text-xs space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-fg">
                  <input
                    type="checkbox"
                    checked={agreePledge}
                    onChange={(e) => setAgreePledge(e.target.checked)}
                    className="mt-0.5 size-4 rounded border-line accent-accent"
                  />
                  <span>
                    <strong>Open Hardware Mutual Non-Aggression Pledge:</strong> I publish this design to the public domain or open hardware license and agree never to assert patents offensively against open builders.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button type="button" variant="secondary" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid} variant="primary" size="sm">
                Defensively Publish to Ledger
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
