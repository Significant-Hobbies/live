'use client';

import { useEffect, useRef } from 'react';

import { saveTimezone } from '~/lib/actions/user';

interface TimezoneSyncProps {
  /** The zone currently stored for this user, or null if we've never captured one. */
  storedTimezone: string | null;
}

/**
 * Reports the browser's IANA timezone so the server can resolve `dayDate` keys
 * and the AM/PM split in the user's own day rather than UTC.
 *
 * Renders nothing. Only writes when the browser disagrees with what's stored,
 * so travelling users self-correct and everyone else costs zero requests.
 */
export function TimezoneSync({ storedTimezone }: TimezoneSyncProps) {
  const attempted = useRef<string | null>(null);

  useEffect(() => {
    const browserZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!browserZone) return;
    if (browserZone === storedTimezone) return;
    // Guard against a re-render loop if the write fails or revalidation lags.
    if (attempted.current === browserZone) return;
    attempted.current = browserZone;

    void saveTimezone(browserZone);
  }, [storedTimezone]);

  return null;
}
