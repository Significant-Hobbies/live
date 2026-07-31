'use client';

import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';

interface ProfileShareButtonProps {
  username: string;
  displayName: string;
}

/**
 * Share affordance for a public profile.
 *
 * The landing page sells "Share your identity card", and timeline pages already
 * have a full share bar — but the profile itself had no way to share it at all.
 * Uses the native share sheet where available (mobile), falling back to copying
 * the link.
 */
export function ProfileShareButton({ username, displayName }: ProfileShareButtonProps) {
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    } catch {
      toast.error("Couldn't copy the link — copy it from the address bar.");
    }
  }

  async function handleShare() {
    if (typeof navigator.share !== 'function') {
      await copyLink();
      return;
    }
    try {
      await navigator.share({
        title: `${displayName} on SignificantHobbies`,
        text: `See @${username}'s hobby journey.`,
        url: window.location.href,
      });
    } catch (err) {
      // A user-cancelled share sheet rejects with AbortError — not an error.
      if (err instanceof Error && err.name === 'AbortError') return;
      await copyLink();
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleShare}
      className="min-h-11 gap-1.5"
      aria-label={`Share @${username}'s profile`}
    >
      <Share2 className="h-3.5 w-3.5" />
      Share
    </Button>
  );
}
