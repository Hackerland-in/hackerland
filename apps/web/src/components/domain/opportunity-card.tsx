'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bookmark, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, cn } from '@hackerland/ui';
import { OPPORTUNITY_KIND_LABEL } from '@hackerland/core';
import { formatDate } from '@/lib/format';
import type { OpportunityView } from '@/lib/data/types';
import { useSocialCommunity } from '@/components/social/social-context';
import { Money } from './money';
import { TrackBadge } from './track-badge';
import { ClaimBountyModal } from '@/app/earn/claim-bounty-modal';

export interface OpportunityCardProps {
  opportunity: OpportunityView;
  className?: string;
  onClaimSuccess?: () => void;
}

export function OpportunityCard({
  opportunity,
  className,
  onClaimSuccess,
}: OpportunityCardProps) {
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const { isItemSaved, toggleSaveItem } = useSocialCommunity();
  const saved = isItemSaved(`opp:${opportunity.id}`);
  const primaryTrack = opportunity.tracks[0] ?? 'earn';
  const kindLabel = OPPORTUNITY_KIND_LABEL[opportunity.kind] ?? opportunity.kind;
  const isBounty = opportunity.kind === 'bounty';

  return (
    <>
      <Card
        accent={primaryTrack}
        className={cn(
          'flex flex-col justify-between min-w-0 [overflow-wrap:anywhere] transition-all hover:border-accent/40',
          className,
        )}
      >
        <div>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge tone={isBounty ? 'accent' : 'earn'}>{kindLabel}</Badge>
                {isBounty && (
                  <Badge tone="neutral" variant="outline" className="text-caption">
                    40/60 Escrow
                  </Badge>
                )}
                {opportunity.status !== 'open' && (
                  <Badge tone={opportunity.status === 'in-review' ? 'warning' : 'neutral'}>
                    {opportunity.status === 'in-review' ? 'In Review' : 'Closed'}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Money
                  amount={opportunity.reward.amount}
                  currency={opportunity.reward.currency}
                  className="font-display font-bold tabular-nums text-headline-sm text-earn-fg"
                />
                <button
                  type="button"
                  onClick={() => toggleSaveItem(`opp:${opportunity.id}`)}
                  aria-label={saved ? `Unsave ${opportunity.title}` : `Save ${opportunity.title}`}
                  aria-pressed={saved}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full border transition-colors',
                    saved
                      ? 'border-accent/40 bg-accent-soft text-accent-fg'
                      : 'border-hairline bg-surface-2/60 text-fg-subtle hover:border-accent/30 hover:text-accent-fg',
                  )}
                >
                  <Bookmark className={cn('size-3.5', saved && 'fill-current')} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="text-body-xs text-fg-subtle truncate">
              {opportunity.sponsor.url ? (
                <a
                  href={opportunity.sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-fg transition-colors underline-offset-2 hover:underline"
                >
                  {opportunity.sponsor.name}
                </a>
              ) : (
                <span>{opportunity.sponsor.name}</span>
              )}
            </div>

            <h3 className="font-display text-headline-sm text-fg [overflow-wrap:anywhere] mt-1">
              {opportunity.projectSlug ? (
                <Link
                  href={`/projects/${opportunity.projectSlug}`}
                  className="hover:text-accent-fg transition-colors"
                >
                  {opportunity.title}
                </Link>
              ) : opportunity.externalUrl ? (
                <a
                  href={opportunity.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-fg transition-colors"
                >
                  {opportunity.title}
                </a>
              ) : (
                opportunity.title
              )}
            </h3>
          </CardHeader>

          <CardBody className="space-y-4">
            <p className="text-body-sm text-fg-muted line-clamp-3 [overflow-wrap:anywhere]">
              {opportunity.summary}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {opportunity.tracks.map((track) => (
                <TrackBadge key={track} track={track} />
              ))}
            </div>
          </CardBody>
        </div>

        <CardFooter className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-body-xs text-fg-subtle">
            {opportunity.deadline
              ? `Due ${formatDate(opportunity.deadline)}`
              : 'Rolling application'}
          </span>

          <div className="flex items-center gap-2">
            {opportunity.externalUrl ? (
              <Button asChild size="sm" variant="primary">
                <a href={opportunity.externalUrl} target="_blank" rel="noopener noreferrer">
                  <span>Apply</span>
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              </Button>
            ) : (
              <>
                {opportunity.projectSlug && (
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/projects/${opportunity.projectSlug}`}>Project</Link>
                  </Button>
                )}
                <Button
                  size="sm"
                  variant={isBounty ? 'primary' : 'secondary'}
                  onClick={() => setIsClaimModalOpen(true)}
                >
                  <span>{isBounty ? 'Claim Bounty' : 'Apply'}</span>
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Button>
              </>
            )}
          </div>
        </CardFooter>
      </Card>

      <ClaimBountyModal
        opportunity={opportunity}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        onSuccess={onClaimSuccess}
      />
    </>
  );
}
