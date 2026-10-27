import { withPublicMetadata } from '~/lib/public-metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = withPublicMetadata({
  alternates: { canonical: 'https://live.significanthobbies.com/hobbies/random' },
});

export default function RandomHobbyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
