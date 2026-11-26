/**
 * Colour tokens of the Hackerland "Rosepaper Social" design system.
 * Light / White-first theme by default paired with Signature Hackerland Pink (#FA1681).
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
  token('canvas', '#F7F7FA', 'Soft off-white community feed background (level 0)'),
  token('surface-1', '#FFFFFF', 'Pure white feed posts, panels, and top nav (level 1)'),
  token('surface-2', '#F2F3F7', 'Raised pills, reaction buttons, and hover wells (level 2)'),
  token('surface-3', '#E6E8F0', 'Popovers, active tab wells, and pressed fills (level 3)'),
  token('sunken', '#F4F5F8', 'Search fields, inputs, composers, and code blocks'),
  token('hairline', '#E6E8EF', 'Clean 1px card hairlines and feed dividers'),
  token('line', '#D1D5E2', 'Control borders and secondary button outlines'),
  token('fg', '#111827', 'Primary high-contrast charcoal ink text'),
  token('fg-muted', '#4B5563', 'Secondary post body text and descriptions'),
  token('fg-subtle', '#6B7280', 'Timestamps, @handles, and reaction counters'),
  token('accent', '#FA1681', 'Signature Hackerland Pink (primary CTAs, active tabs, focus)'),
  token('accent-strong', '#E00E70', 'Deep magenta-pink hover & active CTA state'),
  token('accent-fg', '#D10D69', 'Accessible pink text links and active labels on white'),
  token('accent-soft', '#FFF0F7', 'Blush pink tint for active nav states & highlight pills'),
  token('on-solid', '#FFFFFF', 'Crisp white text on solid #FA1681 pink buttons & badges'),
  token('success', '#10B981', 'Verified ship, accepted answer, online status'),
  token('success-fg', '#047857', 'Success text on light surfaces'),
  token('warning', '#F59E0B', 'Caution, in-review milestone, warm notice'),
  token('warning-fg', '#B45309', 'Warning text on light surfaces'),
  token('danger', '#EF4444', 'Errors, destructive actions, moderation alerts'),
  token('danger-fg', '#DC2626', 'Error text on light surfaces'),
  token('code', '#2563EB', 'Code community channel: software, web, AI'),
  token('code-fg', '#1D4ED8', 'Code channel accessible text'),
  token('make', '#EA580C', 'Make community channel: hardware, robotics, PCB'),
  token('make-fg', '#C2410C', 'Make channel accessible text'),
  token('design', '#FA1681', 'Design community channel: UI/UX, product, industrial'),
  token('design-fg', '#D10D69', 'Design channel accessible text'),
  token('research', '#7C3AED', 'Research community channel: deep-tech, space, bio'),
  token('research-fg', '#6D28D9', 'Research channel accessible text'),
  token('earn', '#059669', 'Earn community channel: bounties, grants, sprints'),
  token('earn-fg', '#047857', 'Earn channel accessible text'),
  token('learn', '#0284C7', 'Learn community channel: roadmaps, academy, guides'),
  token('learn-fg', '#0369A1', 'Learn channel accessible text'),
  token('brand-pink', '#FA1681', 'Authentic Hackerland brand pink (#FA1681)'),
  token('brand-mint', '#00BFA5', 'Supporting teal-mint accent'),
  token('brand-green', '#1BA94C', 'Supporting community green'),
  token('brand-blue', '#3A7CED', 'Supporting community blue'),
];

export const DARK_COLOR_TOKENS: ColorToken[] = [
  token('canvas', '#0F1014', 'Midnight slate community background (level 0)'),
  token('surface-1', '#171920', 'Dark feed cards and panels (level 1)'),
  token('surface-2', '#1F222C', 'Raised modules and hover fills (level 2)'),
  token('surface-3', '#282C38', 'Popovers, modals, and active wells (level 3)'),
  token('sunken', '#12141A', 'Inputs, search bar, and code blocks'),
  token('hairline', '#262A36', 'Card and feed divider hairlines'),
  token('line', '#343A4B', 'Control borders and secondary outlines'),
  token('fg', '#F9FAFB', 'Primary crisp white text'),
  token('fg-muted', '#A1A8B8', 'Secondary post prose'),
  token('fg-subtle', '#7C8496', 'Timestamps, @handles, metadata'),
  token('accent', '#FA1681', 'Signature Hackerland Pink'),
  token('accent-strong', '#FF3D96', 'Brighter pink CTA hover in dark mode'),
  token('accent-fg', '#FF6EB0', 'Legible rose-pink text on dark surfaces'),
  token('accent-soft', '#2D1221', 'Dark rose surface tint'),
  token('on-solid', '#FFFFFF', 'White text on solid pink buttons'),
  token('success', '#10B981', 'Verified ship, live, accepted'),
  token('success-fg', '#34D399', 'Success text on dark surfaces'),
  token('warning', '#F59E0B', 'Warnings and caution'),
  token('warning-fg', '#FBBF24', 'Warning text on dark surfaces'),
  token('danger', '#F43F5E', 'Errors and destructive actions'),
  token('danger-fg', '#FB7185', 'Error text on dark surfaces'),
  token('code', '#60A5FA', 'Code channel: software, web, AI'),
  token('code-fg', '#93C5FD', 'Code channel text'),
  token('make', '#FB923C', 'Make channel: hardware, robotics, PCB'),
  token('make-fg', '#FDBA74', 'Make channel text'),
  token('design', '#FF4DA1', 'Design channel: UI/UX, product, visual'),
  token('design-fg', '#FF80BD', 'Design channel text'),
  token('research', '#A78BFA', 'Research channel: deep-tech, space, bio'),
  token('research-fg', '#C4B5FD', 'Research channel text'),
  token('earn', '#34D399', 'Earn channel: bounties, paid roles, grants'),
  token('earn-fg', '#6EE7B7', 'Earn channel text'),
  token('learn', '#38BDF8', 'Learn channel: roadmaps, courses, mentorship'),
  token('learn-fg', '#7DD3FC', 'Learn channel text'),
  token('brand-pink', '#FA1681', 'Authentic Hackerland brand pink'),
  token('brand-mint', '#2DD4BF', 'Supporting mint in dark mode'),
  token('brand-green', '#22C55E', 'Supporting green in dark mode'),
  token('brand-blue', '#60A5FA', 'Supporting blue in dark mode'),
];

/** Backwards-compatible alias referencing the crisp white default theme tokens. */
export const DAY_COLOR_TOKENS: ColorToken[] = COLOR_TOKENS;

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
