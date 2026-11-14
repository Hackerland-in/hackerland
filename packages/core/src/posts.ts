export const POST_KINDS = ['update', 'question', 'showcase', 'squad-call'] as const;
export type PostKind = (typeof POST_KINDS)[number];

export const POST_KIND_LABEL: Record<PostKind, string> = {
  update: 'Build log',
  question: 'Question',
  showcase: 'Showcase',
  'squad-call': 'Squad call',
};
