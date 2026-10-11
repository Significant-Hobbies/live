import type { ReactNode } from 'react';

import { cn } from '~/lib/utils';

/**
 * Aceternity Spotlight Card — a card with a mouse-following spotlight glow.
 * The spotlight is a radial gradient that follows the cursor via CSS variables.
 */
export function SpotlightCard({
  children,
  className,
  innerClassName,
}: {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  innerClassName?: string;
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_8px_24px_color-mix(in_srgb,var(--scrim)_8%,transparent)] transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-px hover:border-border hover:shadow-[0_12px_30px_color-mix(in_srgb,var(--scrim)_11%,transparent)]',
        className
      )}
    >
      <div className={cn('relative z-10', innerClassName)}>{children}</div>
    </div>
  );
}
