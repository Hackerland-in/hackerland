'use client';

import { useState } from 'react';
import type { DefensivePublication, InventionCategory, HardwareLicense } from '@hackerland/core';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@hackerland/ui';

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
    // Generate valid 64-char hex
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl p-6 sm:p-8 my-8 text-neutral-100 space-y-6">
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-neutral-800"
        >
          <X className="size-5" />
        </button>

        {isSuccess && createdPub ? (
          <div className="space-y-6 text-center py-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="size-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                PRIOR ART RECORD LOGGED
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Invention Defensively Published</h2>
              <p className="text-sm text-neutral-400 mt-1 max-w-md mx-auto">
                Your technical disclosure has been permanently anchored to the IP Defense Ledger. It is legally cited against future predatory claims.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-neutral-950/60 p-5 text-left space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-neutral-400">DISCLOSURE ID:</span>
                <span className="text-emerald-400 font-bold text-sm tracking-wider">{createdPub.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">BLOCK HEIGHT:</span>
                <span className="text-white font-medium">#{createdPub.timestampProof.blockHeight}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">LICENSE:</span>
                <span className="text-white">{createdPub.hardwareLicense}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">SHA-256 DIGEST:</span>
                <span className="text-emerald-400 truncate max-w-[220px]">{createdPub.timestampProof.sha256Hash}</span>
              </div>
            </div>

            <Button
              variant="primary"
              className="text-xs font-mono bg-emerald-600 hover:bg-emerald-500 text-white"
              onClick={onClose}
            >
              Done & Return to Ledger
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <ShieldCheck className="size-3.5" />
                <span>DEFENSIVE PUBLICATION STUDIO</span>
              </div>
              <h2 id="submit-defense-title" className="text-xl font-bold text-white">
                Defensively Publish Open Hardware
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Establish incontrovertible prior art under USPTO 35 U.S.C. § 102 and Indian Patents Act § 29 to protect open makers.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Invention Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Non-Contact Inductive Current Sensor for High-Voltage EV Inverter"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Inventor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan Sen"
                    value={inventorName}
                    onChange={(e) => setInventorName(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Hackerland Handle *</label>
                  <input
                    type="text"
                    required
                    placeholder="rohan_maker"
                    value={inventorHandle}
                    onChange={(e) => setInventorHandle(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Institution / Lab</label>
                  <input
                    type="text"
                    placeholder="e.g. COEP Robotics"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Engineering Domain</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as typeof category)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="clean_mobility_bms">Clean Mobility & EV BMS</option>
                    <option value="avionics_aerospace">Avionics & Aerospace</option>
                    <option value="biomedical_diagnostics">Biomedical Diagnostics</option>
                    <option value="robotics_actuation">Robotics & Actuation</option>
                    <option value="climatetech_agri">Agritech & Climatetech</option>
                    <option value="open_silicon_asic">Open Silicon & ASIC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Open Hardware License</label>
                  <select
                    value={license}
                    onChange={(e) => setLicense(e.target.value as typeof license)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
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
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  IPC / CPC Patent Classifications (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. H01M 10/44, G01R 31/36"
                  value={ipcInput}
                  onChange={(e) => setIpcInput(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Abstract Summary *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detailed summary describing the physical circuit, mechanical mechanism, or firmware architecture..."
                  value={abstractSummary}
                  onChange={(e) => setAbstractSummary(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  Novel Technical Claims & Hardware Mechanisms (one per line) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="1. Interleaved planar transformer trace layout eliminating stray inductance..."
                  value={novelMechanisms}
                  onChange={(e) => setNovelMechanisms(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono text-neutral-400">Primary Artifact SHA-256 Digest *</label>
                  <button
                    type="button"
                    onClick={handleGenerateSampleHash}
                    className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="size-3" /> Auto-Compute Test Hash
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="64-character hexadecimal SHA-256 hash of schematic or Gerber zip..."
                  value={sha256Hash}
                  onChange={(e) => setSha256Hash(e.target.value.trim().toLowerCase())}
                  className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs font-mono text-emerald-300 placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Non-Aggression Pledge Agreement */}
              <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-xs space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-neutral-200">
                  <input
                    type="checkbox"
                    checked={agreePledge}
                    onChange={(e) => setAgreePledge(e.target.checked)}
                    className="mt-0.5 rounded border-neutral-700 bg-neutral-900 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>
                    <strong>Open Hardware Mutual Non-Aggression Pledge:</strong> I irrevocably publish this design to the public domain or open hardware license, and agree never to assert patents offensively against fellow open-source builders.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={onClose} className="text-xs">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid}
                variant="primary"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono disabled:opacity-40"
              >
                Defensively Publish to Ledger
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
