import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { getMongoClient } from '@hackerland/db';

export function isAuthConfigured(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return Boolean(env.MONGODB_URI?.trim() && env.BETTER_AUTH_SECRET?.trim());
}

export function getEnabledSocialProviders(
  env: Record<string, string | undefined> = process.env,
): ('github' | 'google')[] {
  const providers: ('github' | 'google')[] = [];
  if (env.GITHUB_CLIENT_ID?.trim() && env.GITHUB_CLIENT_SECRET?.trim()) {
    providers.push('github');
  }
  if (env.GOOGLE_CLIENT_ID?.trim() && env.GOOGLE_CLIENT_SECRET?.trim()) {
    providers.push('google');
  }
  return providers;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let authInstance: any = null;

export function getAuth() {
  if (authInstance) {
    return authInstance;
  }

  const client = getMongoClient();
  const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};

  if (process.env.GITHUB_CLIENT_ID?.trim() && process.env.GITHUB_CLIENT_SECRET?.trim()) {
    socialProviders.github = {
      clientId: process.env.GITHUB_CLIENT_ID.trim(),
      clientSecret: process.env.GITHUB_CLIENT_SECRET.trim(),
    };
  }

  if (process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim()) {
    socialProviders.google = {
      clientId: process.env.GOOGLE_CLIENT_ID.trim(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET.trim(),
    };
  }

  const envOrigins = [
    'https://hackerland.in',
    'https://www.hackerland.in',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`] : []),
    ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(',').map((s) => s.trim()) ?? []),
  ];
  const trustedOrigins = Array.from(new Set(envOrigins.filter(Boolean)));

  authInstance = betterAuth({
    database: mongodbAdapter(client.db()),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
    },
    socialProviders: Object.keys(socialProviders).length > 0 ? socialProviders : undefined,
    baseURL: process.env.BETTER_AUTH_URL || 'https://www.hackerland.in',
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins,
  });

  return authInstance;
}
