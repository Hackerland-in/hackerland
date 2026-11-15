import type { ReactNode } from 'react';
import { ManufacturingSubnav } from '@/components/manufacturing/manufacturing-subnav';

export default function ManufacturingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ManufacturingSubnav />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
