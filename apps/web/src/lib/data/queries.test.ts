import {
  compensationSchema,
  handleSchema,
  opportunitySchema,
  TRACKS,
} from '@hackerland/core';
import { describe, expect, it } from 'vitest';
import { formatDate } from '../format';
import { ALL_OPPORTUNITIES } from './fixtures/opportunities';
import { ALL_PEOPLE } from './fixtures/people';
import { ALL_PROJECTS } from './fixtures/projects';
import { ALL_ROADMAPS } from './fixtures/roadmaps';
import {
  getFeed,
  getPlatformStats,
  getProfile,
  getProject,
  listOpportunities,
  listProjects,
  listRoadmaps,
} from './queries';

describe('queries', () => {
  it('fetches projects and returns null for unknown slug', async () => {
    const aeroglide = await getProject('aeroglide');
    expect(aeroglide).not.toBeNull();
    expect(aeroglide?.title).toBe('AeroGlide UAV');

    const missing = await getProject('does-not-exist');
    expect(missing).toBeNull();
  });

  it('fetches profile and returns null for unknown handle', async () => {
    const meera = await getProfile('meera-iyer');
    expect(meera).not.toBeNull();
    expect(meera?.name).toBe('Dr. Meera Iyer');

    const nobody = await getProfile('nobody');
    expect(nobody).toBeNull();
  });

  it('filters projects by track and handles zero results', async () => {
    const allProjects = await listProjects();
    expect(allProjects).toHaveLength(5);

    const makeProjects = await listProjects('make');
    expect(makeProjects.length).toBeGreaterThan(0);
    for (const project of makeProjects) {
      expect(project.tracks).toContain('make');
    }

    const learnProjects = await listProjects('learn');
    expect(learnProjects).toEqual([]);
  });

  it('filters feed by kind and sorts by createdAt descending', async () => {
    const questions = await getFeed('question');
    expect(questions.length).toBeGreaterThan(0);
    for (const post of questions) {
      expect(post.kind).toBe('question');
    }

    const allFeed = await getFeed();
    expect(allFeed.length).toBeGreaterThan(1);
    for (let i = 0; i < allFeed.length - 1; i++) {
      const current = new Date(allFeed[i]!.createdAt).getTime();
      const next = new Date(allFeed[i + 1]!.createdAt).getTime();
      expect(current).toBeGreaterThanOrEqual(next);
    }
  });

  it('returns empty array for gig opportunities and validates all opportunities against opportunitySchema', async () => {
    const gigs = await listOpportunities('gig');
    expect(gigs).toEqual([]);

    for (const opp of ALL_OPPORTUNITIES) {
      const { id: _id, projectSlug: _projectSlug, ...rest } = opp;
      expect(() => opportunitySchema.parse(rest)).not.toThrow();
    }
  });

  it('validates every OpenRole compensation across projects with compensationSchema', () => {
    for (const project of ALL_PROJECTS) {
      for (const role of project.openRoles) {
        expect(() => compensationSchema.parse(role.compensation)).not.toThrow();
      }
    }
  });

  it('ensures every track id and handle in fixtures is valid', () => {
    for (const project of ALL_PROJECTS) {
      for (const track of project.tracks) {
        expect(TRACKS).toContain(track);
      }
      for (const role of project.openRoles) {
        expect(TRACKS).toContain(role.track);
      }
      for (const person of project.squad) {
        expect(() => handleSchema.parse(person.handle)).not.toThrow();
      }
    }

    for (const person of ALL_PEOPLE) {
      expect(() => handleSchema.parse(person.handle)).not.toThrow();
    }

    for (const opp of ALL_OPPORTUNITIES) {
      for (const track of opp.tracks) {
        expect(TRACKS).toContain(track);
      }
    }

    for (const roadmap of ALL_ROADMAPS) {
      expect(TRACKS).toContain(roadmap.track);
    }
  });

  it('formats dates consistently in en-IN and Asia/Kolkata timezone', () => {
    expect(formatDate('2026-11-12T03:00:00Z')).toBe('12 Nov 2026');
  });

  it('returns platform stats', async () => {
    const stats = await getPlatformStats();
    expect(stats.members).toBeGreaterThan(0);
    expect(stats.projects).toBe(142);
    expect(stats.openOpportunities).toBe(28);
    expect(stats.rewardsPool.currency).toBe('INR');
  });

  it('lists roadmaps and filters by track', async () => {
    const allRoadmaps = await listRoadmaps();
    expect(allRoadmaps).toHaveLength(4);

    const makeRoadmaps = await listRoadmaps('make');
    expect(makeRoadmaps).toHaveLength(1);
    expect(makeRoadmaps[0]?.slug).toBe('embedded-systems-from-zero');
  });
});
