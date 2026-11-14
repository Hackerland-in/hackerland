import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  metadataBase: new URL('https://hackerland.in'),
  title: {
    template: '%s · Hackerland',
    default: 'Hackerland: build together, earn together',
  },
  description:
    'Open-source innovation network for students, designers, programmers, makers and innovators to build in the open, find collaborators, and earn through bounties and grants.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-canvas text-fg font-sans text-body-md antialiased selection:bg-accent selection:text-on-solid">
        <SkipLink />
        <AppHeader />
        <main id="main" className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
        <AppFooter />
        <MobileNav />
      </body>
    </html>
  );
}
