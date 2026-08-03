import { getServerAuthSession } from '~/server/auth';
import { getOnboardingPossibilities } from '~/lib/onboarding-possibilities';

import { OnboardingFlow } from './onboarding-flow';

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function OnboardingPage() {
  const session = await getServerAuthSession();
  const possibilities = getOnboardingPossibilities();
  return (
    <OnboardingFlow
      user={{ name: session?.user?.name, image: session?.user?.image }}
      storageMode={session?.user ? 'account' : 'local'}
      possibilities={possibilities}
    />
  );
}
