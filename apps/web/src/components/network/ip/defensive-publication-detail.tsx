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
import { Button } from '@hackerland/ui';
import { PriorArtCertificateModal } from './prior-art-certificate-modal';

interface DefensivePublicationDetailProps {
  publication: DefensivePublication;
}

export function DefensivePublicationDetail({ publication }: DefensivePublicationDetailProps) {
  const [showAffidavit, setShowAffidavit] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(publication.timestampProof.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-8 min-w-0">
      {/* Back Link */}
      <div>
        <Link
          href="/network/ip"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to Open Invention Network & IP Defense Ledger
        </Link>
      </div>

      {/* Hero Header */}
      <div className="rounded-2xl border border-white/10 bg-neutral-900/80 p-6 sm:p-8 backdrop-blur-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="size-3.5" /> PRIOR ART DISCLOSURE #{publication.id}
              </span>
              <span className="px-2.5 py-1 rounded text-xs font-mono bg-neutral-800 text-neutral-300 border border-white/5">
                {publication.hardwareLicense}
              </span>
              <span className="px-2.5 py-1 rounded text-xs font-mono text-neutral-400 bg-neutral-950 border border-white/5">
                BLOCK #{publication.timestampProof.blockHeight}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {publication.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-400">
              <span>
                Disclosed by <strong className="text-neutral-200">{publication.inventor.name}</strong> (@{publication.inventor.handle})
              </span>
              {publication.inventor.organization && (
                <>
                  <span>·</span>
                  <span>{publication.inventor.organization}</span>
                </>
              )}
              <span>·</span>
              <span className="font-mono">
                {new Date(publication.firstPublicDisclosureDate).toUTCString()}
              </span>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed pt-1">
              {publication.abstractSummary}
            </p>
          </div>

          <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
            <Button
              variant="primary"
              onClick={() => setShowAffidavit(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono"
            >
              <FileText className="size-3.5 mr-1.5" />
              Generate Prior-Art Affidavit
            </Button>
            <Button
              variant="secondary"
              onClick={handleCopyHash}
              className="text-xs font-mono"
            >
              {copiedHash ? (
                <>
                  <Check className="size-3.5 mr-1.5 text-emerald-400" />
                  Hash Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5 mr-1.5" />
                  Copy SHA-256 Digest
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Cryptographic Proof Strip */}
        <div className="p-4 rounded-xl border border-white/10 bg-neutral-950 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-400 border-b border-white/5 pb-2">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Lock className="size-3.5" /> RFC 3161 CRYPTOGRAPHIC TIMESTAMP TOKEN
            </span>
            <span className="text-[11px] text-neutral-500">{publication.timestampProof.publicNotaryService}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
            <div>
              <span className="text-neutral-500 block">SHA-256 HASH:</span>
              <span className="text-emerald-300 break-all select-all">{publication.timestampProof.sha256Hash}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">MERKLE ROOT:</span>
              <span className="text-neutral-300 break-all select-all">{publication.timestampProof.merkleRoot}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Technical Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Novel Mechanisms & Open Artifacts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Novel Mechanisms */}
          <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="size-4 text-emerald-400" />
              Novel Technical Claims & Hardware Mechanisms
            </h2>
            <p className="text-xs text-neutral-400">
              The following physical mechanisms and topologies are irrevocably established as prior art:
            </p>
            <div className="space-y-3 pt-1">
              {publication.novelMechanisms.map((mech, index) => (
                <div key={index} className="flex items-start gap-3 text-xs text-neutral-300 leading-relaxed">
                  <span className="size-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-mono text-[11px] shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p>{mech}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Open Hardware Artifacts Registry */}
          <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="size-4 text-cyan-400" />
                Anchored Open Hardware Artifacts ({publication.openArtifacts.length})
              </h2>
              <span className="text-xs font-mono text-neutral-400">VERIFIABLE DOWNLOADS</span>
            </div>

            <div className="space-y-3">
              {publication.openArtifacts.map((art) => (
                <div
                  key={art.id}
                  className="rounded-lg border border-white/5 bg-neutral-950 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-white font-medium">{art.fileName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-400">
                        {art.artifactType.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500">
                      {(art.fileSizeBytes / 1024 / 1024).toFixed(2)} MB · SHA-256: {art.sha256Hash.slice(0, 16)}...
                    </div>
                  </div>

                  {art.downloadUrl && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => alert(`Initiating download for ${art.fileName}...`)}
                      className="text-xs font-mono shrink-0"
                    >
                      <Download className="size-3.5 mr-1.5" />
                      Download
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Prior Art Citations */}
          {publication.priorArtCitations.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-6 space-y-4">
              <h2 className="text-base font-bold text-white">
                Prior Art Citations & Distinction Archaeology
              </h2>
              <p className="text-xs text-neutral-400">
                Explicit technical distinctions demonstrating why this disclosure cannot be anticipated by earlier commercial patents:
              </p>

              <div className="space-y-3 pt-1">
                {publication.priorArtCitations.map((cit, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-neutral-950 border border-white/5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{cit.title}</span>
                      <span className="font-mono text-[11px] text-amber-400">{cit.patentOrPaperId}</span>
                    </div>
                    <p className="text-neutral-400 leading-relaxed text-[11px]">
                      {cit.distinctionSummary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Legal Enforcement & Non-Aggression */}
        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-400" />
              Statutory Prior Art Protection
            </h3>
            <p className="text-neutral-400 leading-relaxed">
              This publication constitutes an official defensive publication under:
            </p>
            <ul className="space-y-2 text-neutral-300 list-disc list-inside text-[11px]">
              <li><strong>USPTO 35 U.S.C. § 102(a)(1)</strong> — Prior public disclosure prior to effective filing date.</li>
              <li><strong>The Patents Act 1970 (India) § 29 & § 30</strong> — Anticipation by public prior publication.</li>
              <li><strong>European Patent Convention (EPC) Art. 54(2)</strong> — State of the art available to the public worldwide.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-6 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white">Mutual Non-Aggression</h3>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              The author has signed the <strong>Hackerland Open Hardware Non-Aggression Pledge</strong>, agreeing never to assert patents offensively against downstream makers who build upon this work.
            </p>
          </div>
        </div>
      </div>

      {/* Affidavit Modal */}
      {showAffidavit && (
        <PriorArtCertificateModal
          publication={publication}
          onClose={() => setShowAffidavit(false)}
        />
      )}
    </div>
  );
}
