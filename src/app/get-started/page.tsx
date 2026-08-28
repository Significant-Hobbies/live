import type { Metadata } from 'next';

import { GetStartedClient } from './get-started-client';

export const metadata: Metadata = {
  title: 'Get Your Username — SignificantHobbies',
  description:
    'Choose your unique username on SignificantHobbies. Get your own profile at live.significanthobbies.com/u/yourname and start sharing your hobby journey.',
  alternates: { canonical: 'https://live.significanthobbies.com/get-started' },
};

export default function GetStartedPage() {
  return <GetStartedClient />;
}
