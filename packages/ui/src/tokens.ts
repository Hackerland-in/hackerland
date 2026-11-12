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
