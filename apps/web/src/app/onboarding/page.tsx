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
  SectionHeader,
  SegmentedProgress,
  Textarea,
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

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 1: Handle & Name
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [handleChecking, setHandleChecking] = useState(false);
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);
  const [handleError, setHandleError] = useState<string | null>(null);

  // Step 2: Tracks & Skills
  const [selectedTracks, setSelectedTracks] = useState<Track[]>(['code']);
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');

  // Step 3: Bio & Experience
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<string[]>(['Maker']);
  const [isMinor, setIsMinor] = useState(false);
  const [parentalConsent, setParentalConsent] = useState(false);

  // Submission state
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
    }, 400);
  };

  // Handle track toggling
  const toggleTrack = (track: Track) => {
    if (selectedTracks.includes(track)) {
      if (selectedTracks.length > 1) {
        setSelectedTracks(selectedTracks.filter((t) => t !== track));
      }
    } else {
      setSelectedTracks([...selectedTracks, track]);
    }
  };

  // Handle skill adding / removing
  const addSkill = (skillName: string) => {
    const trimmed = skillName.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
  };

  const removeSkill = (skillName: string) => {
    setSkills(skills.filter((s) => s !== skillName));
  };

  // Handle badge toggle
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
    handleAvailable === true &&
    !handleError;

  const canProceedStep2 = selectedTracks.length >= 1;

  const canSubmitStep3 =
    headline.trim().length >= 3 &&
    bio.trim().length >= 10 &&
    (!isMinor || parentalConsent);

  // Final submission
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
      const res = await fetch('/api/me/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        // If API endpoint is not yet mounted or database is offline, route to public profile preview
        if (res.status === 404 || res.status === 503) {
          router.push(`/u/${payload.handle}`);
          return;
        }
        setSubmitError(data.error || 'Failed to save profile. Please try again.');
        setSubmitting(false);
        return;
      }

      router.push(`/u/${payload.handle}`);
    } catch {
      // Graceful fallback to client navigation
      router.push(`/u/${payload.handle}`);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-16 min-w-0 space-y-8">
      {/* Header */}
      <SectionHeader
        as="h1"
        size="page"
        eyebrow="ONBOARDING · MISSION CONTROL"
        title="Claim your innovator identity"
        description="Set up your public builder profile, select your core tracks, and start collaborating."
      />

      {/* Step Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-label-sm uppercase font-display text-fg-subtle">
          <span>
            Step {step + 1} of 3: {['Handle & Name', 'Disciplines & Skills', 'Bio & Badges'][step]}
          </span>
          <span className="tabular-nums">{Math.round(((step + 1) / 3) * 100)}%</span>
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
          className="rounded-md border border-danger/40 bg-danger/10 p-3 text-body-sm text-danger-fg"
        >
          {submitError}
        </div>
      )}

      {/* Step Content */}
      <Card className="min-w-0 break-words shadow-module">
        <CardBody className="p-6 md:p-8 space-y-6">
          {/* STEP 1: Handle & Name */}
          {step === 0 && (
            <div className="space-y-6">
              <CardHeader className="p-0">
                <h2 className="font-display text-headline-sm text-fg">
                  Claim your unique @handle
                </h2>
                <p className="text-body-sm text-fg-muted">
                  Your handle is permanent and acts as your cryptographic identifier across bounties, squads, and reputation ledgers.
                </p>
              </CardHeader>

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  placeholder="e.g. Dr. Meera Iyer or Kabir Shah"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={60}
                  autoFocus
                />
              </div>

              {/* Handle */}
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
                      <CheckCircle2 className="size-4 text-earn" />
                    ) : handleAvailable === false ? (
                      <XCircle className="size-4 text-danger" />
                    ) : null}
                  </div>
                </div>

                {handleError ? (
                  <p className="text-body-xs text-danger">{handleError}</p>
                ) : handleAvailable === true ? (
                  <p className="text-body-xs text-earn">@{handle} is available!</p>
                ) : (
                  <p className="text-body-xs text-fg-subtle">
                    3–30 lowercase letters, numbers, and hyphens.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Tracks & Skills */}
          {step === 1 && (
            <div className="space-y-6">
              <CardHeader className="p-0">
                <h2 className="font-display text-headline-sm text-fg">
                  Choose your primary tracks & skills
                </h2>
                <p className="text-body-sm text-fg-muted">
                  Select at least one track. Hackerland matches squads and bounties to your chosen disciplines.
                </p>
              </CardHeader>

              {/* Tracks Grid */}
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
                        className={`flex flex-col items-start gap-1 rounded-lg border p-3.5 text-left transition-all ${
                          isSelected
                            ? 'border-accent bg-surface-2 shadow-module'
                            : 'border-hairline bg-surface-1 hover:border-line'
                        }`}
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

              {/* Skills */}
              <div className="space-y-3 pt-2">
                <Label>Top Skills & Technologies</Label>
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

                {/* Selected Skills Chips */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 rounded-sm border border-accent/40 bg-accent/10 px-2.5 py-1 text-body-sm text-accent"
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

                {/* Suggested Skills */}
                <div className="space-y-2 pt-2">
                  <p className="text-body-xs text-fg-subtle">Popular suggestions:</p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {SUGGESTED_SKILLS.map((skill) => {
                      const isAdded = skills.includes(skill);
                      return (
                        <FilterChip
                          key={skill}
                          selected={isAdded}
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

          {/* STEP 3: Headline, Bio & Experience Badges */}
          {step === 2 && (
            <div className="space-y-6">
              <CardHeader className="p-0">
                <h2 className="font-display text-headline-sm text-fg">
                  Bio, experience & compliance
                </h2>
                <p className="text-body-sm text-fg-muted">
                  Share your background. Hackerland never shows your age; instead, opt into experience badges.
                </p>
              </CardHeader>

              {/* Headline */}
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

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio-input">About You (Bio)</Label>
                <Textarea
                  id="bio-input"
                  rows={4}
                  placeholder="Tell other innovators what you like to build, your proudest creations, or what kind of squads you wish to join..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={500}
                />
              </div>

              {/* Experience Badges */}
              <div className="space-y-3 pt-2">
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
                        className={`inline-flex items-center gap-1.5 rounded-sm border px-3 py-1.5 font-display text-label-sm uppercase transition-all ${
                          isSelected
                            ? 'border-accent bg-accent text-on-solid'
                            : 'border-line bg-surface-2 text-fg-muted hover:border-accent hover:text-fg'
                        }`}
                      >
                        {badge.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DPDP Act 2023 Under-18 / Parental Consent Section */}
              <div className="rounded-lg border border-hairline bg-surface-2/60 p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={minorId}
                    checked={isMinor}
                    onChange={(e) => handleMinorToggle(e.target.checked)}
                    className="mt-1 size-4 rounded border-line bg-surface-1 text-accent focus:ring-accent"
                  />
                  <label htmlFor={minorId} className="cursor-pointer text-body-sm text-fg">
                    <span className="font-semibold block">I am under 18 years of age</span>
                    <span className="text-fg-muted block text-body-xs">
                      Hackerland welcomes student makers with compliant safety provisions under India&apos;s DPDP Act 2023.
                    </span>
                  </label>
                </div>

                {isMinor && (
                  <div className="rounded-md border border-accent/30 bg-surface-3 p-3.5 space-y-3">
                    <div className="flex items-center gap-2 text-accent">
                      <ShieldAlert className="size-4 shrink-0" />
                      <p className="font-display text-label-sm uppercase">
                        India DPDP Act 2023 Compliance
                      </p>
                    </div>
                    <p className="text-body-xs text-fg-muted">
                      We never display user ages publicly, nor do we run behavioural tracking or targeted advertisements. Student contributors under 18 must confirm verifiable parental or guardian consent before participating in paid bounties or squad rewards.
                    </p>
                    <div className="flex items-start gap-2.5 pt-1">
                      <input
                        type="checkbox"
                        id={consentId}
                        checked={parentalConsent}
                        onChange={(e) => setParentalConsent(e.target.checked)}
                        className="mt-0.5 size-4 rounded border-line bg-surface-1 text-accent focus:ring-accent"
                      />
                      <label htmlFor={consentId} className="cursor-pointer text-body-xs font-medium text-fg">
                        I confirm that I have obtained verifiable parental or guardian consent to participate on Hackerland.
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardBody>

        {/* Footer Navigation */}
        <CardFooter className="flex flex-wrap items-center justify-between gap-3 bg-surface-2/40">
          {step > 0 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep(step - 1)}
            >
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
              <span>Complete Profile & Launch</span>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
