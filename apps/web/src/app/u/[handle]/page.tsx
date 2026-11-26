import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getFeed,
  getPlatformStats,
  getProfile,
  listOpportunities,
  listProjects,
} from '@/lib/data/queries';
import { ALL_PEOPLE } from '@/lib/data/fixtures/people';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { SocialProfileView } from '@/components/social/social-profile-view';
import { CommunityRightRail } from '@/components/social/community-right-rail';

interface ProfilePageProps {
  params: Promise<{
    handle: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { handle } = await params;
  const profile = await getProfile(handle);
  if (!profile) {
    return { title: 'Profile Not Found' };
  }
  return {
    title: `${profile.name} (@${profile.handle})`,
    description: profile.headline || profile.bio,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { handle } = await params;
  const [profile, allPosts, projects, opportunities, stats] = await Promise.all([
    getProfile(handle),
    getFeed(),
    listProjects(),
    listOpportunities('bounty'),
    getPlatformStats(),
  ]);

  if (!profile) {
    notFound();
  }

  const normalizedHandle = profile.handle.toLowerCase();
  const makerPosts = allPosts.filter(
    (p) =>
      p.author.handle.toLowerCase() === normalizedHandle ||
      p.coAuthors?.some((c) => c.handle.toLowerCase() === normalizedHandle),
  );

  const suggestedOthers = ALL_PEOPLE.filter(
    (p) => p.handle.toLowerCase() !== normalizedHandle,
  ).slice(0, 4);

  return (
    <SocialCommunityProvider>
      <SocialShell
        rightRail={
          <CommunityRightRail
            suggestedMakers={suggestedOthers}
            trendingProjects={projects.slice(0, 3)}
            openBounties={opportunities.slice(0, 3)}
            stats={stats}
          />
        }
      >
        <SocialProfileView profile={profile} posts={makerPosts} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
