// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { COLOR_TOKENS, TRACK_TONES } from './tokens';

const css = readFileSync(fileURLToPath(new URL('./theme.css', import.meta.url)), 'utf8');
const normalized = css.toLowerCase();

describe('theme.css', () => {
  it.each(COLOR_TOKENS.map((token) => [token.cssVar, token.value]))(
    'defines %s as %s',
    (cssVar, value) => {
      expect(normalized).toContain(`${cssVar}: ${value}`.toLowerCase());
    },
  );

  it.each([...TRACK_TONES])('defines solid and text colours for the %s track', (track) => {
    expect(normalized).toContain(`--color-${track}:`);
    expect(normalized).toContain(`--color-${track}-fg:`);
  });

  it('sets label-sm to 11px', () => {
    expect(normalized).toMatch(/--text-label-sm:\s*(11px|0\.6875rem)/);
  });

  it('uses the specified navy and accent values', () => {
    const values = Object.fromEntries(COLOR_TOKENS.map((t) => [t.name, t.value.toLowerCase()]));
    expect(values).toMatchObject({
      canvas: '#0a0e17',
      'surface-1': '#101726',
      'surface-2': '#182238',
      'surface-3': '#1c2842',
      sunken: '#0d131f',
      hairline: '#1e2b45',
      line: '#2a3b5e',
      accent: '#00e5ff',
      code: '#00e5ff',
      make: '#ff8a00',
      design: '#ff5fa2',
      research: '#a970ff',
      earn: '#00f59b',
      learn: '#4d9fff',
      success: '#00f59b',
      warning: '#ffd600',
      danger: '#ff334b',
    });
  });
});
