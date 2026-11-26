// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { COLOR_TOKENS, DARK_COLOR_TOKENS, TRACK_TONES } from './tokens';

const css = readFileSync(fileURLToPath(new URL('./theme.css', import.meta.url)), 'utf8');
const normalized = css.toLowerCase();

describe('theme.css', () => {
  it.each(COLOR_TOKENS.map((token) => [token.cssVar, token.value]))(
    'defines light default %s as %s',
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

  it('uses the Rosepaper Pink & White social theme tokens', () => {
    const values = Object.fromEntries(COLOR_TOKENS.map((t) => [t.name, t.value.toLowerCase()]));
    expect(values).toMatchObject({
      canvas: '#f7f7fa',
      'surface-1': '#ffffff',
      'surface-2': '#f2f3f7',
      'surface-3': '#e6e8f0',
      sunken: '#f4f5f8',
      hairline: '#e6e8ef',
      line: '#d1d5e2',
      accent: '#fa1681',
      'brand-pink': '#fa1681',
      'on-solid': '#ffffff',
      code: '#2563eb',
      make: '#ea580c',
      design: '#fa1681',
      research: '#7c3aed',
      earn: '#059669',
      learn: '#0284c7',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
    });
  });

  it.each(DARK_COLOR_TOKENS.map((token) => [token.cssVar, token.value]))(
    'defines dark mode %s as %s in theme.css',
    (cssVar, value) => {
      expect(normalized).toContain(`${cssVar}: ${value}`.toLowerCase());
    },
  );
});
