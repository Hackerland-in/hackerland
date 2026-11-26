'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { DefensivePublication } from '@hackerland/core';
import {
  ShieldCheck,
  Lock,
  Download,
  FileText,
  Copy,
  Check,
  ArrowLeft,
  Cpu,
  Layers,
} from 'lucide-react';
import { Badge, Button, Card } from '@hackerland/ui';
import { PriorArtCertificateModal } from './prior-art-certificate-modal';

interface DefensivePublicationDetailProps {
  publication: DefensivePublication;
}

export function DefensivePublicationDetail({ publication }: DefensivePublicationDetailProps) {
  const [showAffidavit, setShowAffidavit] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const handleCopyHash = () => {
    try {
      navigator.clipboard?.writeText(publication.timestampProof.sha256Hash);
    } catch {}
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-6 min-w-0">
      <div className="rounded-xl border border-hairline bg-surface-1 px-4 py-3">
        <Link
          href="/network/ip"
          className="inline-flex items-center gap-1.5 text-body-xs font-mono text-fg-muted hover:text-accent-fg transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Open Invention Network &amp; IP Defense Ledger</span>
        </Link>
      </div>

      <Card className="border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent" variant="outline">
                <ShieldCheck className="size-3 mr-1 inline" />
                PRIOR ART DISCLOSURE #{publication.id}
              </Badge>
              <Badge tone="neutral" variant="outline">{publication.hardwareLicense}</Badge>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono text-fg-muted bg-surface-1 border border-hairline">
                BLOCK #{publication.timestampProof.blockHeight}
              </span>
            </div>

            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
              {publication.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body-xs text-fg-muted">
              <span>
                Disclosed by <strong className="text-fg">{publication.inventor.name}</strong> (@{publication.inventor.handle})
              </span>
              {publication.inventor.organization && <span>· {publication.inventor.organization}</span>}
              <span className="font-mono">
                · {new Date(publication.firstPublicDisclosureDate).toUTCString()}
              </span>
            </div>

            <p className="text-body-sm text-fg-muted leading-relaxed pt-1">
              {publication.abstractSummary}
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
            <Button type="button" variant="primary" size="sm" onClick={() => setShowAffidavit(true)}>
              <FileText className="size-3.5" />
              <span>Generate Prior-Art Affidavit</span>
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={handleCopyHash}>
              {copiedHash ? (
                <>
                  <Check className="size-3.5 text-success-fg" />
                  <span>Hash Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy SHA-256 Digest</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-hairline bg-surface-1 font-mono text-xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-fg-muted border-b border-hairline pb-2">
            <span className="flex items-center gap-1.5 text-accent-fg font-semibold">
              <Lock className="size-3.5" />
              <span>RFC 3161 CRYPTOGRAPHIC TIMESTAMP TOKEN</span>
            </span>
            <span className="text-[11px] text-fg-subtle">{publication.timestampProof.publicNotaryService}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-1">
            <div>
              <span className="text-fg-subtle block">SHA-256 HASH:</span>
              <span className="text-fg font-semibold break-all select-all">
                {publication.timestampProof.sha256Hash}
              </span>
            </div>
            <div>
              <span className="text-fg-subtle block">MERKLE ROOT:</span>
              <span className="text-fg-muted break-all select-all">
                {publication.timestampProof.merkleRoot}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <Card className="border-hairline bg-surface-1 p-5 space-y-3.5">
            <h2 className="font-display text-body-lg font-bold text-fg flex items-center gap-2">
              <Cpu className="size-4 text-accent" />
              <span>Novel Technical Claims &amp; Hardware Mechanisms</span>
            </h2>
            <p className="text-body-xs text-fg-muted">
              The following physical mechanisms and topologies are irrevocably established as prior art:
            </p>
            <div className="space-y-2.5">
              {publication.novelMechanisms.map((mech, index) => (
                <div key={index} className="flex items-start gap-2.5 text-body-xs text-fg leading-relaxed">
                  <span className="size-5 rounded-full bg-accent-soft text-accent-fg border border-accent/25 flex items-center justify-center font-mono text-[11px] font-bold shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p>{mech}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-hairline bg-surface-1 p-5 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-body-lg font-bold text-fg flex items-center gap-2">
                <Layers className="size-4 text-accent" />
                <span>Anchored Open Hardware Artifacts ({publication.openArtifacts.length})</span>
              </h2>
              <span className="text-[11px] font-mono text-fg-subtle">VERIFIABLE DOWNLOADS</span>
            </div>

            <div className="space-y-2.5">
              {publication.openArtifacts.map((art) => (
                <div
                  key={art.id}
                  className="rounded-xl border border-hairline bg-sunken p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-body-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-fg font-semibold truncate">{art.fileName}</span>
                      <Badge tone="neutral" variant="outline">{art.artifactType.toUpperCase()}</Badge>
                    </div>
                    <div className="text-[11px] font-mono text-fg-subtle">
                      {(art.fileSizeBytes / 1024 / 1024).toFixed(2)} MB · SHA-256: {art.sha256Hash.slice(0, 16)}...
                    </div>
                  </div>

                  {art.downloadUrl && (
                    <Button asChild size="sm" variant="secondary" className="shrink-0">
                      <a href={art.downloadUrl} download={art.fileName}>
                        <Download className="size-3.5" />
                        <span>Download</span>
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {publication.priorArtCitations.length > 0 && (
            <Card className="border-hairline bg-surface-1 p-5 space-y-3">
              <h2 className="font-display text-body-lg font-bold text-fg">
                Prior Art Citations &amp; Distinction Archaeology
              </h2>
              <p className="text-body-xs text-fg-muted">
                Explicit technical distinctions establishing novelty over earlier disclosures:
              </p>

              <div className="space-y-2.5">
                {publication.priorArtCitations.map((cit, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-sunken border border-hairline space-y-1 text-body-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-fg">{cit.title}</span>
                      <span className="font-mono text-[11px] text-accent-fg font-semibold">
                        {cit.patentOrPaperId}
                      </span>
                    </div>
                    <p className="text-fg-muted leading-relaxed text-[11px]">{cit.distinctionSummary}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="border-hairline bg-surface-1 p-5 space-y-3 text-body-xs">
            <h3 className="font-display text-body-md font-bold text-fg flex items-center gap-2">
              <ShieldCheck className="size-4 text-accent" />
              <span>Statutory Prior Art Protection</span>
            </h3>
            <p className="text-fg-muted leading-relaxed">
              This publication constitutes an official defensive publication under:
            </p>
            <ul className="space-y-2 text-fg-muted list-disc list-inside text-[11px]">
              <li><strong className="text-fg">USPTO 35 U.S.C. § 102(a)(1)</strong> — Prior public disclosure prior to effective filing date.</li>
              <li><strong className="text-fg">The Patents Act 1970 (India) § 29 &amp; § 30</strong> — Anticipation by public prior publication.</li>
              <li><strong className="text-fg">European Patent Convention (EPC) Art. 54(2)</strong> — State of the art available worldwide.</li>
            </ul>
          </Card>

          <Card className="border-hairline bg-surface-1 p-5 space-y-2 text-body-xs">
            <h3 className="font-display text-body-md font-bold text-fg">Mutual Non-Aggression</h3>
            <p className="text-fg-muted leading-relaxed text-[11px]">
              The author has signed the <strong className="text-fg">Hackerland Open Hardware Non-Aggression Pledge</strong>, agreeing never to assert patents offensively against downstream makers.
            </p>
          </Card>
        </div>
      </div>

      {showAffidavit && (
        <PriorArtCertificateModal
          publication={publication}
          onClose={() => setShowAffidavit(false)}
        />
      )}
    </div>
  );
}
