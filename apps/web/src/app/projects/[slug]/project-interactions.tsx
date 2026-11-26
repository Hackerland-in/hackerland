'use client';

import { useState } from 'react';
import type { OpenRole } from '@/lib/data/types';
import { Button, cn } from '@hackerland/ui';
import { Heart, Share2, Check } from 'lucide-react';
import { RoleCard } from '@/components/domain/role-card';
import { ApplyRoleModal } from './apply-role-modal';
import { PostUpdateModal } from './post-update-modal';
import { useSocialCommunity } from '@/components/social/social-context';

export interface InteractiveRoleListProps {
  slug: string;
  roles: OpenRole[];
  compact?: boolean;
}

export function InteractiveRoleList({
  slug,
  roles,
  compact = false,
}: InteractiveRoleListProps) {
  const [selectedRole, setSelectedRole] = useState<OpenRole | null>(null);

  if (roles.length === 0) {
    return (
      <p className="text-body-sm text-fg-muted">
        All squad roles are currently filled. Follow this build to hear when new positions open.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-3.5">
        {roles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            compact={compact}
            onApply={(r) => setSelectedRole(r)}
          />
        ))}
      </div>

      <ApplyRoleModal
        slug={slug}
        role={selectedRole}
        onClose={() => setSelectedRole(null)}
      />
    </>
  );
}

export interface PostUpdateActionProps {
  slug: string;
}

export function PostUpdateAction({ slug }: PostUpdateActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="soft"
        onClick={() => setIsOpen(true)}
      >
        Post update
      </Button>

      <PostUpdateModal
        slug={slug}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export interface ProjectHeroActionsProps {
  slug: string;
  openRoles: OpenRole[];
  squadSize?: number;
}

export function ProjectHeroActions({
  slug,
  openRoles,
  squadSize = 3,
}: ProjectHeroActionsProps) {
  const [selectedRole, setSelectedRole] = useState<OpenRole | null>(null);
  const [copied, setCopied] = useState(false);
  const { isProjectStarred, toggleStarProject } = useSocialCommunity();

  const starred = isProjectStarred(slug);
  const starCount = 24 + squadSize * 4 + (starred ? 1 : 0);

  const handleJoinSquad = () => {
    if (openRoles.length > 0 && openRoles[0]) {
      setSelectedRole(openRoles[0]);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleJoinSquad}
          disabled={openRoles.length === 0}
          title={openRoles.length > 0 ? 'Apply to join squad' : 'No open roles currently'}
        >
          Join squad
        </Button>

        <button
          type="button"
          onClick={() => toggleStarProject(slug)}
          aria-pressed={starred}
          className={cn(
            'inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-body-sm font-display font-semibold tabular-nums transition-all',
            starred
              ? 'border-accent/35 bg-accent/10 text-accent-fg'
              : 'border-hairline bg-surface-1 text-fg-muted hover:border-accent/35 hover:text-accent-fg',
          )}
        >
          <Heart className={cn('size-4', starred && 'fill-accent text-accent')} aria-hidden="true" />
          <span>{starCount}</span>
        </button>

        <Button variant="secondary" size="sm" onClick={handleShare} aria-label="Share project link">
          {copied ? <Check className="size-3.5 text-success-fg" /> : <Share2 className="size-3.5" />}
          <span>{copied ? 'Copied' : 'Share'}</span>
        </Button>
      </div>

      <ApplyRoleModal
        slug={slug}
        role={selectedRole}
        onClose={() => setSelectedRole(null)}
      />
    </>
  );
}
