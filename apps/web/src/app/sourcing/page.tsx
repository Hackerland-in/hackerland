import type { Metadata } from 'next';
import { PackageSearch } from 'lucide-react';
import { COMPONENT_SOURCING_REGISTRY } from '@/lib/data/sourcing-data';
import { SourcingCatalog } from '@/components/sourcing/sourcing-catalog';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'Hardware Component Sourcing & Drop-In Alternates | Hackerland',
  description:
    'Direct Indian & Asian electronic component cross-reference engine. Pin-to-pin drop-in replacement finder for supply-constrained ICs with real-time landed tariff and 18% GST calculators across Robu, Evelta, Element14, and LCSC.',
  keywords: [
    'electronic component sourcing india',
    'ic drop in replacement',
    'stm32f405 gd32 alternate',
    'bms afe bq76952 alternative',
    'lora sx1262 distributor india',
    'robu evelta element14 stock',
    'hsn 8542 customs duty calculator',
  ],
  openGraph: {
    title: 'Hardware Component Sourcing & Drop-In Alternates | Hackerland',
    description:
      'Pin-to-pin drop-in replacement finder and Indian landed tariff calculator for electronic integrated circuits.',
    url: 'https://www.hackerland.in/sourcing',
    siteName: 'Hackerland',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function SourcingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hackerland Electronic Component Sourcing Directory',
    description: 'Component cross-reference, domestic Indian distributor stock, and drop-in alternates.',
    itemListElement: COMPONENT_SOURCING_REGISTRY.map((rec, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: rec.mpn,
        description: rec.description,
        brand: {
          '@type': 'Brand',
          name: rec.manufacturer,
        },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'INR',
          lowPrice: rec.basePriceINR.toString(),
          offerCount: rec.suppliers.length.toString(),
        },
        url: `https://www.hackerland.in/sourcing/${rec.mpn}`,
      },
    })),
  };

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <PackageSearch className="size-3.5" aria-hidden="true" />
            <span>Domestic Distributors &amp; Alternates</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
            Component Sourcing &amp; Drop-In Alternates
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
            Compare live domestic Indian stock across Robu.in, Evelta, and Element14, compute landed invoice cost with HSN 8542 customs duty &amp; 18% GST, and spot pin-compatible replacements.
          </p>
        </header>

        <SourcingCatalog initialRecords={COMPONENT_SOURCING_REGISTRY} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
