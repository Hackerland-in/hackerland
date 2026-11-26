'use client';

import { useState } from 'react';
import type { ClubEquipment, ClubChapter } from '@hackerland/core';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  Cpu,
  UserCheck,
  Download,
} from 'lucide-react';
import { Badge, Button, Input } from '@hackerland/ui';

export interface StoredEquipmentBooking {
  passCode: string;
  clubSlug: string;
  clubName: string;
  equipmentId: string;
  equipmentName: string;
  requestedDate: string;
  timeSlot: string;
  applicantName: string;
  projectTitle: string;
}

interface EquipmentReservationModalProps {
  club: ClubChapter;
  equipment: ClubEquipment;
  onClose: () => void;
  onConfirmed?: (booking: StoredEquipmentBooking) => void;
}

export function EquipmentReservationModal({
  club,
  equipment,
  onClose,
  onConfirmed,
}: EquipmentReservationModalProps) {
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantRole, setApplicantRole] = useState<'student_k12' | 'college_undergrad' | 'researcher' | 'independent_maker'>('student_k12');
  const [projectTitle, setProjectTitle] = useState('');
  const [requestedDate, setRequestedDate] = useState('2026-11-28');
  const [timeSlot, setTimeSlot] = useState('14:00 - 17:00 IST');
  const [parentMentorCoSign, setParentMentorCoSign] = useState('');

  const [safetyGoggles, setSafetyGoggles] = useState(false);
  const [safetyEsd, setSafetyEsd] = useState(false);
  const [safetyEStop, setSafetyEStop] = useState(false);
  const [safetyVentilation, setSafetyVentilation] = useState(false);

  const [isBooked, setIsBooked] = useState(false);
  const [passCode, setPassCode] = useState('');
  const [copiedPass, setCopiedPass] = useState(false);

  const allSafetyAgreed = safetyGoggles && safetyEsd && safetyEStop && safetyVentilation;
  const isFormValid =
    applicantName.trim().length >= 2 &&
    applicantEmail.includes('@') &&
    projectTitle.trim().length >= 3 &&
    allSafetyAgreed &&
    (applicantRole !== 'student_k12' || parentMentorCoSign.trim().length >= 3);

  const handleBookSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    const generatedPass = `HL-${club.city.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const record: StoredEquipmentBooking = {
      passCode: generatedPass,
      clubSlug: club.slug,
      clubName: club.name,
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      requestedDate,
      timeSlot,
      applicantName: applicantName.trim(),
      projectTitle: projectTitle.trim(),
    };
    try {
      const prevRaw = localStorage.getItem('hackerland_club_bookings');
      const prev = prevRaw ? (JSON.parse(prevRaw) as StoredEquipmentBooking[]) : [];
      localStorage.setItem('hackerland_club_bookings', JSON.stringify([record, ...prev]));
    } catch {}
    if (typeof fetch === 'function') {
      void fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'club_equipment_booking',
          clubSlug: club.slug,
          equipmentId: equipment.id,
          equipmentName: equipment.name,
          slotWindow: `${requestedDate} ${timeSlot}`,
          actorName: applicantName.trim(),
          actorHandle: applicantName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        }),
      }).catch(() => {});
    }
    setPassCode(generatedPass);
    setIsBooked(true);
    onConfirmed?.(record);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="equipment-reservation-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-fg/35 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-hairline bg-surface-1 shadow-overlay p-6 sm:p-7 my-8 text-fg">
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-fg-subtle hover:text-fg transition-colors p-1.5 rounded-full hover:bg-surface-2"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        {isBooked ? (
          <div className="space-y-5 text-center py-3">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-success/10 border border-success/25 text-success-fg">
              <CheckCircle2 className="size-8" aria-hidden="true" />
            </div>

            <div>
              <Badge tone="success" variant="solid" className="mb-2">
                VERIFIED RESERVATION PASS
              </Badge>
              <h2 className="font-display text-headline-md font-bold tracking-tight text-fg">
                Machine Time Confirmed
              </h2>
              <p className="text-body-sm text-fg-muted mt-1 max-w-md mx-auto">
                Your reservation at <strong className="text-fg">{club.name}</strong> has been confirmed. Present this pass to the lab technician.
              </p>
            </div>

            <div className="rounded-xl border border-hairline bg-sunken p-4 text-left space-y-2.5 font-mono text-body-xs">
              <div className="flex items-center justify-between border-b border-hairline pb-2">
                <span className="text-fg-subtle">PASS CODE:</span>
                <span className="text-accent-fg font-bold text-sm tracking-wider">{passCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fg-subtle">EQUIPMENT:</span>
                <span className="text-fg font-semibold">{equipment.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fg-subtle">SCHEDULE:</span>
                <span className="text-fg">{requestedDate} @ {timeSlot}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fg-subtle">RESERVED FOR:</span>
                <span className="text-fg">{applicantName} ({applicantRole})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fg-subtle">PROJECT:</span>
                <span className="text-fg">{projectTitle}</span>
              </div>
              <div className="flex items-center justify-between border-t border-hairline pt-2 text-success-fg font-semibold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3.5" aria-hidden="true" /> SAFETY INDUCTION:
                </span>
                <span>SIGNED &amp; LOGGED</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(passCode);
                  } catch {}
                  setCopiedPass(true);
                  setTimeout(() => setCopiedPass(false), 2000);
                }}
              >
                <Download className="size-3.5" aria-hidden="true" />
                <span>{copiedPass ? 'Copied Pass!' : 'Copy Digital Pass'}</span>
              </Button>
              <Button variant="primary" size="sm" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBookSlot} className="space-y-5">
            <div className="pr-8">
              <div className="flex items-center gap-1.5 text-body-xs font-mono font-semibold text-accent-fg mb-1">
                <Cpu className="size-3.5" aria-hidden="true" />
                <span>SHARED MACHINE REGISTRY · {club.city.toUpperCase()}</span>
              </div>
              <h2 id="equipment-reservation-title" className="font-display text-headline-sm font-bold text-fg">
                Reserve {equipment.name}
              </h2>
              <p className="text-body-xs text-fg-muted mt-0.5">
                {equipment.model} · {equipment.specs}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-hairline bg-sunken text-body-xs">
              <div>
                <span className="text-fg-subtle block">Rate / Access</span>
                <span className="font-display font-bold text-earn-fg">{equipment.hourlyRate}</span>
              </div>
              <div>
                <span className="text-fg-subtle block">Current Status</span>
                <span className="inline-flex items-center gap-1.5 font-display font-semibold text-fg">
                  <span className="size-2 rounded-full bg-success" />
                  {equipment.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-body-xs font-display font-medium text-fg mb-1">
                    Applicant Name *
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-body-xs font-display font-medium text-fg mb-1">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="e.g. ananya@school.edu"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-body-xs font-display font-medium text-fg mb-1">
                    Maker Track / Role
                  </label>
                  <select
                    value={applicantRole}
                    onChange={(e) =>
                      setApplicantRole(
                        e.target.value as
                          | 'student_k12'
                          | 'college_undergrad'
                          | 'researcher'
                          | 'independent_maker',
                      )
                    }
                    className="h-11 w-full rounded-xl border border-line bg-sunken px-3 text-body-sm text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
                  >
                    <option value="student_k12">K-12 School Student (Ages 10–17)</option>
                    <option value="college_undergrad">College Undergrad / Robotics Club</option>
                    <option value="researcher">Academic Researcher / Lab Fellow</option>
                    <option value="independent_maker">Independent Maker / Squad Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block text-body-xs font-display font-medium text-fg mb-1">
                    Project / Prototype Title *
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. LoRa Flood Sensing Telemetry Node"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                  />
                </div>
              </div>

              {applicantRole === 'student_k12' && (
                <div className="p-3.5 rounded-xl border border-warning/35 bg-warning/8 text-body-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-warning-fg font-display font-bold">
                    <UserCheck className="size-4" aria-hidden="true" />
                    <span>DPDP Act Minor Safety: Teacher / Parent Mentor Co-Sign *</span>
                  </div>
                  <p className="text-fg-muted text-[11px] leading-relaxed">
                    Under India&apos;s DPDP Act and AIM safety guidelines, school students require an adult mentor or teacher acknowledgment.
                  </p>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Teacher In-Charge: Smt. Sunita Rao (DPS RKP)"
                    value={parentMentorCoSign}
                    onChange={(e) => setParentMentorCoSign(e.target.value)}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-body-xs font-display font-medium text-fg mb-1 flex items-center gap-1">
                    <Calendar className="size-3.5" aria-hidden="true" /> Requested Date
                  </label>
                  <Input
                    type="date"
                    value={requestedDate}
                    onChange={(e) => setRequestedDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-body-xs font-display font-medium text-fg mb-1 flex items-center gap-1">
                    <Clock className="size-3.5" aria-hidden="true" /> Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="h-11 w-full rounded-xl border border-line bg-sunken px-3 text-body-sm text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
                  >
                    <option value="09:00 - 12:00 IST">Morning: 09:00 – 12:00 IST</option>
                    <option value="14:00 - 17:00 IST">Afternoon: 14:00 – 17:00 IST</option>
                    <option value="17:30 - 20:30 IST">Evening: 17:30 – 20:30 IST</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-hairline bg-sunken p-4 space-y-2.5 text-body-xs">
              <div className="flex items-center gap-1.5 text-accent-fg font-display font-bold">
                <ShieldCheck className="size-4" aria-hidden="true" />
                <span>Mandatory Hardware Safety Induction Checklist</span>
              </div>

              <div className="space-y-2 pt-1 text-fg-muted">
                <label className="flex items-start gap-2.5 cursor-pointer hover:text-fg">
                  <input
                    type="checkbox"
                    checked={safetyGoggles}
                    onChange={(e) => setSafetyGoggles(e.target.checked)}
                    className="mt-0.5 accent-accent"
                  />
                  <span>Eye protection safety goggles will be worn near moving spindles and soldering irons.</span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer hover:text-fg">
                  <input
                    type="checkbox"
                    checked={safetyEsd}
                    onChange={(e) => setSafetyEsd(e.target.checked)}
                    className="mt-0.5 accent-accent"
                  />
                  <span>ESD grounding wrist strap verified before handling unpackaged semiconductors.</span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer hover:text-fg">
                  <input
                    type="checkbox"
                    checked={safetyEStop}
                    onChange={(e) => setSafetyEStop(e.target.checked)}
                    className="mt-0.5 accent-accent"
                  />
                  <span>Emergency E-stop button and Class D extinguisher location identified.</span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer hover:text-fg">
                  <input
                    type="checkbox"
                    checked={safetyVentilation}
                    onChange={(e) => setSafetyVentilation(e.target.checked)}
                    className="mt-0.5 accent-accent"
                  />
                  <span>Fume extractor active during soldering; solvents stored in designated locker.</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-hairline">
              <Button type="button" variant="secondary" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isFormValid} variant="primary" size="sm">
                Confirm Slot Reservation
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
