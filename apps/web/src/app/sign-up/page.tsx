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
    <div className="mx-auto flex min-h-[calc(100vh-16rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-display text-headline-xl text-fg">Join Hackerland</h1>
        <p className="mt-2 text-body-md text-fg-muted">
          Form squads, build open source, and earn together
        </p>
      </div>
      <AuthForm mode="sign-up" configured={configured} providers={providers} />
    </div>
  );
}
