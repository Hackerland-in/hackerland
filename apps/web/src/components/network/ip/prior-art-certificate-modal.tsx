'use client';

import { useState } from 'react';
import type { DefensivePublication } from '@hackerland/core';
import { generatePriorArtAffidavitText } from '@hackerland/core';
import {
  X,
  Copy,
  Check,
  ShieldCheck,
  Download,
  FileText,
  Lock,
} from 'lucide-react';
import { Button } from '@hackerland/ui';

interface PriorArtCertificateModalProps {
  publication: DefensivePublication;
  onClose: () => void;
}

export function PriorArtCertificateModal({
  publication,
  onClose,
}: PriorArtCertificateModalProps) {
  const [copied, setCopied] = useState(false);
  const affidavitText = generatePriorArtAffidavitText(publication);

  const handleCopy = () => {
    navigator.clipboard.writeText(affidavitText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([affidavitText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${publication.id}-prior-art-affidavit.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="affidavit-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl p-6 sm:p-8 my-8 text-neutral-100 space-y-6">
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-neutral-800"
        >
          <X className="size-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <ShieldCheck className="size-3.5" />
            <span>STATUTORY PRIOR ART CERTIFICATE · USPTO § 102 & INDIA § 29 COMPLIANT</span>
          </div>
          <h2 id="affidavit-title" className="text-xl font-bold text-white">
            Prior-Art Defense Affidavit
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Official cryptographic disclosure token proving indisputable prior public existence to invalidate competing predatory patent claims.
          </p>
        </div>

        {/* Certificate Pre Block */}
        <div className="relative rounded-xl border border-white/10 bg-neutral-950 p-4 font-mono text-[11px] text-neutral-300 overflow-x-auto max-h-[380px] leading-relaxed select-all">
          <pre className="whitespace-pre-wrap">{affidavitText}</pre>
        </div>

        {/* Proof Check Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-white/10 bg-neutral-950/60 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Lock className="size-3.5 text-emerald-400" />
            <span className="text-neutral-400">LEDGER BLOCK:</span>
            <span className="text-white font-bold">#{publication.timestampProof.blockHeight}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">SHA-256:</span>
            <span className="text-emerald-400 truncate max-w-[200px]">
              {publication.timestampProof.sha256Hash}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            className="text-xs font-mono w-full sm:w-auto"
          >
            <Download className="size-3.5 mr-1.5" />
            Download Affidavit (.txt)
          </Button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              className="text-xs font-mono"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 mr-1.5 text-emerald-400" />
                  Copied to Clipboard
                </>
              ) : (
                <>
                  <Copy className="size-3.5 mr-1.5" />
                  Copy Legal Text
                </>
              )}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onClose}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
