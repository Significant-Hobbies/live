import type { Metadata } from 'next';

import { LifeInWeeksClient } from './life-in-weeks-client';

export const metadata: Metadata = {
  title: 'Your Life in Weeks — SignificantHobbies',
  description:
    'See your whole life as one grid of weeks, from a single number. No account, nothing saved to a server. Then decide what the remaining ones are for.',
  alternates: { canonical: '/life-in-weeks' },
  openGraph: {
    title: 'Your Life in Weeks',
    description:
      'One square for every week of an average life. It takes one number to draw, and nobody needs to know you were here.',
    url: '/life-in-weeks',
    type: 'website',
  },
};

export default function LifeInWeeksPage() {
  return <LifeInWeeksClient />;
}
