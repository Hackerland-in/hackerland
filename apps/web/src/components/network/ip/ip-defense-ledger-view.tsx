'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { DefensivePublication } from '@hackerland/core';
import { verifyInventionIntegrity } from '@hackerland/core';
import {
  Search,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  PlusCircle,
  Hash,
} from 'lucide-react';
import { Badge, Button, Card, FilterChip, Input, cn } from '@hackerland/ui';
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

  const [selectedAffidavitPub, setSelectedAffidavitPub] = useState<DefensivePublication | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [verifierInput, setVerifierInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    matched: boolean;
    pub?: DefensivePublication;
  } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hackerland_ip_publications');
      if (saved) {
        const parsed = JSON.parse(saved) as DefensivePublication[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(initialPublications.map((p) => p.id));
          const custom = parsed.filter((p) => !existingIds.has(p.id));
          if (custom.length > 0) setPublications([...custom, ...initialPublications]);
        }
      }
    } catch {}
  }, [initialPublications]);

  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      if (selectedCategory !== 'all' && pub.category !== selectedCategory) return false;
      if (selectedLicense !== 'all' && pub.hardwareLicense !== selectedLicense) return false;
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
    const next = [newPub, ...publications];
    setPublications(next);
    try {
      const initialIds = new Set(initialPublications.map((p) => p.id));
      const custom = next.filter((p) => !initialIds.has(p.id));
      localStorage.setItem('hackerland_ip_publications', JSON.stringify(custom));
    } catch {}
  };

  return (
    <div className="space-y-6 min-w-0">
      {/* Defensive Pool CTA Banner */}
      <Card className="border-accent/25 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-accent-fg">
              <ShieldCheck className="size-3.5" />
              <span>DEFENSIVE PATENT POOL &amp; PRIOR ART LEDGER</span>
            </div>
            <h2 className="font-display text-headline-sm font-bold tracking-tight text-fg">
              Open Invention Network &amp; IP Defense Ledger
            </h2>
            <p className="text-body-xs sm:text-body-sm text-fg-muted leading-relaxed">
              Timestamp open hardware schematics, firmware, and CAD to establish statutory prior art under USPTO 35 U.S.C. § 102 and Indian Patents Act § 29.
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setShowSubmitModal(true)}
            className="shrink-0"
          >
            <PlusCircle className="size-3.5" />
            <span>Publish Defense Disclosure</span>
          </Button>
        </div>
      </Card>

      {/* Hash Verifier */}
      <Card className="border-hairline bg-surface-1 p-5 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-accent-fg">
            <Hash className="size-3.5" />
            <span>CRYPTOGRAPHIC PRIOR-ART INTEGRITY VERIFIER</span>
          </div>
          <span className="text-[11px] font-mono text-fg-subtle">RFC 3161 ANCHORED</span>
        </div>

        <form onSubmit={handleVerifyHash} className="flex flex-col sm:flex-row gap-2.5">
          <Input
            type="text"
            placeholder="Paste any SHA-256 digest (e.g. e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855)..."
            value={verifierInput}
            onChange={(e) => setVerifierInput(e.target.value)}
            className="flex-1 font-mono text-xs"
          />
          <Button type="submit" variant="secondary" size="sm" className="shrink-0">
            Verify Artifact Integrity
          </Button>
        </form>

        {verificationResult && (
          <div
            className={cn(
              'p-3.5 rounded-xl border text-xs font-mono flex items-start gap-2.5',
              verificationResult.matched
                ? 'bg-success/10 border-success/30 text-success-fg'
                : 'bg-danger/10 border-danger/30 text-danger-fg',
            )}
          >
            {verificationResult.matched && verificationResult.pub ? (
              <>
                <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-success-fg" />
                <div className="space-y-1">
                  <div className="font-bold text-fg">
                    VERIFIED PRIOR ART RECORD FOUND: #{verificationResult.pub.id}
                  </div>
                  <div className="text-[11px] text-fg-muted font-sans">
                    {verificationResult.pub.title} · Disclosed on{' '}
                    {new Date(verificationResult.pub.firstPublicDisclosureDate).toLocaleDateString()}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedAffidavitPub(verificationResult.pub!)}
                    className="text-[11px] underline text-accent-fg hover:text-accent pt-0.5"
                  >
                    View Statutory Prior Art Affidavit →
                  </button>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="size-4 shrink-0 mt-0.5 text-danger-fg" />
                <div>
                  <div className="font-bold text-fg">NO RECORD MATCHED ON DEFENSE LEDGER</div>
                  <div className="text-[11px] text-fg-muted font-sans">
                    This digest is not yet anchored. Publish a defensive disclosure to establish statutory prior art.
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </Card>

      {/* Search & Filter */}
      <Card className="border-hairline bg-surface-1 p-4 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fg-subtle" />
            <input
              type="text"
              placeholder="Search prior art disclosures by title, abstract, inventor, IPC class, or hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-line bg-sunken pl-9 pr-3 text-body-xs text-fg placeholder:text-fg-subtle focus:border-accent focus:bg-surface-1 focus:outline-none"
            />
          </div>

          <select
            aria-label="Filter by license"
            value={selectedLicense}
            onChange={(e) => setSelectedLicense(e.target.value)}
            className="h-10 rounded-xl border border-line bg-sunken px-3 text-body-xs text-fg focus:border-accent focus:outline-none"
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

        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-hairline">
          {[
            { id: 'all', label: 'All Inventions' },
            { id: 'clean_mobility_bms', label: 'EV & Battery BMS' },
            { id: 'avionics_aerospace', label: 'Avionics & Drones' },
            { id: 'biomedical_diagnostics', label: 'Medical Diagnostics' },
            { id: 'robotics_actuation', label: 'Robotics & Actuators' },
            { id: 'climatetech_agri', label: 'Agritech & Soil' },
            { id: 'open_silicon_asic', label: 'Open Silicon & ASICs' },
          ].map((cat) => (
            <FilterChip
              key={cat.id}
              selected={selectedCategory === cat.id}
              tone="accent"
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </FilterChip>
          ))}
        </div>
      </Card>

      {/* Ledger Feed */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-body-xs text-fg-subtle px-1 font-mono">
          <span>PUBLIC DEFENSE LEDGER ({filteredPublications.length} INVENTIONS)</span>
          <span>MUTUAL NON-AGGRESSION PLEDGE VERIFIED</span>
        </div>

        <div className="space-y-3.5">
          {filteredPublications.map((pub) => (
            <Card
              key={pub.id}
              className="border-hairline bg-surface-1 p-5 space-y-4 hover:border-accent/40 transition-all min-w-0 [overflow-wrap:anywhere]"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="accent" variant="outline">{pub.id}</Badge>
                    <Badge tone="neutral" variant="outline">{pub.hardwareLicense}</Badge>
                    <span className="text-[11px] font-mono text-fg-subtle">
                      BLOCK #{pub.timestampProof.blockHeight}
                    </span>
                  </div>
                  <h3 className="font-display text-body-lg font-bold text-fg hover:text-accent-fg transition-colors">
                    <Link href={`/network/ip/${pub.id}`}>{pub.title}</Link>
                  </h3>
                  <div className="text-body-xs text-fg-muted flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>
                      Inventor: <strong className="text-fg">{pub.inventor.name}</strong> (@{pub.inventor.handle})
                    </span>
                    {pub.inventor.organization && (
                      <>
                        <span>·</span>
                        <span>{pub.inventor.organization}</span>
                      </>
                    )}
                    <span>·</span>
                    <span className="font-mono text-fg-subtle">
                      {new Date(pub.firstPublicDisclosureDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedAffidavitPub(pub)}
                  >
                    <FileText className="size-3.5" />
                    <span>Affidavit</span>
                  </Button>
                  <Button asChild size="sm" variant="primary">
                    <Link href={`/network/ip/${pub.id}`}>
                      <span>Proof &amp; CAD</span>
                      <ChevronRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>

              <p className="text-body-xs sm:text-body-sm text-fg-muted leading-relaxed">
                {pub.abstractSummary}
              </p>

              <div className="p-3.5 rounded-xl border border-hairline bg-sunken space-y-1.5">
                <span className="text-[11px] font-mono text-accent-fg block font-semibold">
                  NOVEL HARDWARE MECHANISMS ANCHORED AS PRIOR ART:
                </span>
                <ul className="space-y-1 text-body-xs text-fg-muted list-disc list-inside">
                  {pub.novelMechanisms.map((mech, i) => (
                    <li key={i} className="line-clamp-2">{mech}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-hairline text-body-xs font-mono">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-fg-subtle text-[11px]">IPC:</span>
                  {pub.ipcClasses.map((cls) => (
                    <span
                      key={cls}
                      className="px-2 py-0.5 rounded-full bg-sunken border border-hairline text-[11px] text-accent-fg font-semibold"
                    >
                      {cls}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-fg-subtle text-[11px]">
                    {pub.openArtifacts.length} ARTIFACTS
                  </span>
                  {pub.openArtifacts.map((art) => (
                    <span
                      key={art.id}
                      className="px-2 py-0.5 rounded-full bg-sunken border border-hairline text-[10px] text-fg-muted"
                    >
                      {art.artifactType.replace('_', ' ').toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedAffidavitPub && (
        <PriorArtCertificateModal
          publication={selectedAffidavitPub}
          onClose={() => setSelectedAffidavitPub(null)}
        />
      )}

      {showSubmitModal && (
        <SubmitDefenseModal
          onClose={() => setShowSubmitModal(false)}
          onAdded={handleAddedNewPub}
        />
      )}
    </div>
  );
}
