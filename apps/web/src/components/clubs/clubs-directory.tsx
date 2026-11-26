'use client';

import { useEffect, useMemo, useState } from 'react';
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
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import { Badge, Button, Card, CardBody, FilterChip, cn } from '@hackerland/ui';
import { useSocialCommunity } from '@/components/social/social-context';
import { EquipmentReservationModal, type StoredEquipmentBooking } from './equipment-reservation-modal';

interface ClubsDirectoryProps {
  initialClubs: ClubChapter[];
}

export function ClubsDirectory({ initialClubs }: ClubsDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedEquipmentCategory, setSelectedEquipmentCategory] = useState<string>('all');
  const [joinedClubIds, setJoinedClubIds] = useState<string[]>([]);
  const [bookings, setBookings] = useState<StoredEquipmentBooking[]>([]);

  const [activeReservation, setActiveReservation] = useState<{
    club: ClubChapter;
    equipment: ClubEquipment;
  } | null>(null);

  const { isItemSaved, toggleSaveItem } = useSocialCommunity();

  useEffect(() => {
    try {
      const savedJoined = localStorage.getItem('hackerland_joined_clubs');
      if (savedJoined) {
        const parsed = JSON.parse(savedJoined);
        if (Array.isArray(parsed)) setJoinedClubIds(parsed);
      }
      const savedBookings = localStorage.getItem('hackerland_club_bookings');
      if (savedBookings) {
        const parsed = JSON.parse(savedBookings);
        if (Array.isArray(parsed)) setBookings(parsed);
      }
    } catch {}
  }, []);

  const toggleJoinClub = (clubId: string) => {
    setJoinedClubIds((prev) => {
      const next = prev.includes(clubId) ? prev.filter((id) => id !== clubId) : [...prev, clubId];
      try {
        localStorage.setItem('hackerland_joined_clubs', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

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

  const totalMachines = useMemo(() => {
    return initialClubs.reduce((sum, c) => sum + c.equipment.length, 0);
  }, [initialClubs]);

  return (
    <div className="space-y-6 min-w-0">
      {/* Featured Intra-Club Challenges Banner */}
      <div className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-accent/10 text-accent-fg">
              <Trophy className="size-3.5" aria-hidden="true" />
              <span>ACTIVE INTRA-CLUB CHALLENGES &amp; SQUAD HACKATHONS</span>
            </div>
            <h2 className="font-display text-headline-md font-bold tracking-tight text-fg">
              National Hardware Challenges for School ATLs &amp; College Labs
            </h2>
            <p className="text-body-sm text-fg-muted leading-relaxed">
              Tackle real-world engineering challenges — from disaster telemetry in the Western Ghats to open-source EV BMS units. Book verified lab equipment slots and earn proof-of-work badges.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-body-xs font-mono shrink-0">
            <span className="px-3 py-1.5 rounded-full bg-surface-1 border border-hairline text-fg flex items-center gap-1.5 shadow-xs">
              <Trophy className="size-3.5 text-warning" aria-hidden="true" />
              ₹9,00,000+ Prize Pools
            </span>
            <span className="px-3 py-1.5 rounded-full bg-surface-1 border border-hairline text-fg flex items-center gap-1.5 shadow-xs">
              <Cpu className="size-3.5 text-accent" aria-hidden="true" />
              {totalMachines}+ Shared Machines
            </span>
          </div>
        </div>
      </div>

      {/* Active Equipment Passes Banner */}
      {bookings.length > 0 && (
        <div className="rounded-2xl border border-success/35 bg-success/8 p-4 space-y-2">
          <div className="flex items-center gap-2 font-display text-body-sm font-bold text-success-fg">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            <span>Your Confirmed Machine Passes ({bookings.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {bookings.map((b) => (
              <div
                key={b.passCode}
                className="rounded-xl border border-hairline bg-surface-1 px-3 py-2 text-body-xs space-y-0.5"
              >
                <div className="font-mono font-bold text-accent-fg">{b.passCode}</div>
                <div className="font-display font-semibold text-fg">{b.equipmentName}</div>
                <div className="text-[11px] text-fg-subtle">{b.requestedDate} · {b.timeSlot}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-4 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-fg-subtle pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by club name, city, equipment (e.g. Voltera, CNC, DPS, Kochi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-full border border-line bg-sunken pl-10 pr-4 text-body-sm text-fg placeholder:text-fg-subtle focus:border-accent focus:bg-surface-1 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              aria-label="Filter by state"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="h-10 rounded-full border border-line bg-sunken px-3.5 text-body-xs text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
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
              className="h-10 rounded-full border border-line bg-sunken px-3.5 text-body-xs text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
            >
              <option value="all">All Tool Types</option>
              <option value="rapid_prototyping">Rapid 3D &amp; PCB Printing</option>
              <option value="cnc_machining">CNC Milling</option>
              <option value="testing_measurement">Scopes &amp; Testbenches</option>
              <option value="soldering_rework">SMD Soldering &amp; Rework</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-hairline">
          {[
            { id: 'all', label: 'All Chapters' },
            { id: 'school_atl', label: 'School ATLs (Grades 6-12)' },
            { id: 'college_robotics', label: 'College Robotics & EV Garages' },
            { id: 'community_makerspace', label: 'Community FabLabs' },
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
      </div>

      {/* Directory Grid */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-body-xs text-fg-subtle px-1 font-mono">
          <span>SHOWING {filteredClubs.length} INNOVATION HUBS</span>
          <span>DPDP ACT SAFETY VERIFIED</span>
        </div>

        {filteredClubs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-surface-1 p-10 text-center space-y-3">
            <Cpu className="mx-auto size-8 text-fg-subtle" aria-hidden="true" />
            <h3 className="font-display text-headline-sm font-semibold text-fg">
              No Innovation Clubs Match Your Filter
            </h3>
            <p className="text-body-sm text-fg-muted max-w-sm mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClubs.map((club) => {
              const saved = isItemSaved(`club:${club.slug}`);
              const joined = joinedClubIds.includes(club.id);

              return (
                <Card
                  key={club.id}
                  className="group flex flex-col justify-between transition-all hover:border-accent/40 min-w-0 [overflow-wrap:anywhere]"
                >
                  <CardBody className="p-5 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {club.category === 'school_atl' && (
                              <Badge tone="learn" variant="outline">
                                <GraduationCap className="size-3" aria-hidden="true" />
                                <span>SCHOOL ATL</span>
                              </Badge>
                            )}
                            {club.category === 'college_robotics' && (
                              <Badge tone="make" variant="outline">
                                <Wrench className="size-3" aria-hidden="true" />
                                <span>COLLEGE ROBOTICS</span>
                              </Badge>
                            )}
                            {club.category === 'community_makerspace' && (
                              <Badge tone="earn" variant="outline">
                                <Layers className="size-3" aria-hidden="true" />
                                <span>COMMUNITY FABLAB</span>
                              </Badge>
                            )}
                            {club.verifiedAtl && (
                              <Badge tone="success" variant="outline">
                                <ShieldCheck className="size-3" aria-hidden="true" />
                                <span>AIM CERTIFIED</span>
                              </Badge>
                            )}
                          </div>

                          <h3 className="font-display text-headline-sm font-bold text-fg group-hover:text-accent-fg transition-colors">
                            <Link href={`/clubs/${club.slug}`}>{club.name}</Link>
                          </h3>
                          <div className="flex items-center gap-1.5 text-body-xs text-fg-muted">
                            <MapPin className="size-3.5 text-fg-subtle shrink-0" aria-hidden="true" />
                            <span>
                              {club.city}, {club.state} · <span className="text-fg-subtle">{club.institution}</span>
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleSaveItem(`club:${club.slug}`)}
                          aria-label={saved ? `Unsave ${club.name}` : `Save ${club.name}`}
                          aria-pressed={saved}
                          className={cn(
                            'flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors',
                            saved
                              ? 'border-accent/40 bg-accent-soft text-accent-fg'
                              : 'border-hairline bg-surface-2/60 text-fg-subtle hover:text-accent-fg',
                          )}
                        >
                          <Bookmark className={cn('size-3.5', saved && 'fill-current')} aria-hidden="true" />
                        </button>
                      </div>

                      <p className="text-body-sm text-fg-muted leading-relaxed line-clamp-2">
                        {club.summary}
                      </p>

                      {/* Focus Areas */}
                      <div className="flex flex-wrap gap-1.5">
                        {club.focusAreas.map((area) => (
                          <span
                            key={area}
                            className="px-2.5 py-0.5 rounded-full bg-sunken border border-hairline text-[11px] font-mono text-fg-muted"
                          >
                            {area}
                          </span>
                        ))}
                      </div>

                      {/* Shared Equipment Snippet */}
                      <div className="rounded-xl border border-hairline bg-sunken/70 p-3 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono text-fg-subtle">
                          <span className="flex items-center gap-1 text-accent-fg font-semibold">
                            <Wrench className="size-3" aria-hidden="true" /> AVAILABLE EQUIPMENT ({club.equipment.length})
                          </span>
                          <span>SLOT READY</span>
                        </div>
                        <div className="space-y-1.5">
                          {club.equipment.slice(0, 3).map((eq) => (
                            <div
                              key={eq.id}
                              className="flex items-center justify-between gap-2 text-body-xs py-1 border-b border-hairline/70 last:border-0"
                            >
                              <div className="min-w-0">
                                <span className="font-display font-semibold text-fg block truncate">
                                  {eq.name}
                                </span>
                                <span className="text-[11px] text-fg-subtle block truncate">
                                  {eq.specs}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setActiveReservation({ club, equipment: eq })}
                                className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-display font-semibold bg-accent-soft text-accent-fg border border-accent/25 hover:bg-accent hover:text-on-solid transition-colors"
                              >
                                Book Slot
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 pt-1 text-center text-body-xs font-mono">
                        <div className="p-2 rounded-xl bg-sunken border border-hairline">
                          <span className="text-fg-subtle text-[10px] block">MEMBERS</span>
                          <span className="text-fg font-bold">{club.memberCount + (joined ? 1 : 0)}+</span>
                        </div>
                        <div className="p-2 rounded-xl bg-sunken border border-hairline">
                          <span className="text-fg-subtle text-[10px] block">PROTOTYPES</span>
                          <span className="text-earn-fg font-bold">{club.activeProjectsCount}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-sunken border border-hairline">
                          <span className="text-fg-subtle text-[10px] block">CHALLENGES</span>
                          <span className="text-accent-fg font-bold">{club.activeChallenges.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-hairline flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => toggleJoinClub(club.id)}
                        aria-pressed={joined}
                        className={cn(
                          'px-3 py-1 rounded-full text-body-xs font-display font-semibold border transition-colors',
                          joined
                            ? 'border-success/35 bg-success/10 text-success-fg'
                            : 'border-accent/25 bg-accent-soft text-accent-fg hover:bg-accent hover:text-on-solid',
                        )}
                      >
                        {joined ? '✓ Member' : 'Join Chapter'}
                      </button>

                      <Link
                        href={`/clubs/${club.slug}`}
                        className="inline-flex items-center gap-1 text-body-xs font-display font-semibold text-accent-fg hover:underline"
                      >
                        <span>View Chapter Profile</span>
                        <ChevronRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* DPDP Act Minor Safety & ATL Mentorship Assurance */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-full bg-accent-soft text-accent shrink-0">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h4 className="font-display text-body-md font-bold text-fg">
              DPDP Act &amp; AIM Child Safety Protocols
            </h4>
            <p className="text-body-xs text-fg-muted mt-0.5 max-w-xl">
              All school student accounts (Ages 10–17) require verified teacher or parent co-signatures for equipment reservations and challenge entries under certified Atal Innovation Mission mentors.
            </p>
          </div>
        </div>
        <Button asChild variant="secondary" size="sm" className="shrink-0">
          <Link href="/moderation">Review Safety Charter</Link>
        </Button>
      </div>

      {/* Equipment Booking Modal */}
      {activeReservation && (
        <EquipmentReservationModal
          club={activeReservation.club}
          equipment={activeReservation.equipment}
          onClose={() => setActiveReservation(null)}
          onConfirmed={(booking) => setBookings((prev) => [booking, ...prev])}
        />
      )}
    </div>
  );
}
