export const REPUTATION_EVENT_KINDS = [
  'project-created',
  'role-filled',
  'post-helpful',
  'answer-accepted',
  'bounty-completed',
  'endorsement-received',
  'mentorship-session',
] as const;
export type ReputationEventKind = (typeof REPUTATION_EVENT_KINDS)[number];

/** Points awarded per ledger event. The ledger is append-only; totals are derived. */
export const REPUTATION_POINTS: Record<ReputationEventKind, number> = {
  'project-created': 10,
  'role-filled': 15,
  'post-helpful': 2,
  'answer-accepted': 15,
  'bounty-completed': 50,
  'endorsement-received': 5,
  'mentorship-session': 10,
};

export function reputationTotal(events: readonly { points: number }[]): number {
  return events.reduce((sum, event) => sum + event.points, 0);
}
