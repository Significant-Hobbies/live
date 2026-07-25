import Link from 'next/link';
import { redirect } from 'next/navigation';

import {
  FadeIn,
  GradientMesh,
  GridBackground,
  SpotlightCard,
  TextGenerateEffect,
} from '~/components/aceternity';
import { guestRouteFor } from '~/lib/auth-routing';
import { getServerAuthSession } from '~/server/auth';

import { LoginForm } from './login-form';

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await getServerAuthSession();
  if (session?.user) redirect('/');
  const { callbackUrl: requestedCallback } = await searchParams;
  const callbackUrl =
    requestedCallback?.startsWith('/') && !requestedCallback.startsWith('//')
      ? requestedCallback
      : '/dashboard';
  // The guest link has to follow the same intent as the callback, or it strands
  // people: arriving from /daily used to offer the timeline builder.
  const guestRoute = guestRouteFor(callbackUrl);

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-12">
      <GradientMesh />
      <GridBackground />
      <FadeIn className="relative w-full max-w-sm">
        <SpotlightCard className="shadow-soft" innerClassName="p-6">
          <div className="mb-8">
            {/* `as="h1"` rather than an h1 wrapper — the effect rendered a div,
                so wrapping it nested a div inside a heading. */}
            <TextGenerateEffect
              as="h1"
              words="Sign in"
              className="text-xl font-semibold text-foreground"
            />
            <p className="mt-1.5 text-sm text-muted-foreground">
              Save your hobbies, bucket lists, and side quests. Pick up where you left off.
            </p>
          </div>

          <LoginForm callbackURL={callbackUrl} />

          <div className="mt-6 space-y-2.5">
            <p className="text-xs font-medium text-foreground">What you get</p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>· Track hobbies across every phase of your life</li>
              <li>· Build bucket lists you&apos;ll actually complete</li>
              <li>· Accept side quests — micro-adventures for the weekend</li>
            </ul>
          </div>

          <p className="mt-6 text-xs text-subtle">
            Or{' '}
            <Link
              href={guestRoute.href}
              className="text-foreground underline underline-offset-2 hover:opacity-70"
            >
              continue as guest
            </Link>{' '}
            — {guestRoute.label}
          </p>
        </SpotlightCard>
      </FadeIn>
    </div>
  );
}
