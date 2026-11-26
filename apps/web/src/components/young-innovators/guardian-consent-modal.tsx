'use client';

import { useState } from 'react';
import type { GuardianConsent } from '@hackerland/core';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { Badge, Button, Input } from '@hackerland/ui';

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
  const [copiedToken, setCopiedToken] = useState(false);

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

    if (typeof fetch === 'function') {
      void fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'guardian_consent',
          actorName: studentName.trim(),
          details: {
            passId: pass,
            studentAge,
            guardianName,
            guardianEmail,
            guardianRelationship,
            schoolName,
            city,
          },
        }),
      }).catch(() => {});
    }

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-fg/35 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-hairline bg-surface-1 shadow-overlay p-6 sm:p-7 my-8 text-fg space-y-5">
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-fg-subtle hover:text-fg transition-colors p-1.5 rounded-full hover:bg-surface-2"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        {isConfirmed ? (
          <div className="space-y-5 text-center py-3">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-success/10 border border-success/25 text-success-fg">
              <CheckCircle2 className="size-8" aria-hidden="true" />
            </div>

            <div>
              <Badge tone="success" variant="solid" className="mb-2">
                VERIFIED GUARDIAN SAFETY TOKEN
              </Badge>
              <h2 className="font-display text-headline-md font-bold tracking-tight text-fg">
                DPDP Safety Co-Sign Granted
              </h2>
              <p className="text-body-sm text-fg-muted mt-1 max-w-md mx-auto">
                <strong className="text-fg">{studentName}</strong> is authorized to access physical ATL tinkering labs and publish verified open-hardware project logs.
              </p>
            </div>

            <div className="rounded-xl border border-hairline bg-sunken p-4 text-left space-y-2.5 font-mono text-body-xs">
              <div className="flex items-center justify-between border-b border-hairline pb-2">
                <span className="text-fg-subtle">SAFETY TOKEN:</span>
                <span className="text-accent-fg font-bold text-sm tracking-wider">{consentPassId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fg-subtle">STUDENT / AGE:</span>
                <span className="text-fg">{studentName} ({studentAge} years)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fg-subtle">CO-SIGNER:</span>
                <span className="text-fg">{guardianName} ({guardianRelationship})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fg-subtle">INSTITUTION:</span>
                <span className="text-fg">{schoolName}, {city}</span>
              </div>
              <div className="flex items-center justify-between border-t border-hairline pt-2 text-success-fg font-semibold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3.5" aria-hidden="true" /> STATUTORY COMPLIANCE:
                </span>
                <span>INDIA DPDP ACT 2023 SEC 9</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(consentPassId);
                  } catch {}
                  setCopiedToken(true);
                  setTimeout(() => setCopiedToken(false), 2000);
                }}
              >
                <Download className="size-3.5" aria-hidden="true" />
                <span>{copiedToken ? 'Copied Token!' : 'Copy Digital Safety Token'}</span>
              </Button>
              <Button variant="primary" size="sm" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="pr-8">
              <div className="flex items-center gap-1.5 text-body-xs font-mono font-semibold text-accent-fg mb-1">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                <span>DIGITAL PERSONAL DATA PROTECTION ACT (DPDP) 2023</span>
              </div>
              <h2 id="dpdp-modal-title" className="font-display text-headline-sm font-bold text-fg">
                Guardian &amp; Educator Safety Co-Sign
              </h2>
              <p className="text-body-xs text-fg-muted mt-1">
                Under Indian law (DPDP Act 2023 § 9), makers under 18 require verifiable parental or teacher consent for lab bookings and public portfolio logs.
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-body-xs font-display font-medium text-fg mb-1">
                    Student / Maker Name *
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Aditya Sharma"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-body-xs font-display font-medium text-fg mb-1">
                    Age *
                  </label>
                  <Input
                    type="number"
                    min={8}
                    max={17}
                    required
                    value={studentAge}
                    onChange={(e) => setStudentAge(parseInt(e.target.value, 10) || 12)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-body-xs font-display font-medium text-fg mb-1">
                    Guardian / Educator Name *
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Smt. Sunita Rao"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-body-xs font-display font-medium text-fg mb-1">
                    Guardian Email Address *
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="e.g. sunita@school.edu"
                    value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-body-xs font-display font-medium text-fg mb-1">
                    Relationship
                  </label>
                  <select
                    value={guardianRelationship}
                    onChange={(e) =>
                      setGuardianRelationship(
                        e.target.value as 'parent' | 'teacher_mentor' | 'school_principal',
                      )
                    }
                    className="h-11 w-full rounded-xl border border-line bg-sunken px-3 text-body-sm text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
                  >
                    <option value="parent">Parent / Lawful Guardian</option>
                    <option value="teacher_mentor">Certified ATL Teacher / Mentor</option>
                    <option value="school_principal">School Principal / Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-body-xs font-display font-medium text-fg mb-1">
                    School / ATL Node *
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. DPS R.K. Puram ATL"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-body-xs font-display font-medium text-fg mb-1">
                    City *
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. New Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-hairline bg-sunken space-y-3 text-body-xs text-fg-muted">
                <label className="flex items-start gap-2.5 cursor-pointer hover:text-fg">
                  <input
                    type="checkbox"
                    checked={dpdpAgreed}
                    onChange={(e) => setDpdpAgreed(e.target.checked)}
                    className="mt-0.5 accent-accent"
                  />
                  <span>
                    <strong className="text-fg">DPDP Act Data Protection Consent:</strong> I verify that I am the legal guardian or authorized educator. I permit this student to create build logs with zero behavioral ad profiling.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer hover:text-fg">
                  <input
                    type="checkbox"
                    checked={safetyAgreed}
                    onChange={(e) => setSafetyAgreed(e.target.checked)}
                    className="mt-0.5 accent-accent"
                  />
                  <span>
                    <strong className="text-fg">Physical Lab Supervision Agreement:</strong> I confirm hardware fabrication (soldering, power tools, 3D printing) will occur under adult supervision.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-hairline">
              <Button type="button" variant="secondary" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid} variant="primary" size="sm">
                Sign Safety Authorization Token
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
