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
import { Button } from '@hackerland/ui';

interface EquipmentReservationModalProps {
  club: ClubChapter;
  equipment: ClubEquipment;
  onClose: () => void;
}

export function EquipmentReservationModal({
  club,
  equipment,
  onClose,
}: EquipmentReservationModalProps) {
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantRole, setApplicantRole] = useState<'student_k12' | 'college_undergrad' | 'researcher' | 'independent_maker'>('student_k12');
  const [projectTitle, setProjectTitle] = useState('');
  const [requestedDate, setRequestedDate] = useState('2026-11-20');
  const [timeSlot, setTimeSlot] = useState('14:00 - 17:00 IST');
  const [parentMentorCoSign, setParentMentorCoSign] = useState('');
  
  // Safety induction items
  const [safetyGoggles, setSafetyGoggles] = useState(false);
  const [safetyEsd, setSafetyEsd] = useState(false);
  const [safetyEStop, setSafetyEStop] = useState(false);
  const [safetyVentilation, setSafetyVentilation] = useState(false);

  const [isBooked, setIsBooked] = useState(false);
  const [passCode, setPassCode] = useState('');

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
    setPassCode(generatedPass);
    setIsBooked(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="equipment-reservation-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl p-6 sm:p-8 my-8 text-neutral-100">
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-neutral-800"
        >
          <X className="size-5" />
        </button>

        {isBooked ? (
          <div className="space-y-6 text-center py-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="size-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                VERIFIED RESERVATION PASS
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Machine Time Confirmed</h2>
              <p className="text-sm text-neutral-400 mt-1 max-w-md mx-auto">
                Your reservation at <span className="text-neutral-200 font-medium">{club.name}</span> has been confirmed. Present this pass to the lab technician.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-neutral-950/60 p-5 text-left space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-neutral-400">PASS CODE:</span>
                <span className="text-emerald-400 font-bold text-sm tracking-wider">{passCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">EQUIPMENT:</span>
                <span className="text-white font-medium">{equipment.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">SCHEDULE:</span>
                <span className="text-white">{requestedDate} @ {timeSlot}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">RESERVED FOR:</span>
                <span className="text-white">{applicantName} ({applicantRole})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">PROJECT:</span>
                <span className="text-white">{projectTitle}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-2 text-emerald-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3.5" /> SAFETY INDUCTION:
                </span>
                <span>SIGNED & LOGGED</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                variant="secondary"
                className="text-xs font-mono"
                onClick={() => {
                  alert(`Digital Pass ${passCode} copied to clipboard.`);
                }}
              >
                <Download className="size-3.5 mr-1.5" />
                Copy Digital Pass
              </Button>
              <Button
                variant="primary"
                className="text-xs font-mono bg-emerald-600 hover:bg-emerald-500 text-white"
                onClick={onClose}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBookSlot} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <Cpu className="size-3.5" />
                <span>SHARED MACHINE REGISTRY · {club.city.toUpperCase()}</span>
              </div>
              <h2 id="equipment-reservation-title" className="text-xl font-bold text-white">
                Reserve {equipment.name}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                {equipment.model} · <span className="text-neutral-300">{equipment.specs}</span>
              </p>
            </div>

            {/* Equipment Highlights */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-white/10 bg-neutral-950/40 text-xs">
              <div>
                <span className="text-neutral-500 block">Rate / Access</span>
                <span className="font-medium text-emerald-300">{equipment.hourlyRate}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Current Status</span>
                <span className="inline-flex items-center gap-1 font-medium text-white">
                  <span className="size-2 rounded-full bg-emerald-400"></span>
                  {equipment.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {/* Applicant Details */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Applicant Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ananya@school.edu"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Maker Track / Role</label>
                  <select
                    value={applicantRole}
                    onChange={(e) => setApplicantRole(e.target.value as typeof applicantRole)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="student_k12">K-12 School Student (Ages 10-17)</option>
                    <option value="college_undergrad">College Undergrad / Robotics Club</option>
                    <option value="researcher">Academic Researcher / Lab Fellow</option>
                    <option value="independent_maker">Independent Maker / Squad Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Project / Prototype Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LoRa Flood Sensing Telemetry Node"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {applicantRole === 'student_k12' && (
                <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                    <UserCheck className="size-4" />
                    <span>DPDP Act Minor Safety: Teacher / Parent Mentor Co-Sign *</span>
                  </div>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    Under India Digital Personal Data Protection (DPDP) Act and Atal Innovation Mission safety guidelines, school students require an adult mentor or teacher in-charge acknowledgment.
                  </p>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Teacher In-Charge: Smt. Sunita Rao (DPS RKP)"
                    value={parentMentorCoSign}
                    onChange={(e) => setParentMentorCoSign(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-1.5 text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Slot and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1 flex items-center gap-1">
                    <Calendar className="size-3" /> Requested Date
                  </label>
                  <input
                    type="date"
                    value={requestedDate}
                    onChange={(e) => setRequestedDate(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1 flex items-center gap-1">
                    <Clock className="size-3" /> Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="09:00 - 12:00 IST">Morning: 09:00 - 12:00 IST</option>
                    <option value="14:00 - 17:00 IST">Afternoon: 14:00 - 17:00 IST</option>
                    <option value="17:30 - 20:30 IST">Evening: 17:30 - 20:30 IST</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Safety Induction Checklist */}
            <div className="rounded-xl border border-white/10 bg-neutral-950/60 p-4 space-y-3 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="size-4" />
                <span>Mandatory Hardware Safety Induction Checklist</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                You must confirm physical compliance with lab safety protocols prior to booking machine time:
              </p>

              <div className="space-y-2 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-neutral-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={safetyGoggles}
                    onChange={(e) => setSafetyGoggles(e.target.checked)}
                    className="mt-0.5 rounded border-neutral-700 bg-neutral-900 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Eye protection safety goggles will be worn at all times near moving spindles and soldering irons.</span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer text-neutral-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={safetyEsd}
                    onChange={(e) => setSafetyEsd(e.target.checked)}
                    className="mt-0.5 rounded border-neutral-700 bg-neutral-900 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>ESD grounding wrist strap verified before touching unpackaged semiconductors and PCB testbenches.</span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer text-neutral-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={safetyEStop}
                    onChange={(e) => setSafetyEStop(e.target.checked)}
                    className="mt-0.5 rounded border-neutral-700 bg-neutral-900 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Emergency E-stop button location and Class D fire extinguisher protocol identified.</span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer text-neutral-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={safetyVentilation}
                    onChange={(e) => setSafetyVentilation(e.target.checked)}
                    className="mt-0.5 rounded border-neutral-700 bg-neutral-900 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Fume extractor active during soldering; toxic resins/solvents (IPA) kept in designated flammables locker.</span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={onClose} className="text-xs">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid}
                variant="primary"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono disabled:opacity-40"
              >
                Confirm Slot Reservation
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
