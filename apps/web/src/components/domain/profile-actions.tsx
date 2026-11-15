'use client';

import Link from 'next/link';
import { Settings, UserPlus, Share2 } from 'lucide-react';
import { Button } from '@hackerland/ui';
import { authClient } from '@/lib/auth-client';
import { useState, useEffect } from 'react';

export interface ProfileActionsProps {
  handle: string;
}

export function ProfileActions({ handle }: ProfileActionsProps) {
  const session = authClient.useSession();
  const [currentUserHandle, setCurrentUserHandle] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const user = session.data?.user;

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

  const isOwnProfile =
    Boolean(currentUserHandle && currentUserHandle === handle.toLowerCase());

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (isOwnProfile) {
    return (
      <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">
        <Button asChild variant="primary" size="sm">
          <Link href="/settings">
            <Settings className="size-3.5 mr-1.5" />
            Edit Profile
          </Link>
        </Button>
        <Button variant="secondary" size="sm" onClick={handleShare}>
          <Share2 className="size-3.5 mr-1.5" />
          {copied ? 'Link Copied!' : 'Share Profile'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">
      <Button asChild variant="primary" size="sm">
        <Link href={`/feed?user=${encodeURIComponent(handle)}`}>
          <UserPlus className="size-3.5 mr-1.5" />
          Collaborate
        </Link>
      </Button>
      <Button variant="secondary" size="sm" onClick={handleShare}>
        <Share2 className="size-3.5 mr-1.5" />
        {copied ? 'Link Copied!' : 'Share'}
      </Button>
    </div>
  );
}
