'use client';

import { useEffect, useState } from 'react';
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
import { Avatar, Badge, Button, Card, CardBody, Panel, cn } from '@hackerland/ui';
import { EquipmentReservationModal, type StoredEquipmentBooking } from './equipment-reservation-modal';

interface ClubDetailViewProps {
  club: ClubChapter;
}

export function ClubDetailView({ club }: ClubDetailViewProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<ClubEquipment | null>(null);
  const [joined, setJoined] = useState(false);
  const [clubBookings, setClubBookings] = useState<StoredEquipmentBooking[]>([]);

  useEffect(() => {
    try {
      const savedJoined = localStorage.getItem('hackerland_joined_clubs');
      if (savedJoined) {
        const parsed = JSON.parse(savedJoined) as string[];
        if (Array.isArray(parsed)) setJoined(parsed.includes(club.id));
      }
      const savedBookings = localStorage.getItem('hackerland_club_bookings');
      if (savedBookings) {
        const parsed = JSON.parse(savedBookings) as StoredEquipmentBooking[];
        if (Array.isArray(parsed)) {
          setClubBookings(parsed.filter((b) => b.clubSlug === club.slug));
        }
      }
    } catch {}
  }, [club.id, club.slug]);

  const toggleJoin = () => {
    const nextJoined = !joined;
    setJoined(nextJoined);
    try {
      const prevRaw = localStorage.getItem('hackerland_joined_clubs');
      const prev = prevRaw ? (JSON.parse(prevRaw) as string[]) : [];
      const updated = nextJoined
        ? Array.from(new Set([...prev, club.id]))
        : prev.filter((id) => id !== club.id);
      localStorage.setItem('hackerland_joined_clubs', JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="space-y-6 min-w-0">
      {/* Back Link */}
      <nav aria-label="Breadcrumb">
        <Link
          href="/clubs"
          className="inline-flex items-center gap-1.5 text-body-sm font-display font-medium text-fg-subtle hover:text-accent-fg transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span>Back to Innovation Clubs &amp; ATL Hub</span>
        </Link>
      </nav>

      {/* Hero Header */}
      <Card className="border-accent/20 bg-gradient-to-br from-surface-1 via-surface-1 to-accent-soft">
        <CardBody className="p-5 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {club.category === 'school_atl' && (
                <Badge tone="learn" variant="outline">
                  <GraduationCap className="size-3.5" aria-hidden="true" />
                  <span>SCHOOL ATAL TINKERING LAB</span>
                </Badge>
              )}
              {club.category === 'college_robotics' && (
                <Badge tone="make" variant="outline">
                  <Wrench className="size-3.5" aria-hidden="true" />
                  <span>COLLEGE ROBOTICS GARAGE</span>
                </Badge>
              )}
              {club.category === 'community_makerspace' && (
                <Badge tone="earn" variant="outline">
                  <Layers className="size-3.5" aria-hidden="true" />
                  <span>COMMUNITY FABLAB</span>
                </Badge>
              )}
              {club.verifiedAtl && (
                <Badge tone="success" variant="solid">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  <span>ATAL INNOVATION MISSION VERIFIED</span>
                </Badge>
              )}
            </div>

            <Button
              variant={joined ? 'soft' : 'primary'}
              size="sm"
              onClick={toggleJoin}
            >
              {joined ? '✓ Chapter Member' : 'Join Chapter'}
            </Button>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg [overflow-wrap:anywhere]">
              {club.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body-xs text-fg-muted">
              <span className="inline-flex items-center gap-1 font-medium text-fg">
                <MapPin className="size-3.5 text-accent" aria-hidden="true" />
                {club.city}, {club.state}
              </span>
              <span>·</span>
              <span>{club.institution}</span>
              <span>·</span>
              <span>Est. {club.foundedYear}</span>
            </div>
            <p className="text-body-sm sm:text-body-md text-fg-muted leading-relaxed">
              {club.summary}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {club.focusAreas.map((area) => (
              <span
                key={area}
                className="px-3 py-1 rounded-full bg-surface-1 border border-hairline text-body-xs font-mono text-fg-muted"
              >
                {area}
              </span>
            ))}
          </div>

          {/* Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-hairline text-center font-mono">
            <div className="p-3 rounded-xl bg-surface-1 border border-hairline">
              <span className="text-fg-subtle text-[10px] block">TOTAL MEMBERS</span>
              <span className="font-display text-headline-sm font-bold text-fg">
                {club.memberCount + (joined ? 1 : 0)}+
              </span>
            </div>
            <div className="p-3 rounded-xl bg-surface-1 border border-hairline">
              <span className="text-fg-subtle text-[10px] block">SHARED MACHINES</span>
              <span className="font-display text-headline-sm font-bold text-earn-fg">
                {club.equipment.length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-surface-1 border border-hairline">
              <span className="text-fg-subtle text-[10px] block">PROTOTYPES SHIPPED</span>
              <span className="font-display text-headline-sm font-bold text-accent-fg">
                {club.establishedPrototypesCount}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-surface-1 border border-hairline">
              <span className="text-fg-subtle text-[10px] block">ACTIVE CHALLENGES</span>
              <span className="font-display text-headline-sm font-bold text-warning-fg">
                {club.activeChallenges.length}
              </span>
            </div>
          </div>

          {/* Contact Box */}
          <div className="rounded-xl border border-hairline bg-surface-1/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-body-xs">
            <div className="space-y-0.5">
              <span className="font-mono text-[10px] uppercase text-fg-subtle block">LAB LOCATION</span>
              <p className="text-fg font-medium">{club.address}</p>
            </div>
            <a
              href={`mailto:${club.contactEmail}`}
              className="inline-flex items-center gap-1.5 font-display font-semibold text-accent-fg hover:underline shrink-0"
            >
              <Mail className="size-3.5" aria-hidden="true" />
              <span>{club.contactEmail}</span>
            </a>
          </div>
        </CardBody>
      </Card>

      {/* Persisted Machine Slot Bookings */}
      {clubBookings.length > 0 && (
        <Panel title="Your Reserved Passes for This Lab" icon={<CheckCircle2 aria-hidden="true" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {clubBookings.map((b) => (
              <div
                key={b.passCode}
                className="rounded-xl border border-success/35 bg-success/8 p-3.5 text-body-xs space-y-1"
              >
                <div className="font-mono font-bold text-success-fg">{b.passCode}</div>
                <div className="font-display font-bold text-fg">{b.equipmentName}</div>
                <div className="text-fg-muted">{b.requestedDate} · {b.timeSlot}</div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* Shared Equipment Registry */}
      <Panel
        title="Shared Equipment Registry"
        icon={<Wrench aria-hidden="true" />}
        action={<Badge tone="accent" variant="outline">{club.equipment.length} MACHINES LISTED</Badge>}
      >
        <div className="space-y-3.5">
          {club.equipment.map((eq) => (
            <div
              key={eq.id}
              className="rounded-2xl border border-hairline bg-sunken/70 p-4 sm:p-5 space-y-3 hover:border-accent/35 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-body-md font-bold text-fg">{eq.name}</h3>
                    <Badge tone="success" variant="outline">
                      {eq.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-body-xs font-mono text-fg-subtle mt-0.5">{eq.model}</p>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setSelectedEquipment(eq)}
                  className="shrink-0"
                >
                  Reserve Machine Slot
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-body-xs p-3 rounded-xl bg-surface-1 border border-hairline">
                <div>
                  <span className="text-fg-subtle block text-[10px] font-mono">SPECIFICATIONS</span>
                  <span className="text-fg font-medium">{eq.specs}</span>
                </div>
                <div>
                  <span className="text-fg-subtle block text-[10px] font-mono">HOURLY RATE</span>
                  <span className="text-earn-fg font-bold">{eq.hourlyRate}</span>
                </div>
              </div>

              {eq.notes && (
                <p className="text-body-xs text-fg-subtle italic">Note: {eq.notes}</p>
              )}
            </div>
          ))}
        </div>
      </Panel>

      {/* Active Build Challenges */}
      <Panel title="Active Build Challenges" icon={<Trophy aria-hidden="true" />}>
        <div className="space-y-3.5">
          {club.activeChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="rounded-2xl border border-hairline bg-sunken/70 p-4 sm:p-5 space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge tone="warning" variant="outline">
                  {challenge.domain.toUpperCase()}
                </Badge>
                <span className="text-body-xs font-mono text-fg-subtle inline-flex items-center gap-1">
                  <Clock className="size-3.5" aria-hidden="true" /> Deadline: {challenge.deadline}
                </span>
              </div>

              <h3 className="font-display text-body-md font-bold text-fg">{challenge.title}</h3>
              <p className="text-body-sm text-fg-muted leading-relaxed">{challenge.description}</p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-hairline text-body-xs font-mono">
                <div className="flex items-center gap-4 text-fg-muted">
                  <span>Prize: <strong className="text-earn-fg">{challenge.prizePool}</strong></span>
                  <span>Team: {challenge.teamSize}</span>
                </div>
                <span className="text-fg-subtle">Org: {challenge.organizer}</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Lead Mentor & Slot Protocols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Panel title="Chapter Lead Mentor" icon={<ShieldCheck aria-hidden="true" />}>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar name={club.leadMentor.name} size="md" />
              <div className="min-w-0">
                <h3 className="font-display text-body-md font-bold text-fg truncate">
                  {club.leadMentor.name}
                </h3>
                <p className="text-body-xs text-accent-fg font-mono">{club.leadMentor.role}</p>
                <p className="text-body-xs text-fg-subtle">{club.leadMentor.organization}</p>
              </div>
            </div>
            <p className="text-body-sm text-fg-muted leading-relaxed">{club.leadMentor.bio}</p>
            {club.leadMentor.verifiedAtlMentor && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-success/10 border border-success/25 text-body-xs text-success-fg font-medium">
                <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
                <span>Verified Atal Innovation Mission (AIM) Mentor</span>
              </div>
            )}
          </div>
        </Panel>

        <Panel title="Slot Booking Protocols" icon={<ShieldCheck aria-hidden="true" />}>
          <ul className="space-y-2 text-body-sm text-fg-muted list-disc pl-4">
            <li>Arrive 15 minutes before the allocated machine slot.</li>
            <li>Present the digital pass code to the lab superintendent.</li>
            <li>Bring personal eye protection safety goggles and ESD wrist strap.</li>
            <li>School student makers (Grades 6–12) must bring teacher mentor co-signature.</li>
            <li>Clean machine bed and return all drill bits before sign-off.</li>
          </ul>
        </Panel>
      </div>

      {/* Equipment Booking Modal */}
      {selectedEquipment && (
        <EquipmentReservationModal
          club={club}
          equipment={selectedEquipment}
          onClose={() => setSelectedEquipment(null)}
          onConfirmed={(booking) => setClubBookings((prev) => [booking, ...prev])}
        />
      )}
    </div>
  );
}
