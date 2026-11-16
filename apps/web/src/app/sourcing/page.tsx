import type { Metadata } from 'next';
import { COMPONENT_SOURCING_REGISTRY } from '@/lib/data/sourcing-data';
import { SourcingCatalog } from '@/components/sourcing/sourcing-catalog';

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
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-mono font-medium text-primary">
          <span>📦 DOMESTIC DISTRIBUTORS & PIN-COMPATIBLE ALTERNATES</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Component Sourcing & Drop-In Alternates
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-3xl leading-relaxed">
          Shield your hardware bill of materials from supply-chain choke points and tariff shocks. Compare live domestic Indian stock across Robu.in, Evelta, and Element14, calculate true landed costs with HSN 8542 customs duty and 18% GST, and discover verified 100% pin-compatible drop-in alternatives.
        </p>
      </div>

      <SourcingCatalog initialRecords={COMPONENT_SOURCING_REGISTRY} />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
