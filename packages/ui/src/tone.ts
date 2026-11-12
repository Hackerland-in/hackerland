import type { Tone } from './tokens';

/*
 * Static class maps per tone. Tailwind scans these literal strings, so every
 * class a tone can produce must appear here verbatim (no string building).
 */

/** Text colour for content that carries a tone. */
export const toneText: Record<Tone, string> = {
  code: 'text-code-fg',
  make: 'text-make-fg',
  design: 'text-design-fg',
  research: 'text-research-fg',
  earn: 'text-earn-fg',
  learn: 'text-learn-fg',
  accent: 'text-accent-fg',
  success: 'text-success-fg',
  warning: 'text-warning-fg',
  danger: 'text-danger-fg',
  neutral: 'text-fg-muted',
};

/** Tinted outline treatment (badges, chips). */
export const toneOutline: Record<Tone, string> = {
  code: 'border-code/50 bg-code/10 text-code-fg',
  make: 'border-make/50 bg-make/10 text-make-fg',
  design: 'border-design/50 bg-design/10 text-design-fg',
  research: 'border-research/50 bg-research/10 text-research-fg',
  earn: 'border-earn/50 bg-earn/10 text-earn-fg',
  learn: 'border-learn/50 bg-learn/10 text-learn-fg',
  accent: 'border-accent/50 bg-accent/10 text-accent-fg',
  success: 'border-success/50 bg-success/10 text-success-fg',
  warning: 'border-warning/50 bg-warning/10 text-warning-fg',
  danger: 'border-danger/50 bg-danger/10 text-danger-fg',
  neutral: 'border-line bg-surface-2 text-fg-muted',
};

/** Solid fill with dark text (solid badges). */
export const toneSolid: Record<Tone, string> = {
  code: 'border-code bg-code text-on-solid',
  make: 'border-make bg-make text-on-solid',
  design: 'border-design bg-design text-on-solid',
  research: 'border-research bg-research text-on-solid',
  earn: 'border-earn bg-earn text-on-solid',
  learn: 'border-learn bg-learn text-on-solid',
  accent: 'border-accent bg-accent text-on-solid',
  success: 'border-success bg-success text-on-solid',
  warning: 'border-warning bg-warning text-on-solid',
  danger: 'border-danger bg-danger text-fg',
  neutral: 'border-line bg-surface-3 text-fg',
};

/** Solid fill only (progress fills, accent bars, dots). */
export const toneFill: Record<Tone, string> = {
  code: 'bg-code',
  make: 'bg-make',
  design: 'bg-design',
  research: 'bg-research',
  earn: 'bg-earn',
  learn: 'bg-learn',
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  neutral: 'bg-fg-subtle',
};
