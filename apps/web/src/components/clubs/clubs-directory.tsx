'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { ClubChapter, ClubEquipment } from '@hackerland/core';
import {
  Search,
  MapPin,
  Cpu,
  Trophy,
  ShieldCheck,
  ChevronRight,
  Layers,
  Wrench,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@hackerland/ui';
import { EquipmentReservationModal } from './equipment-reservation-modal';

interface ClubsDirectoryProps {
  initialClubs: ClubChapter[];
}

export function ClubsDirectory({ initialClubs }: ClubsDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedEquipmentCategory, setSelectedEquipmentCategory] = useState<string>('all');

  // Modal reservation state
  const [activeReservation, setActiveReservation] = useState<{
    club: ClubChapter;
    equipment: ClubEquipment;
  } | null>(null);

  const states = useMemo(() => {
    const set = new Set(initialClubs.map((c) => c.state));
    return ['all', ...Array.from(set).sort()];
  }, [initialClubs]);

  const filteredClubs = useMemo(() => {
    return initialClubs.filter((club) => {
      if (selectedCategory !== 'all' && club.category !== selectedCategory) {
        return false;
      }
      if (selectedState !== 'all' && club.state !== selectedState) {
        return false;
      }
      if (selectedEquipmentCategory !== 'all') {
        const hasEq = club.equipment.some((eq) => eq.category === selectedEquipmentCategory);
        if (!hasEq) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = club.name.toLowerCase().includes(q);
        const matchesInst = club.institution.toLowerCase().includes(q);
        const matchesCity = club.city.toLowerCase().includes(q);
        const matchesFocus = club.focusAreas.some((f) => f.toLowerCase().includes(q));
        const matchesEquipment = club.equipment.some((eq) => eq.name.toLowerCase().includes(q));
        if (!matchesName && !matchesInst && !matchesCity && !matchesFocus && !matchesEquipment) {
          return false;
        }
      }
      return true;
    });
  }, [initialClubs, selectedCategory, selectedState, selectedEquipmentCategory, searchQuery]);

  // Aggregate highlights
  const totalMachines = useMemo(() => {
    return initialClubs.reduce((sum, c) => sum + c.equipment.length, 0);
  }, [initialClubs]);

  const totalChallenges = useMemo(() => {
    return initialClubs.reduce((sum, c) => sum + c.activeChallenges.length, 0);
  }, [initialClubs]);

  return (
    <div className="space-y-8 min-w-0">
      {/* Featured Intra-Club Challenges Banner */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-cyan-950/30 p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Trophy className="size-3.5" />
              <span>ACTIVE INTRA-CLUB CHALLENGES & SQUAD HACKATHONS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              National Hardware Challenges for School ATLs & College Labs
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Tackle real-world Indian engineering problem statements—from disaster telemetry in the Western Ghats to open-source EV BMS units. Earn component grants, lab access, and proof-of-work passport badges.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-white/10 text-neutral-300 flex items-center gap-1.5">
              <Trophy className="size-3.5 text-amber-400" />
              ₹9,00,000+ Prize Pools
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-white/10 text-neutral-300 flex items-center gap-1.5">
              <Cpu className="size-3.5 text-cyan-400" />
              {totalMachines}+ Shared Machines
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-4 sm:p-5 backdrop-blur-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by club name, city, equipment (e.g. Voltera, CNC, DPS, Kochi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-neutral-950 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <select
              aria-label="Filter by state"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="rounded-lg border border-white/10 bg-neutral-950 px-3 py-2.5 text-xs text-neutral-300 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All States ({states.length - 1})</option>
              {states
                .filter((s) => s !== 'all')
                .map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>

            <select
              aria-label="Filter by equipment category"
              value={selectedEquipmentCategory}
              onChange={(e) => setSelectedEquipmentCategory(e.target.value)}
              className="rounded-lg border border-white/10 bg-neutral-950 px-3 py-2.5 text-xs text-neutral-300 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All Tool Types</option>
              <option value="rapid_prototyping">Rapid 3D & PCB Printing</option>
              <option value="cnc_machining">CNC Milling</option>
              <option value="testing_measurement">Scopes & Testbenches</option>
              <option value="soldering_rework">SMD Soldering & Rework</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-white/5">
          {[
            { id: 'all', label: 'All Chapters' },
            { id: 'school_atl', label: 'School ATLs (Grades 6-12)' },
            { id: 'college_robotics', label: 'College Robotics & EV Garages' },
            { id: 'community_makerspace', label: 'Community FabLabs' },
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

      {/* Directory Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-neutral-400 px-1 font-mono">
          <span>SHOWING {filteredClubs.length} INNOVATION HUBS</span>
          <span>DPDP ACT SAFETY VERIFIED</span>
        </div>

        {filteredClubs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center space-y-3">
            <Cpu className="mx-auto size-8 text-neutral-600" />
            <h3 className="text-base font-medium text-white">No Innovation Clubs Match Your Filter</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Try adjusting your search query, state, or equipment category filter to discover nearby maker chapters.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedState('all');
                setSelectedEquipmentCategory('all');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                className="group rounded-2xl border border-white/10 bg-neutral-900/70 p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300 space-y-6"
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {club.category === 'school_atl' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                            <GraduationCap className="size-3" /> SCHOOL ATL
                          </span>
                        )}
                        {club.category === 'college_robotics' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                            <Wrench className="size-3" /> COLLEGE ROBOTICS
                          </span>
                        )}
                        {club.category === 'community_makerspace' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <Layers className="size-3" /> COMMUNITY FABLAB
                          </span>
                        )}
                        {club.verifiedAtl && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                            <ShieldCheck className="size-3" /> AIM CERTIFIED
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                        <Link href={`/clubs/${club.slug}`}>{club.name}</Link>
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <MapPin className="size-3 text-neutral-500" />
                        <span>
                          {club.city}, {club.state} · <span className="text-neutral-500">{club.institution}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                    {club.summary}
                  </p>

                  {/* Focus Areas */}
                  <div className="flex flex-wrap gap-1.5">
                    {club.focusAreas.map((area) => (
                      <span
                        key={area}
                        className="px-2 py-0.5 rounded bg-neutral-950 border border-white/5 text-[11px] font-mono text-neutral-400"
                      >
                        {area}
                      </span>
                    ))}
                  </div>

                  {/* Shared Equipment Snippet */}
                  <div className="rounded-xl border border-white/5 bg-neutral-950/40 p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Wrench className="size-3 text-emerald-400" /> AVAILABLE EQUIPMENT ({club.equipment.length})
                      </span>
                      <span>SLOT RESERVATION READY</span>
                    </div>
                    <div className="space-y-1.5">
                      {club.equipment.slice(0, 3).map((eq) => (
                        <div
                          key={eq.id}
                          className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0"
                        >
                          <div className="truncate mr-2">
                            <span className="text-white font-medium">{eq.name}</span>
                            <span className="text-[11px] text-neutral-500 block truncate">{eq.specs}</span>
                          </div>
                          <button
                            onClick={() => setActiveReservation({ club, equipment: eq })}
                            className="shrink-0 px-2 py-1 rounded text-[11px] font-mono bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                          >
                            Book Slot
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lead Mentor & Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5 text-center text-xs font-mono">
                    <div className="p-2 rounded-lg bg-neutral-950/30">
                      <span className="text-neutral-500 text-[10px] block">MEMBERS</span>
                      <span className="text-white font-bold">{club.memberCount}+</span>
                    </div>
                    <div className="p-2 rounded-lg bg-neutral-950/30">
                      <span className="text-neutral-500 text-[10px] block">ACTIVE PROTOTYPES</span>
                      <span className="text-emerald-400 font-bold">{club.activeProjectsCount}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-neutral-950/30">
                      <span className="text-neutral-500 text-[10px] block">CHALLENGES</span>
                      <span className="text-cyan-400 font-bold">{club.activeChallenges.length}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[11px] text-neutral-400">
                    Lead: <span className="text-neutral-200 font-medium">{club.leadMentor.name}</span>
                  </div>
                  <Link
                    href={`/clubs/${club.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                  >
                    View Chapter Profile
                    <ChevronRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DPDP Act Minor Safety & ATL Mentorship Assurance */}
      <div className="rounded-2xl border border-white/10 bg-neutral-900/40 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">DPDP Act & AIM Child Safety Protocols</h4>
            <p className="text-xs text-neutral-400 mt-0.5 max-w-xl">
              All school student accounts (Ages 10-17) require verified teacher or parent co-signatures for equipment reservations and challenge entries. Hardware work is supervised by certified Atal Innovation Mission (AIM) mentors.
            </p>
          </div>
        </div>
        <Link href="/safety">
          <Button variant="secondary" size="sm" className="text-xs font-mono shrink-0">
            Review Safety Charter
          </Button>
        </Link>
      </div>

      {/* Equipment Booking Modal */}
      {activeReservation && (
        <EquipmentReservationModal
          club={activeReservation.club}
          equipment={activeReservation.equipment}
          onClose={() => setActiveReservation(null)}
        />
      )}
    </div>
  );
}
