'use client';

import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

import { isSafeProofUrl, type StampRow } from '~/lib/commitments';

interface Props {
  stamps: StampRow[];
  goalDays: number;
}

/**
 * The stamps themselves — dates, notes, and the proof each one carries.
 *
 * `Stamp.proofUrl`, `proofType` and `note` were written on every stamp and
 * rendered nowhere. The log form asks outright for "Proof link (YouTube, photo,
 * anything)", the card showed only current/longest/total counts, and the
 * completion copy claimed "the stamps live on your profile" — which nothing made
 * true. A commitment whose whole premise is evidence collected it and never
 * showed it back.
 *
 * Collapsed by default: a 30-day commitment is 30 rows, and the card's job is
 * still the streak at a glance.
 */
export function StampRail({ stamps, goalDays }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (stamps.length === 0) return null;

  // Newest first — the most recent proof is the one you want to see.
  const ordered = [...stamps].sort((a, b) => b.dayDate.localeCompare(a.dayDate));
  const visible = expanded ? ordered : ordered.slice(0, 3);

  return (
    <div className="mt-3 border-t border-border/60 pt-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-subtle">
          The evidence
        </p>
        {ordered.length > 3 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded px-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
            aria-expanded={expanded}
          >
            {expanded ? 'Show fewer' : `All ${ordered.length} of ${goalDays}`}
          </button>
        )}
      </div>

      <ul className="mt-2 space-y-1.5">
        {visible.map((s) => (
          <li key={s.dayDate} className="flex items-baseline gap-2.5 text-xs">
            <span className="shrink-0 tabular-nums text-subtle">{formatStampDate(s.dayDate)}</span>
            <span className="min-w-0 flex-1">
              {/* Only ever an href when the scheme is http(s). normalizeProofUrl
                  stores non-URL input verbatim, so this value can be arbitrary
                  text — including a javascript: URI. */}
              {isSafeProofUrl(s.proofUrl) ? (
                <a
                  href={s.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-baseline gap-1 text-foreground underline decoration-border underline-offset-2 transition-colors hover:decoration-primary"
                >
                  <span className="truncate">{proofLabel(s.proofUrl)}</span>
                  <ExternalLink className="h-2.5 w-2.5 shrink-0 self-center" aria-hidden />
                </a>
              ) : (
                <span className="text-foreground/80">{s.proofUrl}</span>
              )}
              {s.note && <span className="ml-1.5 text-muted-foreground">— {s.note}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatStampDate(dayDate: string): string {
  const [y, m, d] = dayDate.split('-').map(Number);
  if (!y || !m || !d) return dayDate;
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
    new Date(y, m - 1, d, 12)
  );
}

/** Host name reads better than a 2000-character URL. */
function proofLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
