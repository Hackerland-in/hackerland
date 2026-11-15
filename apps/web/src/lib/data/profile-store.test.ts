import { describe, expect, it } from 'vitest';
import {
  getStoredProfile,
  saveStoredProfile,
  listAllStoredProfiles,
} from './profile-store';
import { getProfile } from './queries';

describe('Profile Store & Public Profile Retrieval', () => {
  it('retrieves seeded profiles from store', () => {
    const meera = getStoredProfile('meera-iyer');
    expect(meera).not.toBeNull();
    expect(meera?.name).toBe('Dr. Meera Iyer');
    expect(meera?.handle).toBe('meera-iyer');
  });

  it('saves and updates an innovator profile in memory', () => {
    const updated = saveStoredProfile({
      handle: 'elon-tinkerer',
      displayName: 'Elon Tinkerer',
      headline: 'Rocket & Battery Hacker',
      bio: 'Building open-source thrusters and BMS firmware.',
      location: 'Hyderabad, India',
      tracks: ['make', 'code'],
      skills: ['Telemetry', 'Firmware', 'BMS'],
    });

    expect(updated.handle).toBe('elon-tinkerer');
    expect(updated.name).toBe('Elon Tinkerer');

    const fetched = getStoredProfile('elon-tinkerer');
    expect(fetched).not.toBeNull();
    expect(fetched?.headline).toBe('Rocket & Battery Hacker');
    expect(fetched?.location).toBe('Hyderabad, India');
  });

  it('retrieves newly saved profile via getProfile() without 404', async () => {
    saveStoredProfile({
      handle: 'aditi-robotics',
      displayName: 'Aditi Rao',
      headline: 'Autonomous Quadruped Engineer',
      bio: 'Designing cycloidal drives and BLDC motor drivers.',
      location: 'Pune, India',
    });

    const profile = await getProfile('aditi-robotics');
    expect(profile).not.toBeNull();
    expect(profile?.name).toBe('Aditi Rao');
    expect(profile?.handle).toBe('aditi-robotics');
  });

  it('lists all stored profiles including fixtures and user updates', () => {
    const all = listAllStoredProfiles();
    expect(all.length).toBeGreaterThanOrEqual(6);
    const handles = all.map((p) => p.handle);
    expect(handles).toContain('meera-iyer');
    expect(handles).toContain('kabir-shah');
  });
});
