'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge, Button, Card, CardBody, CardFooter, CardHeader } from '@hackerland/ui';
import { OPPORTUNITY_KIND_LABEL } from '@hackerland/core';
import { formatDate } from '@/lib/format';
import type { OpportunityView } from '@/lib/data/types';
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
  const primaryTrack = opportunity.tracks[0] ?? 'earn';
  const kindLabel = OPPORTUNITY_KIND_LABEL[opportunity.kind] ?? opportunity.kind;
  const isBounty = opportunity.kind === 'bounty';

  return (
    <>
      <Card
        accent={primaryTrack}
        className={`flex flex-col justify-between min-w-0 break-words ${className ?? ''}`}
      >
        <div>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge tone="earn">{kindLabel}</Badge>
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
              <Money
                amount={opportunity.reward.amount}
                currency={opportunity.reward.currency}
                className="font-display font-semibold tabular-nums text-headline-sm text-earn"
              />
            </div>

            <div className="text-body-xs text-fg-subtle truncate">
              {opportunity.sponsor.url ? (
                <a
                  href={opportunity.sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors underline-offset-2 hover:underline"
                >
                  {opportunity.sponsor.name}
                </a>
              ) : (
                <span>{opportunity.sponsor.name}</span>
              )}
            </div>

            <h3 className="font-display text-headline-sm text-fg break-words mt-1">
              {opportunity.projectSlug ? (
                <Link
                  href={`/projects/${opportunity.projectSlug}`}
                  className="hover:text-accent transition-colors"
                >
                  {opportunity.title}
                </Link>
              ) : opportunity.externalUrl ? (
                <a
                  href={opportunity.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  {opportunity.title}
                </a>
              ) : (
                opportunity.title
              )}
            </h3>
          </CardHeader>

          <CardBody className="space-y-4">
            <p className="text-body-sm text-fg-muted line-clamp-3 break-words">
              {opportunity.summary}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {opportunity.tracks.map((track) => (
                <TrackBadge key={track} track={track} />
              ))}
            </div>
          </CardBody>
        </div>

        <CardFooter className="flex items-center justify-between gap-3">
          <span className="text-body-xs text-fg-subtle">
            {opportunity.deadline
              ? `Due ${formatDate(opportunity.deadline)}`
              : 'Rolling application'}
          </span>

          <div className="flex items-center gap-2">
            {opportunity.externalUrl ? (
              <Button asChild size="sm" variant="earn">
                <a href={opportunity.externalUrl} target="_blank" rel="noopener noreferrer">
                  Apply
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
                  variant={isBounty ? 'earn' : 'secondary'}
                  onClick={() => setIsClaimModalOpen(true)}
                >
                  {isBounty ? 'Claim Bounty' : 'Apply'}
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
