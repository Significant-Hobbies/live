'use client';

import { Check, CircleSlash, X } from 'lucide-react';
import { useState, useTransition } from 'react';

import { Button } from '~/components/ui/button';
import { closeEra } from '~/lib/actions/trajectory';

interface CloseEraButtonProps {
  eraId: string;
  /** Bucket label, for the accessible description. */
  label: string;
}

/**
 * Closes the active era without authoring a replacement ideal, leaving the
 * bucket ideal-less until the user sets a new one.
 *
 * Setting a new ideal already closes the previous era, so this covers the other
 * half of the design: deciding an era is over *before* knowing what comes next.
 * The outcome is user-declared — the app never infers completed vs abandoned.
 */
export function CloseEraButton({ eraId, label }: CloseEraButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function close(outcome: 'completed' | 'abandoned') {
    setError(null);
    startTransition(async () => {
      const res = await closeEra({ eraId, outcome });
      if (!res.success) {
        setError(res.error ?? 'Could not close this era.');
        return;
      }
      setConfirming(false);
    });
  }

  if (!confirming) {
    return (
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setConfirming(true)}
        className="gap-1.5 text-muted-foreground hover:text-foreground"
        aria-label={`Close the current ${label} era`}
      >
        <CircleSlash className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only">Close era</span>
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">How did it end?</span>
        <Button
          size="xs"
          variant="ghost"
          disabled={pending}
          onClick={() => close('completed')}
          className="gap-1 text-muted-foreground hover:text-growth"
        >
          <Check className="h-3 w-3" />
          Reached it
        </Button>
        <Button
          size="xs"
          variant="ghost"
          disabled={pending}
          onClick={() => close('abandoned')}
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          Let it go
        </Button>
        <Button
          size="xs"
          variant="ghost"
          disabled={pending}
          onClick={() => {
            setConfirming(false);
            setError(null);
          }}
          aria-label="Cancel closing this era"
          className="text-muted-foreground/60 hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
