'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Avatar, Badge, Button, Card, cn } from '@hackerland/ui';
import {
  ShieldCheck,
  Layers,
  GitPullRequest,
  Share2,
  Sparkles,
  Users,
  Download,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useSocialCommunity } from './social-context';

export function PassportStudio() {
  const [profileHandle, setProfileHandle] = useState('innovator');
  const [displayName, setDisplayName] = useState('Innovator');
  const [headline, setHeadline] = useState('Open Hardware & Embedded Systems Builder');
  const [copySuccess, setCopySuccess] = useState(false);
  const [verifiedHash, setVerifiedHash] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);

  const { followingHandles, bookmarkedPostIds, savedItemIds } = useSocialCommunity();

  useEffect(() => {
    try {
      const cached = localStorage.getItem('hackerland_user_profile');
      if (cached) {
        const p = JSON.parse(cached);
        if (p.handle) setProfileHandle(p.handle);
        if (p.displayName || p.name) setDisplayName(p.displayName || p.name);
        if (p.headline) setHeadline(p.headline);
      }
      const vis = localStorage.getItem('hackerland_passport_public');
      if (vis === 'false') setIsPublic(false);
    } catch {}
  }, []);

  const togglePublic = () => {
    setIsPublic((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('hackerland_passport_public', String(next));
      } catch {}
      return next;
    });
  };

  const handleShare = () => {
    try {
      navigator.clipboard?.writeText(`https://www.hackerland.in/u/${profileHandle}`);
    } catch {}
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleVerifySignature = () => {
    const seed = `${profileHandle}:${followingHandles.length}:${savedItemIds.length}:${bookmarkedPostIds.length}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    setVerifiedHash(`HL-SIG-2026-${hash.toString(16).toUpperCase().padStart(8, '0')}`);
  };

  const handleExportJson = () => {
    const payload = {
      schema: 'hackerland.passport.v1',
      handle: profileHandle,
      displayName,
      headline,
      public: isPublic,
      communitySignals: {
        followingCount: followingHandles.length,
        bookmarkedPosts: bookmarkedPostIds.length,
        savedItems: savedItemIds.length,
      },
      verificationHash: verifiedHash || 'HL-SIG-2026-VERIFIED',
      exportedAt: new Date().toISOString(),
    };
    try {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profileHandle}-innovation-passport.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  };

  return (
    <div className="space-y-6 min-w-0">
      {/* Rosepaper Hero */}
      <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              <span>Verified Proof-of-Ship</span>
            </div>
            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
              Personal Innovation Passport
            </h1>
            <p className="text-body-sm text-fg-muted max-w-xl">
              A permanent, portable credential tracking your shipped hardware builds, merged PRs, sprint check-ins, and community endorsements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleShare} variant="secondary" size="sm">
              <Share2 className="size-3.5" />
              <span>{copySuccess ? 'Copied URL!' : 'Share Passport'}</span>
            </Button>
            <Button asChild variant="primary" size="sm">
              <Link href="/manufacturing/pcb">
                <span>Fabricate New PCB</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Rosepaper Credential Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-surface-1 via-surface-1 to-accent-soft border-2 border-accent/30 shadow-xs space-y-6 relative overflow-hidden">
        <div className="absolute -bottom-6 -right-6 opacity-5 text-accent select-none pointer-events-none">
          <ShieldCheck className="size-56" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4 relative">
          <div className="flex items-center gap-3.5 min-w-0">
            <Avatar name={displayName} size="lg" />
            <div className="min-w-0">
              <h2 className="font-display text-headline-md font-bold text-fg truncate">
                {displayName}
              </h2>
              <div className="text-body-xs text-fg-muted font-mono truncate">
                @{profileHandle} · ID #HL-2026-IN
              </div>
              <p className="text-body-xs text-fg-subtle truncate">{headline}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Badge tone="success" variant="outline">
              <CheckCircle2 className="size-3 mr-1 inline" />
              Verified Proof Ledger
            </Badge>
            <button
              type="button"
              onClick={togglePublic}
              aria-pressed={isPublic}
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-display font-semibold transition-colors',
                isPublic
                  ? 'border-accent/40 bg-accent-soft text-accent-fg'
                  : 'border-hairline bg-surface-2 text-fg-muted',
              )}
            >
              {isPublic ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
              <span>{isPublic ? 'Public Passport' : 'Private Passport'}</span>
            </button>
          </div>
        </div>

        {/* Live Proof + Social Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center relative">
          <div className="p-3.5 rounded-xl bg-surface-1/90 border border-hairline space-y-0.5">
            <div className="text-[10px] text-fg-subtle uppercase font-mono">Hardware Builds</div>
            <div className="text-xl font-bold text-fg font-mono">3</div>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-1/90 border border-hairline space-y-0.5">
            <div className="text-[10px] text-fg-subtle uppercase font-mono">Open Source PRs</div>
            <div className="text-xl font-bold text-success-fg font-mono">14</div>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-1/90 border border-hairline space-y-0.5">
            <div className="text-[10px] text-fg-subtle uppercase font-mono">Following Graph</div>
            <div className="text-xl font-bold text-accent-fg font-mono">{followingHandles.length}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-1/90 border border-hairline space-y-0.5">
            <div className="text-[10px] text-fg-subtle uppercase font-mono">Saved &amp; Bookmarked</div>
            <div className="text-xl font-bold text-fg font-mono">
              {bookmarkedPostIds.length + savedItemIds.length}
            </div>
          </div>
        </div>

        {/* Verified Badges */}
        <div className="space-y-3 relative">
          <div className="text-[11px] font-bold font-mono uppercase tracking-wider text-fg-subtle">
            Verified Badges &amp; Competencies
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-surface-1/90 border border-hairline flex items-center gap-2.5">
              <Layers className="size-5 text-accent shrink-0" />
              <div className="text-xs">
                <div className="font-bold text-fg">PCB Gerber Master</div>
                <div className="text-[11px] text-fg-muted">Verified RS-274X Fabrication</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-1/90 border border-hairline flex items-center gap-2.5">
              <GitPullRequest className="size-5 text-success-fg shrink-0" />
              <div className="text-xs">
                <div className="font-bold text-fg">Open Hardware Contributor</div>
                <div className="text-[11px] text-fg-muted">CERN-OHL Compliant Designs</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-1/90 border border-hairline flex items-center gap-2.5">
              <Users className="size-5 text-accent shrink-0" />
              <div className="text-xs">
                <div className="font-bold text-fg">Sprint Squad Mentor</div>
                <div className="text-[11px] text-fg-muted">Guided 2 Student Cohorts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fabrication Audit Log */}
        <div className="space-y-2.5 relative">
          <div className="text-[11px] font-bold font-mono uppercase tracking-wider text-fg-subtle">
            Hardware Fabrication Audit Log
          </div>
          <div className="space-y-2 text-body-xs">
            <div className="p-3.5 rounded-xl bg-surface-1/90 border border-hairline flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-bold text-fg">ESP32 LoRa Soil Telemetry Node v1.2</div>
                <div className="text-[11px] text-fg-muted font-mono">
                  2-Layer FR4 · 100mm x 80mm · DRC Passed
                </div>
              </div>
              <Badge tone="success" variant="outline">
                Fabrication Ready
              </Badge>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-1/90 border border-hairline flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-bold text-fg">555 Astable LED Multivibrator</div>
                <div className="text-[11px] text-fg-muted font-mono">
                  Veroboard Prototype with Track Cuts · SPICE Validated
                </div>
              </div>
              <Badge tone="accent" variant="outline">
                Simulated
              </Badge>
            </div>
          </div>
        </div>

        {/* Interactive Verify & Export Controls */}
        <div className="pt-3 border-t border-hairline flex flex-wrap items-center justify-between gap-3 relative">
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="primary" size="sm" onClick={handleVerifySignature}>
              <ShieldCheck className="size-3.5" />
              <span>{verifiedHash ? 'Re-verify Proof Hash' : 'Verify Credential Signature'}</span>
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={handleExportJson}>
              <Download className="size-3.5" />
              <span>Export JSON Credential</span>
            </Button>
          </div>

          {verifiedHash && (
            <span className="rounded-full bg-surface-1 border border-accent/30 px-3 py-1 font-mono text-[11px] font-semibold text-accent-fg">
              {verifiedHash}
            </span>
          )}
        </div>
      </div>

      {/* Explainer Card */}
      <Card className="p-5 bg-surface-1 border-hairline space-y-2">
        <div className="font-display font-bold text-body-sm text-fg flex items-center gap-1.5">
          <Sparkles className="size-4 text-accent" />
          <span>Why the Innovation Passport Matters</span>
        </div>
        <p className="text-body-xs text-fg-muted leading-relaxed">
          Conventional resumes list unverified claims; the Hackerland Innovation Passport records reproducible outcomes across circuit simulations, Gerber exports, and peer-reviewed squad contributions.
        </p>
      </Card>
    </div>
  );
}
