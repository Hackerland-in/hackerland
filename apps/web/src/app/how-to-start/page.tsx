import type { Metadata } from 'next';
import { HowToStartHub } from '@/components/domain/how-to-start/how-to-start-hub';

export const metadata: Metadata = {
  title: 'How to Start an Industrial Manufacturing Plant | Hackerland Hardware',
  description:
    'Comprehensive blueprints to set up semiconductor fabs, carbon fiber composite hubs, multilayer PCB design plants, bicycle manufacturing facilities, precision CNC turned components, and mobile phone parts in India.',
};

export default function HowToStartPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-w-0">
      <HowToStartHub />
    </div>
  );
}
