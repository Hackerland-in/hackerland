import { z } from 'zod';
import { currencySchema } from './money';
import { trackSchema } from './tracks';

export const OPPORTUNITY_KINDS = ['bounty', 'paid-role', 'grant', 'hackathon', 'gig'] as const;
export type OpportunityKind = (typeof OPPORTUNITY_KINDS)[number];

export const OPPORTUNITY_KIND_LABEL: Record<OpportunityKind, string> = {
  bounty: 'Bounty',
  'paid-role': 'Paid role',
  grant: 'Grant',
  hackathon: 'Hackathon',
  gig: 'Gig',
};

export const OPPORTUNITY_STATUSES = ['open', 'in-review', 'closed'] as const;
export type OpportunityStatus = (typeof OPPORTUNITY_STATUSES)[number];

export const opportunitySchema = z.object({
  kind: z.enum(OPPORTUNITY_KINDS),
  title: z.string().min(4).max(140),
  summary: z.string().max(400),
  sponsor: z.object({ name: z.string().min(1), url: z.url().optional() }),
  reward: z.object({ amount: z.number().nonnegative(), currency: currencySchema }),
  tracks: z.array(trackSchema).min(1),
  deadline: z.iso.date().optional(),
  status: z.enum(OPPORTUNITY_STATUSES),
  externalUrl: z.url().optional(),
});
export type Opportunity = z.infer<typeof opportunitySchema>;
