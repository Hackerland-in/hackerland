import { describe, expect, it } from 'vitest';
import {
  OpportunityModel,
  ProfileModel,
  ProjectModel,
  ReputationEventModel,
} from './index';

describe('ProfileModel validation and indexes', () => {
  it('reports errors for missing userId, handle, displayName', () => {
    const doc = new ProfileModel({});
    const err = doc.validateSync();
    expect(err?.errors.userId).toBeDefined();
    expect(err?.errors.handle).toBeDefined();
    expect(err?.errors.displayName).toBeDefined();
  });

  it('stores handle lowercased and rejects unknown track', () => {
    const doc = new ProfileModel({
      userId: 'user_123',
      handle: 'Meera-Iyer',
      displayName: 'Meera Iyer',
      tracks: ['art'],
    });
    expect(doc.handle).toBe('meera-iyer');
    const err = doc.validateSync();
    expect(err?.errors['tracks.0']).toBeDefined();
  });

  it('defines unique indexes for handle and userId', () => {
    const indexes = ProfileModel.schema.indexes();
    const hasHandle = indexes.some(
      ([fields, opts]) => fields.handle === 1 && opts?.unique === true,
    );
    const hasUserId = indexes.some(
      ([fields, opts]) => fields.userId === 1 && opts?.unique === true,
    );
    expect(hasHandle).toBe(true);
    expect(hasUserId).toBe(true);
  });
});

describe('ProjectModel validation and indexes', () => {
  it('fails openRoles with stipend missing amount or currency', () => {
    const doc = new ProjectModel({
      slug: 'aeroglide',
      title: 'AeroGlide UAV',
      summary: 'Autonomous UAV prototype.',
      tracks: ['make'],
      stage: 'prototype',
      licence: 'MIT',
      visibility: 'public',
      ownerId: 'user_123',
      openRoles: [
        {
          title: 'Flight Software Lead',
          track: 'make',
          compensation: { type: 'stipend' },
        },
      ],
    });
    const err = doc.validateSync();
    expect(err?.errors['openRoles.0.compensation']).toBeDefined();
  });

  it('defines unique index for slug', () => {
    const indexes = ProjectModel.schema.indexes();
    const hasSlug = indexes.some(
      ([fields, opts]) => fields.slug === 1 && opts?.unique === true,
    );
    expect(hasSlug).toBe(true);
  });
});

describe('OpportunityModel validation', () => {
  it('fails when tracks array is empty', () => {
    const doc = new OpportunityModel({
      kind: 'bounty',
      title: 'Build Telemetry Widget',
      summary: 'Create canvas widget for high-speed sensor feeds.',
      sponsor: { name: 'AeroLab' },
      reward: { amount: 50000, currency: 'INR' },
      tracks: [],
      status: 'open',
    });
    const err = doc.validateSync();
    expect(err?.errors.tracks).toBeDefined();
  });
});

describe('ReputationEventModel validation', () => {
  it('rejects an unknown kind', () => {
    const doc = new ReputationEventModel({
      userId: 'user_123',
      kind: 'unknown-kind',
      points: 10,
      ref: { type: 'project', id: 'aeroglide' },
    });
    const err = doc.validateSync();
    expect(err?.errors.kind).toBeDefined();
  });
});
