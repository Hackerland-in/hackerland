'use client';

import Link from 'next/link';
import { Settings, UserPlus, UserCheck, Share2, Check, MessageSquare } from 'lucide-react';
import { Button, cn } from '@hackerland/ui';
import { authClient } from '@/lib/auth-client';
import { useState, useEffect } from 'react';
import { useSocialCommunity } from '@/components/social/social-context';

export interface ProfileActionsProps {
  handle: string;
}

export function ProfileActions({ handle }: ProfileActionsProps) {
  const session = authClient.useSession();
  const { isFollowing, toggleFollow } = useSocialCommunity();
  const [currentUserHandle, setCurrentUserHandle] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const user = session.data?.user;
  const following = isFollowing(handle);

  useEffect(() => {
    if (!user?.id) return;
    fetch('/api/me/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const prof = data?.profile || data;
        if (prof?.handle) {
          setCurrentUserHandle(prof.handle.toLowerCase());
        }
      })
      .catch(() => {});
  }, [user?.id]);

  const isOwnProfile = Boolean(currentUserHandle && currentUserHandle === handle.toLowerCase());

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Ignore in restricted test/sandbox environments
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isOwnProfile) {
    return (
      <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
        <Button asChild variant="primary" size="sm">
          <Link href="/settings">
            <Settings className="size-3.5" aria-hidden="true" />
            <span>Edit Profile</span>
          </Link>
        </Button>
        <Button variant="secondary" size="sm" onClick={handleShare}>
          {copied ? <Check className="size-3.5 text-success-fg" /> : <Share2 className="size-3.5" />}
          <span>{copied ? 'Copied' : 'Share'}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
      <Button
        variant={following ? 'secondary' : 'primary'}
        size="sm"
        onClick={() => toggleFollow(handle)}
        aria-pressed={following}
        className={cn(following && 'hover:border-danger/40 hover:text-danger-fg')}
      >
        {following ? (
          <>
            <UserCheck className="size-3.5" aria-hidden="true" />
            <span>Following</span>
          </>
        ) : (
          <>
            <UserPlus className="size-3.5" aria-hidden="true" />
            <span>Follow</span>
          </>
        )}
      </Button>

      <Button asChild variant="soft" size="sm">
        <Link href={`/feed?user=${encodeURIComponent(handle)}`}>
          <MessageSquare className="size-3.5" aria-hidden="true" />
          <span>Collaborate</span>
        </Link>
      </Button>

      <Button variant="secondary" size="sm" onClick={handleShare} aria-label="Share profile">
        {copied ? <Check className="size-3.5 text-success-fg" /> : <Share2 className="size-3.5" />}
        <span>{copied ? 'Copied' : 'Share'}</span>
      </Button>
    </div>
  );
}
