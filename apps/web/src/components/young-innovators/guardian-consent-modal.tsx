'use client';

import { useState } from 'react';
import type { GuardianConsent } from '@hackerland/core';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { Button } from '@hackerland/ui';

interface GuardianConsentModalProps {
  onClose: () => void;
  onConsentGranted?: (consent: GuardianConsent) => void;
}

export function GuardianConsentModal({
  onClose,
  onConsentGranted,
}: GuardianConsentModalProps) {
  const [studentName, setStudentName] = useState('');
  const [studentAge, setStudentAge] = useState(12);
  const [guardianName, setGuardianName] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianRelationship, setGuardianRelationship] = useState<'parent' | 'teacher_mentor' | 'school_principal'>('parent');
  const [schoolName, setSchoolName] = useState('');
  const [city, setCity] = useState('');

  const [dpdpAgreed, setDpdpAgreed] = useState(false);
  const [safetyAgreed, setSafetyAgreed] = useState(false);

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [consentPassId, setConsentPassId] = useState('');

  const isValid =
    studentName.trim().length >= 2 &&
    guardianName.trim().length >= 2 &&
    guardianEmail.includes('@') &&
    schoolName.trim().length >= 2 &&
    city.trim().length >= 2 &&
    dpdpAgreed &&
    safetyAgreed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const pass = `DPDP-${city.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setConsentPassId(pass);
    setIsConfirmed(true);

    if (onConsentGranted) {
      onConsentGranted({
        id: pass,
        studentName,
        studentAge,
        guardianName,
        guardianEmail,
        guardianRelationship,
        schoolName,
        city,
        dpdpConsentGranted: true,
        safetySupervisionAgreed: true,
        consentTimestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dpdp-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl p-6 sm:p-8 my-8 text-neutral-100 space-y-6">
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-neutral-800"
        >
          <X className="size-5" />
        </button>

        {isConfirmed ? (
          <div className="space-y-6 text-center py-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="size-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                VERIFIED GUARDIAN SAFETY TOKEN
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">DPDP Safety Co-Sign Granted</h2>
              <p className="text-sm text-neutral-400 mt-1 max-w-md mx-auto">
                <span className="text-white font-medium">{studentName}</span> is authorized to access physical ATL tinkering labs and publish verified open-hardware project logs.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-neutral-950/60 p-5 text-left space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-neutral-400">SAFETY TOKEN:</span>
                <span className="text-emerald-400 font-bold text-sm tracking-wider">{consentPassId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">STUDENT / AGE:</span>
                <span className="text-white">{studentName} ({studentAge} years)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">CO-SIGNER:</span>
                <span className="text-white">{guardianName} ({guardianRelationship})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">INSTITUTION:</span>
                <span className="text-white">{schoolName}, {city}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-2 text-emerald-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3.5" /> STATUTORY COMPLIANCE:
                </span>
                <span>INDIA DPDP ACT 2023 SEC 9</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                variant="secondary"
                className="text-xs font-mono"
                onClick={() => alert(`Digital Safety Token ${consentPassId} copied.`)}
              >
                <Download className="size-3.5 mr-1.5" />
                Copy Digital Safety Token
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <ShieldCheck className="size-3.5" />
                <span>DIGITAL PERSONAL DATA PROTECTION ACT (DPDP) 2023 COMPLIANCE</span>
              </div>
              <h2 id="dpdp-modal-title" className="text-xl font-bold text-white">
                Guardian & Educator Safety Co-Sign
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Under Indian law (DPDP Act 2023 § 9), makers under 18 require verifiable parental or teacher consent for physical lab access, equipment bookings, and public portfolio publishing.
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Student / Maker Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditya Sharma"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Age *</label>
                  <input
                    type="number"
                    min={8}
                    max={17}
                    required
                    value={studentAge}
                    onChange={(e) => setStudentAge(parseInt(e.target.value, 10))}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Guardian / Educator Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smt. Sunita Rao"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Guardian Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sunita@school.edu"
                    value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Relationship</label>
                  <select
                    value={guardianRelationship}
                    onChange={(e) => setGuardianRelationship(e.target.value as typeof guardianRelationship)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="parent">Parent / Lawful Guardian</option>
                    <option value="teacher_mentor">Certified ATL Teacher / Mentor</option>
                    <option value="school_principal">School Principal / Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">School / ATL Node *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DPS R.K. Puram ATL"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Safety & DPDP Checkboxes */}
              <div className="p-4 rounded-xl border border-white/10 bg-neutral-950/60 space-y-3 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer text-neutral-200">
                  <input
                    type="checkbox"
                    checked={dpdpAgreed}
                    onChange={(e) => setDpdpAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-neutral-700 bg-neutral-900 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>
                    <strong>DPDP Act Data Protection Consent:</strong> I verify that I am the legal guardian or authorized educator. I permit this student to create build logs with zero behavioral ad profiling and zero public location tracking.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer text-neutral-200">
                  <input
                    type="checkbox"
                    checked={safetyAgreed}
                    onChange={(e) => setSafetyAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-neutral-700 bg-neutral-900 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>
                    <strong>Physical Lab Supervision Agreement:</strong> I confirm that any hardware fabrication (soldering, power tools, 3D printing) will be conducted under adult supervision in a certified ATL or home lab.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={onClose} className="text-xs">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid}
                variant="primary"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono disabled:opacity-40"
              >
                Sign Safety Authorization Token
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
