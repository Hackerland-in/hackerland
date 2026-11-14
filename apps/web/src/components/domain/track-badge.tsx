import { Badge } from '@hackerland/ui';
import { TRACK_META, type Track } from '@hackerland/core';

export interface TrackBadgeProps {
  track: Track;
  className?: string;
  variant?: 'outline' | 'solid';
}

export function TrackBadge({ track, className, variant = 'outline' }: TrackBadgeProps) {
  const meta = TRACK_META[track];
  return (
    <Badge tone={track} variant={variant} className={className}>
      {meta ? meta.label : track}
    </Badge>
  );
}
