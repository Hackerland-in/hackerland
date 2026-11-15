/**
 * Colour tokens of the Hackerland "Mission Control" design system.
 * The values here are mirrored in theme.css (a test keeps them in sync);
 * this list powers the /design-system page.
 */
export type ColorToken = {
  name: string;
  cssVar: `--color-${string}`;
  value: string;
  usage: string;
};

const token = (name: string, value: string, usage: string): ColorToken => ({
  name,
  cssVar: `--color-${name}`,
  value,
  usage,
});

export const COLOR_TOKENS: ColorToken[] = [
  token('canvas', '#0A0E17', 'Page background (level 0)'),
  token('surface-1', '#101726', 'Cards and panels (level 1)'),
  token('surface-2', '#182238', 'Raised modules and hover states (level 2)'),
  token('surface-3', '#1C2842', 'Popovers and overlays (level 3)'),
  token('sunken', '#0D131F', 'Inputs, code and inset wells'),
  token('hairline', '#1E2B45', 'Card and divider borders'),
  token('line', '#2A3B5E', 'Control borders and stronger separators'),
  token('fg', '#F0F4FC', 'Primary text'),
  token('fg-muted', '#A9B6CC', 'Secondary text'),
  token('fg-subtle', '#7D8DA8', 'Tertiary text, placeholders, metadata'),
  token('accent', '#00E5FF', 'Primary actions, focus, links (Ion Cyan)'),
  token('accent-strong', '#5CF0FF', 'Primary action hover'),
  token('accent-fg', '#38E8FF', 'Accent-coloured text'),
  token('on-solid', '#060B12', 'Text on bright solid fills'),
  token('success', '#00F59B', 'Success, live, ready'),
  token('success-fg', '#5CFFBA', 'Success text'),
  token('warning', '#FFD600', 'Warnings and caution'),
  token('warning-fg', '#FFE14D', 'Warning text'),
  token('danger', '#FF334B', 'Errors and destructive actions'),
  token('danger-fg', '#FF6B7D', 'Error text'),
  token('code', '#00E5FF', 'Code track: software, web, AI'),
  token('code-fg', '#38E8FF', 'Code track text'),
  token('make', '#FF8A00', 'Make track: hardware, robotics, fabrication'),
  token('make-fg', '#FFA033', 'Make track text'),
  token('design', '#FF5FA2', 'Design track: UI/UX, product, visual'),
  token('design-fg', '#FF85B8', 'Design track text'),
  token('research', '#A970FF', 'Research track: deep-tech, space, bio'),
  token('research-fg', '#C29BFF', 'Research track text'),
  token('earn', '#00F59B', 'Earn track: bounties, paid roles, grants'),
  token('earn-fg', '#5CFFBA', 'Earn track text'),
  token('learn', '#4D9FFF', 'Learn track: roadmaps, courses, mentorship'),
  token('learn-fg', '#7DB8FF', 'Learn track text'),
  token('brand-pink', '#FA1681', 'Authentic Hackerland brand magenta (logo & highlights)'),
  token('brand-mint', '#64FFDA', 'Authentic Hackerland mint/cyan (action badges & FAB)'),
  token('brand-green', '#1BA94C', 'Authentic Hackerland track green'),
  token('brand-blue', '#3A7CED', 'Authentic Hackerland track blue'),
];

export const DAY_COLOR_TOKENS: ColorToken[] = [
  token('canvas', '#F4F7FC', 'Page background (Solar level 0)'),
  token('surface-1', '#FFFFFF', 'Cards and panels (Solar level 1)'),
  token('surface-2', '#E8EEF8', 'Raised modules and hover states (Solar level 2)'),
  token('surface-3', '#DCE5F5', 'Popovers and overlays (Solar level 3)'),
  token('sunken', '#E7EDF7', 'Inputs, code and inset wells'),
  token('hairline', '#D0DBEB', 'Card and divider borders'),
  token('line', '#B5C6E0', 'Control borders and stronger separators'),
  token('fg', '#0A0E17', 'Primary text (High contrast)'),
  token('fg-muted', '#384A64', 'Secondary text'),
  token('fg-subtle', '#5D708E', 'Tertiary text, placeholders, metadata'),
  token('accent', '#008B9E', 'Primary actions, focus, links (Solar Teal)'),
  token('accent-strong', '#006C7B', 'Primary action hover'),
  token('accent-fg', '#007A8A', 'Accent-coloured text'),
  token('on-solid', '#FFFFFF', 'Text on bright solid fills'),
  token('success', '#059669', 'Success, live, ready'),
  token('success-fg', '#047857', 'Success text'),
  token('warning', '#D97706', 'Warnings and caution'),
  token('warning-fg', '#B45309', 'Warning text'),
  token('danger', '#E11D48', 'Errors and destructive actions'),
  token('danger-fg', '#BE123C', 'Error text'),
  token('code', '#008B9E', 'Code track: software, web, AI'),
  token('code-fg', '#007A8A', 'Code track text'),
  token('make', '#EA580C', 'Make track: hardware, robotics, fabrication'),
  token('make-fg', '#C2410C', 'Make track text'),
  token('design', '#DB2777', 'Design track: UI/UX, product, visual'),
  token('design-fg', '#BE185D', 'Design track text'),
  token('research', '#7C3AED', 'Research track: deep-tech, space, bio'),
  token('research-fg', '#6D28D9', 'Research track text'),
  token('earn', '#059669', 'Earn track: bounties, paid roles, grants'),
  token('earn-fg', '#047857', 'Earn track text'),
  token('learn', '#2563EB', 'Learn track: roadmaps, courses, mentorship'),
  token('learn-fg', '#1D4ED8', 'Learn track text'),
  token('brand-pink', '#FA1681', 'Authentic Hackerland brand magenta (Solar Day)'),
  token('brand-mint', '#00BFA5', 'Authentic Hackerland mint/teal (Solar Day)'),
  token('brand-green', '#1BA94C', 'Authentic Hackerland track green (Solar Day)'),
  token('brand-blue', '#3A7CED', 'Authentic Hackerland track blue (Solar Day)'),
];

export const TRACK_TONES = ['code', 'make', 'design', 'research', 'earn', 'learn'] as const;
export type TrackTone = (typeof TRACK_TONES)[number];
export type StatusTone = 'success' | 'warning' | 'danger' | 'neutral' | 'accent';
export type Tone = TrackTone | StatusTone;

export const TYPE_SCALE = [
  'display-hero',
  'display-hero-mobile',
  'headline-xl',
  'headline-xl-mobile',
  'headline-lg',
  'headline-md',
  'headline-sm',
  'body-lg',
  'body-md',
  'body-sm',
  'label-lg',
  'label-md',
  'label-sm',
  'code-inline',
] as const;
export type TypeScaleToken = (typeof TYPE_SCALE)[number];

export const SHADOW_TOKENS = [
  'module',
  'overlay',
  'glow-accent',
  'glow-make',
  'glow-earn',
] as const;
