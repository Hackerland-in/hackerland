import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { COMPONENT_SOURCING_REGISTRY } from '@/lib/data/sourcing-data';
import { SourcingDetailView } from '@/components/sourcing/sourcing-detail-view';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

interface SourcingPageProps {
  params: Promise<{ mpn: string }>;
}

export async function generateStaticParams() {
  return COMPONENT_SOURCING_REGISTRY.map((rec) => ({
    mpn: rec.mpn,
  }));
}

export async function generateMetadata({ params }: SourcingPageProps): Promise<Metadata> {
  const { mpn } = await params;
  const decodedMpn = decodeURIComponent(mpn);
  const record = COMPONENT_SOURCING_REGISTRY.find(
    (r) => r.mpn.toLowerCase() === decodedMpn.toLowerCase(),
  );

  if (!record) {
    return { title: 'Component Not Found | Hackerland' };
  }

  const domesticStock = record.suppliers
    .filter((s) => s.country === 'IN')
    .reduce((sum, s) => sum + s.inStockCount, 0);

  const bestAlternate = record.alternates[0];

  return {
    title: `${record.mpn} Sourcing, Indian Stock & Drop-In Alternates | Hackerland`,
    description: `${record.mpn} (${record.manufacturer}): ${record.description}. Benchmark price ₹${record.basePriceINR.toFixed(2)}. ${domesticStock} pcs domestic stock in India.${bestAlternate ? ` Best alternate: ${bestAlternate.mpn} (${bestAlternate.compatibilityScore}% match).` : ''}`,
    openGraph: {
      title: `${record.mpn} (${record.manufacturer}) Sourcing & Alternates | Hackerland`,
      description: record.description,
      url: `https://www.hackerland.in/sourcing/${record.mpn}`,
      siteName: 'Hackerland',
      locale: 'en_IN',
      type: 'article',
    },
  };
}

export default async function ComponentDetailPage({ params }: SourcingPageProps) {
  const { mpn } = await params;
  const decodedMpn = decodeURIComponent(mpn);
  const record = COMPONENT_SOURCING_REGISTRY.find(
    (r) => r.mpn.toLowerCase() === decodedMpn.toLowerCase(),
  );

  if (!record) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: record.mpn,
    image: 'https://www.hackerland.in/images/chip-icon.png',
    description: record.description,
    mpn: record.mpn,
    brand: {
      '@type': 'Brand',
      name: record.manufacturer,
    },
    offers: record.suppliers.map((sup) => ({
      '@type': 'Offer',
      price: sup.unitPriceINR.toString(),
      priceCurrency: 'INR',
      availability:
        sup.inStockCount > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: sup.supplierName,
      },
      url: sup.productUrl || `https://www.hackerland.in/sourcing/${record.mpn}`,
    })),
  };

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <SourcingDetailView record={record} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
