'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Label } from '@hackerland/ui';
import { authClient } from '@/lib/auth-client';

export type AuthFormProps = {
  mode: 'sign-in' | 'sign-up';
  configured: boolean;
  providers: ('github' | 'google')[];
};

export function AuthForm({ mode, configured, providers }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === 'sign-up';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) return;

    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const result = await authClient.signUp.email({
          email,
          password,
          name,
        });
        if (result.error) {
          setError(result.error.message || 'Failed to sign up. Please try again.');
          setLoading(false);
          return;
        }
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
        });
        if (result.error) {
          setError(result.error.message || 'Invalid email or password.');
          setLoading(false);
          return;
        }
      }

      router.push(isSignUp ? '/onboarding' : '/feed');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
      setLoading(false);
    }
  }

  async function handleSocial(provider: 'github' | 'google') {
    if (!configured) return;
    setError(null);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: isSignUp ? '/onboarding' : '/feed',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : `Failed to sign in with ${provider}.`;
      setError(message);
    }
  }

  return (
    <div className="w-full">
      {!configured && (
        <div
          role="region"
          aria-label="Deployment notice"
          className="mb-6 rounded-md border border-warning/40 bg-warning/10 p-4 text-body-sm text-warning-fg"
        >
          <p className="font-semibold">Sign-in isn&apos;t configured on this deployment yet.</p>
          <p className="mt-1 text-fg-muted">
            Database credentials or secrets are missing. You can explore public features without signing in.
          </p>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-md border border-danger/40 bg-danger/10 p-3 text-body-sm text-danger-fg"
        >
          {error}
        </div>
      )}

      <fieldset disabled={!configured} className="space-y-4">
        {providers.length > 0 && (
          <div className="space-y-2 pb-2">
            {providers.includes('github') && (
              <Button
                type="button"
                variant="secondary"
                disabled={!configured}
                className="w-full"
                onClick={() => handleSocial('github')}
              >
                <svg className="size-4 fill-current mr-2" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Continue with GitHub
              </Button>
            )}
            {providers.includes('google') && (
              <Button
                type="button"
                variant="secondary"
                disabled={!configured}
                className="w-full"
                onClick={() => handleSocial('google')}
              >
                <svg className="size-4 mr-2" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                Continue with Google
              </Button>
            )}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-hairline" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-canvas px-2 text-fg-subtle">Or continue with email</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                required
                disabled={!configured}
                className="mt-1"
              />
            </div>
          )}

          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              required
              disabled={!configured}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
              disabled={!configured}
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={!configured || loading}
            className="w-full"
          >
            {isSignUp ? 'Create account' : 'Sign in'}
          </Button>
        </form>
      </fieldset>

      <p className="mt-6 text-center text-body-sm text-fg-muted">
        {isSignUp ? (
          <>
            Already have an account?{' '}
            <Link href="/sign-in" className="text-accent underline-offset-4 hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-accent underline-offset-4 hover:underline">
              Sign up
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
