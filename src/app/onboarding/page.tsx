import { redirect } from 'next/navigation';

export const metadata = {
  robots: { index: false, follow: false },
};

export default function OnboardingPage() {
  redirect('/bucket-list');
}
