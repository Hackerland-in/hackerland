import type { OpenRole } from '@/lib/data/types';
import { Badge, Button, Chip, cn } from '@hackerland/ui';
import { TRACK_META, formatMoney } from '@hackerland/core';

export interface RoleCardProps {
  role: OpenRole;
  compact?: boolean;
  className?: string;
}

/** Formats compensation into e.g. "₹40,000 / month", "₹25,000", "Volunteer", etc. */
export function formatRoleCompensation(compensation: OpenRole['compensation']): string {
  switch (compensation.type) {
    case 'volunteer':
      return 'Volunteer';
    case 'stipend':
      if (compensation.amount !== undefined && compensation.currency) {
        const formatted = formatMoney(compensation.amount, compensation.currency);
        return `${formatted} / ${compensation.period ?? 'month'}`;
      }
      return 'Stipend';
    case 'bounty':
      if (compensation.amount !== undefined && compensation.currency) {
        const formatted = formatMoney(compensation.amount, compensation.currency);
        return compensation.period ? `${formatted} / ${compensation.period}` : formatted;
      }
      return 'Bounty';
    case 'revenue-share':
      return 'Revenue share';
    case 'equity':
      return 'Equity';
    default:
      return 'Volunteer';
  }
}

export function RoleCard({ role, compact = false, className }: RoleCardProps) {
  const compLabel = formatRoleCompensation(role.compensation);
  const isPaid =
    role.compensation.type === 'stipend' ||
    role.compensation.type === 'bounty' ||
    role.compensation.type === 'revenue-share';

  return (
    <div
      className={cn(
        'min-w-0 rounded-lg border border-hairline bg-surface-1 transition-colors hover:border-hairline/80',
        compact ? 'p-3 md:p-4' : 'p-4 md:p-5',
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge tone={role.track} variant="outline">
              {TRACK_META[role.track]?.label ?? role.track}
            </Badge>
            <Badge tone={isPaid ? 'earn' : 'neutral'} variant="solid">
              {compLabel}
            </Badge>
          </div>
          <h3 className="font-display text-headline-sm text-fg break-words">
            {role.title}
          </h3>
        </div>

        <Button
          size="sm"
          variant="secondary"
          disabled
          title="Applications open with accounts"
          aria-disabled="true"
          className="self-start shrink-0"
        >
          Apply
        </Button>
      </div>

      {!compact && role.description ? (
        <p className="mt-2 text-body-sm text-fg-muted break-words">
          {role.description}
        </p>
      ) : null}

      {role.skills && role.skills.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {role.skills.map((skill) => (
            <Chip key={skill} tone={role.track}>
              {skill}
            </Chip>
          ))}
        </div>
      ) : null}
    </div>
  );
}
