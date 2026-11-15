'use client';

import { useState } from 'react';
import { Button } from '@hackerland/ui';
import { Plus } from 'lucide-react';
import { RegisterLabModal } from './register-lab-modal';

export function RegisterLabTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setIsOpen(true)}
        className="gap-2 font-display"
      >
        <Plus className="size-4" />
        <span>Register a Lab Node</span>
      </Button>

      <RegisterLabModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
