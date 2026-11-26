'use client';

import { useState, useCallback, useRef, useId } from 'react';
import { useRouter } from 'next/navigation';
import {
  TRACKS,
  TRACK_META,
  handleSchema,
  type Track,
} from '@hackerland/core';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FilterChip,
  Input,
  Label,
  SegmentedProgress,
  Textarea,
  cn,
} from '@hackerland/ui';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Plus,
  X,
} from 'lucide-react';

const SUGGESTED_SKILLS = [
  'TypeScript',
  'Next.js',
  'Rust',
  'Embedded C',
  'STM32',
  'PCB Design',
  'Robotics',
  'CAD',
  'UI/UX',
  'Machine Learning',
  'Aerodynamics',
  'Computer Vision',
];

const EXPERIENCE_BADGE_OPTIONS: { label: string; tone: Track | 'neutral' }[] = [
  { label: 'Student', tone: 'code' },
  { label: 'Maker', tone: 'make' },
  { label: 'Researcher', tone: 'research' },
  { label: 'Designer', tone: 'design' },
  { label: 'Mentor', tone: 'neutral' },
  { label: 'Founder', tone: 'earn' },
];

export function OnboardingStudio() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [handleChecking, setHandleChecking] = useState(false);
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);
  const [handleError, setHandleError] = useState<string | null>(null);

  const [selectedTracks, setSelectedTracks] = useState<Track[]>(['code']);
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');

  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<string[]>(['Maker']);
  const [isMinor, setIsMinor] = useState(false);
  const [parentalConsent, setParentalConsent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const consentId = useId();
  const minorId = useId();
  const handleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkHandleAvailability = useCallback(async (cleanHandle: string) => {
    setHandleChecking(true);
    try {
      const res = await fetch(`/api/u/check-handle?handle=${encodeURIComponent(cleanHandle)}`);
      if (res.ok) {
        const data = await res.json();
        setHandleAvailable(data.available);
        if (!data.available) {
          setHandleError(data.error || 'This handle is already taken.');
        }
      } else {
        setHandleAvailable(true);
      }
    } catch {
      setHandleAvailable(true);
    } finally {
      setHandleChecking(false);
    }
  }, []);

  const handleHandleChange = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setHandle(clean);

    if (handleTimerRef.current) {
      clearTimeout(handleTimerRef.current);
    }

    if (!clean) {
      setHandleAvailable(null);
      setHandleError(null);
      setHandleChecking(false);
      return;
    }

    const parseResult = handleSchema.safeParse(clean);
    if (!parseResult.success) {
      setHandleAvailable(false);
      setHandleError('3–30 chars, lowercase letters, numbers, and inner hyphens only.');
      setHandleChecking(false);
      return;
    }

    setHandleError(null);
    setHandleChecking(true);

    handleTimerRef.current = setTimeout(() => {
      checkHandleAvailability(clean);
    }, 300);
  };

  const toggleTrack = (track: Track) => {
    if (selectedTracks.includes(track)) {
      if (selectedTracks.length > 1) {
        setSelectedTracks(selectedTracks.filter((t) => t !== track));
      }
    } else {
      setSelectedTracks([...selectedTracks, track]);
    }
  };

  const addSkill = (skillName: string) => {
    const trimmed = skillName.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
  };

  const removeSkill = (skillName: string) => {
    setSkills(skills.filter((s) => s !== skillName));
  };

  const toggleBadge = (badgeLabel: string) => {
    if (selectedBadges.includes(badgeLabel)) {
      setSelectedBadges(selectedBadges.filter((b) => b !== badgeLabel));
    } else {
      setSelectedBadges([...selectedBadges, badgeLabel]);
    }
  };

  const handleMinorToggle = (checked: boolean) => {
    setIsMinor(checked);
    if (checked && !selectedBadges.includes('Student')) {
      setSelectedBadges((prev) => [...prev, 'Student']);
    }
  };

  const canProceedStep1 =
    displayName.trim().length >= 2 &&
    handle.length >= 3 &&
    handleAvailable !== false &&
    !handleError;

  const canProceedStep2 = selectedTracks.length >= 1;

  const canSubmitStep3 =
    headline.trim().length >= 3 &&
    bio.trim().length >= 10 &&
    (!isMinor || parentalConsent);

  const handleSubmit = async () => {
    if (!canSubmitStep3) return;

    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      handle: handle.toLowerCase().trim(),
      displayName: displayName.trim(),
      tracks: selectedTracks,
      skills,
      headline: headline.trim(),
      bio: bio.trim(),
      experienceBadges: selectedBadges.map((badgeLabel) => {
        const found = EXPERIENCE_BADGE_OPTIONS.find((b) => b.label === badgeLabel);
        return {
          label: badgeLabel,
          tone: found?.tone ?? 'neutral',
        };
      }),
      isMinor,
      hasParentalConsent: isMinor ? parentalConsent : undefined,
    };

    try {
      localStorage.setItem('hackerland_user_profile', JSON.stringify(payload));
      window.dispatchEvent(new CustomEvent('hackerland:profile-updated', { detail: payload }));
    } catch {}

    try {
      const res = await fetch('/api/me/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 404 || res.status === 503 || res.status === 401) {
          router.push(`/u/${payload.handle}`);
          return;
        }
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || 'Failed to save profile. Please try again.');
        setSubmitting(false);
        return;
      }

      router.push(`/u/${payload.handle}`);
    } catch {
      router.push(`/u/${payload.handle}`);
    }
  };

  return (
    <div className="space-y-6 min-w-0">
      {/* Rosepaper Hero Header */}
      <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
          <Sparkles className="size-3.5" aria-hidden="true" />
          <span>Maker Identity Onboarding</span>
        </div>
        <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
          Claim your innovator identity
        </h1>
        <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
          Set up your public builder handle, core tracks, and proof-of-ship badges to connect with squads across Hackerland.
        </p>
      </header>

      {/* Step Progress Indicator */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-4 space-y-2 shadow-xs">
        <div className="flex items-center justify-between text-label-sm uppercase font-display text-fg-subtle">
          <span>
            Step {step + 1} of 3: {['Handle & Name', 'Disciplines & Skills', 'Bio & Badges'][step]}
          </span>
          <span className="tabular-nums text-accent-fg font-bold">
            {Math.round(((step + 1) / 3) * 100)}%
          </span>
        </div>
        <SegmentedProgress
          total={3}
          completed={step + 1}
          tone="accent"
          label={`Step ${step + 1} of 3`}
        />
      </div>

      {submitError && (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-body-sm text-danger-fg"
        >
          {submitError}
        </div>
      )}

      {/* Step Card */}
      <Card className="min-w-0 break-words border-hairline bg-surface-1 shadow-xs">
        <CardBody className="p-6 space-y-6">
          {step === 0 && (
            <div className="space-y-5">
              <CardHeader className="p-0">
                <h2 className="font-display text-headline-sm font-bold text-fg">
                  Claim your unique @handle
                </h2>
                <p className="text-body-sm text-fg-muted">
                  Your handle links your builds, sprint check-ins, bounties, and Innovation Passport.
                </p>
              </CardHeader>

              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  placeholder="e.g. Dr. Meera Iyer or Kabir Shah"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={60}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="handle-input">Innovator Handle</Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 font-mono text-body-md text-fg-subtle">
                    @
                  </div>
                  <Input
                    id="handle-input"
                    className="pl-8 font-mono text-body-md"
                    placeholder="handle"
                    value={handle}
                    onChange={(e) => handleHandleChange(e.target.value)}
                    invalid={Boolean(handleError)}
                    maxLength={30}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    {handleChecking ? (
                      <Loader2 className="size-4 animate-spin text-accent" />
                    ) : handleAvailable === true ? (
                      <CheckCircle2 className="size-4 text-success-fg" />
                    ) : handleAvailable === false ? (
                      <XCircle className="size-4 text-danger-fg" />
                    ) : null}
                  </div>
                </div>

                {handleError ? (
                  <p className="text-body-xs text-danger-fg">{handleError}</p>
                ) : handleAvailable === true ? (
                  <p className="text-body-xs text-success-fg font-medium">@{handle} is available!</p>
                ) : (
                  <p className="text-body-xs text-fg-subtle">
                    3–30 lowercase letters, numbers, and hyphens.
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <CardHeader className="p-0">
                <h2 className="font-display text-headline-sm font-bold text-fg">
                  Choose your primary tracks &amp; skills
                </h2>
                <p className="text-body-sm text-fg-muted">
                  Hackerland matches squads, sprints, and bounties to your chosen disciplines.
                </p>
              </CardHeader>

              <div className="space-y-3">
                <Label>Primary Tracks (select all that apply)</Label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {TRACKS.map((track) => {
                    const isSelected = selectedTracks.includes(track);
                    const meta = TRACK_META[track];
                    return (
                      <button
                        key={track}
                        type="button"
                        onClick={() => toggleTrack(track)}
                        aria-pressed={isSelected}
                        className={cn(
                          'flex flex-col items-start gap-1 rounded-xl border p-3.5 text-left transition-all',
                          isSelected
                            ? 'border-accent bg-accent-soft/60'
                            : 'border-hairline bg-surface-1 hover:border-accent/40',
                        )}
                      >
                        <div className="flex w-full items-center justify-between">
                          <Badge tone={track} variant={isSelected ? 'solid' : 'outline'}>
                            {meta.label}
                          </Badge>
                          {isSelected && <CheckCircle2 className="size-4 text-accent" />}
                        </div>
                        <p className="text-body-xs text-fg-muted mt-1">{meta.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <Label>Top Skills &amp; Technologies</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom skill (e.g. FreeRTOS, PyTorch)"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(customSkill);
                        setCustomSkill('');
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      addSkill(customSkill);
                      setCustomSkill('');
                    }}
                  >
                    <Plus className="size-4" />
                    <span>Add</span>
                  </Button>
                </div>

                {skills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 text-body-xs font-medium text-accent-fg"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-fg transition-colors"
                          aria-label={`Remove ${skill}`}
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="space-y-2 pt-1">
                  <p className="text-body-xs text-fg-subtle">Popular suggestions:</p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {SUGGESTED_SKILLS.map((skill) => {
                      const isAdded = skills.includes(skill);
                      return (
                        <FilterChip
                          key={skill}
                          selected={isAdded}
                          tone="accent"
                          onClick={() => (isAdded ? removeSkill(skill) : addSkill(skill))}
                        >
                          {skill}
                        </FilterChip>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <CardHeader className="p-0">
                <h2 className="font-display text-headline-sm font-bold text-fg">
                  Bio, experience &amp; compliance
                </h2>
                <p className="text-body-sm text-fg-muted">
                  Share your focus areas. Hackerland never shows ages publicly; choose experience badges instead.
                </p>
              </CardHeader>

              <div className="space-y-2">
                <Label htmlFor="headline-input">Professional Headline</Label>
                <Input
                  id="headline-input"
                  placeholder="e.g. Embedded Firmware Engineer · IIT Bombay"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  maxLength={120}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio-input">About You (Bio)</Label>
                <Textarea
                  id="bio-input"
                  rows={4}
                  placeholder="Tell other makers what you build, proudest prototypes, and squads you wish to join..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={500}
                />
              </div>

              <div className="space-y-2.5">
                <Label>Experience Badges</Label>
                <div className="flex flex-wrap items-center gap-2">
                  {EXPERIENCE_BADGE_OPTIONS.map((badge) => {
                    const isSelected = selectedBadges.includes(badge.label);
                    return (
                      <button
                        key={badge.label}
                        type="button"
                        onClick={() => toggleBadge(badge.label)}
                        aria-pressed={isSelected}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-display text-label-sm uppercase transition-all',
                          isSelected
                            ? 'border-accent bg-accent text-on-solid'
                            : 'border-hairline bg-sunken text-fg-muted hover:border-accent/40 hover:text-fg',
                        )}
                      >
                        {badge.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-hairline bg-sunken p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={minorId}
                    checked={isMinor}
                    onChange={(e) => handleMinorToggle(e.target.checked)}
                    className="mt-1 size-4 rounded border-line bg-surface-1 accent-accent"
                  />
                  <label htmlFor={minorId} className="cursor-pointer text-body-sm text-fg">
                    <span className="font-semibold block">I am under 18 years of age</span>
                    <span className="text-fg-muted block text-body-xs">
                      Student makers welcome with DPDP Act 2023 safety protections.
                    </span>
                  </label>
                </div>

                {isMinor && (
                  <div className="rounded-xl border border-accent/25 bg-accent-soft p-3.5 space-y-2.5">
                    <div className="flex items-center gap-2 text-accent-fg">
                      <ShieldAlert className="size-4 shrink-0" />
                      <p className="font-display text-label-sm uppercase font-bold">
                        India DPDP Act 2023 Compliance
                      </p>
                    </div>
                    <p className="text-body-xs text-fg-muted leading-relaxed">
                      Zero behavioural ad tracking and verified guardian approval before paid bounties or physical lab slots.
                    </p>
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id={consentId}
                        checked={parentalConsent}
                        onChange={(e) => setParentalConsent(e.target.checked)}
                        className="mt-0.5 size-4 rounded border-line bg-surface-1 accent-accent"
                      />
                      <label htmlFor={consentId} className="cursor-pointer text-body-xs font-medium text-fg">
                        I confirm that I have verifiable parental or guardian consent to participate on Hackerland.
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardBody>

        <CardFooter className="flex flex-wrap items-center justify-between gap-3 bg-surface-2/40 border-t border-hairline">
          {step > 0 ? (
            <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="size-4" />
              <span>Back</span>
            </Button>
          ) : (
            <div />
          )}

          {step < 2 ? (
            <Button
              type="button"
              variant="primary"
              disabled={step === 0 ? !canProceedStep1 : !canProceedStep2}
              onClick={() => setStep(step + 1)}
            >
              <span>Continue</span>
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              disabled={!canSubmitStep3 || submitting}
              loading={submitting}
              onClick={handleSubmit}
            >
              <Sparkles className="size-4" />
              <span>Complete Profile &amp; Launch</span>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
