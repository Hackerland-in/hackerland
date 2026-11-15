'use client';

import { useState } from 'react';
import type { OpenRole } from '@/lib/data/types';
import { Button } from '@hackerland/ui';
import { RoleCard } from '@/components/domain/role-card';
import { ApplyRoleModal } from './apply-role-modal';
import { PostUpdateModal } from './post-update-modal';

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
        All squad positions are currently filled. Follow this project to be notified when new roles open.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-4">
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
        variant="secondary"
        onClick={() => setIsOpen(true)}
        className="font-display"
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
}

export function ProjectHeroActions({
  slug,
  openRoles,
}: ProjectHeroActionsProps) {
  const [selectedRole, setSelectedRole] = useState<OpenRole | null>(null);

  const handleJoinSquad = () => {
    if (openRoles.length > 0 && openRoles[0]) {
      setSelectedRole(openRoles[0]);
    }
  };

  return (
    <>
      <div className="flex shrink-0 flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          disabled
          title="Available once accounts launch"
          aria-disabled="true"
        >
          Offer mentorship
        </Button>
        <Button
          variant="primary"
          onClick={handleJoinSquad}
          disabled={openRoles.length === 0}
          title={openRoles.length > 0 ? 'Apply to join squad' : 'No open roles currently'}
        >
          Join squad
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
