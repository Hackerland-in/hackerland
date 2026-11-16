import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Unlock,
  DollarSign,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import { listSquadRooms } from '@/lib/data/squads-data';

export const metadata: Metadata = {
  title: 'Active Project Squads & Milestone Escrow Directory | Hackerland',
  description:
    'Join active engineering squads building hardware, AI, and robotics. Verified proof-of-work milestone escrows, stipend grants, and cross-disciplinary co-founders.',
};

export default function SquadsDirectoryPage() {
  const squads = listSquadRooms();

  const totalEscrowInr = squads.reduce((acc, s) => acc + s.escrowPoolTotalInr, 0);
  const totalOpenRoles = squads.reduce(
    (acc, s) => acc + s.squadMembers.filter((m) => m.status === 'open').length,
    0
  );
  const totalFilledMembers = squads.reduce(
    (acc, s) => acc + s.squadMembers.filter((m) => m.status === 'filled').length,
    0
  );

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-neutral-800 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black pt-16 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Users className="w-3.5 h-3.5" /> Collaboration Hub & Escrow Vault
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Project Squad Rooms & Milestone Escrows
          </h1>
          <p className="text-neutral-400 max-w-3xl text-base sm:text-lg leading-relaxed">
            Stop coding and building alone. Join interdisciplinary project squads of hardware engineers, firmware coders, AI researchers, and designers. Every squad milestone is backed by verifiable escrow and credited to your Personal Innovation Passport.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="text-2xl font-black text-emerald-400">
                ₹{totalEscrowInr.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">Total Escrow Backing</div>
            </div>
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="text-2xl font-black text-white">{totalOpenRoles} Open Roles</div>
              <div className="text-xs text-neutral-400 mt-0.5">Actively Recruiting</div>
            </div>
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="text-2xl font-black text-white">{totalFilledMembers} Active Builders</div>
              <div className="text-xs text-neutral-400 mt-0.5">Verified Contributors</div>
            </div>
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="text-2xl font-black text-emerald-400">100% Escrow</div>
              <div className="text-xs text-neutral-400 mt-0.5">Non-Custodial Milestone Payouts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" /> Active Squad Workspaces
          </h2>
          <span className="text-xs text-neutral-500">{squads.length} Active Squads</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {squads.map((squad) => {
            const openRoles = squad.squadMembers.filter((m) => m.status === 'open');
            const filledMembers = squad.squadMembers.filter((m) => m.status === 'filled');

            return (
              <div
                key={squad.projectSlug}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col justify-between space-y-6 hover:border-neutral-700 transition"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-neutral-500">
                      PROJECT SQUAD
                    </span>
                    <span className="text-xs font-black text-emerald-400">
                      ₹{squad.escrowPoolTotalInr.toLocaleString('en-IN')} Escrow
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">{squad.projectTitle}</h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {squad.tagline}
                    </p>
                  </div>

                  {/* Active Squad Members Avatars */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
                      Active Squad Roster ({filledMembers.length} Members):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {filledMembers.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-xs"
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="font-medium text-white">{m.assignee?.name}</span>
                          <span className="text-neutral-500 text-[10px]">({m.roleTitle})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Open Positions */}
                  {openRoles.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider block">
                        Open Positions ({openRoles.length} Available):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {openRoles.map((role) => (
                          <span
                            key={role.id}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-cyan-400" /> {role.roleTitle}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Milestones Preview */}
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1 text-xs">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                      Next Milestone in Queue:
                    </span>
                    <div className="text-white font-medium truncate">
                      {squad.milestones[0]?.title}
                    </div>
                    <div className="text-[11px] text-emerald-400 font-mono">
                      ₹{squad.milestones[0]?.escrowAmountInr.toLocaleString('en-IN')} Bounty Escrow
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-3">
                  <Link
                    href={`/projects/${squad.projectSlug}`}
                    className="text-xs text-neutral-400 hover:text-white transition"
                  >
                    View Project
                  </Link>

                  <Link
                    href={`/projects/${squad.projectSlug}/squad`}
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
                  >
                    Enter Squad Room <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
