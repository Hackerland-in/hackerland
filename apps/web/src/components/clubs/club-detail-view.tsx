'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ClubChapter, ClubEquipment } from '@hackerland/core';
import {
  MapPin,
  Mail,
  ShieldCheck,
  Trophy,
  ArrowLeft,
  Wrench,
  CheckCircle2,
  Clock,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { Button } from '@hackerland/ui';
import { EquipmentReservationModal } from './equipment-reservation-modal';

interface ClubDetailViewProps {
  club: ClubChapter;
}

export function ClubDetailView({ club }: ClubDetailViewProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<ClubEquipment | null>(null);

  return (
    <div className="space-y-8 min-w-0">
      {/* Back Link */}
      <div>
        <Link
          href="/clubs"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to Innovation Clubs & ATL Hub
        </Link>
      </div>

      {/* Hero Header */}
      <div className="rounded-2xl border border-white/10 bg-neutral-900/80 p-6 sm:p-8 backdrop-blur-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              {club.category === 'school_atl' && (
                <span className="px-2.5 py-1 rounded text-xs font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                  <GraduationCap className="size-3.5" /> SCHOOL ATAL TINKERING LAB
                </span>
              )}
              {club.category === 'college_robotics' && (
                <span className="px-2.5 py-1 rounded text-xs font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <Wrench className="size-3.5" /> COLLEGE ROBOTICS GARAGE
                </span>
              )}
              {club.category === 'community_makerspace' && (
                <span className="px-2.5 py-1 rounded text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Layers className="size-3.5" /> COMMUNITY FABLAB
                </span>
              )}
              {club.verifiedAtl && (
                <span className="px-2.5 py-1 rounded text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="size-3.5" /> ATAL INNOVATION MISSION VERIFIED
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {club.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-400">
              <span className="flex items-center gap-1 text-neutral-300">
                <MapPin className="size-3.5 text-emerald-400" />
                {club.city}, {club.state}
              </span>
              <span>·</span>
              <span>{club.institution}</span>
              <span>·</span>
              <span>Est. {club.foundedYear}</span>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed pt-1">
              {club.summary}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {club.focusAreas.map((area) => (
                <span
                  key={area}
                  className="px-2.5 py-1 rounded-md bg-neutral-950 border border-white/10 text-xs font-mono text-neutral-300"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Contact & Address Card */}
          <div className="rounded-xl border border-white/10 bg-neutral-950/60 p-5 space-y-3 shrink-0 text-xs font-mono w-full md:w-80">
            <span className="text-neutral-500 block">LAB LOCATION & ACCESS</span>
            <p className="text-neutral-300 leading-relaxed text-[11px] font-sans">
              {club.address}
            </p>
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-neutral-400">
                <span>INQUIRIES:</span>
                <a
                  href={`mailto:${club.contactEmail}`}
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-sans text-xs"
                >
                  <Mail className="size-3" /> {club.contactEmail}
                </a>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>SUPERVISION:</span>
                <span className="text-white font-sans">Full Safety Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-center font-mono">
          <div className="p-3 rounded-xl bg-neutral-950/40 border border-white/5">
            <span className="text-neutral-500 text-[10px] block">TOTAL MEMBERS</span>
            <span className="text-white text-lg font-bold">{club.memberCount}+</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950/40 border border-white/5">
            <span className="text-neutral-500 text-[10px] block">SHARED MACHINES</span>
            <span className="text-emerald-400 text-lg font-bold">{club.equipment.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950/40 border border-white/5">
            <span className="text-neutral-500 text-[10px] block">PROTOTYPES SHIPPED</span>
            <span className="text-cyan-400 text-lg font-bold">{club.establishedPrototypesCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950/40 border border-white/5">
            <span className="text-neutral-500 text-[10px] block">ACTIVE CHALLENGES</span>
            <span className="text-amber-400 text-lg font-bold">{club.activeChallenges.length}</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Shared Equipment Registry (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Wrench className="size-4 text-emerald-400" />
                Shared Equipment Registry
              </h2>
              <p className="text-xs text-neutral-400">
                Book machine time and access testbenches under certified safety protocols.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
              {club.equipment.length} MACHINES LISTED
            </span>
          </div>

          <div className="space-y-4">
            {club.equipment.map((eq) => (
              <div
                key={eq.id}
                className="rounded-xl border border-white/10 bg-neutral-900/60 p-5 space-y-4 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{eq.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {eq.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-neutral-400 mt-0.5">{eq.model}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setSelectedEquipment(eq)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono shrink-0"
                  >
                    Reserve Machine Slot
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs p-3 rounded-lg bg-neutral-950/60 border border-white/5">
                  <div>
                    <span className="text-neutral-500 block text-[11px] font-mono">SPECIFICATIONS</span>
                    <span className="text-neutral-200">{eq.specs}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px] font-mono">HOURLY RATE</span>
                    <span className="text-emerald-300 font-medium">{eq.hourlyRate}</span>
                  </div>
                </div>

                {eq.notes && (
                  <p className="text-[11px] text-neutral-400 italic">
                    Note: {eq.notes}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Active Intra-Club Challenges */}
          <div className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trophy className="size-4 text-amber-400" />
                  Active Build Challenges
                </h2>
                <p className="text-xs text-neutral-400">
                  Open hackathons, problem statements, and bounties hosted by this chapter.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {club.activeChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="rounded-xl border border-white/10 bg-neutral-900/60 p-5 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit">
                      {challenge.domain.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                      <Clock className="size-3 text-neutral-500" /> Deadline: {challenge.deadline}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{challenge.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {challenge.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs font-mono">
                    <div className="flex items-center gap-4 text-neutral-300">
                      <span>Prize: <strong className="text-amber-400">{challenge.prizePool}</strong></span>
                      <span>Team: {challenge.teamSize}</span>
                    </div>
                    <span className="text-neutral-500 text-[11px]">Org: {challenge.organizer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Lead Mentor Spotlight & Chapter Rules (1 Col) */}
        <div className="space-y-6">
          {/* Lead Mentor Card */}
          <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <ShieldCheck className="size-3.5" />
              <span>CHAPTER LEAD MENTOR</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{club.leadMentor.name}</h3>
              <p className="text-xs text-emerald-400 font-mono mt-0.5">{club.leadMentor.role}</p>
              <p className="text-xs text-neutral-500">{club.leadMentor.organization}</p>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              {club.leadMentor.bio}
            </p>

            {club.leadMentor.verifiedAtlMentor && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>Verified Atal Innovation Mission (AIM) Mentor</span>
              </div>
            )}
          </div>

          {/* Machine Reservation Protocol */}
          <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="size-4 text-cyan-400" />
              Slot Booking Protocols
            </h3>
            <ul className="space-y-2 text-neutral-400 list-disc list-inside">
              <li>Arrive 15 minutes before the allocated machine slot.</li>
              <li>Present the digital pass code to the lab superintendent.</li>
              <li>Bring personal eye protection safety goggles and ESD wrist strap.</li>
              <li>School student makers (Grades 6-12) must bring teacher mentor co-signature.</li>
              <li>Clean machine bed and return all drill bits to the tool cabinet before sign-off.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Equipment Booking Modal */}
      {selectedEquipment && (
        <EquipmentReservationModal
          club={club}
          equipment={selectedEquipment}
          onClose={() => setSelectedEquipment(null)}
        />
      )}
    </div>
  );
}
