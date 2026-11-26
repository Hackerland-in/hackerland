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

/** Soft tinted social pill treatment (badges, chips). */
export const toneOutline: Record<Tone, string> = {
  code: 'border-code/25 bg-code/8 text-code-fg',
  make: 'border-make/25 bg-make/8 text-make-fg',
  design: 'border-design/25 bg-design/8 text-design-fg',
  research: 'border-research/25 bg-research/8 text-research-fg',
  earn: 'border-earn/25 bg-earn/8 text-earn-fg',
  learn: 'border-learn/25 bg-learn/8 text-learn-fg',
  accent: 'border-accent/25 bg-accent/8 text-accent-fg',
  success: 'border-success/25 bg-success/8 text-success-fg',
  warning: 'border-warning/25 bg-warning/10 text-warning-fg',
  danger: 'border-danger/25 bg-danger/8 text-danger-fg',
  neutral: 'border-hairline bg-surface-2 text-fg-muted',
};

/** Solid fill with crisp contrasting text (solid badges). */
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
  danger: 'border-danger bg-danger text-on-solid',
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
