import type { Metadata } from 'next';
import {
  getPlatformStats,
  listOpportunities,
  listProjects,
} from '@/lib/data/queries';
import { ALL_PEOPLE } from '@/lib/data/fixtures/people';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { PersonalProfileHub } from '@/components/social/personal-profile-hub';
import { CommunityRightRail } from '@/components/social/community-right-rail';

export const metadata: Metadata = {
  title: 'Your Profile',
  description:
    'Manage your maker handle, followers, saved feed posts, skills, and project contributions.',
};

export default async function ProfileHubPage() {
  const [projects, opportunities, stats] = await Promise.all([
    listProjects(),
    listOpportunities('bounty'),
    getPlatformStats(),
  ]);

  return (
    <SocialCommunityProvider>
      <SocialShell
        rightRail={
          <CommunityRightRail
            suggestedMakers={ALL_PEOPLE.slice(0, 4)}
            trendingProjects={projects.slice(0, 3)}
            openBounties={opportunities.slice(0, 3)}
            stats={stats}
          />
        }
      >
        <PersonalProfileHub />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
