'use client';

import { useState } from 'react';
import { Button } from '@hackerland/ui';
import { PenSquare, Sparkles } from 'lucide-react';
import { CreatePostModal } from './create-post-modal';

export function CreatePostTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-hairline bg-surface-1 p-3.5 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Sparkles className="size-4" />
          </div>
          <p className="text-body-sm text-fg-muted truncate">
            Building something new or running into a hardware bottleneck?
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="shrink-0"
        >
          <PenSquare className="size-4" />
          <span>Post an Update / Ask Question</span>
        </Button>
      </div>

      <CreatePostModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
