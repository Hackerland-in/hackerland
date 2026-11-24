'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge, Button, Card } from '@hackerland/ui';
import {
  ShieldCheck,
  Layers,
  GitPullRequest,
  Share2,
  Sparkles,
  Users,
} from 'lucide-react';
import { useStoredValue } from '@/lib/hooks/use-stored-value';

export default function PassportPage() {
  const cachedProfile = useStoredValue('hackerland_user_profile');
  const { profileHandle, displayName } = useMemo(() => {
    const fallback = { profileHandle: 'innovator', displayName: 'Innovator' };
    if (!cachedProfile) return fallback;
    try {
      const p = JSON.parse(cachedProfile);
      return {
        profileHandle: p.handle || fallback.profileHandle,
        displayName: p.displayName || p.name || fallback.displayName,
      };
    } catch {
      return fallback;
    }
  }, [cachedProfile]);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://www.hackerland.in/u/${profileHandle}`);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-fg py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-6">
          <div>
            <Badge variant="outline" className="text-accent border-accent/30 font-mono mb-2">
              Verified Proof-of-Work
            </Badge>
            <h1 className="text-3xl font-display font-bold tracking-tight">
              Personal Innovation Passport
            </h1>
            <p className="text-xs sm:text-sm text-fg-subtle">
              A permanent, cryptographically verified record of your prototypes, merged contributions, and hardware builds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleShare} variant="secondary" size="sm" className="text-xs">
              <Share2 className="size-3.5 mr-1.5" />
              <span>{copySuccess ? 'Copied URL!' : 'Share Passport'}</span>
            </Button>
            <Button asChild variant="primary" size="sm" className="text-xs">
              <Link href="/manufacturing/pcb">
                <span>Fabricate New PCB</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Passport Credential Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-surface-1 to-slate-900 border-2 border-accent/30 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle Background Watermark */}
          <div className="absolute top-0 right-0 p-8 opacity-5 text-accent select-none pointer-events-none">
            <ShieldCheck className="size-64" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xl shadow">
                ⚡
              </div>
              <div>
                <h2 className="text-xl font-bold font-display text-white">{displayName}</h2>
                <div className="text-xs text-slate-400 font-mono">@{profileHandle} • Certified Innovator ID #HL-2026-IN</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-400 font-bold">VERIFIED ON CHAIN</span>
            </div>
          </div>

          {/* Stats Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-surface-2/60 border border-hairline space-y-0.5">
              <div className="text-[10px] text-fg-muted uppercase font-mono">Hardware Builds</div>
              <div className="text-xl font-bold text-amber-400 font-mono">3</div>
            </div>
            <div className="p-3 rounded-xl bg-surface-2/60 border border-hairline space-y-0.5">
              <div className="text-[10px] text-fg-muted uppercase font-mono">Open Source PRs</div>
              <div className="text-xl font-bold text-emerald-400 font-mono">14</div>
            </div>
            <div className="p-3 rounded-xl bg-surface-2/60 border border-hairline space-y-0.5">
              <div className="text-[10px] text-fg-muted uppercase font-mono">Bounties Won</div>
              <div className="text-xl font-bold text-cyan-400 font-mono">₹45,000</div>
            </div>
            <div className="p-3 rounded-xl bg-surface-2/60 border border-hairline space-y-0.5">
              <div className="text-[10px] text-fg-muted uppercase font-mono">Reputation Points</div>
              <div className="text-xl font-bold text-accent font-mono">1,480</div>
            </div>
          </div>

          {/* Verified Achievements Badges */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">
              Verified Badges & Competencies
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-surface-2/40 border border-hairline flex items-center space-x-2.5">
                <Layers className="size-5 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-fg">PCB Gerber Master</div>
                  <div className="text-[10px] text-fg-muted">Verified RS-274X Fabrication</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-2/40 border border-hairline flex items-center space-x-2.5">
                <GitPullRequest className="size-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-fg">Open Hardware Contributor</div>
                  <div className="text-[10px] text-fg-muted">CERN-OHL Compliant Designs</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-2/40 border border-hairline flex items-center space-x-2.5">
                <Users className="size-5 text-cyan-400 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-fg">Sprint Squad Mentor</div>
                  <div className="text-[10px] text-fg-muted">Guided 2 Student Cohorts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hardware Fabrication Audit Trail */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">
              Hardware Fabrication Audit Log
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-surface-2/60 border border-hairline flex items-center justify-between">
                <div>
                  <div className="font-bold text-fg">ESP32 LoRa Soil Telemetry Node v1.2</div>
                  <div className="text-[10px] text-fg-muted font-mono">2-Layer FR4 • 100mm x 80mm • DRC Passed</div>
                </div>
                <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 text-[10px]">
                  Fabrication Ready
                </Badge>
              </div>

              <div className="p-3 rounded-lg bg-surface-2/60 border border-hairline flex items-center justify-between">
                <div>
                  <div className="font-bold text-fg">555 Astable LED Multivibrator</div>
                  <div className="text-[10px] text-fg-muted font-mono">Veroboard Prototype with Track Cuts • SPICE Validated</div>
                </div>
                <Badge variant="outline" className="text-amber-400 border-amber-400/30 text-[10px]">
                  Simulated
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Info card */}
        <Card className="p-6 bg-surface-1 border-hairline space-y-2 text-xs">
          <div className="font-bold text-fg flex items-center gap-1.5">
            <Sparkles className="size-4 text-accent" />
            <span>Why the Innovation Passport Matters</span>
          </div>
          <p className="text-fg-subtle leading-relaxed">
            Conventional resumes list claims; the Hackerland Innovation Passport verifies outcomes.
            Every completed circuit simulation, validated Gerber export, and peer-reviewed squad contribution
            is permanently recorded in your public profile DNA, recognized by hardware startups and lab recruiters.
          </p>
        </Card>
      </div>
    </div>
  );
}
