import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';
import { SkipLink } from '@/components/layout/skip-link';
import { AppHeader } from '@/components/layout/app-header';
import { AppFooter } from '@/components/layout/app-footer';
import { MobileNav } from '@/components/layout/mobile-nav';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#FA1681',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.hackerland.in'),
  applicationName: 'Hackerland',
  title: {
    template: '%s · Hackerland',
    default: 'Hackerland · Build in India, Manufacture & Export to the World',
  },
  description:
    'India-wide platform inspiring young builders across every sector and region: go from spark and free learning resources to squad prototyping, grants, manufacturing, and global exports.',
  keywords: [
    'Make in India Platform',
    'Youth Manufacturing India',
    'Hardware & Software Builders India',
    'NIDHI PRAYAS Prototyping Grants',
    'PCB & CAD Simulators Online',
    'India Export Hub DGFT RoDTEP CE FCC',
    'Makerspaces ATL FabLabs India',
    'Open Hardware & Deep Tech Community',
  ],
  alternates: {
    canonical: 'https://www.hackerland.in',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.hackerland.in',
    siteName: 'Hackerland',
    title: 'Hackerland · Build Together Community',
    description:
      'Discover what makers are shipping today, join hardware & software squads, ask engineering questions, and earn bounties.',
    images: [
      {
        url: '/images/logo1.png',
        width: 1200,
        height: 630,
        alt: 'Hackerland Community',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hackerland · Build Together Community',
    description:
      'Open community for makers, students, engineers, and designers building hardware & software in public.',
    images: ['/images/logo1.png'],
    creator: '@hackerland_in',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/logo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Hackerland',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.hackerland.in/#organization',
      name: 'Hackerland',
      url: 'https://www.hackerland.in',
      logo: 'https://www.hackerland.in/logo.png',
      description: 'Community and open innovation network for students, makers, engineers, and builders.',
      sameAs: [
        'https://github.com/Hackerland-in',
        'https://x.com/hackerland_in',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.hackerland.in/#website',
      url: 'https://www.hackerland.in',
      name: 'Hackerland',
      publisher: { '@id': 'https://www.hackerland.in/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.hackerland.in/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

const themeScript = `(function() {
  try {
    var saved = localStorage.getItem('hackerland-theme');
    var isDark = saved === 'dark';
    var root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
      root.classList.add('light');
    }
  } catch (e) {}
})();`;

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`light ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-canvas text-fg font-sans text-body-md antialiased selection:bg-accent selection:text-on-solid max-w-full overflow-x-clip">
        <SkipLink />
        <AppHeader />
        <main id="main" className="flex-1 pb-20 md:pb-0 max-w-full overflow-x-clip">
          {children}
        </main>
        <AppFooter />
        <MobileNav />
      </body>
    </html>
  );
}
