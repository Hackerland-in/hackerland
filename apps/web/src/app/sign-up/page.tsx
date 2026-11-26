import Link from 'next/link';
import { Sparkles, Cpu, Rocket } from 'lucide-react';
import { isAuthConfigured, getEnabledSocialProviders } from '@/lib/auth';
import { AuthForm } from '@/components/auth/auth-form';

export const metadata = {
  title: 'Join Hackerland | Hackerland',
  description: 'Create your account on the open-source innovation network.',
};

export default function SignUpPage() {
  const configured = isAuthConfigured();
  const providers = getEnabledSocialProviders();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-14rem)] max-w-lg flex-col justify-center px-4 py-10 space-y-6">
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft border border-accent/20 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
          <Sparkles className="size-3.5" aria-hidden="true" />
          <span>Claim Your Maker Handle</span>
        </div>
        <h1 className="font-display text-headline-xl font-bold tracking-tight text-fg">
          Join Hackerland
        </h1>
        <p className="text-body-md text-fg-muted">
          Form squads, ship open hardware &amp; software, and earn verified bounties together.
        </p>
      </div>

      <AuthForm mode="sign-up" configured={configured} providers={providers} />

      <div className="grid grid-cols-2 gap-3 text-body-xs">
        <Link
          href="/sprints"
          className="flex items-center gap-2 rounded-xl border border-hairline bg-surface-1 p-3 hover:border-accent/40 transition-colors"
        >
          <Rocket className="size-4 text-accent shrink-0" />
          <span className="font-medium text-fg-muted">Active Build Sprints</span>
        </Link>
        <Link
          href="/projects"
          className="flex items-center gap-2 rounded-xl border border-hairline bg-surface-1 p-3 hover:border-accent/40 transition-colors"
        >
          <Cpu className="size-4 text-accent shrink-0" />
          <span className="font-medium text-fg-muted">Featured Hardware Builds</span>
        </Link>
      </div>
    </div>
  );
}
