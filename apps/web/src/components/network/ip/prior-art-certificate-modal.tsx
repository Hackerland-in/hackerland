'use client';

import { useState } from 'react';
import type { DefensivePublication } from '@hackerland/core';
import { generatePriorArtAffidavitText } from '@hackerland/core';
import { X, Copy, Check, ShieldCheck, Download, Lock } from 'lucide-react';
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
    try {
      navigator.clipboard?.writeText(affidavitText);
    } catch {}
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-fg/40 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl rounded-2xl border border-hairline bg-surface-1 shadow-overlay p-6 sm:p-8 my-8 text-fg space-y-5">
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-fg-subtle hover:text-fg transition-colors p-1 rounded-full hover:bg-surface-2"
        >
          <X className="size-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-accent-fg font-semibold mb-1">
            <ShieldCheck className="size-3.5" />
            <span>STATUTORY PRIOR ART CERTIFICATE · USPTO § 102 &amp; INDIA § 29</span>
          </div>
          <h2 id="affidavit-title" className="font-display text-headline-sm font-bold text-fg">
            Prior-Art Defense Affidavit
          </h2>
          <p className="text-body-xs text-fg-muted mt-1">
            Cryptographic disclosure certificate proving prior public art to defend against competing patent claims.
          </p>
        </div>

        <div className="rounded-xl border border-hairline bg-sunken p-4 font-mono text-[11px] text-fg overflow-x-auto max-h-[360px] leading-relaxed select-all">
          <pre className="whitespace-pre-wrap">{affidavitText}</pre>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-hairline bg-sunken text-xs font-mono">
          <div className="flex items-center gap-2">
            <Lock className="size-3.5 text-accent" />
            <span className="text-fg-subtle">LEDGER BLOCK:</span>
            <span className="text-fg font-bold">#{publication.timestampProof.blockHeight}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-fg-subtle">SHA-256:</span>
            <span className="text-accent-fg font-semibold truncate max-w-[220px]">
              {publication.timestampProof.sha256Hash}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-hairline">
          <Button type="button" variant="secondary" size="sm" onClick={handleDownload}>
            <Download className="size-3.5" />
            <span>Download Affidavit (.txt)</span>
          </Button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Button type="button" variant="secondary" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="size-3.5 text-success-fg" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy Legal Text</span>
                </>
              )}
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
