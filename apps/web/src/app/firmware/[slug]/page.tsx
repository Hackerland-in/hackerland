import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FIRMWARE_REGISTRY } from '@/lib/data/firmware-data';
import { FirmwareDetailView } from '@/components/firmware/firmware-detail-view';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

interface FirmwarePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return FIRMWARE_REGISTRY.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: FirmwarePageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = FIRMWARE_REGISTRY.find((fw) => fw.slug === slug);
  if (!item) {
    return { title: 'Firmware Not Found | Hackerland' };
  }

  return {
    title: `${item.title} | Hardware Firmware Registry`,
    description: item.tagline,
    openGraph: {
      title: `${item.title} - One-Click WebSerial Flasher`,
      description: item.tagline,
      type: 'article',
    },
  };
}

export default async function FirmwareDetailPage({ params }: FirmwarePageProps) {
  const { slug } = await params;
  const item = FIRMWARE_REGISTRY.find((fw) => fw.slug === slug);

  if (!item) {
    notFound();
  }

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <FirmwareDetailView item={item} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
