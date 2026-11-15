'use client';

import { useState } from 'react';
import { Flag } from 'lucide-react';
import { ReportModal } from '@/components/trust/report-modal';

export interface PostReportButtonProps {
  postId: string;
  postTitle: string;
}

export function PostReportButton({ postId, postTitle }: PostReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 text-fg-subtle transition-colors hover:text-danger focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        title="Report content"
        aria-label={`Report post: ${postTitle}`}
      >
        <Flag className="size-3.5" aria-hidden="true" />
      </button>

      <ReportModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        targetType="post"
        targetId={postId}
        targetTitle={postTitle}
      />
    </>
  );
}
