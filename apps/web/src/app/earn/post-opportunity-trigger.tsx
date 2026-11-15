'use client';

import { useState } from 'react';
import { Button } from '@hackerland/ui';
import { Plus } from 'lucide-react';
import { CreateOpportunityModal } from './create-opportunity-modal';

export function PostOpportunityTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="earn"
        size="md"
        onClick={() => setIsOpen(true)}
        className="gap-2 shadow-glow-earn"
      >
        <Plus className="size-4" />
        Post an Opportunity
      </Button>

      <CreateOpportunityModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
