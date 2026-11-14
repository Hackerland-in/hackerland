import Link from 'next/link';
import { Avatar, Badge } from '@hackerland/ui';
import type { PersonRef } from '@/lib/data/types';

export interface PersonChipProps {
  person: PersonRef;
  size?: 'sm' | 'md' | 'lg';
  showBadges?: boolean;
  className?: string;
}

export function PersonChip({
  person,
  size = 'md',
  showBadges = true,
  className = '',
}: PersonChipProps) {
  return (
    <div className={`inline-flex min-w-0 max-w-full flex-wrap items-center gap-2 ${className}`}>
      <Link
        href={`/u/${person.handle}`}
        className="group inline-flex min-w-0 items-center gap-2 transition-colors"
      >
        <Avatar
          name={person.name}
          src={person.avatarUrl}
          size={size === 'lg' ? 'md' : size}
        />
        <span className="min-w-0 font-display font-medium text-fg group-hover:text-accent group-hover:underline break-words">
          {person.name}
        </span>
      </Link>
      {showBadges && person.badges && person.badges.length > 0 ? (
        <div className="inline-flex flex-wrap items-center gap-1.5">
          {person.badges.map((badge, idx) => (
            <Badge key={idx} tone={badge.tone}>
              {badge.label}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}
