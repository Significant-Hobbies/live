'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * Focused flows own their own minimal chrome. Keeping the global navigation,
 * feedback widget, and full sitemap footer around onboarding made each short
 * question feel like a section on a marketing page rather than one continuous
 * setup task.
 */
export function RouteChrome({
  children,
  navigation,
  footer,
  feedback,
}: {
  children: ReactNode;
  navigation: ReactNode;
  footer: ReactNode;
  feedback: ReactNode;
}) {
  const pathname = usePathname();
  const isOnboarding = pathname === '/setup';
  const isQuestionnaire = pathname === '/find-your-hobby';
  const hidesPeripheralChrome = isOnboarding || isQuestionnaire;

  return (
    <>
      {!isOnboarding && navigation}
      <main id="main">{children}</main>
      {!hidesPeripheralChrome && footer}
      {!hidesPeripheralChrome && feedback}
    </>
  );
}
