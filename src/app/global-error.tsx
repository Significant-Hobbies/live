'use client';

import { useEffect } from 'react';

import { captureError } from '@/lib/foundry-monitoring';

/**
 * Catches failures in the root layout itself (where `error.tsx` cannot run).
 * It must render its own <html>/<body> and cannot rely on app styles.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    captureError(error, { scope: 'global', digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          colorScheme: 'dark',
          background: '#120e09',
          color: '#f7f3e9',
          padding: '2rem',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#b7b0a3', marginBottom: 24 }}>
            The app failed to load. Please reload the page — if it keeps happening, try again in a
            few minutes.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 12,
              border: '1px solid #3b342a',
              background: '#e7bf57',
              color: '#1d1409',
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
          {error.digest ? (
            <p style={{ marginTop: 24, fontSize: '0.75rem', color: '#aaa293' }}>
              Reference: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
