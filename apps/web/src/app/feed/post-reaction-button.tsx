'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@hackerland/ui';

export interface PostReactionButtonProps {
  postId: string;
  initialReactions: number;
  className?: string;
}

export function PostReactionButton({
  postId,
  initialReactions,
  className,
}: PostReactionButtonProps) {
  const [reactions, setReactions] = useState(initialReactions);
  const [hasReacted, setHasReacted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleReact = async () => {
    if (isPending) return;

    // Optimistic toggle
    const nextReacted = !hasReacted;
    const nextCount = nextReacted ? reactions + 1 : Math.max(0, reactions - 1);

    setHasReacted(nextReacted);
    setReactions(nextCount);
    setIsPending(true);

    try {
      const res = await fetch(`/api/posts/${postId}/react`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        if (typeof data.reactions === 'number') {
          setReactions(data.reactions);
        }
      }
    } catch {
      // In static demo or offline mode, preserve optimistic state
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleReact}
      disabled={isPending}
      aria-label={`${reactions} reactions. Click to ${hasReacted ? 'unlike' : 'react'}`}
      aria-pressed={hasReacted}
      className={cn(
        'group inline-flex items-center gap-1.5 tabular-nums text-body-sm transition-colors',
        hasReacted
          ? 'text-danger font-medium'
          : 'text-fg-subtle hover:text-danger focus-visible:text-danger',
        className
      )}
    >
      <Heart
        className={cn(
          'size-4 transition-transform group-hover:scale-110 active:scale-95',
          hasReacted ? 'fill-current text-danger' : 'text-fg-subtle group-hover:text-danger'
        )}
        aria-hidden="true"
      />
      <span>{reactions}</span>
      <span className="sr-only">reactions</span>
    </button>
  );
}
