import { z } from 'zod';

/** The six disciplines ("tracks") every project, person and opportunity is tagged with. */
export const TRACKS = ['code', 'make', 'design', 'research', 'earn', 'learn'] as const;
export type Track = (typeof TRACKS)[number];
export const trackSchema = z.enum(TRACKS);

export const TRACK_META: Record<Track, { label: string; description: string }> = {
  code: {
    label: 'Code',
    description: 'Software, web, mobile, AI and machine learning.',
  },
  make: {
    label: 'Make',
    description: 'Hardware, robotics, electronics and fabrication.',
  },
  design: {
    label: 'Design',
    description: 'UI/UX, product, visual and industrial design.',
  },
  research: {
    label: 'Research',
    description: 'Deep-tech, space, bio, climate and science.',
  },
  earn: {
    label: 'Earn',
    description: 'Bounties, paid roles, grants and prizes.',
  },
  learn: {
    label: 'Learn',
    description: 'Roadmaps, courses and mentorship.',
  },
};
