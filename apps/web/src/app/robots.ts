import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/settings',
          '/me',
          '/moderation',
          '/onboarding',
          '/sign-in',
          '/sign-up',
        ],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'anthropic-ai', 'ClaudeBot', 'PerplexityBot'],
        allow: ['/', '/manufacturing/', '/projects/', '/learn/', '/how-to-start/', '/feed'],
        disallow: ['/api/', '/settings', '/me', '/moderation'],
      },
    ],
    sitemap: 'https://www.hackerland.in/sitemap.xml',
    host: 'https://www.hackerland.in',
  };
}
