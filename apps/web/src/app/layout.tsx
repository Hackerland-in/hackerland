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
  themeColor: '#0A0B0E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.hackerland.in'),
  applicationName: 'Hackerland',
  title: {
    template: '%s · Hackerland',
    default: 'Hackerland: Open Hardware, PCB Studio & Innovation Network',
  },
  description:
    'Open-source hardware & electronics innovation network. Design PCBs with real-time SPICE circuit simulation, Veroboard track cuts, 3D WebGL physics labs, and earn through hardware bounties and grants.',
  keywords: [
    'PCB Design Online',
    'Real-time Circuit Simulator',
    'Veroboard Stripboard Simulator',
    'SPICE Simulation in Browser',
    'Open Hardware Network',
    'Hardware Bounties India',
    '3D WebGL Physics Labs',
    'RS-274X Gerber Exporter',
    'KiCad Netlist',
    'Makerspace India',
    'Electronics Prototyping',
  ],
  alternates: {
    canonical: 'https://www.hackerland.in',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.hackerland.in',
    siteName: 'Hackerland',
    title: 'Hackerland · Open Hardware, PCB Studio & Innovation Network',
    description:
      'Design PCBs with live SPICE simulation, slice Veroboard strips, inspect 3D physics labs, and collaborate with hardware innovators across India.',
    images: [
      {
        url: '/images/logo1.png',
        width: 1200,
        height: 630,
        alt: 'Hackerland - Open Hardware Innovation Network',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hackerland · Build Together, Earn Together',
    description:
      'Open-source hardware & electronics studio with live SPICE circuit simulation, Veroboard, and hardware bounties.',
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
    statusBarStyle: 'black-translucent',
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
      description: 'Open-source hardware and electronics innovation network for students, makers, and innovators.',
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
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.hackerland.in/manufacturing/pcb#app',
      name: 'Hackerland PCB & Real-Time Circuit Studio',
      applicationCategory: 'EngineeringApplication',
      operatingSystem: 'All',
      url: 'https://www.hackerland.in/manufacturing/pcb',
      description: 'Browser-based electronic design automation tool with real-time SPICE circuit simulation, Veroboard track cutter, 3D WebGL viewer, and Gerber RS-274X export.',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
    },
  ],
};

const themeScript = `(function() {
  try {
    var saved = localStorage.getItem('hackerland-theme');
    var isLight = saved === 'light';
    var root = document.documentElement;
    if (isLight) {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.setAttribute('data-theme', 'dark');
      root.classList.remove('light');
      root.classList.add('dark');
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
      data-theme="dark"
      suppressHydrationWarning
      className={`dark ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
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
