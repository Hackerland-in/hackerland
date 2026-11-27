'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  COMPENSATION_TYPES,
  CURRENCIES,
  TRACK_META,
  TRACKS,
  compensationSchema,
  formatMoney,
  type Compensation,
  type CompensationType,
  type Currency,
  type Track,
} from '@hackerland/core';
import {
  Badge,
  Button,
  Card,
  Chip,
  FilterChip,
  Input,
  Label,
  SegmentedProgress,
  Textarea,
} from '@hackerland/ui';
import { getActiveBuilderIdentity } from '@/lib/builder-identity';
import { useVenture } from '@/components/social/venture-context';

export type WizardRole = {
  title: string;
  track: Track;
  compensation: Compensation;
};

export type WizardState = {
  title: string;
  tagline: string;
  description: string;
  tracks: Track[];
  skills: string[];
  roles: WizardRole[];
};

export type NewProjectInitialDraft = {
  title?: string;
  tagline?: string;
  description?: string;
  tracks?: Track[];
  skills?: string[];
};

const STEP_LABELS = ['Idea', 'Tracks & skills', 'Team roles', 'Review & launch'] as const;

function slugifyProjectTitle(title: string): string {
  const base =
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 52) || 'build';
  return `${base}-${Date.now().toString(36).slice(-4)}`;
}

export function NewProjectWizard({ initialDraft }: { initialDraft?: NewProjectInitialDraft } = {}) {
  const router = useRouter();
  const { updateActiveVenture } = useVenture();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(() => ({
    title: initialDraft?.title?.trim() ?? '',
    tagline: (initialDraft?.tagline?.trim() ?? '').slice(0, 140),
    description: initialDraft?.description?.trim() ?? '',
    tracks: (initialDraft?.tracks ?? []).filter((t): t is Track =>
      (TRACKS as readonly string[]).includes(t),
    ),
    skills: Array.from(
      new Set(
        (initialDraft?.skills ?? [])
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean),
      ),
    ),
    roles: [],
  }));

  // Step 4 submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // Step 2 skill input
  const [skillInput, setSkillInput] = useState('');

  // Step 3 role builder
  const [roleTitle, setRoleTitle] = useState('');
  const [roleTrack, setRoleTrack] = useState<Track>('code');
  const [roleCompType, setRoleCompType] = useState<CompensationType>('volunteer');
  const [roleAmount, setRoleAmount] = useState('');
  const [roleCurrency, setRoleCurrency] = useState<Currency>('INR');
  const [roleError, setRoleError] = useState<string | null>(null);

  // Validation per step
  const isStepValid = () => {
    switch (step) {
      case 0:
        return state.title.trim().length >= 4;
      case 1:
        return state.tracks.length >= 1;
      case 2:
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const toggleTrack = (track: Track) => {
    setState((prev) => {
      const exists = prev.tracks.includes(track);
      return {
        ...prev,
        tracks: exists ? prev.tracks.filter((t) => t !== track) : [...prev.tracks, track],
      };
    });
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    const normalized = trimmed.toLowerCase();
    setState((prev) => {
      if (prev.skills.some((s) => s.toLowerCase() === normalized)) {
        return prev;
      }
      return {
        ...prev,
        skills: [...prev.skills, normalized],
      };
    });
    setSkillInput('');
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setState((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleAddRole = () => {
    setRoleError(null);
    if (!roleTitle.trim()) {
      setRoleError('Role title is required.');
      return;
    }

    const compData: Record<string, unknown> = {
      type: roleCompType,
    };

    if (roleCompType === 'stipend' || roleCompType === 'bounty') {
      const parsedAmount = roleAmount.trim() === '' ? undefined : Number(roleAmount);
      compData.amount = parsedAmount;
      compData.currency = roleCurrency;
      if (roleCompType === 'stipend') {
        compData.period = 'month';
      } else {
        compData.period = 'one-time';
      }
    }

    const parseResult = compensationSchema.safeParse(compData);
    if (!parseResult.success) {
      const msg = parseResult.error.issues[0]?.message || 'Invalid compensation details.';
      setRoleError(msg);
      return;
    }

    setState((prev) => ({
      ...prev,
      roles: [
        ...prev.roles,
        {
          title: roleTitle.trim(),
          track: roleTrack,
          compensation: parseResult.data,
        },
      ],
    }));

    setRoleTitle('');
    setRoleAmount('');
    setRoleCompType('volunteer');
  };

  const removeRole = (indexToRemove: number) => {
    setState((prev) => ({
      ...prev,
      roles: prev.roles.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const formatRoleComp = (comp: Compensation) => {
    if (comp.type === 'volunteer') return 'Volunteer';
    if (comp.type === 'revenue-share') return 'Revenue share';
    if (comp.type === 'equity') return 'Equity';
    if (comp.amount !== undefined && comp.currency) {
      const formatted = formatMoney(comp.amount, comp.currency);
      return comp.type === 'stipend' ? `${formatted} / month` : formatted;
    }
    return comp.type;
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    setPublishError(null);

    try {
      const payload = {
        title: state.title.trim(),
        summary: state.tagline.trim() || state.title.trim(),
        description: state.description.trim(),
        tracks: state.tracks,
        stage: 'idea',
        tags: state.skills,
        openRoles: state.roles.map((r) => ({
          title: r.title,
          track: r.track,
          compensation: r.compensation,
          skills: [],
          description: '',
        })),
      };

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 503 || res.status === 401) {
        const createdSlug = slugifyProjectTitle(state.title);
        const identity = getActiveBuilderIdentity();
        const now = new Date().toISOString();
        const customProjectRecord = {
          slug: createdSlug,
          title: payload.title,
          summary: payload.summary,
          body: payload.description || payload.summary,
          tracks: payload.tracks,
          stage: 'idea',
          licence: 'MIT',
          skills: payload.tags,
          openRoles: payload.openRoles.map((r, idx) => ({
            id: `role-${idx}-${Date.now()}`,
            ...r,
          })),
          creatorHandle: identity.handle,
          creatorName: identity.name,
          createdAt: now,
          updatedAt: now,
        };

        try {
          const prevRaw = localStorage.getItem('hackerland_custom_projects_v1');
          const prev = prevRaw ? (JSON.parse(prevRaw) as unknown[]) : [];
          localStorage.setItem(
            'hackerland_custom_projects_v1',
            JSON.stringify([customProjectRecord, ...(Array.isArray(prev) ? prev : [])].slice(0, 30)),
          );
        } catch {}

        try {
          await fetch('/api/workbenches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              workspaceId: `custom-project-${createdSlug}`,
              kind: 'prototype',
              slugOrRoute: `/projects/${createdSlug}`,
              title: payload.title,
              summary: payload.summary,
              ownerHandle: identity.handle,
              ownerName: identity.name,
              tags: ['custom-project', ...payload.tracks, ...payload.tags.slice(0, 5)],
              payload: customProjectRecord,
              publishToFeed: true,
            }),
          });
        } catch {}

        updateActiveVenture({
          title: payload.title,
          projectSlug: createdSlug,
          squadSlug: createdSlug,
          currentStage: 3,
        });

        router.push(`/projects/${createdSlug}`);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish project. Please try again.');
      }

      if (data.slug) {
        updateActiveVenture({
          title: payload.title,
          projectSlug: data.slug,
          squadSlug: data.slug,
          currentStage: 3,
        });
        router.push(`/projects/${data.slug}`);
      } else {
        router.push('/projects');
      }
    } catch (err: unknown) {
      setPublishError(
        err instanceof Error ? err.message : 'An unexpected error occurred while publishing.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      {initialDraft?.title && (
        <div className="rounded-xl border border-accent/25 bg-accent-soft/60 px-4 py-2.5 text-body-xs text-fg flex flex-wrap items-center justify-between gap-2">
          <span>
            Pre-filled build brief for <strong className="text-accent-fg">{initialDraft.title}</strong>
          </span>
          <span className="font-mono text-[11px] text-fg-muted">
            Review tracks, add squad roles &amp; launch your Squad Room
          </span>
        </div>
      )}
      {/* Progress Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-label-md text-fg-muted font-display uppercase">
          <span>{`Step ${step + 1} of 4: ${STEP_LABELS[step]}`}</span>
          <span className="tabular-nums">{Math.round(((step + 1) / 4) * 100)}%</span>
        </div>
        <SegmentedProgress
          total={4}
          completed={step + 1}
          label={`Step ${step + 1} of 4: ${STEP_LABELS[step]}`}
        />
      </div>

      {/* Step Content */}
      <Card className="p-6 md:p-8">
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-headline-lg text-fg">Idea & Overview</h2>
              <p className="mt-1 text-body-sm text-fg-muted">
                What are you building? Give your project a clear name and concise pitch.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  aria-label="Title"
                  placeholder="e.g. Drone Mesh Network"
                  value={state.title}
                  onChange={(e) => setState((prev) => ({ ...prev, title: e.target.value }))}
                  className="mt-1.5"
                />
                <p className="mt-1 text-body-sm text-fg-subtle">
                  Must be at least 4 characters ({state.title.trim().length}/4).
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="tagline">One-line pitch</Label>
                  <span className="text-body-sm text-fg-subtle tabular-nums">
                    {state.tagline.length}/140
                  </span>
                </div>
                <Input
                  id="tagline"
                  aria-label="One-line pitch"
                  placeholder="Autonomous peer-to-peer telemetry relay for harsh environments."
                  maxLength={140}
                  value={state.tagline}
                  onChange={(e) => setState((prev) => ({ ...prev, tagline: e.target.value }))}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  aria-label="Description"
                  placeholder="Describe the problem, current progress, technologies involved, and squad goals..."
                  rows={5}
                  value={state.description}
                  onChange={(e) => setState((prev) => ({ ...prev, description: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-headline-lg text-fg">Tracks & Skills</h2>
              <p className="mt-1 text-body-sm text-fg-muted">
                Select at least one track that defines your build discipline, and list key skills.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Disciplines / Tracks (Select at least 1) *</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TRACKS.map((track) => (
                    <FilterChip
                      key={track}
                      selected={state.tracks.includes(track)}
                      tone={track}
                      onClick={() => toggleTrack(track)}
                    >
                      {TRACK_META[track].label}
                    </FilterChip>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Label htmlFor="skills">Required Skills (press Enter to add)</Label>
                <div className="mt-1.5 flex gap-2">
                  <Input
                    id="skills"
                    aria-label="Add skill"
                    placeholder="e.g. kicad, rust, react..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                  />
                  <Button type="button" variant="secondary" onClick={handleAddSkill}>
                    Add
                  </Button>
                </div>

                {state.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {state.skills.map((skill) => (
                      <Chip key={skill} tone="neutral" className="inline-flex items-center gap-1.5">
                        <span>{skill}</span>
                        <button
                          type="button"
                          aria-label={`Remove ${skill}`}
                          onClick={() => removeSkill(skill)}
                          className="hover:text-danger text-fg-subtle ml-0.5"
                        >
                          ×
                        </button>
                      </Chip>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-headline-lg text-fg">Team Roles & Squad Needs</h2>
              <p className="mt-1 text-body-sm text-fg-muted">
                Define the roles you are looking to recruit for this squad.
              </p>
            </div>

            <div className="rounded-md border border-hairline bg-surface-2/40 p-4 space-y-4">
              <h3 className="font-display text-label-lg uppercase text-fg">Add Open Role</h3>

              {roleError && (
                <div
                  role="alert"
                  className="rounded-sm border border-danger/40 bg-danger/10 p-3 text-body-sm text-danger-fg"
                >
                  {roleError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role-title">Role Title *</Label>
                  <Input
                    id="role-title"
                    aria-label="Role title"
                    placeholder="e.g. Avionics Engineer"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="role-track">Track</Label>
                  <select
                    id="role-track"
                    aria-label="Role track"
                    value={roleTrack}
                    onChange={(e) => setRoleTrack(e.target.value as Track)}
                    className="mt-1 h-11 w-full rounded-sm border border-line bg-surface-1 px-3 text-body-sm text-fg focus:border-accent focus:outline-none"
                  >
                    {TRACKS.map((t) => (
                      <option key={t} value={t}>
                        {TRACK_META[t].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="role-comp-type">Compensation Type</Label>
                  <select
                    id="role-comp-type"
                    aria-label="Compensation type"
                    value={roleCompType}
                    onChange={(e) => setRoleCompType(e.target.value as CompensationType)}
                    className="mt-1 h-11 w-full rounded-sm border border-line bg-surface-1 px-3 text-body-sm text-fg focus:border-accent focus:outline-none"
                  >
                    {COMPENSATION_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type === 'volunteer'
                          ? 'Volunteer'
                          : type === 'stipend'
                            ? 'Stipend'
                            : type === 'bounty'
                              ? 'Bounty'
                              : type === 'revenue-share'
                                ? 'Revenue share'
                                : 'Equity'}
                      </option>
                    ))}
                  </select>
                </div>

                {(roleCompType === 'stipend' || roleCompType === 'bounty') && (
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="role-amount">Amount *</Label>
                      <Input
                        id="role-amount"
                        type="number"
                        aria-label="Compensation amount"
                        placeholder="5000"
                        value={roleAmount}
                        onChange={(e) => setRoleAmount(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="w-28">
                      <Label htmlFor="role-currency">Currency</Label>
                      <select
                        id="role-currency"
                        aria-label="Currency"
                        value={roleCurrency}
                        onChange={(e) => setRoleCurrency(e.target.value as Currency)}
                        className="mt-1 h-11 w-full rounded-sm border border-line bg-surface-1 px-3 text-body-sm text-fg focus:border-accent focus:outline-none"
                      >
                        {CURRENCIES.map((curr) => (
                          <option key={curr} value={curr}>
                            {curr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Button type="button" variant="secondary" onClick={handleAddRole}>
                  Add role
                </Button>
              </div>
            </div>

            {/* List of added roles */}
            {state.roles.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="font-display text-label-md uppercase text-fg-muted">
                  Configured Roles ({state.roles.length})
                </h3>
                <div className="space-y-2">
                  {state.roles.map((role, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-md border border-hairline bg-surface-1 p-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Badge tone={role.track}>{TRACK_META[role.track].label}</Badge>
                        <span className="font-semibold text-fg truncate">{role.title}</span>
                        <span className="text-body-sm text-fg-muted">
                          ({formatRoleComp(role.compensation)})
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={`Remove role ${role.title}`}
                        onClick={() => removeRole(idx)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-headline-lg text-fg">Review & Launch</h2>
              <p className="mt-1 text-body-sm text-fg-muted">
                Review your project blueprint before publishing it to the community.
              </p>
            </div>

            {/* Preview Card */}
            <div className="rounded-lg border border-accent/30 bg-surface-2/60 p-6 space-y-6">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {state.tracks.map((t) => (
                    <Badge key={t} tone={t}>
                      {TRACK_META[t].label}
                    </Badge>
                  ))}
                </div>
                <h3 className="font-display text-headline-xl text-fg break-words">{state.title}</h3>
                {state.tagline && (
                  <p className="mt-2 text-body-lg text-accent-fg break-words">{state.tagline}</p>
                )}
              </div>

              {state.description && (
                <div className="space-y-1">
                  <h4 className="font-display text-label-md uppercase text-fg-muted">About</h4>
                  <p className="text-body-md text-fg-muted whitespace-pre-wrap break-words">
                    {state.description}
                  </p>
                </div>
              )}

              {state.skills.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-display text-label-md uppercase text-fg-muted">Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {state.skills.map((s) => (
                      <Chip key={s} tone="neutral">
                        {s}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              {state.roles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-display text-label-md uppercase text-fg-muted">Open Squad Roles</h4>
                  <div className="space-y-2">
                    {state.roles.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-sm border border-hairline bg-surface-1 p-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <Badge tone={r.track}>{TRACK_META[r.track].label}</Badge>
                          <span className="font-medium text-fg">{r.title}</span>
                        </div>
                        <span className="text-body-sm text-fg-muted">
                          {formatRoleComp(r.compensation)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {publishError && (
              <div
                role="alert"
                className="rounded-md border border-danger/40 bg-danger/10 p-3 text-body-sm text-danger-fg"
              >
                {publishError}
              </div>
            )}

            <div className="space-y-2 pt-2">
              <Button
                type="button"
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting || !state.title.trim() || state.tracks.length === 0}
                onClick={handlePublish}
                className="w-full"
              >
                {isSubmitting ? 'Publishing project...' : 'Publish project'}
              </Button>
              <p className="text-center text-body-sm text-fg-muted">
                Your project will be published to the Hackerland directory and open for squad applications.
              </p>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="mt-8 flex justify-between border-t border-hairline pt-6">
          <Button
            type="button"
            variant="secondary"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </Button>

          {step < 3 && (
            <Button
              type="button"
              variant="primary"
              disabled={!isStepValid()}
              onClick={() => setStep((s) => Math.min(3, s + 1))}
            >
              Next
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
