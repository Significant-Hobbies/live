import { withPublicMetadata } from '~/lib/public-metadata';
import type { Metadata } from 'next';

import CostCalculatorClient from './cost-calculator-client';

export const metadata: Metadata = withPublicMetadata({
  title: 'Hobby Cost Calculator — SignificantHobbies',
  description:
    'Add up the real first-year cost of any hobby — equipment, lessons, subscriptions, supplies — before you commit. Saves to your browser; nothing uploaded.',
  alternates: { canonical: 'https://live.significanthobbies.com/tools/cost-calculator' },
});

export default function CostCalculatorPage() {
  return <CostCalculatorClient />;
}
