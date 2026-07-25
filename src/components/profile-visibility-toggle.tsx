'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useTransition } from 'react';

import { cn } from '~/lib/utils';

interface ProfileVisibilityToggleProps {
  isPublic: boolean;
  /** Runs the matching server action. Resolves once the write is done. */
  onChange: (isPublic: boolean) => Promise<{ success: boolean; error?: string }>;
  /** Describes the thing being toggled, for the accessible label. */
  label: string;
  className?: string;
}

/**
 * Owner-only control for opting one item in or out of the public profile.
 *
 * Commitments and completed quests are private by default, so without this the
 * owner has no way to publish them — and no way to tell what a visitor sees.
 */
export function ProfileVisibilityToggle({
  isPublic,
  onChange,
  label,
  className,
}: ProfileVisibilityToggleProps) {
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      await onChange(!isPublic);
    });
  }

  const Icon = isPublic ? Eye : EyeOff;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={isPublic}
      aria-label={
        isPublic
          ? `${label} is shown on your profile. Hide it.`
          : `${label} is hidden. Show it on your profile.`
      }
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50',
        isPublic
          ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20'
          : 'border-border/60 bg-transparent text-muted-foreground hover:text-foreground',
        pending && 'opacity-50',
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {isPublic ? 'Public' : 'Only you'}
    </button>
  );
}
