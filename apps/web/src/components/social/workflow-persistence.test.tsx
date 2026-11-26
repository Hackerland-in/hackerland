import { describe, expect, it, beforeEach } from 'vitest';
import {
  addLaunchpadComment,
  addSprintCheckin,
  createReverseRfc,
  getJobApplication,
  getLaunchpadState,
  getSprintState,
  getSquadWorkflowState,
  mutateSquadWorkflow,
  pledgeLaunchpadTier,
  replyToReverseRfc,
  saveJobApplication,
  toggleSprintRegistration,
  voteLaunchpadMilestone,
  voteReverseRfc,
} from '@/lib/data/community-workflows-store';
import { CAMPAIGN_REGISTRY } from '@/lib/data/launchpad-data';
import { HARDWARE_JOBS_REGISTRY } from '@/lib/data/jobs-data';
import { SPRINTS_CATALOG } from '@/lib/data/sprints-data';
import { SQUADS_DATA } from '@/lib/data/squads-data';

describe('Deep Persistent Community Workflows Store', () => {
  beforeEach(() => {
    globalThis.__hackerlandWorkflowsRegistry = undefined;
  });

  it('persists Reverse RFC creation, voting, and technical pitch replies', () => {
    const created = createReverseRfc({
      title: 'Portable Ultrasonic Flow Meter',
      domain: 'Clean Water',
      sponsor: 'Open Irrigation',
      bountyAmount: 75000,
      description: 'Non-invasive clamp-on piezo transit-time sensor for borewells.',
    });
    expect(created.title).toBe('Portable Ultrasonic Flow Meter');

    const upvoted = voteReverseRfc(created.id, 1);
    expect(upvoted?.upvotes).toBe(2);

    const replied = replyToReverseRfc(created.id, 'Aarav', 'Use TDC1000 + TDC7200 AFE pair.');
    expect(replied?.replies).toHaveLength(1);
    expect(replied?.replies[0]?.body).toContain('TDC1000');
  });

  it('persists 48H Sprint registration and milestone check-in anchors', () => {
    const sprint = SPRINTS_CATALOG[0]!;
    const ms = sprint.milestones[0]!;

    const reg = toggleSprintRegistration(sprint.slug, 'Garuda Avionics');
    expect(reg?.registered).toBe(true);
    expect(reg?.registeredCountDelta).toBe(1);

    const checkinResult = addSprintCheckin(sprint.slug, {
      milestoneId: ms.id,
      milestoneTitle: ms.title,
      milestoneHour: ms.hour,
      cadUrl: 'https://cad.onshape.com/example',
      notes: 'Completed initial frame assembly.',
    });
    expect(checkinResult?.checkin.ledgerHash).toMatch(/^hl_sprint_/);
    expect(getSprintState(sprint.slug).checkins).toHaveLength(1);
  });

  it('persists Proof-of-Work Job application receipts', () => {
    const job = HARDWARE_JOBS_REGISTRY[0]!;
    const saved = saveJobApplication({
      jobSlug: job.slug,
      applicantName: 'Vikram Joshi',
      applicantEmail: 'vikram@example.com',
      proofUrl: 'https://github.com/vikram/bms-firmware',
      hardwareBugStory: 'Resolved isoSPI CRC error at high dV/dt switching.',
    });
    expect(saved.status).toBe('routed_to_lead');
    expect(getJobApplication(job.slug)?.proofUrl).toBe('https://github.com/vikram/bms-firmware');
  });

  it('persists Launchpad pledges, quorum votes, and backer Q&A comments', () => {
    const camp = CAMPAIGN_REGISTRY[0]!;
    const tier = camp.backerTiers[0]!;
    const reviewMs = camp.milestones.find((m) => m.status === 'submitted_for_review') ?? camp.milestones[0]!;

    const pledged = pledgeLaunchpadTier(camp.slug, tier.id, tier.amountInr);
    expect(pledged?.raisedInr).toBe(camp.raisedInr + tier.amountInr);
    expect(pledged?.backersCount).toBe(camp.backersCount + 1);

    const voted = voteLaunchpadMilestone(camp.slug, reviewMs.id, true);
    expect(voted?.votedMilestoneIds).toContain(reviewMs.id);

    const commented = addLaunchpadComment(camp.slug, 'Meera', 'Gerbers verified on KiCad 8.');
    expect(commented?.comments[0]?.body).toContain('KiCad 8');
    expect(getLaunchpadState(camp.slug)?.backedTierIds).toContain(tier.id);
  });

  it('persists Squad Room Kanban tasks, milestone proofs, and escrow release', () => {
    const squad = SQUADS_DATA[0]!;
    const lockedMs = squad.milestones.find((m) => m.status === 'escrow_locked') ?? squad.milestones[0]!;

    const afterAdd = mutateSquadWorkflow(squad.projectSlug, {
      type: 'add_task',
      title: 'Verify CAN termination resistance',
      priority: 'high',
    });
    expect(afterAdd?.tasks[0]?.title).toBe('Verify CAN termination resistance');

    const addedTaskId = afterAdd!.tasks[0]!.id;
    const afterCycle = mutateSquadWorkflow(squad.projectSlug, {
      type: 'cycle_task',
      taskId: addedTaskId,
    });
    expect(afterCycle?.tasks[0]?.status).toBe('in_progress');

    mutateSquadWorkflow(squad.projectSlug, {
      type: 'submit_proof',
      milestoneId: lockedMs.id,
      proofUrl: 'https://github.com/Hackerland-in/aeroglide/pull/99',
      summary: 'All bench tests passed.',
    });
    const afterRelease = mutateSquadWorkflow(squad.projectSlug, {
      type: 'release_escrow',
      milestoneId: lockedMs.id,
    });
    expect(afterRelease?.milestones.find((m) => m.id === lockedMs.id)?.status).toBe('released');
    expect(getSquadWorkflowState(squad.projectSlug)?.tasks.length).toBeGreaterThan(squad.tasks.length);
  });
});
