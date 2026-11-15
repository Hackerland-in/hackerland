import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hackerland · Open-Source Innovation Network',
    short_name: 'Hackerland',
    description:
      'Open-source innovation network for hardware tinkerers, deep-tech researchers, makers, and innovators to build in public, find collaborators, and earn through bounties.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0B0E',
    theme_color: '#0A0B0E',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicon.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    categories: ['productivity', 'education', 'developer-tools'],
  };
}
