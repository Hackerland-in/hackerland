import type { Metadata } from 'next';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';
import { IdeasWorkbench } from '@/components/social/ideas-workbench';

export const metadata: Metadata = {
  title: 'IdeaLab: From Spark to Squad · Hackerland',
  description:
    'Structured 7-stage community incubator taking raw observations through validation, rough prototyping, and live engineering squad launch.',
};

export default function IdeasPage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <IdeasWorkbench />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
