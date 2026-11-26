import type { CampaignMilestone, KanbanTask, MilestoneEscrow } from '@hackerland/core';
import { addStoredPost } from './feed-store';
import { CAMPAIGN_REGISTRY } from './launchpad-data';
import { SQUADS_DATA } from './squads-data';
import { SPRINTS_CATALOG } from './sprints-data';

export interface RfcReply {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface ReverseRfcRecord {
  id: string;
  title: string;
  domain: string;
  sponsor: string;
  bountyAmount: number;
  description: string;
  upvotes: number;
  squadDraftsCount: number;
  urgency: 'high' | 'medium' | 'critical';
  replies: RfcReply[];
}

export interface SprintCheckinRecord {
  id: string;
  sprintSlug: string;
  milestoneId: string;
  milestoneTitle: string;
  milestoneHour: number;
  squadName: string;
  cadUrl?: string;
  repoUrl?: string;
  videoUrl?: string;
  notes: string;
  ledgerHash: string;
  submittedAt: string;
}

export interface SprintStateRecord {
  registered: boolean;
  squadName?: string;
  registeredCountDelta: number;
  checkins: SprintCheckinRecord[];
}

export interface JobApplicationRecord {
  id: string;
  jobSlug: string;
  applicantName: string;
  applicantEmail: string;
  proofUrl: string;
  hardwareBugStory: string;
  status: 'routed_to_lead';
  submittedAt: string;
}

export interface LaunchpadCommentRecord {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface LaunchpadCampaignState {
  raisedInr: number;
  backersCount: number;
  milestones: CampaignMilestone[];
  votedMilestoneIds: string[];
  backedTierIds: string[];
  comments: LaunchpadCommentRecord[];
}

export interface SquadWorkflowState {
  milestones: MilestoneEscrow[];
  tasks: KanbanTask[];
}

export const INITIAL_REVERSE_RFCS: ReverseRfcRecord[] = [
  {
    id: 'rfc-1',
    title: 'Low-Cost Arsenic & Fluoride IoT Spectrophotometer',
    domain: 'Clean Water',
    sponsor: 'Jal Jeevan Open Tech',
    bountyAmount: 150000,
    description:
      'Field-deployable colorimetric sensor node testing groundwater contamination with sub-₹1,200 bill of materials.',
    upvotes: 34,
    squadDraftsCount: 3,
    urgency: 'critical',
    replies: [
      {
        id: 'rfc-1-r1',
        authorName: 'Dr. Meera Iyer',
        body: 'Pairing an AS7341 11-channel spectral sensor with constant-current 520nm LED driver keeps BOM under ₹950 in 100u batches.',
        createdAt: '2026-11-24T10:15:00Z',
      },
    ],
  },
  {
    id: 'rfc-2',
    title: 'Solar-Assisted Phase Change Material (PCM) Vaccine Carrier',
    domain: 'Cold-Chain Logistics',
    sponsor: 'Rural Health Alliance',
    bountyAmount: 120000,
    description:
      'Passive-active hybrid cooling container maintaining 2°C–8°C for 72 hours across 45°C ambient temperatures in tier-3 districts.',
    upvotes: 48,
    squadDraftsCount: 2,
    urgency: 'high',
    replies: [],
  },
  {
    id: 'rfc-3',
    title: 'Sub-₹500 LoRaWAN NPK Optical Soil Sensor Node',
    domain: 'Soil Telemetry',
    sponsor: 'Kisan AI Foundation',
    bountyAmount: 85000,
    description:
      'Multi-spectral LED sensor measuring nitrogen, phosphorus, and potassium absorption in clay-loam soils with 1-year battery life.',
    upvotes: 29,
    squadDraftsCount: 4,
    urgency: 'medium',
    replies: [],
  },
  {
    id: 'rfc-4',
    title: 'Open-Hardware Haptic Navigation Cane with Ultrasonic Mesh',
    domain: 'Assistive Tech',
    sponsor: 'National Blind Federation',
    bountyAmount: 95000,
    description:
      'Lightweight smart cane using spatial haptic pulses to detect overhead obstacles, potholes, and moving two-wheelers.',
    upvotes: 52,
    squadDraftsCount: 5,
    urgency: 'critical',
    replies: [],
  },
];

interface CommunityWorkflowsRegistry {
  rfcs: ReverseRfcRecord[];
  sprints: Record<string, SprintStateRecord>;
  jobApplications: Record<string, JobApplicationRecord>;
  launchpad: Record<string, LaunchpadCampaignState>;
  squads: Record<string, SquadWorkflowState>;
}

declare global {
  // eslint-disable-next-line no-var
  var __hackerlandWorkflowsRegistry: CommunityWorkflowsRegistry | undefined;
}

function getWorkflowsRegistry(): CommunityWorkflowsRegistry {
  if (!globalThis.__hackerlandWorkflowsRegistry) {
    globalThis.__hackerlandWorkflowsRegistry = {
      rfcs: structuredClone(INITIAL_REVERSE_RFCS),
      sprints: {},
      jobApplications: {},
      launchpad: {},
      squads: {},
    };
  }
  return globalThis.__hackerlandWorkflowsRegistry;
}

export function listReverseRfcs(): ReverseRfcRecord[] {
  return structuredClone(getWorkflowsRegistry().rfcs);
}

export function setReverseRfcs(rfcs: ReverseRfcRecord[]): void {
  getWorkflowsRegistry().rfcs = structuredClone(rfcs);
}

export function createReverseRfc(input: {
  title: string;
  domain: string;
  sponsor: string;
  bountyAmount: number;
  description: string;
  urgency?: 'high' | 'medium' | 'critical';
  shareToFeed?: boolean;
}): ReverseRfcRecord {
  const reg = getWorkflowsRegistry();
  const rfc: ReverseRfcRecord = {
    id: `rfc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: input.title,
    domain: input.domain,
    sponsor: input.sponsor || 'IndiMaker Partner',
    bountyAmount: Math.max(1000, Number(input.bountyAmount) || 25000),
    description: input.description,
    upvotes: 1,
    squadDraftsCount: 0,
    urgency: input.urgency ?? 'medium',
    replies: [],
  };
  reg.rfcs.unshift(rfc);

  if (input.shareToFeed) {
    addStoredPost({
      kind: 'squad-call',
      title: `New Reverse RFC: ${rfc.title}`,
      body: `${rfc.description} (Pledged pool: ₹${rfc.bountyAmount.toLocaleString('en-IN')} · ${rfc.domain})`,
      tags: ['reverse-rfc', rfc.domain.toLowerCase().replace(/\s+/g, '-')],
    });
  }
  return structuredClone(rfc);
}

export function voteReverseRfc(id: string, delta: 1 | -1): ReverseRfcRecord | null {
  const reg = getWorkflowsRegistry();
  const item = reg.rfcs.find((r) => r.id === id);
  if (!item) return null;
  item.upvotes = Math.max(0, item.upvotes + delta);
  return structuredClone(item);
}

export function replyToReverseRfc(
  id: string,
  authorName: string,
  body: string,
): ReverseRfcRecord | null {
  const reg = getWorkflowsRegistry();
  const item = reg.rfcs.find((r) => r.id === id);
  if (!item) return null;
  item.replies.push({
    id: `rfc-reply-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    authorName: authorName.trim() || 'Rohan Kulkarni',
    body: body.trim(),
    createdAt: new Date().toISOString(),
  });
  return structuredClone(item);
}

export function getSprintState(slug: string): SprintStateRecord {
  const reg = getWorkflowsRegistry();
  if (!reg.sprints[slug]) {
    reg.sprints[slug] = {
      registered: false,
      registeredCountDelta: 0,
      checkins: [],
    };
  }
  return structuredClone(reg.sprints[slug]);
}

export function setSprintState(slug: string, state: SprintStateRecord): void {
  getWorkflowsRegistry().sprints[slug] = structuredClone(state);
}

export function toggleSprintRegistration(
  slug: string,
  squadName?: string,
): SprintStateRecord | null {
  const exists = SPRINTS_CATALOG.some((s) => s.slug === slug);
  if (!exists) return null;
  const reg = getWorkflowsRegistry();
  const current = reg.sprints[slug] ?? {
    registered: false,
    registeredCountDelta: 0,
    checkins: [],
  };
  const nextRegistered = !current.registered;
  current.registered = nextRegistered;
  current.squadName = nextRegistered ? squadName?.trim() || 'Kaveri Bench Squad' : undefined;
  current.registeredCountDelta = nextRegistered ? 1 : 0;
  reg.sprints[slug] = current;
  return structuredClone(current);
}

export function addSprintCheckin(
  slug: string,
  input: {
    milestoneId: string;
    milestoneTitle: string;
    milestoneHour: number;
    squadName?: string;
    cadUrl?: string;
    repoUrl?: string;
    videoUrl?: string;
    notes: string;
    shareToFeed?: boolean;
  },
): { state: SprintStateRecord; checkin: SprintCheckinRecord } | null {
  const sprint = SPRINTS_CATALOG.find((s) => s.slug === slug);
  if (!sprint) return null;

  const reg = getWorkflowsRegistry();
  const current = reg.sprints[slug] ?? {
    registered: true,
    registeredCountDelta: 1,
    checkins: [],
  };
  const randomHash = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('');
  const checkin: SprintCheckinRecord = {
    id: `chk-${Date.now()}`,
    sprintSlug: slug,
    milestoneId: input.milestoneId,
    milestoneTitle: input.milestoneTitle,
    milestoneHour: input.milestoneHour,
    squadName: input.squadName?.trim() || current.squadName || 'Kaveri Bench Squad',
    cadUrl: input.cadUrl?.trim() || undefined,
    repoUrl: input.repoUrl?.trim() || undefined,
    videoUrl: input.videoUrl?.trim() || undefined,
    notes: input.notes.trim() || 'Bench verification notes uploaded.',
    ledgerHash: `hl_sprint_${randomHash}`,
    submittedAt: new Date().toISOString(),
  };

  current.registered = true;
  current.registeredCountDelta = 1;
  current.checkins.unshift(checkin);
  reg.sprints[slug] = current;

  if (input.shareToFeed) {
    addStoredPost({
      kind: 'update',
      title: `[48H Sprint H+${input.milestoneHour}] ${sprint.title}`,
      body: `${checkin.notes} — Build log ref ${checkin.ledgerHash}`,
      tags: ['48h-sprint', sprint.track.replace(/_/g, '-')],
    });
  }

  return { state: structuredClone(current), checkin };
}

export function getJobApplication(jobSlug: string): JobApplicationRecord | null {
  const found = getWorkflowsRegistry().jobApplications[jobSlug];
  return found ? structuredClone(found) : null;
}

export function listJobApplications(): Record<string, JobApplicationRecord> {
  return structuredClone(getWorkflowsRegistry().jobApplications);
}

export function setJobApplication(jobSlug: string, record: JobApplicationRecord): void {
  getWorkflowsRegistry().jobApplications[jobSlug] = structuredClone(record);
}

export function saveJobApplication(input: {
  jobSlug: string;
  applicantName: string;
  applicantEmail: string;
  proofUrl: string;
  hardwareBugStory: string;
}): JobApplicationRecord {
  const reg = getWorkflowsRegistry();
  const record: JobApplicationRecord = {
    id: `app-${Date.now()}`,
    jobSlug: input.jobSlug,
    applicantName: input.applicantName.trim(),
    applicantEmail: input.applicantEmail.trim(),
    proofUrl: input.proofUrl.trim(),
    hardwareBugStory: input.hardwareBugStory.trim(),
    status: 'routed_to_lead',
    submittedAt: new Date().toISOString(),
  };
  reg.jobApplications[input.jobSlug] = record;
  return structuredClone(record);
}

export function getLaunchpadState(slug: string): LaunchpadCampaignState | null {
  const campaign = CAMPAIGN_REGISTRY.find((c) => c.slug === slug);
  if (!campaign) return null;
  const reg = getWorkflowsRegistry();
  if (!reg.launchpad[slug]) {
    reg.launchpad[slug] = {
      raisedInr: campaign.raisedInr,
      backersCount: campaign.backersCount,
      milestones: structuredClone(campaign.milestones),
      votedMilestoneIds: [],
      backedTierIds: [],
      comments: [
        {
          id: `${slug}-qa-1`,
          authorName: 'Rohan Deshmukh',
          body: 'Will full KiCad manufacturing Gerbers be released at Milestone 2 even for standard hardware backers?',
          createdAt: '2026-11-23T14:20:00Z',
        },
      ],
    };
  }
  return structuredClone(reg.launchpad[slug]);
}

export function setLaunchpadState(slug: string, state: LaunchpadCampaignState): void {
  getWorkflowsRegistry().launchpad[slug] = structuredClone(state);
}

export function pledgeLaunchpadTier(
  slug: string,
  tierId: string,
  amountInr: number,
): LaunchpadCampaignState | null {
  const base = getLaunchpadState(slug);
  if (!base) return null;
  const reg = getWorkflowsRegistry();
  const state = reg.launchpad[slug]!;
  state.raisedInr += Math.max(0, amountInr);
  state.backersCount += 1;
  if (!state.backedTierIds.includes(tierId)) {
    state.backedTierIds.push(tierId);
  }
  return structuredClone(state);
}

export function voteLaunchpadMilestone(
  slug: string,
  milestoneId: string,
  approve: boolean,
): LaunchpadCampaignState | null {
  const base = getLaunchpadState(slug);
  if (!base) return null;
  const reg = getWorkflowsRegistry();
  const state = reg.launchpad[slug]!;
  if (!state.votedMilestoneIds.includes(milestoneId)) {
    state.milestones = state.milestones.map((m) =>
      m.id === milestoneId
        ? {
            ...m,
            backerApprovalVotePercent: Math.min(
              100,
              Math.max(0, m.backerApprovalVotePercent + (approve ? 2 : -2)),
            ),
          }
        : m,
    );
    state.votedMilestoneIds.push(milestoneId);
  }
  return structuredClone(state);
}

export function addLaunchpadComment(
  slug: string,
  authorName: string,
  body: string,
): LaunchpadCampaignState | null {
  const base = getLaunchpadState(slug);
  if (!base) return null;
  const reg = getWorkflowsRegistry();
  const state = reg.launchpad[slug]!;
  state.comments.unshift({
    id: `camp-qa-${Date.now()}`,
    authorName: authorName.trim() || 'Rohan Kulkarni',
    body: body.trim(),
    createdAt: new Date().toISOString(),
  });
  return structuredClone(state);
}

export function getSquadWorkflowState(slug: string): SquadWorkflowState | null {
  const room = SQUADS_DATA.find((s) => s.projectSlug === slug);
  if (!room) return null;
  const reg = getWorkflowsRegistry();
  if (!reg.squads[slug]) {
    reg.squads[slug] = {
      milestones: structuredClone(room.milestones),
      tasks: structuredClone(room.tasks),
    };
  }
  return structuredClone(reg.squads[slug]);
}

export function setSquadWorkflowState(slug: string, state: SquadWorkflowState): void {
  getWorkflowsRegistry().squads[slug] = structuredClone(state);
}

export function mutateSquadWorkflow(
  slug: string,
  action:
    | { type: 'add_task'; title: string; priority: KanbanTask['priority'] }
    | { type: 'cycle_task'; taskId: string }
    | { type: 'submit_proof'; milestoneId: string; proofUrl: string; summary: string; submittedBy?: string }
    | { type: 'release_escrow'; milestoneId: string; shareToFeed?: boolean },
): SquadWorkflowState | null {
  const base = getSquadWorkflowState(slug);
  if (!base) return null;
  const room = SQUADS_DATA.find((s) => s.projectSlug === slug);
  const reg = getWorkflowsRegistry();
  const state = reg.squads[slug]!;

  if (action.type === 'add_task') {
    state.tasks.unshift({
      id: `task_${Date.now()}`,
      title: action.title.trim(),
      status: 'todo',
      priority: action.priority,
      tags: ['Squad'],
    });
  } else if (action.type === 'cycle_task') {
    const nextMap: Record<KanbanTask['status'], KanbanTask['status']> = {
      todo: 'in_progress',
      in_progress: 'review',
      review: 'done',
      done: 'todo',
    };
    state.tasks = state.tasks.map((t) =>
      t.id === action.taskId ? { ...t, status: nextMap[t.status] } : t,
    );
  } else if (action.type === 'submit_proof') {
    state.milestones = state.milestones.map((m) =>
      m.id === action.milestoneId
        ? {
            ...m,
            status: 'in_review',
            submittedProof: {
              proofUrl: action.proofUrl.trim(),
              summary: action.summary.trim() || 'Proof of work submitted for peer review.',
              submittedAt: new Date().toISOString().split('T')[0] ?? '',
              submittedBy: action.submittedBy?.trim() || 'rohan_k',
            },
          }
        : m,
    );
  } else if (action.type === 'release_escrow') {
    const target = state.milestones.find((m) => m.id === action.milestoneId);
    state.milestones = state.milestones.map((m) =>
      m.id === action.milestoneId ? { ...m, status: 'released' } : m,
    );
    if (action.shareToFeed && target && room) {
      addStoredPost({
        kind: 'showcase',
        title: `Milestone Released: ${target.title}`,
        body: `${room.projectTitle} unlocked ₹${target.escrowAmountInr.toLocaleString('en-IN')} escrow upon verified deliverable completion.`,
        tags: ['milestone', 'escrow-verified'],
        project: { slug: room.projectSlug, title: room.projectTitle },
      });
    }
  }

  return structuredClone(state);
}
