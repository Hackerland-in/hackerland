import Link from 'next/link';
import { Sparkles, Users, Award } from 'lucide-react';
import { isAuthConfigured, getEnabledSocialProviders } from '@/lib/auth';
import { AuthForm } from '@/components/auth/auth-form';

export const metadata = {
  title: 'Sign In | Hackerland',
  description: 'Sign in to Hackerland to build, collaborate, and earn.',
};

export default function SignInPage() {
  const configured = isAuthConfigured();
  const providers = getEnabledSocialProviders();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-14rem)] max-w-lg flex-col justify-center px-4 py-10 space-y-6">
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft border border-accent/20 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
          <Sparkles className="size-3.5" aria-hidden="true" />
          <span>Hackerland Builder Network</span>
        </div>
        <h1 className="font-display text-headline-xl font-bold tracking-tight text-fg">
          Welcome back
        </h1>
        <p className="text-body-md text-fg-muted">
          Sign in to your Hackerland node, squad rooms, and Innovation Passport.
        </p>
      </div>

      <AuthForm mode="sign-in" configured={configured} providers={providers} />

      <div className="grid grid-cols-2 gap-3 text-body-xs">
        <Link
          href="/u"
          className="flex items-center gap-2 rounded-xl border border-hairline bg-surface-1 p-3 hover:border-accent/40 transition-colors"
        >
          <Users className="size-4 text-accent shrink-0" />
          <span className="font-medium text-fg-muted">Browse Maker Directory</span>
        </Link>
        <Link
          href="/passport"
          className="flex items-center gap-2 rounded-xl border border-hairline bg-surface-1 p-3 hover:border-accent/40 transition-colors"
        >
          <Award className="size-4 text-accent shrink-0" />
          <span className="font-medium text-fg-muted">View Innovation Passport</span>
        </Link>
      </div>
    </div>
  );
}
