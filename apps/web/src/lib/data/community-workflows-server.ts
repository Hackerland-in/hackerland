import {
  listWorkflowNamespace,
  readWorkflowState,
  writeWorkflowState,
} from './db-persistence';
import {
  type JobApplicationRecord,
  type LaunchpadCampaignState,
  type ReverseRfcRecord,
  type SprintStateRecord,
  type SquadWorkflowState,
  getJobApplication,
  getLaunchpadState,
  getSprintState,
  getSquadWorkflowState,
  listJobApplications,
  listReverseRfcs,
  setJobApplication,
  setLaunchpadState,
  setReverseRfcs,
  setSprintState,
  setSquadWorkflowState,
} from './community-workflows-store';

export async function hydrateReverseRfcs(): Promise<ReverseRfcRecord[]> {
  const stored = await readWorkflowState<{ rfcs?: ReverseRfcRecord[] }>('rfc', 'board');
  if (stored?.rfcs && Array.isArray(stored.rfcs) && stored.rfcs.length > 0) {
    setReverseRfcs(stored.rfcs);
  }
  return listReverseRfcs();
}

export async function persistReverseRfcs(): Promise<void> {
  await writeWorkflowState('rfc', 'board', { rfcs: listReverseRfcs() });
}

export async function hydrateSprintState(slug: string): Promise<SprintStateRecord> {
  const stored = await readWorkflowState<Record<string, unknown>>('sprint', slug);
  if (stored && typeof stored.registered === 'boolean') {
    setSprintState(slug, stored as unknown as SprintStateRecord);
  }
  return getSprintState(slug);
}

export async function persistSprintState(slug: string): Promise<void> {
  const state = getSprintState(slug);
  await writeWorkflowState('sprint', slug, state as unknown as Record<string, unknown>);
}

export async function hydrateJobApplication(jobSlug: string): Promise<JobApplicationRecord | null> {
  const stored = await readWorkflowState<Record<string, unknown>>('job_application', jobSlug);
  if (stored && typeof stored.jobSlug === 'string') {
    setJobApplication(jobSlug, stored as unknown as JobApplicationRecord);
  }
  return getJobApplication(jobSlug);
}

export async function hydrateAllJobApplications(): Promise<Record<string, JobApplicationRecord>> {
  const list = await listWorkflowNamespace<Record<string, unknown>>('job_application');
  for (const item of list) {
    if (typeof item.payload.jobSlug === 'string') {
      setJobApplication(item.key, item.payload as unknown as JobApplicationRecord);
    }
  }
  return listJobApplications();
}

export async function persistJobApplication(jobSlug: string): Promise<void> {
  const record = getJobApplication(jobSlug);
  if (record) {
    await writeWorkflowState(
      'job_application',
      jobSlug,
      record as unknown as Record<string, unknown>,
    );
  }
}

export async function hydrateLaunchpadState(
  slug: string,
): Promise<LaunchpadCampaignState | null> {
  const stored = await readWorkflowState<Record<string, unknown>>('launchpad', slug);
  if (stored && typeof stored.raisedInr === 'number') {
    setLaunchpadState(slug, stored as unknown as LaunchpadCampaignState);
  }
  return getLaunchpadState(slug);
}

export async function persistLaunchpadState(slug: string): Promise<void> {
  const state = getLaunchpadState(slug);
  if (state) {
    await writeWorkflowState('launchpad', slug, state as unknown as Record<string, unknown>);
  }
}

export async function hydrateSquadWorkflowState(
  slug: string,
): Promise<SquadWorkflowState | null> {
  const stored = await readWorkflowState<Record<string, unknown>>('squad', slug);
  if (stored && Array.isArray(stored.milestones) && Array.isArray(stored.tasks)) {
    setSquadWorkflowState(slug, stored as unknown as SquadWorkflowState);
  }
  return getSquadWorkflowState(slug);
}

export async function persistSquadWorkflowState(slug: string): Promise<void> {
  const state = getSquadWorkflowState(slug);
  if (state) {
    await writeWorkflowState('squad', slug, state as unknown as Record<string, unknown>);
  }
}
