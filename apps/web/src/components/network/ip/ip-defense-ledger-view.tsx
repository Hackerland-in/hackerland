'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { DefensivePublication, HardwareLicense, InventionCategory } from '@hackerland/core';
import { verifyInventionIntegrity } from '@hackerland/core';
import {
  Search,
  ShieldCheck,
  Lock,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Cpu,
  PlusCircle,
  Hash,
} from 'lucide-react';
import { Button } from '@hackerland/ui';
import { PriorArtCertificateModal } from './prior-art-certificate-modal';
import { SubmitDefenseModal } from './submit-defense-modal';

interface IpDefenseLedgerViewProps {
  initialPublications: DefensivePublication[];
}

export function IpDefenseLedgerView({ initialPublications }: IpDefenseLedgerViewProps) {
  const [publications, setPublications] = useState<DefensivePublication[]>(initialPublications);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLicense, setSelectedLicense] = useState<string>('all');

  // Modals state
  const [selectedAffidavitPub, setSelectedAffidavitPub] = useState<DefensivePublication | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Hash Verifier State
  const [verifierInput, setVerifierInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    matched: boolean;
    pub?: DefensivePublication;
  } | null>(null);

  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      if (selectedCategory !== 'all' && pub.category !== selectedCategory) {
        return false;
      }
      if (selectedLicense !== 'all' && pub.hardwareLicense !== selectedLicense) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = pub.title.toLowerCase().includes(q);
        const matchesAbstract = pub.abstractSummary.toLowerCase().includes(q);
        const matchesInventor =
          pub.inventor.name.toLowerCase().includes(q) || pub.inventor.handle.toLowerCase().includes(q);
        const matchesIpc = pub.ipcClasses.some((c) => c.toLowerCase().includes(q));
        const matchesHash = pub.timestampProof.sha256Hash.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAbstract && !matchesInventor && !matchesIpc && !matchesHash) {
          return false;
        }
      }
      return true;
    });
  }, [publications, selectedCategory, selectedLicense, searchQuery]);

  const handleVerifyHash = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHash = verifierInput.trim().toLowerCase();
    if (!cleanHash) return;

    const match = publications.find((p) => verifyInventionIntegrity(p, cleanHash));
    if (match) {
      setVerificationResult({ matched: true, pub: match });
    } else {
      setVerificationResult({ matched: false });
    }
  };

  const handleAddedNewPub = (newPub: DefensivePublication) => {
    setPublications((prev) => [newPub, ...prev]);
  };

  return (
    <div className="space-y-8 min-w-0">
      {/* Hero Non-Aggression Banner */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-cyan-950/30 p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="size-3.5" />
              <span>DEFENSIVE PATENT POOL & PRIOR ART LEDGER</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Open Invention Network & IP Defense Ledger
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Cryptographically timestamp open hardware schematics, firmware, and CAD to establish prior art under USPTO 35 U.S.C. § 102 and Indian Patents Act § 29. Protect indie makers from predatory patent trolls.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowSubmitModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono"
            >
              <PlusCircle className="size-3.5 mr-1.5" />
              Publish Defense Disclosure
            </Button>
          </div>
        </div>
      </div>

      {/* Cryptographic Hash Verifier Tool */}
      <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Hash className="size-3.5" />
            <span>CRYPTOGRAPHIC PRIOR-ART INTEGRITY VERIFIER</span>
          </div>
          <span className="text-[11px] font-mono text-neutral-500">RFC 3161 ANCHORED</span>
        </div>

        <form onSubmit={handleVerifyHash} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Paste any SHA-256 digest (e.g. e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855)..."
              value={verifierInput}
              onChange={(e) => setVerifierInput(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3.5 py-2 text-xs font-mono text-emerald-300 placeholder-neutral-600 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="text-xs font-mono shrink-0">
            Verify Artifact Integrity
          </Button>
        </form>

        {verificationResult && (
          <div
            className={`p-3.5 rounded-lg border text-xs font-mono flex items-start gap-2.5 ${
              verificationResult.matched
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            {verificationResult.matched && verificationResult.pub ? (
              <>
                <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-emerald-400" />
                <div className="space-y-1">
                  <div className="font-bold text-white">
                    VERIFIED PRIOR ART RECORD FOUND: #{verificationResult.pub.id}
                  </div>
                  <div className="text-[11px] text-neutral-300 font-sans">
                    {verificationResult.pub.title} · Disclosed on{' '}
                    {new Date(verificationResult.pub.firstPublicDisclosureDate).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => setSelectedAffidavitPub(verificationResult.pub!)}
                    className="text-[11px] underline text-emerald-400 hover:text-emerald-300 pt-0.5"
                  >
                    View Statutory Prior Art Affidavit →
                  </button>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-400" />
                <div>
                  <div className="font-bold text-white">NO RECORD MATCHED ON DEFENSE LEDGER</div>
                  <div className="text-[11px] text-neutral-400 font-sans">
                    This file hash is not yet anchored. Defensively publish it now to establish prior art.
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-4 sm:p-5 backdrop-blur-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search prior art disclosures by title, abstract, inventor, IPC class, or hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-neutral-950 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <select
              aria-label="Filter by license"
              value={selectedLicense}
              onChange={(e) => setSelectedLicense(e.target.value)}
              className="rounded-lg border border-white/10 bg-neutral-950 px-3 py-2.5 text-xs text-neutral-300 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All Licenses</option>
              <option value="CERN-OHL-P-2.0">CERN-OHL-P-2.0 (Permissive)</option>
              <option value="CERN-OHL-W-2.0">CERN-OHL-W-2.0 (Weak)</option>
              <option value="CERN-OHL-S-2.0">CERN-OHL-S-2.0 (Strong)</option>
              <option value="TAPR-OHL-1.0">TAPR-OHL-1.0</option>
              <option value="Apache-2.0">Apache-2.0</option>
              <option value="MIT">MIT</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-white/5">
          {[
            { id: 'all', label: 'All Inventions' },
            { id: 'clean_mobility_bms', label: 'EV & Battery BMS' },
            { id: 'avionics_aerospace', label: 'Avionics & Drones' },
            { id: 'biomedical_diagnostics', label: 'Medical Diagnostics' },
            { id: 'robotics_actuation', label: 'Robotics & Actuators' },
            { id: 'climatetech_agri', label: 'Agritech & Soil' },
            { id: 'open_silicon_asic', label: 'Open Silicon & ASICs' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-neutral-800/40 text-neutral-400 hover:text-white border border-transparent hover:border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Publications Ledger List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-neutral-400 px-1 font-mono">
          <span>PUBLIC DEFENSE LEDGER ({filteredPublications.length} INVENTIONS)</span>
          <span>MUTUAL NON-AGGRESSION PLEDGE VERIFIED</span>
        </div>

        <div className="space-y-4">
          {filteredPublications.map((pub) => (
            <div
              key={pub.id}
              className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6 space-y-4 hover:border-emerald-500/40 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {pub.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-800 text-neutral-300 border border-white/5">
                      {pub.hardwareLicense}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500">
                      BLOCK #{pub.timestampProof.blockHeight}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white hover:text-emerald-400 transition-colors">
                    <Link href={`/network/ip/${pub.id}`}>{pub.title}</Link>
                  </h3>
                  <div className="text-xs text-neutral-400 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>Inventor: <strong className="text-neutral-200">{pub.inventor.name}</strong> (@{pub.inventor.handle})</span>
                    {pub.inventor.organization && (
                      <>
                        <span>·</span>
                        <span>{pub.inventor.organization}</span>
                      </>
                    )}
                    <span>·</span>
                    <span className="text-neutral-500 font-mono">
                      {new Date(pub.firstPublicDisclosureDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedAffidavitPub(pub)}
                    className="text-xs font-mono"
                  >
                    <FileText className="size-3.5 mr-1.5" />
                    Affidavit
                  </Button>
                  <Link href={`/network/ip/${pub.id}`}>
                    <Button
                      size="sm"
                      variant="primary"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono"
                    >
                      Proof & CAD
                      <ChevronRight className="size-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                {pub.abstractSummary}
              </p>

              {/* Novel Mechanisms Highlights */}
              <div className="p-3.5 rounded-xl border border-white/5 bg-neutral-950/40 space-y-1.5">
                <span className="text-[11px] font-mono text-emerald-400 block font-medium">
                  NOVEL HARDWARE MECHANISMS ANCHORED AS PRIOR ART:
                </span>
                <ul className="space-y-1 text-xs text-neutral-400 list-disc list-inside">
                  {pub.novelMechanisms.map((mech, i) => (
                    <li key={i} className="line-clamp-2">
                      {mech}
                    </li>
                  ))}
                </ul>
              </div>

              {/* IPC Classes & Artifacts */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-neutral-500 text-[11px]">IPC CLASSES:</span>
                  {pub.ipcClasses.map((cls) => (
                    <span
                      key={cls}
                      className="px-2 py-0.5 rounded bg-neutral-950 border border-white/5 text-[11px] text-cyan-300"
                    >
                      {cls}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-neutral-500 text-[11px]">
                    {pub.openArtifacts.length} OPEN ARTIFACTS
                  </span>
                  <div className="flex items-center gap-1.5">
                    {pub.openArtifacts.map((art) => (
                      <span
                        key={art.id}
                        className="px-2 py-0.5 rounded bg-neutral-950 border border-white/5 text-[10px] text-neutral-300"
                      >
                        {art.artifactType.replace('_', ' ').toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prior Art Certificate Modal */}
      {selectedAffidavitPub && (
        <PriorArtCertificateModal
          publication={selectedAffidavitPub}
          onClose={() => setSelectedAffidavitPub(null)}
        />
      )}

      {/* Submit Defense Modal */}
      {showSubmitModal && (
        <SubmitDefenseModal
          onClose={() => setShowSubmitModal(false)}
          onAdded={handleAddedNewPub}
        />
      )}
    </div>
  );
}
