import Link from 'next/link';
import { Avatar } from '@hackerland/ui';
import type { PersonRef } from '@/lib/data/types';

export interface BuilderStoryItem {
  person: PersonRef;
  statusTag: string;
}

export interface BuilderStoriesStripProps {
  stories: BuilderStoryItem[];
}

export function BuilderStoriesStrip({ stories }: BuilderStoriesStripProps) {
  return (
    <div
      aria-label="Active Builders"
      className="rounded-2xl border border-hairline bg-surface-1 p-3.5 shadow-xs min-w-0"
    >
      <div className="flex items-center justify-between px-1 mb-2.5">
        <span className="font-display text-label-md text-fg">Shipping Today</span>
        <Link href="/u" className="text-[12px] font-medium text-accent-fg hover:underline">
          All makers
        </Link>
      </div>

      <div className="flex items-start gap-3.5 overflow-x-auto pb-1 scrollbar-thin">
        {stories.map((story) => (
          <Link
            key={story.person.handle}
            href={`/u/${story.person.handle}`}
            className="group flex flex-col items-center gap-1.5 shrink-0 w-[74px] text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl p-1"
          >
            {/* Pink Gradient Highlight Ring */}
            <div className="rounded-full p-[2.5px] bg-gradient-to-tr from-accent via-design to-make shadow-xs transition-transform duration-150 group-hover:scale-105">
              <div className="rounded-full bg-surface-1 p-[2px]">
                <Avatar
                  name={story.person.name}
                  src={story.person.avatarUrl}
                  size="lg"
                />
              </div>
            </div>
            <span className="w-full truncate font-display text-[12px] font-semibold text-fg group-hover:text-accent-fg">
              {story.person.name.split(' ').slice(0, 2).join(' ')}
            </span>
            <span className="w-full truncate rounded-full bg-accent/8 px-1.5 py-0.5 text-[10px] font-medium text-accent-fg">
              {story.statusTag}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
