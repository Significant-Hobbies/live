import Link from 'next/link';

import { GradientMesh } from '~/components/aceternity/gradient-mesh';
import { PreviewBanner } from '~/components/preview-banner';
import { TrajectoryPageClient } from '~/components/trajectory/trajectory-page-client';
import { birthDateFromYear, buildLifeGrid } from '~/lib/mortality';
import { previewTrajectoryState } from '~/lib/preview-data';
import { monthKeyFor } from '~/lib/trajectory';
import { getTrajectoryState, getUserBirthYear } from '~/lib/actions/trajectory';
import { getServerAuthSession } from '~/server/auth';

export const metadata = {
  title: 'Trajectory — SignificantHobbies',
  robots: { index: false, follow: false },
};

export default async function TrajectoryPage() {
  const session = await getServerAuthSession();
  const isPreview = !session?.user;

  // Signed out, show one stranger's sample year rather than a sign-in wall — the
  // surface is unreadable empty, and a visitor cannot judge a monthly review
  // practice they have never seen. Read-only: the write actions here throw
  // without a session, so no Save button may be offered.
  const [state, birthYear] = isPreview
    ? [previewTrajectoryState(monthKeyFor(new Date())), null]
    : await Promise.all([getTrajectoryState(), getUserBirthYear()]);

  // Mortality frame — same zoom-out grounding as /daily and /commitments.
  const birth = birthDateFromYear(birthYear);
  const weeksRemaining = birth ? buildLifeGrid(birth, new Set()).weeksRemaining : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14 space-y-10">
      {isPreview && (
        <PreviewBanner route="/trajectory">
          A sample year across the four areas, so you can see how a monthly review reads before you
          sign up. Nothing here is yours and nothing is saved.
        </PreviewBanner>
      )}
      <header className="relative overflow-hidden rounded-2xl border border-border/50 p-6 sm:p-8">
        <GradientMesh variant="gold" />
        <div className="relative">
          <p className="text-xs font-medium text-subtle">Monthly life-review</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Trajectory
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Direction, not destinations. Four areas of life, each with an ideal you wrote yourself,
            revisited once a month. No score — the gap is the whole point. For the specific things
            you want to have done, use your{' '}
            <Link
              href="/bucket-list"
              className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary"
            >
              bucket list
            </Link>
            .
          </p>
          {weeksRemaining !== null && (
            <p className="mt-4 text-xs text-subtle">
              <span className="font-serif font-medium tabular-nums text-foreground/90">
                {weeksRemaining.toLocaleString()}
              </span>{' '}
              weeks left in the life grid.
            </p>
          )}
        </div>
      </header>

      <TrajectoryPageClient state={state} readOnly={isPreview} />
    </div>
  );
}
