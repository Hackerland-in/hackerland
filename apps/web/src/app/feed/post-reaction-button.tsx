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
      // Preserve optimistic UI in offline/static mode
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleReact}
      disabled={isPending}
      aria-label={`${reactions} likes. Click to ${hasReacted ? 'unlike' : 'like'}`}
      aria-pressed={hasReacted}
      className={cn(
        'group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 tabular-nums text-body-sm transition-colors',
        hasReacted
          ? 'bg-accent/10 text-accent-fg font-semibold'
          : 'text-fg-subtle hover:bg-accent/8 hover:text-accent-fg focus-visible:text-accent-fg',
        className,
      )}
    >
      <Heart
        className={cn(
          'size-4 transition-transform group-hover:scale-110 active:scale-95',
          hasReacted ? 'fill-accent text-accent' : 'text-fg-subtle group-hover:text-accent',
        )}
        aria-hidden="true"
      />
      <span>{reactions}</span>
      <span className="sr-only">likes</span>
    </button>
  );
}
