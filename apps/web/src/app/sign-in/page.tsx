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
    <div className="mx-auto flex min-h-[calc(100vh-16rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-display text-headline-xl text-fg">Welcome back</h1>
        <p className="mt-2 text-body-md text-fg-muted">Sign in to your Hackerland node</p>
      </div>
      <AuthForm mode="sign-in" configured={configured} providers={providers} />
    </div>
  );
}
