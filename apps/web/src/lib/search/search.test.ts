import { describe, expect, it } from 'vitest';
import { searchGlobalPlatform } from './search-index';

describe('Global Platform Search Engine', () => {
  it('returns empty array for empty or whitespace query', async () => {
    const emptyResult = await searchGlobalPlatform('');
    const whitespaceResult = await searchGlobalPlatform('   ');
    expect(emptyResult).toEqual([]);
    expect(whitespaceResult).toEqual([]);
  });

  it('searches and finds drone simulators, blueprints and projects', async () => {
    const results = await searchGlobalPlatform('drone');
    expect(results.length).toBeGreaterThan(0);
    const titles = results.map((r) => r.title.toLowerCase());
    expect(titles.some((t) => t.includes('drone'))).toBe(true);
  });

  it('searches and finds PCB factory blueprints and EDA studios', async () => {
    const results = await searchGlobalPlatform('pcb');
    expect(results.length).toBeGreaterThan(0);
    const hasPcbPlant = results.some((r) => r.href.includes('pcb'));
    expect(hasPcbPlant).toBe(true);
  });

  it('searches for cap table and finds entrepreneurship equity tool', async () => {
    const results = await searchGlobalPlatform('cap table');
    expect(results.length).toBeGreaterThan(0);
    const titles = results.map((r) => r.title.toLowerCase());
    expect(titles.some((t) => t.includes('cap table'))).toBe(true);
  });

  it('searches for EV battery and finds gigafactory blueprint and powertrain sim', async () => {
    const results = await searchGlobalPlatform('battery');
    expect(results.length).toBeGreaterThan(0);
    const categories = results.map((r) => r.category);
    expect(categories.includes('simulators') || categories.includes('blueprints')).toBe(true);
  });

  it('searches for 3d printer or labs and finds makerspace results', async () => {
    const results = await searchGlobalPlatform('makerspace');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.category === 'labs')).toBe(true);
  });

  it('searches for innovators or public profiles', async () => {
    const results = await searchGlobalPlatform('meera');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.href.includes('/u/meera-iyer'))).toBe(true);
  });
});
